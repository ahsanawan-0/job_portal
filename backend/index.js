const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require('cookie-parser');

const connectDB = require('./dbConnection');
const cors = require('cors');
connectDB()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies) to be sent
};
app.use(cors(corsOptions))

const port = process.env.PORT;
const { readdirSync } = require("fs");
readdirSync("./Router").map((route) => {
  app.use("/api", require(`./Router/${route}`));
});
app.listen(port, () => {
  console.log(`"server  is listening on a ${port}`);
});
