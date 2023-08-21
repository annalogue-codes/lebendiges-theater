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
import { SCENES, PREVIOUSSCENES } from '../Constants'

export default class Loader extends Phaser.Scene {

	constructor() {
		super(SCENES.LOADER)
	}

	init() {//
	}

	preload() {//
	}

	create() {//
		this.registry.set({
			greetedMargery: false,
			wentToCozyRoom: false,
			// ...
		})

		handleFocus(this)

		// const scene = this
		// this.input.on('pointerup', function() {
		// 	// if (scene.scale.isFullscreen) {
		// 	// 	scene.scale.stopFullscreen();
		// 	// 	// On stop fulll screen
		// 	// } else {
		// 		scene.scale.startFullscreen();
		// 		// On start fulll screen
		// 	// }
		// });
		// screen.orientation.lock('landscape')

		this.scene.run(SCENES.COZYROOM)
	}

	update() {//
	}
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
	document.addEventListener('visibilitychange', () => {
		if (!document.hidden) {
			handleGainFocus(scene)
		} else {
			handleLoseFocus(scene)
		}
	})
}

const handleLoseFocus = (scene: Phaser.Scene) => {
	if (scene.scene.isActive(SCENES.SNOOZE)) {
		return
	}

	scene.sound.mute = true

	const currentScenes = scene.game.scene.getScenes()
	scene.registry.set( PREVIOUSSCENES, currentScenes )
	currentScenes.forEach( (s: Phaser.Scene) => scene.scene.pause(s) )

	scene.scene.launch(SCENES.SNOOZE)
}

const handleGainFocus = (scene: Phaser.Scene) => {
	scene.scene.stop(SCENES.SNOOZE)

	const previousScenes = scene.registry.get( PREVIOUSSCENES )
	previousScenes?.forEach( (s: Phaser.Scene) => scene.scene.resume(s) )

	scene.sound.mute = false
}

