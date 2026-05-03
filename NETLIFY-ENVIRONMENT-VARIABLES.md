# Netlify Environment Variables Configuration

## 🔐 Required Environment Variables for Netlify

### Supabase Configuration
These variables are required for Supabase authentication and database:

| Variable Name | Netlify Variable | Description | Example |
|---------------|------------------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `supabase_url` | Supabase project URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `supabase_anon_key` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `supabase_service_key` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Authentication Configuration
| Variable Name | Netlify Variable | Description | Example |
|---------------|------------------|-------------|---------|
| `NEXTAUTH_SECRET` | `nextauth_secret` | NextAuth.js secret key | `your-secret-key-here` |
| `NEXTAUTH_URL` | `nextauth_url` | NextAuth.js URL | `https://your-site.netlify.app` |

### Optional: OpenAI Configuration (if using AI features)
| Variable Name | Netlify Variable | Description | Example |
|---------------|------------------|-------------|---------|
| `OPENAI_API_KEY` | `openai_api_key` | OpenAI API key for AI features | `sk-...` |

## 🚀 How to Set Up in Netlify

### Step 1: Go to Netlify Dashboard
1. Login to [Netlify](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Environment variables**

### Step 2: Add Environment Variables
For each variable:
1. Click **Add variable**
2. Enter the **Key** (Netlify Variable name from table above)
3. Enter the **Value** (your actual secret)
4. Click **Save**

### Step 3: Deploy
After setting all variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

## 📋 Complete Setup Checklist

- [ ] `supabase_url` - Get from Supabase Dashboard → Settings → API
- [ ] `supabase_anon_key` - Get from Supabase Dashboard → Settings → API  
- [ ] `supabase_service_key` - Get from Supabase Dashboard → Settings → API
- [ ] `nextauth_secret` - Generate random string (use: `openssl rand -base64 32`)
- [ ] `nextauth_url` - Your Netlify site URL
- [ ] `openai_api_key` - Get from OpenAI Dashboard (if using AI features)

## 🔍 How to Get Values

### Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `supabase_url`
   - **anon public** key → `supabase_anon_key`
   - **service_role** key → `supabase_service_key`

### NextAuth Secret
Generate a secure secret:
```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### NextAuth URL
Your Netlify site URL:
```
https://your-site-name.netlify.app
```

### OpenAI API Key (Optional)
1. Go to [OpenAI Dashboard](https://platform.openai.com/api-keys)
2. Create new API key
3. Copy the key (starts with `sk-`)

## ⚠️ Important Notes

1. **Never commit secrets to Git** - Always use environment variables
2. **Use different values for production** - Don't use development keys
3. **Test after deployment** - Verify all features work with production variables
4. **Keep secrets secure** - Only share with trusted team members

## 🐛 Troubleshooting

### Common Issues:
- **Supabase connection errors**: Check URL and keys are correct
- **Auth errors**: Verify NEXTAUTH_SECRET and NEXTAUTH_URL
- **API errors**: Ensure all required variables are set
- **Build failures**: Check for missing environment variables

### Debug Mode:
Add these variables for debugging:
```
DEBUG=*
NEXT_PUBLIC_DEBUG=true
```

Remember to remove debug variables in production!
