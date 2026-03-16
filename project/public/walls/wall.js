





function create_wall(self){

  var currentPortals = 0;

  self.socket.on("wallAlreadyMade", function(){

    alreadyMadeWalls = true;

  })

  self.socket.on('createWall', function (wall, map) {

    self.currentMap = map;

    if (!alreadyMadeWalls){

      console.log("test")

      if (wall.mapType == map){

      
        var wallObj = 0;
  
        if (wall.wallType == "grass"){
  
  
          wallObj = self.physics.add.sprite(wall.x, wall.y, 'ground_image');
          wallObj.setScale(wall.scaleWidth, wall.scaleHeight);
          
          wallObj.grass = self.add.sprite(wallObj.x, wallObj.y - wallObj.height/2 - 10, 'grass_image')
          wallObj.grass.setScale(wall.scaleWidth, wall.scaleHeight/4);
          wallObj.grass.depth = 10;
  
          self.anims.create({
            key: "grass_animation",
            frames: self.anims.generateFrameNumbers("grass_animationSpriteSheet"),
            frameRate: 5,
            repeat: -1,
          });
  
          wallObj.grass.play("grass_animation", true);
  
          if (wall.hasTree){
  
            wallObj.tree = self.add.sprite(wallObj.x, wallObj.y - wallObj.height/2 - 130, 'tree_image')
            wallObj.tree.setScale(2.5, 2.5);
            wallObj.tree.depth = -1;
            wallObj.hasTree = wall.hasTree;
  
          }
  
        }
  
        if (wall.wallType == "deathWall"){
  
  
          wallObj = self.physics.add.sprite(wall.x, wall.y, 'deathWall_image');
          wallObj.setScale(wall.scaleWidth, wall.scaleHeight)
          
          wallObj.deathWallOverlap = self.physics.add.overlap(self.player, wallObj, function(){
  
            self.player.alpha = 0;
    
          })
  
        }
  
  
        if (wall.wallType == "portal"){
  
  
          wallObj = self.physics.add.sprite(wall.x, wall.y, 'portal_image');
          wallObj.setScale(0.15, 0.15);
          
          wallObj.currentPortals = currentPortals;
  
          if (currentPortals == 0){
  
            self.physics.add.overlap(self.player, wallObj, function(){
  
              self.player.x = Math.floor(Math.random() * (wall.portalConnectionX + 200 - (wall.portalConnectionX - 200) + 1) + (wall.portalConnectionX - 200))
              self.player.y = wall.portalConnectionY;
      
            })
  
          }
  
          else{
  
            self.physics.add.overlap(self.player, wallObj, function(){
  
              self.player.x = wall.portalConnectionX;
              self.player.y = wall.portalConnectionY;
      
            })
  
          }
  
          currentPortals += 1;
  
        }
  
  
        else if (wall.wallType == "wall"){
  
          wallObj = self.physics.add.sprite(wall.x, wall.y, 'wall_image');
          wallObj.setScale(wall.scaleWidth, wall.scaleHeight)
          
  
        }
  
        else if (wall.wallType == "worldFloor"){
  
          wallObj = self.physics.add.sprite(wall.x, wall.y, 'worldFloor_image');
          wallObj.setScale(wall.scaleWidth, wall.scaleHeight)
          
          create_camera(self, 1, wallObj)
  
        }
  
        wallObj.mapType = wall.mapType;
        wallObj.wallType = wall.wallType;
        wallObj.setImmovable();
    
        wallObj.playerCollider = self.physics.add.collider(wallObj, self.player);
        //wallObj.otherPlayerCollider = self.physics.add.collider(wallObj, self.otherPlayers)
  
        wallObj.playerOverlap = self.physics.add.overlap(self.player, wallObj, function(){
  
          if (self.player.y - self.player.height/2 < wallObj.y - wallObj.height/2){
  
            self.player.y = wallObj.y - wallObj.height/2 - self.player.height/2 - 5;
  
          }
  
        })
  
        wallObj.groundCheckOverlap = self.physics.add.overlap(self.player.groundCheck, wallObj, function(){
  
          if (self.player.body.velocity.y >= self.player.speedY + 60){
  
            if (self.player.body.velocity.x > 0 || self.player.body.velocity.x < 0){
  
              self.player.addedVelocity += 12;

              if (self.player.oldPosition){

                if (self.player.oldPosition.oldAddedVelocity < self.player.addedVelocity - 70 ||
                self.player.oldPosition.oldAddedVelocity > self.player.addedVelocity + 70){

                  self.socket.emit("clientsAddedVelocity", 
                  buffer.Buffer.from(self.player.addedVelocity.toString()));

                }

              }
  
  
            }
      
          }
  
        })
  
    
        /*else if (wall.wallType == "grass"){
  
          wallObj.setTexture("ground_image");
          //wallObj.grass = self.add.sprite(wallObj.x, wallObj.y - wallObj.height/2, 'grass_image');
          //wallObj.grass.setScale(wall.scaleWidth,1);
        
        }*/
  
        self.walls.add(wallObj);

      }

    }
    
  });


}



function update_walls(self, delta){

  self.socket.emit("requestMapData")

  self.walls.getChildren().forEach(function (wallObj) {
    
    if (wallObj.mapType != self.currentMap){

      if (wallObj.wallType == "grass"){

        wallObj.grass.destroy(true)

        if (wallObj.hasTree){

          wallObj.tree.destroy(true);

        }
  
      }
  
      if (wallObj.wallType == "deathWall"){
  
        self.physics.world.removeCollider(wallObj.deathWallOverlap);
  
      }
  
      self.physics.world.removeCollider(wallObj.playerCollider);
      //self.physics.world.removeCollider(wallObj.otherPlayerCollider);
      self.physics.world.removeCollider(wallObj.playerOverlap);
      self.physics.world.removeCollider(wallObj.groundCheckOverlap);
      wallObj.destroy(true);

    }

  });

}