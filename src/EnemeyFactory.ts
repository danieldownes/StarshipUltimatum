import {
	Object3D,
	Group,
	Vector3
} from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

export default class EnemeyFactory extends Object3D
{
	private targets: Group[] = []

	private readonly objLoader = new OBJLoader()
	private readonly mtlLoader = new MTLLoader()

	public readonly group: Group
	private readonly velocity = new Vector3()

	private isDead = false


	public async Init()
	{
		const enemyMaterial = await this.mtlLoader.loadAsync('assets/enemy.mtl')
		enemyMaterial.preload()

		const t1 = await this.createEnemy(enemyMaterial)
		t1.position.x = -1
		t1.position.z = -3

		const t2 = await this.createEnemy(enemyMaterial)
		t2.position.x = 1
		t2.position.z = -3

		const t3 = await this.createEnemy(enemyMaterial)
		t3.position.x = 2
		t3.position.z = -3

		const t4 = await this.createEnemy(enemyMaterial)
		t4.position.x = -2
		t4.position.z = -3

		this.add(t1, t2, t3, t4)
		this.targets.push(t1, t2, t3, t4)
	}

	
	private async createEnemy(mtl: MTLLoader.MaterialCreator)
	{
		this.objLoader.setMaterials(mtl)
		
		const modelRoot = await this.objLoader.loadAsync('assets/enemy.obj')

		modelRoot.rotateY(Math.PI * 0.5)
		//modelRoot.scale.setScalar(0.0)

		return modelRoot
	}

    update()
	{
        //this.group.position.x += this.velocity.x
    }
}