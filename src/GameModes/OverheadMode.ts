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
        
        camera.parent?.remove(camera);
        player.parent?.remove(player);
    }

    update(player: Player, camera: THREE.Object3D, inputKeys: InputKeys, deltaTime: number): void {
        // Player movement logic for overhead mode
        const rotationSpeed = 2.0 * deltaTime; // Radians per second
        const moveSpeed = 5.0 * deltaTime; // Units per second

        if (inputKeys.LeftIsPressed()) {
            player.applyYaw(rotationSpeed);
        } else if (inputKeys.RightIsPressed()) {
            player.applyYaw(-rotationSpeed);
        }

        const dir = player.Direction;
        player.getWorldDirection(dir);

        player.Velocity.multiplyScalar(0); // Reset velocity each frame

        if (inputKeys.UpIsPressed()) {
            player.Velocity.add(dir.clone().multiplyScalar(moveSpeed));
        } else if (inputKeys.DownIsPressed()) {
            player.Velocity.add(dir.clone().multiplyScalar(-moveSpeed));
        }

        player.applyMovement(player.Velocity);

        // Camera always follows player in this mode, already handled by player.add(camera)
    }
}