///<reference types="pixi.js"/>
import * as PIXI from 'pixi.js'
import { keyboard, Key } from './controls'
import { loadAssets } from './sprites'
import { GameStatus } from './widgets'
import { TankColor, Tank } from './models/tank'
import { Terrain } from './models/terrain'
import { Projectile } from './models/projectile'

const app = new PIXI.Application({
    width: 800, 
    height: 800,
    antialias: true,
});

loadAssets(setup);

let tank:Tank;
let terrain:Terrain;
let graphics:PIXI.Graphics;
let gameStatus:GameStatus;
let projectiles:Array<Projectile> = [];

function setup():void{
    
    tank = new Tank(TankColor.Red);
    terrain = new Terrain(app.renderer.width, app.renderer.height);
    terrain.mountTank(tank, 100);
    app.stage.addChild(tank.tank);
    app.stage.addChild(terrain.tsprites);
    graphics = new PIXI.Graphics();
    graphics.beginFill(0xFF0000);
    app.stage.addChild(graphics);
    gameStatus = new GameStatus(tank, app.renderer.width);
    gameStatus.mount(app);
    app.ticker.add(delta => gameLoop(delta));

    let left:Key = keyboard("a"),
        right:Key = keyboard("d"),
        brotLeft:Key = keyboard("ArrowLeft"),
        brotRight:Key = keyboard("ArrowRight"),
        powerUp:Key = keyboard("ArrowUp"),
        powerDown:Key = keyboard("ArrowDown"),
        fire:Key = keyboard(" ");

    brotLeft.press = () => {
        tank.vrot = -0.01;
    };

    brotLeft.release = () => {
       if (!right.isDown && tank.vfwd === 0) {
            tank.vrot = 0;
       }
    };

    brotRight.press = () => {
        tank.vrot = 0.01;
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
        
    //Right
    right.press = () => {
        tank.vx = 1;
    };

    right.release = () => {
        if (!left.isDown) {
            tank.vx = 0;
        }
    };

    powerUp.press = () => {
        tank.vpow = 1;
    }

    powerUp.release = () => {
        tank.vpow = 0;
    }

    powerDown.press = () => {
        tank.vpow = -1;
    }

    powerDown.release = () => {
        tank.vpow = 0;
    }

    fire.press = () => {
        let p = tank.fireProjectile();
        p.mount(app);
        projectiles.push(p);
    }

    console.log(tank);
}

let state = play;

function gameLoop(delta:any):void {
    state(delta);
}

function play(delta:any):void {
    tank.handleMovement(terrain);
    gameStatus.draw();
    projectiles.forEach((p, i, arr) => {
        if(!p.handleMovement(terrain))
            arr.splice(i, 1);
    });
}

app.renderer.backgroundColor = 0x66ccff;

document.body.appendChild(app.view);