import * as PIXI from 'pixi.js'
import { CSpline } from './cspline'
import { QuadTree, Rectangle } from './quadtree'


export function knotPoints(renderer: PIXI.Renderer, numPts: number, variance: number): number[][] {
    let pts: number[][] = [];
    const segLen = renderer.width / numPts;
    for(let i = 0; i <= numPts; i++){
        pts.push([
            (i * segLen),
            (renderer.height / 2.8) + (renderer.height * variance * Math.random())
        ]);
    }
    return pts;
}

export function generateTerrain(renderer: PIXI.Renderer): PIXI.Container{
    let terrain = new PIXI.Container();
    let intPts = knotPoints(renderer, 10, 0.3);
    let spline = new CSpline(intPts);

    const qtree = new QuadTree(new Rectangle(0, 0, renderer.width, renderer.height));
    qtree.initialize(spline, terrain);
    return terrain;
}