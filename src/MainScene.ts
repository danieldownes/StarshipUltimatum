import * as THREE from 'three';

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
	}

	spawnBullet() {
		const v: number = this.player.Velocity.length() + 0.2;
		console.log("Spawn " + v)

		this.bulletFactory.Spawn(this.player, this.player.Direction, v);
	}

	update() {
		this.player.Update()

		if (this.bulletFactory)
			this.bulletFactory.Update()

		// Enemey collisions
		for (let i = 0; i < this.enemyFactory.EnemeyGroup.length; ++i) {
			const e = this.enemyFactory.EnemeyGroup[i]

			// Hit Player?
			if (MainScene.SpheresOverlap(this.player.position, 0.4, e.position, 0.4)) {
				this.enemyFactory.remove(e)
				this.enemyFactory.EnemeyGroup.splice(i, 1)
				i--
				continue
			}

			// Hit bullet?
			for (let j = 0; j < this.bulletFactory.bullets.length; ++j) {
				const b = this.bulletFactory.bullets[j]

				if (MainScene.SpheresOverlap(b.group.position, 0.4, e.position, 0.4)) {
					console.log("j: " + j);

					this.bulletFactory.Remove(b)
					this.enemyFactory.remove(e)
					this.enemyFactory.EnemeyGroup.splice(i, 1)
					j--
					i--
					continue
				}
			}

			this.starfield.Update(this.player, 1)
		}

	}

	public static SpheresOverlap(p1: THREE.Vector3, r1: number, p2: THREE.Vector3, r2: number): Boolean {
		return p1.distanceTo(p2) - r1 - r2 <= 0
	}


	CheckSphereHit(position: THREE.Vector3, radius: number): Boolean {
		for (let i = 0; i < this.bulletFactory.bullets.length; ++i) {
			const b = this.bulletFactory.bullets[i]

			if (position.distanceTo(this.player.position) > radius)
				return true

			this.remove(b.group)
			//this.bullets.splice(i, 1)
			i--
		}
		return false
	}
}