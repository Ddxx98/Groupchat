const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

const sequelize = require('./util/database')
const signupRoutes = require('./routes/signup')
const loginRoutes = require('./routes/login')
const chatRoutes = require('./routes/chats')
const groupRoutes = require('./routes/group')

const User = require('./models/user')
const Chats = require('./models/chats')
const Groups = require('./models/groups')

const app = express();

// const corsOptions = {
//     origin: process.env.FRONTEND_URL,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// }

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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