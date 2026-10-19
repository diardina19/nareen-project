"use client";

import { useState } from "react";

export default function TombolWhatsApp({
  nama,
  harga,
  nomorToko,
  nomorWhatsApp,
  produk,
}) {
  const [jumlah, setJumlah] = useState(1);

  const namaProduk = nama || produk?.nama || "";
  const hargaProduk = harga ?? produk?.harga ?? 0;
  const nomor = nomorToko || nomorWhatsApp || "";

  const jumlahValid = Math.floor(Math.max(1, Math.min(99, Number(jumlah) || 1)));
  const total = hargaProduk * jumlahValid;

  const totalRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(total);

  const pesan = `Halo, saya mau pesan ${jumlahValid} x ${namaProduk} (total ${totalRupiah})`;
  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-teks">Jumlah</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
            disabled={jumlahValid <= 1}
            aria-label="Kurangi jumlah"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-garis bg-latar text-lg font-bold text-teks hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-garis disabled:hover:text-teks"
          >
            -
          </button>
          <span className="flex h-10 min-w-12 items-center justify-center rounded-lg border border-garis bg-latar px-3 text-center text-base font-bold text-teks">
            {jumlahValid}
          </span>
          <button
            type="button"
            onClick={() => setJumlah((prev) => Math.min(99, prev + 1))}
            disabled={jumlahValid >= 99}
            aria-label="Tambah jumlah"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-garis bg-latar text-lg font-bold text-teks hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-garis disabled:hover:text-teks"
          >
            +
          </button>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
