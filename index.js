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

io.on('connection',(uniqueSocket)=>{
console.log("connected:",uniqueSocket.id);


    if(!players.white){
        players.white = uniqueSocket.id;
        uniqueSocket.emit("PlayerRole","w");
    }
    else if(!players.black){
        players.black = uniqueSocket.id;
        uniqueSocket.emit("PlayerRole","b");
    }
    else{
        uniqueSocket.emit("PlayerRole","spectator");
    }
    uniqueSocket.on("disconnect",()=>{
        if(uniqueSocket.id === players.white){
            delete players.white;
        }
        else if(uniqueSocket.id === players.black){
            delete players.black;
        }
    })

  uniqueSocket.on("move",(move)=>{
    try {
        if(chess.turn() === "w" && uniqueSocket.id !== players.white )return;
        if(chess.turn() === "b" && uniqueSocket.id !== players.black )return;

        const result = chess.move(move);
        if(result){
            currentPlayer = chess.turn();
            io.emit("move",move);
            io.emit("boardState",chess.fen())
        }
        else{
            console.log("Invalid move : ",move);
            uniqueSocket.emit("invalidMove",move);
            
        }
    } catch (error) {
        console.log(error)
        uniqueSocket.emit("invalidMove",move);
    }
  })

});

server.listen(3000,()=>{
    console.log("Server started on port 3000");
})