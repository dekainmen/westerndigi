const SUPABASE_URL = "https://hjpyelkycupjnxqvhvzi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Uf_89IisOstk67rgyvNQaA_9s1M5aXz";

// Ensure the SDK has loaded
if (!window.supabase) {
    console.error("❌ Supabase SDK not found on window.");
} else {
    console.log("✅ Supabase SDK loaded.");
}

const { createClient } = window.supabase;

// Create the client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======================================================
// Debug Logging
// ======================================================

console.group("===== Supabase Debug =====");

console.log("window.supabase =", window.supabase);

console.log("createClient =", createClient);

console.log("client =", supabase);

console.log("client.auth =", supabase?.auth);

console.log(
    "typeof client.auth.getSession =",
    typeof supabase?.auth?.getSession
);

console.log(
    "typeof client.auth.signInWithOAuth =",
    typeof supabase?.auth?.signInWithOAuth
);

console.log(
    "typeof client.auth.signInWithPassword =",
    typeof supabase?.auth?.signInWithPassword
);

console.log(
    "typeof client.auth.onAuthStateChange =",
    typeof supabase?.auth?.onAuthStateChange
);

console.log("Current URL =", window.location.href);

console.groupEnd();