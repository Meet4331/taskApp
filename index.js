const express = require('express');
const app = express();
const apiRoutes = require('./router/accountRouter');
require('./db/mongoose');

const port = 3000;

app.use(express.json());
app.use(apiRoutes);

app.listen(port, ()=>{
    console.log("runnimmg on "+port);
})
