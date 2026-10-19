import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminLayout({ children }) {
  const headerList = await headers();
  const pathname =
    headerList.get("x-pathname") ||
    headerList.get("next-url") ||
    headerList.get("x-invoke-path") ||
    "";

  // Halaman login tidak boleh terkena pengecekan ini agar tidak redirect loop
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login") ||
    pathname.includes("/admin/login")
  ) {
    return children;
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return children;
}

