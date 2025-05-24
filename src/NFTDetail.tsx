// src/pages/NFTDetail.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import Header from './Header';
import { usePublicClient } from 'wagmi';

export default function NFTDetail() {
    const { contract, tokenId } = useParams();
    const publicClient = usePublicClient();
    const [metadata, setMetadata] = useState<{ name: string; description: string; image: string } | null>(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            if (!contract || !tokenId || !publicClient) return;

            try {
                const provider = new ethers.JsonRpcProvider(publicClient.transport.url);
                const nftContract = new ethers.Contract(contract, abi, provider);
                const uri = await nftContract.tokenURI(tokenId);
                const metadataUrl = uri.replace('ipfs://', 'https://nftstorage.link/ipfs/');
                const data = await fetch(metadataUrl).then(res => res.json());
                const imageUrl = data.image.replace('ipfs://', 'https://nftstorage.link/ipfs/');
                setMetadata({ name: data.name, description: data.description, image: imageUrl });
            } catch (err) {
                console.error('❌ Error loading NFT metadata:', err);
            }
        };

        fetchMetadata();
    }, [contract, tokenId, publicClient]);

    return (
        <>
            <Header />
            <main
                style={{
                    paddingTop: '100px',
                    backgroundColor: '#111',
                    minHeight: '100vh',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100vw',
                    paddingBottom: '2rem',
                }}
            >
                {metadata ? (
                    <div
                        style={{
                            background: '#222',
                            padding: '2rem',
                            borderRadius: '1rem',
                            maxWidth: '500px',
                            width: '90%',
                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                            textAlign: 'center',
                        }}
                    >
                        <img
                            src={metadata.image}
                            alt={metadata.name}
                            style={{ width: '100%', borderRadius: '1rem', marginBottom: '1.5rem' }}
                        />
                        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                            {metadata.name} <span style={{ color: '#ccc' }}>#{tokenId}</span>
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#bbb' }}>{metadata.description}</p>
                    </div>
                ) : (
                    <p style={{ color: '#aaa' }}>Loading NFT details...</p>
                )}
            </main>
        </>
    );
}
