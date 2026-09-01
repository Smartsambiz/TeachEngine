require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const database = require("./supabaseClient");
const teacherRoute = require("./routes/TeacherRoutes");
const errorHandler = require("./middleware/errorHandler");
const classRoute = require("./routes/classRoutes");

const PORT = process.env.PORT;

//MIDDLEWARE
app.use(cors());
app.use(express.json());


// Health route
app.get('/health', (req, res)=>{
    res.status(200).json("SERVER IS LIVE");
})

// database connections helper function


// routes
app.use('/api',teacherRoute);
app.use('/api',classRoute);

// error handling middleware
app.use(errorHandler)

// Server start
app.listen(PORT, ()=>{
    console.log(`listening to port: ${PORT}`);
    

})