import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: "./config/config.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Supabase environment variables are missing.");
}

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);

export default supabase;