import * as THREE from 'three';
import { ScoreView } from './ScoreView';

export class UiController {
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private circle: THREE.LineLoop;
    private score: ScoreView;

    constructor(width: number, height: number) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(
            -width / 2, width / 2,
            height / 2, -height / 2,
            0.1, 1000
        );
        this.camera.position.z = 10;

        // Create a circle for the UI
        const circleGeometry = new THREE.CircleGeometry(50, 32);
        const circleMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.circle = new THREE.LineLoop(circleGeometry, circleMaterial);

        // Position the circle in the corner of the screen
        this.circle.position.set(-width / 2 + 70, height / 2 - 70, 0);
        this.scene.add(this.circle);

        this.score = new ScoreView();
        this.score.updatePosition(width, height);
        this.scene.add(this.score.getSprite());
    }

    resize(width: number, height: number) {
        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();

        // Update circle position if needed
        this.circle.position.set(-width / 2 + 70, height / 2 - 70, 0);

        // Update score position
        this.score.updatePosition(width, height);
    }

    render(renderer: THREE.WebGLRenderer) {
        renderer.autoClear = false;
        renderer.render(this.scene, this.camera);
    }

    setScore(newScore: number) {
        this.score.setScore(newScore);
    }
}