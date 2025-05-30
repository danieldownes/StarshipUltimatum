import * as THREE from 'three';
import {
	Object3D,
	Group,
	Vector3,
	Box3
} from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

import Bullet from './Bullet.ts'

export default class BulletFactory extends Group {

	public bullets: Bullet[] = []
	private material?: MTLLoader.MaterialCreator

	private readonly objLoader = new OBJLoader()
	private readonly mtlLoader = new MTLLoader()

	public async Init() {
		//this.material = await this.mtlLoader.loadAsync('assets/cannonBall.mtl')
		//this.material.preload()
	}

	async Spawn(origin: Object3D, direction: Vector3, velocity: number, shooterTag: string) {
		if (this.material) {
			this.objLoader.setMaterials(this.material)
		}

		const bulletModel = await this.objLoader.loadAsync('assets/cannonBall.obj')

		bulletModel.scale.set(0.1, 0.1, 1)
		origin.getWorldDirection(direction)

		const aabb = new Box3().setFromObject(origin)
		const size = aabb.getSize(new Vector3())

		const originWorldPosition = new Vector3();
		origin.getWorldPosition(originWorldPosition);

		const originWorldQuaternion = new THREE.Quaternion();
		origin.getWorldQuaternion(originWorldQuaternion);

		const bulletSpawnOffset = direction.clone().multiplyScalar(size.z * 0.5);
		bulletSpawnOffset.y += 0.06; // Adjust for vertical offset

		bulletModel.position.copy(originWorldPosition).add(bulletSpawnOffset);

		// Rotate children to match direction
		bulletModel.children.forEach(child => child.rotateX(Math.PI * -0.5));
		bulletModel.quaternion.copy(originWorldQuaternion);

		this.add(bulletModel)

		const b = new Bullet(this, bulletModel, shooterTag)
		direction.multiplyScalar(velocity)
		b.setVelocity(
			direction.x,
			direction.y,
			direction.z
		)

		this.bullets.push(b)
	}

	public Update(deltaTime: number) {
		for (let i = 0; i < this.bullets.length; ++i) {
			const b = this.bullets[i]
			b.update(deltaTime)
		}
	}

	public Remove(b: Bullet) {
		b.CancelTimeout()
		this.remove(b.group)
		this.bullets.splice(this.bullets.indexOf(b), 1)
	}

}