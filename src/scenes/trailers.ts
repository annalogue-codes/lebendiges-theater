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

import { game, w, h, s } from '../constants'
import { debug, log, onMobileDevice } from '../utils/general'
import * as Up from '../utils/phaser'

/* Main part */

// const lofiVolume = 0.4

const videoWidth = onMobileDevice() ? 426 : 640
const videoHeight = onMobileDevice() ? 240 : 360
const videoScale = onMobileDevice() ? 0.95 : 1.2


export default class Trailers extends Phaser.Scene {

	constructor() {
		super( game.scenes.TRAILERS )
	}

	// init() {
	// }

	preload() {
	}

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Up.loadAssets({ game: game, scene: this })
	}

	// update() {//
	// }
}

function go ( scene: Phaser.Scene ): void {
	//Ambience
	scene.add.rectangle( 0, 0, w, h, 0xccaa99).setOrigin( 0 ).setDepth( 0 )
	Up.addBackground({ game: game, scene: scene, key: game.images.TRAILERS.BACKGROUND.key }).setDepth( 20 )

	// Sounds
	// const switchDouble = Up.audio.add({ scene: scene, sound: game.sounds.BACKSTAGE.SWITCHDOUBLE })
	// const switchLarge  = Up.audio.add({ scene: scene, sound: game.sounds.BACKSTAGE.SWITCHLARGE  })
	// const switchSmall  = Up.audio.add({ scene: scene, sound: game.sounds.BACKSTAGE.SWITCHSMALL  })

	// Objects
	// const button1a = scene.add.image( 50 * s, 440 * s, game.images.TRAILERS.BUTTON1A)
	// const button1b = scene.add.image( 50 * s, 440 * s, game.images.TRAILERS.BUTTON1B)
	// const button2a = scene.add.image( 150 * s, 440 * s, game.images.TRAILERS.BUTTON2A)
	// const button2b = scene.add.image( 150 * s, 440 * s, game.images.TRAILERS.BUTTON2B)
	// const button3a = scene.add.image( 250 * s, 440 * s, game.images.TRAILERS.BUTTON3A)
	// const button3b = scene.add.image( 250 * s, 440 * s, game.images.TRAILERS.BUTTON3B)

	const scale = 1.12
	const embeddedYoutube = `
<style>
	.container {
		opacity: 1;
	}
	.container.fade-out {
		opacity: 0 !important;
		transition: opacity 1s linear;
	}
</style>
<iframe id="atzeYoutube" width="${scale * 560 * s}" height="${scale * 315 * s}" src="https://www.youtube.com/embed/videoseries?si=zevT2VQLMsEx-fSC&amp;list=PLySC_LwdfWwETeMuTrM6rr0iTKeaU-Pzi&amp;autoplay=1&amp;mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position: absolute; left: ${83 * s}px; top: ${42 * s}px"></iframe>
<div class="exit" style="position: absolute; z-index: 10; left: 0; top: 0; width: ${60 * s}px; height: ${h}px; background: transparent;"></div>
<div class="exit" style="position: absolute; z-index: 10; right: 0; top: 0; width: ${60 * s}px; height: ${h}px; background: transparent;"></div>
<img src="./trailers/${w}x${h}/flatscreen.png" style="position: relative; z-index: 5; width: ${800 * s}px; height: ${450 * s}px; margin: 0; padding: 0; inset: 0; pointer-events: none; cursor: initial;">
	`
	const domElem = scene.add.dom( 0, 0, 'div', `background-color: #432; overflow: hidden;`).setClassName('container').setOrigin(0).setHTML( embeddedYoutube )
	scene.input.setDefaultCursor('initial')


	const container = document.querySelector('.container')
	const exits = [ ...document.querySelectorAll('.exit') ]
	exits.forEach( exit => {
		exit.addEventListener( 'click', () => {
			container?.classList.add('fade-out')
			Up.exitTo({
				game: game,
				scene: scene,
				nextScene: game.scenes.FOYER,
			})
		})
	})


	// Exits
	const foyer = scene.add.rectangle( 0, 0, 100 * s, h, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: foyer,
		nextScene: game.scenes.FOYER,
	})

	log(`${scene.scene.key} created.`)
}

