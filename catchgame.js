const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 500,
  backgroundColor: "#2c3e50",
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

let paddle, ball, cursors, score = 0, scoreText, gameOver = false, speed = 180;

function preload() {}

function create() {
  // パドル
  paddle = this.physics.add.sprite(200, 470, null)
    .setDisplaySize(80, 16)
    .setImmovable(true)
    .setTint(0x00ff99);

  // ボール
  ball = this.physics.add.sprite(Phaser.Math.Between(30, 370), 0, null)
    .setDisplaySize(24, 24)
    .setCollideWorldBounds(false)
    .setBounce(0)
    .setTint(0xffff00);

  ball.body.setVelocity(0, speed);

  // 衝突
  this.physics.add.collider(ball, paddle, catchBall, null, this);

  // スコア表示
  scoreText = this.add.text(10, 10, "SCORE: 0", { fontSize: '20px', fill: '#fff' });

  // 入力
  cursors = this.input.keyboard.createCursorKeys();

  // マウス・タッチ対応
  this.input.on('pointermove', (pointer) => {
    paddle.x = Phaser.Math.Clamp(pointer.x, 40, 360);
  });
}

function update() {
  if (gameOver) return;

  // パドルを左右キーで動かす
  if (cursors.left.isDown) {
    paddle.x -= 7;
  } else if (cursors.right.isDown) {
    paddle.x += 7;
  }
  paddle.x = Phaser.Math.Clamp(paddle.x, 40, 360);

  // ボールが下に落ちたらゲームオーバー
  if (ball.y > 500) {
    gameOver = true;
    scoreText.setText("GAME OVER! SCORE: " + score);
    this.physics.pause();
  }
}

function catchBall(ball, paddle) {
  score += 1;
  scoreText.setText("SCORE: " + score);

  // 難易度アップ
  speed += 10;

  // ボール再配置
  ball.y = 0;
  ball.x = Phaser.Math.Between(30, 370);
  ball.body.setVelocity(0, speed);
}

new Phaser.Game(config);