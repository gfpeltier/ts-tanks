import * as PIXI from 'pixi.js'
import * as sprites from '../sprites'
import { Terrain } from './terrain';

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

    collidingBelow(terrain:Terrain): boolean {
        let ispts = terrain.intersectRect(this.tank.x-8, this.tank.y+1, this.width(), this.height());
        return ispts.length != 0;
    }

    handleMovement(terrain: Terrain) {
        if(!this.collidingBelow(terrain)){
            this.tank.y += 1;
            return;
        }
        let nx = this.tank.x + this.vx;
        let ipts = terrain.intersectRect(nx-8, this.tank.y, this.width(), this.height());
        if(ipts.length != 0){
            ipts = terrain.intersectRect(nx-8, this.tank.y-2, this.width(), this.height());
            if(ipts.length == 0){
                this.tank.x = nx;
                this.tank.y -= 2;
            }
        }else{
            this.tank.x = nx;
        }
        this.tank.y += this.vy;
        let nrot = this.tbarrel.rotation + this.vrot;
        if(nrot <= Math.PI && nrot >= 0)
            this.tbarrel.rotation += this.vrot;
    }

    fireProjectile(){
        console.log("Fire!");
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

    x(): number {
        return this.tank.x;
    }

    y(): number {
        return this.tank.y;
    }

    width(): number {
        return this.tank.width;
    }

    height(): number {
        return 17.2;
    }

    showBounds(){
        let rect = new PIXI.Graphics();
        rect.beginFill(0xFF0000);
        rect.drawRect(this.tank.x, this.tank.y, this.width(), this.height());
        this.tank.addChild(rect);
    }
}