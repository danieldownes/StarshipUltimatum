import * as THREE from 'three'
import MainScene from './MainScene'
import { UiController } from './Ui/UiController.ts'
import PlayerUiInteractor from './Ui/PlayerUiInteractor.ts'

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

const ui = new UiController(width, height)
const playerUiInteractor = new PlayerUiInteractor(scene.player, ui);

function tick() {
	scene.update()
	renderer.clear();
	renderer.render(scene, mainCamera)
	ui.render(renderer)
	requestAnimationFrame(tick)
}

tick()


// Handle window resizing
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
	const newWidth = window.innerWidth
	const newHeight = window.innerHeight

	mainCamera.aspect = newWidth / newHeight
	mainCamera.updateProjectionMatrix()

	renderer.setSize(newWidth, newHeight)

	ui.resize(newWidth, newHeight)  // Resize UI
}