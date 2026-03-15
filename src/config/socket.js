import { Server } from "socket.io"

let io

export const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  })

  io.on("connection", (socket) => {

    socket.on("joinPitch", (pitchId) => {
      socket.join(pitchId)
    })

  })

}

export const getIO = () => {

  if (!io) {
    throw new Error("Socket not initialized")
  }

  return io

}