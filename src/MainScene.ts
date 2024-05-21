import * as THREE from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

import Player from './Player.ts'
import BulletFactory from './BulletFactory.ts'
import EnemeyFactory from './EnemeyFactory.ts'

export default class MainScene extends THREE.Scene
{
	private readonly mtlLoader = new MTLLoader()

	private readonly root: THREE.Object3D
	private readonly camera: THREE.PerspectiveCamera

	private readonly keyDown = new Set<string>()

	private directionVector = new THREE.Vector3()

	private player: Player
	private enemyFactory: EnemeyFactory

	

	constructor(camera: THREE.PerspectiveCamera)
	{
		super()
		this.root = new THREE.Object3D
		this.add(this.root)

		this.camera = camera
	}

	async initialize()
	{
		const gridHelper = new THREE.GridHelper(20, 20, 'teal', 'darkgray')
		gridHelper.position.y = -0.01
		this.add(gridHelper)

		const light = new THREE.DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 4, 2)

		this.add(light)


		this.player = new Player()
		this.add(this.player)
		await this.player.Init()

		this.enemyFactory = new EnemeyFactory()
		this.add(this.enemyFactory)
		await this.enemyFactory.Init()


		this.camera.position.y = 7
		this.camera.position.z = -2

		this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI )
		this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1.1)

		this.player.add(this.camera)


		document.addEventListener('keydown', this.handleKeyDown)
		document.addEventListener('keyup', this.handleKeyUp)
	}

	private handleKeyDown = (event: KeyboardEvent) => {
		this.keyDown.add(event.key.toLowerCase())
	}

	private handleKeyUp = (event: KeyboardEvent) => {
		this.keyDown.delete(event.key.toLowerCase())

		if (event.key === ' ')
		{
			//this.createBullet()
		}
	}

	private updateInput()
	{
		if (!this.player)
		{
			return
		}

		const shiftKey = this.keyDown.has('shift')

		if (!shiftKey)
		{
			if (this.keyDown.has('a') || this.keyDown.has('arrowleft'))
			{
				this.player.rotateY(0.02)
			}
			else if (this.keyDown.has('d') || this.keyDown.has('arrowright'))
			{
				this.player.rotateY(-0.02)
			}
		}

		const dir = this.directionVector

		this.player.getWorldDirection(dir)

		const speed = 0.1

		if (this.keyDown.has('w') || this.keyDown.has('arrowup'))
		{
			this.player.position.add(dir.clone().multiplyScalar(speed))
		}
		else if (this.keyDown.has('s') || this.keyDown.has('arrowdown'))
		{
			this.player.position.add(dir.clone().multiplyScalar(-speed))
		}

		if (shiftKey)
		{
			const strafeDir = dir.clone()
			const upVector = new THREE.Vector3(0, 1, 0)

			if (this.keyDown.has('a') || this.keyDown.has('arrowleft'))
			{
				this.player.position.add(
					strafeDir.applyAxisAngle(upVector, Math.PI * 0.5)
						.multiplyScalar(speed)
				)
			}
			else if (this.keyDown.has('d') || this.keyDown.has('arrowright'))
			{
				this.player.position.add(
					strafeDir.applyAxisAngle(upVector, Math.PI * -0.5)
						.multiplyScalar(speed)
				)
			}
		}
	}

	update()
	{
		this.updateInput()
		//this.updateBullets()
	}
}