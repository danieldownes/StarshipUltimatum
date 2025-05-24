import {
	Group,
	Vector3
} from 'three'
import BulletFactory from './BulletFactory'

export default class Bullet {
	private readonly factory: BulletFactory
	public readonly group: Group
	private readonly velocity = new Vector3()
	private timeoutId: number | null = null;
	public shooterTag: string;

	constructor(factory: BulletFactory, group: Group, shooterTag: string) {
		this.factory = factory
		this.group = group
		this.shooterTag = shooterTag

		this.timeoutId = setTimeout(() => {
			this.timeout();
		}, 1000)
	}

	setVelocity(x: number, y: number, z: number) {
		this.velocity.set(x, y, z)
	}

	update(deltaTime: number) {
		this.group.position.x += this.velocity.x * deltaTime * 60;
		this.group.position.y += this.velocity.y * deltaTime * 60;
		this.group.position.z += this.velocity.z * deltaTime * 60;
	}

	public CancelTimeout() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	private timeout() {
		this.timeoutId = null
		this.factory.Remove(this)
	}

}
