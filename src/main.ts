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

let lastTime = 0;
function tick(time: number) {
    const deltaTime = (time - lastTime) / 1000; // Convert to seconds
    lastTime = time;

	scene.update(deltaTime)
	renderer.clear();
	renderer.render(scene, mainCamera)
	ui.render(renderer)
	requestAnimationFrame(tick)
}

requestAnimationFrame(tick)

// Add key listeners for mode switching
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case '1':
            scene.switchMode('overhead');
            break;
        case '2':
            scene.switchMode('sideScroller');
            break;
        case '3':
            scene.switchMode('panScroller');
            break;
    }
});

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