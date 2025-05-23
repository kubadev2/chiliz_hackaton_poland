import Header from './Header';
import { MintNFT } from './MintNFT';
import NFTImage from './NFTImage';

function App() {
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
            maxWidth: '360px',
            width: '100%',
            marginTop: '2rem',
          }}
        >
          <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🎉 Mint your NFT</h1>
          <NFTImage tokenId={1} />
          <div style={{ marginTop: '2rem' }}>
            <MintNFT />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
