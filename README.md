# Flight Planner Project

This Flight Planner project is a full-stack application with a backend powered by Spring Boot and a frontend developed using modern JavaScript tools. The following instructions will help you set up and run the project on any computer.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Backend](#backend)
  - [Frontend](#frontend)

## Overview

The Flight Planner application allows users to plan and manage flights using a robust backend and an interactive frontend interface. This guide covers setting up both parts of the project and running them on your local machine.

## Prerequisites

Before running the project, ensure you have the following prerequisites installed:

### For the Backend
- **Java Development Kit (JDK)** (version 21)
- **Maven** (if not installed, you can use the provided Maven Wrapper)

### For the Frontend
- **Node.js** (version 18 or later)
- **npm** (Node Package Manager)

  
## Installation
Clone the repository:
```
git clone https://github.com/karlustav/flight-planner
cd flight-planner-project
```


## Directory Structure:

The backend code is located in the backend folder.
The frontend code is located in the frontend folder.

## Running the Application

### Backend
Open a terminal and navigate to the backend folder:
```
cd backend
```

Run the backend service using the Maven Wrapper:
```
./mvnw spring-boot:run
```
The backend server will start and listen on http://localhost:8080.

### Frontend
Open a new terminal window or tab and navigate to the frontend folder:
```
cd frontend
```

Install project dependencies
```
npm install
```

Start the frontend development server:
```
npm run dev
```
The frontend will run on http://localhost:5137.
