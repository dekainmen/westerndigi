const SUPABASE_URL = "https://YOUR_SUPABASE_URL.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const { createClient } = window.supabase;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
