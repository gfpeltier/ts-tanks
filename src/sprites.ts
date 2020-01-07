import * as PIXI from 'pixi.js'

export enum TankColor {
    Black,
    Blue,
    Beige,
    Green,
    Red
}

const loader = new PIXI.Loader();

export function loadAssets(setup: (
        loader: PIXI.Loader, resources: 
        Partial<Record<string, PIXI.LoaderResource>>
    ) => void): void {
    loader.add("img/tank_sprites.json").load(setup)
}

function tankPng(color:TankColor):string {
    switch(color) {
        case TankColor.Black: {
            return "tankBlack.png";
        }
        case TankColor.Blue: {
            return "tankBlue.png";
        }
        case TankColor.Beige: {
            return "tankBeige.png";
        }
        case TankColor.Green: {
            return "tankGreen.png";
        }
        case TankColor.Red: {
            return "tankRed.png";
        }
        default: {
            throw new Error('Invalid tank color')
        }
    }
}

function tankBarrelPng(color:TankColor):string {
    switch(color) {
        case TankColor.Black: {
            return "barrelBlack.png";
        }
        case TankColor.Blue: {
            return "barrelBlue.png";
        }
        case TankColor.Beige: {
            return "barrelBeige.png";
        }
        case TankColor.Green: {
            return "barrelGreen.png";
        }
        case TankColor.Red: {
            return "barrelRed.png";
        }
        default: {
            throw new Error('Invalid tank color')
        }
    }
}

export function tank(color:TankColor):PIXI.Container {
    const sprites = loader.resources["img/tank_sprites.json"].textures;
    const tank = new PIXI.Container();
    const tbody = new PIXI.Sprite(sprites[tankPng(color)]);
    const tbarrel = new PIXI.Sprite(sprites[tankBarrelPng(color)]);
    tbarrel.x = 29;
    tbody.y = 12;
    tank.addChild(tbody);
    tank.addChild(tbarrel);
    tank.rotation = 0;
    tank.pivot.x = 37;
    tank.pivot.y = 35;
    return tank;
}