const SUPABASE_URL = ""https://hjpyelkycupjnxqvhvzi.supabase.co"";
const SUPABASE_ANON_KEY = "sb_publishable_Uf_89IisOstk67rgyvNQaA_9s1M5aXz";

const { createClient } = window.supabase;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
