import { useState } from 'react';

interface SurveyModalProps {
    onClose: () => void;
    onMintConfirmed: () => void;
}

export default function SurveyModal({ onClose, onMintConfirmed }: SurveyModalProps) {
    const [selected, setSelected] = useState<string>('');
    const [otherText, setOtherText] = useState<string>('');
    const [confirmed, setConfirmed] = useState(false);

    const handleMintClick = () => {
        if (selected) {
            const response = selected === 'Other' ? otherText : selected;

            const formData = new FormData();
            if (selected === 'Other') {
                formData.append('entry.1300339346', '__other_option__');
                formData.append('entry.1300339346.other_option_response', otherText);
            }
            else {
                formData.append('entry.1300339346', selected);
            }


            fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSfHkYfZdHxU5GQjpFpQgV2hOnZEW7VUKnNFO0ULR2Y591uP0g/formResponse', {
                method: 'POST',
                mode: 'no-cors',
                body: formData,
            })
                .then(() => {
                    console.log('✅ Wysłano odpowiedź:', response);
                })
                .catch((err) => {
                    console.error('❌ Błąd wysyłania:', err);
                });

            setConfirmed(true);
            onClose();
            onMintConfirmed();
        }
    };



    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ marginBottom: '1rem' }}>Which airline do you use most often?</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['Ryanair', 'Wizz Air', 'LOT', 'Lufthansa', 'Other'].map(option => (
                        <label key={option} style={{ color: 'white' }}>
                            <input
                                type="radio"
                                value={option}
                                checked={selected === option}
                                onChange={() => setSelected(option)}
                                style={{ marginRight: '0.5rem' }}
                            />
                            {option}
                        </label>
                    ))}
                </div>

                {selected === 'Other' && (
                    <input
                        type="text"
                        placeholder="Type your airline"
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem',
                            width: '100%',
                            borderRadius: '0.5rem',
                            border: '1px solid #888',
                        }}
                    />
                )}

                {!confirmed ? (
                    <button onClick={handleMintClick} style={mintButtonStyle}>Submit answer</button>
                ) : (
                    <button onClick={onMintConfirmed} style={mintButtonStyle}>Mint NFT</button>
                )}

                <button onClick={onClose} style={closeButtonStyle}>Close</button>
            </div>
        </div>
    );
}

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
};

const modalStyle: React.CSSProperties = {
    background: '#222',
    padding: '2rem',
    borderRadius: '1rem',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'left',
};

const mintButtonStyle: React.CSSProperties = {
    marginTop: '1.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
};

const closeButtonStyle: React.CSSProperties = {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
};
