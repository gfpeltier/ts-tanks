import * as PIXI from 'pixi.js'
import * as sprites from '../sprites'

export enum TankColor {
    Black,
    Blue,
    Yellow,
    Green,
    Red
}

export class Tank {
    tank: PIXI.Container;
    tbody: PIXI.Sprite;
    tbarrel: PIXI.Sprite;
    health: number;
    vx: number;
    vy: number;
    vrot: number;
    vfwd: number;

    constructor(color: TankColor) {
        this.health = 100;
        this.vx = 0;
        this.vy = 0;
        this.vrot = 0;
        this.vfwd = 0;
        this.tank = new PIXI.Container();
        this.tbody = sprites.tankBody(color);
        this.tbarrel = sprites.tankBarrel();
        this.tbarrel.x = 8;
        this.tbarrel.y = 14;
        this.tbarrel.width = 12;
        this.tbarrel.height = 4;
        this.tbarrel.pivot.y = 2;
        this.tbarrel.pivot.x = 30;
        this.tbarrel.rotation = (Math.PI / 2);
        this.tbody.width = 16;
        this.tbody.height = 8;
        this.tbody.y = 12;
        this.tank.addChild(this.tbody);
        this.tank.addChild(this.tbarrel);
        this.tank.pivot.x = 8;
        this.tank.pivot.y = 4;
        this.tank.x = 50;
        this.tank.y = 50;
    }

    handleMovement() {
        this.tank.x += this.vx;
        this.tank.y += this.vy;
        let nrot = this.tbarrel.rotation + this.vrot;
        if(nrot <= Math.PI && nrot >= 0)
            this.tbarrel.rotation += this.vrot;
    }

    setPosition(x:number, y:number) {
        this.tank.x = x;
        this.tank.y = y;
    }

    bodyWidth(): number{
        return this.tbody.width;
    }

    bodyHeight(): number{
        return this.tbody.height;
    }
}