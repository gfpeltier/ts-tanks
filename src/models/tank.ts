import * as PIXI from 'pixi.js'
import * as sprites from '../sprites'
import { Terrain } from './terrain';
import { Projectile, ProjectileType } from './projectile';

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
    vpow: number;
    power: number;

    constructor(color: TankColor) {
        this.health = 100;
        this.power = 100;
        this.vx = 0;
        this.vy = 0;
        this.vrot = 0;
        this.vfwd = 0;
        this.vpow = 0;
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

    _collidingBelow(terrain:Terrain): boolean {
        let ispts = terrain.intersectRect(this.tank.x-8, this.tank.y+1, this.width(), this.height());
        return ispts.length != 0;
    }

    handleMovement(terrain: Terrain) {
        if(!this._collidingBelow(terrain)){
            this.tank.y += 1;
            return;
        }
        
        let nx = this.tank.x + this.vx;
        let ipts = terrain.intersectRect(nx-8, this.tank.y, this.width(), this.height());
        
        if(ipts.length != 0){
            ipts = terrain.intersectRect(nx-8, this.tank.y-4, this.width(), this.height());
            if(ipts.length == 0){
                this.tank.x = nx;
                this.tank.y -= 4;
            }
        }else{
            this.tank.x = nx;
        }
        this.tank.x = Math.min(this.tank.x, terrain.width);
        this.tank.x = Math.max(this.tank.x, 0);

        this.tank.y += this.vy;
        let nrot = this.tbarrel.rotation + this.vrot;
        if(nrot <= Math.PI && nrot >= 0)
            this.tbarrel.rotation += this.vrot;

        this.power += this.vpow;
        this.power = Math.min(this.power, 100);
        this.power = Math.max(this.power, 0);
    }

    getHealth() {
        return this.health;
    }

    getBarrelAngle():number {
        return this.tbarrel.rotation * 180 / Math.PI;
    }

    getPower():number {
        return this.power;
    }

    _scaledPower():number {
        return this.power * 0.15;
    }

    fireProjectile():Projectile {
        let vx = -1 * this._scaledPower() * Math.cos(this.tbarrel.rotation);
        let vy = -1 * this._scaledPower() * Math.sin(this.tbarrel.rotation);
        return new Projectile(ProjectileType.Basic, this.tank.x, this.tank.y, vx, vy);
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