import React, { useState, useEffect, useRef } from 'react';

const ChatDialog = ({ onClose, initialMessages, updateChatHistory }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef(null);
  const latestMessageRef = useRef(null);

  const scrollToLatestMessage = () => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToLatestMessage();
    }
  }, [messages]);

  useEffect(() => {
    window.closeChat = (index) => {
      onClose();
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow.postMessage({ type: 'scrollToFAQ', index }, '*');
      }
    };

    return () => {
      delete window.closeChat;
    };
  }, [onClose]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    updateChatHistory(prev => [...prev, userMessage]);
    setQuery('');

    try {
      const response = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length > 0) {
        const topThreeMatches = data.slice(0, 3);
        const aiResponse = topThreeMatches.map((match, index) => `
          <div style="margin-bottom: 15px; padding: 10px; background-color: #f0f8ff; border-radius: 10px;">
            <p style="margin: 0 0 10px 0;">${match.answer}</p>
            <div style="font-size: 0.9em; color: #666;">
              <p style="margin: 0 0 5px 0;">Category: ${match.category}</p>
              <p style="margin: 0;">Question: ${match.question}</p>
            </div>
          </div>
        `).join('');

        const sourcesSection = `
          <div class="sources-container">
            <h3 class="sources-title">Sources</h3>
            <div class="sources-list">
              ${topThreeMatches.map((match, index) => `
                <div class="source-item">
                  <div class="source-icon">
                    <i class="fas fa-file-alt"></i>
                  </div>
                  <div class="source-content">
                    <div class="source-category">${match.category}</div>
                    <div class="source-question">${match.question}</div>
                  </div>
                  <div class="source-expand" onclick="window.closeChat(${index})">
                    <i class="fas fa-chevron-right"></i>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

        const aiMessage = { role: 'ai', content: aiResponse + sourcesSection };
        setMessages(prev => [...prev, aiMessage]);
        updateChatHistory(prev => [...prev, aiMessage]);
      } else {
        const aiMessage = { role: 'ai', content: "I'm sorry, I couldn't find a relevant answer to your question." };
        setMessages(prev => [...prev, aiMessage]);
        updateChatHistory(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const aiMessage = { role: 'ai', content: "I'm sorry, there was an error processing your request." };
      setMessages(prev => [...prev, aiMessage]);
      updateChatHistory(prev => [...prev, aiMessage]);
    }
  };

  return (
    <div style={{
      width: '900px',
      height: '600px',
      backgroundColor: '#f0f8ff',
      borderRadius: '15px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <style>
        {`
          .sources-container {
            margin-top: 15px;
            border-top: 1px solid #e0e0e0;
            padding-top: 10px;
            font-family: Arial, sans-serif;
          }
          .sources-title {
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: bold;
          }
          .sources-list {
            background-color: #f8f8f8;
            border-radius: 8px;
            overflow: hidden;
          }
          .source-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
          }
          .source-item:last-child {
            border-bottom: none;
          }
          .source-icon {
            margin-right: 10px;
            color: #555;
          }
          .source-content {
            flex-grow: 1;
          }
          .source-category {
            font-weight: bold;
            color: #333;
          }
          .source-question {
            font-size: 0.9em;
            color: #666;
          }
          .source-expand {
            cursor: pointer;
            padding: 5px;
          }
          .source-expand:hover {
            background-color: #e0e0e0;
            border-radius: 50%;
          }
        `}
      </style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#e57549' }}>Ask Saras AI</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '20px' }}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            style={{ marginBottom: '15px', textAlign: message.role === 'user' ? 'right' : 'left' }}
            ref={index === messages.length - 1 ? latestMessageRef : null}
          >
            <div style={{
              display: 'inline-block',
              maxWidth: '80%',
              padding: '10px 15px',
              borderRadius: '18px',
              backgroundColor: message.role === 'user' ? '#e57549' : '#f0f0f0',
              color: message.role === 'user' ? 'white' : 'black',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              <div dangerouslySetInnerHTML={{ __html: message.content }} />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ask a question..."
          style={{ flexGrow: 1, padding: '12px', borderRadius: '25px', border: '1px solid #ccc', marginRight: '10px', fontSize: '16px' }}
        />
        <button onClick={handleSearch} style={{
          padding: '12px 25px',
          backgroundColor: '#e57549',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>Send</button>
      </div>
    </div>
  );
};

export default ChatDialog;