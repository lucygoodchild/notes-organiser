# Smart Notes Organiser

## Overview

The **Smart Notes Organiser** is a web application that allows users to create, categorize, and search notes efficiently. It leverages AI-powered features to enhance note management, including automatic categorisation, summarisation, sentiment analysis, and natural language query (NLQ) search. The application is designed with a user-friendly interface and robust backend to ensure seamless functionality.

---

## Features

### Core Features
1. **Add, Edit, Delete, and View Notes**: Users can manage their notes with ease.
2. **Categorize Notes**: Assign categories such as Work, Personal, or Ideas to notes.
3. **Search Notes**: Search for notes using keywords.

### AI-Powered Features
1. **Automatic Categorisation**: Suggests or assigns a category based on the note's content.
2. **Summarization**: Generates concise summaries for longer notes.
3. **Sentiment Analysis**: Detects and displays the sentiment of notes (e.g., Positive, Neutral, Negative).
4. **Natural Language Query (NLQ)**: Enables users to search notes using phrases like "Find my work notes from last week."

---

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **TypeScript**: For type-safe development.
- **CSS**: For styling the application.

### Backend
- **Node.js**: For server-side logic.
- **Express.js**: For building RESTful APIs.
- **MongoDB**: For storing notes and related data.
- **Mongoose**: For database modeling.

### AI Tools
- **Hugging Face Models**: For categorisation, summarisation, and sentiment analysis.

### Deployment
- **Vercel**: For hosting the frontend.
- **Render**: For hosting the backend.

### Testing Frameworks Used
- **Jest**: For unit and integration tests.
- **React Testing Library**: For testing React components.

---

## Live Application

- **Live URL**: [https://smart-notes-organiser.vercel.app/]

---

## Installation and Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (cloud instance)

### Steps to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/notes-organiser.git
   cd notes-organiser

2. ### Prerequisites
- Ensure all dependencies are installed:
  ```bash
  npm install

3. ### To run the client:
  ```bash
   cd client 
   npm run start

4. ### To run the server:
- Add an .env.local file to the server directory as shown in the .env.example file. Then:
  ```bash
   cd server
   node index.js

5. ### To run tests:
   ```bash
   npm test
