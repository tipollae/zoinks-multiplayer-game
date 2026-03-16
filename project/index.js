const express = require("express");
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;


var wallsAlreadyMoving = false;
var wallAlreadyCreated = false;

var serverLeaderBoard;
var finalLeaderBoard;

if (!server.listening) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
} else {
  console.log(`Server is already listening on port ${port}`);
}


var players = {};
var activePlayers = [];
var playersCanSee = true;

const map = ["standard", "standard2"];
var currentMap = Math.floor(Math.random()*map.length);;


app.use(express.static("public"));


class wallObject {

  constructor(x,y,scaleWidth,scaleHeight){

    x:x;
    y:y;
    scaleWidth:scaleWidth;
    scaleHeight:scaleHeight;

  }




}



var wallArr = new Array();
var wallIndex = 0;
var wallToMapIndex = [];
for (i = 0; i < map.length; i++){

  wallToMapIndex.push([]);

}

var movingPlatforms = [];
var movingIntervals = []

function create_wall(mapType, xcoor, ycoor, scaleWidth, scaleHeight, wallType, hasTree, canMove, moveTime, speed, isVertical, portalConnectionX, portalConnectionY){

  const wall = new wallObject();
  wall.mapType = mapType;
  wall.x = xcoor;
  wall.y = ycoor;
  wall.scaleWidth = scaleWidth;
  wall.scaleHeight = scaleHeight;
  wall.wallType = wallType;
  wall.index = wallIndex;
  wall.indexRelToMap = wallToMapIndex[map.indexOf(mapType)];
  wall.hasTree = hasTree;

  if (canMove){

    wall.moveTime = moveTime;
    wall.speed = speed;
    wall.time = 0;
    wall.isVertical = isVertical;

    movingPlatforms.push(wall.index);

  }

  if (wallType == "portal"){

    wall.portalConnectionX = portalConnectionX;
    wall.portalConnectionY = portalConnectionY;

  }

  wallArr.push(wall);

  wallIndex += 1;
  wallToMapIndex[map.indexOf(mapType)] ++;

}

io.engine.on("connection", (rawSocket) => {
  rawSocket.request = null;
});

io.on('connection', function (socket) {

  
  console.log('a user connected');



  // create a new player and add it to our players object
  players[socket.id] = {
    rotation: 0,
    x: Buffer.from((Math.floor(Math.random() * (1100 - 500 + 1) + 500)).toString()),
    y: Buffer.from((Math.floor(Math.random() * (-800 - 450) + 450)).toString()),
    moveX: "NONE",
    moveY: "NONE",
    velX: 0,
    velY: 0,
    playerId: socket.id,
    playerIsDead: false,
    playerUsername: "no name",
    playerIsFlipped: false,
    kills: 0,
  };

  activePlayers.push(players[socket.id]);

  if (!wallAlreadyCreated){

    create_wall("standard", 650, 250, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 800, 250, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1000, 380, 1.5, 4, "wall", false, false);
    create_wall("standard", 400, 380, 1.5, 4, "wall", false, false);

    create_wall("standard", 800, 100, 1.8, 1.5, "grass", true, false);
    create_wall("standard", 300, 90, 8, 8, "wall", false, false);

    create_wall("standard", -200, 200, 1.8, 1.5, "grass", false, false);
    create_wall("standard", -350, 200, 1.8, 1.5, "grass", false, false);
    create_wall("standard", -500, 200, 1.8, 1.5, "grass", false, false);

    create_wall("standard", 100, 350, 1, 1, "wall", false, false);
    create_wall("standard", 100, 50, 1, 1, "wall", false, false);

    create_wall("standard", 1100, 120, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1250, 120, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1400, 120, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1550, 120, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1600, 120, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1050, 30, 2, 4, "wall", false, false);
    create_wall("standard", 1380, 30, 8, 1, "wall", false, false);

    create_wall("standard", -500, 130, 1.8, 1, "wall", false, true, 2500, 200, true);//-------------------18

    create_wall("standard", -200, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", -100, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 0, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 100, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 200, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 300, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 400, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 500, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 600, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 700, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 800, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 900, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1000, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1100, -300, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1200, -300, 1.8, 1.5, "grass", false, false);

    create_wall("standard", 200, -380, 2, 2, "wall", false, false);
    create_wall("standard", 300, -480, 2, 2, "wall", false, false);
    create_wall("standard", 600, -480, 10, 2, "wall", false, false);
    create_wall("standard", 300, -650, 1.8, 1.5, "grass", true, false);
    create_wall("standard", 200, -650, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 100, -650, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 200, -740, 1, 5, "wall", false, false);
    create_wall("standard", 30, -740, 1, 1, "wall", false, false);
    create_wall("standard", -200, -650, 10, 1, "wall", false, false);
    create_wall("standard", 900, -400, 2, 4, "wall", false, false);

    create_wall("standard", 700, -900, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 800, -900, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 900, -900, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1000, -900, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1100, -900, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1200, -900, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1300, -900, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1400, -900, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1500, -900, 1.8, 1.5, "grass", false, false);
    create_wall("standard", 1600, -900, 1.8, 1.5, "grass", false, false);

    create_wall("standard", 1200, -700, 34, 1, "wall", false, false);

    create_wall("standard", 400, -830, 1, 1, "wall", false, false);



    create_wall("standard", 1400, 310, 13, 1, "wall", false, false);
    create_wall("standard", 1800, 220, 2, 2, "wall", false, false);
    create_wall("standard", 1950, 220, 2, 1, "wall", false, true, 7650, 300, true);

    create_wall("standard", 1350, 30, 1.8, 1, "wall", false, true, 1500, 250, true);//-------------------34


  //world floor-----
  create_wall("standard", 700, 500, 80, 2.5, "worldFloor");









  //MAP 2----------------------------------------------------------------------------------------------------------------------------------

  create_wall("standard2", 200, 80, 2, 6, "wall", false, false);
  create_wall("standard2", 1400, 80, 2, 6, "wall", false, false);
  create_wall("standard2", 800, 170, 40, 2, "wall", false, false);
  //create_wall("standard2", 800, -250, 20, 5, "wall", false, false);

  create_wall("standard2", 500, -56, 5, 1, "wall", false, false);
  create_wall("standard2", 580, -7, 1, 4, "wall", false, false);

  create_wall("standard2", 800, -10, 1.8, 1.5, "grass", false, false);

  create_wall("standard2", 1130, -56, 5, 1, "wall", false, false);
  create_wall("standard2", 1050, -7, 1, 4, "wall", false, false);

  create_wall("standard2", 0, 400, 3, 1, "wall", false, true, 1800, 300, true);
  create_wall("standard2", -450, 400, 3, 1, "wall", false, true, 3000, 300, true);
  create_wall("standard2", -250, 380, 4, 2, "wall", false, false);

  create_wall("standard2", 240, 400, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 290, 400, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 610, 330, 6, 4, "wall", false, false);

  create_wall("standard2", 870, 410, 1, 4, "wall", false, false);
  create_wall("standard2", 1200, 410, 1, 4, "wall", false, false);

  create_wall("standard2", 1600, 330, 8, 1, "wall", false, false);

  create_wall("standard2", 1900, 230, 1.8, 1.5, "grass", false, false);

  create_wall("standard2", 1600, 120, 8, 1, "wall", false, false);

  create_wall("standard2", 1600, -150, 1, 1, "wall", false, false);

  create_wall("standard2", 1400, -280, 3, 1, "wall", false, false);

  create_wall("standard2", 1400, -600, 3, 1, "wall", false, true, 3100, -360, false);

  create_wall("standard2", 700, -420, 1, 4, "wall", false, false);
  create_wall("standard2", 220, -420, 1, 4, "wall", false, false);

  create_wall("standard2", 220, -330, 0.5, 1, "wall", false, true, 1000, 90, true);
  create_wall("standard2", 700, -330, 0.5, 1, "wall", false, true, 1000, 90, true);

  create_wall("standard2", 1080, -400, 4, 1, "wall", false, false);
  create_wall("standard2", 930, -460, 3, 3, "wall", false, false);

  create_wall("standard2", 0, -600, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", -200, -460, 1.8, 1.5, "grass", false, false);


  create_wall("standard2", -200, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", -100, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 0, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 100, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 200, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 300, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 400, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 500, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 600, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 700, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 800, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 900, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 1000, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 1100, -300, 1.8, 1.5, "grass", false, false);
  create_wall("standard2", 1200, -300, 1.8, 1.5, "grass", false, false);

  create_wall("standard2", 700, 500, 80, 2.5, "worldFloor");



  /*const changeMapInterval = setInterval(function(){

    setTimeout(function(){

      socket.broadcast.emit("prepareForMapChange");

    }, 299998)

    for (i = 0; i < movingIntervals.length; i++){

      clearInterval(movingIntervals[i])

    }

    currentMap = Math.floor(Math.random()*map.length);

    for (i = 0; i < movingPlatforms.length; i++){


      if (wallArr[movingPlatforms[i]].mapType == map[currentMap]){
        create_movingInterval(i);
      }

    }

    socket.broadcast.emit("hasChangedMap")

  }, 300000);*/

  setTimeout(function(){

    playersCanSee = false;
    console.log("lkasdfjlsakdfj")

  }, 175000)

  const changeMapInterval = setInterval(function(){

    setTimeout(function(){

      playersCanSee = false;
      console.log("lkasdfjlsakdfj")
  
    }, 175000)

    for (i = 0; i < movingIntervals.length; i++){

      clearInterval(movingIntervals[i])

    }

    let previousMap = currentMap;
    currentMap = Math.floor(Math.random()*map.length);
    while (currentMap == previousMap){

      currentMap = Math.floor(Math.random()*map.length);

    }

    for (i = 0; i < movingPlatforms.length; i++){


      if (wallArr[movingPlatforms[i]].mapType == map[currentMap]){
        create_movingInterval(i);
      }

    }

    playersCanSee = true;
    socket.broadcast.emit("hasChangedMap");

  }, 180000);


  wallAlreadyCreated = true;


  }

  socket.on("joined", function(){

    socket.emit("comfirmedClient")

    // send the players object to the new player
    socket.emit('currentPlayers', players);

    //sends wall object to other players
    for (i = 0; i < wallArr.length; i ++){

      socket.emit('createWall', wallArr[i], map[currentMap]);

    }

    socket.emit("wallAlreadyMade");

    if (!wallsAlreadyMoving){

      for (i = 0; i < movingPlatforms.length; i++){


        if (wallArr[movingPlatforms[i]].mapType == map[currentMap]){
          create_movingInterval(i);
        }

      }


      wallsAlreadyMoving = true;

    }




    // update all other players of the new player
    socket.on("clientUsername", (theirUsername)=>{

      players[socket.id].playerUsername = theirUsername;
      socket.broadcast.emit("returnUsername", players[socket.id].playerUsername, socket.id);

    });
    

    socket.broadcast.emit('newPlayer', players[socket.id]);
  })



  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {

    // remove this player from our players object
    let index = activePlayers.indexOf(players[socket.id]);

    if (index > -1){

      activePlayers.splice(index, 1);

    }

    delete players[socket.id];
    


    // emit a message to all players to remove this player
    io.emit('disconnected', socket.id);

    io.emit("active_users", io.engine.clientsCount);

  });

  socket.on("playerKills", function(player, id){

    if(players[id]!=undefined){

      players[id].kills = player.kills;

      activePlayers.sort(compareKills);
      activePlayers.reverse();
  
      let sentLeaderBoard = [];
  
      for (i = 0; i < activePlayers.length; i ++){
  
        if (i <= 4){
  
          sentLeaderBoard.push(`${i + 1}. ${activePlayers[i].playerUsername} (${activePlayers[i].kills}) \n`)
  
        }
  
      }
  
      socket.emit("recieveLeaderBoard", sentLeaderBoard.join(""));

    }

  })

  // when a player moves, update the player data
  socket.on('playerMovementX', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].moveX = movementData.moveX;
    players[socket.id].playerIsFlipped = movementData.playerIsFlipped;

    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMovedX', {
      playerId: socket.id, 
      playerIsDead: players[socket.id].playerIsDead,
      x: players[socket.id].x, 
      moveX: players[socket.id].moveX, 
      playerUsername: players[socket.id].playerUsername});


  });

  socket.on('playerMovementY', function (movementData) {
    players[socket.id].y = movementData.y;
    players[socket.id].x = movementData.x;
    players[socket.id].velY = movementData.velY;
    players[socket.id].moveY = movementData.moveY;

    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMovedY', players[socket.id]);


  });


  socket.on("clientsAddedVelocity", function(playerAddedVelocity){
  
    socket.broadcast.emit("otherPlayersAddedVelocity", socket.id, playerAddedVelocity)

  })


  socket.on("gunMovement", function(gunRotation, flipY, gunType, inventoryStatus){

    socket.broadcast.emit("otherGun", gunRotation, flipY, gunType, inventoryStatus, socket.id);

  });


  //listening for bullets-----
  socket.on('shootBullet', function(bulletX, bulletY, bulletVelocityX, bulletVelocityY, gun, bulletLifeSpan, angle, bulletType){

    socket.broadcast.emit("otherPlayerShoot", socket.id, bulletX, bulletY, bulletVelocityX, bulletVelocityY, gun, bulletLifeSpan, angle, bulletType);

  });

  socket.on("trackerBulletVelocity", function(x, y, angle, velocityX, velocityY, index, id){

    socket.broadcast.emit("othertrackerBulletVelocity", x, y, angle, velocityX, velocityY, index, id)

  })

  socket.on("requestOtherPlayersLife", function(){

    let deadPlayers = [];

    Object.keys(players).forEach(function (id) {
  
      if (players[id].playerIsDead) {
        deadPlayers.push(players[id].playerId);
      }
    
    });
    
    socket.emit("serversListOfDeadPlayers", deadPlayers);

  })

  socket.on("clientHitOtherPlayer", (otherPlayerId) => {

    if (players[otherPlayerId]){
      players[otherPlayerId].playerIsDead = true;
      socket.broadcast.emit("aClientHitSomeone", players[otherPlayerId], otherPlayerId, socket.id);
    }

  })

  socket.on("clientComfirmedDeath", (isDead, xcoor, ycoor)=>{

    players[socket.id].playerIsDead = isDead;
    players[socket.id].x = xcoor;
    players[socket.id].y = ycoor;

    socket.broadcast.emit('playerMovedY', players[socket.id]);
    socket.broadcast.emit('playerMovedx', players[socket.id]);

  })

  socket.on("selfPlayerRespawn", (xcoor, ycoor)=>{

    players[socket.id].playerIsDead = false;
    players[socket.id].x = xcoor;
    players[socket.id].y = ycoor;
    socket.broadcast.emit("aClientRespawned", players[socket.id]);

  })


  socket.on("secondaryShoot", function(secondaryX, secondaryY, secondaryVelX, secondaryVelY,
    secondaryType, secondaryLifeSpan){

    socket.broadcast.emit("otherSecondaryShoot", socket.id, secondaryX, secondaryY, secondaryVelX, secondaryVelY,
    secondaryType, secondaryLifeSpan);

  })


  socket.on("requestMapData", function(){

    socket.emit("serverCurrentMap", map[currentMap], playersCanSee);

  })

  socket.on("clientHasRecievedMapData", function(){

    for (i = 0; i < wallArr.length; i ++){

      socket.emit('createWall', wallArr[i], map[currentMap]);

    }

  })


//functions within the socket server-----


  io.emit("active_users", io.engine.clientsCount);

  function create_movingInterval(i){

    movingIntervals[i] = setInterval(function(){

      let tempVerticalBool = wallArr[movingPlatforms[i]].isVertical;
  
      emitWalldirection(wallArr[movingPlatforms[i]], tempVerticalBool)
  
    }, wallArr[movingPlatforms[i]].moveTime);
  
  }

  function emitWalldirection(wall, isVertical){

    var resetPos = false;

    if (wall.speed > 0){

      resetPos = true;

    }

    else if (wall.speed < 0){

      resetPos = false;

    }

    wall.speed = wall.speed*-1;
    socket.broadcast.emit("updateWalls", wall.x, wall.y, wall.speed, wall.indexRelToMap, isVertical, resetPos);

  }





});





function compareKills(a, b) {
  return a.kills - b.kills;
}