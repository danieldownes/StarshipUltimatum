import * as THREE from 'three';
import { LineSegments, BufferGeometry, BufferAttribute } from 'three';

export default class Starfield {
    private starsTotal = 200;

    private stars: THREE.Mesh[] = [];

    constructor(scene: THREE.Scene) {
        this.createStars(scene);
    }

    private createStars(scene: THREE.Scene): void {
        const geometry = new THREE.SphereGeometry(0.02, 4, 4);

        for (let i = 0; i < this.starsTotal; i++) {
            const color = new THREE.Color(0xffffff);
            color.setHex(Math.random() * 0x555555 + 0xAAAAAA);
            //const color = `0x${dec.toString(16)}`;
            const material = new THREE.MeshBasicMaterial({ color: color, wireframe: false }); // White wireframe material

            const star = new THREE.Mesh(geometry, material);

            star.position.set(
                Math.floor(Math.random() * 50) - 25,
                Math.floor(Math.random() * 7) - 7,
                Math.floor(Math.random() * 50) - 25
            );

            this.stars.push(star);
            scene.add(star);
        }
    }

    public Update(playerRig: THREE.Object3D, shipSpeed: number): void {
        for (let i = 0; i < this.starsTotal; i++) {
            const star = this.stars[i];
            const tDist = star.position.distanceTo(playerRig.position);

            if (tDist > 40) {
                const tRan = Math.random() * Math.PI * 2;
                const offsetX = Math.cos(tRan) * 20;
                const offsetZ = Math.sin(tRan) * 20;
                const newPosition = playerRig.position.clone().add(new THREE.Vector3(offsetX, Math.floor(Math.random() * 7) - 7, offsetZ));
                star.position.copy(newPosition);
            }

            star.scale.set(1, 1, shipSpeed * 5)
            star.rotation.y = (playerRig.rotation.y);
        }
    }

}