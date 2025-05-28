require('dotenv').config()
require('./core/config/database')
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import compression from 'compression'

const app = express();
const port = process.env.APP_PORT

const server = http.createServer(app);
app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(bodyParser.json());

server.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
    
})
