const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
const app = express();
const PORT = 5000;

app.use(express.json())

// app.post('/',(req,res) => {
//   res.send(req.body)
// })

app.use('/api/auth', require('./routers/auth'));
app.use('/api/notes', require('./routers/notes'))

app.listen(PORT , () => {
  console.log(`The BackEnd Is Running On Port ${PORT}`);
})