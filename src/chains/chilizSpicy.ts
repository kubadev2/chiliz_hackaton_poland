// src/chains/chilizSpicy.ts
import { defineChain } from 'viem'

export const chilizSpicy = defineChain({
    id: 88882,
    name: 'Chiliz Spicy Testnet',
    nativeCurrency: {
        name: 'CHZ',
        symbol: 'CHZ',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://spicy-rpc.chiliz.com'],
        },
        public: {
            http: ['https://spicy-rpc.chiliz.com'],
        },
    },
    blockExplorers: {
        default: { name: 'Chiliz Explorer', url: 'https://spicy-explorer.chiliz.com' },
    },
    testnet: true,
});
