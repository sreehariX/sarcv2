import React from 'react';

const TestHighlightButton = () => {
  const handleClick = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow.postMessage({
        type: 'highlightAnswer',
        className: 'Sora_R',
        highlightColor: 'yellow'
      }, '*');
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 1000
      }}
    >
      Test Highlight
    </button>
  );
};

export default TestHighlightButton;