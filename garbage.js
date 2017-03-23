'use strict'

const express = require('express');
const app = express();

const PORT = 5000;

app.get('/', (req, res) => {
  res.send("you've hit my first route!")
})

app.listen(5000, funciton() {
  console.log('listening on port ' + 5000);
});
