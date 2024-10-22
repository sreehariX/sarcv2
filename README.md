# Saras AI Chatbot

This repository contains the implementation of a chatbot for the Saras AI website, integrated through an iframe. The chatbot helps users by fetching relevant FAQs based on their queries and displaying them on the chatbox.

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [How It Works](#how-it-works)
- [Hackathon Checkpoints](#hackathon-checkpoints) 
- [Future improvements](#future-improvements)
- [Integration guide ](#integration-documentation)
  - [React](#react-implementation)
  - [Angular](#angular-implementation)
- [Project exprience ](#project-experience)


## Overview
![Screenshot 2024-10-19 101122](https://github.com/user-attachments/assets/4b61cc7b-6d29-4edb-b203-1fba1e1def5a)

![Screenshot 2024-10-19 101139](https://github.com/user-attachments/assets/b3c95a95-8fb6-4c24-af19-5dd940748dc2)


![Screenshot 2024-10-19 101204](https://github.com/user-attachments/assets/b337be98-95f6-47e3-b7ea-1b6d49184248)


The chatbot is designed to assist users by answering their questions through a set of predefined FAQs. The chatbot frontend is embedded in the Saras AI website using an iframe. When the user interacts with the "Ask Saras AI" button, it dynamically fetches the most relevant FAQs from a backend powered by the ChromaDB vector database and machine learning models.

- **Frontend**: Built with React and deployed on Vercel.
- **Backend**: A FastAPI service hosted on Microsoft Azure EC machine. It processes user queries and retrieves relevant FAQs using embeddings from a transformer model and a vector database.
- **Vector Database**: ChromaDB for efficient retrieval of FAQ embeddings.
- **Embeddings Model**: SentenceTransformer (`paraphrase-MiniLM-L6-v2`) for generating query and FAQ embeddings.

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **Vercel**: For deployment of the React frontend.

### Backend
- **FastAPI**: For handling API requests and serving FAQs.
- **Microsoft Azure**: Hosting the backend services.
- **ChromaDB**: Vector database for storing and retrieving FAQ embeddings.
- **SentenceTransformer**: Used to generate embeddings for user queries and FAQs.
- **Python**: Primary language for backend implementation.

## System Architecture
![Screenshot 2024-10-19 101928](https://github.com/user-attachments/assets/08c273b3-959c-46ac-908b-a77725e9a891)

![Screenshot 2024-10-19 101954](https://github.com/user-attachments/assets/eb364ffe-1904-46f7-ac0a-484e809d3ccc)

![Screenshot 2024-10-19 102009](https://github.com/user-attachments/assets/ac99e920-e0ea-4c0e-9f93-f96414ab24b0)


## How It Works

1. **User Interaction**: The user interacts with the "Ask Saras AI" button which is located on the bottom right and then a chatbot will appear on the website.
2. **Query Processing**: The frontend sends the user's query to the backend API hosted on Microsoft Azure EC machine.
3. **Vector Search**: The backend uses ChromaDB to search for the top 5 most relevant FAQs based on query embeddings generated using the SentenceTransformer model.

![Screenshot 2024-10-22 212716](https://github.com/user-attachments/assets/8d3d26a1-02c6-44f0-ac5b-27587dadbab8)


4. **Response**: The top 5 FAQs are sent to the frontend, which displays the top 3 to the user.

## Hackathon Checkpoints

As part of the SARAS AI Institute hackathon, we developed a **Smart FAQ Module** to deliver relevant FAQs based on user queries. Here’s how we tackled the key challenges:

- **Relevance**: We integrated **SentenceTransformer (`paraphrase-MiniLM-L6-v2`)**, allowing us to match user queries with FAQ entries based on semantic similarity, and not just keyword matching. This ensures that users get answers that truly align with their questions.

- **Performance**: By utilizing **ChromaDB**, a vector database, we ensured that the search queries are processed quickly, even with a large set of FAQs. This makes the system responsive and capable of handling real-time interactions.

- **Seamless Integration**: The frontend, built with **React** and deployed via **Vercel**, is integrated smoothly into the SARAS AI website using an iframe. The chatbot fits naturally into the website’s layout, providing a consistent and seamless user experience.

- **User Experience**: We designed the chatbot interface to be intuitive and user-friendly. Users can simply enter their query, and in return, they get the top 3 most relevant FAQs displayed in a clean, easy-to-read format.

- **Flexibility**: Since we used embeddings to understand the meaning behind each user query, our solution is highly flexible. It doesn’t rely on rigid keyword matching, meaning it can handle a wide variety of phrasing and still return the best possible answers.

- **Scalability**: The system is built to scale, handling larger FAQ datasets and more user traffic without compromising on speed or accuracy. The combination of **FastAPI** and **ChromaDB** ensures that the backend can grow as the FAQ database expands.

- **Tech Stack**: We used the power of open-source technologies, combining **FastAPI** for backend processing and **Microsoft Azure EC machine** for hosting, along with **React** on the frontend. This robust stack provided both reliability and performance during development.


## Future Improvements

- **Using a Proprietary LLM**: If we had access to an LLM API key, our idea is to send the top three query answers to the LLM for summarization, and return a response that includes the source links to the FAQs along with summarized response.
  
- **Enhanced Query Matching**: Another improvement that we would have done is to send the user's query to the LLM to retrieve similar questions, attach these questions, and then embed them then search imporving the response accuracy.

- We would have implemented all of these features if we had access to an LLM API key. The infrastructure is already in place, and it would only require a simple backend function update to implement these improvements.







# Integration documentation

## React Implementation

### `/src/components/AskSarasButton.js`
```javascript
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

```

### `/src/components/ChatDialog.js`
```javascript
import React, { useState, useEffect, useRef } from 'react';

const ChatDialog = ({ onClose, updateChatHistory }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { role: 'ai', content: "Hi! I am Saras trained on FAQ's. Ask me anything related to FAQ's, I will give you relevant answers." }
    ];
  });
  const [exampleQuestions] = useState([
    "Is it possible to interact with mentors outside of class sessions? ",
    "Are scholarships offered at Saras AI Institute, and how do I apply?",
    "Can you describe the structure of the curriculum at Saras AI Institute?",
  ]);
  const chatContainerRef = useRef(null);
  const [isInitialState, setIsInitialState] = useState(messages.length === 1);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const lastMessageRef = useRef(null);

  const scrollToLatestAnswer = () => {
    if (chatContainerRef.current && lastMessageRef.current) {
      if (isInitialRender) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        setIsInitialRender(false);
      } else {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].role === 'ai') {
      scrollToLatestAnswer();
    }
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    updateChatHistory(messages);
  }, [messages, updateChatHistory]);

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

  const handleSearch = async (exampleQuery = null) => {
    const searchQuery = exampleQuery || query;
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return;
    setIsInitialState(false);

    const userMessage = { role: 'user', content: searchQuery };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');

    try {
      const response = await fetch('https://backendapi.centralindia.cloudapp.azure.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
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
      } else {
        const aiMessage = { role: 'ai', content: "I'm sorry, I couldn't find a relevant answer to your question." };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const aiMessage = { role: 'ai', content: "I'm sorry, there was an error processing your request." };
      setMessages(prev => [...prev, aiMessage]);
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
      <div 
        ref={chatContainerRef}
        style={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          marginBottom: '20px'
        }}
      >
        {messages.map((message, index) => (
          <div 
            key={index} 
            ref={index === messages.length - 1 ? lastMessageRef : null}
            style={{ marginBottom: '15px', textAlign: message.role === 'user' ? 'right' : 'left' }}
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
        {isInitialState && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 'bold', color: '#666', marginBottom: '10px' }}>EXAMPLE QUESTIONS</p>
            {exampleQuestions.map((question, index) => (
              <div
                key={index}
                onClick={() => handleSearch(question)}
                style={{
                  display: 'flex',
                  width: 'fit-content',
                  padding: '10px 15px',
                  margin: '5px 0',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              >
                {question}
              </div>
            ))}
          </div>
        )}
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
        <button 
          onClick={() => handleSearch()}
          onTouchStart={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{
            padding: '12px 25px',
            backgroundColor: '#e57549',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            touchAction: 'manipulation'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatDialog;

```



## Angular Implementation

### `/src/components/ask-saras-button.component.ts`
```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ask-saras-button',
  template: `
    <button
      (click)="onClick.emit()"
      [ngStyle]="buttonStyle"
      class="ask-saras-button"
    >
      Ask Saras AI
    </button>
  `,
  styles: [`
    .ask-saras-button {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      padding: 14px 20px;
      background-color: #e57549;
      color: white;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    .ask-saras-button:hover {
      transform: scale(1.1);
    }
  `]
})
export class AskSarasButtonComponent {
  @Output() onClick = new EventEmitter<void>();

  buttonStyle = {
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
    transition: 'transform 0.3s ease',
  };
}
```

### `/src/components/chat-dialog.component.ts`
```typescript
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

@Component({
  selector: 'app-chat-dialog',
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <h2>Ask Saras AI</h2>
        <button (click)="onClose.emit()">×</button>
      </div>
      <div #chatContainer class="chat-messages">
        <div *ngFor="let message of messages; let last = last" [ngClass]="{'user-message': message.role === 'user', 'ai-message': message.role === 'ai'}">
          <div [innerHTML]="message.content"></div>
        </div>
        <div *ngIf="isInitialState" class="example-questions">
          <p>EXAMPLE QUESTIONS</p>
          <div *ngFor="let question of exampleQuestions" (click)="handleSearch(question)" class="example-question">
            {{question}}
          </div>
        </div>
      </div>
      <div class="chat-input">
        <input type="text" [(ngModel)]="query" (keyup.enter)="handleSearch()" placeholder="Ask a question...">
        <button (click)="handleSearch()">Send</button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      width: 900px;
      height: 600px;
      background-color: #f0f8ff;
      border-radius: 15px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .chat-header h2 {
      margin: 0;
      color: #e57549;
    }
    .chat-header button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
    .chat-messages {
      flex-grow: 1;
      overflow-y: auto;
      margin-bottom: 20px;
    }
    .user-message, .ai-message {
      margin-bottom: 15px;
    }
    .user-message {
      text-align: right;
    }
    .ai-message {
      text-align: left;
    }
    .user-message > div, .ai-message > div {
      display: inline-block;
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 18px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    .user-message > div {
      background-color: #e57549;
      color: white;
    }
    .ai-message > div {
      background-color: #f0f0f0;
      color: black;
    }
    .example-questions {
      margin-top: 20px;
    }
    .example-questions p {
      font-weight: bold;
      color: #666;
      margin-bottom: 10px;
    }
    .example-question {
      display: inline-block;
      padding: 10px 15px;
      margin: 5px 0;
      background-color: #f0f0f0;
      border-radius: 18px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .example-question:hover {
      background-color: #e0e0e0;
    }
    .chat-input {
      display: flex;
    }
    .chat-input input {
      flex-grow: 1;
      padding: 12px;
      border-radius: 25px;
      border: 1px solid #ccc;
      margin-right: 10px;
      font-size: 16px;
    }
    .chat-input button {
      padding: 12px 25px;
      background-color: #e57549;
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    }
    /* Add the styles for sources here */
    .sources-container { /* ... */ }
    .sources-title { /* ... */ }
    .sources-list { /* ... */ }
    .source-item { /* ... */ }
    .source-icon { /* ... */ }
    .source-content { /* ... */ }
    .source-category { /* ... */ }
    .source-question { /* ... */ }
    .source-expand { /* ... */ }
  `]
})
export class ChatDialogComponent implements OnInit, AfterViewChecked {
  @Input() updateChatHistory!: (messages: Message[]) => void;
  @Output() onClose = new EventEmitter<void>();
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  query = '';
  messages: Message[] = [];
  exampleQuestions = [
    "Is it possible to interact with mentors outside of class sessions? ",
    "Are scholarships offered at Saras AI Institute, and how do I apply?",
    "Can you describe the structure of the curriculum at Saras AI Institute?",
  ];
  isInitialState = true;
  isInitialRender = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const savedMessages = localStorage.getItem('chatMessages');
    this.messages = savedMessages ? JSON.parse(savedMessages) : [
      { role: 'ai', content: "Hi! I am Saras trained on FAQ's. Ask me anything related to FAQ's, I will give you relevant answers." }
    ];
    this.isInitialState = this.messages.length === 1;

    // Setup window.closeChat function
    (window as any).closeChat = (index: number) => {
      this.onClose.emit();
      const iframe = document.querySelector('iframe');
      if (iframe) {
        (iframe as any).contentWindow.postMessage({ type: 'scrollToFAQ', index }, '*');
      }
    };
  }

  ngOnDestroy() {
    delete (window as any).closeChat;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  async handleSearch(exampleQuery: string | null = null) {
    const searchQuery = exampleQuery || this.query;
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return;
    this.isInitialState = false;

    const userMessage: Message = { role: 'user', content: searchQuery };
    this.messages.push(userMessage);
    this.query = '';

    try {
      const response = await this.http.post('https://backendapi.centralindia.cloudapp.azure.com/search', { query: searchQuery }).toPromise();
      const data = response as any[];
      
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
        const aiMessage: Message = { role: 'ai', content: aiResponse + sourcesSection };
        this.messages.push(aiMessage);
      } else {
        const aiMessage: Message = { role: 'ai', content: "I'm sorry, I couldn't find a relevant answer to your question." };
        this.messages.push(aiMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      const aiMessage: Message = { role: 'ai', content: "I'm sorry, there was an error processing your request." };
      this.messages.push(aiMessage);
    }

    localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    this.updateChatHistory(this.messages);
  }
}
```

## Project Experience

- We really enjoyed experimenting with this project, and we learned a lot while piecing everything together, including how to deploy on Vercel and a Microsoft Azure EC2 machine.
  
- One challenge that took considerable time was configuring the backend API address with Apache server to secure an SSL certificate, allowing us to use the API on the frontend after deploying to Vercel.

- We primarily used open-source codebases, with ChromaDB being our favorite. It handles a large number of requests simultaneously and is also easy to configure and reliable .
