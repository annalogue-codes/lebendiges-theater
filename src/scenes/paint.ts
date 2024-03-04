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
import { game, getState, s } from '../constants'
import { debug, log } from '../utils/general'
import * as Up from '../utils/phaser'

/* Main part */

// enum Position {
// 	floorFront = 'floorFront',
// 	barFront = 'barFront',
// 	barEnd = 'barEnd',
// }


export default class Paint extends Phaser.Scene {

	constructor() {
		super( game.scenes.PAINT )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Up.loadAssets({ game: game, scene: this })
	}

	// update() {
	// }
}

function go ( scene: Phaser.Scene ): void {
	// Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.PAINT.BACKGROUND.key })
	// Up.addAmbience({ scene: scene, key: game.soundsPERSISTANT.AMBIENCE.LOFI.key, volume: game.soundsPERSISTANT.AMBIENCE.LOFI.volume * (2/3), fadeIn: 3000 })

	// Objects

	// const atze = scene.add.image( 0.34 * w, 0.64 * h, game.images.FOYER.ATZEBOW ).setOrigin( 0 )
	// atze.setDepth( 5 )

	const paper = scene.add.renderTexture(200 * s, 50 * s, 450 * s, 305 * s).setOrigin( 0 ) as Phaser.GameObjects.RenderTexture
	if ( scene.textures.exists( 'painting' ) ) {
		paper.setTexture( 'painting' )
	} else {
		paper.saveTexture( 'painting' )
	}

	let brush = scene.textures.getFrame( game.images.PAINT.BRUSH2.key )
	let color = 0xFFC740

	const yellow = scene.add.rectangle( 55 * s, 235 * s, 55 * s, 50 * s, 0x993399 )
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	const black = scene.add.rectangle( 87 * s, 287 * s, 52 * s, 50 * s, 0x993399 )
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	const violet = scene.add.rectangle( 255 * s, 387 * s, 75 * s, 60 * s, 0x993399 )
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	const green = scene.add.rectangle( 365 * s, 372 * s, 77 * s, 70 * s, 0x993399 )
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	const white = scene.add.rectangle( 700 * s, 322 * s, 100 * s, 85 * s, 0x993399 )
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	const brush1 = scene.add.rectangle( 15 * s, 135 * s, 75 * s, 87 * s, 0x993399 )
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	const brush2 = scene.add.rectangle( 455 * s, 375 * s, 70 * s, 62 * s, 0x993399 )
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()
	const brush3 = scene.add.rectangle( 712 * s, 200 * s, 75 * s, 112 * s, 0x993399 )
		.setOrigin( 0 )
		.setAlpha( debug ? 0.5 : 0.001 )
		.setInteractive()

	yellow   .off( Phaser.Input.Events.POINTER_UP )
	black    .off( Phaser.Input.Events.POINTER_UP )
	violet   .off( Phaser.Input.Events.POINTER_UP )
	green    .off( Phaser.Input.Events.POINTER_UP )
	white    .off( Phaser.Input.Events.POINTER_UP )
	yellow   .on( Phaser.Input.Events.POINTER_UP, () => { color = 0xFFC740 })
	black    .on( Phaser.Input.Events.POINTER_UP, () => { color = 0x000000 })
	violet   .on( Phaser.Input.Events.POINTER_UP, () => { color = 0x801BA3 })
	green    .on( Phaser.Input.Events.POINTER_UP, () => { color = 0x3BA304 })
	white    .on( Phaser.Input.Events.POINTER_UP, () => { color = 0xFFFFFF })

	brush1.off( Phaser.Input.Events.POINTER_UP )
	brush2.off( Phaser.Input.Events.POINTER_UP )
	brush3.off( Phaser.Input.Events.POINTER_UP )
	brush1.on( Phaser.Input.Events.POINTER_UP, () => { brush = scene.textures.getFrame( game.images.PAINT.BRUSH1.key ) })
	brush2.on( Phaser.Input.Events.POINTER_UP, () => { brush = scene.textures.getFrame( game.images.PAINT.BRUSH2.key ) })
	brush3.on( Phaser.Input.Events.POINTER_UP, () => { brush = scene.textures.getFrame( game.images.PAINT.BRUSH3.key ) })

	scene.input.on('pointermove', ( pointer: Phaser.Input.Pointer ) => {
		if (pointer.isDown) {
			if ( color === 0xFFFFFF ) {
				paper.erase(brush, pointer.x - (200 * s) - (brush.width / 2), pointer.y - (50 * s) - (brush.height / 2) )
			} else {
				paper.draw(brush, pointer.x - (200 * s) - (brush.width / 2), pointer.y - (50 * s) - (brush.height / 2), 1, color )
			}
		}
	})


	const showroom = scene.add.rectangle( 0, 360 * s, 150 * s, 90 * s, 0x553366)
		.setOrigin( 0 )
		.setInteractive()
	showroom.alpha = debug ? 0.5 : 0.001
	Up.addExit({
		game: game,
		scene: scene,
		exit: showroom,
		nextScene: game.scenes.SHOWROOM,
	})

	log(`${scene.scene.key} created.`)
}


