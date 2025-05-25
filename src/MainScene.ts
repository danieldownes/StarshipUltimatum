import * as THREE from 'three';

import InputKeys from './InputKeys.ts'

import Player from './Player.ts'
import BulletFactory from './BulletFactory.ts'
import EnemeyFactory from './EnemeyFactory.ts'
import Starfield from './Starfield.ts'

import { IGameMode } from './GameModes/IGameMode.ts';
import { OverheadMode } from './GameModes/OverheadMode.ts';
import { SideScrollerMode } from './GameModes/SideScrollerMode.ts';
import { PanScrollerMode } from './GameModes/PanScrollerMode.ts';

export default class MainScene extends THREE.Scene {
	private readonly root: THREE.Object3D
	private readonly camera: THREE.Object3D

	private readonly inputKeys: InputKeys

	public readonly player: Player
	private readonly enemyFactory: EnemeyFactory
	private readonly bulletFactory: BulletFactory

	private starfield: Starfield = new Starfield(this)

	private currentMode: IGameMode;
	private availableModes: Map<string, IGameMode>;

	constructor(camera: THREE.PerspectiveCamera) {
		super()
		this.root = new THREE.Object3D
		this.add(this.root)

		this.camera = new THREE.Object3D
		this.camera.add(camera)

		this.inputKeys = new InputKeys()
		this.player = new Player(this.inputKeys)
		this.bulletFactory = new BulletFactory()
		this.enemyFactory = new EnemeyFactory()

		this.availableModes = new Map<string, IGameMode>();
        this.availableModes.set('overhead', new OverheadMode());
        this.availableModes.set('sideScroller', new SideScrollerMode());
        this.availableModes.set('panScroller', new PanScrollerMode());

        // Set initial mode
        this.currentMode = this.availableModes.get('sideScroller')!;
	}

	async initialize() {
		const gridHelper = new THREE.GridHelper(20, 20, 'teal', 'darkgray')
		gridHelper.position.y = -0.01
		this.add(gridHelper)

		const light = new THREE.DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 4, 2)
		this.add(light)

		await this.player.Init()

		this.add(this.enemyFactory)
		await this.enemyFactory.Init()

		this.add(this.bulletFactory)
		await this.bulletFactory.Init()

		this.add(this.camera)

		// Initialize camera and player for the current mode
		this.currentMode.enter(this, this.player, this.camera);

		this.inputKeys.OnKeyDown.subscribe((s: string) => {
			if (s === ' ')
				this.spawnBullet()
		});
	}

	spawnBullet() {
		const v: number = this.player.Velocity.length() + 0.2;
		console.log("Spawn " + v)

		this.bulletFactory.Spawn(this.player, this.player.Direction, v, "player");
	}

	update(deltaTime: number) {
		// Delegate update to the current game mode
		this.currentMode.update(this.player, this.camera, this.inputKeys, deltaTime);

		this.starfield.Update(this.player, this.player.Speed * 30.2 * deltaTime * 60) // Adjust starfield speed with deltaTime

		if (this.bulletFactory)
			this.bulletFactory.Update(deltaTime)

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

					if (b.shooterTag === "player") {
						this.player.IncreaseScore(10); // Increase score by 10 for hitting an enemy
					}

					this.bulletFactory.Remove(b)
					this.enemyFactory.remove(e)
					this.enemyFactory.EnemeyGroup.splice(i, 1)
					j--
					i--
					continue
				}
			}
		}

	}

	public switchMode(modeName: string) {
        const newMode = this.availableModes.get(modeName);
        if (newMode && newMode !== this.currentMode) {
            this.currentMode.exit(this.player, this.camera);
            this.currentMode = newMode;
            this.currentMode.enter(this, this.player, this.camera);
            console.log(`Switched to mode: ${modeName}`);
        } else {
            console.warn(`Mode '${modeName}' not found or already active.`);
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