# Cloudflare Pages Environment Variables Setup Guide

## 🔑 Environment Variables (To'ldirish kerak)

Quyidagi kalitlarni oling va Cloudflare Pages da sozlang:

### 1. Supabase (Eng muhim - majburiy)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Qanday olish:**
1. [Supabase.com](https://supabase.com) ga kiring
2. "New Project" → Project yarating
3. Project settings → API ga boring
4. "Project URL" ni nusxa oling → `NEXT_PUBLIC_SUPABASE_URL`
5. "anon public" key ni nusxa oling → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. NextAuth (Majburiy)
```
NEXTAUTH_SECRET=random_32_character_string_here
NEXTAUTH_URL=https://your-site-name.pages.dev
```

**Qanday olish:**
- `NEXTAUTH_SECRET`: Quyidagi command ni ishga tushuring:
  ```bash
  openssl rand -base64 32
  ```
  Yoki online generator: https://generate-secret.vercel.app/32
- `NEXTAUTH_URL`: Cloudflare Pages da yuklagandan so'ng sizning site URL

### 3. OpenAI (Ixtiyoriy - AI funksiyalari uchun)
```
OPENAI_API_KEY=sk-...your-openai-api-key-here...
```

**Qanday olish:**
1. [OpenAI Platform](https://platform.openai.com) ga kiring
2. "API Keys" ga boring
3. "Create new secret key" ni bosing
4. Kalitni nusxa oling

## 🚀 Cloudflare Pages da Sozlash

### 1. Cloudflare Dashboard
1. **Cloudflare.com** → **Pages** ga boring
2. **Sizning project** ni tanlang
3. **"Settings"** → **"Environment variables"** ga boring

### 2. Variables qo'shing
**Production environment:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://your-project.supabase.co`
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Key: `NEXTAUTH_SECRET`
- Value: `random_32_character_string`
- Key: `NEXTAUTH_URL`
- Value: `https://your-site.pages.dev`
- Key: `OPENAI_API_KEY`
- Value: `sk-...` (agar kerak bo'lsa)

### 3. Preview environment (ixtiyoriy)
Preview uchun ham shu kalitlarni qo'shing

## 📋 Example (To'g'ri ko'rinish)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abc123def.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2NjY5NzQ0LCJleHAiOjE5MzIyNDU3NDR9.4kK8X5b2N6v7J8Q9R3w2X1Y6Z5V4W7U2T9S0N3M6L8

# NextAuth
NEXTAUTH_SECRET=super_secret_random_string_32_chars_long
NEXTAUTH_URL=https://jurisai.pages.dev

# OpenAI (agar kerak bo'lsa)
OPENAI_API_KEY=sk-1234567890abcdef1234567890abcdef12345678
```

## ⚠️ Muhim eslatmalar

1. **Hech qachon** haqiqiy API kalitlarini GitHub ga yuklamang!
2. **Supabase** - platforma ishlashi uchun majburiy
3. **NextAuth** - authentication uchun majburiy
4. **OpenAI** - faqat AI funksiyalari uchun kerak
5. **Kalitlarni** har doim maxfiy saqlang!

## 🛡️ Xavfsizlik

- Bu kalitlar Cloudflare da encrypted ko'rinishda saqlanadi
- Faqat siz va jamoangiz ko'rishi mumkin
- Hech qachon ularni public qilmang

## 🎯 Tez sozlash

1. **Supabase** da project yarating (5 daqiqa)
2. **NextAuth secret** yarating (1 daqiqa)
3. **Cloudflare** da variables qo'shing (2 daqiqa)
4. **Deploy** qiling (automatik)

---

**🎉 Barcha kalitlarni sozlab, JurisAI platformasi to'liq ishlaydi!**
