import * as PIXI from 'pixi.js'
import { QuadTree, Rectangle } from "../quadtree";
import { CSpline } from '../cspline';
import { Tank } from './tank';
import { Projectile } from './projectile'

function knotPoints(w: number, h: number, numPts: number, variance: number): number[][] {
    let pts: number[][] = [];
    const segLen = w / numPts;
    for(let i = 0; i <= numPts; i++){
        pts.push([
            (i * segLen),
            (h / 2.8) + (h * variance * Math.random())
        ]);
    }
    return pts;
}

export class Terrain {
    qtree: QuadTree;
    tsprites: PIXI.Container;
    cspline: CSpline;

    constructor(gwidth: number, gheight: number) {
        this.qtree = new QuadTree(new Rectangle(0, 0, gwidth, gheight));
        this.tsprites = new PIXI.Container();
        this.cspline = new CSpline(knotPoints(gwidth, gheight, 10, 0.3));
        this.qtree.initialize(this.cspline, this.tsprites);
    }

    /**
     * Positions given tank at given X coordinate at the top of the
     * terrain. Meant for use during original tank spawn.
     * 
     * @param tank
     * @param x
     */
    mountTank(tank: Tank, x: number): void {
        let toffset = x - (tank.bodyWidth() / 2);
        let txs: number[] = [...Array(tank.bodyWidth()).keys()].map((i) => i + toffset);
        let ys: number[] = txs.map((i) => Math.floor(this.cspline.yval(i)));
        let maxY: number = Math.min(...ys);
        console.log("Mounting tank at: " + maxY);
        tank.setPosition(x, maxY-tank.height());
    }

    intersectRect(x:number, y:number, w:number, h:number): PIXI.Sprite[]{
        let tblocks = this.qtree.getChildrenInRect(x, y, w, h, true);
        return tblocks.map((tb) => tb.sprite);
    }

    intersectTank(tank: Tank): PIXI.Sprite[] {
        let tblocks = this.qtree.getChildrenInRect(tank.x(), tank.y(), tank.width(), tank.height(), true);
        return tblocks.map((tb) => tb.sprite);
    }

    intersectProjectile(p: Projectile): PIXI.Sprite[]{
        let tblocks = this.qtree.getChildrenInRadius(p.x(), p.y(), p.radius, true);
        return tblocks.map((tb) => tb.sprite);
    }
}