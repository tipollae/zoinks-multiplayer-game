


function create_pickUps(self){

    self.pistolPickUp = self.physics.add.sprite(300, -340, "gun");
    self.pistolPickUp.setScale(1, 1);

    self.shotgunPickUp = self.physics.add.sprite(400, -340, "shotgun");
    self.shotgunPickUp.setScale(2, 2);

    self.sniperPickup = self.physics.add.sprite(500, -340, "sniper");
    self.sniperPickup.setScale(2, 2);

    self.trackerPickup = self.physics.add.sprite(600, -340, "tracker");
    self.trackerPickup.setScale(1.2, 1.2);

    pickUpArr.push(self.pistolPickUp, self.shotgunPickUp, self.sniperPickup, self.trackerPickup);

}