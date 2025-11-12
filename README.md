# CodePilot

**A research-driven AI code tutoring platform**  
*Bachelor’s Thesis Project*

**A live prototype is available at**
https://delightful-river-0f14c5103.3.azurestaticapps.net/

---

## 🚀 Overview

CodePilot is an interactive, AI-powered code tutoring system designed as part of a Bachelor’s thesis and research study. It leverages Microsoft’s [Semantic Kernel][sk] and large-language models to provide contextual, didactic feedback on C# programming exercises. CodePilot combines task management, user progress tracking, and modular feedback plugins to explore how AI-assisted guidance can improve novice programmers’ learning outcomes.

---

## 🎯 Key Features

- **Interactive Coding Exercises**  
  A catalog of C# tasks (loops, array operations, etc.), each with description, starter code, and examples.

- **AI-Powered Feedback Plugins**  
  - **ExplainExercise**: Concise, context-aware code explanations  
  - **KRFeedback**: “Knowledge of Results” – Correct vs. Incorrect judgments  
  - **KMFeedback**: “Knowledge of Mistakes” – Pinpoints specific errors  
  - **KHFeedback**: “Knowledge onhow to Proceed” – Subtle, scaffolded improvement hints

- **User Authentication & Progress**  
  Secure registration and login (JWT), per-user task progress tracking stored in SQLite.

- **Clean Architecture**  
  - **Domain**: Entities & business rules  
  - **Application**: Services, use-cases, interfaces  
  - **Persistence**: EF Core + SQLite repositories  
  - **WebAPI**: ASP.NET Core controllers, JWT authentication  
  - **Frontend**: React (Vite) with protected routes and dynamic data fetching

---

## 📦 Tech Stack

- **Backend**:  
  - .NET 8 WebAPI (C#)  
  - EF Core 9 & SQLite  
  - JWT Authentication (ASP.NET Core Identity)  
  - Microsoft Semantic Kernel & OpenAI Chat

- **Frontend**:  
  - React 18 + TypeScript  
  - Vite  
  - Radix UI themes & Resizable Panels

- **Dev Tools**:  
  - GitHub Actions (CI/CD)  
  - Swagger / OpenAPI

---

## 🔧 Installation

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)  
- [Node.js 18+ & npm/Yarn](https://nodejs.org/)  
- OpenAI API Key  
- Usersecret
  - JWT Key

