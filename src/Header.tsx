// src/components/Header.tsx
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#111',
        borderBottom: '1px solid #333',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/" style={linkStyle}>🏠 Home</Link>
        <Link to="/your-nfts" style={linkStyle}>Your NFTs</Link>
        <span style={{ ...linkStyle, opacity: 0.5, cursor: 'default' }}>Rewards (soon)</span>
        <span style={{ ...linkStyle, opacity: 0.5, cursor: 'default' }}>🎁 Airdrop (soon)</span>
      </nav>

      <div style={{ maxWidth: '220px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end', marginRight: '3rem'}}>
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
        />
      </div>
    </header>
  );
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 500,
};
