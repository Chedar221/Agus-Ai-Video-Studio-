# AGUS AI VIDEO STUDIO 2.0

Aplikasi pribadi untuk menyusun paket cerita dan prompt video siap salin ke Google Flow.

## Isi paket
- `public/index.html`: antarmuka aplikasi.
- `server.js`: backend Node.js yang memanggil OpenAI Responses API.
- `.env.example`: contoh konfigurasi rahasia API.
- `public/manifest.webmanifest` dan `public/sw.js`: dukungan instalasi/PWA dasar.

## Menjalankan di komputer
1. Install Node.js 20 atau lebih baru.
2. Ekstrak ZIP ini.
3. Buka terminal di folder hasil ekstrak.
4. Jalankan `npm install`.
5. Salin `.env.example` menjadi `.env`.
6. Isi `OPENAI_API_KEY` dengan API key milikmu. Jangan kirim key ke siapa pun.
7. Jika model default tidak tersedia di proyek API-mu, ubah `OPENAI_MODEL` ke model teks yang tersedia di akun API-mu.
8. Jalankan `npm start`, lalu buka `http://localhost:3000`.

## Penting soal keamanan dan biaya
- API key disimpan di backend dalam `.env`, bukan di HTML/browser.
- Jangan unggah `.env` ke GitHub atau membagikannya.
- Pemakaian API dapat dikenakan biaya terpisah dari langganan ChatGPT. Periksa billing dan tetapkan batas penggunaan di OpenAI Platform.
- Untuk dipakai di Android dari luar komputer, deploy backend ke hosting HTTPS yang mendukung Node.js dan atur environment variables di dashboard hosting. Setelah itu buka alamat HTTPS di Chrome lalu pilih **Tambahkan ke layar utama**.
- Jangan memasukkan API key ke halaman web atau aplikasi Android. Dokumentasi OpenAI melarang mengekspos secret key di sisi klien.

## Fitur
- Generate paket cerita dengan AI melalui backend.
- Buat template prompt tanpa AI.
- Pengaturan durasi, jumlah adegan, rasio, genre, bahasa, karakter, pakaian, lokasi, kamera, dan audio.
- Salin hasil dan unduh TXT.

## Batasan versi 2.0
Aplikasi ini menghasilkan teks prompt, bukan video. Foto referensi belum diunggah ke API; lampirkan foto secara manual di Google Flow. Konsistensi visual tetap bergantung pada hasil generasi Flow.
