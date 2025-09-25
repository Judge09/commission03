import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase project credentials
const supabaseUrl = "https://lmybaqaqfaswwhekdugs.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxteWJhcWFxZmFzd3doZWtkdWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODkxODAsImV4cCI6MjA3NDM2NTE4MH0.PvpeRwIqZv_hueZbJdF9UgsQONIJEUI2tnJ9SBB3xzs";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
