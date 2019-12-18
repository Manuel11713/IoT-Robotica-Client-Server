const express = require('express');
const app = express();
const server = require('http').createServer(app);//---socket
const { Board, Stepper } = require("johnny-five");
const board = new Board();
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


let stepper1;
let stepper2;

let gradosInicial1=0;
let gradosInicial2=0;

let theta11Server = 0;
let theta21Server = 0;
let theta12Server = 48.18*Math.PI/180;;//En radianes
let theta22Server = 131.82*Math.PI/180;

const io = require('socket.io')(server);

board.on("ready", () => {
  // proximity = new Proximity({
  //   controller: "HCSR04",
  //   pin: 7
  // });

  stepper1 = new Stepper({
    type: Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: 12,
      dir: 11
    }
  });
  stepper2 = new Stepper({
    type: Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: 9,
      dir: 8
    }
  });
  stepper1.rpm(50).ccw().accel(10).decel(10);
  stepper2.rpm(50).ccw().accel(10).decel(10);
});

io.on('connection', (client) => { 
  console.log('conectado')
  io.emit('iniciarAngulos',{theta11Server,
                            theta21Server,
                            theta12Server,
                            theta22Server})  
});


app.post('/posicion',(req,res)=>{
  const {theta11,theta21,theta12,theta22,velocidad} = req.body;
  let pasos1 = (5/9)*(theta11-theta11Server);
  pasos1 = pasos1.toFixed();
  let pasos2 = (5/9)*(theta21-theta21Server);
  pasos2 = pasos2.toFixed();

  // console.log("pasos1: ",pasos1);
  // console.log("pasos2: ",pasos2);
  // console.log("grados theta11Server: ",theta11Server);
  // console.log("grados theta21Server: ",theta21Server);
  // console.log("grados theta11: ",theta11);
  // console.log("grados theta21: ",theta21);
  // console.log('velocidad: ',velocidad);
  let theta11ServerAux = theta11Server;
  let theta21ServerAux = theta21Server;
  let theta12ServerAux = theta12Server;
  let theta22ServerAux = theta22Server;
  if(pasos1>=0){
    stepper1.step({
      steps: pasos1,
      rpm:velocidad*25,
      direction: Stepper.DIRECTION.CCW//sentido horario
    },()=>{
      console.log('Terminado 1 CCW');
      console.log('pasos2',pasos2)
      console.log('theta21ServerAux: ',theta21ServerAux);
      console.log('theta21: ',theta21);
      if((pasos2>0)&&(theta21ServerAux>=0)&&(theta21>=0)||(pasos2>0)&&(theta21ServerAux<=0)&&(theta21<=0)){
        pasos2 = Math.abs(pasos2);
        stepper2.step({
          steps: pasos2,
          rpm:velocidad*40,
          direction: Stepper.DIRECTION.CW//sentido antihorario
        },()=>console.log('Terminado 2 CW 1'));
      }else if((pasos2<0)&&(theta21ServerAux>=0)&&(theta21>=0)||(pasos2<0)&&(theta21ServerAux<=0)&&(theta21<=0)){
        
        pasos2 = Math.abs(pasos2);
        stepper2.step({
          steps: pasos2,
          rpm:velocidad*40,
          direction: Stepper.DIRECTION.CCW//sentido horario
        },()=>console.log('Terminado 2 CCW 2'));
      }else if(pasos2>0){
        console.log('aqui 1')
        let pasosN = 200-Number(pasos2);
        console.log('pasos N: ',pasosN);
        stepper2.step({
          steps: pasosN,
          rpm:velocidad*40,
          direction: Stepper.DIRECTION.CCW//sentido horario
        },()=>console.log('Terminado 2 CCW 3'));
      }else if(pasos2<0){
        console.log('aqui 2');
        let pasosN = 200+Number(pasos2);
        console.log('pasos N: ',pasosN);
        stepper2.step({
          steps: pasosN,
          rpm:velocidad*40,
          direction: Stepper.DIRECTION.CW//sentido antihorario
        },()=>console.log('Terminado 2 CW'));
      }
    });
  }
  else{
    console.log('Terminado 1 CCW');
      console.log('pasos2',pasos2)
      console.log('theta21ServerAux: ',theta21ServerAux);
      console.log('theta21: ',theta21);
    pasos1 *=-1; 
    stepper1.step({
      steps: pasos1,
      rpm:velocidad*40,
      direction: Stepper.DIRECTION.CW//Sentido antiorario
    },()=>{
      console.log('Terminado 2 CW')
      if((pasos2>0)&&(theta21ServerAux>=0)&&(theta21>=0)||(pasos2>0)&&(theta21ServerAux<=0)&&(theta21<=0)){
        pasos2 = Math.abs(pasos2);
        stepper2.step({
          steps: pasos2,
          rpm:velocidad*40,
          direction: Stepper.DIRECTION.CW//sentido antihorario
        },()=>console.log('Terminado 2 CW 1'));
      }else if((pasos2<0)&&(theta21ServerAux>=0)&&(theta21>=0)||(pasos2<0)&&(theta21ServerAux<=0)&&(theta21<=0)){
        pasos2 = Math.abs(pasos2);
        stepper2.step({
          steps: pasos2,
          rpm:velocidad*40,
          direction: Stepper.DIRECTION.CCW//sentido horario
        },()=>console.log('Terminado 2 CCW 2'));
      }else if(pasos2>0){
        let pasosN = 200-Number(pasos2);
        console.log('pasos N: ',pasosN);
        stepper2.step({
          steps: pasosN,
          rpm:velocidad*40,
          direction: Stepper.DIRECTION.CCW//sentido horario
        },()=>console.log('Terminado 2 CCW 3'));
      }else if(pasos2<0){
        let pasosN = 200+Number(pasos2);
        console.log('pasos N: ',pasosN);
        stepper2.step({
          steps: pasosN,
          rpm:velocidad*40,
          direction: Stepper.DIRECTION.CW//sentido antihorario
        },()=>console.log('Terminado 2 CW 4'));
      }

    });
  };
  theta11Server=theta11;
  theta21Server=theta21;
  theta12Server=theta12;
  theta22Server=theta22;
  res.json({theta11Server:theta11Server*Math.PI/180,
            theta21Server:theta21Server*Math.PI/180,
            theta12Server:theta12Server*Math.PI/180,
            theta22Server:theta22Server*Math.PI/180})
});



server.listen(5000,()=>console.log('puerto 5000'));
