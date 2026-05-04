# JurisAI Environment Variables Setup Guide

## 🔑 Environment Variables

Bu environment variable larni olish uchun quyidagi xizmatlardan ro'yxatdan o'tishingiz kerak:

### 1. Supabase (Eng muhim)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Qayerdan olish:**
1. [Supabase.com](https://supabase.com) ga kiring
2. "New Project" ni bosing
3. Project yaratgandan so'ng:
   - Project settings → API ga boring
   - "Project URL" ni nusxa oling → `NEXT_PUBLIC_SUPABASE_URL`
   - "anon public" key ni nusxa oling → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. NextAuth (Authentication)
```
NEXTAUTH_SECRET=random_secret_string
NEXTAUTH_URL=https://your-site.netlify.app
```

**Qayerdan olish:**
- `NEXTAUTH_SECRET`: Quyidagi command ni ishga tushuring:
  ```bash
  openssl rand -base64 32
  ```
- `NEXTAUTH_URL`: Netlify da yuklaganingizdan so'ng, sizning site URL

### 3. OpenAI (AI funksiyalari uchun)
```
OPENAI_API_KEY=your_openai_api_key
```

**Qayerdan olish:**
1. [OpenAI Platform](https://platform.openai.com) ga kiring
2. "API Keys" ga boring
3. "Create new secret key" ni bosing
4. Kalitni nusxa oling

## 🚀 Netlify-da Sozlash

### 1. Netlify.com ga kiring
### 2. Sizning site ni tanlang
### 3. "Site settings" → "Environment variables" ga boring
### 4. Quyidagilarni qo'shing:

**Supabase:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://your-project.supabase.co`
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**NextAuth:**
- Key: `NEXTAUTH_SECRET`
- Value: `random_32_character_string`
- Key: `NEXTAUTH_URL`
- Value: `https://your-site.netlify.app`

**OpenAI (agar kerak bo'lsa):**
- Key: `OPENAI_API_KEY`
- Value: `sk-...`

## ⚠️ Muhim Eslatmalar

1. **Supabase majburiy** - platforma ishlashi uchun kerak
2. **NextAuth majburiy** - authentication uchun kerak  
3. **OpenAI ixtiyoriy** - AI funksiyalari uchun kerak
4. **Hech qachon .env faylini GitHub ga yuklamang!**
5. **Environment variable larni har doim maxfiy saqlang!**

## 🛡️ Xavfsizlik

- Bu kalitlar hech qachon public repository ga yuklanmasligi kerak
- Netlify da ular "encrypted" ko'rinishda saqlanadi
- Faqat siz va jamoangiz ko'rishi mumkin

## 📞 Agar yordam kerak bo'lsa

1. Supabase: [supabase.com/docs](https://supabase.com/docs)
2. NextAuth: [next-auth.js.org](https://next-auth.js.org)
3. OpenAI: [platform.openai.com](https://platform.openai.com)

---

**🎉 Bu variable larni soqlab, JurisAI platformasi to'liq ishlaydi!**
