# Saras AI Chatbot

This repository contains the implementation of a chatbot for the Saras AI website, integrated through an iframe. The chatbot helps users by fetching relevant FAQs based on their queries and displaying them on the chatbox.

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [How It Works](#how-it-works)
- [Hackathon Checkpoint](#hackathon-checkpoint)


## Overview
![Screenshot 2024-10-19 101122](https://github.com/user-attachments/assets/4b61cc7b-6d29-4edb-b203-1fba1e1def5a)

![Screenshot 2024-10-19 101139](https://github.com/user-attachments/assets/b3c95a95-8fb6-4c24-af19-5dd940748dc2)


![Screenshot 2024-10-19 101204](https://github.com/user-attachments/assets/b337be98-95f6-47e3-b7ea-1b6d49184248)


The chatbot is designed to assist users by answering their questions through a set of predefined FAQs. The chatbot frontend is embedded in the Saras AI website using an iframe the user interacts with the ask saras ai button, and it dynamically fetches the most relevant FAQs from a backend powered by a vector database and machine learning models.

- **Frontend**: Built with React and deployed on Vercel.
- **Backend**: A FastAPI service hosted on AWS EC2. It processes user queries and retrieves relevant FAQs using embeddings from a transformer model and a vector database.
- **Vector Database**: ChromaDB for efficient retrieval of FAQ embeddings.
- **Embeddings Model**: SentenceTransformer (`paraphrase-MiniLM-L6-v2`) for generating query and FAQ embeddings.

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **Vercel**: For deployment of the React frontend.

### Backend
- **FastAPI**: For handling API requests and serving FAQs.
- **AWS EC2**: Hosting the backend services.
- **ChromaDB**: Vector database for storing and retrieving FAQ embeddings.
- **SentenceTransformer**: Used to generate embeddings for user queries and FAQs.
- **Python**: Primary language for backend implementation.

## System Architecture
![Screenshot 2024-10-19 101928](https://github.com/user-attachments/assets/08c273b3-959c-46ac-908b-a77725e9a891)

![Screenshot 2024-10-19 101954](https://github.com/user-attachments/assets/eb364ffe-1904-46f7-ac0a-484e809d3ccc)

![Screenshot 2024-10-19 102009](https://github.com/user-attachments/assets/ac99e920-e0ea-4c0e-9f93-f96414ab24b0)


## How It Works

1. **User Interaction**: The user interacts with the ask sara ai button which is located on the bottom right and then a chatbot will appear on the website.
2. **Query Processing**: The frontend sends the user's query to the backend API hosted on AWS EC2.
3. **Vector Search**: The backend uses ChromaDB to search for the top 5 most relevant FAQs based on query embeddings generated using the SentenceTransformer model.
4. **Response**: The top 5 FAQs are sent to the frontend, which displays the top 3 to the user.

## Hackathon Checkpoint

As part of the SARAS AI Institute hackathon, we developed a **Smart FAQ Module** to deliver relevant FAQs based on user queries. Here’s how we tackled the key challenges:

- **Relevance**: We integrated **SentenceTransformer (`paraphrase-MiniLM-L6-v2`)**, allowing us to match user queries with FAQ entries based on semantic similarity, not just keyword matching. This ensures users get answers that truly align with their questions.

- **Performance**: By utilizing **ChromaDB**, a vector database, we ensured that search queries are processed quickly, even with a large set of FAQs. This makes the system responsive and capable of handling real-time interactions.

- **Seamless Integration**: The frontend, built with **React** and deployed via **Vercel**, is integrated smoothly into the SARAS AI website using an iframe. The chatbot fits naturally into the website’s layout, providing a consistent and seamless user experience.

- **User Experience**: We designed the chatbot interface to be intuitive and user-friendly. Users can simply enter their query, and in return, they get the top 3 most relevant FAQs displayed in a clean, easy-to-read format.

- **Flexibility**: Since we used embeddings to understand the meaning behind each user query, our solution is highly flexible. It doesn’t rely on rigid keyword matching, meaning it can handle a wide variety of phrasing and still return the best possible answers.

- **Scalability**: The system is built to scale, handling larger FAQ datasets and more user traffic without compromising on speed or accuracy. The combination of **FastAPI** and **ChromaDB** ensures that the backend can grow as the FAQ database expands.

- **Tech Stack**: We leveraged the power of open-source technologies, combining **FastAPI** for backend processing and **AWS EC2** for hosting, along with **React** on the frontend. This robust stack provided both reliability and performance during development.
