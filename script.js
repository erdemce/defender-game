//html elements and images etc...
let playBtn = document.querySelector('#play');
let replayBtn = document.querySelector('#replay');
let endScreen = document.querySelector("#end-screen");
let startScreen = document.querySelector("#start-screen")
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let bgImg = document.createElement('img')
bgImg.src = 'images/bg.jpg';
let highImg = document.createElement("img");
highImg.src = "images/high-score.png"
let defenderImg = document.createElement('img')
defenderImg.src = 'images/defender.png';
let levelText = document.querySelector("#level");
let alertText = document.querySelector("#alert");
//some first values
localStorage.setItem('name', "Unknown");
localStorage.setItem('record', 0);
let game, draw;

function mouseClick(event) {

    if (game.restAmmo > 0) {
        game.createShoot(event.pageX, event.pageY)
    } else {
        draw.drawAlertText(alertText)
    }
}

function drawAll() {
    ctx.drawImage(bgImg, 0, 0)
    ctx.drawImage(defenderImg, 200, 700)
    draw.drawCollBig(game.isFired)
    game.collisions.forEach((coll, collInd) => {
        if (coll[2] < 20) {
            draw.drawColl(coll)
            coll[2]++;
        } else {
            game.collisions.splice(collInd, 1);
        }
    })

    draw.drawTexts(game.score, game.restAmmo)
    game.vehicles.forEach(vehicle => {
        if (vehicle.x < -200 && vehicle.isLeft) {
            vehicle.y += 180;
            vehicle.isLeft = false;
        } else if (vehicle.x > 800 && !vehicle.isLeft) {
            vehicle.y += 180;
            vehicle.isLeft = true;
        }
        draw.drawVehicle(vehicle)
    })
    //todo function in game
    game.fires = game.fires.filter(fire => fire.y > 0 && fire.y < canvas.height &&
        fire.x > 0 && fire.x < canvas.height).map(fire => fire)


    game.fires.forEach((fire, fireInd) => {
        game.vehicles.forEach((vehicle, vehInd) => {

            if (fire.y < vehicle.y + vehicle.images[0].height &&
                fire.y > vehicle.y &&
                fire.x > vehicle.x &&
                fire.x < vehicle.x + vehicle.images[0].width) {
                vehicle.health -= fire.damage;
                game.score += Math.floor(fire.damage * 10)
                game.fires.splice(fireInd, 1);
                game.collisions.push([fire.x, fire.y - 20, 0])
            }
            if (vehicle.health <= 0) {
                game.vehicles.splice(vehInd, 1)
                if (game.vehicles.length == 0) {
                    game.level++;
                    game.startLevel();
                    draw.drawLevelText(levelText, game.level)
                }
            }

        })
        draw.drawShoot(fire);
        fire.x += fire.speedX;
        fire.y += fire.speedY;
    })

    draw.drawShoot(game.airFire);
    game.airFire.x += game.airFire.speedX;
    game.airFire.y += game.airFire.speedY;


    game.vehicles.forEach(vehicle => {
        if (vehicle.y > 600 && vehicle.x > 200 && game.airFire == "goon") {
            game.airFire = new Fire(250, 700, 2, 3, 2, 10)
            game.isFired = true;
            document.removeEventListener("mousedown", mouseClick, true);
            game.playExplossionSound()
            setTimeout(() => {
                gameOver();
            }, 3000)
        }
    })
}

function startGame() {
    game = new Game();
    draw = new Draw(ctx);
    alertText.style.display = "none";
    document.addEventListener("mousedown", mouseClick, true)

    canvas.style.display = 'block'
    if (highImg.parentNode) {
        highImg.parentNode.removeChild(highImg);
    }

    endScreen.style.display = "none";
    startScreen.style.display = "none"

    intervalId = setInterval(() => {
        requestAnimationFrame(drawAll)
    }, 4)

    game.startLevel()
    draw.drawLevelText(levelText, game.level)
}

function gameOver() {

    clearInterval(intervalId);
    if (game.score > localStorage.getItem('record')) {
        endScreen.insertBefore(highImg, endScreen.children[2]);
        localStorage.setItem('record', game.score);
        localStorage.setItem("name", startScreen.querySelector("#player").value)
    }
    canvas.style.display = 'none';
    endScreen.style.display = "flex";
    endScreen.querySelector("#score").innerText = "Your Score: " + game.score;
    endScreen.querySelector("#record").innerText =
        "Highest Score:\n" + localStorage.getItem("name") + ": " + localStorage.getItem("record");
}

window.addEventListener('load', () => {

    canvas.style.display = 'none';
    levelText.style.display = "none";
    endScreen.style.display = "none";
    alertText.style.display = "none";

    playBtn.addEventListener('click', () => {
        startGame()
    })

    replayBtn.addEventListener('click', () => {
        startGame()
    })
})