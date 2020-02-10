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

    doesIntersectRect(other: Rectangle): boolean {
        return (
            this.x < (other.x + other.w) &&
            (this.x + this.w) > other.x &&
            this.y < (other.y + other.h) &&
            (this.y + this.h) > other.y
        );
    }

    doesIntersectCircle(x: number, y: number, r: number): boolean{
        let testX = x;
        let testY = y;
        if (x < this.x) testX = this.x;
        else if(x > (this.x + this.w)) testX = this.x + this.w;
        if (y < this.y) testY = this.y;
        else if(y > (this.y + this.h)) testY = this.y + this.h;
        const distX = x - testX;
        const distY = y - testY;
        const distance = Math.sqrt((distX * distX) + (distY * distY));
        return distance <= r;
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

    getChildrenInRect(x:number, y:number, w:number, h:number, spriteOnly?: boolean): QuadTree[]{
        let result: QuadTree[] = [];
        const qrect = new Rectangle(x, y, w, h);
        if(!this.boundary.doesIntersectRect(qrect)) return result;
        if(this.isLeaf()){
            if(spriteOnly !== undefined && spriteOnly){
                if(this.sprite != null) {
                    result.push(this);
                }
            }else{
                result.push(this);
            }
            return result;
        }
        result = result.concat(this.nw.getChildrenInRect(x, y, w, h, spriteOnly));
        result = result.concat(this.ne.getChildrenInRect(x, y, w, h, spriteOnly));
        result = result.concat(this.sw.getChildrenInRect(x, y, w, h, spriteOnly));
        result = result.concat(this.se.getChildrenInRect(x, y, w, h, spriteOnly));
        return result;
    }

    getChildrenInRadius(x:number, y:number, r:number, spriteOnly?: boolean): QuadTree[]{
        let result: QuadTree[] = [];
        if(!this.boundary.doesIntersectCircle(x, y, r)) return result;
        if(this.isLeaf()){
            if(spriteOnly != undefined && spriteOnly){
                if(this.sprite != null) result.push(this);
            }else{
                result.push(this);
            }
            return result;
        }
        result = result.concat(this.nw.getChildrenInRadius(x, y, r, spriteOnly));
        result = result.concat(this.ne.getChildrenInRadius(x, y, r, spriteOnly));
        result = result.concat(this.sw.getChildrenInRadius(x, y, r, spriteOnly));
        result = result.concat(this.se.getChildrenInRadius(x, y, r, spriteOnly));
        return result;
    }

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
    }

    isLeaf(): boolean {
        return this.nw === undefined;
    }
}