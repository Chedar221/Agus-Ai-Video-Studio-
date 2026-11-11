# AGUS AI VIDEO STUDIO 3.1

Studio pribadi untuk mengembangkan ide menjadi cerita, storyboard teks, prompt gambar, dan prompt video siap digunakan di Google Flow.

## Fitur
- Generate paket produksi melalui Google Gemini Developer API.
- Default model: gemini-2.5-flash-lite (free tier bila tersedia untuk akun dan wilayah).
- Konsep cerita, storyboard per adegan, prompt gambar, prompt video Flow, dan Character Lock.
- Pengaturan durasi, jumlah adegan, rasio, genre, bahasa, karakter suara, dan arahan sutradara.
- Template lokal tanpa AI, salin prompt, unduh TXT, simpan/buka/hapus proyek di perangkat.
- Antarmuka responsif dan dukungan instalasi PWA.

## Konfigurasi Vercel
1. Buat API key di https://aistudio.google.com/apikey
2. Di Vercel buka Project Settings → Environment Variables.
3. Tambahkan GEMINI_API_KEY dengan API key Google AI Studio. Pilih Production dan Preview.
4. Opsional: atur GEMINI_MODEL; default adalah gemini-2.5-flash-lite.
5. Simpan perubahan lalu redeploy Production.
6. Jangan pernah menaruh API key di HTML, browser, GitHub, atau chat.

## Biaya dan privasi
Gemini API menyediakan free tier untuk model tertentu, tetapi batas penggunaan berubah menurut model, akun, dan wilayah. Jika kuota gratis habis, permintaan dapat ditolak atau memerlukan paket berbayar. Pada free tier, Google menyatakan data dapat digunakan untuk meningkatkan produk; jangan masukkan informasi pribadi atau rahasia. Lihat https://ai.google.dev/gemini-api/docs/pricing

## Menjalankan lokal
1. Install Node.js 20 atau lebih baru.
2. Jalankan npm install.
3. Buat file .env berisi GEMINI_API_KEY=... dan opsional GEMINI_MODEL=gemini-2.5-flash-lite.
4. Jalankan npm start, lalu buka http://localhost:3000.

## Batasan
- Studio menghasilkan naskah dan prompt; bukan merender video atau gambar.
- Foto referensi hanya dipratinjau lokal. Lampirkan foto manual di Google Flow.
- Proyek tersimpan di localStorage perangkat/browser, bukan sinkron antarperangkat.
- Character Lock membantu konsistensi, tetapi tidak menjamin wajah identik sempurna.