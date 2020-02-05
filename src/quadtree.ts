import * as PIXI from 'pixi.js'
import { CSpline } from './cspline'
import { grass } from './sprites'


export class Rectangle {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number, y: number, w: number, h: number){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    matchBounds(sprite: PIXI.Sprite){
        sprite.x = this.x;
        sprite.y = this.y;
        sprite.width = this.w;
        sprite.height = this.h;
    }

    toString(): string{
        return "[" + this.x + ", " + this.y + ", " + this.w + ", " + this.h + "]";
    }
}

export class QuadTree {
    boundary: Rectangle;
    sprite: PIXI.Sprite;
    nw: QuadTree;
    ne: QuadTree;
    sw: QuadTree;
    se: QuadTree;

    static readonly MIN_WIDTH = 1;
    static readonly MIN_HEIGHT = 1;

    constructor(boundary: Rectangle) {
        this.boundary = boundary;
    }

    subdivide(){
        
        let nwRect = new Rectangle(
            this.boundary.x, 
            this.boundary.y, 
            Math.floor(this.boundary.w / 2),
            Math.floor(this.boundary.h / 2)
        );
        let neRect = new Rectangle(
            this.boundary.x + Math.floor(this.boundary.w / 2),
            this.boundary.y, 
            Math.ceil(this.boundary.w / 2),
            Math.floor(this.boundary.h / 2)
        );
        let swRect = new Rectangle(
            this.boundary.x, 
            this.boundary.y + Math.floor(this.boundary.h / 2), 
            Math.floor(this.boundary.w / 2),
            Math.ceil(this.boundary.h / 2)
        );
        let seRect = new Rectangle(
            this.boundary.x + Math.floor(this.boundary.w / 2), 
            this.boundary.y + Math.floor(this.boundary.h / 2), 
            Math.ceil(this.boundary.w / 2),
            Math.ceil(this.boundary.h / 2)
        );
        this.nw = new QuadTree(nwRect);
        this.ne = new QuadTree(neRect);
        this.sw = new QuadTree(swRect);
        this.se = new QuadTree(seRect);
    }

    isHomogeneous(cspline: CSpline): boolean {
        if(this.boundary.w === QuadTree.MIN_WIDTH || this.boundary.h === QuadTree.MIN_HEIGHT){
            return true;
        }
        for(let i = this.boundary.x; i < (this.boundary.x + this.boundary.w); i++){
            let y = cspline.yval(i);
            if(y >= this.boundary.y && y < (this.boundary.y + this.boundary.h)){
                return false;
            }
        }
        return true;
    }

    drawBounds(): PIXI.Graphics {
        const bounds = new PIXI.Graphics();
        bounds.lineStyle(1, 0xFF0000, 1);
        bounds.moveTo(this.boundary.x, this.boundary.y);
        bounds.lineTo(this.boundary.x + this.boundary.w, this.boundary.y);
        bounds.lineTo(
            this.boundary.x + this.boundary.w, 
            this.boundary.y + this.boundary.h
        );
        bounds.lineTo(this.boundary.x, this.boundary.y + this.boundary.h);
        bounds.lineTo(this.boundary.x, this.boundary.y);
        return bounds;
    }

    // TODO: Range query: https://medium.com/@waleoyediran/spatial-indexing-with-quadtrees-b998ae49336
    // TODO: Collision detection: http://www.jeffreythompson.org/collision-detection/circle-rect.php

    highestY(x: number): number {
        if(this.sprite != null 
            && x >= this.boundary.x 
            && x < (this.boundary.x + this.boundary.w)){
                return this.boundary.y;
        }
        return Math.min(
            this.nw.highestY(x), 
            this.ne.highestY(x), 
            this.sw.highestY(x),
            this.se.highestY(x)
        );
    }

    initialize(cspline: CSpline, gcontain: PIXI.Container){
        if(!this.isHomogeneous(cspline)){
            this.subdivide();
            this.nw.initialize(cspline, gcontain);
            this.ne.initialize(cspline, gcontain);
            this.sw.initialize(cspline, gcontain);
            this.se.initialize(cspline, gcontain);
        }
        if(this.isHomogeneous(cspline) && this.boundary.y >= cspline.yval(this.boundary.x)){
            this.sprite = grass();
            this.boundary.matchBounds(this.sprite);
            gcontain.addChild(this.sprite);
        }
        //gcontain.addChild(this.drawBounds());
    }

    isLeaf(): boolean {
        return this.nw === null;
    }
}