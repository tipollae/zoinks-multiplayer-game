





function create_camera(self, cameraBounds, floor){


  //self.cameras.main.setBounds(0, 0, 10000, 1000000);        

  self.cameras.main.startFollow(self.player);
  self.cameras.main.setLerp(0.031);
  //self.cameras.main.roundPixels = true;
    

  
}