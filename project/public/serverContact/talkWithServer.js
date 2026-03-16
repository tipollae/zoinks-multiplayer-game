





function tellServer(self){

  self.socket.on("comfirmedClient", function(){


    self.socket.on('currentPlayers', function (players) {

      addPlayer(self, players[self.socket.id])

      Object.keys(players).forEach(function (id) {

        if(players[id].playerId !== self.socket.id) {
          addOtherPlayers(self, players[id]);
        }
      
      });
  
    });
  
    self.socket.on('newPlayer', function (playerInfo) {

      addOtherPlayers(self, playerInfo);
      console.log(buffer.Buffer.from(playerInfo.x).toString())
      console.log(buffer.Buffer.from(playerInfo.y).toString())

      self.socket.emit('playerMovementY', { 
        y: buffer.Buffer.from(self.player.y.toString()),
        x: buffer.Buffer.from(self.player.x.toString()),
        velY: buffer.Buffer.from(self.player.body.velocity.y.toString()),
        moveY: buffer.Buffer.from(self.player.movingY),
        });  

        self.socket.emit('playerMovementX', { x: buffer.Buffer.from(self.player.x.toString()),
          moveX: buffer.Buffer.from(self.player.movingX),
          playerIsFlipped: self.player.flipX });
      
    });
  
    self.socket.on('disconnected', function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.theirBullets.clear(true);
          otherPlayer.theirBullets.destroy(true);
          otherPlayer.groundCheck.destroy(true);
          self.physics.world.removeCollider(otherPlayer.bulletCollider);
          self.physics.world.removeCollider(otherPlayer.secondaryCollider);
          self.physics.world.removeCollider(otherPlayer.groundCheckCollider);
          otherPlayer.username.destroy(true);
          otherPlayer.gun.destroy(true);
          otherPlayer.destroy(true);
        }
      });
  
    });
  
    
    self.socket.on("active_users", function(amountOfUsersSERVER){
  
      self.player.amountOfUsers = amountOfUsersSERVER;
  
    });
  
    self.socket.on("recieveLeaderBoard", function(sentLeaderBoard){
  
      self.scoreBoard.content = [
        'Leaderboard:',
        sentLeaderBoard
      ];
        
      self.scoreBoard.setText(self.scoreBoard.content);
  
    })
  
    self.socket.on('playerMovedX', function (playerInfo) {
      console.log("moved X")
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          
          if (playerInfo.playerIsDead){

            otherPlayer.alpha = 0;

          }

          else if (!playerInfo.playerIsDead && otherPlayer.alpha == 0){

            otherPlayer.alpha = 1;

          }
          
          let otherPlayerX = parseFloat(buffer.Buffer.from(playerInfo.x));
          let otherPlayerMoveX = buffer.Buffer.from(playerInfo.moveX).toString()
          
          otherPlayer.x = otherPlayerX;
          otherPlayer.movingX = otherPlayerMoveX;
  
          otherPlayer.theirUsername = playerInfo.playerUsername;
  
        }
      });
  
    });

    self.socket.on('playerMovedY', function (playerInfo) {

      console.log("moved Y")

      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          
          if (playerInfo.playerIsDead){

            otherPlayer.alpha = 0;

          }

          else if (!playerInfo.playerIsDead && otherPlayer.alpha == 0){

            otherPlayer.alpha = 1;

          }

          let otherPlayerVelY =  parseFloat(buffer.Buffer.from(playerInfo.velY).toString())
          
          let otherPlayerY = parseFloat(buffer.Buffer.from(playerInfo.y));
          let otherPlayerX = parseFloat(buffer.Buffer.from(playerInfo.x));

          otherPlayer.y = otherPlayerY
          otherPlayer.x = otherPlayerX

          otherPlayer.setVelocityY(otherPlayerVelY)
  
          otherPlayer.theirUsername = playerInfo.playerUsername;
  
          otherPlayer.username.x = otherPlayer.x - otherPlayer.username.width/2;
          otherPlayer.username.y = otherPlayer.y - 70;
  
        }
      });
  
    });


    self.socket.on("otherPlayersAddedVelocity", function(otherPlayerId, otherPlayerAddedVel){

      console.log("ADDED velocity")

      self.otherPlayers.getChildren().forEach(function (otherPlayer) {

        if (otherPlayer.playerId === otherPlayerId){

          convertedAddedVel = parseFloat(buffer.Buffer.from(otherPlayerAddedVel).toString())
          otherPlayer.addedVelocity = convertedAddedVel

        }

      });

    })

  
    self.socket.on("otherGun", function(gunRotation, flipY, gunType, inventoryStatus, otherPlayerId){
  
      let bufferedGunRotation = parseFloat(buffer.Buffer.from(gunRotation));
      let bufferedFlipY = (String(buffer.Buffer.from(flipY)) == 'true');
      let bufferedGunType = String(buffer.Buffer.from(gunType));
      let bufferedInventoryStatus = String(buffer.Buffer.from(inventoryStatus));

      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (otherPlayerId === otherPlayer.playerId) {

          otherPlayer.gun.flipY = bufferedFlipY;

          if (bufferedInventoryStatus == "primary"){
  
            otherPlayer.gun.flipY = bufferedFlipY;

            if (bufferedGunType == "pistol"){
  
              otherPlayer.gun.setTexture("gun");
              otherPlayer.gun.setScale(1, 1);
    
            }
    
            if (bufferedGunType == "shotgun"){
    
              otherPlayer.gun.setTexture("shotgun");
              otherPlayer.gun.setScale(2, 2);
    
            }
    
    
            if (bufferedGunType == "sniper"){
    
              otherPlayer.gun.setTexture("sniper");
              otherPlayer.gun.setScale(2, 2);
    
            }
  
            if (bufferedGunType == "tracker"){
    
              otherPlayer.gun.setTexture("tracker");
              otherPlayer.gun.setScale(1.2, 1.2);
    
            }
    
            otherPlayer.gun.setRotation(bufferedGunRotation)
  
          }
  
          if (bufferedInventoryStatus == "secondary"){
  
            otherPlayer.gun.setTexture("grenade");
            otherPlayer.gun.setScale(0.8, 0.8);
            otherPlayer.gun.flipY = false;
            otherPlayer.gun.setRotation(0);
  
          }        
  
        }
      });
  
    })
  
    self.socket.on('otherPlayerShoot', function(playerId, bulletX, bulletY,  bulletVelocityX, 
      bulletVelocityY, gun, bulletLifeSpan, angle, bulletType){
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
  
          
          const otherPlayerBullet = self.physics.add.sprite(bulletX, bulletY, "otherPlayerBullet_image");
          otherPlayerBullet.setScale(0.3, 0.3);
          otherPlayerBullet.index = otherPlayer.theirBullets.getLength();
          otherPlayerBullet.lifeSpan = bulletLifeSpan + 30;
          //console.log(bulletLifeSpan)
          otherPlayerBullet.life = 0;
          otherPlayerBullet.setRotation(angle)
  
          otherPlayerBullet.wallCollider =  self.physics.add.overlap(otherPlayerBullet, self.walls, function(){
  
            self.physics.world.removeCollider(otherPlayerBullet.wallCollider);
            otherPlayerBullet.destroy(true);
            otherPlayer.theirBullets.remove(otherPlayerBullet, true);
            
          })
  
          otherPlayerBullet.bulletType = bulletType;
  
          if (bulletType == "tracker"){
  
            otherPlayerBullet.trackTime = 0;
            otherPlayerBullet.trackSpan = 500;
            otherPlayerBullet.cursorTargetX;
            otherPlayerBullet.cursorTargetY;
            otherPlayerBullet.index = otherPlayer.theirBullets.getLength();
  
          }
  
          otherPlayerBullet.setVelocityX(bulletVelocityX);
          otherPlayerBullet.setVelocityY(bulletVelocityY);
          otherPlayer.theirBullets.add(otherPlayerBullet);
  
  
        }
  
      });
      
    });
    
  
    self.socket.on("othertrackerBulletVelocity", function(x, y, angle, velocityX, velocityY, index, playerId){
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
  
          otherPlayer.theirBullets.getChildren().forEach(function (otherPlayerBullet) {

            let bufferedX = parseFloat(buffer.Buffer.from(x))
            let bufferedY = parseFloat(buffer.Buffer.from(y))
            let befferedAngle = parseFloat(buffer.Buffer.from(angle))
            let bufferedVelX = parseFloat(buffer.Buffer.from(velocityX))
            let bufferedVelY = parseFloat(buffer.Buffer.from(velocityY))
            let bufferedIndex = parseInt(buffer.Buffer.from(index))
  
            if (otherPlayerBullet.bulletType == "tracker" && otherPlayerBullet.index == bufferedIndex){
  
              otherPlayerBullet.x = bufferedX;
              otherPlayerBullet.y = bufferedY;
  
              otherPlayerBullet.setRotation(befferedAngle);
  
              otherPlayerBullet.setVelocityX(bufferedVelX);
              otherPlayerBullet.setVelocityY(bufferedVelY);
  
            }
    
          });
  
        }
  
      });
  
    })
  
  
    self.socket.on("otherSecondaryShoot", function(otherPlayerId, secondaryX, secondaryY, secondaryVelX, secondaryVelY,
      secondaryType, secondaryLifeSpan){
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (otherPlayerId === otherPlayer.playerId) {
  
          if (secondaryType == "grenade"){
  
            const otherGrenade = self.physics.add.sprite(secondaryX, secondaryY, "grenade")
            otherGrenade.setScale(0.8, 0.8);
            otherGrenade.lifeSpan = secondaryLifeSpan;
            otherGrenade.life = 0;
            otherGrenade.type = "grenade";
            otherGrenade.depth = 50;
            otherGrenade.isExploding = false;
            otherGrenade.explosion_sound = self.sound.add("explosion_soundEffect")
  
            self.anims.create({
              key: "explosion_animation",
              frames: self.anims.generateFrameNumbers("explosion_spriteSheet"),
              frameRate: 17,
              repeat: 0,
            });
    
            otherGrenade.body.setGravityY(800);
            otherGrenade.body.bounce.x = 0.6;
            otherGrenade.body.bounce.y = 0.6;
            otherGrenade.setFrictionX(10);
    
            //otherGrenade.on('animationcomplete', otherGrenade.destroy(true));
    
            otherGrenade.wallCollider = self.physics.add.collider(otherGrenade, self.walls);
            otherGrenade.playerCollider = self.physics.add.overlap(otherGrenade, self.player, function(){
  
              otherGrenade.life = otherGrenade.lifeSpan + 20;
  
            })

            otherGrenade.playerCollider = self.physics.add.overlap(otherGrenade, self.otherPlayers, 
              otherGrenade_overlapHandler(otherGrenade, otherPlayer.playerId))

            //otherGrenade.otherPlayerColliders = self.physics.add.collider(otherGrenade, self.otherPlayers, 
            //  otherGrenade_overlapHandler(otherGrenade, otherPlayer.playerId))


  
            otherGrenade.setVelocityX(secondaryVelX);
            otherGrenade.setVelocityY(secondaryVelY);
            otherPlayer.secondaryWeapon.add(otherGrenade);
  
          }
  
        }
      });
  
    })
  
    self.socket.on("serversListOfDeadPlayers", function(listOfDead){

      self.otherPlayers.getChildren().forEach(function (otherPlayer) {

        for (i = 0; i < listOfDead.length; i++){

          if (otherPlayer.playerId === listOfDead[i]) {

            otherPlayer.alpha = 0;
            otherPlayer.isDead = true;
            otherPlayer.y = -10000000;

          otherPlayer.alpha = 0;
          self.socket.emit("serverSideElimination", otherPlayer.playerId);
    
          }

          else{

            otherPlayer.isDead = false;

          }

        }

      });

    })
  
    self.socket.on("aClientHitSomeone", (otherPlayerObject, otherPlayerId, clientId) =>{
  
      if (otherPlayerId == self.socket.id){
  
        self.player.alpha = 0;
  
      }
  
      if (otherPlayerId != clientId){
  
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
          if (otherPlayerId === otherPlayer.playerId) {
  
              otherPlayer.alpha = 0.5;
              otherPlayer.y = -10000000;
              otherPlayer.isDead = true;

          }
        });
  
      }
  
    })
  
  
    self.socket.on("aClientRespawned", (playerInfo)=>{

      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (otherPlayer.playerId === playerInfo.playerId) {

          otherPlayer.alpha = 1;
          otherPlayer.isDead = false;

          otherPlayer.x = playerInfo.x;
          otherPlayer.y = playerInfo.y;
  
        }
      });
  
    })
  
    
  
    self.socket.on("returnUsername", (theirUsername, theirId) => {
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (theirId === otherPlayer.playerId) {
  
          otherPlayer.username.setText(theirUsername);
  
        }
      });
  
    })
  
  
    self.socket.on("updateWalls", (wallX, wallY, wallSpeed, index, isVertical, resetPos)=>{
  
      isInSync = true;
  
      if (resetPos){
  
        self.walls.getChildren()[index].x = wallX;
        self.walls.getChildren()[index].y = wallY;
  
      }
  
      if (isVertical){
  
        self.walls.getChildren()[index].setVelocityY(wallSpeed);
  
      }
  
      else if (!isVertical){
  
        self.walls.getChildren()[index].setVelocityX(wallSpeed);
  
      }
  
    })
  
    self.socket.on("serverCurrentMap", function(currentMap, canSee){
  
      if (self.currentMap != currentMap){
        self.currentMap = currentMap;
  
        alreadyMadeWalls = false;
        self.socket.emit("clientHasRecievedMapData")
  
      }
  
      self.player.canSee = canSee;
    })
  
    self.socket.on("hasChangedMap", function(){
  
      self.player.amountOfKills = 0;
      self.player.y = Math.floor(Math.random() * (-800 - 450) + 450)
      self.player.x = Math.floor(Math.random() * (1100 - 500 + 1) + 500);

      self.socket.emit('playerMovementY', { 
        y: buffer.Buffer.from(self.player.y.toString()),
        x: buffer.Buffer.from(self.player.x.toString()),
        velY: buffer.Buffer.from(self.player.body.velocity.y.toString()),
        moveY: buffer.Buffer.from(self.player.movingY),
        });  

        self.socket.emit('playerMovementX', { x: buffer.Buffer.from(self.player.x.toString()),
          moveX: buffer.Buffer.from(self.player.movingX),
          playerIsFlipped: self.player.flipX });
      self.player.canSee = true;
      
    })
  

  })

}