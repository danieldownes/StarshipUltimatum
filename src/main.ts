import * as THREE from 'three'

const width = window.innerWidth
const height = window.innerHeight

const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)

const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)

//const scene = new BlasterScene(mainCamera)
const scene = new THREE.Scene()

//scene.initialize()

function tick()
{
	//scene.update()
	renderer.render(scene, mainCamera)
	requestAnimationFrame(tick)
}

//init()
tick()

/*
const gridHelper = new GridHelper(20, 20, 'teal', 'darkgray')
    gridHelper.position.y = -0.01
    scene.add(gridHelper)
    */