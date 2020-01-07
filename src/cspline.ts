/**
 * Cubic Spline created using algorithm for calculating a natural cubic
 * spline as described here:
 * https://www.math.ntnu.no/emner/TMA4215/2008h/cubicsplines.pdf
 */
import * as math from 'mathjs'


class CSplinePart {

    x0: number;
    x1: number;
    y0: number;
    y1: number;
    z0: number;
    z1: number;
    h: number;

    constructor(x0: number, x1: number, y0:number, y1:number, z0: number, z1: number, h: number){
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
        this.z0 = z0;
        this.z1 = z1;
        this.h = h;
    }

    yval(xval: number): number {
        const xdlo = xval - this.x0;
        const xdhi = this.x1 - xval;
        return (
            ((this.z1 / (6 * this.h)) * Math.pow(xdlo, 3))
            + ((this.z0 / (6 * this.h)) * Math.pow(xdhi, 3))
            + (((this.y1/this.h) - ((this.z1/6) * this.h)) * xdlo)
            + (((this.y0/this.h) - ((this.z0/6) * this.h)) * xdhi)
        );
    }

    containsX(x: number): boolean {
        return (x >= this.x0) && (x <= this.x1);
    }
}


export class CSpline {

    parts: CSplinePart[];

    private vecZ(matA: number[][], vv: number[]): number[]{
        let vz:number[] = [];
        const mmat = math.matrix(matA);
        let vec = <number[]> math.multiply(math.inv(mmat), vv);
        vec.forEach((e) => {vz.push(e)});
        return vz;
    }

    private vecH(pts: number[][]): number[]{
        let hv = [];
        for(let i = 0; i < pts.length-1; i++){
            hv.push(pts[i+1][0] - pts[i][0]);
        }
        return hv;
    }

    private vecB(pts: number[][], vh: number[]): number[]{
        let bv = [];
        for(let i = 0; i < pts.length-1; i++){
            bv.push((1/vh[i]) * (pts[i+1][1] - pts[i][1]));
        }
        return bv;
    }

    private vecV(vh: number[]): number[]{
        let vv = [];
        for(let i = 1; i < vh.length; i++){
            vv.push(2 * (vh[i] + vh[i-1]));
        }
        return vv;
    }

    private vecU(bv: number[]): number[]{
        let uv = [];
        for(let i = 1; i < bv.length; i++){
            uv.push(6 * (bv[i] - bv[i-1]));
        }
        return uv;
    }

    private matrixA(vv: number[], vh: number[]): number[][]{
        let matrix = [];
        const firstRow = new Array<number>(vv.length);
        firstRow[0] = vv[0];
        firstRow[1] = vh[0];
        for(let i = 2; i < firstRow.length; i++) firstRow[i] = 0;
        matrix.push(firstRow);

        for(let i = 1; i < vv.length - 1; i++){
            const row = new Array<number>(vv.length);
            for(let j = 0; j < row.length; j++){
                if(j === (i - 1)) row[j] = vh[i-1];
                else if(j === i) row[j] = vv[i];
                else if(j === (i + 1)) row[j] = vh[i];
                else row[j] = 0;
            }
            matrix.push(row);
        }

        const lastRow = new Array<number>(vv.length);
        lastRow[lastRow.length-1] = vv[vv.length-1];
        lastRow[lastRow.length-2] = vh[vh.length-1];
        for(let i = 0; i < firstRow.length-2; i++) lastRow[i] = 0;
        matrix.push(lastRow);
        return matrix;
    }

    constructor(pts: number[][]){
        const vh = this.vecH(pts);
        const vv = this.vecV(vh);
        const vu = this.vecU(this.vecB(pts, vh));
        const matA = this.matrixA(vv, vh);
        const vz = this.vecZ(matA, vu);
        vz.unshift(0);
        vz.push(0);
        this.parts = [];
        for(let i = 0; i < pts.length-1; i++){
            const part = new CSplinePart(
                pts[i][0],
                pts[i+1][0],
                pts[i][1],
                pts[i+1][1],
                vz[i],
                vz[i+1],
                vh[i]
            );
            this.parts.push(part);
        }
    }

    yval(xval: number): number {
        for(let part of this.parts){
            if(part.containsX(xval)) return part.yval(xval);
        }
        return 0;
    }
}