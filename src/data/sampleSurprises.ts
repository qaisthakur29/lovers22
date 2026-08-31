import { SurpriseData } from '../types';

export const SAMPLE_SURPRISE_SARAH: SurpriseData = {
  id: 'sample-sarah-alex',
  sender_name: 'Alex',
  partner_name: 'Sarah',
  nickname: 'Sunshine',
  relationship: 'Partner',
  relationship_start_date: '2022-10-14',
  how_we_met: 'We bumped into each other while waiting out a sudden autumn rainstorm under the striped green canopy of a small café on 4th street.',
  
  first_photo: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
  first_photo_caption: 'Our very first Polaroid together by the coast.',
  
  memory_photo: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
  favorite_memory: 'The night we drove up to the hilltop observatory at 2 AM with a blanket, listening to acoustic guitar in the car while looking down at the quiet city lights.',
  
  additional_photos: [
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      caption: 'The morning you laughed so hard at our burnt toast.',
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      caption: 'Walking through the botanical gardens in spring.',
    },
    {
      id: 'photo-3',
      url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      caption: 'That unforgettable weekend trip by the lake.',
    },
    {
      id: 'photo-4',
      url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      caption: 'Your genuine smile right before we got gelato.',
    }
  ],
  
  love_most: 'The way your eyes light up when you talk about things you care about, and the gentle calmness you bring into my world whenever you are near.',
  never_told: 'Whenever I see something beautiful or funny during the day, my very first instinct is always to take a picture to send it to you.',
  favorite_thing: 'Making morning coffee together with zero rush, just soft music and sitting on the balcony floor talking about nothing and everything.',
  wish_for_year: 'I wish for you to feel completely unburdened, deeply cherished every single day, and to chase your biggest dreams knowing I will always be right beside you.',
  special_note: 'You are my favorite place to come home to. Happy Birthday, my sunshine.',
  
  voice_note_url: 'https://actions.google.com/sounds/v1/ambiences/gentle_acoustic_breeze.ogg',
  voice_note_duration: 28,
  
  song_title: 'Warm Acoustic Sunrise',
  song_url: 'https://actions.google.com/sounds/v1/ambiences/quiet_morning_strings.ogg',
  
  generated_messages: [
    "I still remember the exact green coat you wore the afternoon we first spoke under the café awning.",
    "The world is noticeably softer and kinder when I'm walking next to you.",
    "Your laugh is my absolute favorite sound in every room we walk into.",
    "Thank you for being the person who understands my silence just as well as my words.",
    "Every ordinary Tuesday turns into a sweet memory when you are in it.",
    "I love how deeply you care for the people in your life without asking for anything back.",
    "You have this quiet superpower of making everyone around you feel safe and heard.",
    "Whenever I have good news, you are always the very first person I want to tell.",
    "Our quiet mornings with coffee on the balcony are the highest highlight of my week.",
    "You make loving you feel as natural and easy as breathing.",
    "No matter where life takes us, my favorite place will always be right next to you.",
    "Happy Birthday, Sarah. I am so lucky that I get to love you."
  ],
  
  personal_letter: `Sarah,\n\nBefore anyone else texts you today, I wanted to create this quiet corner just for you. From the moment we sheltered from that sudden rainstorm outside the café on 4th street, you brought a gentle warmth into my life that has never faded.\n\nYou have an uncanny way of making even the most chaotic days feel peaceful. When I look back at this past year—the late-night drives, the burnt toast we laughed over, the quiet moments on the balcony—I realize that my happiest memories all share one thing: you.\n\nToday, I hope you feel how deeply and unconditionally you are loved. May this year bring you all the gentle victories, boundless laughter, and quiet joy that you give so effortlessly to everyone else.\n\nHappy Birthday, my sunshine. I love you more than words can hold.\n\nAlex`,
  
  unlock_at: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(), // 5 hours in future for countdown test
  unlock_date_display: 'September 15 • 12:00 AM',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
  
  payment_status: 'paid',
  share_token: '7Hk92Lm',
  created_at: new Date().toISOString()
};

export const SAMPLE_SURPRISE_MAYA: SurpriseData = {
  id: 'sample-maya-leo',
  sender_name: 'Leo',
  partner_name: 'Maya',
  nickname: 'My Person',
  relationship: 'Partner',
  relationship_start_date: '2021-06-20',
  how_we_met: 'We met at a quiet bookstore evening reading while reaching for the exact same vintage poetry collection.',
  
  first_photo: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
  first_photo_caption: 'That sunset afternoon at the seaside pier.',
  
  memory_photo: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1000&q=80',
  favorite_memory: 'Getting lost in the old town alleyways and finding that tiny hidden bakery with fresh cinnamon rolls.',
  
  additional_photos: [
    {
      id: 'photo-m1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      caption: 'Your radiant smile at the book fair.',
    },
    {
      id: 'photo-m2',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      caption: 'Evening tea by the window.',
    }
  ],
  
  love_most: 'Your thoughtful mind, your patience, and the gentle empathy you show to every living thing.',
  never_told: 'I still keep the train ticket from the first time I traveled three hours just to have lunch with you.',
  favorite_thing: 'Reading in silence in the same room while our feet touch on the rug.',
  wish_for_year: 'More peaceful travels, cozy rainy days, and another year of growing closer together.',
  special_note: 'You are the calm in my storm. Happy Birthday, Maya.',
  
  voice_note_url: 'https://actions.google.com/sounds/v1/ambiences/gentle_acoustic_breeze.ogg',
  voice_note_duration: 32,
  
  song_title: 'Soft Evening Piano',
  song_url: 'https://actions.google.com/sounds/v1/ambiences/quiet_morning_strings.ogg',
  
  generated_messages: [
    "You are the most thoughtful person I know.",
    "I love how we can spend hours together without speaking and never feel uncomfortable.",
    "The way you look at paintings makes me want to see the world through your eyes.",
    "Thank you for believing in me even when I was unsure of myself.",
    "Our shared inside jokes are my favorite language.",
    "You make our apartment feel like a sanctuary.",
    "Every book I read now reminds me of something you once said.",
    "I love cooking dinner together while you play your favorite playlists.",
    "You are my favorite confidante and my closest friend.",
    "Your warmth has softened all the sharp edges of my days.",
    "I am so proud of everything you are creating.",
    "Happy Birthday, Maya. You are my home."
  ],
  
  personal_letter: `Maya,\n\nHappy Birthday, my love. Today marks another year of you making the world more thoughtful, gentle, and beautiful.\n\nFrom the moment we reached for the same worn book at the bookstore, my life turned into an adventure of quiet joy. Thank you for your patience, your sweet humor, and the constant kindness you wrap around us.\n\nI hope today is filled with your favorite tea, peaceful moments, and the knowledge that you are cherished beyond measure.\n\nForever yours,\nLeo`,
  
  unlock_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // Unlocked for immediate testing
  unlock_date_display: 'Today • 12:00 AM',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
  
  payment_status: 'paid',
  share_token: 'maya99',
  created_at: new Date().toISOString()
};

export const sampleSurprises: SurpriseData[] = [
  SAMPLE_SURPRISE_SARAH,
  SAMPLE_SURPRISE_MAYA
];
