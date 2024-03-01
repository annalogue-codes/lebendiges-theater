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
import { game, addState, getState, w, h, s } from "../constants"
import { debug, log, onMobileDevice } from "../utils/general"
import * as Up from "../utils/phaser"

/* Main part */

export default class Piano extends Phaser.Scene {
	constructor() {
		super(game.scenes.PIANO)
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
	Up.addBackground({ game: game, scene: scene, key: game.images.PIANO.BACKGROUND.key })
	Up.addBackground({ game: game, scene: scene, key: game.images.PIANO.WHITEKEYS.key })
	// Up.addAmbience({ scene: scene, key: AMBIENCE.JAZZY, volume: 0.05, fadeIn: 3000 })

	// Lines
	const lineG = scene.add.image( 185 * s, 18 * s, game.images.PIANO.LINEG.key ).setOrigin( 0, 0 )
	const lineA = scene.add.image( 267 * s, 18 * s, game.images.PIANO.LINEA.key ).setOrigin( 0, 0 )
	const lineB = scene.add.image( 357 * s, 18 * s, game.images.PIANO.LINEB.key ).setOrigin( 0, 0 )
	const lineC = scene.add.image( 441 * s, 18 * s, game.images.PIANO.LINEC.key ).setOrigin( 0, 0 )
	const lineD = scene.add.image( 529 * s, 18 * s, game.images.PIANO.LINED.key ).setOrigin( 0, 0 )
	const lineE = scene.add.image( 620 * s, 18 * s, game.images.PIANO.LINEE.key ).setOrigin( 0, 0 )
	const lineF = scene.add.image( 711 * s, 18 * s, game.images.PIANO.LINEF.key ).setOrigin( 0, 0 )
	const lines = [ lineG, lineA, lineB, lineC, lineD, lineE, lineF ]

	const wobbleG = scene.add.sprite( 165 * s, (-2 * s), game.sprites.PIANO.LINEWOBBLE.key ).setOrigin(0, 0).setAlpha( 0 )
	const wobbleA = scene.add.sprite( 247 * s, (-2 * s), game.sprites.PIANO.LINEWOBBLE.key ).setOrigin(0, 0).setAlpha( 0 )
	const wobbleB = scene.add.sprite( 337 * s, (-2 * s), game.sprites.PIANO.LINEWOBBLE.key ).setOrigin(0, 0).setAlpha( 0 )
	const wobbleC = scene.add.sprite( 427 * s, (-2 * s), game.sprites.PIANO.LINEWOBBLE.key ).setOrigin(0, 0).setAlpha( 0 )
	const wobbleD = scene.add.sprite( 514 * s, (-2 * s), game.sprites.PIANO.LINEWOBBLE.key ).setOrigin(0, 0).setAlpha( 0 )
	const wobbleE = scene.add.sprite( 605 * s, (-2 * s), game.sprites.PIANO.LINEWOBBLE.key ).setOrigin(0, 0).setAlpha( 0 )
	const wobbleF = scene.add.sprite( 707 * s, (-2 * s), game.sprites.PIANO.LINEWOBBLE.key ).setOrigin(0, 0).setAlpha( 0 ).setAngle( 1.5 )
	const wobbles = [ wobbleG, wobbleA, wobbleB, wobbleC, wobbleD, wobbleE, wobbleF ]

	if ( !scene.anims.exists( 'wobble' ) ) scene.anims.create({
		key: 'wobble',
		frameRate: 7,
		repeat: -1,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( game.sprites.PIANO.LINEWOBBLE.key, {
			start: 0,
			end: 5,
		}),
	})

	// Black keys
	Up.addBackground({ game: game, scene: scene, key: game.images.PIANO.BLACKKEYS.key })

	// Objects
	// const button = scene.add.circle( 90, 200, 60 )
	// button.setInteractive()
	// 	.setFillStyle(0x00AA00)
	// 	.setStrokeStyle( 5)
	// 	.setAlpha(0.7)
	const button = scene.add.image( 8 * s, 50 * s, game.images.PIANO.BUTTON.key ).setOrigin( 0, 0 )
	button.setInteractive()

	const f3 = scene.add.rectangle(  87 * s, 0, 105 * s, 1 * h ).setOrigin(0, 0)
	const g3 = scene.add.rectangle( 192 * s, 0,  81 * s, 1 * h ).setOrigin(0, 0)
	const a3 = scene.add.rectangle( 273 * s, 0,  87 * s, 1 * h ).setOrigin(0, 0)
	const b3 = scene.add.rectangle( 361 * s, 0,  87 * s, 1 * h ).setOrigin(0, 0)
	const c4 = scene.add.rectangle( 448 * s, 0,  88 * s, 1 * h ).setOrigin(0, 0)
	const d4 = scene.add.rectangle( 537 * s, 0,  92 * s, 1 * h ).setOrigin(0, 0)
	const e4 = scene.add.rectangle( 629 * s, 0,  91 * s, 1 * h ).setOrigin(0, 0)
	const f4 = scene.add.rectangle( 721 * s, 0,  88 * s, 1 * h ).setOrigin(0, 0)
	const whitekeys = [ f3, g3, a3, b3, c4, d4, e4, f4 ]

	const fs3 = scene.add.rectangle( 135 * s, 0, 65 * s, 270 * s ).setOrigin(0, 0)
	const gs3 = scene.add.rectangle( 235 * s, 0, 71 * s, 270 * s ).setOrigin(0, 0)
	const as3 = scene.add.rectangle( 337 * s, 0, 67 * s, 270 * s ).setOrigin(0, 0)
	const cs4 = scene.add.rectangle( 495 * s, 0, 72 * s, 270 * s ).setOrigin(0, 0)
	const ds4 = scene.add.rectangle( 602 * s, 0, 70 * s, 270 * s ).setOrigin(0, 0)
	const blackkeys = [ fs3, gs3, as3, cs4, ds4 ]

	const keys = [ f3, fs3, g3, gs3, a3, as3, b3, undefined, c4, cs4, d4, ds4, e4, undefined, f4 ]

	keys.forEach( key => {
		key?.setOrigin(0, 0)
			.setInteractive()
			.setStrokeStyle((1 / 450) * w)
			.setAlpha(0.001)
	})
	if (debug) {
		whitekeys.forEach( key => {
			key.setFillStyle(0x553366)
				.setAlpha(0.5)
		})
		blackkeys.forEach( key => {
			key.setFillStyle(0x331133)
				.setAlpha(0.5)
		})
	}

	const PIANO = game.sounds.PIANO
	const soundsFX = [
		PIANO.APPLAUSE,
		PIANO.BUBBLE,
		PIANO.BOING,
		PIANO.BUBBLES,
		PIANO.CASHREGISTER,
		PIANO.BELLRATTLE,
		PIANO.TELEPHONE,

		undefined,

		PIANO.WINDCHIMES,
		PIANO.HARPGLISSUP,
		PIANO.COMICCOWBELLS,
		PIANO.HARPGLISSDOWN,
		PIANO.SADTROMBONE,

		undefined,

		PIANO.FOOTSTEP,
	]
		// SFX.HELICOPTER,
		// SFX.DOORSLAM,
		// SFX.SWOOP2,
		// SFX.THUNDER,
		// SFX.SWOOP1,
		// SFX.BOTTLEPOP,
		// SFX.HORSEGALLOP,
		// SFX.DOG,
		// SFX.SWOOP3,
		// SFX.PLOP,
		// SFX.TYPEWRITER1,
		// SFX.TYPEWRITER2,

	const soundsPiano = [
		PIANO.F,
		PIANO.FS,
		PIANO.G,
		PIANO.GS,
		PIANO.A,
		PIANO.AS,
		PIANO.B,

		undefined,

		PIANO.C,
		PIANO.CS,
		PIANO.D,
		PIANO.DS,
		PIANO.E,

		undefined,

		PIANO.F2,
	]

	let sounds = soundsFX

	const switchToSFX = (now?: boolean) => {
		addState({ piano: 'sfx' })
		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: now ? 0 : 1000,
			ease: Phaser.Math.Easing.Sine.InOut,
			onUpdate: tween => {
				const value = tween.getValue()
				const colorObject = Phaser.Display.Color.Interpolate.RGBWithRGB(
					0xFF, 0xFF, 0xFF, 0x55, 0x00, 0xFF,
					100,
					value
				)
				// button.fillColor = Phaser.Display.Color.GetColor( colorObject.r, colorObject.g, colorObject.b )
				button.tint = Phaser.Display.Color.GetColor( colorObject.r, colorObject.g, colorObject.b )
			},
		})
		sounds = soundsFX
	}
	const switchToPiano = (now?: boolean) => {
		addState({ piano: 'piano' })
		scene.tweens.addCounter({
			from: 0,
			to: 100,
			duration: now ? 0 : 1000,
			ease: Phaser.Math.Easing.Sine.InOut,
			onUpdate: tween => {
				const value = tween.getValue()
				const colorObject = Phaser.Display.Color.Interpolate.RGBWithRGB(
					0xFF, 0xFF, 0xFF, 0x55, 0x00, 0xFF,
					100,
					value
				)
				// button.fillColor = Phaser.Display.Color.GetColor( colorObject.r, colorObject.g, colorObject.b )
				button.tint = Phaser.Display.Color.GetColor( colorObject.r, colorObject.g, colorObject.b )
			},
		})
		sounds = soundsPiano
	}

	if ( getState().piano === 'piano' ) {
		switchToPiano(true)
	} else {
		switchToSFX(true)
	}

	button.on( Phaser.Input.Events.POINTER_DOWN, () => {
		if ( getState().piano === 'piano' ) {
			switchToSFX()
			return
		}
		switchToPiano()
	})

	const setPianoListeners = (i: number) => {
		if (!onMobileDevice() && !scene.input.activePointer.primaryDown ) return
		scene.sound.get( sounds[i]!.key ).play({ volume: 1 })
		let touchinglines =
			(i === 0) ? [ 0 ] :
			(i === keys.length - 1) ? [ i/2 - 1 ] :
			(i & 1) ? [ Math.floor(i / 2) ] : [ i/2 - 1, i/2 ]
		touchinglines.forEach( (touchingline: number) => {
			lines[touchingline].setAlpha( 0 )
			wobbles[touchingline].setAlpha( 1 )
			wobbles[touchingline].play( 'wobble' )
		})
		scene.sound.get( sounds[i]!.key ).off( Phaser.Sound.Events.COMPLETE )
		scene.sound.get( sounds[i]!.key ).once( Phaser.Sound.Events.COMPLETE, () => {
			touchinglines.forEach( (touchingline: number) => {
				const neighbourPlaying = [2*touchingline, 2*touchingline+1, 2*touchingline+2]
					.map( k => (sounds[k] === undefined) ? false : scene.sound.get( sounds[k]!.key ).isPlaying )
					.some(Boolean)
				if ( !neighbourPlaying ) {
					wobbles[touchingline].stop()
					wobbles[touchingline].setAlpha( 0 )
					lines[touchingline].setAlpha( 1 )
				}
			})
		})
	}

	for (let i = 0; i < keys.length; i++) {
		keys[i]?.on( Phaser.Input.Events.POINTER_OVER, () => setPianoListeners(i) )
		if ( !onMobileDevice() ) {
			keys[i]?.on( Phaser.Input.Events.POINTER_DOWN, () => setPianoListeners(i) )
		}
	}


	// c3 .on(pianoevent, () => { scene.sound.get(SFX.APPLAUSE            ).play() })
	// cs3.on(pianoevent, () => { scene.sound.get(SFX.BUBBLE              ).play() })
	// d3 .on(pianoevent, () => { scene.sound.get(SFX.BOING               ).play() })
	// ds3.on(pianoevent, () => { scene.sound.get(SFX.BUBBLES             ).play() })
	// e3 .on(pianoevent, () => { scene.sound.get(SFX.BOTTLEPOP           ).play() })
	// f3 .on(pianoevent, () => { scene.sound.get(SFX.BELLRATTLE          ).play() })
	// fs3.on(pianoevent, () => { scene.sound.get(SFX.HARPGLISSUP         ).play() })
	// g3 .on(pianoevent, () => { scene.sound.get(SFX.SWOOP1              ).play() })
	// gs3.on(pianoevent, () => { scene.sound.get(SFX.HARPGLISSDOWN       ).play() })
	// a3 .on(pianoevent, () => { scene.sound.get(SFX.SWOOP2              ).play() })
	// as3.on(pianoevent, () => { scene.sound.get(SFX.WINDCHIMES          ).play() })
	// b3 .on(pianoevent, () => { scene.sound.get(SFX.SWOOP3              ).play() })
	// c4 .on(pianoevent, () => { scene.sound.get(SFX.FOOTSTEP            ).play() })
	// cs4.on(pianoevent, () => { scene.sound.get(SFX.HELICOPTER          ).play() })
	// d4 .on(pianoevent, () => { scene.sound.get(SFX.DOORSLAM            ).play() })
	// ds4.on(pianoevent, () => { scene.sound.get(SFX.HORSEGALLOP         ).play() })
	// e4 .on(pianoevent, () => { scene.sound.get(SFX.TELEPHONE           ).play() })
	// f4 .on(pianoevent, () => { scene.sound.get(SFX.CASHREGISTER        ).play() })
	// fs4.on(pianoevent, () => { scene.sound.get(SFX.DOG                 ).play() })
	// g4 .on(pianoevent, () => { scene.sound.get(SFX.SADTROMBONE         ).play() })
	// gs4.on(pianoevent, () => { scene.sound.get(SFX.PLOP                ).play() })
	// a4 .on(pianoevent, () => { scene.sound.get(SFX.THUNDER             ).play() })
	// as4.on(pianoevent, () => { scene.sound.get(SFX.COMICCOWBELLS       ).play() })
	// b4 .on(pianoevent, () => { scene.sound.get(SFX.TYPEWRITER1         ).play() })
	// c5 .on(pianoevent, () => { scene.sound.get(SFX.TYPEWRITER2         ).play() })


	// scene.add.image( 0.3 * w, 0.6 * h, game.images.ATZEBOW )
	// 	.setOrigin( 0, 0 )
	// 	.setDepth( 5 )

	// Exit
	const exit = scene.add.rectangle( 0, 300 * s, 75 * s, 150 * s, 0x553366)
		.setOrigin( 0, 0 )
		.setInteractive()
	exit.alpha = debug ? 0.5 : 0.001
	Up.addExit({
		game: game,
		scene: scene,
		exit: exit,
		nextScene: game.scenes.FOYER,
	})

	log(`${scene.scene.key} created.`)
}

