// src/components/MintNFT.tsx
import { useAccount, useWriteContract } from 'wagmi';
import { parseAbi } from 'viem';

const contractAddress = '0x8CAec4dC4fe4698A6a249fe5Baf62832880aE22C';

const abi = parseAbi([
    'function mint() public',
    'function tokenURI(uint256 tokenId) public view returns (string)',
    'function nextTokenId() public view returns (uint256)'
]);

export function MintNFT() {
    const { isConnected } = useAccount();
    const {
        writeContract,
        isPending,
        isSuccess,
        error,
    } = useWriteContract();

    const handleMint = async () => {
        try {
            await writeContract({
                address: contractAddress,
                abi,
                functionName: 'mint',
                args: [],
            });
        } catch (err) {
            console.error('Mint failed:', err);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <button
                onClick={handleMint}
                disabled={!isConnected || isPending}
                style={{
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    background: 'linear-gradient(to right, #4caf50, #81c784)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: isConnected && !isPending ? 'pointer' : 'not-allowed',
                    transition: 'opacity 0.3s',
                    opacity: isConnected ? 1 : 0.6,
                }}
            >
                {isPending ? 'Minting...' : 'Mint NFT'}
            </button>
            {isSuccess && (
                <p style={{ color: 'green', marginTop: '1rem' }}>✅ NFT minted!</p>
            )}
            {error && (
                <p style={{ color: 'red', marginTop: '1rem' }}>
                    ❌ {(error as Error).message}
                </p>
            )}
        </div>
    );
}
