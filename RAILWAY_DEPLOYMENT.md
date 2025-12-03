# Railway Deployment Guide

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository with your code

## Step 1: Create New Project on Railway

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect the project

## Step 2: Configure Environment Variables

Add these environment variables in Railway dashboard:

### Required Variables:

```
NODE_ENV=production
DATABASE_URL=<your-mysql-connection-string>
JWT_SECRET=<random-secret-key>
VITE_APP_ID=<your-app-id>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=<your-open-id>
OWNER_NAME=<your-name>
BUILT_IN_FORGE_API_URL=<forge-api-url>
BUILT_IN_FORGE_API_KEY=<forge-api-key>
VITE_FRONTEND_FORGE_API_KEY=<frontend-forge-key>
VITE_FRONTEND_FORGE_API_URL=<frontend-forge-url>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
VITE_ANALYTICS_ENDPOINT=<analytics-endpoint>
VITE_ANALYTICS_WEBSITE_ID=<website-id>
VITE_APP_LOGO=<logo-url>
VITE_APP_TITLE=ATS CV Checker
```

### Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Add MySQL Database

1. In Railway dashboard, click "New" → "Database" → "Add MySQL"
2. Copy the `DATABASE_URL` from the MySQL service
3. Add it to your environment variables

## Step 4: Deploy

1. Railway will automatically build and deploy
2. Wait for deployment to complete
3. Click on the generated URL to view your app

## Step 5: Run Database Migrations

After first deployment:
1. Go to your service in Railway
2. Click "Settings" → "Deploy"  
3. Add a deploy command: `pnpm db:push`
4. Or run manually in Railway CLI:
   ```bash
   railway run pnpm db:push
   ```

## Troubleshooting

### Build fails
- Check build logs in Railway dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### App crashes on start
- Check runtime logs
- Verify all environment variables are set
- Ensure DATABASE_URL is correct

### Database connection fails
- Verify DATABASE_URL format
- Check MySQL service is running
- Ensure SSL is configured if required

## Custom Domain (Optional)

1. Go to service Settings → Domains
2. Click "Add Domain"
3. Enter your domain name
4. Update DNS records as instructed

## Monitoring

- View logs: Railway dashboard → your service → Logs
- Metrics: Railway dashboard → your service → Metrics
- Set up alerts in Settings → Notifications

## Cost Estimation

Railway free tier includes:
- $5 credit per month
- Enough for small apps with low traffic

For production:
- ~$10-20/month for app + database
- Pay only for what you use
