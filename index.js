require('dotenv').config()
const Document = require("./Document")
const express = require('express')
const app = express()
var cors = require('cors')

//conectar ao Bongodb Atlas
require('./db')

const io = require("socket.io")(process.env.PORT || 3001, {
  cors: {
    origin: ["http://localhost:3000", "https://nexus-editor.vercel.app"], // Permite solicitações apenas desse endereço
    methods: ["GET", "POST"],         // Métodos permitidos
    allowedHeaders: ["Content-Type"],  // Cabeçalhos permitidos (opcional)
    credentials: true,                 // Permite cookies ou credenciais (opcional)
  },
});

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "/*");
    res.header("Access-Control-Allow-Methods", 'GET,POST');
    app.use(cors())
    next();
})
app.use(cors())




const defaultValue = ""

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)
    socket.emit("load-document", document.data)

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const document = await Document.findById(id)
  if (document) return document
  return await Document.create({ _id: id, data: defaultValue })
}
