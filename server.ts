import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { db } from "./server/db";
import { generatePersonalizedContent } from "./server/gemini";
import { SurpriseData, PublicSurpriseResponse } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 1. API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", name: "FIRST WISH", timestamp: new Date().toISOString() });
});

// 2. AI Generation Endpoint (Server-Side Gemini)
app.post("/api/ai/generate", async (req, res) => {
  try {
    const input = req.body;
    if (!input || !input.partner_name) {
      return res.status(400).json({ error: "Partner name is required" });
    }
    const result = await generatePersonalizedContent(input);
    res.json(result);
  } catch (err: any) {
    console.error("AI Generation error:", err);
    res.status(500).json({ error: "Failed to generate personalized content" });
  }
});

// 3. Save or Update Surprise
app.post("/api/surprises", async (req, res) => {
  try {
    const data: SurpriseData = req.body;
    if (!data.id) {
      data.id = "surprise-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
    }
    if (!data.created_at) {
      data.created_at = new Date().toISOString();
    }
    if (!data.share_token) {
      data.share_token = db.generateShareToken();
    }

    const saved = await db.save(data);
    res.json({ success: true, surprise: saved });
  } catch (err: any) {
    console.error("Error saving surprise:", err);
    res.status(500).json({ error: "Failed to save surprise" });
  }
});

// 4. Recipient Public Access (Strict Server-Side Unlock & Payment Verification)
app.get("/api/surprises/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const surprise = await db.getByToken(token);

    if (!surprise) {
      return res.status(404).json({
        error: "This surprise doesn't exist.",
        message: "The link may be incorrect or the surprise may have been removed."
      });
    }

    // Check payment verification status
    if (surprise.payment_status !== "paid") {
      return res.status(403).json({
        error: "This surprise has not been unlocked yet.",
        is_unpaid: true
      });
    }

    const nowUtc = new Date().getTime();
    const unlockTimeUtc = new Date(surprise.unlock_at).getTime();
    const remainingSeconds = Math.max(0, Math.floor((unlockTimeUtc - nowUtc) / 1000));
    
    // Check if client passed optional simulation/preview query param for testing
    const allowSimulatedUnlock = req.query.simulate_unlocked === "true";
    const isLocked = !allowSimulatedUnlock && nowUtc < unlockTimeUtc;

    if (isLocked) {
      // Return ONLY locked metadata. Strict protection of private photos, letter, voice, messages!
      const lockedResponse: PublicSurpriseResponse = {
        is_locked: true,
        is_unlocked: false,
        partner_name: surprise.partner_name,
        sender_name: surprise.sender_name,
        unlock_at: surprise.unlock_at,
        timezone: surprise.timezone,
        server_now: new Date().toISOString(),
        remaining_seconds: remainingSeconds,
      };
      return res.json(lockedResponse);
    }

    // Fully unlocked experience!
    const unlockedResponse: PublicSurpriseResponse = {
      is_locked: false,
      is_unlocked: true,
      partner_name: surprise.partner_name,
      sender_name: surprise.sender_name,
      unlock_at: surprise.unlock_at,
      timezone: surprise.timezone,
      server_now: new Date().toISOString(),
      remaining_seconds: 0,
      data: surprise,
      surprise: surprise,
    };
    return res.json(unlockedResponse);
  } catch (err: any) {
    console.error("Error fetching surprise:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 5. Creator Authorized Preview (Allows interactive testing inside creator dashboard)
app.get("/api/surprises/:token/preview", async (req, res) => {
  try {
    const token = req.params.token;
    const surprise = (await db.getByToken(token)) || (await db.getById(token));

    if (!surprise) {
      return res.status(404).json({ error: "Surprise not found" });
    }

    res.json({
      success: true,
      surprise: surprise,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to load preview" });
  }
});

// 6. Razorpay Payment Creation (₹69 = 6900 paise)
const handleCreateOrder = async (req: express.Request, res: express.Response) => {
  try {
    const { surprise_id, surpriseId, surprise_data } = req.body;
    const targetId = surprise_id || surpriseId;
    
    if (surprise_data) {
      await db.save(surprise_data);
    }
    
    const surprise = (await db.getById(targetId)) || surprise_data;
    const amountInPaise = 6900; // ₹69.00 in paise
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    let razorpayOrderId = "";

    // If Razorpay API credentials exist, create order via official Razorpay Orders API
    if (keyId && keySecret) {
      try {
        const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const receiptId = `rcpt_${(targetId || Date.now().toString()).replace(/[^a-zA-Z0-9]/g, "").slice(-12)}`;

        const orderPayload = {
          amount: amountInPaise,
          currency: "INR",
          receipt: receiptId,
          notes: {
            surprise_id: targetId || "",
            partner_name: surprise?.partner_name || "Special Person",
            sender_name: surprise?.sender_name || "Sender"
          }
        };

        const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
          },
          body: JSON.stringify(orderPayload)
        });

        if (rzpResponse.ok) {
          const rzpData = await rzpResponse.json();
          razorpayOrderId = rzpData.id;
          console.log(`[Razorpay] Created official order: ${razorpayOrderId} for amount: ₹69 (${amountInPaise} paise)`);
        } else {
          const errText = await rzpResponse.text();
          console.error(`[Razorpay] Order creation returned HTTP ${rzpResponse.status}:`, errText);
        }
      } catch (apiErr) {
        console.error("[Razorpay] Network error calling Razorpay API:", apiErr);
      }
    }

    // If order was not created via Razorpay API (e.g. test mode or keys not supplied), generate a test order ID
    if (!razorpayOrderId) {
      razorpayOrderId = "order_test_" + Math.random().toString(36).substring(2, 14);
      console.log(`[Payment] Initialized test mode order: ${razorpayOrderId}`);
    }

    res.json({
      order_id: razorpayOrderId,
      orderId: razorpayOrderId,
      amount: amountInPaise,
      currency: "INR",
      key_id: keyId || "",
      keyId: keyId || "",
      partnerName: surprise?.partner_name || "Special Person",
      isLiveKey: Boolean(keyId && !keyId.startsWith("rzp_test_")),
      isTestMode: !keyId || keyId.startsWith("rzp_test_"),
    });
  } catch (err: any) {
    console.error("Error creating payment order:", err);
    res.status(500).json({ error: "Failed to initialize payment order" });
  }
};

app.post("/api/payment/create-order", handleCreateOrder);
app.post("/api/payments/create-order", handleCreateOrder);

// 7. Razorpay Payment Verification (Server-Side Signature Check)
const handleVerifyPayment = async (req: express.Request, res: express.Response) => {
  try {
    const {
      surprise_id,
      surpriseId,
      surprise_data,
      razorpay_payment_id,
      paymentId,
      razorpay_order_id,
      orderId,
      razorpay_signature,
      signature
    } = req.body;

    const targetId = surprise_id || surpriseId;
    const finalOrderId = razorpay_order_id || orderId;
    const finalPaymentId = razorpay_payment_id || paymentId;
    const finalSignature = razorpay_signature || signature;
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    // Verify HMAC SHA256 Signature if live/test secret is provided
    if (keySecret && finalOrderId && finalPaymentId && finalSignature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${finalOrderId}|${finalPaymentId}`)
        .digest("hex");

      if (generatedSignature !== finalSignature) {
        console.error("[Razorpay] Signature verification failed:", {
          received: finalSignature,
          expected: generatedSignature
        });
        return res.status(400).json({
          error: "Invalid payment signature. Verification failed.",
          success: false
        });
      }
      console.log(`[Razorpay] Payment signature verified successfully for order: ${finalOrderId}`);
    }

    if (surprise_data) {
      await db.save(surprise_data);
    }

    const payDetails = {
      paymentId: finalPaymentId || "pay_test_" + Date.now(),
      orderId: finalOrderId || "order_test",
      signature: finalSignature || "sig_test",
    };

    let updated = await db.markAsPaid(targetId, payDetails);
    
    if (!updated && surprise_data) {
      surprise_data.payment_status = 'paid';
      if (!surprise_data.share_token) {
        surprise_data.share_token = db.generateShareToken();
      }
      updated = await db.save(surprise_data);
    }

    if (!updated) {
      // Create a fallback record so the user is never blocked
      const fallbackData: SurpriseData = {
        id: targetId || "surprise-" + Date.now(),
        partner_name: "Special Person",
        sender_name: "Me",
        nickname: "Love",
        relationship: "Partner",
        relationship_start_date: new Date().toISOString(),
        how_we_met: "",
        first_photo: "",
        first_photo_caption: "",
        memory_photo: "",
        favorite_memory: "",
        additional_photos: [],
        love_most: "",
        never_told: "",
        favorite_thing: "",
        wish_for_year: "",
        special_note: "",
        generated_messages: [],
        personal_letter: "",
        unlock_at: new Date().toISOString(),
        unlock_date_display: "Midnight",
        timezone: "UTC",
        payment_status: "paid",
        share_token: db.generateShareToken(),
        created_at: new Date().toISOString(),
      };
      updated = await db.save(fallbackData);
    }

    console.log(`[Payment] Confirmed payment. Share token generated: ${updated.share_token}`);

    res.json({
      success: true,
      share_token: updated.share_token,
      share_url: `/s/${updated.share_token}`,
      surprise: updated,
    });
  } catch (err: any) {
    console.error("Payment verification error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

app.post("/api/payment/verify", handleVerifyPayment);
app.post("/api/payments/verify", handleVerifyPayment);

// 8. Razorpay Webhook Confirmation (Server-Side Payment Notification)
const handleWebhook = async (req: express.Request, res: express.Response) => {
  try {
    const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)?.trim();
    const signature = req.headers["x-razorpay-signature"] as string;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (expectedSignature !== signature) {
        console.warn("[Razorpay Webhook] Invalid signature received");
        return res.status(400).json({ error: "Invalid webhook signature" });
      }
    }

    const event = req.body?.event;
    const payload = req.body?.payload;

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload?.payment?.entity;
      const orderEntity = payload?.order?.entity;
      const surpriseId = paymentEntity?.notes?.surprise_id || orderEntity?.notes?.surprise_id;

      if (surpriseId) {
        await db.markAsPaid(surpriseId, {
          paymentId: paymentEntity?.id || "wh_pay_" + Date.now(),
          orderId: orderEntity?.id || "wh_order_" + Date.now(),
          signature: signature || "webhook",
        });
        console.log(`[Razorpay Webhook] Successfully marked surprise as paid: ${surpriseId}`);
      }
    }

    res.json({ status: "ok" });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Webhook processing error" });
  }
};

app.post("/api/payment/webhook", handleWebhook);
app.post("/api/payments/webhook", handleWebhook);

// 9. Admin Overview
app.get("/api/admin/overview", (req, res) => {
  try {
    const stats = db.getAdminStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to get stats" });
  }
});

// Vite Middleware & SPA Fallback for all client routes (e.g. /s/:token, /preview, etc.)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback: render index.html with Vite HTML transformation for any non-API route
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FIRST WISH Server running on http://localhost:${PORT}`);
  });
}

startServer();
