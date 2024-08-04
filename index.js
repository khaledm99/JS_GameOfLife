
const canvas = document.getElementById("canvas");
const width = 500;
const height = 500;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");

const worldWidth = 200;
const worldHeight = 200;
const imageData = ctx.createImageData(worldWidth,worldHeight);

const d = imageData.data;

let world = [];
for(let y=0; y<worldHeight;y++) {
        let r=[];
        for(let x=0; x<worldWidth; x++) {
            r.push(Math.round(Math.random()));
        }
        world.push(r);
}
function randomize() {
    for(let y=0; y<worldHeight;y++) {
        for(let x=0; x<worldWidth; x++) {
            world[y][x] = (Math.round(Math.random()));
        }
    }
}

function putPixel(r,g,b,a,h,w,x,y, data) {
    data[(y*w+x)*4] = r;
    data[1+(y*w+x)*4] = g;
    data[2+(y*w+x)*4] = b;
    data[3+(y*w+x)*4] = a;
}
function drawWorld() {
    for(let y=0; y<worldHeight;y++) {
        for(let x=0; x<worldWidth; x++) {
            putPixel(255,255,255,255,worldHeight,worldWidth,x,y,d);
            if (world[y][x]) putPixel(0,0,0,255,worldHeight,worldWidth,x,y,d);
        }
    }
    ctx.putImageData(imageData,0,0);
    ctx.drawImage(canvas,0,0,width*(width/worldWidth),height*(height/worldHeight));
}

function mod(n,m) {
    if(n<0) return m + n;
    else return n%m;
}
function step() {
    
    let newWorld = [];
    for(let y=0; y<worldHeight;y++) {
        let r=[];
        for(let x=0; x<worldWidth; x++) {
            r.push(0);
        }
        newWorld.push(r);
    }
    for(let y=0; y<worldHeight;y++) {
        for(let x=0; x<worldWidth; x++) {
            let count = 0;
            count += world[mod((y-1),worldHeight)][mod((x-1),worldWidth)];
            count += world[mod((y-1),worldHeight)][(x)%worldWidth];
            count += world[mod((y-1),worldHeight)][(x+1)%worldWidth];
            count += world[(y)%worldHeight][mod((x-1),worldWidth)];
            count += world[(y)%worldHeight][(x+1)%worldWidth];
            count += world[(y+1)%worldHeight][mod((x-1),worldWidth)];
            count += world[(y+1)%worldHeight][(x)%worldWidth];
            count += world[(y+1)%worldHeight][(x+1)%worldWidth];
            if(world[y][x] === 1) {
                if(count<2 || count >3) { 
                    newWorld[y][x] = 0;
                }
                else {
                    newWorld[y][x] = 1;
                }
            }
            else {
                if(count===3) {
                    newWorld[y][x] =1;
                }
                else {
                    newWorld[y][x] = 0;
                }
                
            }
        }
    }
    for(let y=0; y<worldHeight;y++) {
        for(let x=0; x<worldWidth; x++) {
            world[y][x] = newWorld[y][x];
        }
    }
}
ctx.imageSmoothingEnabled=false;
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");

let id= null;
function animate() {
    clearInterval(id);
    id=setInterval(frame,35);
    function frame() {
        step();
        drawWorld();
    }
}
randomize();
drawWorld();
start.addEventListener("click", animate);
stop.addEventListener("click", () => clearInterval(id));
reset.addEventListener("click", () => {
    randomize();
    drawWorld();}
);
