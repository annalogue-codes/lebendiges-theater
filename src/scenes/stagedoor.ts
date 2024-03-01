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
import { debug, log } from '../utils/general'
import * as Up from '../utils/phaser'
import * as Cat from '../sprites/cat'

/* Main part */

// const jazzVolume = 0.1
// const lofiVolume = 0.4

export default class Stagedoor extends Phaser.Scene {

	constructor() {
		super( game.scenes.STAGEDOOR )
	}

	// init() {//
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Up.loadAssets({ game: game, scene: this })
	}

	// update() {//
	// }
}

function go ( scene: Phaser.Scene ): void {
	//Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.STAGEDOOR.BACKGROUND.key })
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPERSISTANT.AMBIENCE.LOFI.key, volume: game.soundsPERSISTANT.AMBIENCE.LOFI.volume })
	// Up.addAmbience({ game: game, scene: scene, key: game.soundsPERSISTANT.AMBIENCE.JAZZ.key, volume: getState().entranceopen ? jazzVolume : 0 })

	// Objects
	const cat = Cat.newCat( scene, 375 * s, 305 * s, 0.8 )
	cat.follower.setDepth( 15 )
	cat.follower.setFlipX( true )
	cat.randomSounds = [
		cat.sounds.meow,
		cat.sounds.meow,
		cat.sounds.meowmeowmeow,
	]
	Cat.playRandomCatSounds({ cat: cat, preDelay: true })
	// motions.jumpFromStairs({ cat: cat })

	// Exits
	const stage = scene.add.rectangle( 325 * s, 140 * s, 200 * s, 205 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: stage,
		nextScene: game.scenes.STAGE,
		// soundsToKeep: [
		// 	game.soundsPERSISTANT.AMBIENCE.CITYRAIN,
		// 	game.soundsPERSISTANT.AMBIENCE.JAZZ,
		// ],
	})
	const stairs = scene.add.rectangle( 625 * s, 30 * s, 175 * s, 420 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: stairs,
		nextScene: game.scenes.HALLWAY,
	})
	const hallway = scene.add.rectangle( 0, 215 * s, 175 * s, 235 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: hallway,
		nextScene: game.scenes.HALLWAY,
	})

	log(`${scene.scene.key} created.`)
}

