"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;

  const email = data?.get?.("email")?.toString()?.trim();
  const password = data?.get?.("password")?.toString();

  if (!email || !password) {
    return { error: "Email atau password salah." };
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase login error:", error);
    return { error: "Email atau password salah." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Supabase logout error:", error);
  }

  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir. Silakan login kembali." };
  }

  const data = formData instanceof FormData ? formData : prevState;

  const passwordBaru = data?.get?.("password_baru")?.toString() || "";
  const konfirmasiPassword = data?.get?.("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    console.error("Supabase ganti password error:", error);
    return {
      error: "Gagal mengganti password. Silakan coba lagi.",
    };
  }

  return { success: "Password berhasil diganti." };
}

export async function tambahProduk(prevState, formData) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const data = formData instanceof FormData ? formData : prevState;

  const rawNama = data?.get?.("nama");
  const nama = typeof rawNama === "string" ? rawNama.trim() : "";
  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }
  if (nama.length > 100) {
    return { error: "Nama produk maksimal 100 karakter." };
  }

  const rawHarga = data?.get?.("harga")?.toString()?.trim();
  if (rawHarga === undefined || rawHarga === "" || !/^\d+$/.test(rawHarga)) {
    return { error: "Harga harus berupa bilangan bulat tidak negatif." };
  }
  const harga = parseInt(rawHarga, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa bilangan bulat tidak negatif." };
  }

  const rawDeskripsi = data?.get?.("deskripsi");
  const deskripsi = typeof rawDeskripsi === "string" ? rawDeskripsi.trim() : "";
  if (deskripsi.length > 1000) {
    return { error: "Deskripsi maksimal 1000 karakter." };
  }

  const rawKategori = data?.get?.("kategori");
  const kategori = typeof rawKategori === "string" ? rawKategori.trim() : "";

  const rawFotoUrl = data?.get?.("foto_url");
  const foto_url = typeof rawFotoUrl === "string" ? rawFotoUrl.trim() : "";

  const produkBaru = {
    nama,
    harga,
    deskripsi: deskripsi || null,
    foto_url: foto_url || null,
    kategori: kategori || null,
  };

  try {
    const { error: insertError } = await supabase
      .from("produk")
      .insert(produkBaru);

    if (insertError) {
      console.error("Supabase tambah produk error:", insertError);
      return { error: "Produk gagal disimpan, coba lagi" };
    }
  } catch (err) {
    console.error("Supabase tambah produk error:", err);
    return { error: "Produk gagal disimpan, coba lagi" };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function ubahProduk(arg1, arg2, arg3) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  let id;
  let data;

  if (arg3 !== undefined) {
    id = arg1;
    data = arg3 instanceof FormData ? arg3 : arg2;
  } else if (arg2 instanceof FormData) {
    data = arg2;
    id = data.get("id");
  } else if (arg1 instanceof FormData) {
    data = arg1;
    id = data.get("id");
  } else if (typeof arg1 === "string" || typeof arg1 === "number") {
    id = arg1;
    data = arg2;
  } else {
    data = arg2 || arg1;
    id = data?.get?.("id");
  }

  if (!id) {
    console.error("Ubah produk error: ID produk tidak ditemukan.");
    return { error: "Produk gagal disimpan, coba lagi" };
  }

  const rawNama = data?.get?.("nama");
  const nama = typeof rawNama === "string" ? rawNama.trim() : "";
  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }
  if (nama.length > 100) {
    return { error: "Nama produk maksimal 100 karakter." };
  }

  const rawHarga = data?.get?.("harga")?.toString()?.trim();
  if (rawHarga === undefined || rawHarga === "" || !/^\d+$/.test(rawHarga)) {
    return { error: "Harga harus berupa bilangan bulat tidak negatif." };
  }
  const harga = parseInt(rawHarga, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa bilangan bulat tidak negatif." };
  }

  const rawDeskripsi = data?.get?.("deskripsi");
  const deskripsi = typeof rawDeskripsi === "string" ? rawDeskripsi.trim() : "";
  if (deskripsi.length > 1000) {
    return { error: "Deskripsi maksimal 1000 karakter." };
  }

  const rawKategori = data?.get?.("kategori");
  const kategori = typeof rawKategori === "string" ? rawKategori.trim() : "";

  const rawFotoUrl = data?.get?.("foto_url");
  const foto_url = typeof rawFotoUrl === "string" ? rawFotoUrl.trim() : "";

  const updateData = {
    nama,
    harga,
    deskripsi: deskripsi || null,
    foto_url: foto_url || null,
    kategori: kategori || null,
  };

  try {
    const { error: updateError } = await supabase
      .from("produk")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      console.error("Supabase ubah produk error:", updateError);
      return { error: "Produk gagal disimpan, coba lagi" };
    }
  } catch (err) {
    console.error("Supabase ubah produk error:", err);
    return { error: "Produk gagal disimpan, coba lagi" };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function hapusProduk(arg1, arg2) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  let id;
  if (arg2 instanceof FormData) {
    id = arg2.get("id");
  } else if (arg1 instanceof FormData) {
    id = arg1.get("id");
  } else if (typeof arg1 === "string" || typeof arg1 === "number") {
    id = arg1;
  } else if (arg1 && typeof arg1 === "object" && "get" in arg1) {
    id = arg1.get("id");
  }

  if (!id) {
    console.error("Hapus produk error: ID produk tidak ditemukan.");
    return { error: "Produk gagal dihapus, coba lagi" };
  }

  try {
    const { error: deleteError } = await supabase
      .from("produk")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase hapus produk error:", deleteError);
      return { error: "Produk gagal dihapus, coba lagi" };
    }
  } catch (err) {
    console.error("Supabase hapus produk error:", err);
    return { error: "Produk gagal dihapus, coba lagi" };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function buatDeskripsi(namaOrFormData) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  let rawNama;
  if (typeof namaOrFormData === "string") {
    rawNama = namaOrFormData;
  } else if (namaOrFormData instanceof FormData) {
    rawNama = namaOrFormData.get("nama");
  } else if (namaOrFormData && typeof namaOrFormData === "object" && "get" in namaOrFormData) {
    rawNama = namaOrFormData.get("nama");
  } else if (namaOrFormData && typeof namaOrFormData === "object" && "nama" in namaOrFormData) {
    rawNama = namaOrFormData.nama;
  }

  const nama = typeof rawNama === "string" ? rawNama.trim() : "";
  if (!nama) {
    console.error("buatDeskripsi error: Nama wajib string dan tidak boleh kosong.");
    return { error: "Deskripsi gagal dibuat, isi manual saja" };
  }

  if (nama.length > 100) {
    console.error("buatDeskripsi error: Nama melebihi 100 karakter.");
    return { error: "Deskripsi gagal dibuat, isi manual saja" };
  }

  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    console.error("buatDeskripsi error: AI_API_KEY belum diatur di environment variable.");
    return { error: "Deskripsi gagal dibuat, isi manual saja" };
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `Tulis deskripsi produk perlengkapan kucing dalam bahasa Indonesia, 2 kalimat, ramah, tanpa klaim medis, tanpa emoji, untuk: ${nama}. Balas hanya teksnya.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error response:", res.status, errText);
      return { error: "Deskripsi gagal dibuat, isi manual saja" };
    }

    const data = await res.json();
    const rawDeskripsi = data?.content?.[0]?.text?.trim() || "";
    if (!rawDeskripsi) {
      console.error("Anthropic API returned empty text:", data);
      return { error: "Deskripsi gagal dibuat, isi manual saja" };
    }

    const deskripsi = rawDeskripsi.slice(0, 500);
    return { deskripsi };
  } catch (err) {
    console.error("buatDeskripsi fetch error:", err);
    return { error: "Deskripsi gagal dibuat, isi manual saja" };
  }
}
