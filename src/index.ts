///<reference types="pixi.js"/>
import * as PIXI from 'pixi.js'
import { keyboard, Key } from './controls'
import { loadAssets } from './sprites'
import { TankColor, Tank } from './models/tank'
import { Terrain } from './models/terrain'

const app = new PIXI.Application({
    width: 800, 
    height: 800,
    antialias: true,
});

loadAssets(setup);

let tank:Tank;
let terrain:Terrain;
let graphics:PIXI.Graphics;

function setup():void{
    
    tank = new Tank(TankColor.Red);
    terrain = new Terrain(app.renderer.width, app.renderer.height);
    terrain.mountTank(tank, 100);
    app.stage.addChild(tank.tank);
    app.stage.addChild(terrain.tsprites);
    graphics = new PIXI.Graphics();
    graphics.beginFill(0xFF0000);
    app.stage.addChild(graphics);
    app.ticker.add(delta => gameLoop(delta));

    let left:Key = keyboard("a"),
        right:Key = keyboard("d"),
        brotLeft:Key = keyboard("ArrowLeft"),
        brotRight:Key = keyboard("ArrowRight"),
        powerUp:Key = keyboard("ArrowUp"),
        powerDown:Key = keyboard("ArrowDown"),
        fire:Key = keyboard(" "),
        up:Key = keyboard("w"),
        down:Key = keyboard("s");

    brotLeft.press = () => {
        tank.vrot = -0.1;
    };

    brotLeft.release = () => {
       if (!right.isDown && tank.vfwd === 0) {
            tank.vrot = 0;
       }
    };

    brotRight.press = () => {
        tank.vrot = 0.1;
    };

    brotRight.release = () => {
        if (!left.isDown && tank.vfwd === 0) {
            tank.vrot = 0;
        }
    };

    // Left
    left.press = () => {
        tank.vx = -1;
    };

    left.release = () => {
       if (!right.isDown && tank.vfwd === 0) {
            tank.vx = 0;
       }
    };
        
    //Up
    up.press = () => {
        tank.vy = -5;
    };
    
    up.release = () => {
        if (!down.isDown && tank.vrot === 0) {
            tank.vy = 0;
        }
    };
        
    //Right
    right.press = () => {
        tank.vx = 1;
    };

    right.release = () => {
        if (!left.isDown) {
            tank.vx = 0;
        }
    };

    //Down
    down.press = () => {
        tank.vy = 5;
    };
    
    down.release = () => {
        if (!up.isDown && tank.vrot === 0) {
            tank.vy = 0;
        }
    };

    fire.press = () => {
        tank.fireProjectile();
    }

    console.log(tank);
}

let state = play;

function gameLoop(delta:any):void{
    state(delta);
}

function play(delta:any):void{
    tank.handleMovement(terrain);
    // graphics.clear();
    // graphics.beginFill(0xff0000);
    // graphics.drawRect(tank.tank.x-8, tank.tank.y, tank.width(), tank.height());
    let spts = terrain.intersectTank(tank);
    spts.forEach(spt => spt.alpha = 0.5);
}

app.renderer.backgroundColor = 0x66ccff;

document.body.appendChild(app.view);