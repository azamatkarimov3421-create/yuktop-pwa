# YUKTOP — O‘zbekiston Uchun Zamonaviy Yuk Tashish Android APK Ilovasi

Yuk beruvchi va yuk tashuvchilarni interaktiv xarita orqali bog‘lovchi, GPS monitoring, savdolashuv (bidding), real-time chat va Supabase/PostgreSQL integratsiyasiga ega to‘liq ishlaydigan Android mobil ilovasi.

---

## 📱 APK Fayli (Yuklab Olish va O‘rnatish)

Tayyor Android APK fayli loyihaning asosiy papkasida joylashgan:
- **Fayl nomi**: `YUKTOP-v1.0.0-release.apk`
- **Fayl joylashuvi**: `C:\Users\Owner\.gemini\antigravity\scratch\yuktop-pwa\YUKTOP-v1.0.0-release.apk`
- **Hajmi**: ~4.67 MB
- **Android talabi**: Android 7.0 (API 24) va undan yuqori

Ushbu APK faylni to‘g‘ridan-to‘g‘ri Android telefoningizga o‘tkazib (Telegram, USB yoki Drive orqali) o‘rnatishingiz mumkin.

---

## 🌟 Asosiy Imkoniyatlar va Funksiyalar

### 1. Ikki Xil Rol (Dual-Role Tizimi)
- **Yuk Beruvchi**:
  - Yuk nomi, toifasi (Qurilish mollari, Oziq-ovqat, Meva-sabzavot, Don mahsulotlari, Mebel, Texnika va h.k.), rasmi, og‘irligi (tonna), hajmi (m³).
  - OpenStreetMap xaritasi orqali **A (Yuklash)** va **B (Yetkazish)** manzillarini aniq belgilash.
  - Avtomobil yo‘li bo‘yicha aniq masofa (km) va yetib borish vaqti (ETA) avtomatik hisoblanishi.
  - Sanalar va taklif qilinayotgan narxni belgilash.
  - Haydovchilardan tushgan barcha narx takliflarini ko‘rish, qabul qilish, qarshi narx taklif qilish yoki rad etish.
  - Faol buyurtma davomida haydovchining harakatini xaritada jonli GPS orqali kuzatish.
  - Buyurtma yetkazilgach, haydovchini 5 yulduzli tizim va teglarda baholash.

- **Yuk Tashuvchi (Haydovchi)**:
  - Transport turi (Fura tentli/refrijerator, Isuzu, Gazel, Samosval va h.k.), modeli, davlat raqami (masalan: 01 777 UZB), yuk ko‘tarish hajmi (tonna), kuzov sig‘imi (m³).
  - Hozirgi joylashuv va borish yo‘nalishi.
  - **Aql-idrokli moslashtirish (Smart Matching)**: Marshrut mosligi, sig‘im mosligi, sanalar va masofa bo‘yicha eng mos yuklarni foizlarda (% mos) tavsiya qilish.
  - Haydovchining hozirgi joylashuvidan **yuklash nuqtasigacha masofani (km)** aniq hisoblash.
  - Yuk egasi narxini to‘g‘ridan-to‘g‘ri qabul qilish yoki qarshi narx (counter-offer) yuborish.
  - **Reys boshqaruvi**: Bosqichma-bosqich o‘zgaruvchi holatlar ("Yuklash joyiga yetdim" → "Yuk ortildi, yo‘lga chiqdim" → "Yetkazdim").
  - Jonli GPS kuzatuviga ruxsat berish/o‘chirish.

### 2. Xarita va GPS Monitoring (OpenStreetMap & Routing API)
- OpenStreetMap kartografiyasi.
- OSRM (Open Source Routing Machine) orqali O‘zbekiston yo‘llari bo‘ylab avtomobil marshrutini hisoblash.
- Reys davomida mashina piktogrammasining yo‘l bo‘ylab harakatlanishi, tezlik (km/soat) va qolgan vaqtni ko‘rsatish.
- Android qurilmaning haqiqiy GPS sensoridan `@capacitor/geolocation` orqali koordinata olish.

### 3. Buyurtmalarning 7 Ta To‘liq Holati (Order Lifecycle)
1. `yangi` — E'lon qilingan yangi yuk
2. `taklif_kutilmoqda` — Haydovchilardan narx takliflari kutilmoqda
3. `kelishildi` — Narx kelishildi va buyurtma rasmiylashtirildi
4. `yuklashda` — Transport yuklash manziliga yetib keldi
5. `yolda` — Yuk mashinasi yo‘lga chiqdi (jonli GPS faol)
6. `yetkazildi` — Yuk manzilga yetkazildi
7. `bekor_qilindi` — Bekor qilingan buyurtma

### 4. Qo‘shimcha Aloqa va Xavfsizlik
- **Real-time Chat**: Buyurtma ichidagi tezkor yozishma, tayyor o‘zbekcha javob tugmalari.
- **Telefon orqali aloqa**: `tel:+998...` havolasi orqali bir bosishda qo‘ng‘iroq qilish.
- **Bildirishnomalar markazi**: Har bir narx taklifi, kelishuv va holat o‘zgarishi haqida xabarnomalar.
- **Reyting va Sharhlar**: Xizmat sifati bo‘yicha baholash.

### 5. Backend va Supabase Integratsiyasi
- Loyihada **`supabase_schema.sql`** fayli mavjud.
- Supabase SQL Editor ga ushbu fayl kodini joylashtirib, barcha jadvallar (`profiles`, `vehicles`, `cargos`, `bids`, `orders`, `messages`, `notifications`, `reviews`) va Realtime kanallarini yaratishingiz mumkin.
- Ilovadagi **Supabase Sozlamalari** oynasi orqali istalgan paytda Project URL va Anon Key ni kiritib, Cloud bazasiga ulanish mumkin.
- Kalit kiritilmagan holda ham ilova **100% oflayn lokal dvigatel** orqali barcha tugma va funksiyalari bilan to‘liq ishlaydi!

---

## 💻 Kompyuterda Ishga Tushirish (Development & Web Preview)

```bash
# Papkaga kirish
cd C:\Users\Owner\.gemini\antigravity\scratch\yuktop-pwa

# Dev serverni yoqish
npm run dev

# Ishlab chiqarish buildi qilish
npm run build
```

Brauzerda `http://localhost:5173` manzili ochiladi.

---

## 🔨 Android APK ni Qaytadan Build Qilish (Gradle)

```bash
# 1. Web qismini build qilish
npm run build

# 2. Capacitor orqali Android papkasiga nusxalash
npx cap sync android

# 3. Gradle orqali APK yaratish
cd android
.\gradlew assembleDebug
```

Yangi APK fayli `android/app/build/outputs/apk/debug/app-debug.apk` manzilida hosil bo‘ladi.
