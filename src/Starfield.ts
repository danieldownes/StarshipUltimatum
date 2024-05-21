import * as THREE from 'three';
import { LineSegments, BufferGeometry, BufferAttribute } from 'three';

export default class Starfield {
    private readonly starsMaxCount: number = 30;
    private stars: THREE.LineSegments[] = [];

    constructor(scene: THREE.Scene) {
        this.createStars(scene);
    }

    createStars(scene: THREE.Scene): void {
        for (let i = 0; i < this.starsMaxCount; i++) {
            const dec = Math.floor(Math.random() * (64 + 64)) + 64;
            const lineWidth = Math.floor(Math.random() * 5) + 1;

            const geometry = new BufferGeometry();
            const position = new Float32Array(6);
            position.set([
                Math.floor(Math.random() * 20) - 10,
                Math.floor(Math.random() * 20) - 10,
                Math.floor(Math.random() * 20) - 10,
            ]);
            geometry.setAttribute('position', new BufferAttribute(position, 3));
            const col = this.randHexColor()
            const material = new THREE.LineBasicMaterial({ color: col, linewidth: lineWidth });
            const star = new LineSegments(geometry, material);
            this.stars.push(star);
            scene.add(star);
        }
    }

    public Update(playerRig: THREE.Object3D, shipSpeed: number): void {
        // Calculate the forward vector based on the ship's rotation
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(playerRig.quaternion);

        for (let i = 0; i < this.starsMaxCount; i++) {
            const star = this.stars[i];
            const starPositions = star.geometry.attributes.position.array;
            const starPosition = new THREE.Vector3(starPositions[0], playerRig.position.y, starPositions[2]);
            const tDist = starPosition.distanceTo(playerRig.position);

            if (tDist > 15) {
                const tRan = Math.random() * Math.PI * 2;
                const offsetDirection = new THREE.Vector3(
                    Math.cos(tRan),
                    0,
                    Math.sin(tRan)
                  ).multiplyScalar(5); // Random direction vector with magnitude 10
                  const newPosition = playerRig.position.clone().add(offsetDirection);
                  starPositions[0] = newPosition.x;
                  starPositions[2] = newPosition.z;
            }

            const elongationDirection = forward.clone().multiplyScalar(shipSpeed * 1.5);
            starPositions[3] = starPositions[0] + elongationDirection.x;
            starPositions[4] = starPositions[1]; // + 0.3;
            starPositions[5] = starPositions[2] + elongationDirection.z;

            star.geometry.attributes.position.needsUpdate = true;
        }
    }

    private randHexColor(): string {
        let n = (Math.random() * 0xfffff * 1000000).toString(16)
        return '#' + n.slice(0, 6)
    }
}