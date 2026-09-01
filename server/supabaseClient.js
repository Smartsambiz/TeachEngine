const supabase= require("@supabase/supabase-js");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLIC_KEY;


const client = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

module.exports = client;