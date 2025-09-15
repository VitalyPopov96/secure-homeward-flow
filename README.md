# Secure Homeward Flow

A decentralized remittance platform built with React, TypeScript, and FHE (Fully Homomorphic Encryption) technology for secure cross-border money transfers.

## Features

- 🔐 **FHE Encryption**: All sensitive financial data is encrypted using Fully Homomorphic Encryption
- 🌐 **Multi-Chain Support**: Built on Sepolia testnet with support for multiple blockchain networks
- 💳 **Wallet Integration**: Seamless integration with popular wallets like Rainbow, MetaMask, and more
- 🗺️ **Global Coverage**: Interactive map showing remittance routes and transaction flows
- 📊 **Real-time Analytics**: Live transaction tracking and impact reporting
- 🛡️ **Privacy-First**: Zero-knowledge proof system for transaction privacy

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia), Wagmi, Viem
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **Wallet**: RainbowKit, WalletConnect
- **Maps**: Mapbox GL
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VitalyPopov96/secure-homeward-flow.git
cd secure-homeward-flow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Smart Contracts

The platform uses FHE-enabled smart contracts for secure transaction processing:

- **CharityNexus.sol**: Main contract handling encrypted remittance transactions
- **FHE Integration**: All sensitive data (amounts, recipient info) is encrypted
- **Privacy**: Zero-knowledge proofs for transaction verification

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Security

This project implements multiple layers of security:

- FHE encryption for all sensitive data
- Smart contract access controls
- Wallet signature verification
- Secure key management

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Multi-chain expansion (Polygon, Arbitrum)
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with traditional banking systems
- [ ] Compliance and regulatory features