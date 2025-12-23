import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Supabase client for client-side components
 */
export const supabase = createClientComponentClient();

/**
 * Get the current user's access token
 */
export async function getAccessToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
}

/**
 * Get current user info
 */
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
