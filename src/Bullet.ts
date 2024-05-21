import {
	Object3D,
	Group,
	Vector3
} from 'three'

export default class Bullet extends Object3D
{
	private readonly velocity = new Vector3()

	private isDead = false

	/*
	constructor(group: Group)
	{
		this.group = group

		setTimeout(() => {
			this.isDead = true
		}, 1000)
	}
*/
	get shouldRemove()
	{
		return this.isDead
	}

	setVelocity(x: number, y: number, z: number)
	{
		this.velocity.set(x, y, z)
	}

	update()
	{
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		this.position.z += this.velocity.z
	}
	
}