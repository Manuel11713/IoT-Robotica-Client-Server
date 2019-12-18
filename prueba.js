const {Board, Servo} = require("johnny-five");
const board = new Board();

board.on("ready", () => {
  const servo = new Servo(10);

  board.repl.inject({
    servo
  });


  servo.sweep({
    range: [0, 90], 
    interval: 1000
  });
//servo.min();
});
// const express = require('express');
// const axios = require('axios');


// const API_KEY = 'WSF3M4NTPRB2M2G25F4L';
// const url = `https://newsapi.org/v2/top-headlines?q=&country=mx&category=business&apiKey=0696f3572a184c59b624c5118511e0e9`
// console.log(url);
// axios.get(url).then(res=>console.log(res.data)).catch(err=>console.log(err));

