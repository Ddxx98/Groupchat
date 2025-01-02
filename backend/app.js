const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const sequelize = require('./util/database')
const signupRoutes = require('./routes/signup')
const loginRoutes = require('./routes/login')
const chatRoutes = require('./routes/chats')

const User = require('./models/user')
const Chats = require('./models/chats')

const app = express();


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get((req, res) => {
//     const url = req.url;
//     res.sendFile(path.join(__dirname, `${url}`));
// });

app.use('/signup', signupRoutes)
app.use('/login', loginRoutes)
app.use('/chats', chatRoutes)

User.hasMany(Chats);
Chats.belongsTo(User);

sequelize.sync()
    .then(result => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running in 3000")
        });
    })
    .catch(err => {
        console.log(err);
    });