//MintNFT.tsx
import { useAccount, useWriteContract } from 'wagmi';
import { parseAbi } from 'viem';

const contractAddress = '0x8CAec4dC4fe4698A6a249fe5Baf62832880aE22C';

const abi = parseAbi([
  'function mint() public',
  'function tokenURI(uint256 tokenId) public view returns (string)',
  'function nextTokenId() public view returns (uint256)',
]);

interface MintNFTProps {
  onBeforeMint?: () => void;
  showFinalMintButton?: boolean;
}

export function MintNFT({ onBeforeMint, showFinalMintButton = false }: MintNFTProps) {
  const { isConnected } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleInitialClick = () => {
    if (onBeforeMint) {
      onBeforeMint();
    }
  };

  const handleFinalMint = async () => {
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
      {!showFinalMintButton ? (
        <button
          onClick={handleInitialClick}
          disabled={!isConnected}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            background: 'linear-gradient(to right, #4caf50, #81c784)',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: isConnected ? 'pointer' : 'not-allowed',
            transition: 'opacity 0.3s',
            opacity: isConnected ? 1 : 0.6,
          }}
        >
          Start Mint
        </button>
      ) : (
        <button
          onClick={handleFinalMint}
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
          {isPending ? 'Minting...' : 'Confirm Mint'}
        </button>
      )}

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
