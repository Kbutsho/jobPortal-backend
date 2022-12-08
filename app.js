const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.route');
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    cors({
      origin: ["", "http://localhost:3000"],
      credentials: true,
    })
  );
//route
app.use("/api/user", userRouter)

app.get('/api/', (req, res) => {
    res.json({
        'status': 200,
        'message': 'index api'
    });
});
app.all('*', (req, res) => {
    res.json({
        'status': 400,
        'message': 'api not found',
    });
});

module.exports = app;