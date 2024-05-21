import {
	Object3D,
	Group,
	Vector3,
	Box3,
	MeshBasicMaterial
} from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

import Bullet from './Bullet.ts'

export default class BulletFactory extends Object3D
{
	private bullets: Bullet[] = []
	private material?: MTLLoader.MaterialCreator

	private group: Group | undefined

	private readonly objLoader = new OBJLoader()
	private readonly mtlLoader = new MTLLoader()


	public async Init()
	{
		this.material = await this.mtlLoader.loadAsync('assets/cannonBall.mtl')
		this.material.preload()
	}
	
	async Spawn(player: Object3D, direction: Vector3)
	{
		if (this.material)
		{
			this.objLoader.setMaterials(this.material)
		}

		const bulletModel = await this.objLoader.loadAsync('assets/cannonBall.obj')

		bulletModel.scale.set(0.1, 0.1, 1)
		player.getWorldDirection(direction)

		const aabb = new Box3().setFromObject(player)
		const size = aabb.getSize(new Vector3())

		const vec = player.position.clone()
		vec.y += 0.06

		bulletModel.position.add(
			vec.add(
				direction.clone().multiplyScalar(size.z * 0.5)
			)
		)

		// rotate children to match gun for simplicity
		bulletModel.children.forEach(child => child.rotateX(Math.PI * -0.5))

		// use the same rotation as as the gun
		bulletModel.rotation.copy(player.rotation)

		this.add(bulletModel)

		const b = new Bullet(bulletModel)
		b.setVelocity(
			direction.x * 0.2,
			direction.y * 0.2,
			direction.z * 0.2
		)

		this.bullets.push(b)
	}

	public Update()
	{
		for (let i = 0; i < this.bullets.length; ++i)
		{
			const b = this.bullets[i]
			b.update()
			/*
			if (b.shouldRemove)
			{
				this.remove(b.group)
				this.bullets.splice(i, 1)
				i--
			}
			else
			{
				for (let j = 0; j < this.bullets.length; ++j)
				{
					const bullet = this.bullets[j]
					if (bullet.group.position.distanceToSquared(b.group.position) < 0.05)
					{
						this.remove(b.group)
						this.bullets.splice(i, 1)
						i--

						bullet.group.visible = false
						setTimeout(() => {
							bullet.group.visible = true
						}, 1000)
					}
				}
			}
			*/
		}
	}
	
}