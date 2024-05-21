import * as THREE from 'three'

import InputKeys from './InputKeys.ts'

import Player from './Player.ts'
import BulletFactory from './BulletFactory.ts'
import EnemeyFactory from './EnemeyFactory.ts'
import Starfield from './Starfield.ts'

export default class MainScene extends THREE.Scene
{
	private readonly root: THREE.Object3D
	private readonly camera: THREE.PerspectiveCamera

	private readonly KeyIsDown = new Set<string>()

	private readonly inputKeys: InputKeys

	private player: Player = new Player()
	private enemyFactory: EnemeyFactory = new EnemeyFactory()
	private bulletFactory: BulletFactory = new BulletFactory()

	private starfield: Starfield = new Starfield(this)

	private directionVector = new THREE.Vector3()
	

	constructor(camera: THREE.PerspectiveCamera)
	{
		super()
		this.root = new THREE.Object3D
		this.add(this.root)

		this.camera = camera

		this.inputKeys = new InputKeys()
	}

	async initialize()
	{
		const gridHelper = new THREE.GridHelper(20, 20, 'teal', 'darkgray')
		gridHelper.position.y = -0.01
		this.add(gridHelper)

		const light = new THREE.DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 4, 2)

		this.add(light)


		this.player 
		this.add(this.player)
		await this.player.Init()

		this.enemyFactory = new EnemeyFactory()
		this.add(this.enemyFactory)
		await this.enemyFactory.Init()

		this.bulletFactory = new BulletFactory()
		this.add(this.bulletFactory)
		await this.bulletFactory.Init()


		this.camera.position.y = 7
		this.camera.position.z = -2

		this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI )
		this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1.1)

		this.player.add(this.camera)

		this.inputKeys.OnKeyDown.subscribe((s: string) =>
			{  
				if( s === ' ')
					this.spawnBullet()
			});
		this.inputKeys.OnKeyUp.subscribe((s: string) =>
			{
				console.log("L: " + s)
			});
	}

	spawnBullet()
	{
		console.log("Spawn")
		this.bulletFactory.Spawn(this.player, this.directionVector)
	}


	private updateInput()
	{
		if (!this.player)
		{
			return
		}

		const shiftKey = this.inputKeys.KeyIsDown.has('shift')

		if (!shiftKey)
		{
			if (this.inputKeys.KeyIsDown.has('a') || this.inputKeys.KeyIsDown.has('arrowleft'))
			{
				this.player.rotateY(0.02)
			}
			else if (this.inputKeys.KeyIsDown.has('d') || this.inputKeys.KeyIsDown.has('arrowright'))
			{
				this.player.rotateY(-0.02)
			}
		}

		const dir = this.directionVector

		this.player.getWorldDirection(dir)

		const speed = 0.1

		if (this.inputKeys.KeyIsDown.has('w') || this.inputKeys.KeyIsDown.has('arrowup'))
		{
			this.player.position.add(dir.clone().multiplyScalar(speed))
		}
		else if (this.inputKeys.KeyIsDown.has('s') || this.inputKeys.KeyIsDown.has('arrowdown'))
		{
			this.player.position.add(dir.clone().multiplyScalar(-speed))
		}

		if (shiftKey)
		{
			const strafeDir = dir.clone()
			const upVector = new THREE.Vector3(0, 1, 0)

			if (this.KeyIsDown.has('a') || this.KeyIsDown.has('arrowleft'))
			{
				this.player.position.add(
					strafeDir.applyAxisAngle(upVector, Math.PI * 0.5)
						.multiplyScalar(speed)
				)
			}
			else if (this.KeyIsDown.has('d') || this.KeyIsDown.has('arrowright'))
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
		if( this.bulletFactory)
			this.bulletFactory.Update()

		this.starfield.Update(this.player, 1)
	}
}