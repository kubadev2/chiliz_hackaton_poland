import { useState } from 'react';
import Header from './Header';
import { MintNFT } from './MintNFT';
import NFTImage from './NFTImage';
import SurveyModal from './SurveyModal';
import { usePublicClient, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import abi from './abi.json'; // ABI twojego kontraktu
const contractAddress = '0x8CAec4dC4fe4698A6a249fe5Baf62832880aE22C';

function App() {
  const [isSurveyOpen, setSurveyOpen] = useState(false);
  const [surveyConfirmed, setSurveyConfirmed] = useState(false);
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const handleOpenSurvey = async () => {
    if (!address || !publicClient) return;

    const provider = new ethers.JsonRpcProvider(publicClient.transport.url);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
      const balance = await contract.balanceOf(address);
      if (BigInt(balance) > 0n) {
        alert("You have already minted this NFT.");
        return;
      }
      setSurveyOpen(true);
    } catch (err) {
      console.error('❌ Error checking balance:', err);
    }
  };


  const handleSurveyConfirmed = () => {
    setSurveyOpen(false);
    setSurveyConfirmed(true);
  };

  const handleSurveyClosed = () => {
    setSurveyOpen(false);
  };

  return (
    <>
      <Header />
      <main
        style={{
          paddingTop: '100px',
          minHeight: '100vh',
          backgroundColor: '#111',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100vw',
        }}
      >
        <div
          style={{
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
          }}
        >
          <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🎉 Mint your NFT</h1>
          <NFTImage tokenId={1} />
          <div style={{ marginTop: '2rem' }}>
            <MintNFT
              onBeforeMint={handleOpenSurvey}
              showFinalMintButton={surveyConfirmed}
            />
          </div>
        </div>
      </main>

      {isSurveyOpen && (
        <SurveyModal
          onClose={handleSurveyClosed}
          onMintConfirmed={handleSurveyConfirmed}
        />
      )}
    </>
  );
}

export default App;
