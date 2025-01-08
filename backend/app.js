const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const sequelize = require('./util/database')
const signupRoutes = require('./routes/signup')
const loginRoutes = require('./routes/login')
const chatRoutes = require('./routes/chats')
const groupRoutes = require('./routes/group')
const chatsController = require('./controllers/chats')

const User = require('./models/user')
const Chats = require('./models/chats')
const Groups = require('./models/groups')

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const io = require('socket.io')(3001, {
    cors: corsOptions
});

io.use((socket, next) => {
    if (socket.handshake.auth.token) {
        try{
            const decoded = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
            socket.user = decoded;
        } catch(err) {
            return next(new Error('Authentication error'));
        }
        next();
    } else {
        next(new Error('Token Not Found'));
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("message", async (data, cb) => {
        const chat = await chatsController.socketAddChat(data.message, socket.user.name, socket.user.id, data.groupId)
        io.to(data.groupId).emit("message", {
            sender: socket.user.name,
            message: data.message
        });
        if(chat.name){
            cb({status: 200, message: chat})
        }else{
            cb({status: 400, message: chat})
        }
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get("/",(req, res) => {
   res.send("Hello World")
});

app.use('/signup', signupRoutes)
app.use('/login', loginRoutes)
app.use('/chats', chatRoutes)
app.use('/group', groupRoutes)

User.hasMany(Chats)
Chats.belongsTo(User)

Groups.hasMany(Chats)
Chats.belongsTo(Groups)

User.hasMany(Groups)
Groups.belongsTo(User)

sequelize.sync()
    .then(result => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running in 3000")
        });
    })
    .catch(err => {
        console.log(err);
    });