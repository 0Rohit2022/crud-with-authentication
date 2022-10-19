const express = require("express");
const PORT = process.env.PORT || 8000;
const path = require("path");
const bodyParser = require("body-parser");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
require('../db/server')

// console.log(process.env.SECRET)
app.set('view engine', 'ejs')
const staticPath = path.join(__dirname, '../public');
app.use(express.json())
app.use(cookieParser())
app.use(express.static(staticPath));

 
app.use(bodyParser.urlencoded({extended:true}));

const allrouters = require('../routers/routers');

app.use('/', allrouters);   
  
 

app.listen(PORT, () => {
    console.log(`Server is running on port no.${PORT}`);
})
