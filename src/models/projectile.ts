import * as PIXI from 'pixi.js'
import * as sprites from '../sprites'
import { Terrain } from './terrain';


export enum ProjectileType {
    Basic,
}

function blastRadius(ptype:ProjectileType):number {
    switch(ptype){
        case ProjectileType.Basic:
            return 10;
        default:
            return 10;
    }
}

export class Projectile {
    type: ProjectileType;
    sprite: PIXI.Sprite;
    radius: number;
    vx: number;
    vy: number;

    constructor(type:ProjectileType, x0:number, y0:number, initVX:number, initVY:number){
        this.type = type;
        this.sprite = sprites.projectile();
        this.radius = 3;
        this.sprite.x = x0;
        this.sprite.y = y0;
        this.sprite.width = 5;
        this.sprite.height = 5;
        this.vx = initVX;
        this.vy = initVY;
    }

    mount(app:PIXI.Application){
        app.stage.addChild(this.sprite);
    }

    x(): number {
        return this.sprite.x;
    }

    y(): number {
        return this.sprite.y;
    }

    _explode(terrain:Terrain) {
        let rblast = blastRadius(this.type);
        terrain.handleExplosion(this.sprite.x, this.sprite.y, rblast);
    }

    handleMovement(terrain:Terrain):boolean {
        this.sprite.x += this.vx;
        this.sprite.y += this.vy;
        this.vy += 0.1;
        let intersect = terrain.intersectProjectile(this);
        if (intersect.length != 0) {
            console.log("Hit Terrain!");
            this._explode(terrain);
            this.sprite.destroy();
            return false;
        }
        if (this.sprite.x < 0 || this.sprite.x > terrain.width) {
            this.sprite.destroy();
            return false;
        }
        return true;
    }
}