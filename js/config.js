const SUPABASE_URL = "https://tzelwrsqfikfdtzdiyfd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZWx3cnNxZmlrZmR0emRpeWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwOTM2NzcsImV4cCI6MjEwMjY2OTY3N30.qTlxebQEqdhaQ2dGCTjRNSuAcTDdy9g-VS1DQdF9P1E";
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);
const API_BASE_URL = "https://sistem-persuratan-sauyunan-backend-production.up.railway.app";
