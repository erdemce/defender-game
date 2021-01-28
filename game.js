class Game {

    constructor() {
        this.isFired = false;
        this.collisions = [];
        this.vehicles = [];
        this.fires = [];
        this.level = 1;
        this.intervalId = 0;
        this.restAmmo = 10
        this.score = 0;
        this.pHealth = 1.5;
        this.hHealth = 1;
        this.pSpeed = 1.3;
        this.hSpeed = 1;
        this.speedY = -4;
        this.airFire = "goon";
    }

    createPlane(x) {
        let planeLeft = document.createElement('img')
        planeLeft.src = 'images/planeLeft.png';
        let planeRight = document.createElement('img')
        planeRight.src = 'images/planeRight.png';
        this.vehicles.push(new Air_vehicle(this.pSpeed, this.pHealth, x, [planeLeft, planeRight]));
    }
    createHelicopter(x) {
        let helLeft = document.createElement('img')
        helLeft.src = 'images/helicopterLeft.png';
        let helRight = document.createElement('img')
        helRight.src = 'images/helicopterRight.png';
        this.vehicles.push(new Air_vehicle(this.hSpeed, this.hHealth, x, [helLeft, helRight]));
    }

    createAllVehicles(phphphph) {
        for (let i = 0; i < phphphph.length; i++) {
            if (phphphph[i] == "p") {
                this.createPlane(750 + 190 * i)
            } else if (phphphph[i] == "h") {
                this.createHelicopter(750 + 190 * i)
            }
        }
    }

    startLevel() {
        let vehicleString = "hhhppp";
        for (let i = 1; i < level; i++) {
            vehicleString = vehicleString + "ph"
        }
        this.restAmmo = this.restAmmo + Math.floor(vehicleString.length * this.level * 1.3);
        this.createAllVehicles(vehicleString)
        this.pHealth = this.pHealth * 1.3;
        this.hHealth = this.hHealth * 1.3;
        this.pSpeed = this.pSpeed * 1.1;
        this.hSpeed = this.hSpeed * 1.1;
        this.speedY = this.speedY * 1.1;
    }

    playShootSound() {
        let fireAudio = new Audio('sounds/fire.flac');
        fireAudio.volume = 0.2;
        fireAudio.play()
    }

    playExplossionSound() {
        let explossionAudio = new Audio('sounds/explossion.mp3');
        explossionAudio.volume = 0.15;
        explossionAudio.play()
    }

    createShoot(x, y) {
        this.restAmmo--;
        let centerX = 298;
        let centerY = 731
        let relX = centerX - x + 100;
        let relY = centerY - y + 100;
        let speedX = this.speedY * relX / relY;
        let fire = new Fire(centerX, centerY, speedX, this.speedY, 1, 4)
        this.fires.push(fire);
        this.playShootSound()
    }
}