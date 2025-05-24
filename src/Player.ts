import * as THREE from 'three';
import {
	Object3D,
	Vector3
} from 'three'

import InputKeys from './InputKeys.ts'
import { EventEmitter } from './EventEmitter.ts'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

export default class Player extends Object3D {
	private inputKeys: InputKeys
	private score: number = 0;
	public readonly OnScoreChanged = new EventEmitter<number>();

	public get Speed() {
		return this.Velocity.length();
	}
	public Velocity = new Vector3()
	public Direction = new Vector3()

	private readonly objLoader = new OBJLoader()
	private readonly mtlLoader = new MTLLoader()

	constructor(inputKeys: InputKeys) {
		super()
		this.inputKeys = inputKeys
	}

	public async Init() {
		const mtl = await this.mtlLoader.loadAsync('assets/ship.mtl')
		mtl.preload()

		this.objLoader.setMaterials(mtl)

		const modelRoot = await this.objLoader.loadAsync('assets/ship.obj')
		this.add(modelRoot)

		return modelRoot
	}

	Update() {
		// Player update logic is now handled by the active GameMode
	}

	public IncreaseScore(amount: number) {
		this.score += amount;
		this.OnScoreChanged.emit(this.score);
	}

	public applyMovement(velocity: THREE.Vector3) {
		this.position.add(velocity);
	}

	public applyRotationY(angle: number) {
		this.rotation.y += angle;
	}

	public setRotation(x: number, y: number, z: number) {
		this.rotation.set(x, y, z);
	}

	public getWorldDirection(target: THREE.Vector3): THREE.Vector3 {
		return super.getWorldDirection(target);
	}

}

