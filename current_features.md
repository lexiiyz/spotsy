# ☕ Rangkuman Fitur & Arsitektur Terkini Spotsy (Current Features)

Dokumen ini menjelaskan secara menyeluruh seluruh **fitur, teknologi, dan kapabilitas nyata** yang saat ini sudah **100% aktif dan berjalan** di dalam aplikasi **Spotsy**.

---

## 📌 Ringkasan Aplikasi

**Spotsy** adalah asisten rekomendasi tempat lokal berbasis AI yang membantu mahasiswa, *remote worker*, dan *freelancer* menemukan kafe, warkop, dan *coworking space* yang sepi, nyaman untuk bekerja/nugas, beserta estimasi rute perjalanan jalan raya secara *real-time*.

---

## 🎨 1. Fitur Frontend & UI/UX (Next.js 16 + Tailwind v4)

- **Hot Cocoa & Vanilla Cream Dual Theme:**
  - *Sliding Pill Toggle Switcher* untuk berpindah antara tema **Hot Cocoa Dark** (dengan efek *radial ambient glow*) dan **Vanilla Cream Light** murni.
- **Marshmallow Plush Aesthetics System:**
  - Desain sudut empuk (*`rounded-[2.5rem]`*, *`rounded-full`*), bayangan awan halus (*cloud ambient shadows*), dan tag kategori berbentuk *marshmallow cream*.
- **Tactile Squish Animations (`.marshmallow-squish`):**
  - Efek rabaan menekan marshmallow saat tombol/kartu diklik (`active:scale-95`) dengan kurva pegas *spring bounce* (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Deteksi Geolokasi Otomatis (Browser Geolocation API):**
  - Mengambil koordinat GPS presisi dari perangkat pengguna dengan fallback otomatis ke koordinat Surabaya jika akses lokasi ditolak.
- **Kartu Tempat Interaktif (Place Cards):**
  - Menampilkan badge indikator keramaian (*Sepi 🟢, Sedang 🟡, Ramai 🔴*), fasilitas (*Wi-Fi kencang, colokan listrik, tingkat kebisingan*), alamat, dan jam operasional.
- **AI Chat Dialog Overlay:**
  - Modal percakapan AI dengan *Quick Prompt Chips*, efek animasi transisi spring, serta sistem penjaga *Ref Guard* (`handledPromptRef`) untuk mencegah pengiriman kueri ganda.
- **Pure Dynamic Data Fetching:**
  - Halaman utama mengambil data tempat asli secara langsung dari endpoint backend FastAPI `/api/v1/places/search` sesuai posisi GPS pengguna saat ini (tanpa data *hardcoded*).

---

## ⚡ 2. Backend Microservice (Python FastAPI + `uv`)

- **Clean Architecture Modular:**
  - Terbagi rapi ke dalam layer `app/core/config.py`, `app/db/postgres.py`, `app/schemas/`, `app/services/`, dan `app/api/v1/`.
- **Strict Environment Configuration (`.env`):**
  - Pydantic Settings membaca variabel lingkungan `DATABASE_URL` dan API Key murni dari berkas `.env` tanpa *hardcoded fallback*.
- **Pencarian Tempat Nyata OpenStreetMap (Overpass API):**
  - Mengueri lokasi kafe, coworking, dan warkop nyata di sekitar koordinat GPS pengguna dengan mekanisme **Multi-Mirror Failover** (`overpass.kumi.systems`, `overpass-api.de`, `overpass.private.coffee`) serta identifikasi header `User-Agent`.
- **Kalkulator Rute Jalan & ETA Nyata (OSRM Routing Engine):**
  - Menghitung jarak tempuh jalan berkendara asli (dalam kilometer) dan durasi waktu perjalanan nyata (dalam menit) via **OSRM Public Routing API** dengan fallback kalkulator *Haversine*.
- **Graceful Timeout & Scraper Limit:**
  - Menetapkan batas *timeout* 3-8 detik pada setiap panggilan API luar agar chatbot tidak pernah menggantung (*stuck*).

---

## 🤖 3. AI Engine Orchestrator (Groq Llama 3.3 70B)

- **Groq Ultra-Fast Inference:**
  - Ditenagai oleh **Groq (Llama 3.3 70B Versatile)** (`llama-3.3-70b-versatile`) untuk generasi rangkuman percakapan bahasa Indonesia alami dengan waktu latensi di bawah 1 detik (*sub-second*).
- **Format Teks Ramah:**
  - Merangkum rekomendasi tempat secara hangat tanpa menyisakan karakter bintang mentah (`**`).
- **Eksekusi Alat Paralel (`asyncio.gather`):**
  - Menjalankan pencarian tempat, prediksi keramaian, dan perhitungan rute perjalanan jalan raya secara serentak (*parallel execution*).
- **Rekomendasi Berbobot (Ranking Algorithm):**
  - Memprioritaskan rekomendasi berdasarkan pembobotan *70% tingkat sepi/keramaian + 30% waktu tempuh rute perjalanan*.

---

## 🗄️ 4. Infrastruktur & Database (Docker + PostgreSQL 16)

- **PostgreSQL 16 Engine (Port `5435`):**
  - Berjalan di dalam kontainer Docker `spotsy_postgres` dengan port `5435` terisolasi untuk menghindari bentrokan dengan service PostgreSQL bawaan Windows.
- **Manajemen Database pgAdmin 4 (Port `5050`):**
  - Kontainer `spotsy_pgadmin` di port 5050 (`http://localhost:5050`) untuk inspeksi GUI tabel database.
- **Skema Database Bersih (`init.sql`):**
  - Mengaktifkan ekstensi `uuid-ossp`, tabel `users`, `place_cache` (dengan *indexing* performa), `chat_sessions`, dan `chat_messages` **100% bersih tanpa data seed dummy**.

---

## 🌐 Endpoint RESTful API V1 yang Aktif (`http://localhost:8000/docs`)

1. `GET /health` — Status kesehatan database PostgreSQL & backend service.
2. `GET /api/v1/places/search?query=...&lat=...&lng=...` — Pencarian tempat nyata OpenStreetMap + DB cache.
3. `GET /api/v1/busyness?place_id=...` — Data keramaian tempat.
4. `POST /api/v1/traffic` — Estimasi jarak jalan raya & waktu tempuh OSRM.
5. `POST /api/v1/chat` — AI Chat Advisor Orchestrator utama.
