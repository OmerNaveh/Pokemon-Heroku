const express = require('express');
const Pokedex = require('pokedex-promise-v2');
const path = require('path')
const P = new Pokedex()
const app = express();
const pokemonRouter = require("./routers/pokemonRouter")
const userRouter = require('./routers/userRouter')
const errorHandler = require('./middleware/errorHandler');
const userHandler = require('./middleware/userHandler');
const cors = require('cors')

const port = process.env.PORT || 3000; //Because Iron-Man

// start the server
app.listen(port, function() {
  console.log('app started');
});


app.use(cors()) // solves chrome issue

app.use(express.static(path.join(__dirname, '../dist')))
app.get("/", (req,res)=>{
  res.sendFile("../dist/index.html", {root: __dirname})
})
// route our app
app.use(userHandler)
app.use("/pokemon", pokemonRouter)
app.use('/info', userRouter)
app.use(errorHandler)
