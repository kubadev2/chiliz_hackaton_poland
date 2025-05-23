import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import YourNFTs from './YourNFTs.tsx';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { chilizSpicy } from './chains/chilizSpicy';

const config = getDefaultConfig({
  appName: 'chilizz test',
  projectId: '6326102dcaf8e4badf10cfdf1c78af60',
  chains: [chilizSpicy],
  ssr: false,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/your-nfts" element={<YourNFTs/>} />
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
