import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { initializeSocket } from './socket'
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Configuração do CORS
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}))

const server = createServer(app)

// Inicializa o Socket.IO com o servidor
initializeSocket(server)

server.listen(port, () => {
  console.log(`> Socket.IO server running on port ${port}`)
})