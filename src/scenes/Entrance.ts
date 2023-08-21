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
import { SCENES } from '../Constants'

// keys
const BACKGROUND = 'background'
const MARGERY = 'margery'
const MARGERYIDLE = 'margeryIdle'
const MARGERYBLINK = 'margeryBlink'
const AMBIENT = 'ambient'
const HALLO = 'hallo'

export default class CozyRoom extends Phaser.Scene {

	constructor() {
		super( SCENES.ENTRANCE )
	}

	init() {//
	}

	preload() {
		this.load.setBaseURL('./')

		// Images
		// load svg as bitmap: see https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Loader.LoaderPlugin-svg
		// this.load.svg('logo',   'logo.svg', { width: windowW, height: windowH } )
		this.load.image(BACKGROUND, 'images/entrance/background.png')
		this.load.spritesheet(MARGERY, 'images/entrance/margery.png', {
			frameWidth: 120,
			frameHeight: 130,
		})

		// Audio
		this.load.audio(AMBIENT, ["music/entrance/ambient.ogg"]);
		this.load.audio(HALLO, ["sounds/entrance/hallo.wav"]);
	}

	create() {
		// store the width and height of the game screen
		const width = this.scale.width
		const height = this.scale.height


		// Visuals
		const background = this.add.image(width / 2, height / 2, BACKGROUND)
			.setSize(       width, height)
			.setDisplaySize(width, height)

		const margery = createMargery(this)

		// Sound
		this.sound.add(AMBIENT, {
			volume: 0.5,
			loop: true
		})
		this.sound.play(AMBIENT)

		this.sound.add(HALLO, { loop: false })

		// Input
		// handleInput(scene)
	}

	update() {
		// this.updatePlayer()
	}
}

const createMargery = (cozyroom: Phaser.Scene) => {

	const margery = cozyroom.physics.add.sprite(100, 450, MARGERY, 2)
		.setScale(1)

	cozyroom.anims.create({
		key: MARGERYIDLE,
		// frames: [ { key: MARGERY, frame: 0 } ],
		frames: cozyroom.anims.generateFrameNumbers( MARGERY, { start: 0, end: 3 } ),
		frameRate: 10,
		repeat: 4,
	});
	cozyroom.anims.create({
		key: MARGERYBLINK,
		frames: cozyroom.anims.generateFrameNumbers( MARGERY, { start: 4, end: 9 } ),
		frameRate: 10,
		// repeat: -1,
	})

	margery.on('animationcomplete' + MARGERYIDLE, () => {
		const rnd = Phaser.Math.Between(1, 2)
		margery.anims.play( { key: MARGERYBLINK, repeat: rnd })
	})
	margery.on('animationcomplete' + MARGERYBLINK, () => {
		const rnd = Phaser.Math.Between(6, 12)
		margery.anims.play( { key: MARGERYIDLE, repeat: rnd })
	})

	margery.anims.play(MARGERYIDLE)

	// Interactivity
	margery.setInteractive()
	margery.on('pointerover', () => {
		cozyroom.sound.play(HALLO)
	})

	return margery
}

