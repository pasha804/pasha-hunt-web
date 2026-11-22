import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://ovxnzmihgudkcbsfchgz.supabase.co';
const DEFAULT_ANON_B64 = 'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW05MmVHNTZiV2xvWjNWa2EyTmljMlpqYUdkNklpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT1RVek1UVTJNRGdzSW1WNGNDSTZNakV4TURnNU1UWXdPSDAuZkxjTWcyMXVsbUpCZkFQQ3FGOE4xWmJWaHdiaUg1OU1sWldXZFdWTlcycw==';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof atob === 'function' ? atob(DEFAULT_ANON_B64) : Buffer.from(DEFAULT_ANON_B64, 'base64').toString('utf8'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
