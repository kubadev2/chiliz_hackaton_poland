// src/pages/YourNFTs.tsx
import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import Header from './Header';
import { Link } from 'react-router-dom';
import { nftContracts } from './nftContracts';

export default function YourNFTs() {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const [nfts, setNfts] = useState<{ tokenId: number; image: string; name: string; contract: string }[]>([]);

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
                            const name = metadata.name || `Token #${tokenId}`;

                            allNFTs.push({ tokenId, image, name, contract: contractAddr });
                        } catch (_) {
                            // Token nie istnieje lub nie należy do użytkownika — pomiń
                        }
                    }
                } catch (err) {
                    console.error(`❌ Błąd pobierania NFT z ${contractAddr}:`, err);
                }
            }

            setNfts(allNFTs);
        };

        fetchNFTs();
    }, [address, isConnected, publicClient]);

    return (
        <>
            <Header />
            <main
                style={{
                    paddingTop: '100px',
                    backgroundColor: '#111',
                    minHeight: '100vh',
                    color: 'white',
                    width: '100vw',
                }}
            >
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Your digital memorabilia.</h1>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 400 }}>
                    Every NFT is a unique memory from the match. Collect, share, unlock rewards.
                </h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
                    {nfts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#aaa' }}>You don't own any NFTs yet.</p>
                    ) : (
                        nfts.map(({ tokenId, image, name, contract }) => (
                            <Link
                                to={`/nft/${contract}/${tokenId}`}
                                key={`${contract}-${tokenId}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div
                                    style={{
                                        background: '#222',
                                        padding: '1rem',
                                        borderRadius: '1rem',
                                        width: 220,
                                        textAlign: 'center',
                                    }}
                                >
                                    <img src={image} alt={`NFT ${tokenId}`} style={{ width: '100%', borderRadius: '0.5rem' }} />
                                    <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#fff' }}>{name}</p>
                                    <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Token #{tokenId}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </>
    );
}
