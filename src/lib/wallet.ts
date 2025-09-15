import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Wallet configuration with conflict resolution
export const config = getDefaultConfig({
  appName: 'Secure Homeward Flow',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475',
  chains: [sepolia],
  ssr: false,
  // Prevent wallet injection conflicts
  walletConnectOptions: {
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475',
  },
});

export const chains = [sepolia];
