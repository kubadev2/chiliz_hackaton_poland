import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi_medals.json';
import Header from './Header';

const SILVER_CONTRACT = '0xf870601EBA3B16183564cA5F0cfb6263C43C3dBa';
const GOLD_CONTRACT = '0xcD53341daDBe46Ace8118eE18229071D9A0d9A3B';

export default function Rewards() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [canMintSilver, setCanMintSilver] = useState(false);
    const [canMintGold, setCanMintGold] = useState(false);
    const [silverImage, setSilverImage] = useState('');
    const [goldImage, setGoldImage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!address || !publicClient) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const provider = new ethers.JsonRpcProvider(publicClient.transport.url);

                const silver = new ethers.Contract(SILVER_CONTRACT, abi, provider);
                const gold = new ethers.Contract(GOLD_CONTRACT, abi, provider);

                const [silverEligible, goldEligible] = await Promise.all([
                    silver.canMint(address),
                    gold.canMint(address),
                ]);

                setCanMintSilver(silverEligible);
                setCanMintGold(goldEligible);

                const [silverTokenURI, goldTokenURI] = await Promise.all([
                    silver.tokenURI(1),
                    gold.tokenURI(1),
                ]);

                console.log('📦 Silver Token URI:', silverTokenURI);
                console.log('📦 Gold Token URI:', goldTokenURI);

                const [silverMeta, goldMeta] = await Promise.all([
                    fetch(silverTokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')).then(res => res.json()),
                    fetch(goldTokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')).then(res => res.json()),
                ]);

                console.log('🧾 Silver Metadata:', silverMeta);
                console.log('🧾 Gold Metadata:', goldMeta);

                setSilverImage(silverMeta.image.replace('ipfs://', 'https://ipfs.io/ipfs/'));
                setGoldImage(goldMeta.image.replace('ipfs://', 'https://ipfs.io/ipfs/'));
            } catch (err) {
                console.error('❌ Error fetching metadata:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [address, publicClient]);

    const handleMint = async (contractAddress: string) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const tx = await contract.mint();
            await tx.wait();
            alert("✅ Mint successful!");
        } catch (err) {
            console.error('❌ Mint error:', err);
            alert("Mint failed or cancelled.");
        }
    };

    const renderMedalCard = (
        name: string,
        imageUrl: string,
        canMint: boolean,
        loading: boolean,
        onMint: () => void
    ) => (
        <div
            style={{
                background: '#222',
                borderRadius: '1rem',
                padding: '2rem',
                width: '320px',
                textAlign: 'center',
                boxShadow: '0 0 10px rgba(255,255,255,0.05)',
            }}
        >
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={name}
                    style={{
                        width: '100%',
                        maxHeight: '320px',
                        objectFit: 'contain',
                        borderRadius: '1rem',
                        marginBottom: '1rem',
                    }}
                />
            )}
            <h3>{name}</h3>
            <p>You need at least {name.includes('Silver') ? 2 : 5} NFTs from the approved collections.</p>
            <button
                onClick={onMint}
                disabled={!canMint || loading}
                style={{
                    marginTop: '1rem',
                    padding: '0.8rem 1.5rem',
                    fontSize: '1rem',
                    background: canMint
                        ? 'linear-gradient(to right, #aaa, #ccc)'
                        : '#555',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: canMint ? 'pointer' : 'not-allowed',
                }}
            >
                {loading ? 'Checking...' : canMint ? 'Mint' : 'Not eligible'}
            </button>
        </div>
    );

    return (
        <>
            <Header />
            <main
                style={{
                    paddingTop: '100px',
                    backgroundColor: '#111',
                    color: 'white',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100vw',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        maxWidth: '1000px',
                        padding: '1rem',
                    }}
                >
                    {renderMedalCard('🥈 Silver Medal', silverImage, canMintSilver, loading, () => handleMint(SILVER_CONTRACT))}
                    {renderMedalCard('🥇 Gold Medal', goldImage, canMintGold, loading, () => handleMint(GOLD_CONTRACT))}
                </div>
            </main>
        </>
    );
}
