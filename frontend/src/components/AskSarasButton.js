import React from 'react';

const AskSarasButton = ({ onClick }) => {
  const buttonStyle = {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    padding: '14px 20px',
    backgroundColor: '#e57549',
    color: 'white',
    border: 'none',
    borderRadius: '9999px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease', // Add transition for smooth effect
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      className="ask-saras-button"
    >
      Ask Saras AI
      <style jsx>{`
        .ask-saras-button:hover {
          transform: scale(1.1);
        }
      `}</style>
    </button>
  );
};

export default AskSarasButton;