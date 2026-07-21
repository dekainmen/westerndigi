// Update auth button based on Supabase session
async function updateAuthButton(session = null) {
  const authButton = document.getElementById('authButton');
  if (!authButton) return;

  // Assign default click handler immediately before any authentication calls
  authButton.onclick = () => window.location.href = '/login.html';

  // Separately handle authentication state
  try {
    // Only call getSession() if session is not provided (initial page load)
    if (session === null) {
      const { data: { session: fetchedSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Supabase getSession error:', error);
        // Fall back to guest state, button remains clickable
        authButton.textContent = 'Login / Sign Up';
        return;
      }
      
      session = fetchedSession;
    }

    if (session) {
      // User is authenticated
      authButton.textContent = 'My Account';
      // TODO: Replace /login.html with /account.html (or profile.html) when account functionality is implemented
      authButton.onclick = () => window.location.href = '/login.html';
    } else {
      // User is not authenticated
      authButton.textContent = 'Login / Sign Up';
    }
  } catch (error) {
    console.error('Unexpected error in updateAuthButton:', error);
    // Gracefully fall back to guest state, button remains clickable
    authButton.textContent = 'Login / Sign Up';
  }
}

// Run on page load (no session provided, will call getSession())
document.addEventListener('DOMContentLoaded', () => updateAuthButton());

// Listen for auth state changes (session provided, no redundant API call)
supabase.auth.onAuthStateChange((event, session) => {
  updateAuthButton(session);
});
