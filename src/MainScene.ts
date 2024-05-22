import * as THREE from 'three'

import InputKeys from './InputKeys.ts'

import Player from './Player.ts'
import BulletFactory from './BulletFactory.ts'
import EnemeyFactory from './EnemeyFactory.ts'
import Starfield from './Starfield.ts'

export default class MainScene extends THREE.Scene {
	private readonly root: THREE.Object3D
	private readonly camera: THREE.PerspectiveCamera

	private readonly inputKeys: InputKeys

	private readonly player: Player
	private readonly enemyFactory: EnemeyFactory
	private readonly bulletFactory: BulletFactory

	private starfield: Starfield = new Starfield(this)

	constructor(camera: THREE.PerspectiveCamera) {
		super()
		this.root = new THREE.Object3D
		this.add(this.root)

		this.camera = camera

		this.inputKeys = new InputKeys()
		this.player = new Player(this.inputKeys)
		this.bulletFactory = new BulletFactory()
		this.enemyFactory = new EnemeyFactory()
	}

	async initialize() {
		const gridHelper = new THREE.GridHelper(20, 20, 'teal', 'darkgray')
		gridHelper.position.y = -0.01
		this.add(gridHelper)

		const light = new THREE.DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 4, 2)
		this.add(light)

		this.add(this.player)
		await this.player.Init()

		this.add(this.enemyFactory)
		await this.enemyFactory.Init()

		this.add(this.bulletFactory)
		await this.bulletFactory.Init()

		this.camera.position.y = 7
		this.camera.position.z = -2
		this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI)
		this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1.1)
		this.player.add(this.camera)

		this.inputKeys.OnKeyDown.subscribe((s: string) => {
			if (s === ' ')
				this.spawnBullet()
		});
		this.inputKeys.OnKeyUp.subscribe((s: string) => {
			//console.log("L: " + s)
		});
	}

	spawnBullet() {
		console.log("Spawn")
		this.bulletFactory.Spawn(this.player, this.player.Direction.addScaledVector(this.player.vel))
	}

	update() {
		this.player.Update()
		if (this.bulletFactory)
			this.bulletFactory.Update()

		this.starfield.Update(this.player, 1)
	}
}