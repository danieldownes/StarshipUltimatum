import * as THREE from 'three'
import MainScene from './MainScene'

const width = window.innerWidth
const height = window.innerHeight

const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('app') as HTMLCanvasElement,
	antialias: true
})
renderer.setSize(width, height)

const mainCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)

const scene = new MainScene(mainCamera)
scene.initialize()

function tick() {
	scene.update()
	renderer.render(scene, mainCamera)
	requestAnimationFrame(tick)
}

tick()
