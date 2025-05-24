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
		this.updateInput()
	}

	public IncreaseScore(amount: number) {
		this.score += amount;
		this.OnScoreChanged.emit(this.score);
	}

	private updateInput() {
		//const shiftKey = this.inputKeys.KeyIsDown.has('shift')

		if (this.inputKeys.KeyIsDown.has('a') || this.inputKeys.KeyIsDown.has('arrowleft')) {
			this.rotation.y += 0.02
		}
		else if (this.inputKeys.KeyIsDown.has('d') || this.inputKeys.KeyIsDown.has('arrowright')) {
			this.rotation.y -= 0.02
		}

		const dir = this.Direction
		this.getWorldDirection(dir)

		const speed = 0.1

		this.Velocity.multiplyScalar(0);

		if (this.inputKeys.KeyIsDown.has('w') || this.inputKeys.KeyIsDown.has('arrowup')) {
			this.Velocity.add(dir.clone().multiplyScalar(speed))
		}
		else if (this.inputKeys.KeyIsDown.has('s') || this.inputKeys.KeyIsDown.has('arrowdown')) {
			this.Velocity.add(dir.clone().multiplyScalar(-speed))
		}

		this.position.add(this.Velocity)

		// Strif
		/*
		if (shiftKey) {
			const strafeDir = dir.clone()
			const upVector = new Vector3(0, 1, 0)

			if (this.inputKeys.KeyIsDown.has('a') || this.inputKeys.KeyIsDown.has('arrowleft')) {
				this.position.add(
					strafeDir.applyAxisAngle(upVector, Math.PI * 0.5)
						.multiplyScalar(speed)
				)
			}
			else if (this.inputKeys.KeyIsDown.has('d') || this.inputKeys.KeyIsDown.has('arrowright')) {
				this.position.add(
					strafeDir.applyAxisAngle(upVector, Math.PI * -0.5)
						.multiplyScalar(speed)
				)
			}
		}
		*/
	}

}

