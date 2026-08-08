# Product Requirements Document (PRD) & Architecture Schema

**Project Name:** Spotsy — Orchestrated AI Local Places & Live Busyness Advisor  
**Author:** Raditya Rakha Renanda  
**Status:** Draft / Initial Architecture  
**Target Platform:** Web Application (Responsive, Mobile-First)

---

## 1. Executive Summary

**Spotsy** adalah aplikasi web berbasis AI Assistant yang membantu pengguna menemukan tempat untuk nugas, bekerja, atau makan (kafe, warkop, resto) berdasarkan tingkat keramaian *real-time* maupun historis, serta kondisi lalu lintas menuju lokasi.

Aplikasi ini memecahkan masalah umum berupa ketidakpastian kondisi lokasi sebelum pengguna memutuskan untuk berangkat, seperti:

- Apakah tempat sedang sepi atau ramai?
- Apakah masih memungkinkan mendapatkan tempat duduk?
- Berapa lama waktu tempuh menuju lokasi?
- Apakah perjalanan menuju lokasi sedang macet?

---

## 2. Problem Statement & User Persona

### 2.1 Problem Statement

#### Informasi Terpisah

Pengguna harus membuka Google Maps untuk melihat informasi tempat dan grafik keramaian, kemudian membandingkannya secara manual dengan kondisi kemacetan pada rute menuju lokasi.

#### Kehilangan Waktu

Pengguna dapat datang ke lokasi populer hanya untuk menemukan bahwa tempat duduk atau meja sudah penuh (*fully booked*).

#### Data Busyness Tidak Mudah Difilter

Indikator *Live Busyness* pada Google Maps tidak menyediakan mekanisme filter langsung seperti:

> "Tampilkan hanya tempat yang sepi sekarang."

Akibatnya, pengguna harus memeriksa beberapa lokasi satu per satu sebelum menemukan tempat yang sesuai.

### 2.2 User Persona

**Target Persona:** Mahasiswa / Freelancer / Remote Worker

**Kebutuhan:**

- Mencari tempat yang relatif sepi.
- Memiliki koneksi Wi-Fi.
- Memiliki colokan listrik.
- Tidak terlalu bising.
- Cocok untuk fokus mengerjakan tugas atau pekerjaan.
- Cocok untuk rapat atau online meeting.

**Perilaku:**

- Menggunakan perangkat mobile saat bergerak.
- Membutuhkan rekomendasi secara instan.
- Menginginkan informasi yang cukup untuk mengambil keputusan dengan cepat.

---

## 3. Product Goals & MVP Scope

### 3.1 In-Scope — MVP Features

#### 1. Natural Language Querying

Pengguna dapat berinteraksi menggunakan bahasa natural.

Contoh:

> "Cariin kafe sepi dekat Manyar yang buka sampai malam."

#### 2. Auto Geolocation

Memanfaatkan **Browser Geolocation API** untuk mendeteksi koordinat pengguna secara otomatis dengan persetujuan pengguna.

#### 3. Live / Historical Busyness Fetching

Mengambil indikator tingkat keramaian tempat, baik:

- *Live busyness indicator*, jika tersedia.
- Data historis jam sibuk sebagai fallback.

#### 4. Traffic & ETA Estimation

Mengalkulasi:

- Jarak menuju lokasi.
- Estimasi waktu tempuh.
- Kondisi lalu lintas.
- Estimasi waktu tempuh berdasarkan kondisi lalu lintas saat ini.

#### 5. Interactive Response Cards

Menampilkan rekomendasi dalam bentuk UI Card dengan indikator tingkat keramaian:

| Indicator | Status | Description |
|---|---|---|
| 🟢 | Sepi | Relatif tidak ramai |
| 🟡 | Sedang | Tingkat keramaian moderat |
| 🔴 | Ramai | Sangat ramai / berpotensi sulit mendapatkan tempat |

---

### 3.2 Out-of-Scope — Future Iterations

Fitur berikut tidak termasuk dalam MVP:

- Sistem reservasi meja.
- Pembayaran digital.
- Modul *crowdsourced check-in* pengguna internal.
- Native mobile application (Android/iOS).

---

## 4. Technical Architecture Overview

### 4.1 High-Level Architecture

```text
┌─────────────────────────────────────┐
│      User Browser / Web App         │
│            Next.js                  │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│      Next.js API Routes /           │
│          Vercel AI SDK              │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│       AI Agent / Tool Orchestrator  │
└───────────────┬─────────────────────┘
                │
       ┌────────┼───────────┬───────────────┐
       │        │           │               │
       ▼        ▼           ▼               ▼
┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐
│ Places   │ │ Busyness │ │ Traffic   │ │ Supabase /   │
│ API      │ │ Service  │ │ API       │ │ PostgreSQL   │
│          │ │          │ │           │ │              │
│ Google / │ │ Python   │ │ TomTom /  │ │ Cache &      │
│ Overpass │ │ FastAPI  │ │ Google    │ │ Chat History │
│          │ │          │ │ Distance  │ │              │
└──────────┘ └──────────┘ └───────────┘ └──────────────┘
```

### 4.2 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide Icons |
| Backend / Orchestrator | Next.js Server Actions / API Routes |
| AI SDK | Vercel AI SDK atau LangChain.js |
| LLM Engine | OpenAI `gpt-4o-mini` atau Groq `llama-3.1-70b` |
| Busyness Microservice | Python + FastAPI |
| Database | Supabase PostgreSQL |
| Cache | Upstash Redis |
| Places Data | Google Places API / Overpass |
| Traffic Data | TomTom / Google Distance API |

> **Note:** Pemilihan LLM dilakukan dengan mempertimbangkan latensi rendah dan kemampuan *tool calling*.

---

## 5. System Workflows & Sequence

### 5.1 Search & Recommendation Flow

```text
User Prompt
     │
     ▼
┌──────────────────────┐
│   LLM Orchestrator   │
└──────────┬───────────┘
           │
           ▼
   search_places()
           │
           ▼
    ┌──────┴───────┐
    │              │
    ▼              ▼
get_busyness()  get_traffic_eta()
    │              │
    └──────┬───────┘
           │
           ▼
 ┌─────────────────────┐
 │ Synthesize & Filter │
 │       Results       │
 └──────────┬──────────┘
            │
            ▼
 ┌─────────────────────┐
 │ Render Markdown +   │
 │ Interactive Cards   │
 └─────────────────────┘
```

### 5.2 Parallel Tool Execution

Setelah lokasi kandidat ditemukan, tool berikut sebaiknya dieksekusi secara paralel:

```text
                    ┌─────────────────┐
                    │ Candidate Places│
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
        ┌────────────────┐      ┌────────────────┐
        │ get_busyness() │      │get_traffic_eta()│
        └───────┬────────┘      └───────┬────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                    Result Aggregation
                            │
                            ▼
                     Recommendation
```

Hal ini dilakukan untuk mengurangi *end-to-end latency*.

---

## 6. Database Schema & Data Models

Skema berikut menggunakan PostgreSQL dan kompatibel dengan Supabase.

### 6.1 UUID Extension

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 6.2 Table: `users`

Tabel opsional untuk registrasi pengguna atau anonymous session.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6.3 Table: `place_cache`

Menyimpan data tempat dan informasi *popular times* untuk mengurangi API hit dan scraping frequency.

```sql
CREATE TABLE place_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    rating DECIMAL(2, 1),
    popular_times_json JSONB,
    last_scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Index

```sql
CREATE INDEX idx_place_cache_place_id
ON place_cache(place_id);
```

### 6.4 Table: `chat_sessions`

Menyimpan informasi setiap sesi percakapan pengguna.

```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6.5 Table: `chat_messages`

Menyimpan pesan pengguna, respons assistant, dan pesan sistem.

```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) CHECK (
        sender IN ('user', 'assistant', 'system')
    ),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

`metadata` dapat digunakan untuk menyimpan:

- Tool execution logs.
- Place recommendation cards.
- Tool response metadata.
- Informasi tambahan yang terkait dengan message.

#### Index

```sql
CREATE INDEX idx_chat_messages_session
ON chat_messages(session_id);
```

---

## 7. Data Transfer Objects (DTO) / API Contracts

### 7.1 Python Busyness Scraper

**Endpoint:**

```http
GET /api/v1/busyness
```

#### Request Query

```json
{
  "place_id": "ChIJN1t_t_n21S0R4V2_example"
}
```

#### Response

```json
{
  "status": "success",
  "place_id": "ChIJN1t_t_n21S0R4V2_example",
  "data": {
    "is_live_available": true,
    "current_popularity": 35,
    "busyness_status": "A bit busy",
    "typical_popular_times": [
      {
        "day": "Saturday",
        "data": [
          0,
          0,
          0,
          10,
          25,
          40,
          75,
          80,
          60,
          30,
          0,
          0
        ]
      }
    ]
  },
  "fetched_at": "2026-08-08T11:15:00Z"
}
```

#### Field Definition

| Field | Type | Description |
|---|---|---|
| `status` | `string` | Status request |
| `place_id` | `string` | ID tempat |
| `is_live_available` | `boolean` | Apakah data live tersedia |
| `current_popularity` | `number` | Estimasi tingkat keramaian saat ini, 0–100 |
| `busyness_status` | `string` | Label tingkat keramaian |
| `typical_popular_times` | `array` | Data historis tingkat keramaian |
| `fetched_at` | `string` | Timestamp pengambilan data |

> **Catatan:** Struktur `data` historis perlu disepakati lebih lanjut apakah benar-benar menggunakan 24 data point per hari atau format lain yang lebih konsisten dengan sumber data.

---

### 7.2 Internal Tool: `get_traffic_route`

#### Input Parameters

```json
{
  "origin": {
    "lat": -7.2819,
    "lng": 112.7953
  },
  "destination": {
    "lat": -7.275,
    "lng": 112.78
  }
}
```

#### Output

```json
{
  "distance_km": 3.2,
  "duration_in_traffic_mins": 12,
  "traffic_condition": "Moderate"
}
```

#### Field Definition

| Field | Type | Description |
|---|---|---|
| `distance_km` | `number` | Jarak perjalanan dalam kilometer |
| `duration_in_traffic_mins` | `number` | Estimasi waktu tempuh dalam menit |
| `traffic_condition` | `string` | Kondisi lalu lintas |

Contoh nilai `traffic_condition`:

- `Light`
- `Moderate`
- `Heavy`
- `Severe`

---

## 8. Non-Functional Requirements (NFR)

### 8.1 Performance & Latency

Target performa MVP:

| Metric | Target |
|---|---:|
| First streamed LLM response | `< 1.5 detik` |
| Parallel tool execution | `< 4 detik` |
| Average end-to-end response | `< 5 detik` |

Respons awal LLM harus mulai di-*stream* sesegera mungkin, sementara proses tool execution berjalan secara paralel.

### 8.2 Reliability & Fallback

Jika busyness scraper gagal atau mengalami timeout:

```text
Scraper Request
      │
      ├── Success ──► Live Busyness Data
      │
      └── Timeout/Error
                 │
                 ▼
        Historical Busyness
                 │
                 ▼
        Continue Response
```

Ketentuan:

- Timeout scraper: `> 3 detik`.
- Sistem tidak boleh menggagalkan keseluruhan respons chatbot.
- Jika data live tidak tersedia, gunakan data historis sebagai fallback.
- Jika data historis juga tidak tersedia, rekomendasi tetap dapat diberikan dengan menandai informasi busyness sebagai `Unknown`.

### 8.3 User Privacy

Koordinat lokasi real-time pengguna:

- Hanya digunakan selama proses pencarian/routing.
- Disimpan sementara di frontend state atau session memory.
- Tidak disimpan secara permanen ke database tanpa persetujuan eksplisit dari pengguna.

---

## 9. Success Metrics & KPIs

### 9.1 Tool Call Success Rate

Target:

> **> 90%**

Eksekusi tool harus berhasil mengembalikan data tempat, keramaian, dan/atau rute tanpa error yang tidak tertangani.

### 9.2 Response Latency

Target:

> **Average end-to-end response time < 5 detik**

### 9.3 User Engagement

Metric utama:

> Jumlah kueri pencarian yang berhasil menghasilkan rekomendasi relevan per sesi.

Metric tambahan yang dapat dipertimbangkan pada iterasi berikutnya:

- Recommendation click-through rate.
- Place card interaction rate.
- Search-to-navigation rate.
- Repeat search rate.
- User feedback / recommendation satisfaction.

---

## 10. MVP Architecture Summary

Secara keseluruhan, arsitektur MVP Spotsy terdiri dari:

```text
┌──────────────────────────────┐
│          USER                │
│      Mobile / Desktop        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Next.js Frontend       │
│   Chat UI + Recommendation   │
│            Cards             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     AI Tool Orchestrator     │
│      Vercel AI SDK /         │
│       LangChain.js           │
└───────┬────────┬───────┬─────┘
        │        │       │
        ▼        ▼       ▼
   ┌────────┐ ┌───────┐ ┌──────────┐
   │ Places │ │Busyness│ │ Traffic  │
   │  API   │ │Service │ │   API    │
   └────────┘ └───────┘ └──────────┘
        │        │       │
        └────────┼───────┘
                 ▼
        ┌─────────────────┐
        │ Result Aggregator│
        │ & Recommendation │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Supabase / Redis│
        │ Cache & History │
        └─────────────────┘
```

---

## 11. Conclusion

PRD dan architecture schema ini menjadi acuan utama untuk implementasi **Spotsy MVP**.

Prioritas implementasi Fase 1:

1. Setup Next.js + App Router.
2. Implementasi chat interface.
3. Implementasi browser geolocation.
4. Implementasi `search_places()`.
5. Implementasi `get_busyness()`.
6. Implementasi `get_traffic_route()`.
7. Implementasi parallel tool execution.
8. Implementasi result aggregation dan recommendation ranking.
9. Implementasi interactive recommendation cards.
10. Implementasi Supabase untuk chat history dan place cache.
11. Implementasi Redis untuk caching dan rate limiting.
12. Implementasi fallback mechanism untuk busyness scraper.

Dengan arsitektur tersebut, Spotsy dapat berkembang dari sekadar AI-powered place search menjadi **orchestrated local decision assistant** yang membantu pengguna menentukan *"ke mana saya harus pergi sekarang?"* berdasarkan lokasi, tingkat keramaian, dan kondisi perjalanan.