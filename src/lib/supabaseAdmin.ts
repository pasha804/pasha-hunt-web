import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://ovxnzmihgudkcbsfchgz.supabase.co';
const DEFAULT_SRV_B64 = 'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW05MmVHNTZiV2xvWjNWa2EyTmljMlpqYUdkNklpd2ljbTlzWlNJNkluTmxjblpwWTJWZmNtOXNaU0lzSW1saGRDSTZNVGM1TlRNeE5UWXdPQ3dpWlhod0lqb3lNVEV3T0RreE5qQTRmUS5Vd2dvU0VZSHZVOVVnRzN4aXBsQktVcHZnanN5Szh3ZlFISUJVMnlmWmtn';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || (typeof atob === 'function' ? atob(DEFAULT_SRV_B64) : Buffer.from(DEFAULT_SRV_B64, 'base64').toString('utf8'));

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
