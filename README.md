# YUKTOP — Smart Freight Logistics (PWA & Android APK)

Smart Freight Logistics for a Stronger Tomorrow.
Figma & Dribbble dizayni asosida yaratilgan zamonaviy PWA va mobil ilova.

---

## 🚀 Qanday ishga tushiriladi? (Quick Start)

Loyihani kompyuteringizda ishga tushirish uchun:

```bash
# Paketlarni o'rnatish
npm install

# Ishlab chiqish (Development) rejimi:
npm run dev

# Ishlab chiqarish (Production build) qilish:
npm run build

# Tayyor loyihani ko'rish (Preview):
npm run preview
```

Brauzerda `http://localhost:4173` (yoki dev rejimda `http://localhost:3000`) orqali ochiladi.

---

## ⚡ Vercel'da Deploy Qilish (Vercel Deployment)

Ushbu loyiha Vercel uchun to'liq moslashtirilgan (`vercel.json` orqali SPA routing va PWA kesh sarlavhalari sozlangan):

### Usul 1: Vercel Dashboard (GitHub orqali)
1. [vercel.com](https://vercel.com) ga kiring.
2. **"Add New Project"** tugmasini bosing.
3. GitHub hisobingizdagi `yuktop-pwa` repozitoriyasini tanlang (`Import`).
4. **Deploy** tugmasini bosing! (Vercel avtomatik ravishda Vite va `dist` papkasini aniqlaydi).

### Usul 2: Vercel CLI orqali
```bash
npm install -g vercel
vercel
```

---

## 📱 Android APK Yaratish (Capacitor)

Ushbu loyiha Capacitor yordamida to'g'ridan-to'g'ri Android Studio orqali APK faylga aylanadi:

1. **Capacitor Android kutubxonasini o'rnatish**:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Loyihani build qilish**:
   ```bash
   npm run build
   ```

3. **Android platformasini qo'shish**:
   ```bash
   npx cap add android
   ```

4. **Android Studio'da ochish**:
   ```bash
   npx cap open android
   ```
   *Android Studio ochilgach, yuqori menyudan `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)` tugmasini bosing.*

---

## 🌐 PWA (Progressive Web App) sifatida o'rnatish

- **Chrome / Edge (Kompyuter)**: URL manzil qatoridagi "Install YUKTOP" tugmasini bosing.
- **Android (Chrome)**: Brauzer menyusidan `Add to Home Screen` (Bosh ekranga qo'shish) ni bosing. Ilova telefonga xuddi oddiy mobil ilova kabi o'rnatiladi.
- **iOS (Safari)**: `Share` -> `Add to Home Screen` ni bosing.

---

## 📁 Loyiha Tuzilishi:

- `src/screens/` — 8 ta to'liq ekran (Splash, Booking, Available Trucks, Real-time Tracking, Driver Profile, My Bookings, Earnings, Profile)
- `src/components/` — Mobil StatusBar, Bottom Navigation bar, Truck vektor illyustratsiyalari
- `src/translations/` — O'zbekcha, English va Ruscha tillari
- `public/manifest.json` — PWA konfiguratsiyasi
- `public/sw.js` — Service Worker oflayn kesh tizimi
- `capacitor.config.json` — Mobil APK sozlamalari
