///<reference types="pixi.js"/>
import * as PIXI from 'pixi.js'
import { keyboard, Key } from './controls'
import { TankColor, loadAssets, tank } from './sprites'
import { generateTerrain } from './terrain'

const app = new PIXI.Application({
    width: 800, 
    height: 800,
    antialias: true,
});

loadAssets(setup);

let sprite:any;

function setup():void{
    
    sprite = tank(TankColor.Red);
    let terrain = generateTerrain(app.renderer);
    sprite.vrot = 0;
    sprite.vfwd = 0;
    app.stage.addChild(sprite);
    app.stage.addChild(terrain);
    app.ticker.add(delta => gameLoop(delta));

    let left:Key = keyboard("ArrowLeft"),
        right:Key = keyboard("ArrowRight"),
        up:Key = keyboard("ArrowUp"),
        down:Key = keyboard("ArrowDown");

    // Left
    left.press = () => {
        sprite.vrot = -0.1;
        sprite.vfwd = 0;
    };

    left.release = () => {
       if (!right.isDown && sprite.vfwd === 0) {
            sprite.vrot = 0;
       }
    };
        
    //Up
    up.press = () => {
        sprite.vfwd = 5;
        sprite.vrot = 0;
    };
    
    up.release = () => {
        if (!down.isDown && sprite.vrot === 0) {
            sprite.vfwd = 0;
        }
    };
        
    //Right
    right.press = () => {
        sprite.vrot = 0.1;
        sprite.vfwd = 0;
    };

    right.release = () => {
        if (!left.isDown && sprite.vfwd === 0) {
            sprite.vrot = 0;
        }
    };

    //Down
    down.press = () => {
        sprite.vfwd = -5;
        sprite.vrot = 0;
    };
    
    down.release = () => {
        if (!up.isDown && sprite.vrot === 0) {
            sprite.vfwd = 0;
        }
    };
}

let state = play;

function gameLoop(delta:any):void{
    state(delta);
}

function play(delta:any):void{
    let dx = sprite.vfwd * Math.cos(sprite.rotation - (Math.PI / 2));
    let dy = sprite.vfwd * Math.sin(sprite.rotation - (Math.PI / 2));
    sprite.x = Math.max(0, Math.min(app.renderer.width, (sprite.x + dx))); 
    sprite.y = Math.max(0, Math.min(app.renderer.height, (sprite.y + dy))); 
    sprite.rotation = (sprite.rotation + sprite.vrot) % (2 * Math.PI);
}

app.renderer.backgroundColor = 0x66ccff;

document.body.appendChild(app.view);