import React, { useState, useEffect } from 'react';
import AskSarasButton from './AskSarasButton';
import ChatDialog from './ChatDialog';

const FAQPage = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: "Hi! I'm an AI assistant trained on Saras AI documentation, help articles, and other content. Ask me anything about Saras AI." }
  ]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'scrollToFAQ') {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.contentWindow.postMessage({ type: 'scrollToFAQ', index: event.data.index }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <iframe
        src="https://www.sarasai.org/faq"
        title="Saras AI FAQ"
        style={{
          border: 'none',
          flex: 1,
          width: '100%',
        }}
        sandbox="allow-scripts allow-same-origin"
      />
      <AskSarasButton onClick={() => setShowChat(true)} />
      {showChat && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <ChatDialog 
            onClose={() => setShowChat(false)}
            initialMessages={chatHistory}
            updateChatHistory={setChatHistory}
          />
        </div>
      )}
    </div>
  );
};

export default FAQPage;