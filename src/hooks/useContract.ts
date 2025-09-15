import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "transactionId", "type": "uint256"}
    ],
    "name": "getTransactionInfo",
    "outputs": [
      {"internalType": "string", "name": "recipientName", "type": "string"},
      {"internalType": "string", "name": "recipientCountry", "type": "string"},
      {"internalType": "string", "name": "purpose", "type": "string"},
      {"internalType": "address", "name": "sender", "type": "address"},
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "uint8", "name": "amount", "type": "uint8"},
      {"internalType": "uint8", "name": "fee", "type": "uint8"},
      {"internalType": "uint8", "name": "exchangeRate", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "bool", "name": "isCompleted", "type": "bool"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "uint256", "name": "completionTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "getUserReputation",
    "outputs": [
      {"internalType": "uint8", "name": "", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "getUserTransactionCount",
    "outputs": [
      {"internalType": "uint8", "name": "", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - This would be the deployed contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual address

export function useContract() {
  const { address } = useAccount();
  
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractABI: CONTRACT_ABI,
    userAddress: address,
  };
}

export function useTransactionInfo(transactionId: number) {
  const { contractAddress, contractABI } = useContract();
  
  return useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getTransactionInfo',
    args: [BigInt(transactionId)],
  });
}

export function useUserReputation(userAddress?: string) {
  const { contractAddress, contractABI } = useContract();
  
  return useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getUserReputation',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });
}

export function useUserTransactionCount(userAddress?: string) {
  const { contractAddress, contractABI } = useContract();
  
  return useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getUserTransactionCount',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });
}

export function useCreateRemittance() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const createRemittance = async (params: {
    amount: string;
    fee: string;
    recipientName: string;
    recipientCountry: string;
    purpose: string;
    recipient: string;
  }) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createRemittance',
        args: [
          params.amount,
          params.fee,
          params.recipientName,
          params.recipientCountry,
          params.purpose,
          params.recipient as `0x${string}`,
          "0x" // inputProof placeholder
        ],
        value: BigInt(params.amount), // ETH amount
      });
    } catch (err) {
      console.error('Error creating remittance:', err);
    }
  };
  
  return {
    createRemittance,
    hash,
    isPending,
    error,
  };
}

export function useCompleteTransaction() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const completeTransaction = async (transactionId: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'completeTransaction',
        args: [BigInt(transactionId)],
      });
    } catch (err) {
      console.error('Error completing transaction:', err);
    }
  };
  
  return {
    completeTransaction,
    hash,
    isPending,
    error,
  };
}

export function useTransactionReceipt(hash: `0x${string}` | undefined) {
  return useWaitForTransactionReceipt({
    hash,
  });
}
