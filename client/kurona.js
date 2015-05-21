  Template.Game.helpers({

  });

  Template.Game.events({

  });

  var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game_box', {
      preload: preload,
      create: create,
      update: update
  });

  var playerBet;
  var opponentBet;
  var computerBet;
  var ball;
  var cursors;
  var statrtButton;

  var computerBetSpeed = 275;
  var playerBetSpeed = 300;
  var ballSpeed = 300;


  function createBet(x, y, sprite) {
      var bet = game.add.sprite(x, y, sprite);
      game.physics.arcade.enable(bet);
      bet.enableBody = true;
      bet.anchor.setTo(0.5, 0.5);
      bet.body.collideWorldBounds = true;
      bet.body.bounce.setTo(1, 1);
      bet.body.immovable = true;
      bet.scale.set(0.5, 0.5);
      bet.body.setSize(bet.width, bet.height / 2, 0, -bet.height / 4);

      return bet;
  }

  var ballReleased = false;

  function releaseBall() {
      if (!ballReleased) {
          ball.body.velocity.x = ballSpeed;
          ball.body.velocity.y = -ballSpeed;
          ballReleased = true;
      }
  }

  function ballHitsBet(_ball, _bet) {
      var diff = 0;

      if (_ball.x < _bet.x) {
          //  Шарик находится с левой стороны ракетки
          diff = _bet.x - _ball.x;
          _ball.body.velocity.x = (-10 * diff);
      } else if (_ball.x > _bet.x) {
          //  Шарик находится с правой стороны ракетки
          diff = _ball.x - _bet.x;
          _ball.body.velocity.x = (10 * diff);
      } else {
          //  Шарик попал в центр ракетки, добавляем немножко трагической случайности его движению
          _ball.body.velocity.x = 2 + Math.random() * 8;
      }
  }

  function preload() {
      game.load.image('ball', 'images/ball.png');
      game.load.image('background', 'images/fon.png');
      game.load.image('kurona', 'images/kuronaBet.png');
      game.load.image('kuma', 'images/kumaBet.png');
  }

  function create() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.add.tileSprite(0, 0, 1024, 768, 'background');
      playerBet = createBet(game.world.centerX, 748, 'kurona');
      computerBet = createBet(game.world.centerX, 110, 'kuma');
      cursors = game.input.keyboard.createCursorKeys();

      ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
      game.physics.arcade.enable(ball);
      ball.enableBody = true;
      ball.anchor.setTo(0.5, 0.5);
      ball.body.collideWorldBounds = true;
      ball.body.bounce.setTo(1, 1);

      game.input.onDown.add(releaseBall, this);

      statrtButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }

  function update() {
      //Управляем ракеткой игрока
      //playerBet.x = game.input.x;
      //playerBet.y = game.input.y;
      if (cursors.left.isDown) {
          playerBet.body.velocity.x = -playerBetSpeed;
      } else if (cursors.right.isDown) {
          playerBet.body.velocity.x = playerBetSpeed;
      } else {
          playerBet.body.velocity.x = 0;
      }
      if (cursors.up.isDown) {
          playerBet.body.velocity.y = -playerBetSpeed;
      } else if (cursors.down.isDown) {
          playerBet.body.velocity.y = playerBetSpeed;
      } else {
          playerBet.body.velocity.y = 0;
      }

      var playerBetHalfWidth = playerBet.width / 2;
      var playerBetHalfHeight = playerBet.height / 2;

      if (playerBet.x < playerBetHalfWidth) {
          playerBet.x = playerBetHalfWidth;
      } else if (playerBet.x > game.width - playerBetHalfWidth) {
          playerBet.x = game.width - playerBetHalfWidth;
      }
      if (playerBet.y < playerBetHalfHeight) {
          playerBet.y = playerBetHalfHeight;
      } else if (playerBet.y > game.height - playerBetHalfHeight) {
          playerBet.y = game.height - playerBetHalfHeight;
      }
      //Управляем ракеткой компьютерного соперника
      if (computerBet.x - ball.x < -20) {
          computerBet.body.velocity.x = computerBetSpeed;
      } else if (computerBet.x - ball.x > 20) {
          computerBet.body.velocity.x = -computerBetSpeed;
      } else {
          computerBet.body.velocity.x = 0;
      }

      //Проверяем и обрабатываем столкновения мячика и ракеток
      game.physics.arcade.collide(ball, playerBet, ballHitsBet, null, this);
      game.physics.arcade.collide(ball, computerBet, ballHitsBet, null, this);

  }