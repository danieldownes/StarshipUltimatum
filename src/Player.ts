import {
	Object3D,
	Vector3
} from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

export default class Player extends Object3D
{
	private readonly velocity = new Vector3()

	private readonly objLoader = new OBJLoader()
	private readonly mtlLoader = new MTLLoader()

	public async Init()
	{
		const mtl = await this.mtlLoader.loadAsync('assets/ship.mtl')
		mtl.preload()

		this.objLoader.setMaterials(mtl)

		const modelRoot = await this.objLoader.loadAsync('assets/ship.obj')
		this.add(modelRoot)
		
		return modelRoot
	}

    update()
	{
        //this.group.position.x += this.velocity.x
    }
}