import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const connectDB = async () => {
  try {
    // Test the connection
    const { data, error } = await supabase.from("users").select("count", { count: "exact" }).limit(1)

    if (error) throw error

    console.log("Supabase Connected")
    return supabase
  } catch (error) {
    console.error(`Error connecting to Supabase: ${error.message}`)
    process.exit(1)
  }
}

// Export supabase client as a named export
export { supabase }

// Export connectDB as the default export to maintain compatibility
export default connectDB
