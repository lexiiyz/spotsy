# 🚀 Rencana Pembaruan & Roadmap Fitur Masa Depan (Spotsy Phase 2 & 3)

Karena seluruh fitur utama **Phase 1 MVP Architecture** pada PRD telah **100% selesai diimplementasikan**, dokumen ini menyusun daftar ide pembaruan dan rencana pengembangan fitur lanjutan (*Future Feature Roadmap*) untuk meningkatkan kemampuan Spotsy dari sekadar MVP menjadi platform pencari tempat berbasis AI terlengkap.

---

## 🎯 Peta Jalan Pengembangan (Feature Roadmap)

```text
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│     PHASE 1 (MVP)       │ ──►│   PHASE 2 (ENHANCED)    │ ──►│   PHASE 3 (ECOSYSTEM)   │
│  Done (FastAPI, Groq,   │    │ Live Maps, Overpass,    │    │ Table Reservations,     │
│   PostgreSQL, Marshmallow)│    │ Voice, Check-in Module  │    │ Work Pass Vouchers      │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

---

## 🌟 Phase 2: Enhanced Intelligence & Live Integrations

### 1. Integrasi Peta Interaktif (Interactive Map View)
- [ ] **Tombol Toggle Grid / Map View:** Pengguna dapat berpindah antara tampilan kartu empuk (*Marshmallow Grid*) dan **Tampilan Peta Interaktif (Mapbox / Leaflet / Google Maps)**.
- [ ] **Pin Warna Keramaian:** Pin lokasi di peta berwarna dinamis (*🟢 Sepi, 🟡 Sedang, 🔴 Ramai*) yang dapat diklik untuk melihat *preview popup* cepat.

### 2. Integrasi Google Places API & Overpass OpenStreetMap (Live Data)
- [ ] **Dynamic Live Places Search:** Pencarian tempat otomatis di kota mana saja berdasarkan koordinat lokasi terkini pengguna, bukan terbatas pada database lokal Surabaya.
- [ ] **Galeri Foto & Ulasan Tempat:** Menampilkan foto suasana kafe, ulasan pengunjung, serta menu makanan/minuman secara langsung dari Google Places API.

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

## 🛠️ Prioritas Pengembangan Selanjutnya (Next Recommended Sprint)

Jika kamu ingin melanjutkan ke tahap berikutnya, urutan rekomendasi fitur tercepat & paling berdampak:

1. 📌 **Tombol "Navigasi di Google Maps" / Waze** pada tiap PlaceCard (Paling cepat & bermanfaat).
2. 🗺️ **Tampilan Peta Interaktif (Leaflet.js / Mapbox)** di halaman utama.
3. 🔖 **Fitur Simpan Favorit (Bookmarks)** menggunakan LocalStorage / PostgreSQL DB.
4. 🎙️ **Voice Search (Speech-to-Text Browser API)**.
