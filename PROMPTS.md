# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.**

**Hasil:Tulisan "Masih data contoh" hilang dan 6 kartu produk tetap tampil. Karena isinya mirip data contoh, buktikan datanya dari database:
Di Supabase Table Editor → produk, klik ganda nama satu produk, ubah (misalnya jadi "Kopi Spesial"), tekan Enter.
Muat ulang localhost:3000. Nama produk ikut berubah = berhasil.**

**Perbaikan: tidak ada**

## US-02 Detail produk

**Prompt: Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp. **

**Hasil: Klik salah satu kartu produk: halaman detail terbuka dengan foto, harga, dan deskripsi.
Ubah deskripsi produk itu di Supabase, muat ulang: deskripsi ikut berubah.
Buka localhost:3000/produk/9999: tampil halaman "Halaman tidak ditemukan".**

**Perbaikan: Tidak Ada **

## US-03 Pesan via WhatsApp

**Prompt: Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk. **

**Hasil: Klik tombol di halaman detail: WhatsApp Web (atau aplikasi WhatsApp) terbuka ke nomor tokomu, dengan pesan sudah terisi, misalnya "Halo, saya mau pesan Kopi Bubuk Robusta 250 g (Rp 45.000)". **

**Perbaikan: Tidak Ada**

## US-04 Login admin

**Prompt: Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.**

**Hasil: Buka localhost:3000/admin/login, masuk dengan password salah: muncul pesan error.
Masuk dengan email dan password bawaan dari Langkah 4: masuk ke halaman daftar produk admin.
Klik Keluar: kembali ke halaman login.**

**Perbaikan: Tidak Ada**

## US-05 Ganti password

**Prompt: Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.**

**Hasil:Login, buka menu Ganti password, isi password baru (minimal 8 karakter). Catat password barumu.
Muncul pesan berhasil.
Klik Keluar, coba login dengan password bawaan: gagal. Login dengan password baru: berhasil.
**

**Perbaikan: Tidak ada**

## US-06 Proteksi halaman admin

**Prompt:Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.**

**Hasil:Buka jendela penyamaran (Ctrl+Shift+N / Cmd+Shift+N), ketik localhost:3000/admin: langsung dialihkan ke halaman login.
Coba juga localhost:3000/admin/password: dialihkan ke login.
Setelah login, halaman admin terbuka normal.**

**Perbaikan: Tidak ada**

## Debugging dan fitur bonus

## US-07 List produk di halaman admin dari database

**Prompt:Ubah app/admin/page.jsx supaya menampilkan daftar semua produk dari tabel "produk" di Supabase, hanya baca, di sisi server, memakai lib/supabase/admin.js. Pakai kolom yang sudah ada di kode, jangan menebak nama kolom.

Aturan:
- Di awal halaman panggil getUser() (bukan getSession()). Kalau tidak ada user, redirect ke /admin/login.
- Ambil hanya kolom yang ditampilkan, urutkan dari yang terbaru.
- Tampilkan tabel polos dengan Tailwind: nama, harga format rupiah (Intl.NumberFormat "id-ID"), dan foto kecil kalau ada. Di HP tabel boleh digulir di dalam pembungkusnya.
- Kalau gagal, tampilkan "Produk gagal dimuat, coba lagi nanti" dan detail error hanya di console.error server.
- Kalau kosong, tampilkan "Belum ada produk".
- Hapus CatatanBelumAktif dari halaman ini.**

**Hasil:Buka jendela penyamaran (Ctrl+Shift+N / Cmd+Shift+N), ketik localhost:3000/admin: langsung dialihkan ke halaman login.
Coba juga localhost:3000/admin/password: dialihkan ke login.
Setelah login, halaman admin terbuka normal.**

**Perbaikan: Tidak ada**

## US-08 Tambah produk (harus terkunci login)

**Prompt:Buat app/admin/produk/baru/page.jsx berisi form tambah produk, dan Server Action tambahProduk di app/admin/actions.js. Berhasil: simpan ke database lalu redirect ke /admin. Tambahkan tombol "Tambah produk" di app/admin/page.jsx.

Aturan:
- Halaman dan action memanggil getUser() di awal, tolak kalau tidak ada user.
- Insert lewat lib/supabase/admin.js, hanya di server.
- Validasi di server: nama wajib (maks 100 karakter), harga bilangan bulat tidak negatif, deskripsi maks 1000 karakter. Hanya kolom yang diizinkan yang dikirim.
- Kalau insert gagal, tampilkan "Produk gagal disimpan, coba lagi". Detail error hanya di console.error server.
- Setelah berhasil, revalidatePath untuk "/" dan "/admin".
- Tampilan mengikuti panduan tampilan.**

**Perbaikan: Tidak ada**

## US-09 Ubah produk (harus terkunci login)

**Prompt:Buat app/admin/produk/[id]/ubah/page.jsx berisi form terisi data lama, dan Server Action ubahProduk di app/admin/actions.js. Berhasil: simpan lalu redirect ke /admin. Produk tidak ada: notFound(). Tambahkan tautan "Ubah" di tiap baris daftar app/admin/page.jsx.

Aturan:
- Halaman dan action memanggil getUser() di awal, tolak kalau tidak ada user.
- Query lewat lib/supabase/admin.js, hanya di server. Update memakai .eq("id", id), hanya kolom yang diizinkan.
- Validasi sama seperti tambah produk.
- Kalau gagal, tampilkan "Produk gagal disimpan, coba lagi", detail hanya di console.error.
- revalidatePath untuk "/" dan "/admin".

**Perbaikan: Tidak ada**

## US-10 Hapus produk (harus terkunci login)

**Prompt:Tambahkan tombol "Hapus" di tiap baris daftar app/admin/page.jsx, dan Server Action hapusProduk di app/admin/actions.js. Tombol meminta konfirmasi dulu (confirm di browser sudah cukup), lalu menghapus produk dan kembali ke /admin.

Aturan:
- Action memanggil getUser() di awal, tolak kalau tidak ada user.
- Hapus lewat lib/supabase/admin.js, hanya di server, memakai .eq("id", id).
- Kalau gagal, tampilkan "Produk gagal dihapus, coba lagi", detail hanya di console.error.
- revalidatePath untuk "/" dan "/admin".

**Perbaikan: Tidak ada**

## US-11 Filter kategori atau pencarian
**Prompt:Ubah app/page.jsx supaya ada kolom pencarian nama produk dan tombol kategori (Semua, Makanan, Pasir, Mainan, Tempat Tidur, Aksesoris, Grooming). Pakai form GET biasa dengan parameter ?q= dan ?kategori=, tanpa JavaScript di browser. Tetap Server Component, query lewat lib/supabase/admin.js. Sesuaikan cara membaca searchParams dengan versi Next.js di package.json.

Aturan:
- Kategori hanya diterima kalau ada di daftar di atas, selain itu abaikan.
- q dipotong maksimal 50 karakter, dan karakter % _ , ( ) di dalamnya dibuang sebelum dipakai di .ilike().
- Kalau hasil kosong, tampilkan "Produk tidak ditemukan".
- Kalau gagal, tampilkan "Produk gagal dimuat, coba lagi nanti", detail hanya di console.error.
- Tampilan mengikuti panduan tampilan. Jangan ubah hal lain. Tidak perlu npm run build.

**Perbaikan: Tidak ada**

## US-12 Pilih jumlah atau varian
**Prompt:Tambahkan pilihan jumlah di halaman detail produk (app/produk/[id]/page.jsx), di atas tombol WhatsApp: tombol minus, angka, tombol plus, minimal 1 dan maksimal 99. Buat sebagai komponen kecil "use client" yang hanya mengatur angka dan membangun tautan WhatsApp, tanpa fetch dan tanpa Supabase. Nama, harga, dan nomor toko dikirim dari server sebagai props.

Pesan WhatsApp menjadi: "Halo, saya mau pesan {jumlah} x {nama} (total Rp ...)", total = harga x jumlah, format rupiah Intl.NumberFormat("id-ID"), di-encode dengan encodeURIComponent. Tautan tetap target="_blank" rel="noopener noreferrer".

**Perbaikan: Tidak ada**
Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

## US-13 Bisa di-install di HP (PWA)
**Prompt:Buat app bisa di-install di HP (PWA) tanpa cache offline.

- Buat app/manifest.js (format bawaan Next.js) dengan name dan short_name "Meowmart", start_url "/", display "standalone", background_color #ffffff, theme_color #1f6b4f, dan ikon 192x192 dan 512x512.
- Buat ikon PNG sederhana di public/icons (icon-192.png dan icon-512.png): latar hijau #1f6b4f dengan huruf "M" putih di tengah. Buat lewat skrip Node sementara atau SVG yang dikonversi, lalu hapus skrip itu.
- Di app/layout.jsx tambahkan themeColor #1f6b4f lewat viewport export dan apple-touch-icon dari ikon 192.
- Jangan buat service worker dan jangan cache apa pun. Pastikan /admin tidak pernah tersimpan di cache.
- Pastikan middleware atau proxy tidak memblokir /manifest.webmanifest dan /icons/*.

Jangan ubah hal lain. Tidak perlu npm run build.

**Perbaikan: Tidak ada**

## US-14 Deskripsi produk dibuat AI
**Prompt:Tambahkan tombol "Buat deskripsi dengan AI" di form tambah produk dan form ubah produk, di dekat kolom deskripsi. Tombol memakai nama dan kategori produk dari form untuk mengisi kolom deskripsi dengan teks buatan AI. Admin masih bisa mengedit sebelum menyimpan, dan tidak ada yang tersimpan otomatis.

Aturan:
- Buat Server Action buatDeskripsi di app/admin/actions.js. Pakai API Anthropic (model claude-haiku-5-5) lewat fetch dari server ke https://api.anthropic.com/v1/messages dengan header x-api-key dari process.env.AI_API_KEY dan anthropic-version 2023-06-01, max_tokens 200. Tanpa library tambahan.
- Action memanggil getUser() di awal, tolak kalau tidak ada user.
- Key hanya di server, tanpa NEXT_PUBLIC_, tidak pernah dikirim ke browser atau di-log. Browser tidak boleh memanggil API AI langsung.
- Validasi: nama wajib bertipe string maks 100 karakter, kategori harus dari daftar kategori yang ada. Batasi jeda minimal 5 detik per pengguna antar permintaan.
- Prompt ke AI: "Tulis deskripsi produk perlengkapan kucing dalam bahasa Indonesia, 2 kalimat, ramah, tanpa klaim kesehatan atau medis, tanpa emoji, untuk: {nama} ({kategori}). Balas hanya teksnya." Hasil dipotong maks 500 karakter dan ditampilkan sebagai teks biasa.
- Kalau gagal atau key kosong, tampilkan "Deskripsi gagal dibuat, isi manual saja", detail hanya di console.error server. Tombol menampilkan "Membuat..." dan nonaktif saat proses.
- Tampilan mengikuti panduan tampilan. Jangan ubah hal lain. Tidak perlu npm run build.

**Perbaikan: Tidak ada**

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

