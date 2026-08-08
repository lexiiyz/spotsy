# 🚀 Rencana Pembaruan & Roadmap Fitur Masa Depan (Spotsy Phase 2 & 3)

Dokumen ini merangkum rencana pembaruan fitur Spotsy untuk tahap berikutnya, dengan fokus utama pada **Integrasi Google Places API (Google Maps Platform)** untuk data tempat dan foto yang 100% presisi.

---

## 🎯 Peta Jalan Pengembangan (Feature Roadmap)

```text
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│     PHASE 1 (MVP)       │ ──►│   PHASE 2 (ENHANCED)    │ ──►│   PHASE 3 (ECOSYSTEM)   │
│  Done (FastAPI, Groq,   │    │ Google Places API,      │    │ Table Reservations,     │
│   PostgreSQL, Marshmallow)│    │ Interactive Maps, Voice │    │ Work Pass Vouchers      │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

---

## 🌟 Phase 2: Enhanced Intelligence & Live Google Places API Integrations

### 1. Integrasi Google Places API & Google Maps Platform (Prioritas Utama)
- [ ] **Google Places API Nearby & Text Search:** Menggantikan OpenStreetMap dengan **Google Places API** untuk pencarian kafe, warkop, dan coworking space dengan data 100% akurat di seluruh Indonesia.
- [ ] **Foto Suasana & Ulasan Pengunjung Real:** Menampilkan foto asli interior kafe, ulasan pengunjung (*Google Reviews*), serta jam buka presisi dari Google Places API.
- [ ] **Google Places Popular Times Integration:** Menampilkan kurva keramaian historis berdasarkan data populer Google Places.

### 2. Integrasi Peta Interaktif (Interactive Map View)
- [ ] **Tombol Toggle Grid / Map View:** Pengguna dapat berpindah antara tampilan kartu empuk (*Marshmallow Grid*) dan **Tampilan Peta Interaktif (Google Maps / Leaflet / Mapbox)**.
- [ ] **Pin Warna Keramaian:** Pin lokasi di peta berwarna dinamis (*🟢 Sepi, 🟡 Sedang, 🔴 Ramai*) yang dapat diklik untuk melihat *preview popup* cepat.

### 3. Modul Crowdsourced Check-In & Update Suasana Komunitas
- [ ] **Live Check-in Pengguna:** Pengguna di lokasi dapat memperbarui tingkat keramaian secara langsung (*"Di sini tinggal 2 meja kosong"*).
- [ ] **Live Vibe Badges:** Badge yang diberikan pengguna lain (*misal: "Wi-Fi Kencang 100Mbps", "AC Dingin", "Colokan Banyak"*).

### 4. Fitur Suara & Multimodal AI (Voice & Image Recognition)
- [ ] **Voice Chat Input (Speech-to-Text):** Pengguna dapat berbicara langsung ke mikrofon peramban untuk bertanya pada Spotsy.
- [ ] **Sintesis Suara Asisten (Text-to-Speech):** Asisten Spotsy membacakan rekomendasi tempat dengan suara yang hangat dan alami.
- [ ] **Analisis Foto Menu/Suasana (Vision AI):** Pengguna dapat mengunggah foto daftar menu atau suasana cafe untuk dianalisis oleh AI.

### 5. Fitur Favorit & Integrasi Navigasi Langsung
- [ ] **Simpan Tempat Favorit (Bookmarks):** Fitur menyimpan tempat nugas kesukaan pengguna ke dalam daftar *"Tempat Favoritku"*.
- [ ] **One-Click Navigation:** Tombol *"Buka di Google Maps / Waze"* untuk langsung mengaktifkan navigasi aplikasi peta di HP pengguna.

---

## 💎 Phase 3: Ecosystem & Monetization Extensions

### 6. Sistem Reservasi Meja & Booking Tempat Nugas
- [ ] **Table Booking:** Pengguna dapat memesan meja nugas atau *private room* di coworking space partner secara langsung dari aplikasi Spotsy.

### 7. Voucher Diskon & Work Pass Khusus Jam Sepi
- [ ] **Diskon Jam Sepi (Off-Peak Vouchers):** Kafe partner dapat memberikan voucher diskon khusus bagi pengguna Spotsy yang berkunjung saat suasana tempat sedang *Sepi* untuk meningkatkan tingkat keterisian.

### 8. Sistem Notifikasi Pintar (Smart Alerts)
- [ ] **Alert Tempat Sepi:** Pengguna dapat memasang notifikasi: *"Kabari saya jika Tropikal Coffee sedang Sepi"* dan menerima *Web Push Notification* saat tingkat keramaian di bawah 30%.

---

## 🛠️ Urutan Prioritas Fitur Selanjutnya (Next Recommended Sprint)

1. 📍 **Integrasi Google Places API Key (`GOOGLE_PLACES_API_KEY`)** di backend untuk tempat & foto presisi.
2. 📌 **Tombol "Buka Navigasi di Google Maps" / Waze** pada tiap PlaceCard.
3. 🗺️ **Tampilan Peta Interaktif (Google Maps JS API / Leaflet)**.
4. 🔖 **Simpan Tempat Favorit (Bookmarks)**.
