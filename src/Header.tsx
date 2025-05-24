import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from './assets/logo.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const getLinkStyle = (path: string): React.CSSProperties => ({
    color: hovered === path ? 'gray' : '#fff',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1rem',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s',
    cursor: 'pointer',
  });

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.topRow}>
          <div style={styles.leftSide}>
            <Link to="/">
              <img src={logo} alt="Logo" style={styles.logo} />
            </Link>

            <nav className="desktop-menu" style={styles.desktopMenu}>
              {[
                { path: '/your-nfts', label: 'Your NFTs' },
                { path: '/leaderboard', label: 'Leaderboard' },
                { path: '/special-cards', label: 'Special Cards' },
                { path: '/rewards', label: '🎁 Rewards' },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  style={getLinkStyle(path)}
                  onMouseEnter={() => setHovered(path)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {label}
                </Link>
              ))}
              <span style={styles.disabled}>Airdrop (soon)</span>
            </nav>
          </div>

          <div style={styles.rightSide}>
            <div style={{ marginRight: '1rem' }}>
              <ConnectButton
                showBalance={false}
                chainStatus="icon"
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hamburger"
              style={styles.hamburger}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-menu" style={styles.mobileMenu}>
            {[
              { path: '/your-nfts', label: 'Your NFTs' },
              { path: '/leaderboard', label: 'Leaderboard' },
              { path: '/special-cards', label: 'Special Cards' },
              { path: '/rewards', label: '🎁 Rewards' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={getLinkStyle(path)}
                onMouseEnter={() => setHovered(path)}
                onMouseLeave={() => setHovered(null)}
              >
                {label}
              </Link>
            ))}
            <span style={styles.disabled}>Airdrop (soon)</span>
          </nav>
        )}
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    background: '#111',
    borderBottom: '1px solid #333',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  },
  container: {
    padding: '1rem',
    maxWidth: '100%',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  leftSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '40px',
  },
  hamburger: {
    fontSize: '1.5rem',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'block',
  },
  desktopMenu: {
    display: 'flex',
    gap: '1rem',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  disabled: {
    color: '#888',
    fontWeight: 500,
    fontSize: '1rem',
    whiteSpace: 'nowrap',
  },
};
