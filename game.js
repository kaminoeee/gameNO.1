const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 320,
  backgroundColor: "#87CEEB",
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false,
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let player, cursors, ground, enemies, score = 0, scoreText, gameOver = false;

function preload() {
  this.graphics = this.add.graphics();
}

function create() {
  // 地面
  ground = this.physics.add.staticGroup();
  ground.create(240, 310, "ground").setScale(1, 1).refreshBody();

  // プレイヤー
  player = this.physics.add.sprite(80, 260, null)
    .setDisplaySize(32, 32)
    .setTint(0xffd700);
  player.body.setCollideWorldBounds(true);

  // 敵グループ
  enemies = this.physics.add.group();
  addEnemy(this);

  // 床（見た目だけ）
  this.add.rectangle(240, 310, 480, 20, 0x008800);

  // プレイヤーと地面の当たり判定
  this.physics.add.collider(player, ground);

  // プレイヤーと敵の当たり判定
  this.physics.add.overlap(player, enemies, hitEnemy, null, this);

  // スコア表示
  scoreText = this.add.text(10, 10, "SCORE: 0", { fontSize: '20px', fill: '#000' });

  // 入力
  cursors = this.input.keyboard.createCursorKeys();

  // 敵を定期的に追加
  this.time.addEvent({
    delay: 1200,
    callback: () => addEnemy(this),
    callbackScope: this,
    loop: true
  });
}

function update() {
  if (gameOver) return;

  // 左右移動
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  // ジャンプ（着地時のみ）
  if ((cursors.space.isDown || cursors.up.isDown) && player.body.touching.down) {
    player.setVelocityY(-400);
  }

  // 敵の移動と削除
  enemies.children.iterate(function (enemy) {
    if (enemy) {
      enemy.x -= 3;
      if (enemy.x < -30) {
        enemy.destroy();
        score += 1;
        scoreText.setText("SCORE: " + score);
      }
    }
  });
}

function addEnemy(scene) {
  const enemy = scene.physics.add.sprite(500, 278, null)
    .setDisplaySize(28, 28)
    .setTint(0xff2222);
  enemy.body.allowGravity = false;
  enemies.add(enemy);
}

function hitEnemy(player, enemy) {
  player.setTint(0x555555);
  gameOver = true;
  scoreText.setText("GAME OVER! SCORE: " + score);
  scene = player.scene;
  scene.physics.pause();
}

new Phaser.Game(config);