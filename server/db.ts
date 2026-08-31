import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SurpriseData } from '../src/types';
import { SAMPLE_SURPRISE_SARAH, SAMPLE_SURPRISE_MAYA } from '../src/data/sampleSurprises';

class DatabaseManager {
  private surprises: Map<string, SurpriseData> = new Map();
  private tokenIndex: Map<string, string> = new Map(); // token -> surpriseId
  private supabase: SupabaseClient | null = null;
  private isSupabaseConfigured = false;

  constructor() {
    this.initSupabase();
    this.seed();
  }

  private initSupabase() {
    const url = process.env.SUPABASE_URL?.trim();
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)?.trim();

    if (url && key) {
      try {
        this.supabase = createClient(url, key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          }
        });
        this.isSupabaseConfigured = true;
        console.log('[Database] Supabase client initialized successfully.');
      } catch (err) {
        console.error('[Database] Failed to initialize Supabase client:', err);
      }
    } else {
      console.log('[Database] Supabase credentials not set, using durable in-memory registry.');
    }
  }

  private seed() {
    this.saveLocal(SAMPLE_SURPRISE_SARAH);
    this.saveLocal(SAMPLE_SURPRISE_MAYA);
  }

  private saveLocal(surprise: SurpriseData): SurpriseData {
    this.surprises.set(surprise.id, surprise);
    if (surprise.share_token) {
      this.tokenIndex.set(surprise.share_token, surprise.id);
    }
    return surprise;
  }

  /**
   * Generates a cryptographically random, collision-resistant token (e.g., 7Hk92Lm)
   */
  public generateShareToken(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let token = '';
    const bytes = crypto.randomBytes(7);
    for (let i = 0; i < 7; i++) {
      token += chars[bytes[i] % chars.length];
    }
    // Ensure uniqueness across local index
    if (this.tokenIndex.has(token)) {
      return this.generateShareToken();
    }
    return token;
  }

  /**
   * Saves or updates a surprise record across Supabase and in-memory cache
   */
  public async save(surprise: SurpriseData): Promise<SurpriseData> {
    if (!surprise.share_token) {
      surprise.share_token = this.generateShareToken();
    }

    // Always update local memory cache first for instant synchronous reads
    this.saveLocal(surprise);

    // If Supabase is configured, upsert into 'surprises' table
    if (this.supabase) {
      try {
        const { error } = await this.supabase
          .from('surprises')
          .upsert({
            id: surprise.id,
            share_token: surprise.share_token,
            payment_status: surprise.payment_status || 'pending',
            unlock_at: surprise.unlock_at,
            timezone: surprise.timezone || 'UTC',
            partner_name: surprise.partner_name,
            sender_name: surprise.sender_name,
            nickname: surprise.nickname,
            data: surprise, // full JSON blob
            created_at: surprise.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          console.warn('[Database] Supabase upsert error:', error.message);
        } else {
          console.log(`[Database] Persisted surprise ${surprise.id} (token: ${surprise.share_token}) to Supabase.`);
        }
      } catch (err: any) {
        console.warn('[Database] Exception writing to Supabase:', err?.message || err);
      }
    }

    return surprise;
  }

  /**
   * Retrieves a surprise by internal ID
   */
  public async getById(id: string): Promise<SurpriseData | undefined> {
    const local = this.surprises.get(id);
    if (local) return local;

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('surprises')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (data && !error) {
          const surprise: SurpriseData = data.data || data;
          this.saveLocal(surprise);
          return surprise;
        }
      } catch (err: any) {
        console.warn('[Database] Error querying Supabase by ID:', err?.message || err);
      }
    }

    return undefined;
  }

  /**
   * Retrieves a surprise by public unguessable share token
   */
  public async getByToken(token: string): Promise<SurpriseData | undefined> {
    const localId = this.tokenIndex.get(token);
    if (localId && this.surprises.has(localId)) {
      return this.surprises.get(localId);
    }

    // Direct token search in local cache (in case index missed it)
    for (const item of this.surprises.values()) {
      if (item.share_token === token) {
        this.tokenIndex.set(token, item.id);
        return item;
      }
    }

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('surprises')
          .select('*')
          .eq('share_token', token)
          .maybeSingle();

        if (data && !error) {
          const surprise: SurpriseData = data.data || data;
          this.saveLocal(surprise);
          return surprise;
        }
      } catch (err: any) {
        console.warn('[Database] Error querying Supabase by token:', err?.message || err);
      }
    }

    return undefined;
  }

  /**
   * Marks a surprise as paid and assigns/reuses share token
   */
  public async markAsPaid(id: string, paymentDetails: any): Promise<SurpriseData | null> {
    let surprise = await this.getById(id);
    if (!surprise) {
      return null;
    }

    surprise.payment_status = 'paid';
    if (!surprise.share_token) {
      surprise.share_token = this.generateShareToken();
    }

    await this.save(surprise);

    // If Supabase is configured, record the payment transaction
    if (this.supabase) {
      try {
        await this.supabase
          .from('payments')
          .insert({
            order_id: paymentDetails.orderId,
            payment_id: paymentDetails.paymentId,
            surprise_id: id,
            amount: 6900,
            currency: 'INR',
            status: 'captured',
            created_at: new Date().toISOString()
          });
      } catch (err: any) {
        // payment record logging is non-blocking
      }
    }

    return surprise;
  }

  public getAll(): SurpriseData[] {
    return Array.from(this.surprises.values());
  }

  public getAdminStats() {
    const all = this.getAll();
    const paidCount = all.filter(s => s.payment_status === 'paid').length;
    const now = new Date();
    const upcoming = all.filter(s => s.payment_status === 'paid' && new Date(s.unlock_at) > now).length;
    return {
      totalSurprises: all.length,
      paidSurprises: paidCount,
      upcomingUnlocks: upcoming,
      isSupabaseConnected: this.isSupabaseConfigured,
      recent: all.slice(-10).map(s => ({
        id: s.id,
        partner_name: s.partner_name,
        sender_name: s.sender_name,
        unlock_at: s.unlock_at,
        payment_status: s.payment_status,
        share_token: s.share_token,
        created_at: s.created_at
      }))
    };
  }
}

export const db = new DatabaseManager();
