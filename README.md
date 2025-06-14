# Mashup - Live Chat with Music and 3D Rendering

An interactive project that combines live chat, music playback, and 3D character rendering, inspired by platforms like
Habbo.

## Overview

Mashup is an interactive social platform that allows users to:

- Chat in real-time through a messaging system
- Listen to music while interacting
- View and interact with 3D characters (in development)
- Customize their virtual experience

The project uses modern technologies like Next.js, React, Socket.IO, and Three.js to create an immersive and interactive
web experience.

## Technologies

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Node.js, Express, Socket.IO
- **3D Rendering**: Three.js, React Three Fiber
- **Styling**: TailwindCSS, Radix UI
- **State Management**: Zustand
- **Containerization**: Docker

## Installation and Setup

### Prerequisites

- Node.js 19+
- Yarn or npm
- Docker and Docker Compose (optional, for containerized execution)

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mashup.git
   cd mashup
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   # Edit the .env.local file as needed
   ```

4. Run the project in development mode:
   ```bash
   yarn dev
   ```

5. Access the project at: http://localhost:3000

### Using Docker

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. Access the project at: http://localhost:3000

## Project Structure

```
mashup/
├── app/                  # Main Next.js directory
│   ├── api/              # API routes
│   ├── page.tsx          # Main page
│   └── ...
├── components/           # React components
│   ├── ui/               # Reusable UI components
│   ├── chat-sidebar.tsx  # Chat component
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helper functions
├── public/               # Static files
│   └── sounds/           # Audio files
├── server/               # Socket.IO server
│   ├── index.ts          # Server entry point
│   └── socket.ts         # Socket.IO logic
├── styles/               # Global styles
├── types/                # TypeScript type definitions
├── Dockerfile            # Docker configuration for the main app
├── docker-compose.yml    # Docker Compose configuration
└── ...
```

## Features

### Implemented

- Real-time chat system
- Music playback
- Responsive user interface
- Basic 3D rendering

### In Development

- Avatar customization
- Interactive 3D environments
- Room system
- Integration with music streaming platforms
- Advanced animations and visual effects

## Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

