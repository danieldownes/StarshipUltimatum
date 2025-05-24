import * as THREE from 'three';
import { IGameMode } from './IGameMode.ts';
import Player from '../Player.ts';
import InputKeys from '../InputKeys.ts';

export class SideScrollerMode implements IGameMode {
    public modeName: string = 'sideScroller';
    private cameraSpeed: number = 0.1; // Constant camera speed

    enter(scene: THREE.Scene, player: Player, camera: THREE.Object3D): void {
        console.log("Entering Side Scroller Mode");
        
        // Set camera position relative to player for side-scrolling view
        // Camera moves to the right of the player
        camera.position.set(player.position.x + 5, player.position.y + 2, player.position.z);
        camera.rotation.set(0, 0, 0); // Reset camera rotation
        camera.lookAt(player.position); // Look at the player

        // Player pitch should be locked in this mode
        player.rotation.x = 0;
        player.rotation.z = 0;
    }

    exit(player: Player, camera: THREE.Object3D): void {
        console.log("Exiting Side Scroller Mode");
    }

    update(player: Player, camera: THREE.Object3D, inputKeys: InputKeys, deltaTime: number): void {
        // Camera moves constantly to the right
        camera.position.x += this.cameraSpeed * deltaTime * 60; // Adjust with deltaTime

        // Player vertical movement (Up/Down arrow keys)
        const playerVerticalSpeed = 5.0 * deltaTime; // Units per second
        if (inputKeys.UpIsPressed()) {
            player.applyMovement(new THREE.Vector3(0, playerVerticalSpeed, 0));
        } else if (inputKeys.DownIsPressed()) {
            player.applyMovement(new THREE.Vector3(0, -playerVerticalSpeed, 0));
        }

        // Player forward/backward movement relative to camera speed (Left/Right arrow keys)
        const playerHorizontalSpeed = 5.0 * deltaTime; // Units per second
        if (inputKeys.RightIsPressed()) {
            player.applyMovement(new THREE.Vector3(playerHorizontalSpeed, 0, 0));
        } else if (inputKeys.LeftIsPressed()) {
            player.applyMovement(new THREE.Vector3(-playerHorizontalSpeed, 0, 0));
        } else {
            // If no left/right input, player resumes camera speed
            // This needs to be relative to the camera's movement
            player.position.x = camera.position.x - 5; // Maintain relative position to camera
        }

        // TODO: Implement robust player boundary checks based on camera frustum
        // For now, a simplified approach to keep player somewhat centered horizontally
        player.position.x = camera.position.x - 5; // Keep player to the left of the camera

        // Simple vertical bounds (adjust as needed for game world)
        const worldMinY = -5;
        const worldMaxY = 5;
        player.position.y = Math.max(worldMinY, Math.min(worldMaxY, player.position.y));

        // Ensure player pitch is locked
        player.setRotation(0, player.rotation.y, 0); // Only allow Y rotation if needed, otherwise set to 0
    }
}