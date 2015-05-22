function boot(game) {
    console.log('game is started');
}

boot.prototype = {
    preload: function () {
        this.game.load.image("loading", "assets/loading.png");
    },
    create: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.setScreenSize();
        this.game.state.start("Preload");
    }
}