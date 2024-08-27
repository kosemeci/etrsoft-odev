
const express = require("express");
const app = express();
const userRoutes = require("./routes/users");


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.static("node_modules")); 
app.use(express.json());

app.use(userRoutes);

const port = process.env.PORT || 3001;


app.listen(port,'0.0.0.0',()=>{
    console.log("server is running at 3000 port");
})