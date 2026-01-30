import express from 'express';
import { Socket } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Chess } from 'chess.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = Socket(server);
const chess = new Chess();

app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');

const players = {}
const currentPlayer = 'w';
