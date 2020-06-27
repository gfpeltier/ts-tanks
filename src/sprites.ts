import * as PIXI from 'pixi.js'
import { TankColor } from './models/tank'

const loader = new PIXI.Loader();

export function loadAssets(setup: (
        loader: PIXI.Loader, resources: 
        Partial<Record<string, PIXI.LoaderResource>>
    ) => void): void {
    loader.add("img/spritesheet.json").load(setup)
}

function tankPng(color:TankColor):string {
    switch(color) {
        case TankColor.Black: {
            return "tank_black.png";
        }
        case TankColor.Blue: {
            return "tank_blue.png";
        }
        case TankColor.Yellow: {
            return "tank_yellow.png";
        }
        case TankColor.Green: {
            return "tank_green.png";
        }
        case TankColor.Red: {
            return "tank_red.png";
        }
        default: {
            throw new Error('Invalid tank color')
        }
    }
}

export function tankBody(color: TankColor):PIXI.Sprite {
    const sprites = loader.resources["img/spritesheet.json"].textures;
    return new PIXI.Sprite(sprites[tankPng(color)]);
}

export function tankBarrel():PIXI.Sprite {
    const sprites = loader.resources["img/spritesheet.json"].textures;
    return new PIXI.Sprite(sprites["tank_barrel.png"]);
}

export function tank(color:TankColor):PIXI.Container {
    const sprites = loader.resources["img/spritesheet.json"].textures;
    const tank = new PIXI.Container();
    const tbody = new PIXI.Sprite(sprites[tankPng(color)]);
    const tbarrel = new PIXI.Sprite(sprites["tank_barrel.png"]);
    tbarrel.x = 10;
    tbarrel.width = 12;
    tbarrel.height = 4;
    tbarrel.rotation = (Math.PI / 2);
    tbody.y = 12;
    tbody.width = 16;
    tbody.height = 8;
    tank.addChild(tbody);
    tank.addChild(tbarrel);
    tank.rotation = 0;
    tank.pivot.x = 8;
    tank.pivot.y = 4;
    return tank;
}

export function grass(): PIXI.Sprite {
    const sprites = loader.resources["img/spritesheet.json"].textures;
    let g = new PIXI.Sprite(sprites['grass.png']);
    return g;
}

export function projectile(): PIXI.Sprite {
    const sprites = loader.resources["img/spritesheet.json"].textures;
    return new PIXI.Sprite(sprites['projectile.png']);
}