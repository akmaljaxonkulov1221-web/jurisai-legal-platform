# 🚀 Netlify Deployment Guide for JurisAI

## 📋 Prerequisites

- Netlify account ([signup](https://app.netlify.com/signup))
- GitHub repository with your code
- Supabase project (for authentication)
- All environment variables ready

## 🛠️ Step-by-Step Deployment

### Step 1: Install Netlify CLI (Optional)
```bash
npm install -g netlify-cli
# or add to devDependencies (already done)
```

### Step 2: Connect Netlify to GitHub

1. **Login to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click **Sign up** or **Log in**

2. **Create New Site**
   - Click **Add new site** → **Import an existing project**
   - Choose **GitHub**
   - Authorize Netlify to access your GitHub

3. **Select Repository**
   - Find `jurisai-legal-platform` repository
   - Click **Import**

### Step 3: Configure Build Settings

Netlify should auto-detect Next.js settings. If not, configure manually:

**Build settings:**
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `18`

**Or use netlify.toml** (already configured):
- The `netlify.toml` file contains all settings
- Netlify will automatically use this configuration

### Step 4: Set Environment Variables

1. **Go to Site Settings**
   - Select your site
   - Click **Site settings** → **Environment variables**

2. **Add Required Variables** (see NETLIFY-ENVIRONMENT-VARIABLES.md):

| Key | Value |
|-----|-------|
| `supabase_url` | `https://your-project.supabase.co` |
| `supabase_anon_key` | `your-supabase-anon-key` |
| `supabase_service_key` | `your-supabase-service-key` |
| `nextauth_secret` | `your-generated-secret` |
| `nextauth_url` | `https://your-site.netlify.app` |
| `openai_api_key` | `your-openai-key` (optional) |

3. **Save all variables**

### Step 5: Deploy

1. **Trigger Deploy**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

2. **Wait for Build**
   - Netlify will build and deploy your site
   - Usually takes 2-5 minutes

3. **Check Deployment**
   - Once deployed, visit your site URL
   - Test all features work correctly

## 🔧 Advanced Configuration

### Custom Domain (Optional)

1. **Go to Domain Settings**
   - Site settings → **Domain management**
   - Click **Add custom domain**

2. **Configure DNS**
   - Add your domain (e.g., `jurisai.uz`)
   - Follow DNS instructions provided by Netlify

3. **SSL Certificate**
   - Netlify automatically provisions SSL
   - Wait for certificate to be issued

### Edge Functions for API Routes

The `netlify.toml` already configures API routes as Edge Functions:

```toml
[[edge_functions]]
  path = "/api/*"
  function = "api"
```

### Redirects and Rewrites

Important redirects are configured in `netlify.toml`:
- API routes → Netlify Functions
- Dynamic routes → Index.html
- Static assets caching

## 🐛 Troubleshooting

### Common Build Issues

**Issue: Build fails with Next.js errors**
```
Solution: Check next.config.js settings
- Ensure output: 'export' is set
- Verify images.unoptimized: true
```

**Issue: API routes not working**
```
Solution: Check netlify.toml edge functions
- Verify [[edge_functions]] configuration
- Check redirect rules for /api/*
```

**Issue: Environment variables not working**
```
Solution: Verify variable names
- Check Netlify UI variable names
- Ensure they match code usage
- Trigger new deploy after adding variables
```

**Issue: Supabase connection errors**
```
Solution: Check Supabase configuration
- Verify supabase_url is correct
- Check anon and service keys
- Ensure CORS is configured in Supabase
```

### Debug Mode

Add these environment variables for debugging:
```
DEBUG=*
NEXT_PUBLIC_DEBUG=true
```

Remember to remove in production!

## 📊 Performance Optimization

### Build Optimization

The `next.config.js` is optimized for Netlify:
- Static export for faster builds
- Image optimization disabled (Netlify handles this)
- Code splitting configured

### Caching

Cache headers are set in `netlify.toml`:
- Static assets: 1 year cache
- API responses: No cache
- HTML pages: Short cache

### Bundle Analysis

To analyze your bundle:
```bash
npm install -g @next/bundle-analyzer
next build --analyze
```

## 🔄 Continuous Deployment

### Automatic Deploys

Netlify automatically deploys when you:
1. Push to main branch
2. Create pull request
3. Merge pull request

### Deploy Hooks

For manual deploys:
```bash
# Using Netlify CLI
netlify deploy --prod --dir=.next

# Or trigger webhook
POST https://api.netlify.com/build_hooks/your-hook-id
```

### Branch Deploys

Configure different environments:
- **Main branch**: Production
- **Develop branch**: Staging
- **Feature branches**: Preview

## 📱 Testing After Deployment

### Critical Tests

1. **Homepage loads correctly**
2. **Navigation works**
3. **All modules accessible**
4. **API endpoints respond**
5. **Authentication works**
6. **Forms submit correctly**
7. **Mobile responsive**

### Test Checklist

- [ ] Homepage: `https://your-site.netlify.app`
- [ ] Dashboard: `/dashboard`
- [ ] IRAC Solver: `/irac`
- [ ] Decision Tree: `/decision-tree`
- [ ] Legal Database: `/legal-database`
- [ ] All other modules
- [ ] API endpoints: `/api/*`
- [ ] Authentication flow
- [ ] Mobile responsiveness

## 🎯 Production Best Practices

### Security

1. **Environment Variables**
   - Never commit secrets to Git
   - Use different keys for production
   - Rotate keys regularly

2. **HTTPS**
   - Netlify provides automatic HTTPS
   - No additional configuration needed

3. **CORS**
   - Configure Supabase CORS for your domain
   - Update allowed origins in Supabase

### Monitoring

1. **Netlify Analytics**
   - Enable in Site settings → Analytics
   - Monitor traffic and performance

2. **Error Tracking**
   - Check Deploy logs for errors
   - Monitor Netlify Functions logs

### Performance

1. **Core Web Vitals**
   - Monitor LCP, FID, CLS
   - Optimize images and scripts

2. **Bundle Size**
   - Keep JavaScript bundle small
   - Use dynamic imports for large components

## 🆘 Support

### Netlify Support
- [Netlify Docs](https://docs.netlify.com/)
- [Community Forum](https://community.netlify.com/)
- [Support Chat](https://www.netlify.com/support)

### Common Resources
- [Next.js on Netlify](https://docs.netlify.com/framework-guides/nextjs/)
- [Environment Variables Guide](https://docs.netlify.com/environment-variables/)
- [Edge Functions](https://docs.netlify.com/edge-functions/)

---

**🎉 Your JurisAI platform is now ready for production on Netlify!**

Remember to test thoroughly after deployment and monitor performance regularly.
