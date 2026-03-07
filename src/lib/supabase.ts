import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Browser client (for client components)
// Uses @supabase/ssr to store auth tokens in cookies (not localStorage)
// so server-side routes and middleware can read the session
export const supabase = supabaseUrl
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createBrowserClient>)
