import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import Header from './Header';
import { nftContracts } from './nftContracts';



export default function Leaderboard() {
  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();
  const [topHolders, setTopHolders] = useState<{ address: string; count: number }[]>([]);

  useEffect(() => {
    if (!publicClient) return;

    const fetchLeaderboard = async () => {
      const provider = new ethers.JsonRpcProvider(publicClient.transport.url);
      const holderMap = new Map<string, number>();

      for (const contractAddr of nftContracts) {
        const contract = new ethers.Contract(contractAddr, abi, provider);

        try {
          const total = await contract.nextTokenId();

          for (let tokenId = 1; tokenId < total; tokenId++) {
            try {
              const owner = await contract.ownerOf(tokenId);
              const ownerLower = owner.toLowerCase();
              holderMap.set(ownerLower, (holderMap.get(ownerLower) || 0) + 1);
            } catch (_) {
              // Token nie istnieje lub błąd – pomiń
            }
          }
        } catch (err) {
          console.error(`Error reading contract ${contractAddr}`, err);
        }
      }

      const sorted = Array.from(holderMap.entries())
        .map(([address, count]) => ({ address, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setTopHolders(sorted);
    };

    fetchLeaderboard();
  }, [publicClient]);

  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px', background: '#111', color: 'white', minHeight: '100vh', textAlign: 'center', width: '100vw' }}>
        <h1 style={{ marginBottom: '2rem' }}>🏆 Top 10 Holders</h1>
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '90%', maxWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>NFTs</th>
            </tr>
          </thead>
          <tbody>
            {topHolders.map(({ address, count }, idx) => (
              <tr key={address} style={{ borderBottom: '1px solid #333' }}>
                <td style={tdStyle}>{idx + 1}</td>
                <td style={tdStyle}>
                  {address === userAddress?.toLowerCase()
                    ? 'You'
                    : `${address.slice(0, 6)}...${address.slice(-4)}`}
                </td>
                <td style={tdStyle}>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0.75rem',
  fontWeight: 'bold',
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem',
};
