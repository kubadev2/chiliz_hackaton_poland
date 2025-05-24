import abiPlayerCard from './abi_player_card.json';
import { useAccount, usePublicClient, useConnect } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { injected } from 'wagmi/connectors';
import Header from './Header';

const pedroPauletaContract = '0xE521d2F53CAF47cEb9302A3C8FcD17c00ae64b54';

export default function SpecialCards() {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { connect } = useConnect();

    const [canMint, setCanMint] = useState<boolean | null>(null);
    const [isMinting, setMinting] = useState(false);
    const [minted, setMinted] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // 🔁 Synchronizacja konta Metamask z wagmi
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = () => {
            console.log('🔁 Metamask account changed. Reconnecting wagmi...');
            connect({ connector: injected() });
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, [connect]);

    // 📦 Pobranie metadanych i sprawdzenie uprawnień
    useEffect(() => {
        const fetchMetadata = async () => {
            if (!publicClient) return;
            try {
                const provider = new ethers.JsonRpcProvider(publicClient.transport.url);
                const contract = new ethers.Contract(pedroPauletaContract, abiPlayerCard, provider);

                const uri = await contract.tokenURI(1);
                const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                const metadata = await fetch(metadataUrl).then(res => res.json());
                if (metadata.image) {
                    setImageUrl(metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'));
                }
            } catch (err) {
                console.error('❌ Failed to load metadata:', err);
            }
        };

        const checkEligibility = async () => {
            if (!address || !publicClient) return;
            try {
                const provider = new ethers.JsonRpcProvider(publicClient.transport.url);
                const contract = new ethers.Contract(pedroPauletaContract, abiPlayerCard, provider);
                const eligible = await contract.canMint(address);
                setCanMint(eligible);
            } catch (err) {
                console.error('Error checking eligibility:', err);
                setCanMint(false);
            }
        };

        fetchMetadata();
        checkEligibility();
    }, [address, publicClient]);

    // 🪙 Mintowanie NFT
    const handleMint = async () => {
        if (!isConnected || !publicClient || !window.ethereum) {
            console.error("⛔ Brak połączenia lub providera");
            return;
        }

        try {
            setMinting(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const signerAddress = await signer.getAddress();

            console.log("🎯 signer address:", signerAddress);

            const contract = new ethers.Contract(pedroPauletaContract, abiPlayerCard, signer);

            const eligible = await contract.canMint(signerAddress);
            const alreadyMinted = await contract.hasMinted(signerAddress);

            console.log("✅ canMint:", eligible);
            console.log("🔁 hasMinted:", alreadyMinted);

            if (!eligible || alreadyMinted) {
                alert("❌ Not eligible or already minted.");
                return;
            }

            const tx = await contract.mint();
            const receipt = await tx.wait();

            if (receipt.status === 1) {
                setMinted(true);
                alert("✅ Mint successful!");
            } else {
                console.error("❌ Transaction failed");
            }
        } catch (err) {
            console.error("❌ Mint failed:", err);
            alert("❌ Mint failed: " + (err as Error).message);
        } finally {
            setMinting(false);
        }
    };


    return (
        <>
            <Header />
            <main style={{
                paddingTop: '100px',
                minHeight: '100vh',
                backgroundColor: '#111',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100vw',
            }}>
                <div style={{
                    background: '#1e1e1e',
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '400px',
                    width: '100%',
                    marginTop: '2rem',
                }}>
                    <h1 style={{
                        fontSize: '1.8rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        Pedro Pauleta<br />Legendary Card
                    </h1>

                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Pedro Pauleta NFT"
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                borderRadius: 16,
                                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                            }}
                        />
                    ) : (
                        <p>Loading image...</p>
                    )}

                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={handleMint}
                            disabled={!canMint || isMinting || minted}
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1rem',
                                background: 'linear-gradient(to right, #4caf50, #81c784)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: canMint && !isMinting && !minted ? 'pointer' : 'not-allowed',
                                transition: 'opacity 0.3s',
                                opacity: canMint ? 1 : 0.6,
                            }}
                        >
                            {minted ? '✅ Minted!' : isMinting ? 'Minting...' : canMint ? 'Mint Card' : 'Not eligible'}
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
