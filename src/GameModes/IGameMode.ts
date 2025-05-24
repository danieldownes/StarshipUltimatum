import * as THREE from 'three';
import Player from '../Player.ts';
import InputKeys from '../InputKeys.ts';

export interface IGameMode {
    modeName: string;

    enter(scene: THREE.Scene, player: Player, camera: THREE.Object3D): void;
    exit(player: Player, camera: THREE.Object3D): void;
    update(player: Player, camera: THREE.Object3D, inputKeys: InputKeys, deltaTime: number): void;
}