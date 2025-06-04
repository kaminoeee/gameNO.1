const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 320,
  backgroundColor: "#222244",
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let paddle, ball, bricks, cursors, score = 0, scoreText, gameOver = false;

function preload() {}

function create() {
  // パドル
  paddle = this.physics.add.sprite(240, 300, null)
    .setDisplaySize(80, 16)
    .setImmovable(true)
    .setTint(0x00ff99);

  // ボール
  ball = this.physics.add.sprite(240, 280, null)
    .setDisplaySize(12, 12)
    .setCollideWorldBounds(true)
    .setBounce(1)
    .setTint(0xffff00);
  ball.body.setVelocity(120, -200);

  // ブロック（レンガ）
  bricks = this.physics.add.staticGroup();
  const rows = 5, cols = 10;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const brickX = 40 + col * 40;
      const brickY = 40 + row * 20;
      bricks.create(brickX, brickY, null)
        .setDisplaySize(36, 16)
        .setOrigin(0)
        .setTint(Phaser.Display.Color.GetColor(100 + row * 30, 180 - row * 20, 200));
    }
  }

  // 壁
  this.physics.world.setBoundsCollision(true, true, true, false);

  // 衝突
  this.physics.add.collider(ball, paddle, hitPaddle, null, this);
  this.physics.add.collider(ball, bricks, hitBrick, null, this);

  // スコア表示
  scoreText = this.add.text(10, 10, "SCORE: 0", { fontSize: '20px', fill: '#fff' });

  // 入力
  cursors = this.input.keyboard.createCursorKeys();

  // マウスでもパドルを動かせる
  this.input.on('pointermove', (pointer) => {
    paddle.x = Phaser.Math.Clamp(pointer.x, 40, 440);
  });
}

function update() {
  if (gameOver) return;

  // パドルを左右キーで動かす
  if (cursors.left.isDown) {
    paddle.x -= 6;
  } else if (cursors.right.isDown) {
    paddle.x += 6;
  }
  paddle.x = Phaser.Math.Clamp(paddle.x, 40, 440);

  // ボールが下に落ちたらゲームオーバー
  if (ball.y > 330) {
    gameOver = true;
    scoreText.setText("GAME OVER! SCORE: " + score);
    this.physics.pause();
  }

  // 全てのブロックを壊したらクリア
  if (bricks.countActive() === 0 && !gameOver) {
    gameOver = true;
    scoreText.setText("CLEAR! SCORE: " + score);
    this.physics.pause();
  }
}

function hitPaddle(ball, paddle) {
  // パドルの当たった位置で反射角度を変える
  let diff = ball.x - paddle.x;
  ball.setVelocityX(diff * 6);
}

function hitBrick(ball, brick) {
  brick.disableBody(true, true);
  score += 10;
  scoreText.setText("SCORE: " + score);
}

new Phaser.Game(config);