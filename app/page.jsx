import KartuProduk from "@/components/KartuProduk";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const DAFTAR_TOMBOL_KATEGORI = [
  "Semua",
  "Makanan",
  "Pasir",
  "Mainan",
  "Tempat Tidur",
  "Aksesoris",
  "Grooming",
];

const KATEGORI_VALID = [
  "Makanan",
  "Pasir",
  "Mainan",
  "Tempat Tidur",
  "Aksesoris",
  "Grooming",
];

export default async function HalamanKatalog({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const rawQ =
    typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";
  const rawKategori =
    typeof resolvedSearchParams?.kategori === "string"
      ? resolvedSearchParams.kategori
      : "";

  const kategoriValid = KATEGORI_VALID.includes(rawKategori) ? rawKategori : null;
  const cleanQ = rawQ.slice(0, 50).replace(/[%_,()]/g, "").trim();

  let daftarProduk = null;
  let error = null;

  try {
    const supabase = await createAdminClient();
    let query = supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (kategoriValid) {
      query = query.eq("kategori", kategoriValid);
    }

    if (cleanQ) {
      query = query.ilike("nama", `%${cleanQ}%`);
    }

    const { data, error: err } = await query;

    if (err) {
      console.error("Supabase katalog error:", err);
      error = "Produk gagal dimuat, coba lagi nanti";
    } else {
      daftarProduk = data;
    }
  } catch (err) {
    console.error("Katalog fetch error:", err);
    error = "Produk gagal dimuat, coba lagi nanti";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          <form method="GET" action="/" className="flex flex-col gap-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Cari nama produk"
                  name="q"
                  type="search"
                  placeholder="Ketik nama produk..."
                  defaultValue={rawQ}
                  maxLength={50}
                />
              </div>
              <Tombol
                type="submit"
                name="kategori"
                value={kategoriValid || ""}
              >
                Cari
              </Tombol>
            </div>

            <div className="flex flex-wrap gap-2">
              {DAFTAR_TOMBOL_KATEGORI.map((kat) => {
                const isAktif = kat === "Semua" ? !kategoriValid : kat === kategoriValid;
                return (
                  <Tombol
                    key={kat}
                    type="submit"
                    name="kategori"
                    value={kat === "Semua" ? "" : kat}
                    varian={isAktif ? "utama" : "garis"}
                  >
                    {kat}
                  </Tombol>
                );
              })}
            </div>
          </form>
        </div>

        {error ? (
          <div className="rounded-2xl border border-garis bg-permukaan p-6 text-center">
            <p className="font-semibold text-bahaya">{error}</p>
          </div>
        ) : daftarProduk && daftarProduk.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-teks-lembut">Produk tidak ditemukan</p>
        )}
      </section>
    </>
  );
}
