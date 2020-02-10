import * as PIXI from 'pixi.js'
import * as sprites from '../sprites'


export enum ProjectileType {
    Basic,
}

export class Projectile {
    type: ProjectileType;
    sprite: PIXI.Sprite;
    radius: number;

    constructor(type: ProjectileType){
        this.type = type;
    }

    x(): number {
        return this.sprite.x;
    }

    y(): number {
        return this.sprite.y;
    }
}