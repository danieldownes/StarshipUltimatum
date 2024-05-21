import * as THREE from 'three'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'

const width = window.innerWidth
const height = window.innerHeight

const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)

const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)

const scene = new THREE.Scene()
const geo = new THREE.BoxGeometry()
const mat = new THREE.MeshPhongMaterial({ color: 0xFFAA00 })

const cube = new THREE.Mesh(geo, mat)

cube.position.set(0, 1, -4)
cube.setRotationFromEuler(new THREE.Euler(45, 45, 45))

scene.add(cube)

const light = new THREE.DirectionalLight(0xFFFFFF, 1)
light.position.set(0, 4, 2)
scene.add(light)


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