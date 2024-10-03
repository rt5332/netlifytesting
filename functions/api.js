const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();


app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);


const socketio = require("socket.io");
const path = require("path");




const { Client, ID, Users, Databases, Query} = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject('64dcc4e03191782072e2')                
.setKey('a2cae8279abb7816a0ebab0f26daaca97c95f189f41e412269403cf50c32debcb7aec6b93800a6a0b80adab302afa5b7ff1c9131b73ccb76dd2530eeb48635ab934cc8f27384ebcba81a6dccda4563e7867b0cff4bb16141b9d2b666ed5116af4ff18e24aa42aafd74c0dc61392faf2bc971cf6c9355792cdc811bdf1a5e6495');      


const databases = new Databases(client);

// const promise = databases.createDocument('64dcc4f69107e1632e56', '64dcc502def4de617ae0', ID.unique(), {'DeviceID': '250100646453736115000537365900144024', 'ButtonID': 907786 });

// promise.then(function (response) {
//     console.log(response); // Success
// }, function (error) {
//     console.log(error); // Failure
// });




const gamedirectory = path.join(__dirname, "html");

app.use(express.static(gamedirectory));

httpserver.listen(3000);

const users = new Object();
io.on('connection', function(socket){
  console.log("Connected")

  socket.on("click", function(id){

    console.log("clicked")
    console.log(id)
    const request =
      databases.listDocuments('64dcc4f69107e1632e56',
                              '64dcc502def4de617ae0');
    request.then(function (response) {
      console.log(response.total)
      for (let i = 0; i < response.total; i++) {
        if(response.documents[i].ButtonID ==
           id.toString()){
          send(response.documents[i].DeviceID)
        }
      }

}, function (error) {
    console.log(error); // Failure
});



  })
  socket.on("connectbtn8", function (){
    console.log("BTNCONNECTED")
  })

  function send(v22){
    socketid2 = users[v22]
    io.to(socketid2).emit("clicked");
    console.log(socketid2)
    console.log("SENT TO SOCKET")
  }


  socket.on('disconnect', function () {
    console.log('socket disconnected : ' + socket.id)
  })
  socket.on('registerbutton', function (devid,btnid,socketid){
    console.log(typeof btnid)
    btnid = Number(btnid)
    if (btnid == 999999){
      var createreq2 = databases.createDocument('64dcc4f69107e1632e56',   
         '64dcc502def4de617ae0',
         ID.unique(), {'DeviceID':
          devid.toString(), 'ButtonID':
           btnid });
      createreq2.then(function (response) {
      console.log(response);
      io.to(socketid).emit("btnregisterback", 'DONE');
    })
    }else{
      const reqop = databases.listDocuments(
        "64dcc4f69107e1632e56",
        "64e0ba1a011ae7d21bfa",
        [Query.equal('ButtonID', btnid)]
      );
      reqop.then(function (response) {
        console.log(response);
        if (response.total == 0){
          console.log("BUTTON NON EXISTENT")
           io.to(socketid).emit("btnregisterback", 'NONEXISTENT');
        }else{
          console.log("BUTTON EXISTENT")
          const reqop1 = databases.listDocuments(
            "64dcc4f69107e1632e56",
            "64dcc502def4de617ae0",
            [Query.equal('ButtonID', btnid)]
          );
          reqop1.then(function (response) {
            console.log(response);
            if (response.total == 0){
              console.log("BUTTON NOT REGISTERED")
              console.log("REGISTERING NOW")
              const createreq = databases.createDocument('64dcc4f69107e1632e56',   
                 '64dcc502def4de617ae0',
                 ID.unique(), {'DeviceID':
                  devid.toString(), 'ButtonID':
                   btnid });
              createreq.then(function (response) {
              console.log(response);
              io.to(socketid).emit("btnregisterback", 'DONE');// Success

              }, function (error) {
              console.log(error); // Failure
              });
            }else{
              console.log("BUTTON REGISTERED")
              io.to(socketid).emit("btnregisterback", 'REGISTERED');
            }
          })
        }
        // io.to(socket.id).emit("optionback", response);
      }, function (error) {
      console.log(error);
      });
    }






  })



  socket.on('registrationcheck', function(iddev, socketidreg){
    console.log("REGISTRATION CHECK")
    const request =
      databases.listDocuments('64dcc4f69107e1632e56', 
                              '64dcc502def4de617ae0');
    request.then(function (response) {
      console.log(response.total);
      console.log(response.documents[0].DeviceID);// Success
      console.log("iddev" + iddev)
      for (let i = 0; i < response.total + 1; i++) {
        if(i == response.total){
          console.log("BAD")
          io.to(socketidreg).emit("registerback", 'BAD');
        }else{
          if(response.documents[i].DeviceID ==
             iddev.toString()){
            console.log(response.documents[i].ButtonID)
            console.log("GOODTOGO")
            if(iddev in users){
              delete users[iddev];
              console.log("DELETED KEY")
            }
            console.log("DEVICE")
            users[iddev] = socketidreg;
            io.to(socketidreg).emit("registerback", 'GOOD');
            break
        }
        }
      }
    }, function (error) {
    console.log(error); // Failure
    });
  })

})


