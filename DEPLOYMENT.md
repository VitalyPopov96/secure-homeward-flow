# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Secure Homeward Flow application to Vercel.

## Prerequisites

- GitHub account with access to the repository
- Vercel account (free tier available)
- Environment variables ready

## Step-by-Step Deployment

### Step 1: Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project" on the dashboard

### Step 2: Import GitHub Repository

1. In the "Import Git Repository" section, search for `VitalyPopov96/secure-homeward-flow`
2. Click "Import" next to the repository
3. Vercel will automatically detect it's a Vite React project

### Step 3: Configure Project Settings

1. **Project Name**: `secure-homeward-flow` (or your preferred name)
2. **Framework Preset**: Vite (should be auto-detected)
3. **Root Directory**: `./` (default)
4. **Build Command**: `npm run build` (default)
5. **Output Directory**: `dist` (default)
6. **Install Command**: `npm install` (default)

### Step 4: Set Environment Variables

Click "Environment Variables" and add the following:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=your_rpc_endpoint_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
NEXT_PUBLIC_RPC_URL=your_alternative_rpc_url
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_FHE_NETWORK_URL=your_fhe_network_url_here
```

**Important**: Replace placeholder values with actual tokens:
- `your_mapbox_token_here`: Get from [Mapbox](https://www.mapbox.com/)
- `your_fhe_network_url_here`: Your FHE network endpoint

### Step 5: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Vercel will provide a deployment URL (e.g., `https://secure-homeward-flow.vercel.app`)

### Step 6: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate to be issued

## Post-Deployment Configuration

### Step 7: Update Smart Contract Address

1. Deploy the `SecureHomewardFlow.sol` contract to Sepolia testnet
2. Update the contract address in `src/hooks/useContract.ts`:
   ```typescript
   const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
   ```
3. Commit and push changes to trigger automatic redeployment

### Step 8: Test Deployment

1. Visit your deployed URL
2. Test wallet connection functionality
3. Verify all features work correctly
4. Check console for any errors

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CHAIN_ID` | Ethereum chain ID (11155111 for Sepolia) | Yes |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint for blockchain connection | Yes |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `NEXT_PUBLIC_INFURA_API_KEY` | Infura API key for RPC access | Yes |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox token for map functionality | Optional |
| `NEXT_PUBLIC_FHE_NETWORK_URL` | FHE network endpoint | Optional |

## Troubleshooting

### Build Failures

1. **Dependency Issues**: Ensure all dependencies are in `package.json`
2. **TypeScript Errors**: Fix any TypeScript compilation errors
3. **Environment Variables**: Verify all required variables are set

### Runtime Issues

1. **Wallet Connection**: Check WalletConnect project ID
2. **RPC Connection**: Verify RPC URL and API key
3. **Contract Interaction**: Ensure contract is deployed and address is correct

### Performance Optimization

1. **Bundle Size**: Use Vite's bundle analyzer to optimize
2. **Image Optimization**: Compress images in `public/` folder
3. **Caching**: Configure proper cache headers in Vercel

## Automatic Deployments

Vercel automatically deploys when you push to the main branch:

1. Push changes to GitHub
2. Vercel detects the push
3. Builds and deploys automatically
4. Sends deployment notifications

## Monitoring and Analytics

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Monitor deployment logs
3. **Performance**: Use Vercel's performance insights

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **API Keys**: Rotate keys regularly
3. **HTTPS**: Vercel provides SSL by default
4. **CORS**: Configure if needed for API calls

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)

## Quick Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VitalyPopov96/secure-homeward-flow)

Click the button above to deploy directly to Vercel with one click.
