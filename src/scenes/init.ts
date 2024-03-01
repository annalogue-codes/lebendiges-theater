// Copyright (C) 2023  Annaluise Blume van Delden <hello@annalogue.codes>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import Phaser from 'phaser'

import { debug, presentation, onMobileDevice } from '../utils/general'
import { setState, addBackground, exitTo, addToCache, loadImageFromCache } from '../utils/phaser'
import { game, getState, addState, h, w, INITIALSCENE } from '../constants'


export default class Init extends Phaser.Scene {

	constructor() {
		super( game.scenes.INIT )
	}

	// init() {
	// }

	// text?: Phaser.GameObjects.Text

	preload() {
		this.load.setBaseURL( './' )

		// Grid
		// load svg as bitmap: see https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Loader.LoaderPlugin-svg
		console.log( `Debug: ${debug}` )
		if ( debug ) this.load.svg( 'grid', 'other/grid_16x9.svg', { width: game.config.width, height: game.config.height } )

		// Add font for "Pause" text
		const styleElement = document.createElement( 'style' )
		document.head.appendChild( styleElement )
		const sheet = styleElement.sheet
		if ( !sheet ) return

		const troika = "@font-face { font-family: 'TmonMonsori'; src: url('fonts/TmonMonsori.woff') format('woff'); font-weight: normal; font-style: normal; }"
		sheet.insertRule( troika, 0 )
		const noto = `@font-face { font-family: 'Noto Sans Symbols2';
			src: url('NotoSansSymbols2-Regular.eot');
			src: local('Noto Sans Symbols2 Regular'), local('NotoSansSymbols2-Regular'),
				url('fonts/NotoSansSymbols2-Regular.eot?#iefix') format('embedded-opentype'),
				url('fonts/NotoSansSymbols2-Regular.woff2') format('woff2'),
				url('fonts/NotoSansSymbols2-Regular.woff') format('woff'),
				url('fonts/NotoSansSymbols2-Regular.ttf') format('truetype');
			font-weight: normal;
			font-style: normal;
			font-display: swap; }`
		sheet.insertRule( noto, 1 )
	}

	create() {
		if ( debug ) {
			addBackground( { game: game, scene: this, key: 'grid' } )
			// this.text = this.add.text(100, 800, '', { font: '28px monospace' })
		}

		// const resetButton = this.add.rectangle( w - 0.1 * h, 0, 0.1 * h, 0.1 * h, 0x553366 )
		// 	.setOrigin( 0, 0 )
		// 	.setInteractive()
		// resetButton.alpha = debug ? 0.5 : 0.001
		// resetButton.on( Phaser.Input.Events.POINTER_UP, () => {
		// 	const currentScene = getState().currentScene
		// 	setState({ game: game, newState: { ...game.initialState, currentScene: currentScene } })
		// 	exitTo({
		// 		game: game,
		// 		scene: this.scene.get( getState().currentScene ),
		// 		nextScene: INITIALSCENE,
		// 		reset: true
		// 	})
		// })

		this.scene.bringToTop( game.scenes.SNOOZE )
		this.scene.bringToTop( game.scenes.INIT )

		this.sound.pauseOnBlur = false

		if ( onMobileDevice() ) {
			setFullscreenTrigger( this )
		}
		if ( !presentation ) {
			handleFocus( this )
		}

		setCursor( this )

		// this.registry.set({
		// 	greetedMargery: false,
		// 	wentToCozyRoom: false,
		// 	// ...
		// })

		this.scene.run( game.scenes.LOADER )
	}

// 	update() {//
// 		if (debug) {
// 			this.text?.setText(`
// Actual FPS: ${this.game.loop.actualFps}
// 			`)
// 		}
// 	}
}

const handleFocus = (scene: Phaser.Scene) => {
	// Handle loosing focus properly on IOS.
	// See: https://blog.ourcade.co/posts/2020/phaser-3-web-audio-best-practices-games/
	scene.sound.pauseOnBlur = true
	scene.game.events.on(Phaser.Core.Events.BLUR, () => {
		handleLoseFocus(scene)
	})
	scene.game.events.on(Phaser.Core.Events.FOCUS, () => {
		handleGainFocus(scene)
	})
	// // This seems to make more trouble than it helps:
	// document.addEventListener('visibilitychange', () => {
	// 	if (!document.hidden) {
	// 		handleGainFocus(scene)
	// 	} else {
	// 		handleLoseFocus(scene)
	// 	}
	// })
}

const PREVIOUSSCENES = 'previousScenes'

const handleLoseFocus = (scene: Phaser.Scene) => {
	if (scene.scene.isActive(game.scenes.SNOOZE)) {
		return
	}
	addState({ paused: true })

	// scene.sound.mute = true
	// scene.sound.setVolume( 0 )

	const currentScenes = scene.game.scene.getScenes().filter( s => s.scene.key !== game.scenes.INIT )
	scene.registry.set( PREVIOUSSCENES, currentScenes )
	currentScenes.forEach( (s: Phaser.Scene) => scene.scene.pause(s) )

	scene.scene.run(game.scenes.SNOOZE)
}

const handleGainFocus = (scene: Phaser.Scene) => {
	addState({ paused: false })
	scene.scene.stop(game.scenes.SNOOZE)

	const previousScenes = scene.registry.get( PREVIOUSSCENES )
	previousScenes?.forEach( (s: Phaser.Scene) => scene.scene.resume(s) )

	// scene.sound.mute = false
	// scene.sound.setVolume( 1 )
}

const setFullscreenTrigger = ( scene: Phaser.Scene ) => {
	scene.input.on('pointerup', () => {
		// if (scene.scale.isFullscreen) {
		// 	scene.scale.stopFullscreen();
		// } else {
		// 	this.scale.startFullscreen();
		// 	screen.orientation.lock('landscape').catch( () => {
		// 		console.log( 'Orientation locking is not supported.' )
		// 	})
		// }
		if (scene.scale.isFullscreen) return

		scene.scale.startFullscreen()
		screen.orientation.lock('landscape').catch( () => {
			console.log( 'Orientation locking is not supported.' )
		})
	})
}

async function setCursor ( scene: Phaser.Scene ): Promise<void> {
	if ( onMobileDevice() ) return

	scene.input.setDefaultCursor('url( "other/emptyDot.png" ), none')

	// for ( const value of Object.values( game.images.OTHER ) ) {
		// await addToCache({ cache: game.cache, key: value.key })
		// await loadImageFromCache({ cache: game.cache, scene: scene, key: value.key })
	// }
	scene.load.image( game.images.OTHER.CIRCLE.key, `other/${w}x${h}/glowCircle_small.png`)
	scene.load.start()

	scene.load.on( Phaser.Loader.Events.COMPLETE, () => {
		const cursor = scene.add.image( w - 0.2 * h, 0.8 * h, game.images.OTHER.CIRCLE.key )
		cursor.setScale(0.6)
		cursor.tint = 0xfffff0

		scene.input.on( Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
			scene.tweens.add({
				targets: cursor,
				x: pointer.x,
				y: pointer.y,
				duration: 100,
				ease: 'Sine.easeOut',
			})
		})
	})

}

