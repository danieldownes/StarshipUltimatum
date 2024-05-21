import {
	Object3D,
	Group,
	Vector3
} from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

import Bullet from './Bullet.ts'

export default class BulletFactory extends Object3D
{
	private bullets: Bullet[] = []
	private bulletMtl?: MTLLoader.MaterialCreator

	public readonly group: Group


	public async Init()
	{
		this.bulletMtl = await this.mtlLoader.loadAsync('assets/cannonBall.mtl')
		this.bulletMtl.preload()
	}
	

	/*
	private async createBullet()
	{
		if (this.bulletMtl)
		{
			this.objLoader.setMaterials(this.bulletMtl)
		}

		const bulletModel = await this.objLoader.loadAsync('assets/cannonBall.obj')

		this.camera.getWorldDirection(this.directionVector)

		const aabb = new THREE.Box3().setFromObject(this.player)
		const size = aabb.getSize(new THREE.Vector3())

		const vec = this.player.position.clone()
		vec.y += 0.06

		bulletModel.position.add(
			vec.add(
				this.directionVector.clone().multiplyScalar(size.z * 0.5)
			)
		)

		// rotate children to match gun for simplicity
		bulletModel.children.forEach(child => child.rotateX(Math.PI * -0.5))

		// use the same rotation as as the gun
		bulletModel.rotation.copy(this.player.rotation)

		this.add(bulletModel)

		const b = new Bullet(bulletModel)
		b.setVelocity(
			this.directionVector.x * 0.2,
			this.directionVector.y * 0.2,
			this.directionVector.z * 0.2
		)

		this.bullets.push(b)
	}

	private updateBullets()
	{
		for (let i = 0; i < this.bullets.length; ++i)
		{
			const b = this.bullets[i]
			b.update()

			if (b.shouldRemove)
			{
				this.remove(b.group)
				this.bullets.splice(i, 1)
				i--
			}
			else
			{
				for (let j = 0; j < this.targets.length; ++j)
				{
					const target = this.targets[j]
					if (target.position.distanceToSquared(b.group.position) < 0.05)
					{
						this.remove(b.group)
						this.bullets.splice(i, 1)
						i--

						target.visible = false
						setTimeout(() => {
							target.visible = true
						}, 1000)
					}
				}
			}
		}
	}
	*/
}