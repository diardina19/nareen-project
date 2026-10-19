import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Koneksi Supabase di sisi server menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (katalog & detail produk) yang melewati RLS.
 */
export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export { createClient as createServerClient };
export default createClient;

