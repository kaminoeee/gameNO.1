// Three.js でシンプルな3Dミニゲーム（キューブよけ）

let scene, camera, renderer;
let player, cubes = [];
let leftPressed = false, rightPressed = false;
let gameOver = false, score = 0, scoreDiv;
const playerSpeed = 0.15;
const cubeSpeed = 0.1;
const fieldWidth = 4; // プレイヤー移動の幅

init();
animate();

function init() {
  // シーン
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222244);

  // カメラ
  camera = new THREE.PerspectiveCamera(70, 480/480, 0.1, 100);
  camera.position.set(0, 3, 8);
  camera.lookAt(0, 0, 0);

  // ライト
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10).normalize();
  scene.add(light);

  // プレイヤー（白い直方体）
  const playerGeo = new THREE.BoxGeometry(1, 0.5, 1);
  const playerMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  player = new THREE.Mesh(playerGeo, playerMat);
  player.position.set(0, 0.25, 0);
  scene.add(player);

  // 地面
  const groundGeo = new THREE.BoxGeometry(fieldWidth, 0.1, 10);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x339966 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.set(0, -0.05, 0);
  scene.add(ground);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(480, 480);
  document.getElementById('game-container').appendChild(renderer.domElement);

  // スコア表示
  scoreDiv = document.createElement('div');
  scoreDiv.style.position = 'absolute';
  scoreDiv.style.top = '60px';
  scoreDiv.style.left = '0';
  scoreDiv.style.right = '0';
  scoreDiv.style.textAlign = 'center';
  scoreDiv.style.fontSize = '20px';
  scoreDiv.style.color = '#fff';
  scoreDiv.textContent = 'SCORE: 0';
  document.body.appendChild(scoreDiv);

  // イベント
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);

  // キューブ生成タイマー
  setInterval(() => {
    if (!gameOver) spawnCube();
  }, 900);
}

function spawnCube() {
  const geo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
  const mat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
  const cube = new THREE.Mesh(geo, mat);
  // -1.5 ~ +1.5 の範囲でX座標ランダム
  cube.position.set((Math.random() - 0.5) * (fieldWidth - 1), 0.35, -4.5);
  scene.add(cube);
  cubes.push(cube);
}

function animate() {
  requestAnimationFrame(animate);

  // プレイヤー移動
  if (leftPressed) player.position.x -= playerSpeed;
  if (rightPressed) player.position.x += playerSpeed;
  player.position.x = Math.max(-fieldWidth/2+0.5, Math.min(fieldWidth/2-0.5, player.position.x));

  // キューブ移動
  for (let i = cubes.length - 1; i >= 0; i--) {
    const c = cubes[i];
    c.position.z += cubeSpeed;
    // プレイヤーとキューブの当たり判定
    if (!gameOver && Math.abs(player.position.x - c.position.x) < 0.7 &&
        Math.abs(player.position.z - c.position.z) < 0.7 &&
        Math.abs(c.position.y - player.position.y) < 0.7) {
      gameOver = true;
      scoreDiv.textContent = 'GAME OVER! SCORE: ' + score;
    }
    // 画面から消えたら削除しスコア加算
    if (c.position.z > 5) {
      scene.remove(c);
      cubes.splice(i, 1);
      if (!gameOver) {
        score++;
        scoreDiv.textContent = 'SCORE: ' + score;
      }
    }
  }

  renderer.render(scene, camera);
}

function onKeyDown(e) {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') leftPressed = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') rightPressed = true;
}
function onKeyUp(e) {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') leftPressed = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') rightPressed = false;
}