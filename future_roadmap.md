# 🚀 Rencana Pembaruan & Roadmap Fitur Masa Depan (Spotsy Phase 2 & 3)

Dokumen ini merangkum rencana pembaruan fitur Spotsy untuk tahap berikutnya, berfokus pada **Integrasi Google Places API** dan **Fitur Komunitas Pengguna (User Accounts & Engagement)**.

---

## 🎯 Peta Jalan Pengembangan (Feature Roadmap)

```text
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│     PHASE 1 (MVP)       │ ──►│   PHASE 2 (ENHANCED)    │ ──►│    PHASE 3 (USER SIGHT) │
│  Done (FastAPI, Groq,   │    │ Google Places API,      │    │ User Auth, Comments,    │
│   PostgreSQL, Marshmallow)│    │ Interactive Maps, Voice │    │ Likes, & Favorites      │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

---

## 🌟 Phase 2: Enhanced Intelligence & Live Google Places API Integrations

### 1. Integrasi Google Places API & Google Maps Platform (Prioritas Utama)
- [ ] **Google Places API Nearby & Text Search:** Menggantikan OpenStreetMap dengan **Google Places API** untuk pencarian kafe, warkop, dan coworking space dengan data 100% akurat di seluruh Indonesia.
- [ ] **Foto Suasana & Ulasan Pengunjung Real:** Menampilkan foto asli interior kafe, ulasan pengunjung (*Google Reviews*), serta jam buka presisi dari Google Places API.

### 2. Integrasi Peta Interaktif (Interactive Map View)
- [ ] **Tombol Toggle Grid / Map View:** Pengguna dapat berpindah antara tampilan kartu empuk (*Marshmallow Grid*) dan **Tampilan Peta Interaktif (Google Maps / Leaflet)**.
- [ ] **Pin Warna Keramaian:** Pin lokasi di peta berwarna dinamis (*🟢 Sepi, 🟡 Sedang, 🔴 Ramai*) yang dapat diklik untuk melihat *preview popup* cepat.

### 3. Fitur Suara & Multimodal AI (Voice & Image Recognition)
- [ ] **Voice Chat Input (Speech-to-Text):** Pengguna dapat berbicara langsung ke mikrofon peramban untuk bertanya pada Spotsy.
- [ ] **Sintesis Suara Asisten (Text-to-Speech):** Asisten Spotsy membacakan rekomendasi tempat dengan suara yang hangat dan alami.

### 4. Integrasi Navigasi Langsung
- [ ] **One-Click Navigation:** Tombol *"Buka di Google Maps / Waze"* untuk langsung mengaktifkan navigasi aplikasi peta di HP pengguna.

---

## 👥 Phase 3: User Accounts & Social Community Features

### 5. Otentikasi & Profil Pengguna (User Auth & Profile)
- [ ] **Login & Registrasi Pengguna:** Fitur masuk menggunakan akun **Google / Email** (NextAuth / Supabase Auth / JWT).
- [ ] **Halaman Profil Pengguna:** Menampilkan avatar empuk, nama pengguna, serta daftar aktivitas pribadi.

### 6. Interaksi & Komunitas Pengguna (Likes, Favorites, & Comments)
- [ ] **Simpan Tempat Favorit (Bookmarks):** Pengguna dapat menyimpan tempat nugas kesukaannya ke dalam daftar *"Tempat Favoritku"*.
- [ ] **Like & Upvote Tempat:** Pengguna dapat memberikan *Like* pada tempat yang nyaman atau memberikan apresiasi pada rekomendasi AI.
- [ ] **Ulasan & Komentar Pengguna (Live Community Tips):** Pengguna dapat menulis komentar atau tips praktis (*misal: "Colokan paling banyak ada di pojok lantai 2", "Wi-Fi kencang cocok buat nugas"*).
- [ ] **Riwayat Percakapan AI (Chat History):** Menyimpan log percakapan percakapan pengguna dengan asisten Spotsy sehingga bisa dibuka kembali kapan saja.

---

## 🛠️ Urutan Prioritas Fitur Selanjutnya (Next Recommended Sprint)

1. 📍 **Integrasi Google Places API (`GOOGLE_PLACES_API_KEY`)** di backend untuk tempat & foto presisi.
2. 🔑 **User Auth & Login System (Google OAuth)**.
3. 🔖 **Simpan Tempat Favorit (Bookmarks) & Tombol Like**.
4. 💬 **Fitur Komentar & Tips Tempat dari Komunitas**.
5. 📌 **Tombol "Buka Navigasi di Google Maps" / Waze** pada tiap PlaceCard.
