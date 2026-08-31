import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Calendar, Check, ArrowRight, Loader2, Heart, Shield, RefreshCw, AlertCircle, QrCode, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';
import { SurpriseData } from '../types';
import { loadRazorpayScript } from '../utils/razorpay';

interface PricingPaymentProps {
  surprise: SurpriseData;
  onPaymentSuccess: (shareToken: string) => void;
  onBack: () => void;
  onUpdateUnlockAt?: (iso: string) => void;
}

type PaymentStatusState = 'idle' | 'loading' | 'verifying' | 'cancelled' | 'failed' | 'verification_pending';

export const PricingPayment: React.FC<PricingPaymentProps> = ({
  surprise,
  onPaymentSuccess,
  onBack,
  onUpdateUnlockAt
}) => {
  // Step 10 Animation: Soft initial pause with "You just created something they'll remember. ❤️"
  const [phase, setPhase] = useState<'intro' | 'card'>('intro');
  const [paymentState, setPaymentState] = useState<PaymentStatusState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Test modal state (if Razorpay key is not configured in environment or offline preview)
  const [showTestModal, setShowTestModal] = useState(false);
  const [testMethod, setTestMethod] = useState<'upi_intent' | 'upi_qr' | 'card' | 'netbanking' | 'wallet'>('upi_intent');
  const [currentOrderData, setCurrentOrderData] = useState<any>(null);

  // Date edit modal/expand
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (surprise.unlock_at) {
      return surprise.unlock_at.split('T')[0];
    }
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('00:00');

  // Automatic soft transition after 1.8 seconds if user doesn't click immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('card');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Format the scheduled unlock display string (e.g., September 15 · 12:00 AM)
  const formatScheduledDisplay = (isoStr?: string) => {
    if (!isoStr) return 'Midnight · 12:00 AM';
    try {
      const dateObj = new Date(isoStr);
      const month = dateObj.toLocaleDateString(undefined, { month: 'long' });
      const day = dateObj.toLocaleDateString(undefined, { day: 'numeric' });
      
      const hours = dateObj.getHours();
      const mins = dateObj.getMinutes();
      const isMidnight = hours === 0 && mins === 0;
      
      let timeStr = '12:00 AM';
      if (!isMidnight) {
        timeStr = dateObj.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
      return `${month} ${day} · ${timeStr}`;
    } catch {
      return 'September 15 · 12:00 AM';
    }
  };

  const handleSaveSchedule = () => {
    const targetIso = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
    if (onUpdateUnlockAt) {
      onUpdateUnlockAt(targetIso);
    }
    setIsEditingSchedule(false);
  };

  // Perform server-side payment verification
  const verifyPaymentOnServer = async (payload: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    paymentId?: string;
    orderId?: string;
  }) => {
    setPaymentState('verifying');
    setErrorMsg(null);

    try {
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surprise_id: surprise.id,
          surprise_data: surprise,
          ...payload
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success && verifyData.share_token) {
        onPaymentSuccess(verifyData.share_token);
      } else {
        console.error('Server verification error:', verifyData);
        setPaymentState('verification_pending');
      }
    } catch (err: any) {
      console.error('Network error during verification:', err);
      setPaymentState('verification_pending');
    }
  };

  const handleCheckout = async () => {
    setPaymentState('loading');
    setErrorMsg(null);

    try {
      // 1. Create order on server for ₹69 (6900 paise)
      const createRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surprise_id: surprise.id,
          surprise_data: surprise,
          amount: 69
        })
      });

      if (!createRes.ok) {
        throw new Error("Payment couldn't be started. Please try again.");
      }

      const orderData = await createRes.json();
      setCurrentOrderData(orderData);

      // 2. Check if Razorpay Key is provided and load Razorpay Checkout SDK
      const hasRealKey = Boolean(orderData.key_id && orderData.key_id.trim().length > 0);
      const isScriptLoaded = await loadRazorpayScript();

      if (hasRealKey && isScriptLoaded && (window as any).Razorpay) {
        // Standard Razorpay Web Checkout Integration
        const options: any = {
          key: orderData.key_id,
          amount: orderData.amount || 6900,
          currency: orderData.currency || 'INR',
          name: 'FIRST WISH',
          description: `Birthday Surprise for ${surprise.partner_name || 'Special Person'}`,
          order_id: orderData.order_id,
          prefill: {
            name: surprise.sender_name || 'Sender',
          },
          notes: {
            surprise_id: surprise.id,
            partner_name: surprise.partner_name || '',
          },
          theme: {
            color: '#2D2825'
          },
          handler: async (response: any) => {
            await verifyPaymentOnServer({
              razorpay_order_id: response.razorpay_order_id || orderData.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
          },
          modal: {
            ondismiss: () => {
              setPaymentState('cancelled');
            },
            escape: true,
            backdropclose: false
          }
        };

        const rzp = new (window as any).Razorpay(options);
        
        rzp.on('payment.failed', (response: any) => {
          console.error('Razorpay payment failed:', response.error);
          setPaymentState('failed');
          setErrorMsg(response.error?.description || "Payment couldn't be started. Please try again.");
        });

        rzp.open();
      } else {
        // Test Mode Selection Screen (Provides interactive UPI Intent, Cards, Netbanking selection for test environment)
        setShowTestModal(true);
        setPaymentState('idle');
      }
    } catch (err: any) {
      console.error('Checkout initialization failed:', err);
      setPaymentState('failed');
      setErrorMsg("Payment couldn't be started. Please try again.");
    }
  };

  const handleCompleteTestPayment = async () => {
    setShowTestModal(false);
    const mockPaymentId = 'pay_test_' + Math.random().toString(36).substring(2, 12);
    const orderId = currentOrderData?.order_id || 'order_test_' + Date.now();
    await verifyPaymentOnServer({
      paymentId: mockPaymentId,
      orderId: orderId,
      razorpay_payment_id: mockPaymentId,
      razorpay_order_id: orderId,
      razorpay_signature: 'sig_test_verified'
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="section-payment-final">
      <AnimatePresence mode="wait">
        {/* Phase 1: Soft emotional moment */}
        {phase === 'intro' ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setPhase('card')}
            className="py-16 sm:py-24 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-center text-[#333333] mx-auto mb-6 shadow-sm">
              <Heart className="w-7 h-7 fill-gray-300 stroke-[#333333]" />
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight max-w-sm mx-auto leading-snug mb-4">
              You just created something they'll remember. ❤️
            </h2>
            
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              Tap anywhere to continue →
            </p>
          </motion.div>
        ) : (
          /* Phase 2: Refined Minimal Payment Card */
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* Failure State Notification */}
            {paymentState === 'failed' && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">
                      Payment couldn't be started. Please try again.
                    </p>
                    {errorMsg && errorMsg !== "Payment couldn't be started. Please try again." && (
                      <p className="text-xs text-amber-700 mt-1">{errorMsg}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="mt-3 px-4 py-1.5 bg-amber-900 hover:bg-black text-white text-xs font-medium rounded-full cursor-pointer transition-colors inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Try Again</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled State Notification */}
            {paymentState === 'cancelled' && (
              <div className="mb-6 p-4 rounded-2xl bg-[#FAF8F5] border border-gray-200 text-left">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#2D2825]">
                      Payment cancelled. Your surprise is still saved.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      You can complete the payment whenever you're ready.
                    </p>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="mt-3 px-4 py-1.5 bg-[#2D2825] hover:bg-black text-white text-xs font-medium rounded-full cursor-pointer transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Try Payment Again</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Pending State */}
            {paymentState === 'verification_pending' && (
              <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-left">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      We're confirming your payment. Please refresh in a moment.
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Server verification is in progress. Your surprise is secure.
                    </p>
                    <button
                      type="button"
                      onClick={() => verifyPaymentOnServer({ surprise_id: surprise.id } as any)}
                      className="mt-3 px-4 py-1.5 bg-blue-900 hover:bg-black text-white text-xs font-medium rounded-full cursor-pointer transition-colors inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Check Status Again</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Centered Minimalist Card */}
            <div className="p-7 sm:p-9 rounded-[32px] bg-white border border-gray-200 shadow-sm text-center mb-8">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-2">
                Ready to send it? ❤️
              </h2>
              
              <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
                Everything is ready.
              </p>

              {/* Scheduled Unlock Time Section */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-200 mb-6 text-center">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-1">
                  Your surprise will unlock
                </span>
                
                <div className="font-serif text-lg sm:text-xl text-[#333333] font-normal flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{formatScheduledDisplay(surprise.unlock_at)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingSchedule(!isEditingSchedule)}
                  className="mt-2 text-xs font-semibold text-gray-600 hover:text-black hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isEditingSchedule ? 'Close' : 'Edit scheduled date / time'}</span>
                </button>

                {/* Inline schedule editing form */}
                {isEditingSchedule && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-3 border-t border-gray-200 text-left space-y-3"
                  >
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-1">
                        Birthday Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl outline-none text-[#333333]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-1">
                        Unlock Time
                      </label>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl outline-none text-[#333333]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveSchedule}
                      className="w-full py-2 bg-[#333333] text-white hover:bg-black rounded-xl text-xs font-medium cursor-pointer"
                    >
                      Update Unlock Time
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Price Tag */}
              <div className="my-6">
                <div className="font-serif text-5xl sm:text-6xl font-light text-[#333333] tracking-tight">
                  ₹69
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Pay once. No subscription.
                </div>
              </div>

              {/* Primary Payment Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={paymentState === 'loading' || paymentState === 'verifying'}
                className="w-full py-4 px-6 bg-[#2D2825] hover:bg-black text-white disabled:opacity-50 rounded-full text-base font-medium transition-all shadow-sm flex items-center justify-center gap-2 mb-4 cursor-pointer active:scale-[0.99]"
                id="btn-get-private-link"
              >
                {paymentState === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Opening Razorpay Checkout...</span>
                  </>
                ) : paymentState === 'verifying' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying payment...</span>
                  </>
                ) : (
                  <>
                    <span>Get My Private Link — ₹69</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Clear Explanation & Text requirements */}
              <p className="text-xs text-gray-500 leading-relaxed mb-2 max-w-sm mx-auto">
                After payment, we'll give you a private link you can send directly to your partner.
              </p>

              <span className="text-[11px] text-gray-400 block font-medium">
                Pay ₹69 once. No subscription.
              </span>

              {/* 3-Step Visual Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-gray-100">
                <div className="text-center p-2 rounded-2xl bg-[#FAF8F5]">
                  <span className="text-[10px] font-mono font-semibold text-gray-400 block mb-0.5">01</span>
                  <span className="text-xs font-medium text-[#333333] block">Pay ₹69</span>
                </div>
                <div className="text-center p-2 rounded-2xl bg-[#FAF8F5]">
                  <span className="text-[10px] font-mono font-semibold text-gray-400 block mb-0.5">02</span>
                  <span className="text-xs font-medium text-[#333333] block">Get private link</span>
                </div>
                <div className="text-center p-2 rounded-2xl bg-[#FAF8F5]">
                  <span className="text-[10px] font-mono font-semibold text-gray-400 block mb-0.5">03</span>
                  <span className="text-xs font-medium text-[#333333] block">Send it to them ❤️</span>
                </div>
              </div>
            </div>

            {/* Back button */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={onBack}
                disabled={paymentState === 'loading' || paymentState === 'verifying'}
                className="px-5 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Preview</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Razorpay Test Mode Selection Modal (Shown in test mode / sandbox preview) */}
      <AnimatePresence>
        {showTestModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-md rounded-[28px] p-6 shadow-xl border border-gray-200 text-left overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold">
                    Razorpay Checkout • Test Mode
                  </span>
                  <h3 className="font-serif text-xl text-[#2D2825] font-normal mt-1.5">
                    Select Payment Method
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Amount</span>
                  <span className="text-xl font-serif text-[#2D2825] font-medium">₹69</span>
                </div>
              </div>

              {/* Payment Methods List */}
              <div className="py-4 space-y-2">
                <label
                  onClick={() => setTestMethod('upi_intent')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    testMethod === 'upi_intent'
                      ? 'border-[#2D2825] bg-[#FAF8F5]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#2D2825]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-[#2D2825] block">
                      UPI (Google Pay, PhonePe, Paytm)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Fast UPI Intent & App selection
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${testMethod === 'upi_intent' ? 'border-[#2D2825] bg-[#2D2825]' : 'border-gray-300'}`}>
                    {testMethod === 'upi_intent' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </label>

                <label
                  onClick={() => setTestMethod('upi_qr')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    testMethod === 'upi_qr'
                      ? 'border-[#2D2825] bg-[#FAF8F5]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#2D2825]">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-[#2D2825] block">
                      UPI QR Code
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Scan QR with any UPI application
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${testMethod === 'upi_qr' ? 'border-[#2D2825] bg-[#2D2825]' : 'border-gray-300'}`}>
                    {testMethod === 'upi_qr' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </label>

                <label
                  onClick={() => setTestMethod('card')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    testMethod === 'card'
                      ? 'border-[#2D2825] bg-[#FAF8F5]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#2D2825]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-[#2D2825] block">
                      Cards (Debit / Credit)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Visa, MasterCard, RuPay
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${testMethod === 'card' ? 'border-[#2D2825] bg-[#2D2825]' : 'border-gray-300'}`}>
                    {testMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </label>

                <label
                  onClick={() => setTestMethod('netbanking')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    testMethod === 'netbanking'
                      ? 'border-[#2D2825] bg-[#FAF8F5]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#2D2825]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-[#2D2825] block">
                      Net Banking
                    </span>
                    <span className="text-[11px] text-gray-500">
                      HDFC, ICICI, SBI, Axis & more
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${testMethod === 'netbanking' ? 'border-[#2D2825] bg-[#2D2825]' : 'border-gray-300'}`}>
                    {testMethod === 'netbanking' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTestModal(false);
                    setPaymentState('cancelled');
                  }}
                  className="flex-1 py-3 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompleteTestPayment}
                  className="flex-1 py-3 bg-[#2D2825] hover:bg-black text-white text-xs font-medium rounded-full shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Pay ₹69 (Test)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
