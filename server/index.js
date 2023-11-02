const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// routes import
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const port = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI;

// uses
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("error connecting mongodb" + error);
  });
