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

import * as Up from '../utils/phaser/common'

import { game, h, s } from '../constants'
import { debug } from '../utils/general'
import { addExit } from '../utils/phaser/exit'


/* Main part */

// const jazzVolume = 0.1
// const lofiVolume = 0.4

export default class Stage extends Phaser.Scene {

	constructor() {
		super( game.scenes.Stage )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Up.assets.load({ game: game, scene: this })
	}

	// update() {
	// }
}

function go ( scene: Phaser.Scene ): void {
	//Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.stage.background.key })
	// Up.addAmbience({ scene: scene, key: game.soundsPersistant.ambience.lofi.key, volume: game.soundsPersistant.ambience.lofi.volume })
	// Up.addAmbience({ scene: scene, key: game.soundsPersistant.ambience.jazz.key, volume: game.state.get().entranceopen ? jazzVolume : 0 })

	// Objects

	// Exits
	const wimmelBild = scene.add.rectangle( 0, 350 * s, 100 * s, 100 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: wimmelBild,
		nextScene: game.scenes.Wimmelbild,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
	const stagedoorLeft = scene.add.rectangle( 0, 0, 100 * s, 205 * s, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: stagedoorLeft,
		nextScene: game.scenes.Stagedoor,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})
	const stagedoorRight = scene.add.rectangle( 725 * s, 0, 75 * s, h, 0x553366)
		.setOrigin( 0 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: stagedoorRight,
		nextScene: game.scenes.Stagedoor,
		// soundsToKeep: [
		// 	game.soundsPersistant.ambience.cityrain,
		// 	game.soundsPersistant.ambience.jazz,
		// ],
	})

	// Sprites
	const sams = scene.add.image( 340 * s, 205 * s, game.images.stage.sams.key ).setOrigin( 0 )
	const samsHead = scene.add.sprite( 344 * s, 205 * s, game.sprites.stage.samshead.key ).setOrigin( 0 )

	const neinhornTail = scene.add.sprite( 355 * s, 188 * s, game.sprites.stage.neinhorntail.key, 4 ).setOrigin( 0 )
	const neinhorn = scene.add.image( 419 * s, 167 * s, game.images.stage.neinhorn.key ).setOrigin( 0 )
	const neinhornHead = scene.add.sprite( 512 * s, 233 * s, game.sprites.stage.neinhornhead.key ).setOrigin( 0 )
	const neinhornLeg = scene.add.sprite( 483 * s, 257 * s, game.sprites.stage.neinhornleg.key, 0 ).setOrigin( 0 )

	console.log(
		( game.state.get().peopleFound.includes( 'neinhorn' ) )
	)
	const ronja = ( game.state.get().peopleFound.includes( 'neinhorn' ) ) ?
		scene.add.image( 465 * s, 178 * s, game.images.stage.ronja.key ).setOrigin( 0 ) :
		scene.add.image( 380 * s, 200 * s, game.images.stage.ronjastanding.key ).setOrigin( 0 ).setScale( 0.85 )
	const ronjaHead = ( game.state.get().peopleFound.includes( 'neinhorn' ) ) ?
		scene.add.sprite( 475 * s, 177.5 * s, game.sprites.stage.ronjahead.key ).setOrigin( 0 ) :
		scene.add.sprite( 381 * s, 201 * s, game.sprites.stage.ronjahead.key ).setOrigin( 0 ).setScale( 0.85 )

	const albirea = scene.add.image( 420 * s, 269 * s, game.images.stage.albirea.key ).setOrigin( 0 )
	const albireaHead = scene.add.sprite( 434 * s, 271 * s, game.sprites.stage.albireahead.key ).setOrigin( 0 )
	const albireaArm = scene.add.sprite( 384 * s, 310 * s, game.sprites.stage.albireaarm.key ).setOrigin( 0 )

	const bear = scene.add.image( 373 * s, 279 * s, game.images.stage.bear.key ).setOrigin( 0 )
	const bearHead = scene.add.sprite( 384 * s, 279 * s, game.sprites.stage.bearhead.key ).setOrigin( 0 )
	const bearHand = scene.add.sprite( 368 * s, 355 * s, game.sprites.stage.bearhand.key, 0 ).setOrigin( 0 )

	const bach = scene.add.image( 577 * s, 224 * s, game.images.stage.bach.key ).setOrigin( 0 )
	const bachHead = scene.add.sprite( 582 * s, 223 * s, game.sprites.stage.bachhead.key ).setOrigin( 0 )

	const entlein = scene.add.image( 623 * s, 349 * s, game.images.stage.entlein.key ).setOrigin( 0 )

	const hauptmann = scene.add.image( 243 * s, 193 * s, game.images.stage.hauptmann.key ).setOrigin( 0 )
	const hauptmannHead = scene.add.sprite( 274 * s, 194 * s, game.sprites.stage.hauptmannhead.key ).setOrigin( 0 )

	// game.state.add({ peopleFound: [ ...new Set( game.state.get().peopleFound ).add('mouse') ] })
	const mouse = scene.add.sprite( 234 * s, 326 * s, game.sprites.stage.mouse.key ).setOrigin( 0 )

	// Animations
	neinhornTail.anims.create({
		key: 'wiggle',
		frameRate: 5,
		repeat: -1,
		repeatDelay: 17000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhorntail.key, {
				start: 0,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhorntail.key, {
				start: 3,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhorntail.key, {
				start: 1,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhorntail.key, {
				frames: [ 1 ],
			}),
		],
	})
	neinhornTail.play( 'wiggle' )
	neinhornLeg.anims.create({
		key: 'kick',
		frameRate: 5,
		repeat: -1,
		repeatDelay: 20000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhornleg.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhornleg.key, {
				start: 2,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhornleg.key, {
				frames: [ 0 ]
			}),
		],
	})
	neinhornLeg.play( 'kick' )

	neinhornHead.anims.create({
		key: 'blink',
		frameRate: 3,
		repeat: -1,
		repeatDelay: 18000,
		delay: 2000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhornhead.key, {
				start: 6,
				end: 8,
			}),
		],
	})
	neinhornHead.anims.create({
		key: 'talk',
		frameRate: 5,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhornhead.key, {
				start: 1,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.neinhornhead.key, {
				start: 3,
				end: 0,
			}),
		],
	})
	neinhornHead.play( 'blink' )

	ronjaHead.anims.create({
		key: 'blink',
		frameRate: 6,
		repeat: -1,
		repeatDelay: 10000,
		delay: 1000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.ronjahead.key, {
				start: 6,
				end: 9,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.ronjahead.key, {
				start: 8,
				end: 6,
			}),
		],
	})
	ronjaHead.anims.create({
		key: 'talk',
		frameRate: 5,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.ronjahead.key, {
				start: 1,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.ronjahead.key, {
				start: 3,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.ronjahead.key, {
				frames: [ 4, 1, 2, 1, 0 ]
			}),
		],
	})
	ronjaHead.play( 'blink' )

	albireaHead.anims.create({
		key: 'blink',
		frameRate: 4,
		repeat: -1,
		repeatDelay: 12000,
		delay: 1000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.albireahead.key, {
				start: 6,
				end: 9,
			}),
		],
	})
	albireaHead.anims.create({
		key: 'talk',
		frameRate: 4,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.albireahead.key, {
				start: 1,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.albireahead.key, {
				start: 3,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.albireahead.key, {
				start: 3,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.albireahead.key, {
				start: 3,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.albireahead.key, {
				start: 2,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.albireahead.key, {
				frames: [ 0 ],
			}),
		],
	})
	albireaHead.play( 'blink' )
	albireaArm.anims.create({
		key: 'hug',
		frameRate: 4,
		repeat: -1,
		yoyo: true,
		repeatDelay: 11000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.albireaarm.key, {
				start: 0,
				end: 4,
			}),
			...Array(40).fill(
				scene.anims.generateFrameNumbers( game.sprites.stage.albireaarm.key, { frames: [ 4 ] })[0]
			),
		],
	})
	if ( game.state.get().peopleFound.includes('bear') ) albireaArm.play( 'hug' )

	bachHead.anims.create({
		key: 'blink',
		frameRate: 6,
		repeat: -1,
		repeatDelay: 15000,
		delay: 4000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.bachhead.key, {
				start: 8,
				end: 12,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.bachhead.key, {
				frames: [ 14 ],
			}),
		],
	})
	bachHead.anims.create({
		key: 'talk',
		frameRate: 4,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.bachhead.key, {
				start: 1,
				end: 5,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.bachhead.key, {
				start: 4,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.bachhead.key, {
				start: 1,
				end: 5,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.bachhead.key, {
				start: 8,
				end: 12,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.bachhead.key, {
				frames: [ 0 ],
			}),
		],
	})
	bachHead.play( 'blink' )

	bearHand.anims.create({
		key: 'wave',
		frameRate: 5,
		repeat: -1,
		repeatDelay: 21000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.bearhand.key, {
				start: 1,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.bearhand.key, {
				start: 2,
				end: 0,
			}),
		],
	})
	bearHand.play( 'wave' )

	bearHead.anims.create({
		key: 'blink',
		frameRate: 6,
		repeat: -1,
		repeatDelay: 14000,
		delay: 5000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.bearhead.key, {
				start: 0,
				end: 7,
			}),
		],
	})
	bearHead.anims.create({
		key: 'talk',
		frameRate: 5,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.bearhead.key, {
				frames: [ 1, 9, 10, 11, 12, 11, 10, 9, 1 ]
			}),
		],
	})
	bearHead.play( 'blink' )

	hauptmannHead.anims.create({
		key: 'blink',
		frameRate: 6,
		repeat: -1,
		repeatDelay: 9000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.hauptmannhead.key, {
				start: 7,
				end: 15,
			}),
		],
	})
	hauptmannHead.anims.create({
		key: 'talk',
		frameRate: 6,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.hauptmannhead.key, {
				start: 1,
				end: 5,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.hauptmannhead.key, {
				start: 4,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.hauptmannhead.key, {
				start: 1,
				end: 5,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.hauptmannhead.key, {
				start: 4,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.hauptmannhead.key, {
				start: 1,
				end: 5,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.hauptmannhead.key, {
				start: 4,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.hauptmannhead.key, {
				frames: [ 7, 9, 11, 13, 0 ]
			}),
		],
	})
	hauptmannHead.play( 'blink' )

	samsHead.anims.create({
		key: 'blink',
		frameRate: 6,
		repeat: -1,
		repeatDelay: 14000,
		delay: 5000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.samshead.key, {
				start: 0,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.samshead.key, {
				start: 0,
				end: 0,
			}),
		],
	})
	samsHead.anims.create({
		key: 'talk',
		frameRate: 5,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.samshead.key, {
				start: 1,
				end: 4,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.stage.samshead.key, {
				start: 3,
				end: 0,
			}),
		],
	})
	// samsHead.play( 'blink' )

	mouse.anims.create({
		key: 'blink',
		frameRate: 3,
		repeat: -1,
		repeatDelay: 8000,
		delay: 7000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.stage.mouse.key, {
				frames: [ 0, 1, 2, 2 ]
			}),
			...Array(10).fill(
				scene.anims.generateFrameNumbers( game.sprites.stage.mouse.key, { frames: [ 3 ] })[0]
			),
			...scene.anims.generateFrameNumbers( game.sprites.stage.mouse.key, {
				frames: [ 2, 2, 1, 0 ]
			}),
		],
	})
	mouse.play( 'blink' )

	// Interactive frames for characters
	const neinhornFrame = scene.add.rectangle( 475 * s, 195 * s, 80 * s, 110 * s, 0x553366)
		.setOrigin( 0 ).setAlpha( debug ? 0.5 : 0.001 )
	const ronjaFrame = ( game.state.get().peopleFound.includes('neinhorn') ) ?
		scene.add.rectangle( 470 * s, 175 * s, 52 * s, 75 * s, 0x553366) :
		scene.add.rectangle( 384 * s, 200 * s, 48 * s, 130 * s, 0x553366)
	ronjaFrame.setOrigin( 0 ).setAlpha( debug ? 0.5 : 0.001 )
	const albireaFrame = scene.add.rectangle( 430 * s, 275 * s, 50 * s, 140 * s, 0x553366)
		.setOrigin( 0 ).setAlpha( debug ? 0.5 : 0.001 )
	const bearFrame = scene.add.rectangle( 377 * s, 275 * s, 50 * s, 140 * s, 0x553366)
		.setOrigin( 0 ).setAlpha( debug ? 0.5 : 0.001 )
	const bachFrame = scene.add.rectangle( 575 * s, 220 * s, 80 * s, 110 * s, 0x553366)
		.setOrigin( 0 ).setAlpha( debug ? 0.5 : 0.001 )
	const entleinFrame = scene.add.rectangle( 625 * s, 345 * s, 65 * s, 90 * s, 0x553366)
		.setOrigin( 0 ).setAlpha( debug ? 0.5 : 0.001 )
	const hauptmannFrame = scene.add.rectangle( 245 * s, 190 * s, 75 * s, 115 * s, 0x553366)
		.setOrigin( 0 ).setAlpha( debug ? 0.5 : 0.001 )
	const samsFrame = scene.add.rectangle( 335 * s, 203 * s, 60 * s, 70 * s, 0x553366)
		.setOrigin( 0 ).setAlpha( debug ? 0.5 : 0.001 )

	if ( game.state.get().peopleFound.includes('neinhorn') ) {
		neinhornFrame.setInteractive()
	} else {
		neinhornFrame.setVisible( false )
		neinhornTail.setVisible( false )
		neinhorn.setVisible( false )
		neinhornHead.setVisible( false )
		neinhornLeg.setVisible( false )
	}
	if ( game.state.get().peopleFound.includes('ronja') ) {
		ronjaFrame.setInteractive()
	} else {
		ronjaFrame.setVisible( false )
		ronja.setVisible( false )
		ronjaHead.setVisible( false )
	}
	if ( game.state.get().peopleFound.includes('albirea') ) {
		albireaFrame.setInteractive()
	} else {
		albireaFrame.setVisible( false )
		albirea.setVisible( false )
		albireaHead.setVisible( false )
		albireaArm.setVisible( false )
	}
	if ( game.state.get().peopleFound.includes('bear') ) {
		bearFrame.setInteractive()
	} else {
		bearFrame.setVisible( false )
		bear.setVisible( false )
		bearHead.setVisible( false )
		bearHand.setVisible( false )
	}
	if ( game.state.get().peopleFound.includes('bach') ) {
		bachFrame.setInteractive()
	} else {
		bachFrame.setVisible( false )
		bach.setVisible( false )
		bachHead.setVisible( false )
	}
	if ( game.state.get().peopleFound.includes('entlein') ) {
		entleinFrame.setInteractive()
	} else {
		entleinFrame.setVisible( false )
		entlein.setVisible( false )
	}
	if ( game.state.get().peopleFound.includes('hauptmann') ) {
		hauptmannFrame.setInteractive()
	} else {
		hauptmannFrame.setVisible( false )
		hauptmann.setVisible( false )
		hauptmannHead.setVisible( false )
	}
	if ( game.state.get().peopleFound.includes('sams') ) {
		samsFrame.setInteractive()
	} else {
		samsFrame.setVisible( false )
		sams.setVisible( false )
		samsHead.setVisible( false )
	}

	// Dialogue

	// ONE STATEMENT PER CHARACTER PLUS ONE REPLY BY EACH CHARACTER

	type Character = { name: string, head: Phaser.GameObjects.Sprite | undefined }

	const characters = {
		neinhorn: { name: 'neinhorn', head: neinhornHead },
		ronja: { name: 'ronja', head: ronjaHead },
		albirea: { name: 'albirea', head: albireaHead },
		bear: { name: 'bear', head: bearHead },
		bach: { name: 'bach', head: bachHead },
		entlein: { name: 'entlein', head: undefined },
		hauptmann: { name: 'hauptmann', head: hauptmannHead },
		sams: { name: 'sams', head: samsHead },
	}

	let activeCharacter: Character | undefined = undefined
	let characterWhoRepliedLast: Character | undefined = undefined
	let lastSpeech: Phaser.Sound.BaseSound

	neinhornFrame.on( Phaser.Input.Events.POINTER_UP, () => converse({ game: game, scene: scene, character: characters.neinhorn }) )
	ronjaFrame.on( Phaser.Input.Events.POINTER_UP, () => converse({ game: game, scene: scene, character: characters.ronja }) )
	albireaFrame.on( Phaser.Input.Events.POINTER_UP, () => converse({ game: game, scene: scene, character: characters.albirea }) )
	bearFrame.on( Phaser.Input.Events.POINTER_UP, () => converse({ game: game, scene: scene, character: characters.bear }) )
	bachFrame.on( Phaser.Input.Events.POINTER_UP, () => converse({ game: game, scene: scene, character: characters.bach }) )
	entleinFrame.on( Phaser.Input.Events.POINTER_UP, () => converse({ game: game, scene: scene, character: characters.entlein }) )
	hauptmannFrame.on( Phaser.Input.Events.POINTER_UP, () => converse({ game: game, scene: scene, character: characters.hauptmann }) )
	samsFrame.on( Phaser.Input.Events.POINTER_UP, () => converse({ game: game, scene: scene, character: characters.sams }) )
	// atzeFrame.on( Phaser.Input.Events.POINTER_UP, () => converse({ game: game, scene: scene, character: characters.atze }) )

	function converse (p: { game: Up.Game, scene: Phaser.Scene, character: Character }): void {
		if ( activeCharacter === undefined || characterWhoRepliedLast?.name === p.character.name ) {
			activeCharacter = p.character
		}
		characterWhoRepliedLast = p.character

		if ( game.sounds.stage.hasOwnProperty( `${characterWhoRepliedLast.name}_${activeCharacter.name}` ) ) {
			lastSpeech?.stop()
			p.character.head?.play('talk').once( Phaser.Animations.Events.ANIMATION_STOP, () => {
				if ( p.character.head ) p.character.head.play('blink')
			})

			const { key, volume } = game.sounds.stage[ `${characterWhoRepliedLast.name}_${activeCharacter.name}` ]
			lastSpeech = scene.sound.get( key )
			lastSpeech.play({ volume: volume })
			lastSpeech.off( Phaser.Sound.Events.COMPLETE )
			lastSpeech.once( Phaser.Sound.Events.COMPLETE, () => {
				p.character.head?.stop().setFrame( 0 )
			})
			lastSpeech.off( Phaser.Sound.Events.STOP )
			lastSpeech.once( Phaser.Sound.Events.STOP, () => {
				p.character.head?.stop().setFrame( 0 )
			})
		} else {
			console.log(`${characterWhoRepliedLast.name}_${activeCharacter.name} not recorded yet.`)
		}
	}

	// // THIS WAS MEANT TO ENABLE CONVERSATIONS WITH MULTIPLE CHOICE OPTIONS.
	// const iconNeinhorn   = scene.add.sprite( 200 * s, 395 * s, game.sprites.stage.neinhorn.key   ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 )
	// const iconRonja      = scene.add.sprite( 200 * s, 395 * s, game.sprites.stage.ronja.key      ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 )
	// const iconAlbirea    = scene.add.sprite( 200 * s, 395 * s, game.sprites.stage.albirea.key    ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 )
	// const iconBear       = scene.add.sprite( 200 * s, 395 * s, game.sprites.stage.bear.key       ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 )
	// const iconBach       = scene.add.sprite( 200 * s, 395 * s, game.sprites.stage.bach.key       ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 )
	// const iconEntlein    = scene.add.sprite( 200 * s, 395 * s, game.sprites.stage.entlein.key    ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 )
	// const iconHauptmann  = scene.add.sprite( 200 * s, 395 * s, game.sprites.stage.hauptmann.key  ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 )
	// const iconSams       = scene.add.sprite( 200 * s, 395 * s, game.sprites.stage.sams.key       ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 )
	// // const iconAtze       = scene.add.sprite( 200 * s, 395 * s, game.sprites.stage.atze.key       ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 )
	//
	// const characters = {
	// 	neinhorn: { icon: iconNeinhorn, head: neinhornHead },
	// 	ronja: { icon: iconRonja, head: ronjaHead },
	// 	albirea: { icon: iconAlbirea, head: albireaHead },
	// 	bear: { icon: iconBear, head: bearHead },
	// 	bach: { icon: iconBach, head: bachHead },
	// 	entlein: { icon: iconEntlein, head: undefined },
	// 	hauptmann: { icon: iconHauptmann, head: hauptmannHead },
	// 	sams: { icon: iconSams, head: samsHead },
	// 	// atze: { icon: iconAtze, head: undefined },
	// }
	//
	// const iconQuestion    = scene.add.image( 265 * s, 403 * s, game.images.stage.question.key     ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 ).setInteractive().setVisible( false )
	// const iconExclamation = scene.add.image( 315 * s, 403 * s, game.images.stage.exclamation.key  ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 ).setInteractive().setVisible( false )
	// const iconFunny       = scene.add.image( 365 * s, 403 * s, game.images.stage.funny.key        ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 ).setInteractive().setVisible( false )
	// const iconBye         = scene.add.image( 415 * s, 403 * s, game.images.stage.bye.key          ).setOrigin( 0 ).setScale( 0.8 ).setAlpha( 0.001 ).setInteractive().setVisible( false )
	//
	// const icons = [
	// 	iconQuestion,
	// 	iconExclamation,
	// 	iconFunny,
	// 	iconBye,
	// ]
	//
	// let activeCharacter: { icon: Phaser.GameObjects.Sprite, head: Phaser.GameObjects.Sprite | undefined } | undefined = undefined
	//
	// neinhornFrame.on( Phaser.Input.Events.POINTER_UP, () => highlightCharacter( characters.neinhorn ) )
	// ronjaFrame.on( Phaser.Input.Events.POINTER_UP, () => highlightCharacter( characters.ronja ) )
	// albireaFrame.on( Phaser.Input.Events.POINTER_UP, () => highlightCharacter( characters.albirea ) )
	// bearFrame.on( Phaser.Input.Events.POINTER_UP, () => highlightCharacter( characters.bear ) )
	// bachFrame.on( Phaser.Input.Events.POINTER_UP, () => highlightCharacter( characters.bach ) )
	// entleinFrame.on( Phaser.Input.Events.POINTER_UP, () => highlightCharacter( characters.entlein ) )
	// hauptmannFrame.on( Phaser.Input.Events.POINTER_UP, () => highlightCharacter( characters.hauptmann ) )
	// samsFrame.on( Phaser.Input.Events.POINTER_UP, () => highlightCharacter( characters.sams ) )
	// // atzeFrame.on( Phaser.Input.Events.POINTER_UP, () => highlightCharacter( characters.atze ) )
	//
	// const highlightCharacter = ( character: { icon: Phaser.GameObjects.Sprite, head: Phaser.GameObjects.Sprite | undefined } ) => {
	// 	activeCharacter = character
	// 	scene.tweens.add({
	// 		targets: Object.values(characters).map( v => v.icon ).filter( icon => icon !== character.icon ),
	// 		alpha: 0.001,
	// 		duration: 500,
	// 		ease: 'linear',
	// 	})
	// 	scene.tweens.add({
	// 		targets: character.icon,
	// 		alpha: 1,
	// 		duration: 500,
	// 		ease: 'linear',
	// 	})
	// 	icons.forEach( icon => {
	// 		icon.setVisible( true )
	// 		icon.setAlpha( 0.001 )
	// 	})
	// 	scene.tweens.add({
	// 		targets: icons,
	// 		alpha: 1,
	// 		duration: 500,
	// 		delay: 250,
	// 		ease: 'linear',
	// 	})
	// }
	//
	// icons.forEach( icon => {
	// 	icon.on( 'pointerup', () => {
	// 		const theCharacter = activeCharacter
	// 		if ( theCharacter && theCharacter.head ) {
	// 			theCharacter.head.play('talk').once( Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
	// 				if ( theCharacter && theCharacter.head ) {
	// 					theCharacter.head.play('blink')
	// 				}
	// 			})
	// 		}
	// 	})
	// })

}
