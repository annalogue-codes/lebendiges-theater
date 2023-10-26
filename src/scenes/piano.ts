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

import Phaser from "phaser"
// import _ from 'lodash'
import { game, SCENES, IMAGES, AMBIENCE, SOUNDS } from "../constants"
import * as Cat from "../sprites/cat"
import { debug } from "../helpers/general"
import * as Ph from "../helpers/special"

/* Main part */

export default class Piano extends Phaser.Scene {
	constructor() {
		super(SCENES.PIANO)
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		// Ambience
		this.add
			.rectangle(0, 0, game.width, game.height, 0x66ff66)
			.setOrigin(0, 0)
		// Ph.addAmbience({ scene: this, key: AMBIENCE.JAZZY, volume: 0.05, fadeIn: 3000 })

		// Objects
		const c3 = this.add.rectangle((0 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const d3 = this.add.rectangle((1 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const e3 = this.add.rectangle((2 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const f3 = this.add.rectangle((3 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const g3 = this.add.rectangle((4 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const a3 = this.add.rectangle((5 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const b3 = this.add.rectangle((6 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const c4 = this.add.rectangle((7 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const d4 = this.add.rectangle((8 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const e4 = this.add.rectangle((9 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const f4 = this.add.rectangle((10 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const g4 = this.add.rectangle((11 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const a4 = this.add.rectangle((12 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const b4 = this.add.rectangle((13 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const c5 = this.add.rectangle((14 / 15) * game.width, 0 * game.height, (1 / 15) * game.width, 1 * game.height).setOrigin(0, 0)
		const keys = [c3, d3, e3, f3, g3, a3, b3, c4, d4, e4, f4, g4, a4, b4, c5]
		keys.forEach( key => key
			.setOrigin(0, 0)
			.setFillStyle(0x553366)
			.setStrokeStyle((1 / 150) * game.width)
			.setInteractive()
		)

		c3.on(Phaser.Input.Events.POINTER_OVER, () => {
			this.sound.get(SOUNDS.GALLOP).play()
		})

		// this.add.image( 0.3 * game.width, 0.6 * game.height, IMAGES.ATZEBOW )
		// 	.setOrigin( 0, 0 )
		// 	.setDepth( 5 )

		// Exit
		// const entranceExit = this.add.rectangle( 0, 0.4 * game.height, 0.2 * game.width, 1 * game.height, 0x553366 )
		// 	.setOrigin( 0, 0 )
		// 	.setDepth( 11 )
		// 	.setInteractive()
		// entranceExit.alpha = debug ? 0.5 : 0.001
		// Ph.addExit({ scene: this,
		// 	exit: entranceExit,
		// 	nextScene: SCENES.ENTRANCE,
		// 	soundsToKeep: [
		// 		this.sound.get( AMBIENCE.CITYRAIN )
		// 	],
		// })

		// Debug
		console.log(`${this.scene.key} created.`)
	}

	// update() {
	// }
}
