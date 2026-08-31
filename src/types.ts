export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
  name?: string;
}

export interface SurpriseData {
  id: string;
  sender_name: string;
  partner_name: string;
  nickname: string; // 'Baby' | 'Love' | 'My Person' | 'Sunshine' | string
  relationship: string;
  relationship_start_date: string;
  how_we_met: string;
  
  first_photo: string;
  first_photo_caption?: string;
  
  memory_photo: string;
  favorite_memory: string;
  
  additional_photos: PhotoItem[];
  
  love_most: string;
  never_told: string;
  favorite_thing: string;
  wish_for_year: string;
  special_note: string;
  
  voice_note_url?: string;
  voice_note_duration?: number;
  
  song_title?: string;
  song_url?: string;
  
  generated_messages: string[]; // 12 messages
  personal_letter: string;
  
  unlock_at: string; // ISO 8601 UTC
  unlock_date_display: string;
  timezone: string;
  
  payment_status: 'unpaid' | 'paid';
  share_token: string;
  created_at: string;
}

export interface PublicSurpriseResponse {
  is_locked: boolean;
  is_unlocked: boolean;
  partner_name: string;
  sender_name: string;
  unlock_at: string;
  timezone: string;
  server_now: string;
  remaining_seconds: number;
  data?: SurpriseData; // Provided only when unlocked or in authorized preview
  surprise?: SurpriseData;
}

export type CreationStep =
  | 'partner_name'
  | 'nickname'
  | 'beginning'
  | 'first_photo'
  | 'memory_photo'
  | 'additional_photos'
  | 'personal_questions'
  | 'voice_note'
  | 'audio_music'
  | 'generating'
  | 'review_messages'
  | 'preview'
  | 'scheduling'
  | 'payment'
  | 'success';
