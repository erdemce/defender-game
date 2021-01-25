//html elements and images etc...
let levelText=document.querySelector("#level");
let endScreen=document.querySelector("#endScreen");
let startScreen=document.querySelector("#start-screen")
let canvas=document.querySelector("canvas");
let ctx=canvas.getContext("2d");
let playBtn = document.querySelector('#play');
let bgImg = document.createElement('img')
bgImg.src ='images/bg.jpg';
let defenderImg = document.createElement('img')
defenderImg.src ='images/defender.png';
let shooterImg = document.createElement('img')
shooterImg.src ='images/shoot.png';
let vehicles=[];
let fires=[];
let level=1;
let intervalId=0;
let restFire=10
let score=0;
let pHealth=1.5;
let hHealth=1;
let pSpeed=1.3;
let hSpeed=1;
let airFire="goon";

function createPlane(x){
    let planeLeft= document.createElement('img')
    planeLeft.src ='images/planeLeft.png';
    let planeRight= document.createElement('img')
    planeRight.src ='images/planeRight.png';
    vehicles.push(new Air_vehicle(pSpeed,pHealth,x,[planeLeft,planeRight]));
}

function createHelicopter(x){
    let helLeft= document.createElement('img')
    helLeft.src ='images/helicopterLeft.png';
    let helRight= document.createElement('img')
    helRight.src ='images/helicopterRight.png';
    vehicles.push(new Air_vehicle(hSpeed,hHealth,x,[helLeft,helRight]));
}

function createAllVehicles(phphphph){
    for(let i=0;i<phphphph.length;i++){
        if(phphphph[i]=="p"){
            createPlane(700+200*i)
        } else if(phphphph[i]=="h"){
            createHelicopter(700+200*i)
        }
    }
}

function startLevel(){

    levelText.innerHTML="Level "+level;
    levelText.style.display="block"
    setTimeout(()=>levelText.style.display="none",1500)
    let vehicleString="hhhppp";
    for(let i=1;i<level;i++){
        vehicleString=vehicleString+"ph"
    }
    restFire=restFire+Math.floor(vehicleString.length*level*1.5);
    createAllVehicles(vehicleString)
    pHealth=pHealth*1.5;
    hHealth=hHealth*1.5;
    pSpeed=pSpeed*1.3;
    hSpeed=hSpeed*1.3
}

function createShoot(targetX,targetY){
    if(restFire>0){
        restFire--;
        let centerX=298;
        let centerY=731
        let x = centerX-targetX;
        let y= centerY-targetY;
        let speedY=-4;
        let speedX=speedY*x/y;
        let fire=new Fire(centerX,centerY,speedX,speedY,1,4)
        fires.push(fire);
    }else {
        end("You haven't any fire more")
    }
}

function end(result){
    clearInterval(intervalId);
    canvas.style.display = 'none';
    endScreen.style.display="block";
    endScreen.querySelector("#score").innerText="Your Score: "+ score;
    endScreen.querySelector("#reason").innerText=result;
}
function drawShoot(fire){
    ctx.beginPath()
    ctx.arc(fire.x, fire.y, fire.radius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fillStyle = "#ff3333"
    ctx.fill()
    ctx.closePath()
}
   
document.addEventListener("mousedown",(event)=>{

    createShoot(event.pageX,event.pageY)
    

})

function drawVehicle(vehicle){
    if(vehicle.isLeft){
        ctx.drawImage(vehicle.images[0],vehicle.x,vehicle.y)
        vehicle.x-=vehicle.speed;
        
    }else{
        ctx.drawImage(vehicle.images[1],vehicle.x,vehicle.y)
        vehicle.x+=vehicle.speed;
        
    }
    drawHealth(vehicle)
    
}

function drawHealth(vehicle){
    ctx.fillStyle="#90EE90"
    ctx.fillRect(vehicle.x+30,vehicle.y-10,vehicle.health*10,5);
}

function drawTexts(){
    ctx.beginPath();
    ctx.fillStyle="red"
    ctx.font = "30px Verdana"
    ctx.fillText('Score:' + score, 20, 40);
    ctx.font = "24px Verdana"
    ctx.fillText('Fire:' + restFire, 400, 40)
    ctx.closePath();

}

function draw (){
    ctx.drawImage(bgImg, 0, 0)
    ctx.drawImage(defenderImg,200,700)
    drawTexts()
    vehicles.forEach(vehicle=>{
        if(vehicle.x<-200&&vehicle.isLeft){
            vehicle.y+=180;
            vehicle.isLeft=false;
        } else if( vehicle.x>800&&!vehicle.isLeft){
            vehicle.y+=180;
            vehicle.isLeft=true;
        }
        drawVehicle(vehicle)
    })

    fires=fires.filter(fire=>fire.y>0&&fire.y<canvas.height
        &&fire.x>0&&fire.x<canvas.height).map(fire=>fire)

    fires.forEach((fire,fireInd)=>{
        vehicles.forEach((vehicle,vehInd)=>{
            
            if(fire.y<vehicle.y+vehicle.images[0].height
                &&fire.y>vehicle.y
                &&fire.x>vehicle.x
                &&fire.x<vehicle.x+vehicle.images[0].width){
                vehicle.health-=fire.damage;
                fires.splice(fireInd,1);
            }
            if(vehicle.health<=0){
                vehicles.splice(vehInd,1)
                if(vehicles.length==0){
                    level++;
                    startLevel();
                }
            }    

        })
        drawShoot(fire);
        fire.x+=fire.speedX;
        fire.y+=fire.speedY;
    })

    drawShoot(airFire);
    airFire.x+=airFire.speedX;
    airFire.y+=airFire.speedY;
    

    vehicles.forEach(vehicle=>{
        if(vehicle.y>600&&vehicle.x>200&&airFire=="goon"){
            airFire=new Fire(250,700,2,3,2,10)
            setTimeout(()=>end("You are fired"),500)
            
        }
        
    }  )
}


intervalId = setInterval(() => {
   requestAnimationFrame(draw)
}, 1)

window.addEventListener('load', () => {
    canvas.style.display = 'none';
    levelText.style.display="none";
    endScreen.style.display="none";

    playBtn.addEventListener('click', () => {
        canvas.style.display = 'block'
        startScreen.style.display="none"
        startLevel()
    })
})
