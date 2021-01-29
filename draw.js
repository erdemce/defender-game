class Draw {
    constructor() {
        this.collImg = document.createElement('img')
        this.collImg.src = 'images/colision.png';
        this.collBigImg = document.createElement('img')
        this.collBigImg.src = 'images/collBig.png';
        this.ctx = ctx;
    }

    drawShoot(fire) {
        this.ctx.beginPath()
        this.ctx.arc(fire.x, fire.y, fire.radius, 0, 2 * Math.PI)
        this.ctx.stroke()
        this.ctx.fillStyle = "#ff3333"
        this.ctx.fill()
        this.ctx.closePath()
    }

    drawVehicle(vehicle) {
        if (vehicle.isLeft) {
            this.ctx.drawImage(vehicle.images[0], vehicle.x, vehicle.y)
            vehicle.x -= vehicle.speed;

        } else {
            this.ctx.drawImage(vehicle.images[1], vehicle.x, vehicle.y)
            vehicle.x += vehicle.speed;

        }
        this.drawHealth(vehicle)
    }
    drawHealth(vehicle) {
        this.ctx.fillStyle = "#90EE90"
        this.ctx.fillRect(vehicle.x + 30, vehicle.y - 10, vehicle.health * 10, 5);
    }

    drawTexts(score, restAmmo) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "red"
        this.ctx.font = "30px Verdana"
        this.ctx.fillText('Score:' + score, 20, 40);
        this.ctx.font = "24px Verdana"
        this.ctx.fillText('Ammo:' + restAmmo, 450, 40)
        this.ctx.closePath();
    }

    drawCollBig(isFired) {
        if (isFired) {
            ctx.drawImage(this.collBigImg, 250, 700)
        }
    }

    drawColl(coll) {
        ctx.drawImage(this.collImg, coll[0], coll[1]);
    }
    drawLevelText(levelText, level) {
        levelText.innerHTML = "Level " + level;
        levelText.style.display = "block"
        setTimeout(() => levelText.style.display = "none", 1500)
    }

    drawAlertText(alertText) {
        if(alertText.style.display == "none"){
            alertText.innerHTML = "You are out of ammo!<br>You will be destroyed!!!";
        alertText.style.display = "block"
        setTimeout(() => alertText.style.display = "none", 4000)
        }
        
    }
}