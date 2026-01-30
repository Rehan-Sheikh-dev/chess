import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Chess } from 'chess.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const chess = new Chess();

app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');

const players = {}
const currentPlayer = 'w';

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000,()=>{
    console.log("Server started on port 3000");
})