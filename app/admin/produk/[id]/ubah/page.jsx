import { notFound, redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { createAdminClient } from "@/lib/supabase/admin";
import { ubahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const supabase = await createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" action={ubahProduk} />
    </div>
  );
}
