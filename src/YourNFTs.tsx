// src/pages/YourNFTs.tsx
import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import Header from './Header';

const nftContracts = [
    '0x8CAec4dC4fe4698A6a249fe5Baf62832880aE22C', // Dodawaj tu kolejne adresy kontraktów
];

export default function YourNFTs() {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const [nfts, setNfts] = useState<{ tokenId: number; image: string; contract: string }[]>([]);

    useEffect(() => {
        if (!isConnected || !address || !publicClient) return;

        const fetchNFTs = async () => {
            const provider = new ethers.JsonRpcProvider(publicClient.transport.url);
            const allNFTs: typeof nfts = [];

            for (const contractAddr of nftContracts) {
                const contract = new ethers.Contract(contractAddr, abi, provider);

                try {
                    const total = await contract.nextTokenId();

                    for (let tokenId = 1; tokenId < total; tokenId++) {
                        try {
                            const owner = await contract.ownerOf(tokenId);
                            if (owner.toLowerCase() !== address.toLowerCase()) continue;

                            const uri = await contract.tokenURI(tokenId);
                            const metadataUrl = uri.replace('ipfs://', 'https://nftstorage.link/ipfs/');
                            const metadata = await fetch(metadataUrl).then(res => res.json());
                            const image = metadata.image.replace('ipfs://', 'https://nftstorage.link/ipfs/');

                            allNFTs.push({ tokenId, image, contract: contractAddr });
                        } catch (_) {
                            // Token does not exist or isn't owned — skip
                        }
                    }
                } catch (err) {
                    console.error(`Failed to fetch NFTs from ${contractAddr}`, err);
                }
            }

            setNfts(allNFTs);
        };

        fetchNFTs();
    }, [address, isConnected, publicClient]);

    return (
        <>
            <Header />
            <main style={{ paddingTop: '100px', backgroundColor: '#111', minHeight: '100vh', color: 'white', width: '100vw' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your digital memorabilia.</h1>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Every NFT is a unique memory from the match. Collect, share, unlock rewards.</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                    {nfts.length === 0 ? (
                        <p>You don't own any NFTs yet.</p>
                    ) : (
                        nfts.map(({ tokenId, image, contract }) => (
                            <div key={`${contract}-${tokenId}`} style={{ background: '#222', padding: '1rem', borderRadius: '1rem' }}>
                                <img src={image} alt={`NFT ${tokenId}`} style={{ width: 200, borderRadius: '0.5rem' }} />
                                <p style={{ marginTop: '0.5rem' }}>Token #{tokenId}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </>
    );
}
