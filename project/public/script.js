/*

syntax note just incase you forget-----

when giving an object sprite or a non living sprite a name please write the name after the following: 

objectnameSprite




and when giving and npc sprite a name or anything that is to simulate life please write it after the following: 

npcname_sprite


*/




var username = prompt("enter a username");


if (username.length > 15){


  username = ""

} 


//prevents user from right clicking-----
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener("visibilitychange", () => {

  if (document.hidden) {
    //window.open('','_self').close()
  }
});










const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1000,
    height: 500,
    scene: {
    
      preload: preload,
      create: create,
      update: update,
    
    },
    backgroundColor: '#51CFC9',


    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            fps: 2000,
            overlapBias: 8,
        }
    },



    scale: {
      zoom: 2,
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    }

};



const game = new Phaser.Game(config);
//game.scale.canvasSmoothingEnabled = true;



//setting "self" attribute-----





//keyboard variables----------------
var keys = {};
var right_pressed = false;
var left_pressed = false;
var up_pressed = false;
var down_pressed = false;

var right_arrow_pressed = false;
var left_arrow_pressed = false;
var up_arrow_pressed = false;
var down_arrow_pressed = false;

var space_pressed = false;




//mechanic keys-----
var e_pressed = false;
var shift_pressed = false;
var r_pressed = false;


//inventory keys-----
var one_key_pressed = false;
var two_key_pressed = false;
var three_key_pressed = false;

var pickUpArr = [];



//server bool-----
var isInSync = false;
var mapType = "";

var alreadyMadeWalls = false;

setTimeout(function(){

  if (!isInSync){

    alert("Err: user not in sync. Refreshing page");
    location.reload();

  }

}, 10000)

function preload() {

  window.self = this; 
  self.socket = io();

  self.load.image("aim_image", "player/aim.png")

  self.load.image("player_image", "player/player.png");
  self.load.image("playerBullet_image", "player/playerBullet.png")
  self.load.image("inventorySlot_image", "player/inventorySlot.png")

  self.load.image("border", "player/border.png")

  self.load.image("otherPlayer_image", "player/otherPlayer.png")
  self.load.image("otherPlayerBullet_image", "player/otherPlayerBullet.png")

  self.load.image("gun", "player/gun.png");
  self.load.image("shotgun", "player/shotgun.png");
  self.load.image("sniper", "player/sniper.png");
  self.load.image("tracker", "player/tracker.png")

  self.load.image("grenade", "player/grenade.png");
  self.load.audio('explosion_soundEffect', ['player/explosion_sound.mp3']);
  self.load.spritesheet("explosion_spriteSheet", 'player/explosion.png', {

    frameWidth: 130,
    frameHeight: 125,

  });



  self.load.image("wall_image", "walls/wall.png");
  self.load.image("worldFloor_image", "walls/worldFloor.png");
  self.load.image("ground_image", "walls/ground.png")
  self.load.image("grass_image", "walls/grass.png")
  self.load.image("tree_image", "walls/tree.png")

  self.load.spritesheet("grass_animationSpriteSheet", 'walls/grass_animationSprite.png', {

    frameWidth: 100,
    frameHeight: 50,

  });


  self.load.image("portal_image", "walls/portal.png");
  self.load.image("deathWall_image", "walls/deathWall.png")

  self.load.audio('killSoundAffect', ['player/kill.mp3']);
  self.load.audio("hurtSoundAffect", ["player/hurt.mp3"]);

  self.load.audio("pistol_sound", ["player/pistol_sound.mp3"])
  self.load.audio("shotgun_sound", ["player/shotgun_sound.mp3"])
  self.load.audio("sniper_sound", ["player/sniper_sound.mp3"])
  self.load.audio("tracker_sound", ["player/tracker_sound.mp3"])

  self.load.image("arrow", "player/arrow.png")

}


function create() {

  self.otherPlayers = self.add.group();

  tellServer(self);
  self.walls = self.add.group();
  self.currentMap = "";

  create_wall(self);

  self.socket.emit("joined");
  self.socket.emit("clientUsername", username);

  self.physics.add.collider(self.otherPlayers, self.walls)


  create_pickUps(self);

}


function update(time, delta) {

  clientLogic(self, delta);

  self.otherPlayers.getChildren().forEach(function (otherPlayer) {

    if (otherPlayer.isDead){

      otherPlayer.alpha = 0;
      //console.log("otherPlayer id dead")

    }
    
  });

  self.otherPlayers.getChildren().forEach(function (otherPlayer) {

    otherPlayer.theirBullets.getChildren().forEach(function (otherPlayerBullets) {

      otherPlayerBullets.life += 1 * delta;

    if (otherPlayerBullets.life >= otherPlayerBullets.lifeSpan) {
      otherPlayerBullets.destroy(true);
      otherPlayer.theirBullets.remove(otherPlayerBullets, true);
    }

    });

    otherPlayer.setVelocityX(otherPlayer.horizontalVelocity);

    if (otherPlayer.horizontalVelocity > 0){

      otherPlayer.flipX = false;

    }

    else if (otherPlayer.horizontalVelocity < 0){

      otherPlayer.flipX = true;

    }

    otherPlayer.username.x = otherPlayer.x - otherPlayer.username.width/2;
    otherPlayer.username.y = otherPlayer.y - 70;

    if (!otherPlayer.isDead){

      if (!otherPlayer.gun.flipY){

        otherPlayer.gun.x = otherPlayer.x + otherPlayer.width/2;
        otherPlayer.gun.y = otherPlayer.y;
  
      }
  
      else{
  
        otherPlayer.gun.x = otherPlayer.x - otherPlayer.width/2;
        otherPlayer.gun.y = otherPlayer.y;
  
      }

    }

    else{

      otherPlayer.gun.x = 10000000000;
      otherPlayer.gun.y = 10000000000;

    }

    otherPlayer.gun.alpha = 1;

    if (otherPlayer.movingX == "RIGHT"){

      if (otherPlayer.addedVelocity <= 300){

        otherPlayer.setVelocityX(otherPlayer.speedX + otherPlayer.addedVelocity);

      }

      else{

        otherPlayer.setVelocityX(otherPlayer.speedX + 300);

      }
      
      if (otherPlayer.addedVelocity >= 1){

        otherPlayer.addedVelocity -= 3;

      }

    }

    else if (otherPlayer.movingX == "LEFT"){

      if (otherPlayer.addedVelocity <= 300){

        otherPlayer.setVelocityX(-(otherPlayer.speedX + otherPlayer.addedVelocity));

      }

      else{

        otherPlayer.setVelocityX(-(otherPlayer.speedX + 300));

      }
      
      if (otherPlayer.addedVelocity >= 1){

        otherPlayer.addedVelocity -= 3;

      }

    }

    else{

      if (otherPlayer.addedVelocity <= 300){

        otherPlayer.setVelocityX(0);
        otherPlayer.movingX = "NONE";

      }

      if (otherPlayer.addedVelocity >= 1){

        otherPlayer.addedVelocity -= 3;

      }

    }

    if (otherPlayer.body.velocity.x <= otherPlayer.speedX && otherPlayer.body.velocity.x >= -otherPlayer.speedX){

      otherPlayer.addedVelocity = 0;

    }

    otherPlayer.groundCheck.x = otherPlayer.x;
    otherPlayer.groundCheck.y = otherPlayer.y + 15

    //console.log(otherPlayer.gun.x, otherPlayer.gun.y)
    //console.log(`OTHER PLAYER: ${otherPlayer.x} ${otherPlayer.y}. ALPHA: ${otherPlayer.alpha, otherPlayer.isDead}`)

  });

  update_walls(self, delta)


  for (i = 0; i < pickUpArr.length; i++){

    pickUpArr[i].rotation += 0.01;

  }

  self.socket.emit("requestOtherPlayersLife")

}





function addOtherPlayers(self, playerInfo) {


  const otherPlayer = self.physics.add.sprite(parseFloat(buffer.Buffer.from(playerInfo.x).toString()),
  parseFloat(buffer.Buffer.from(playerInfo.y).toString()) - 15, 'otherPlayer_image');
  console.log(otherPlayer.x, otherPlayer.y)
  otherPlayer.setScale(1, 1);

  otherPlayer.theirBullets = self.add.group({maxSize: 10});
  otherPlayer.secondaryWeapon = self.add.group({maxSize: 10});

  otherPlayer.theirAmountOfKills = playerInfo.kills;

  otherPlayer.gun = self.physics.add.sprite(otherPlayer.x + otherPlayer.width/2, otherPlayer.y, "gun");
  otherPlayer.gun.setScale(1, 1);

  otherPlayer.groundCheck = self.physics.add.sprite(otherPlayer.x, otherPlayer.y + 15, "")
  otherPlayer.groundCheck.setScale(1.5, 1.2);
  otherPlayer.groundCheck.alpha = 0;

  otherPlayer.speedX = 400;
  otherPlayer.speedY = 600;
  otherPlayer.movingX = "NONE"

  otherPlayer.body.setGravityY(1100);
  otherPlayer.horizontalVelocity = 0;
  otherPlayer.addedVelocity = 0;

  otherPlayer.theirUsername = playerInfo.playerUsername;

  otherPlayer.isDead = playerInfo.playerIsDead;
  otherPlayer.deathToClient = false;

  otherPlayer.username = self.add.text(otherPlayer.x, otherPlayer.y - 70, otherPlayer.theirUsername, { font: '3vh Arial', fill: '#FF1700'});;
  otherPlayer.username.x -= otherPlayer.username.width/2;
  otherPlayer.username.depth = 50;

  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);

  otherPlayer.bulletCollider = self.physics.add.overlap(otherPlayer, self.player.bullets, function(){
    
    if (otherPlayer.alpha != 0 || !otherPlayer.isDead){

      self.socket.emit("clientHitOtherPlayer", otherPlayer.playerId);
      self.player.killSound.play();
      self.player.amountOfKills += 1;

      //self.socket.emit("updateClientKills", )
      otherPlayer.isDead = true;

      otherPlayer.alpha = 0;

      self.player.killNotification.alpha = 1;
      self.player.killNotification.playerKilled = otherPlayer.theirUsername;

    }

    else{

      return;

    }

  })

  otherPlayer.secondaryCollider = self.physics.add.overlap(otherPlayer, self.player.secondaryWeapon, function(){


    if (otherPlayer.alpha !== 0 || !otherPlayer.isDead){

      self.socket.emit("clientHitOtherPlayer", otherPlayer.playerId);
      self.player.killSound.play();
      self.player.amountOfKills += 1;
      otherPlayer.alpha = 0;
  
      otherPlayer.isDead = true;
  
      self.player.killNotification.alpha = 1;
      self.player.killNotification.playerKilled = otherPlayer.theirUsername;

    }
  
  
    else{
  
      return;
  
    }

    self.player.secondaryWeapon.getChildren().forEach(function(grenade){

      grenade.tempCollider = self.physics.add.overlap(grenade, otherPlayer, function(){
  
        grenade.life = grenade.lifeSpan + 20;

      })
  
      self.physics.world.removeCollider(grenade.tempCollider);
  
    })


  });


  otherPlayer.wallsOverlap = self.physics.add.overlap(otherPlayer, self.walls, otherPlayer_wallOverlapHandler(otherPlayer));

}


function otherPlayer_wallOverlapHandler(otherPlayer){

  self.walls.children.each(function(wall){

    wall.temporaryOverlap = self.physics.add.overlap(otherPlayer, wall, function(){
      
      if (otherPlayer.y - otherPlayer.height/2 < wall.y - wall.height/2){
  
        otherPlayer.y = wall.y - wall.height/2 - otherPlayer.height/2 - 5;

      }

    });

    self.physics.world.removeCollider(wall.temporaryOverlap);

    console.log(wall.temporaryOverlap)

  })

}

function otherGrenade_overlapHandler(otherGrenade, idOrigin){

  self.otherPlayers.children.each(function(otherPlayer){

    if (otherPlayer.playerId !== idOrigin){

      console.log(otherPlayer.playerId, idOrigin)

      otherPlayer.temporaryOverlap = self.physics.add.overlap(otherPlayer, otherGrenade, function(){
      
        otherGrenade.life = otherGrenade.lifeSpan + 20;
        self.physics.world.removeCollider(otherPlayer.temporaryOverlap);
  
      });

    }

  })

}








//jquery for  movement---

$(document).keydown(function (e){

    if (e.which == 87){
      //w is pressed
      up_pressed = true;
    }



    if (e.which == 65){
      //a is pressed
      left_pressed = true;
    }



    if (e.which == 83){
      //s is pressed
      down_pressed = true;
    }



    if (e.which == 68){
      //d is pressed
      right_pressed = true;
    }






    if (e.which == 39) {
    //d is pressed
    right_arrow_pressed = true;
    }

    if (e.which == 37) {
    //a is pressed
    left_arrow_pressed = true;
    }

    if (e.which == 38) {
    //w is pressed
    up_arrow_pressed = true;
    }

    if (e.which == 40) {
    //s is pressed
    down_arrow_pressed = true;
    }



    if (e.which == 32 || e.which == 13){
    space_pressed = true;
    return false;
    //space is pressed
    }




    //mechanic keys-----
    if (e.which == 69){
      e_pressed = true;
    }


    if (e.which == 16){
      shift_pressed = true;
    }


    if (e.which == 82){
      r_pressed = true;
    }




    //inventory keys-----

    if (e.which == 49) {
    //1 is pressed
    one_key_pressed = true;
    }



    if (e.which == 50){
    two_key_pressed = true;
    //2 is pressed
    }



    if (e.which == 51){
    three_key_pressed = true;
    //3 is pressed
    }

    
  

});







$(document).keyup(function (e) {
    delete keys[e.which]; 

    if (e.which == 68) {
    //d is pressed
    right_pressed = false;
    }

    if (e.which == 65) {
    //a is pressed
    left_pressed = false;
    }   

    if (e.which == 87) {
    //w is pressed
    up_pressed = false;
    }

    if (e.which == 83) {
    //s is pressed
    down_pressed = false;
    }   




    if (e.which == 39) {
    //d is pressed
    right_arrow_pressed = false;
    }

    if (e.which == 37) {
    //a is pressed
    left_arrow_pressed = false;
    }

    if (e.which == 38) {
    //w is pressed
    up_arrow_pressed = false;
    }

    if (e.which == 40) {
    //s is pressed
    down_arrow_pressed = false;
    }



    if (e.which == 32 || e.which == 13){
    space_pressed = false;
    //space is pressed
    }




    //mechanic keys-----
    if (e.which == 69){
      e_pressed = false;
    }


    if (e.which == 16){
      shift_pressed = false;
    }


    if (e.which == 82){
      r_pressed = false;
    }




    //inventory keys-----

    if (e.which == 49) {
    //1 is pressed
    one_key_pressed = false;
    }



    if (e.which == 50){
    two_key_pressed = false;
    //2 is pressed
    }



    if (e.which == 51){
    three_key_pressed = false;
    //3 is pressed
    }



});
//jquery for  movement---

