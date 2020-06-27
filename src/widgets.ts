import * as PIXI from 'pixi.js'
import { Tank } from './models/tank';

export class GameStatus {

    player: Tank;
    status: PIXI.Graphics;
    angleText: PIXI.Text;
    healthText: PIXI.Text;
    powerText: PIXI.Text;
    width: number;

    constructor(player: Tank, width: number){
        this.player = player;
        this.status = new PIXI.Graphics();
        this.angleText = new PIXI.Text("Angle: 0", {fontFamily: "Arial", fontSize: 15});
        this.angleText.position.x = 10;
        this.angleText.position.y = 15;
        this.healthText = new PIXI.Text("Health: 100", {fontFamily: "Arial", fontSize: 15});
        this.healthText.position.x = 10;
        this.healthText.position.y = 35;
        this.powerText = new PIXI.Text("Power: 100", {fontFamily: "Arial", fontSize: 15});
        this.powerText.position.x = 10;
        this.powerText.position.y = 55;
        this.status.addChild(this.angleText);
        this.status.addChild(this.healthText);
        this.status.addChild(this.powerText);
        this.width = width;
    }

    _angleText():string {
        return "Angle: " + this.player.getBarrelAngle().toFixed(2) + "\u00B0";
    }

    _healthText():string {
        return "Health: " + this.player.getHealth() + "%";
    }

    _powerText():string {
        return "Power: " + this.player.getPower() + "%";
    }

    mount(app: PIXI.Application) {
        app.stage.addChild(this.status);
    }

    draw() {
        this.status.clear();
        this.status.beginFill(0xFFFFFF, 0.6);
        this.status.drawRect(0, 0, this.width, 100);
        this.angleText.text = this._angleText();
        this.healthText.text = this._healthText();
        this.powerText.text = this._powerText();
    }
}