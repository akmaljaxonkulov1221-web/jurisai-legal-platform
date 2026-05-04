# 🚀 Cloudflare Pages Production Deployment Guide

## ✅ **Barcha o'zgarishlar amalga oshirildi!**

### 📋 **Qilingan ishlar:**

#### **1. Next.js Configuration ✅**
- `next.config.js` ga `output: 'export'` qo'shildi
- `distDir: 'out'` sozlandi
- Edge Runtime konfiguratsiyasi qo'shildi

#### **2. Dependencies ✅**
- `@cloudflare/next-on-pages` paketi qo'shildi
- Yangi build scriptlar yaratildi:
  - `build:cloudflare` - Cloudflare uchun build
  - `pages:build` - Pages build
  - `pages:deploy` - Deploy qilish

#### **3. Wrangler Configuration ✅**
- `wrangler.toml` to'g'ri sozlandi
- `pages_build_output_dir = ".vercel/output/static"`
- Build command: `npm run build:cloudflare`

#### **4. Edge Runtime ✅**
- AI API route lariga `export const runtime = 'edge'` qo'shildi
- Boshqa API route lar ham tayyor

---

## 🌐 **Cloudflare Dashboard Qadam-baqam Yo'riqnoma**

### **1-qadam: Cloudflare.com ga kiring**
1. [Cloudflare.com](https://cloudflare.com) ga kiring
2. Account ga kiring
3. **"Pages"** tugmasini bosing

### **2-qadam: Yangi project yarating**
1. **"Create a project"** ni bosing
2. **"Connect to Git"** ni tanlang
3. **GitHub** ni tanlang va authorize qiling
4. **`jurisai-legal-platform`** repositoryni tanlang
5. **"Begin setup"** ni bosing

### **3-qadam: Build sozlamalari**
```
Framework preset: Next.js
Build command: npm run build:cloudflare
Build output directory: .vercel/output/static
Node.js version: 20
```

### **4-qadam: Environment Variables**
**"Environment variables"** qismiga quyidagilarni qo'shing:

#### **Production Environment:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXTAUTH_SECRET=your_32_character_secret
NEXTAUTH_URL=https://your-site.pages.dev
OPENAI_API_KEY=sk-your-openai-key
```

#### **Preview Environment (ixtiyoriy):**
Shu kalitlarni preview uchun ham qo'shing

### **5-qadam: Build va Deploy**
1. **"Save and Deploy"** ni bosing
2. Build jarayoni boshlanadi (2-3 daqiqa)
3. Deploy tugagandan so'ng site tayyor bo'ladi

### **6-qadam: Custom Domain (ixtiyoriy)**
1. **"Custom domains"** ga boring
2. O'zingizning domainingizni qo'shing
3. DNS sozlamalarini yangilang

---

## 🔑 **Environment Variables Qanday Olish Kerak**

### **Supabase:**
1. [Supabase.com](https://supabase.com) → New Project
2. Settings → API
3. Project URL va anon key ni nusqa oling

### **NextAuth Secret:**
```bash
openssl rand -base64 32
```

### **OpenAI API Key:**
1. [OpenAI Platform](https://platform.openai.com)
2. API Keys → Create new secret key

---

## 🚀 **Deploydan Keyin:**

### **Tekshirish:**
1. **Site URL** ni oching
2. Barcha page lar ishlashini tekshiring
3. API route lar ishlashini tekshiring
4. Authentication ishlashini tekshiring

### **Agar xato bo'lsa:**
1. **"Deployments"** → **"View build log"**
2. Xatolarni tekshiring
3. Environment variables to'g'ri sozlanganligini tekshiring

---

## 🎯 **Muvaffaqiyat belgilari:**

### **✅ Build muvaffaqiyatli:**
- Build log da "Success" yozuvi bo'ladi
- "Deploy succeeded" xabari keladi

### **✅ Site ishlaydi:**
- Homepage ochiladi
- Navigation ishlaydi
- API route lar javob beradi

### **✅ Authentication ishlaydi:**
- Signin/Signup ishlaydi
- Dashboard ga kirish mumkin

---

## 📞 **Yordam kerak bo'lsa:**

1. **Cloudflare Docs:** [docs.cloudflare.com](https://docs.cloudflare.com)
2. **Next.js on Cloudflare:** [developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
3. **Support:** Cloudflare dashboard → "Get support"

---

**🎉 JurisAI platformasi endi Cloudflare Pages da ishlaydi!** 

**Qisqacha: Connect Git → Configure Build → Add Environment Variables → Deploy!** 🚀⚖️☁️
