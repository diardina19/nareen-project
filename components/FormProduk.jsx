"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsi } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol = "Simpan produk", action }) {
  const [state, formAction, isPending] = useActionState(
    action || (async () => null),
    null
  );

  const [nama, setNama] = useState(produk.nama || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [isMembuatDeskripsi, setIsMembuatDeskripsi] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleBuatDeskripsi = async () => {
    setAiError("");
    const trimmedNama = nama.trim();
    if (!trimmedNama) {
      setAiError("Deskripsi gagal dibuat, isi manual saja");
      return;
    }

    setIsMembuatDeskripsi(true);
    try {
      const res = await buatDeskripsi(trimmedNama);
      if (res?.error) {
        setAiError(res.error);
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
      }
    } catch (err) {
      console.error(err);
      setAiError("Deskripsi gagal dibuat, isi manual saja");
    } finally {
      setIsMembuatDeskripsi(false);
    }
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {produk?.id ? <input type="hidden" name="id" value={produk.id} /> : null}
      {state?.error && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}
      {aiError && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {aiError}
        </div>
      )}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        maxLength={100}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga ?? ""}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        defaultValue={produk.kategori || ""}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url || ""}
      />
      <div className="flex flex-col gap-2">
        <Input
          label="Deskripsi"
          name="deskripsi"
          textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          maxLength={1000}
        />
        <div className="self-start">
          <Tombol
            type="button"
            varian="garis"
            onClick={handleBuatDeskripsi}
            disabled={isMembuatDeskripsi}
          >
            {isMembuatDeskripsi ? "Membuat deskripsi..." : "Buat deskripsi dengan AI"}
          </Tombol>
        </div>
      </div>
      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
