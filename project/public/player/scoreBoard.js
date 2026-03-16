


function create_scoreBoard(self, player){

    self.scoreBoard = self.add.text(self.cameras.main.scrollX + config.width - 100, self.cameras.main.scrollY + 150,  "", { font: '600 2vh Arial', fill: '#FFFFFF'});
    self.scoreBoard.content = []
    self.scoreBoard.setText(self.scoreBoard.content);
    self.scoreBoard.setScrollFactor(0, 0);
    self.scoreBoard.setOrigin(0.5, 0.5);
    self.scoreBoard.alpha = 0.8;
    self.scoreBoard.depth = 999;

    /*self.scoreBoard.background = self.add.rectangle(self.scoreBoard.x, self.scoreBoard.y, self.scoreBoard.width + 50, self.scoreBoard.height + 10, 0x000000);
    self.scoreBoard.background.setScrollFactor(0, 0);
    self.scoreBoard.background.setOrigin(0.5, 0.5);
    self.scoreBoard.background.alpha = 0.3;
    self.scoreBoard.background.depth = 109;*/

}