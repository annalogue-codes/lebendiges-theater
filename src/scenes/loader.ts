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

import { debug, log, onMobileDevice } from '../helpers/general'
import { addBackground, exitTo } from '../helpers/special'
import { game, setState, initialGameState, SCENES, PREVIOUSSCENES, IMAGES, getState } from '../constants'


export default class Loader extends Phaser.Scene {

	constructor() {
		super(SCENES.LOADER)
	}

	// init() {
	// }

	preload() {
		this.load.setBaseURL('./')

		// Grid
		// load svg as bitmap: see https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Loader.LoaderPlugin-svg
		if (debug) this.load.svg('grid', 'images/grid_16x9.svg', { width: game.width, height: game.height } )
	}

	create() {
		if (debug) addBackground( this, 'grid' )

		const resetButton = this.add.rectangle( game.width - 0.05 * game.height, 0, 0.05 * game.height, 0.05 * game.height, 0x553366)
			.setOrigin( 0, 0 )
			.setInteractive()
		resetButton.alpha = debug ? 0.5 : 0.001
		resetButton.on( Phaser.Input.Events.POINTER_UP, () => {
			log(`reset: ${getState().currentScene}`)
			const currentScene = this.scene.get( getState().currentScene )
			log(`reset current:`)
			log( currentScene )
			exitTo({ scene: this.scene.get( getState().currentScene ), nextScene: SCENES.FASSADE })
			setState( initialGameState )
		})

		this.scene.bringToTop( SCENES.SNOOZE )
		this.scene.bringToTop( SCENES.LOADER )

		this.sound.pauseOnBlur = false

		if ( !debug && onMobileDevice() ) {
			setFullscreenTrigger( this )
		}
		if (!debug) {
			handleFocus( this )
		}

		setCursor( this )

		this.registry.set({
			greetedMargery: false,
			wentToCozyRoom: false,
			// ...
		})

		this.scene.run( SCENES.START )
	}

	// update() {
	// }
}

const handleFocus = (scene: Phaser.Scene) => {
	// Handle loosing focus properly on IOS.
	// See: https://blog.ourcade.co/posts/2020/phaser-3-web-audio-best-practices-games/
	scene.sound.pauseOnBlur = false
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

const handleLoseFocus = (scene: Phaser.Scene) => {
	if (scene.scene.isActive(SCENES.SNOOZE)) {
		return
	}

	scene.sound.mute = true

	const currentScenes = scene.game.scene.getScenes()
	scene.registry.set( PREVIOUSSCENES, currentScenes )
	currentScenes.forEach( (s: Phaser.Scene) => scene.scene.pause(s) )

	scene.scene.run(SCENES.SNOOZE)
}

const handleGainFocus = (scene: Phaser.Scene) => {
	scene.scene.stop(SCENES.SNOOZE)

	const previousScenes = scene.registry.get( PREVIOUSSCENES )
	previousScenes?.forEach( (s: Phaser.Scene) => scene.scene.resume(s) )

	scene.sound.mute = false
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

const setCursor = ( scene: Phaser.Scene ) => {
	if ( onMobileDevice() ) return

	scene.input.setDefaultCursor('url( "cursors/emptyDot.png" ), none')

	scene.load.image( IMAGES.CURSOR, 'cursors/glowCircle_small.png')
	scene.load.start()
	let cursor: Phaser.GameObjects.Image
	scene.load.on( Phaser.Loader.Events.COMPLETE, () => {
		cursor = scene.add.image( game.width - 0.2 * game.height, 0.8 * game.height, IMAGES.CURSOR )
		cursor.setScale(0.6)
		cursor.tint = 0xfffff0
	})

	scene.input.on( Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
		scene.tweens.add({
			targets: cursor,
			x: pointer.x,
			y: pointer.y,
			duration: 100,
			ease: 'Sine.easeOut',
		})
	})
}

