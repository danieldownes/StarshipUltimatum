import * as THREE from 'three';
import { IGameMode } from './IGameMode.ts';
import Player from '../Player.ts';
import InputKeys from '../InputKeys.ts';

export class SideScrollerMode implements IGameMode {
    public modeName: string = 'sideScroller';
    private cameraSpeed: number = 1;
    private playerBounds = {
        left: -6,
        right: 6,
        top: 6,
        bottom: -6
    }; // Relative to camera position

    private field: THREE.Object3D | null = null;

    enter(scene: THREE.Scene, player: Player, camera: THREE.Object3D): void {
        console.log("Entering SideScroller Mode");

        // Create dummy object as the playing field
        this.field = new THREE.Object3D();
        this.field.position.copy(player.position);
        this.field.rotation.copy(player.rotation);

        this.field.add(camera);
        this.field.add(player);
        
        scene.add(this.field);

        // Set camera position relative to player for side-scrolling view
        // Camera moves to the right of the player
        camera.position.set(player.position.x - 8, player.position.y, player.position.z);

        //const yawQuaternion = new THREE.Quaternion();
        camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -(Math.PI / 2)); 
        //camera.quaternion.multiply(yawQuaternion);
    }

    exit(player: Player, camera: THREE.Object3D): void {
        console.log("Exiting SideScroller Mode");

        // Preserve world position and rotation before detaching
        const playerWorldPosition = new THREE.Vector3();
        player.getWorldPosition(playerWorldPosition);
        const playerWorldQuaternion = new THREE.Quaternion();
        player.getWorldQuaternion(playerWorldQuaternion);

        const cameraWorldPosition = new THREE.Vector3();
        camera.getWorldPosition(cameraWorldPosition);
        const cameraWorldQuaternion = new THREE.Quaternion();
        camera.getWorldQuaternion(cameraWorldQuaternion);

        player.parent?.remove(player);
        camera.parent?.remove(camera);

        // Apply world position and rotation after detaching
        player.position.copy(playerWorldPosition);
        player.quaternion.copy(playerWorldQuaternion);

        player.position.z = 0;

        camera.position.copy(cameraWorldPosition);
        camera.quaternion.copy(cameraWorldQuaternion);
    }

    update(player: Player, camera: THREE.Object3D, inputKeys: InputKeys, deltaTime: number): void {
    // Move camera forward at constant speed (in -Z direction, which appears as "forward" on screen)
        const forwardMovement = this.cameraSpeed * deltaTime;
        camera.position.z += forwardMovement;
        player.position.z += forwardMovement;

        // Player strafing movement (only left/right and up/down relative to screen)
        const playerMoveSpeed = 8.0 * deltaTime; // Units per second
        
        // Horizontal movement (left/right on screen = X axis in world)
        if (inputKeys.RightIsPressed()) {
            player.position.z += playerMoveSpeed;
        } else if (inputKeys.LeftIsPressed()) {
            player.position.z -= playerMoveSpeed;
        }
        
        // Vertical movement (up/down on screen = Z axis in world, but inverted)
        if (inputKeys.UpIsPressed()) {
            player.position.y += playerMoveSpeed; // Move toward -Z (up on screen)
        } else if (inputKeys.DownIsPressed()) {
            player.position.y -= playerMoveSpeed; // Move toward +Z (down on screen)
        }

        // Keep player within camera view bounds
        const cameraWorldPos = camera.position;
        
        // Calculate world bounds relative to camera position
        const leftBound = cameraWorldPos.x + this.playerBounds.left;
        const rightBound = cameraWorldPos.x + this.playerBounds.right;
        const topBound = cameraWorldPos.y + this.playerBounds.top; // Remember Z is inverted for screen up/down
        const bottomBound = cameraWorldPos.y + this.playerBounds.bottom;
        
        // Clamp player position within bounds
        player.position.x = Math.max(leftBound, Math.min(rightBound, player.position.x));
        player.position.y = Math.max(bottomBound, Math.min(topBound, player.position.y));
    }
}