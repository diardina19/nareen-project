import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import Tombol from "@/components/Tombol";
import TombolHapus from "@/components/TombolHapus";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let daftarProduk = null;
  let error = null;

  try {
    const { data, error: err } = await supabase
      .from("produk")
      .select("id, nama, harga, foto_url, created_at")
      .order("created_at", { ascending: false });

    if (err) {
      console.error("Supabase admin list products error:", err);
      error = "Produk gagal dimuat, coba lagi nanti";
    } else {
      daftarProduk = data;
    }
  } catch (err) {
    console.error("Fetch admin products error:", err);
    error = "Produk gagal dimuat, coba lagi nanti";
  }

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {error ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-6 text-center">
          <p className="font-semibold text-bahaya">{error}</p>
        </div>
      ) : !daftarProduk || daftarProduk.length === 0 ? (
        <p className="py-8 text-center text-teks-lembut">Belum ada produk</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-garis">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead className="bg-permukaan text-teks-lembut">
              <tr>
                <th className="px-4 py-3 font-semibold">Produk</th>
                <th className="px-4 py-3 font-semibold">Harga</th>
                <th className="px-4 py-3 font-semibold text-right">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {daftarProduk.map((produk) => (
                <tr key={produk.id} className="border-t border-garis">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {produk.foto_url ? (
                        <img
                          src={produk.foto_url}
                          alt=""
                          className="h-10 w-10 rounded-md object-cover bg-permukaan"
                        />
                      ) : null}
                      <span className="font-semibold">{produk.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-teks">
                    {formatRupiah(produk.harga)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                        Ubah
                      </Tombol>
                      <TombolHapus id={produk.id} nama={produk.nama} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
