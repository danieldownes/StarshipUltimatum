import * as THREE from 'three';

export class ScoreView {
    private sprite: THREE.Sprite;
    private score: number = 0;

    constructor() {
        this.sprite = this.createSprite();
    }

    private createSprite(): THREE.Sprite {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);

        this.updateTexture(context, texture);

        return sprite;
    }

    private updateTexture(context: CanvasRenderingContext2D | null, texture: THREE.CanvasTexture) {
        if (!context) return;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = 'white';
        context.font = 'Bold 58px Arial';
        context.textAlign = 'right';
        context.fillText(`Score: ${this.score}`, 240, 80);

        texture.needsUpdate = true;
    }

    updatePosition(width: number, height: number) {
        this.sprite.position.set(width / 2 - 120, height / 2 - 60, 0);
        this.sprite.scale.set(200, 100, 1);
    }

    setScore(newScore: number) {
        this.score = newScore;
        const context = (this.sprite.material as THREE.SpriteMaterial).map!.image.getContext('2d');
        this.updateTexture(context, this.sprite.material.map as THREE.CanvasTexture);
    }

    getSprite(): THREE.Sprite {
        return this.sprite;
    }
}