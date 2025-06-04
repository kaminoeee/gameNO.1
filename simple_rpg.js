const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 320,
  backgroundColor: "#639bff",
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: { preload, create, update }
};

let player, cursors, messageText, chest, found = false;

function preload() {}

function create() {
  // フィールド（草原）
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 15; x++) {
      this.add.rectangle(16 + x * 32, 16 + y * 32, 32, 32, 0x7ed957);
    }
  }

  // 主人公
  player = this.physics.add.sprite(40, 40, null)
    .setDisplaySize(28, 28)
    .setTint(0xffd700);
  player.body.setCollideWorldBounds(true);

  // 宝箱
  chest = this.physics.add.staticSprite(
    Phaser.Math.Between(4, 13) * 32,
    Phaser.Math.Between(2, 9) * 32,
    null
  ).setDisplaySize(28, 28).setTint(0x884400);

  // メッセージ
  messageText = this.add.text(10, 290, "宝箱を探そう！", { fontSize: '20px', fill: '#222' });

  cursors = this.input.keyboard.createCursorKeys();

  // 衝突
  this.physics.add.overlap(player, chest, findChest, null, this);
}

function update() {
  if (found) return;

  player.setVelocity(0);
  if (cursors.left.isDown) player.setVelocityX(-120);
  else if (cursors.right.isDown) player.setVelocityX(120);
  if (cursors.up.isDown) player.setVelocityY(-120);
  else if (cursors.down.isDown) player.setVelocityY(120);
}

function findChest() {
  if (!found) {
    found = true;
    messageText.setText("宝箱を見つけた！クリア！");
    chest.setTint(0xffe066);
  }
}

new Phaser.Game(config);