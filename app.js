const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.route');
const jobRouter = require('./routes/job.route');
const managerRouter = require('./routes/hiringManager.route');
const adminRouter = require('./routes/admin.route');
const fs = require('fs');
require("dotenv").config();
const bodyParser = require("body-parser");
const { PdfReader } = "pdfreader";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(
//     cors({
//         origin: ["http://localhost:3000",
//             "https://job-portal-frontend-one.vercel.app"],
//         credentials: true,
//     })
// );
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

//route
app.use("/api/user", userRouter)
app.use("/api/jobs", jobRouter)
app.use("/api/manager", managerRouter)
app.use("/api/admin", adminRouter)

app.get('/api/', (req, res) => {
    fs.readFile('views/documentation.pdf', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'application/pdf' });
        res.write(data);
        return res.end();
    });
});
app.all('*', (req, res) => {
    res.json({
        'status': 400,
        'message': 'api not found',
    });
});

module.exports = app;