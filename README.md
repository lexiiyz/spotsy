# ☕ Spotsy — Orchestrated AI Local Places & Live Busyness Advisor

> **Sudut Tenang untuk Nugas, Bekerja, & Bersantai.**  
> Spotsy adalah aplikasi web berbasis AI Assistant yang membantu pengguna menemukan tempat (kafe, coworking space, warkop 24 jam) berdasarkan **tingkat keramaian real-time/historis**, fasilitas (Wi-Fi, colokan, tingkat kebisingan), serta **estimasi waktu tempuh & kondisi lalu lintas** menuju lokasi.

---

## ✨ Fitur Utama & Keunggulan

- 🍥 **Marshmallow Plush Aesthetic & Spring Bounce Animations**: Tampilan visual serba empuk (*rounded-full*, *rounded-3xl*, *cloud ambient shadows*) dilengkapi dengan efek rabaan menekan marshmallow empuk saat tombol/kartu diklik.
- ☕ **Dual Theme Switcher**:
  - **Hot Cocoa (Dark)**: Nuansa cokelat pekat dengan pendaran *radial ambient glow*.
  - **Vanilla Cream (Light)**: Nuansa krem vanilla murni yang bersih dan menenangkan.
- 💬 **AI Place Advisor Chat**: Berinteraksi dengan bahasa alami (*Natural Language Querying*) untuk mendapatkan rekomendasi tempat secara instan.
- 🟢 **Live & Historical Busyness Indicator**: Memantau apakah tempat sedang *Sepi*, *Sedang*, atau *Ramai*.
- 🚗 **Traffic ETA & Route Estimation**: Menghitung estimasi jarak tempuh dan kemacetan dari lokasi pengguna secara otomatis menggunakan Geolocation API.
- 🐳 **Dockerized Fullstack Architecture**: Siap dijalankan dengan satu perintah `docker compose up --build`.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans Font |
| **Backend** | Python 3.12, FastAPI, `uv` Package Manager |
| **Database** | PostgreSQL 16 (Dockerized / Supabase compatible) |
| **DB Management** | pgAdmin 4 (`http://localhost:5050`) |
| **Orchestration** | Docker & Docker Compose |

---

## 📁 Struktur Proyek (Monorepo)

```text
Spotsy/
├── spotsy-frontend/       # Next.js 16 App Router (Frontend UI & Chat Dialog)
├── spotsy-backend/        # FastAPI Microservice (Busyness, Traffic, Places API)
├── init.sql               # PostgreSQL DDL & Seed Data
├── docker-compose.yml     # Multi-container orchestration (FE + BE + DB + pgAdmin)
├── Product Requirements Document (PRD) & Architecture Schema.md
└── README.md
```

---

## 🚀 Cara Menjalankan (Development)

### Opsi 1: Menggunakan Docker Compose (Direkomendasikan)

Pastikan Docker Desktop aktif, lalu jalankan:

```bash
docker compose up --build
```

Akses aplikasi di browser:
- **Frontend App**: `http://localhost:3000`
- **Backend API & Swagger Docs**: `http://localhost:8000/docs`
- **pgAdmin 4 Dashboard**: `http://localhost:5050`
  - *Email*: `admin@spotsy.com`
  - *Password*: `adminpassword`
  - *Host Connection*: `db` (Port `5432`, Username `spotsy_user`, Password `spotsy_password`, Database `spotsy_db`)

---

### Opsi 2: Menjalankan Secara Manual (Local Dev)

#### 1. Backend (FastAPI)
```bash
cd spotsy-backend
uv run fastapi dev main.py
```
*Backend berjalan di `http://localhost:8000`*

#### 2. Frontend (Next.js)
```bash
cd spotsy-frontend
npm run dev
```
*Frontend berjalan di `http://localhost:3000`*

---

## 📜 Lisensi & Penulis

- **Author**: Raditya Rakha Renanda ([@lexiiyz](https://github.com/lexiiyz))
- **Project**: Spotsy MVP Architecture
