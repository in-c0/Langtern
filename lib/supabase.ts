import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Client-side singleton
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

// Get client-side Supabase client
export const getSupabaseClient = () => {
  if (!clientSupabaseClient) {
    clientSupabaseClient = createSupabaseClient()
  }
  return clientSupabaseClient
}

// Create a server-side client (to avoid singleton issues with SSR)
export const createServerSupabaseClient = () => {
  return createSupabaseClient()
}
