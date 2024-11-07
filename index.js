const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoute");
const slotRoutes = require("./routes/slotRoute");
const bookingRoutes = require("./routes/bookingRoute");
require('dotenv').config();


app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/slot", slotRoutes);
app.use("/api/booking", bookingRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to PocketClass API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
