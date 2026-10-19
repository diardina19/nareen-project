"use client";

import { useTransition } from "react";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TombolHapus({ id, nama }) {
  const [isPending, startTransition] = useTransition();

  const handleHapus = () => {
    const pesan = nama
      ? `Hapus produk "${nama}"?`
      : "Hapus produk ini?";

    if (!window.confirm(pesan)) {
      return;
    }

    startTransition(async () => {
      const res = await hapusProduk(id);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <Tombol
      type="button"
      varian="bahaya"
      onClick={handleHapus}
      disabled={isPending}
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </Tombol>
  );
}

