# AGUS AI VIDEO STUDIO 3.0

Studio pribadi untuk mengembangkan ide menjadi cerita, storyboard teks, prompt gambar, dan prompt video siap digunakan di Google Flow.

## Fitur
- Generate paket produksi melalui OpenAI Responses API.
- Konsep cerita: judul, logline, sinopsis, dan alur awal-tengah-akhir.
- Storyboard per adegan dengan timecode, aksi, kamera, lighting, dialog, audio, dan transisi.
- Prompt gambar storyboard dan prompt video Flow terpisah untuk setiap adegan.
- Character Lock untuk menjaga deskripsi karakter, pakaian, kendaraan/properti, dan kontinuitas.
- Pengaturan durasi total, jumlah adegan, rasio, genre, bahasa, karakter suara, dan arahan sutradara.
- Template lokal tanpa AI, salin prompt, unduh TXT, simpan/buka/hapus proyek di perangkat.
- Antarmuka responsif dan dukungan instalasi PWA.

## Struktur
- `public/index.html`: antarmuka studio.
- `api/generate.js`: endpoint serverless Vercel untuk OpenAI Responses API.
- `server.js`: Express app untuk Vercel dan penggunaan lokal.
- `public/manifest.webmanifest`, `public/sw.js`, `public/icon.svg`: aset PWA.

## Konfigurasi Vercel
1. Buka Project Settings → Environment Variables.
2. Tambahkan `OPENAI_API_KEY` dengan secret API key dari OpenAI Platform. Pilih Production dan Preview.
3. Opsional: atur `OPENAI_MODEL` ke model API yang tersedia pada project API milikmu. Jika tidak diisi, server memakai default `gpt-6`.
4. Simpan perubahan lalu lakukan redeploy Production.
5. Uji website dan tombol Generate. Jangan pernah menaruh API key di HTML, browser, GitHub, atau chat.

**Penting:** koneksi ChatGPT berlangganan tidak otomatis mencakup saldo OpenAI API. Pemakaian API dapat ditagih terpisah; periksa billing dan usage limits di OpenAI Platform.

## Menjalankan lokal
1. Install Node.js 20 atau lebih baru.
2. Jalankan `npm install`.
3. Buat file `.env` berisi `OPENAI_API_KEY=...` dan opsional `OPENAI_MODEL=...`.
4. Jalankan `npm start`, lalu buka `http://localhost:3000`.

## Batasan yang perlu diketahui
- Studio menghasilkan naskah dan prompt; bukan merender video atau gambar.
- Foto referensi hanya dipratinjau lokal di browser. Lampirkan foto manual di Google Flow; foto tidak dikirim ke server.
- Proyek tersimpan di localStorage perangkat/browser yang digunakan, bukan sinkron antarperangkat.
- Character Lock membantu mengarahkan konsistensi tetapi tidak menjamin wajah identik sempurna.
