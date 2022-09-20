// script pour les particules dans le canvas
const canvas = document.querySelector("#canvasetoile");

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth-17;
//canvas.height = window.innerHeight-17;
canvas.height = window.innerHeight/1.2;

let listParticules;

let souris = {
    x: undefined,
    y: undefined,
    radius: (canvas.height / 90) * (canvas.width / 90),
};

//récupère la position de la souris quand elle bouge
canvas.addEventListener("mousemove", function (event) {
    souris.x = event.offsetX;
    souris.y = event.offsetY;
});
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth-17;
    canvas.height = window.innerHeight-17;
    mouse.radius = ((canvas.height / 80) * canvas.height) / 80;
    init();
  });

// création de la classe particule
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
}

//Initialise les particules avec une trajectoire aléatoire
function init() {
    listParticules = [];
    let nombreParticules = 100;
    for (let i = 0; i < nombreParticules; i++) {
        let size = Math.random() * 4 + 1;
        let x = Math.random() * (window.innerWidth);//Spawn aléatoire
        let y = Math.random() * (window.innerHeight);
        let directionX = Math.random() - 0.5;
        let directionY = Math.random() - 0.5;
        let color = "#FFFFFF";
    
        listParticules.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }
//pour chaque point, parcours tout les autres point pour vérifier si ils sont proches
function lien(){
    let opacityValue = 1;
    for (let a = 0; a < listParticules.length; a++) {
        for (let b = a; b < listParticules.length; b++) {
            let distance =(listParticules[a].x - listParticules[b].x) *(listParticules[a].x - listParticules[b].x) +(listParticules[a].y - listParticules[b].y) *(listParticules[a].y - listParticules[b].y);
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - distance / 20000;
                ctx.strokeStyle = "rgba(255,255,255," + opacityValue + ")";
                ctx.beginPath();
                ctx.moveTo(listParticules[a].x, listParticules[a].y);
                ctx.lineTo(listParticules[b].x, listParticules[b].y);
                ctx.stroke();
            }
        }
    }
      
}

function animate() {
    requestAnimationFrame(animate);//permet de faire des animations sans reload
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < listParticules.length; i++) {//Pour toute les particules
        if (listParticules[i].x + listParticules[i].size > canvas.width || listParticules[i].x - listParticules[i].size < 0) {
            listParticules[i].directionX = -listParticules[i].directionX;
        }
        if (listParticules[i].y + listParticules[i].size > canvas.height || listParticules[i].y - listParticules[i].size < 0) {
            listParticules[i].directionY = -listParticules[i].directionY;
        }
        // check collision avec la souris ou entre les particules
        let dx = souris.x - listParticules[i].x;
        let dy = souris.y - listParticules[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < souris.radius + listParticules[i].size) {
            if (souris.x < listParticules[i].x && listParticules[i].x < canvas.width - listParticules[i].size * 10) {
                listParticules[i].x -= 5;
            }
            if (souris.y < listParticules[i].y && listParticules[i].y < canvas.height - listParticules[i].size * 10) {
                listParticules[i].y += 5;
            }
            if (souris.y > listParticules[i].y && listParticules[i].y > listParticules[i].size * 10) {
                listParticules[i].y -= 5;
            }
        }
        listParticules[i].x += listParticules[i].directionX;
        listParticules[i].y += listParticules[i].directionY;
        ctx.beginPath();
        ctx.arc(listParticules[i].x, listParticules[i].y, listParticules[i].size, 0, 0, false);
        ctx.fillStyle = listParticules[i].color;
        ctx.fill();
        
    }
    lien();
}

init();
animate();