import * as THREE from 'three';
import { IGameMode } from './IGameMode.ts';
import Player from '../Player.ts';
import InputKeys from '../InputKeys.ts';

export class OverheadMode implements IGameMode {
    public modeName: string = 'overhead';

    enter(scene: THREE.Scene, player: Player, camera: THREE.Object3D): void {
        console.log("Entering Overhead Mode");

		scene.add(player)

        player.add(camera);

        camera.position.x = 0
        camera.position.y = 7
		camera.position.z = -2
        camera.rotation.set(0, 0, 0); 
		camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI)
		camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1.1)

        camera.position.set(0, 7, -2);
    }

    exit(player: Player, camera: THREE.Object3D): void {
        console.log("Exiting Overhead Mode");
        // Detach camera from player if it was attached
        // Camera is added to player in this mode, so no need to remove it from scene
        if (camera.parent === player) {
            player.remove(camera);
        }
    }

    update(player: Player, camera: THREE.Object3D, inputKeys: InputKeys, deltaTime: number): void {
        // Player movement logic for overhead mode
        const rotationSpeed = 2.0 * deltaTime; // Radians per second
        const moveSpeed = 5.0 * deltaTime; // Units per second

        if (inputKeys.KeyIsDown.has('a') || inputKeys.KeyIsDown.has('arrowleft')) {
            player.applyRotationY(rotationSpeed);
        } else if (inputKeys.KeyIsDown.has('d') || inputKeys.KeyIsDown.has('arrowright')) {
            player.applyRotationY(-rotationSpeed);
        }

        const dir = player.Direction;
        player.getWorldDirection(dir);

        player.Velocity.multiplyScalar(0); // Reset velocity each frame

        if (inputKeys.KeyIsDown.has('w') || inputKeys.KeyIsDown.has('arrowup')) {
            player.Velocity.add(dir.clone().multiplyScalar(moveSpeed));
        } else if (inputKeys.KeyIsDown.has('s') || inputKeys.KeyIsDown.has('arrowdown')) {
            player.Velocity.add(dir.clone().multiplyScalar(-moveSpeed));
        }

        player.applyMovement(player.Velocity);

        // Camera always follows player in this mode, already handled by player.add(camera)
    }
}