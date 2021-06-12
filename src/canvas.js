const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let start = false;

canvas.width = window.innerWidth - 6;
canvas.height = window.innerHeight - 6;

class Hero {
  constructor() {
    //menset nilai hero
    this.x = 145;
    this.y = 280;
    this.dx = 0;
    this.dy = 0;
    this.width = 80;
    this.height = 60;
  }

  draw() {
    //membentuk hero
    context.beginPath();
    context.drawImage(heroSprite, this.x, this.y, this.width, this.height);
  }

  update() {
    enemies.map((enemy, i) => {
      if (
        this.x < enemy.x + enemy.width &&
        this.x + this.width > enemy.x &&
        this.y < enemy.y + enemy.height &&
        this.y + this.height > enemy.y
      ) {
        if (enemy.status) {
          console.log("collison");

          enemies[i].status = false;
          changeFuel(-15);
        }
      }
    });

    fuelData.map((fuelSprite, i) => {
      if (
        this.x < fuelSprite.x + fuelSprite.size &&
        this.x + this.width > fuelSprite.x &&
        this.y < fuelSprite.y + fuelSprite.size &&
        this.y + this.height > fuelSprite.y
      ) {
        if (fuelSprite.status) {
          fuelData[i].status = false;
          changeFuel(15);
        }
      }
    });

    asteroids.map((ast, i) => {
      if (
        this.x < ast.x + ast.width &&
        this.x + this.width > ast.x &&
        this.y < ast.y + ast.height &&
        this.y + this.height > ast.y
      ) {
        if (ast.status) {
          console.log("collison with asteroid");

          asteroids[i].status = false;
          changeFuel(-15);
        }
      }
    });

    if (
      (this.x < 0 && this.dx < 0) ||
      (this.x + this.width > innerWidth && this.dx > 0)
    ) {
      this.dx = 0;
    }

    if (
      (this.y < 0 && this.dy < 0) ||
      (this.y + this.height > innerHeight && this.dy > 0)
    ) {
      this.dy = 0;
    }

    //memberikan percepatan pada hero
    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

class Enemy {
  constructor(x, y) {
    //menset nilai musuh
    this.x = x;
    this.y = y;
    this.dx = -4;
    this.width = 80;
    this.height = 60;
    this.status = true;
  }

  draw() {
    //membentuk musuh
    context.beginPath();
    context.drawImage(enemySprite, this.x, this.y, this.width, this.height);
  }

  update(index) {
    // console.log(enemies);
    let startX = 1800;
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];

      if (index === i) {
        continue;
      }

      if (
        this.x < enemy.x + enemy.width &&
        this.x + this.width > enemy.x &&
        this.y < enemy.y + enemy.height &&
        this.y + this.height > enemy.y
      ) {
        startX += 200;

        this.x = Math.random() * innerWidth + startX;
        this.y = Math.random() * (innerHeight - this.height * 2) + this.height;

        i -= 1;
      }
    }

    if (this.x < 0 - this.width) {
      this.status = false;
    }

    //memeberikan percepatan kepada musuh
    this.x += this.dx;

    if (this.status) {
      this.draw();
    }
  }
}

class Asteroid {
  constructor(x, y) {
    //menset nilai musuh
    this.x = x;
    this.y = y;
    this.dx = -3;
    this.width = 80;
    this.height = 80;
    this.status = true;
    this.life = 2;
  }

  draw() {
    //membentuk musuh
    context.beginPath();
    context.drawImage(asteroidSprite, this.x, this.y, this.width, this.height);
  }

  update(index) {
    // console.log(enemies);
    let startX = 2000;
    for (let i = 0; i < asteroids.length; i++) {
      let asteroid = asteroids[i];

      if (index === i) {
        continue;
      }

      if (
        this.x < asteroid.x + asteroid.width &&
        this.x + this.width > asteroid.x &&
        this.y < asteroid.y + asteroid.height &&
        this.y + this.height > asteroid.y
      ) {
        startX += 600;

        this.x = Math.random() * innerWidth + startX;
        this.y = Math.random() * (innerHeight - this.height * 2) + this.height;

        i -= 1;
      }
    }

    if (this.x < 0 - this.width) {
      this.status = false;
    }

    //memeberikan percepatan kepada musuh
    this.x += this.dx;

    if (this.status) {
      this.draw();
    }
  }
}

class Missile {
  constructor(x, y, dx, origin) {
    //menset nilai misil
    this.x = x;
    this.y = y;
    this.origin = origin;
    this.dx = dx;
    this.width = 20;
    this.height = 10;
    this.status = true;
  }

  draw() {
    //membentuk misil
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = "yellow";
    context.fill();
  }

  update(index) {
    // mengecek apakah misil berhasil mengenai musuh
    enemies.some((enemy, i) => {
      if (
        this.x < enemy.x + enemy.width &&
        this.x + this.width > enemy.x &&
        this.y < enemy.y + enemy.height &&
        this.y + this.height > enemy.y
      ) {
        //check jika misil berasal dari hero
        if (this.origin === "hero" && this.status && enemy.status) {
          //delete data enemy yang tertabrak oleh missile
          enemies[i].status = false;

          //delete data missile yang menabrak enemy
          missiles[index].status = false;

          //menambahkan nilai 1 pada score ketika missil sukses
          changeScore(5);

          //melakukan break keluar dari perulangan
          return true;
        }
      }
    });

    // mengecek apakah misil berhasil mengenai asteroid
    asteroids.some((ast, i) => {
      if (
        this.x < ast.x + ast.width &&
        this.x + this.width > ast.x &&
        this.y < ast.y + ast.height &&
        this.y + this.height > ast.y
      ) {
        //check jika misil berasal dari hero
        if (this.origin === "hero" && this.status && ast.status) {
          asteroids[i].life -= 1;
          if (!ast.life || ast.life < 0) {
            //delete data ast yang tertabrak oleh missile
            asteroids[i].status = false;
          }
          //delete data missile yang menabrak asteroid
          missiles[index].status = false;

          //melakukan break keluar dari perulangan
          return true;
        }
      }
    });

    if (
      this.x < hero.x + hero.width &&
      this.x + this.width > hero.x &&
      this.y < hero.y + hero.height &&
      this.y + this.height > hero.y
    ) {
      //check jika misil berasal dari musuh
      if (this.origin === "enemy" && this.status) {
        //delete data missile yang menabrak hero
        missiles[index].status = false;
        //menambahkan nilai 15 pada fuel ketika missil sukses
        changeFuel(-15);
        changeScore(-5);
      }
    }

    //memeberikan percepatan pada misil sehingga bergerak
    this.x += this.dx;

    //draw missil
    if (this.status) {
      this.draw();
    }
  }
}

class Fuel {
  constructor(x, y) {
    //setup fuel atribut
    this.x = x;
    this.y = y;
    this.dx = -2;
    this.size = 40;
    this.status = true;
  }

  draw() {
    // draw fuelSprite
    context.beginPath();
    context.drawImage(fuelSprite, this.x, this.y, this.size, this.size);
  }

  update() {
    this.x += this.dx;

    if (this.status) {
      this.draw();
    }
  }
}

class Planet {
  constructor(id, image, x, y, dx, width, height) {
    this.id = id;
    this.image = image;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.width = width;
    this.height = height;
    this.status = true;
  }

  draw() {
    context.beginPath();
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.x < 0 - this.width) {
      this.status = false;
      if (planets.filter(p => p.status === true).length === 0) {
        let dataSet = planetSetup.find(p => p.id === this.id);
        console.log(dataSet);

        this.x = dataSet.x;
        this.y = dataSet.y;
      }
    }

    this.x += this.dx;

    this.draw();
  }
}

// control permainan--------------------------------------------------------

//instance object hero
let hero = new Hero();

//inisialisi misil dan musuh dalam array
let missiles = [];
let enemies = [];
let fuelData = [];
let asteroids = [];
let planet = [];

//inisialisasi objeck score and fuel
let fuel = document.querySelector("#fuel");
let score = document.querySelector("#score");
let gameLayout = document.querySelector(".game");
let startBtn = document.querySelectorAll(".play");
let startLayout = document.querySelector(".start");
let gameOverLayout = document.querySelector(".game-over");

// image
let mars = new Image();
let uranus = new Image();
let background = new Image();
let heroSprite = new Image();
let fuelSprite = new Image();
let enemySprite = new Image();
let otherPlanet = new Image();
let asteroidSprite = new Image();
fuelSprite.src = "assets/fuel.png";
background.src = "assets/space.png";
enemySprite.src = "assets/enemy.png";
mars.src = "assets/planets/mars.png";
heroSprite.src = "assets/heroFix.png";
uranus.src = "assets/planets/uranus.png";
asteroidSprite.src = "assets/asteroid.png";
otherPlanet.src = "assets/planets/otherPlanet.png";

let planetSetup = [
  {
    id: 1,
    image: uranus,
    x: 1300,
    y: 180,
    width: 300,
    height: 150,
    dx: -1
  },
  {
    id: 2,
    image: mars,
    x: 2500,
    y: 415,
    width: 150,
    height: 150,
    dx: -1
  },
  {
    id: 3,
    image: otherPlanet,
    x: 1800,
    y: 110,
    width: 200,
    height: 200,
    dx: -0.5
  }
];
// arrow up: 38
// arrow down: 40
// arrow left: 37
// arrow right: 39

window.addEventListener("keydown", e => {
  if (start) {
    let velocity = 6;

    //menggerakan hero ke atas dengan menset ulang nilai dy
    if (e.keyCode === 38) {
      hero.dy = -velocity;
    }

    //menggerakan hero ke bawah dengan menset ulang nilai dy
    if (e.keyCode === 40) {
      hero.dy = velocity;
    }

    //menggerakan hero ke kiri dengan menset ulang nilai dx
    if (e.keyCode === 37) {
      hero.dx = -velocity;
    }

    //menggerakan hero ke kanan dengan menset ulang nilai dx
    if (e.keyCode === 39) {
      hero.dx = velocity;
    }
  }
});

window.addEventListener("keyup", e => {
  if (start) {
    //mengecek apakah key sudah dilepas apabila key sudah dilepas maka dx dan dy akan diset ke 0
    //shingga hero hanya bergerak ketika key ditekan

    //set dy ke 0 ketika kunci atas atau bawah dilepas
    if (e.keyCode === 38 || e.keyCode === 40) {
      hero.dy = 0;
    }
    //set dx ke 0 ketika kunci kiri atau kanan dilepas
    if (e.keyCode === 37 || e.keyCode === 39) {
      hero.dx = 0;
    }

    //menembakan misil ketika tombol space ditekan
    if (e.keyCode === 32) {
      //memberikan nilai kordinat pada misil sesuai dengan letak hero menembak
      let x = hero.x;
      let y = hero.y + 27.5;

      missiles.push(new Missile(x, y, 6, "hero"));
    }
  }
});

for (let i = 0; i < startBtn.length; i++) {
  startBtn[i].addEventListener("click", () => {
    score.textContent = 0;
    fuel.value = 30;
    startLayout.style.display = "none";
    gameLayout.style.display = "block";
    gameOverLayout.style.display = "none";
    start = true;
    context.clearRect(0, 0, innerWidth, innerHeight);

    init();
  });
}

//fungsi init untuk memulai
init = () => {
  hero = new Hero();
  missiles = [];
  enemies = [];
  fuelData = [];
  asteroids = [];
  planets = [];

  let enemyX = 1400;
  //menginstance dan memberikan nilai kepada object enemy dan memasukan ke dalam array enemies
  for (let i = 0; i < 50; i++) {
    enemyX += 200;
    let x = Math.random() * innerWidth + enemyX;
    let y = Math.random() * (innerHeight - 60 * 2) + 60;

    enemies.push(new Enemy(x, y));
  }

  let fuelX = 1200;
  for (let i = 0; i < 10; i++) {
    fuelX += 400;
    let x = Math.random() * innerWidth + fuelX;
    let y = Math.random() * (innerHeight - 40 * 2) + 40;

    fuelData.push(new Fuel(x, y));
  }

  let astX = 1500;
  for (let i = 0; i < 10; i++) {
    astX += 800;
    let x = Math.random() * innerWidth + astX;
    let y = Math.random() * (innerHeight - 40 * 2) + 40;

    asteroids.push(new Asteroid(x, y));
  }

  planetSetup.map(p =>
    planets.push(new Planet(p.id, p.image, p.x, p.y, p.dx, p.width, p.height))
  );

  // console.log(fuelData);

  // mengurangi nilai fuel setiap 1 detik
  changeFuel(false, true);
  enemyFire(false);
  console.log(fuel.value);
  // console.log(enemies);

  //panggil fungsi animate untuk menjalan kan animasi
  animate();
};

animate = () => {
  // console.log(enemies.filter(e => e.status === true).length);
  if (!enemies.filter(e => e.status === true).length) {
    start = false;
  }

  if (start) {
    //memberikan izin penggunakan animasi
    requestAnimationFrame(animate);
  } else {
    gameOver();
  }

  //clear canvas setiap frame animasi
  context.clearRect(0, 0, innerWidth, innerHeight);

  //redraw background
  context.drawImage(background, 0, 0);

  //menjalankan fungsi untuk mengupdate letak dan draw object
  planets.map(p => p.update());
  fuelData.map(f => f.update());
  asteroids.map((a, index) => a.update(index));
  missiles.map((m, index) => m.update(index));
  enemies.map((e, index) => e.update(index));
  hero.update();
};

changeFuel = (newFuel, time) => {
  let decrementFuel;

  //mengecek apakah nilai fuel tidak false,undefined atau null
  if (newFuel && !time) {
    fuel.value = Number(fuel.value) + newFuel;
  }

  if (!newFuel && time) {
    // mengurangi nilai fuel setiap 1 detik
    decrementFuel = setTimeout(() => {
      fuel.value = Number(fuel.value) - 1;

      //siklus yang selalu berulang sampai di cleartimeout
      changeFuel(false, true);
    }, 1000);
  }

  //menghentikan pengurangan ketika fuel sudah 0
  if (Number(fuel.value) <= 0) {
    start = false;

    clearTimeout(decrementFuel);
  }
}

gameOver = () => {
  fuel.value = 0;
  // gameLayout.style.display = "none";
  gameOverLayout.style.display = "block";
  document.querySelector("#game-over-score").textContent = score.textContent;
};

let enemyIndex = 0;
enemyFire = stop => {
  if (enemyIndex >= enemies.length) {
    enemyIndex = 0;
  }

  // membuat musuh menembak setiap 6 detik
  let fire = setTimeout(() => {
    let e = enemies[enemyIndex];
    if (e.status) {
      missiles.push(new Missile(e.x, e.y + 15, -6, "enemy"));
    }

    enemyIndex++;

    //siklus yang selalu berulang sampai di cleartimeout
    enemyFire(false);
  }, 3000);

  //menghentikan pengurangan ketika fuel sudah 0
  if (stop) {
    clearTimeout(fire);
  }
};

//fungsi untuk memenipulasi nilai score
changeScore = newScore => {
  // menambahkan nilai score lama dengan nilai score baru
  if (newScore) {
    score.textContent = Number(score.textContent) + newScore;
  }
};
