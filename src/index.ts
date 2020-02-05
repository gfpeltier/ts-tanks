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

function setup():void{
    
    tank = new Tank(TankColor.Red);
    let terrain = new Terrain(app.renderer.width, app.renderer.height);
    terrain.mountTank(tank, 100);
    app.stage.addChild(tank.tank);
    app.stage.addChild(terrain.tsprites);
    app.ticker.add(delta => gameLoop(delta));

    let left:Key = keyboard("a"),
        right:Key = keyboard("d"),
        up:Key = keyboard("w"),
        down:Key = keyboard("s");

    // Left
    left.press = () => {
        tank.vrot = -0.1;
        tank.vfwd = 0;
    };

    left.release = () => {
       if (!right.isDown && tank.vfwd === 0) {
            tank.vrot = 0;
       }
    };
        
    //Up
    up.press = () => {
        tank.vfwd = 5;
        tank.vrot = 0;
    };
    
    up.release = () => {
        if (!down.isDown && tank.vrot === 0) {
            tank.vfwd = 0;
        }
    };
        
    //Right
    right.press = () => {
        tank.vrot = 0.1;
        tank.vfwd = 0;
    };

    right.release = () => {
        if (!left.isDown && tank.vfwd === 0) {
            tank.vrot = 0;
        }
    };

    //Down
    down.press = () => {
        tank.vfwd = -5;
        tank.vrot = 0;
    };
    
    down.release = () => {
        if (!up.isDown && tank.vrot === 0) {
            tank.vfwd = 0;
        }
    };
    console.log(tank);
}

let state = play;

function gameLoop(delta:any):void{
    state(delta);
}

function play(delta:any):void{
    let dx = tank.vfwd * Math.cos(tank.tank.rotation - (Math.PI / 2));
    let dy = tank.vfwd * Math.sin(tank.tank.rotation - (Math.PI / 2));
    tank.tank.x = Math.max(0, Math.min(app.renderer.width, (tank.tank.x + dx))); 
    tank.tank.y = Math.max(0, Math.min(app.renderer.height, (tank.tank.y + dy))); 
    tank.tbarrel.rotation = (tank.tbarrel.rotation + tank.vrot) % (2 * Math.PI);
}

app.renderer.backgroundColor = 0x66ccff;

document.body.appendChild(app.view);