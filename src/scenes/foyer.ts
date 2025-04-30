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
import * as Audio from '../utils/phaser/audio'
import * as Inventory from '../utils/inventory'
import * as Cat from '../sprites/cat'

import { game, s } from '../constants'
import { debug } from '../utils/general'
import { randomElementOf, randomInt } from '../utils/math'
import { addExit } from '../utils/phaser/exit'

/* Main part */

// enum Position {
// 	floorFront = 'floorFront',
// 	barFront = 'barFront',
// 	barEnd = 'barEnd',
// }

export default class Foyer extends Phaser.Scene {

	constructor() {
		super( game.scenes.Foyer )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Inventory.load({ game: game, scene: this })
		Up.assets.load({ game: game, scene: this })
	}

	// update() {
	// }
}

function go ( scene: Phaser.Scene ): void {

	// Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.foyer.background.key })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.ambience.jazz.key, volume: game.soundsPersistant.ambience.jazz.volume, fadeIn: 3000 })

	// Sounds
	let currentTalk: Phaser.Sound.BaseSound

	const woIstDennNur = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.woistdennnur })
	const ohHallo = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.ohhallo })
	const obenImSpielzimmer = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.obenimspielzimmer })

	const atzesSounds = [ woIstDennNur, ohHallo, obenImSpielzimmer ]


	// Objects
	const snorlax = scene.add.sprite( 500 * s, 257 * s, game.sprites.foyer.snorlax.key ).setScale( 0.5 )
	snorlax.anims.create({
		key: 'snorlaxSnooze',
		frameRate: 5,
		repeat: -1,
		repeatDelay: 7000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.snorlax.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.snorlax.key, {
				start: 0,
				end: 0,
			}),
		],
	})
	snorlax.play( 'snorlaxSnooze' )

	const choco = scene.add.sprite( 522 * s, 270 * s, game.sprites.foyer.choco.key )
	choco.setFlipX(true)
	choco.anims.create({
		key: 'foyerchoco',
		frameRate: 7,
		repeat: -1,
		repeatDelay: 1500,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.choco.key, {
				start: 0,
				end: 7,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.choco.key, {
				start: 0,
				end: 0,
			}),
		],
	})
	choco.play( 'foyerchoco' )



	// Snowman
	const snowmanSilence = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.snowman })
	const snowmanSounds = [ snowmanSilence ]

	const snowmanHead = scene.add.sprite(    277 * s, 289 * s, game.sprites.foyer.snowman.key ).setOrigin( 0 ).setInteractive()
	const snowman     = scene.add.rectangle( 277 * s, 285 * s, 30 * s, 70 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	snowmanHead.anims.create({
		key: 'talk',
		frameRate: 5,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.snowman.key, {
				start: 1, end: 18,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.snowman.key, {
				start: 17, end: 0,
			}),
		],
	})
	snowman.off( 'pointerup' ).once( 'pointerup', snowmanTalk )

	function snowmanTalk () {

		if ( atzeIsTalking ) {
			snowman.off( 'pointerup' ).once( 'pointerup', snowmanTalk )
			return
		}

		currentTalk?.stop()
		snowmanHead.play( 'talk' )
		const randomSound = randomElementOf( snowmanSounds )
		currentTalk = Audio.play( randomSound ).sound
		Array("complete", "stop").forEach( (event: string) => randomSound.sound.on( event, () => {
			snowmanHead.stop().setFrame( 0 )
			snowman.off( 'pointerup' ).once( 'pointerup', snowmanTalk )
		}))
	}

	// Wastebasket
	const binBarf = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.bin_barf })
	const binChewinggum = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.bin_chewinggum })
	const binMorgensabends = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.bin_morgensabends })
	// const binObiwan = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.bin_obiwan })
	const binR2d2 = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.bin_r2d2 })
	const wastebasketSounds = [ binBarf, binChewinggum, binMorgensabends, binR2d2 ]

	const wastebasketHead = scene.add.sprite(    624 * s, 328 * s, game.sprites.foyer.wastebasket.key ).setOrigin( 0 ).setInteractive()
	const wastebasket     = scene.add.rectangle( 623 * s, 330 * s, 31 * s, 52 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	wastebasketHead.anims.create({
		key: 'talk',
		frameRate: 10,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.wastebasket.key, {
				start: 1, end: 19,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.wastebasket.key, {
				start: 18, end: 0,
			}),
		],
	})
	wastebasket.off( 'pointerup' ).once( 'pointerup', wastebasketTalk )

	function wastebasketTalk () {

		if ( atzeIsTalking ) {
			wastebasket.off( 'pointerup' ).once( 'pointerup', wastebasketTalk )
			return
		}

		currentTalk?.stop()
		wastebasketHead.play( 'talk' )
		const randomSound = randomElementOf( wastebasketSounds )
		currentTalk = Audio.play( randomSound ).sound
		Array("complete", "stop").forEach( (event: string) => randomSound.sound.on( event, () => {
			wastebasketHead.stop().setFrame( 0 )
			wastebasket.off( 'pointerup' ).once( 'pointerup', wastebasketTalk )
		}))
	}

	// Guitar
	const guitarSounds = [
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_00 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_01 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_02 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_03 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_04 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_05 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_06 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_07 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_08 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_09 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_10 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_11 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_12 }),
		Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer.guitar_13 }),
	]

	const guitar = scene.add.rectangle( 450, 600, 90, 180, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )

	guitar.off( 'pointerup' ).once( 'pointerup', guitarPlay )

	function guitarPlay () {

		if ( atzeIsTalking ) {
			guitar.off( 'pointerup' ).once( 'pointerup', guitarPlay )
			return
		}

		currentTalk?.stop()
		// guitarSprite.play( 'talk' )

		const ambience = Audio.get({ scene, keyAndVolume: game.soundsPersistant.ambience.jazz })
		scene.tweens.add({
			targets: ambience.sound,
			volume: ambience.volume / 15,
			duration: 1000,
			ease: Phaser.Math.Easing.Linear,
		})
		const randomSound = randomElementOf( guitarSounds )
		currentTalk = Audio.play( randomSound ).sound
		Array("complete", "stop").forEach( (event: string) => randomSound.sound.on( event, () => {
			scene.tweens.add({
				targets: ambience.sound,
				volume: ambience.volume,
				duration: 1000,
				ease: Phaser.Math.Easing.Linear,
			})
			// guitarSprite.stop().setFrame( 0 )
			guitar.off( 'pointerup' ).once( 'pointerup', guitarPlay )
		}))
	}



	// Cashier
	if ( game.state.get().peopleFound.length > 2 ) {
		const cashier     = scene.add.image(  695 * s, 253 * s, game.images.foyer.cashier.key )
		const cashierHead = scene.add.sprite( 680.2 * s, 248.7 * s, game.sprites.foyer.cashierhead.key ).setOrigin( 0 ).setInteractive()

		cashierHead.anims.create({
			key: 'blink',
			frameRate: 5,
			repeat: 0,
			delay: 3000,
			showBeforeDelay: true,
			skipMissedFrames: true,
			frames: [
				...scene.anims.generateFrameNumbers( game.sprites.foyer.cashierhead.key, {
					frames: [ 0, 1, 2, 3, 2, 1, 0 ]
				}),
			],
		})
		cashierHead.anims.create({
			key: 'talk',
			frameRate: 5,
			repeat: -1,
			skipMissedFrames: true,
			frames: [
				...scene.anims.generateFrameNumbers( game.sprites.foyer.cashierhead.key, {
					start: 5, end: 10,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.foyer.cashierhead.key, {
					start: 9, end: 4,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.foyer.cashierhead.key, {
					start: 5, end: 10,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.foyer.cashierhead.key, {
					start: 9, end: 4,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.foyer.cashierhead.key, {
					start: 5, end: 10,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.foyer.cashierhead.key, {
					start: 0, end: 3,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.foyer.cashierhead.key, {
					start: 2, end: 0,
				}),
			],
		})

		cashierHead.off( 'animationcomplete-blink' )
		cashierHead.on(  'animationcomplete-blink', () => {
			const dice = randomInt( 0, 20000 )
			if ( dice < 5000 ) {
				cashierHead.play({ key: 'blink', delay: dice } )
				return
			}
			const delay     = randomInt( 1000, 8000 )
			const stopAfter = randomInt( 4000, 16000 )
			scene.time.delayedCall( delay, () => {
				cashierHead.play( 'talk' )
				scene.time.delayedCall( stopAfter, () => {
					cashierHead.play( 'blink' )
				})
			})
		})
		cashierHead.play( 'blink' )

		const cashierExit = scene.add.rectangle( 1310, 400, 290, 200, 0x553366 )
			.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
		addExit({
			game: game,
			scene: scene,
			exit: cashierExit,
			nextScene: game.scenes.Cashier,
		})
	}


	// Cat
	const cat = Cat.newCat( scene, 615 * s, 402 * s, 1 )
	cat.follower.setDepth( 15 )
	cat.follower.setFlipX( true )
	cat.soundTimeInterval = [30, 50]
	cat.randomSounds = [
		cat.sounds.meow,
		cat.sounds.meow,
		cat.sounds.meowmeowmeow,
	],
	Cat.playRandomCatSounds({ cat: cat, preDelay: true })

	motions.walkFromDoor({ cat: cat })

	// Atze
	const atze = scene.add.sprite( 362 * s, 274 * s, game.sprites.foyer.atze.key ).setOrigin( 0, 0 )
	atze.setScale( 0.85 )
	atze.setDepth( 5 )
	const atzeHead = scene.add.sprite( 412 * s, 303 * s, game.sprites.foyer.atzetalking.key, 0 ).setOrigin( 0, 0 )
	atzeHead.setScale( 0.85 )
	atzeHead.setDepth( 6 )
	const atzeFrame = scene.add.rectangle( 362 * s, 310 * s, 125 * s, 80 * s, 0x990099 ).setOrigin( 0, 0 )
	atzeFrame.setAlpha( 0.001 )
	atzeFrame.setDepth( 6 )
	atzeFrame.setInteractive()

	atze.anims.create({
		key: 'atzeBow',
		delay: 2000,
		frameRate: 5,
		repeat: 0,
		repeatDelay: 5000,
		skipMissedFrames: true,
		yoyo: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atze.key, {
				start: 0,
				end: 4,
			}),
			...Array.from( { length: 10 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atze.key, {
					start: 4,
					end: 4,
				})
			).flat(),
		],
	})
	atze.anims.create({
		key: 'atzeRabbit',
		delay: 2000,
		frameRate: 5,
		repeat: 0,
		repeatDelay: 5000,
		skipMissedFrames: true,
		yoyo: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atze.key, {
				start: 6,
				end: 10,
			}),
			...Array.from( { length: 10 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atze.key, {
					start: 10,
					end: 10,
				})
			).flat(),
		],
	})
	atze.anims.create({
		key: 'atzeWishMachine',
		delay: 2000,
		frameRate: 5,
		repeat: 0,
		repeatDelay: 5000,
		skipMissedFrames: true,
		yoyo: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atze.key, {
				start: 12,
				end: 16,
			}),
			...Array.from( { length: 10 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atze.key, {
					start: 16,
					end: 16,
				})
			).flat(),
		],
	})
	atze.anims.create({
		key: 'atzeGold',
		delay: 2000,
		frameRate: 5,
		repeat: 0,
		repeatDelay: 5000,
		skipMissedFrames: true,
		yoyo: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atze.key, {
				start: 18,
				end: 22,
			}),
			...Array.from( { length: 10 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atze.key, {
					start: 22,
					end: 22,
				})
			).flat(),
		],
	})
	atzeHead.anims.create({
		key: 'woIstDennNur',
		delay: 0,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...Array.from( { length: 5 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 9,
				end: 11,
			}),
			...Array.from( { length: 3 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			// ...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 	start: 0,
			// 	end: 2,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 	start: 1,
			// 	end: 0,
			// }),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 9,
				end: 11,
			}),
		],
	})
	atzeHead.anims.create({
		key: 'ferdiesTrompete',
		delay: 0,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...Array.from( { length: 2 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			// ...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 	start: 9,
			// 	end: 11,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 	start: 0,
			// 	end: 2,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 	start: 1,
			// 	end: 0,
			// }),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 9,
				end: 11,
			}),
		],
	})
	atzeHead.anims.create({
		key: 'ohHallo',
		delay: 0,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 6,
			}),
			// ...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 	start: 9,
			// 	end: 11,
			// }),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 9,
				end: 11,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 9,
				end: 11,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 6,
			}),
			...Array.from( { length: 5 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 9,
				end: 11,
			}),
		],
	})
	atzeHead.anims.create({
		key: 'obenImSpielzimmer',
		delay: 0,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...Array.from( { length: 3 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 2,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 9,
				end: 11,
			}),
			...Array.from( { length: 1 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 2,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 9,
				end: 11,
			}),
			// ...Array.from( { length: 3 }, () =>
			// 	scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 		start: 0,
			// 		end: 6,
			// 	})
			// ).flat(),
			// ...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 	start: 0,
			// 	end: 2,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 	start: 1,
			// 	end: 0,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
			// 	start: 9,
			// 	end: 11,
			// }),
		],
	})
	atzeHead.anims.create({
		key: 'atzeTalking',
		delay: 2000,
		frameRate: 6,
		repeat: -1,
		repeatDelay: 4000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 4,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 2,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 8,
				end: 12,
			}),
		],
	})
	atzeHead.anims.create({
		key: 'talking',
		frameRate: 6,
		repeat: -1,
		repeatDelay: 500,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 4,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 2,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 5,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.foyer.atzetalking.key, {
				start: 8,
				end: 12,
			}),
		],
	})

	const allPeople = [ 'albirea', 'bach', 'bear', 'entlein', 'hauptmann', 'neinhorn', 'ronja', 'sams' ]
	const allItems = [ 'bandaid', 'crystals', 'knife', 'trumpet', 'pass', 'wig', 'wunschmaschine' ]
	const peopleFound = game.state.get().peopleFound
	const inventory = game.state.get().inventory

	const missingPeople = allPeople.filter( p => !peopleFound.includes( p ) )
	const missingItems = allItems.filter( p => !inventory.includes( p ) )
	const missingPeopleAndItems = [ ...missingPeople, ...missingItems ]

	const atzeTopics = missingPeopleAndItems.map( m => 'missing_' + m )
	const atzeTopicsTwice = [...atzeTopics, ...atzeTopics]

	const atzeSilentTopics = [ 'atzeRabbit', 'atzeWishMachine', 'atzeGold' ]

	let atzeIsTalking = false

	function atzeSpeak ( topic: string ) {

		if ( atzeIsTalking ) return

		atzeIsTalking = true
		console.log( topic )
		const { sound, volume } = Audio.get({ scene: scene, keyAndVolume: game.sounds.foyer[ topic ] })
		atzeHead.play( 'talking' )
		Audio.play({ sound, volume })
		sound.off( 'complete' )
		sound.once( 'complete', () => {
			atzeIsTalking = false
			atzeHead.stop().setFrame( 0 )
			atze.emit( 'atzeSpeakComplete')
		})
	}

	let randomTalk: Phaser.Time.TimerEvent

	function atzeRandomTopics () {

		// improve: simply stop cycling through this function when atze is talking and start the cycle again when he has finished.
		scene.time.removeEvent( randomTalk )

		const silentTopic = randomElementOf( atzeSilentTopics )
		atze.play( silentTopic )
		atzeHead.play( 'atzeTalking' )

		if (atzeTopicsTwice.length > 0) {
			const delay = randomInt( 2000, 20000 )
			randomTalk = scene.time.delayedCall( delay, () => {

				if ( atzeIsTalking || currentTalk?.isPlaying ) {
					atze.emit( 'atzeSpeakComplete' )
					return
				}

				const topic = randomElementOf( atzeTopicsTwice )
				atzeSpeak( topic )
				atzeTopicsTwice.splice( atzeTopicsTwice.indexOf( topic ), 1 )
			})
		}
	}

	atze.off( 'atzeSpeakComplete' ).on( 'atzeSpeakComplete', () => {
		atzeRandomTopics()
	})

	function atzeExplain () {
		currentTalk?.stop()
		atzeIsTalking = true
		atzeHead.off('animationstart').once( 'animationstart', () => {
			Audio.play( obenImSpielzimmer )
		})
		atzeHead.play( 'obenImSpielzimmer' )
		obenImSpielzimmer.sound.off( 'complete' ).once( 'complete', () => {
			atzeIsTalking = false
			atzeHead.stopOnFrame( atzeHead.anims.get( 'obenImSpielzimmer' ).frames[ 0 ] )
			scene.time.delayedCall( 2000, () => {
				atzeRandomTopics()

				atzeFrame.off( 'pointerup' )
				atzeFrame.once( 'pointerup', () => {
					atzeExplain()
				})
			})
		})
	}

	if ( !game.state.get().metAtze ) {
		atzeIsTalking = true
		scene.time.delayedCall( 4000, () => {
			atzeHead.off( 'animationstart' ).once( 'animationstart', () => {
				atze.play( 'atzeBow' )
				Audio.play( woIstDennNur )
				// woIstDennNur.sound.off( 'complete' )
				// woIstDennNur.sound.once( 'complete', () => {
				// 	atzeHead.stopOnFrame( atzeHead.anims.get( 'woIstDennNur' ).frames[ 0 ] )
				// 	atzeHead.playAfterDelay( 'ferdiesTrompete', 3500 )
				// 	atzeHead.off( 'animationstart' )
				// 	atzeHead.once( 'animationstart', () => {
				// 		Audio.play( ferdiesTrompete )
				// 	})
				// })
				woIstDennNur.sound.off( 'complete' ).once( 'complete', () => {
					atzeHead.stopOnFrame( atzeHead.anims.get( 'woIstDennNur' ).frames[ 0 ] )
					atzeHead.playAfterDelay( 'ohHallo', 3500 )
					atzeHead.off( 'animationstart' )
					atzeHead.once( 'animationstart', () => {
						Audio.play( ohHallo )
					})
				})
				// ferdiesTrompete.sound.off( 'complete' )
				// ferdiesTrompete.sound.once( 'complete', () => {
				// 	atzeHead.stopOnFrame( atzeHead.anims.get( 'ferdiesTrompete' ).frames[ 0 ] )
				// 	atzeHead.playAfterDelay( 'ohHallo', 100 )
				// 	atzeHead.off( 'animationstart' )
				// 	atzeHead.once( 'animationstart', () => {
				// 		Audio.play( ohHallo )
				// 	})
				// })
				ohHallo.sound.off( 'complete' ).once( 'complete', () => {
					atzeHead.stopOnFrame( atzeHead.anims.get( 'ohHallo' ).frames[ 0 ] )
					atzeHead.playAfterDelay( 'obenImSpielzimmer', 1000 )
					atzeHead.off( 'animationstart' )
					atzeHead.once( 'animationstart', () => {
						Audio.play( obenImSpielzimmer )
					})
				})
				obenImSpielzimmer.sound.off( 'complete' ).once( 'complete', () => {
					atzeHead.stopOnFrame( atzeHead.anims.get( 'obenImSpielzimmer' ).frames[ 0 ] )
					game.state.add({ metAtze: true })
					atzeIsTalking = false
					scene.time.delayedCall( 5000, () => {
						atzeHead.play( 'atzeTalking' )
						atze.play( 'atzeRabbit' )
						atze.off( 'animationcomplete-atzeBow' )
						atze.on( 'animationcomplete-atzeBow', () => { atze.play( 'atzeRabbit' ) })

						atzeRandomTopics()

						atzeFrame.off( 'pointerup' )
						atzeFrame.once( 'pointerup', () => {
							atzeExplain()
						})
					})
				})
			})
			atzeHead.play( 'woIstDennNur' )
		})
	} else {
		atze.off('animationcomplete-atzeBow').on( 'animationcomplete-atzeBow', () => {
			atze.play( 'atzeRabbit' )
		})

		atzeFrame.off( 'pointerup' ).once( 'pointerup', () => {
			atzeExplain()
		})
		const atzeCommentedFoundPeople = game.state.get().atzeCommentedFoundPeople
		if ( atzeCommentedFoundPeople < 1 ) {
			if ( missingPeople.length === 0 ) {
				scene.time.delayedCall( 2000, () => {
					atzeSpeak( 'found_everyone' )
					game.state.add({ atzeCommentedFoundPeople: atzeCommentedFoundPeople + 1 })
				})
			} else if ( game.state.get().peopleFound.length > game.state.get().peopleFoundPrevious.length ) {
				const key = ( game.state.get().peopleFoundPrevious.length === 0 ) ? 'found_firstpeople' : 'found_morepeople'
				scene.time.delayedCall( 2000, () => {
					atzeSpeak( key )
					game.state.add({ atzeCommentedFoundPeople: atzeCommentedFoundPeople + 1 })
				})
			}
		}
		scene.time.delayedCall( 2100, () => {
			atzeRandomTopics()
		})
	}
	atze.off( 'animationcomplete-atzeRabbit' )
	atze.off( 'animationcomplete-atzeWishMachine' )
	atze.off( 'animationcomplete-atzeGold' )
	atze.on( 'animationcomplete-atzeRabbit', () => { atze.play( 'atzeWishMachine' ) })
	atze.on( 'animationcomplete-atzeWishMachine', () => { atze.play( 'atzeGold' ) })
	atze.on( 'animationcomplete-atzeGold', () => { atze.play( 'atzeBow' ) })


	// Stray Items
	if ( game.state.get().inventory.length > 0 ) {

		const chest = Inventory.createChest({ game, scene })
		for ( let [ item, image ] of Object.entries( chest.items ) ) {
			( image as Phaser.GameObjects.Image ).off( 'pointerup' ).on( 'pointerup', () => {
				atzeSpeak( 'found_' + item )
			})
		}
		chest.icon.setAlpha( 1 ).setVisible( true ).setInteractive()
			.on( 'pointerup', () => { chest.toggleOpen() })
	}


	// EXits
	const piano = scene.add.rectangle( 370 * s, 265 * s, 65 * s, 50 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: piano,
		nextScene: game.scenes.Piano,
	})

	const entranceExit = scene.add.rectangle( 0, 180 * s, 160 * s, 450 * s, 0x553366)
		.setOrigin( 0 ).setDepth( 11 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: entranceExit,
		nextScene: game.scenes.Entrance,
		soundsToKeep: [
			game.soundsPersistant.ambience.cityrain,
			game.soundsPersistant.ambience.jazz,
		],
	})
	const stairs1 = scene.add.rectangle( 210 * s, 110 * s, 145 * s, 100 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: stairs1,
		nextScene: game.scenes.Hallway,
	})
	const stairs2 = scene.add.rectangle( 295 * s, 210 * s, 50 * s, 35 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: stairs2,
		nextScene: game.scenes.Hallway,
	})
	const backstage = scene.add.rectangle( 435 * s, 225 * s, 40 * s, 50 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: backstage,
		nextScene: game.scenes.Backstage,
	})
	const trailers = scene.add.rectangle( 710 * s, 140 * s, 90 * s, 57 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	addExit({
		game: game,
		scene: scene,
		exit: trailers,
		nextScene: game.scenes.Trailers,
	})
}

const motions: { [key: string]: Cat.Motion } = {

	walkFromDoor: ( p ) => {
		const duration = 5000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.jumpOnBar,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setScale( 0.9 * p.cat.fullScale )
		p.cat.follower.setFlipX( true )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.9 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.anims.timeScale = 1
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)
		p.cat.follower.off( 'animationcomplete-' + Cat.CATGETUP )
		p.cat.follower.once( 'animationcomplete-' + Cat.CATGETUP, () => {
			p.cat.follower.anims.play({ key: Cat.CATWALK })
		})
		p.cat.follower.off(  'animationcomplete-' + Cat.CATWALK )
		p.cat.follower.once( 'animationcomplete-' + Cat.CATWALK, () => {
			p.cat.follower.play({ key: Cat.CATSITDOWN})
		})
		p.cat.follower.off( 'animationcomplete-' + Cat.CATSITDOWN )
		p.cat.follower.once( 'animationcomplete-' + Cat.CATSITDOWN, () => {
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
		const path = new Phaser.Curves.Path( 200 * s, 425 * s ).splineTo([
			Up.vec( 550 * s, 370 * s ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			delay: 400,
			yoyo: false,
			repeat: 0,
			// ease: 'quad.inout',
			ease: ease,
			positionOnPath: true,
			rotateToPath: true,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				p.cat.follower.anims.stop()
				p.cat.follower.emit( 'animationcomplete-' + Cat.CATWALK )
			},
		})
	},

	jumpOnBar: ( p ) => {

		p.cat.follower.anims.stop()
		const duration = 600
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.walkOnBar,
		]

		p.cat.follower.setRotation( 0 )
		p.cat.follower.setScale( 0.9 * p.cat.fullScale )
		p.cat.follower.flipX = true

		const ease = Phaser.Math.Easing.Quadratic.Out

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.9 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})

		p.cat.follower.off( 'animationcomplete-' + Cat.CATGETUP )
		p.cat.follower.once( 'animationcomplete-' + Cat.CATGETUP, () => {
			p.cat.follower.setFlipX( false )
			p.cat.follower.anims.timeScale = 1.5
			p.cat.follower.play({ key: Cat.CATJUMP })
		})
		p.cat.follower.off( 'animationcomplete-' + Cat.CATJUMP )
		p.cat.follower.once( 'animationcomplete-' + Cat.CATJUMP, () => {
			p.cat.follower.setFlipX( true )
			p.cat.follower.anims.timeScale = 2
			p.cat.follower.play({ key: Cat.CATSITDOWN })
			p.cat.follower.off(  'animationcomplete-' + Cat.CATSITDOWN )
			p.cat.follower.once( 'animationcomplete-' + Cat.CATSITDOWN, () => {
				p.cat.follower.anims.timeScale = 1
				p.cat.follower.play( Cat.CATGETUP )
				p.cat.follower.off(  'animationcomplete-' + Cat.CATGETUP )
				p.cat.follower.once( 'animationcomplete-' + Cat.CATGETUP, () => {
					p.cat.follower.setFlipX( false )
					p.cat.follower.anims.timeScale = 1
					p.cat.follower.play( Cat.CATSITDOWN )
					p.cat.follower.off(  'animationcomplete-' + Cat.CATSITDOWN )
					p.cat.follower.once( 'animationcomplete-' + Cat.CATSITDOWN, () => {
						p.cat.follower.anims.timeScale = 1
						p.cat.follower.emit( Cat.NEXTMOTION )
					})
				})
			})
		})

		p.cat.follower.anims.timeScale = 1
		p.cat.follower.play( { key: Cat.CATGETUP } )
		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Up.vec( 585 * s, 304 * s ),
			Up.vec( 605 * s, 285 * s ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			delay: 1000,
			yoyo: false,
			repeat: 0,
			ease: ease,
			positionOnPath: true,
			rotateToPath: false,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				p.cat.follower.setFlipX( true )
				// Cat.sitDown({ cat: p.cat })
			}
		})
	},

	walkOnBar: ( p ) => {
		const duration = 3000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.jumpFromBar,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0.07 * Math.PI )
		p.cat.follower.setScale( 0.9 * p.cat.fullScale )
		p.cat.follower.setFlipX( false )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.6 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.once( 'animationcomplete-' + Cat.CATGETUP, () => {
			p.cat.follower.chain([
				{ key: Cat.CATWALK },
			])
		})
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)

		p.cat.follower.once( 'animationcomplete-' + Cat.CATSITDOWN, () => {
			p.cat.follower.emit( Cat.NEXTMOTION )
		})
		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Up.vec(  465 * s,  265 * s ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			yoyo: false,
			repeat: 0,
			// ease: 'quad.inout',
			ease: ease,
			positionOnPath: true,
			rotateToPath: false,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				Cat.sitDown({ cat: p.cat })
			},
		})
	},

	jumpFromBar: ( p ) => {
		const duration = 800
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.walkLeftOfAtze,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setScale( 0.6 * p.cat.fullScale )
		p.cat.follower.flipX = false
		p.cat.follower.setDepth( 4 )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.6 * p.cat.fullScale,
			duration: duration + 1000,
			ease: ease,
		})
		p.cat.follower.play({ key: Cat.CATGETUP })
		p.cat.follower.off( 'animationcomplete-' + Cat.CATGETUP )
		p.cat.follower.once( 'animationcomplete-' + Cat.CATGETUP, () => {
			p.cat.follower.setFlipX( true )
			p.cat.follower.setRotation( -0.5 * Math.PI )
			p.cat.follower.play({ key: Cat.CATJUMP })
			p.cat.follower.off( 'animationcomplete-' + Cat.CATJUMP )
			p.cat.follower.once( 'animationcomplete-' + Cat.CATJUMP, () => {
				p.cat.follower.setFlipX( false )
				p.cat.follower.setRotation( 0 )
				p.cat.follower.play({ key: Cat.CATSITDOWN })
				p.cat.follower.off( 'animationcomplete-' + Cat.CATSITDOWN )
				p.cat.follower.once( 'animationcomplete-' + Cat.CATSITDOWN, () => {
					p.cat.follower.emit( Cat.NEXTMOTION )
				})
			})
		})

		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Up.vec( 425 * s, 305 * s ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			delay: 1000,
			yoyo: false,
			repeat: 0,
			// ease: 'quad.inout',
			ease: ease,
			positionOnPath: true,
			rotateToPath: false,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
			},
		})
	},

	walkLeftOfAtze: ( p ) => {
		const duration = 6000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			Cat.idle,
			motions.walkFromLeftOfAtzeToBar,
		]
		const ease = Phaser.Math.Easing.Linear

		const endPoint = { x: 325 * s, y: 375 * s }
		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setFlipX( endPoint.x > p.cat.follower.x )
		p.cat.follower.setDepth( 4 )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.9 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.play({ key: Cat.CATGETUP })
		p.cat.follower.off(  'animationcomplete-' + Cat.CATGETUP )
		p.cat.follower.once( 'animationcomplete-' + Cat.CATGETUP, () => {
			// p.cat.follower.setRotation( -0.25 * Math.PI )
			p.cat.follower.play({ key: Cat.CATWALKFRONT })
			p.cat.follower.off(  'animationcomplete-' + Cat.CATWALKFRONT )
			p.cat.follower.once( 'animationcomplete-' + Cat.CATWALKFRONT, () => {
				p.cat.follower.setRotation( 0 )
				p.cat.follower.setFlipX( true )
				p.cat.follower.play({ key: Cat.CATSITDOWN })
				p.cat.follower.off( 'animationcomplete-' + Cat.CATSITDOWN )
				p.cat.follower.once( 'animationcomplete-' + Cat.CATSITDOWN, () => {
					p.cat.follower.emit( Cat.NEXTMOTION )
				})
			})
		})

		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Up.vec( endPoint.x,  endPoint.y ),
		])
		p.cat.follower.setPath( path, {
			duration: duration,
			delay: 1000,
			yoyo: false,
			repeat: 0,
			// ease: 'quad.inout',
			ease: ease,
			positionOnPath: true,
			rotateToPath: false,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				p.cat.follower.anims.stop()
				p.cat.follower.emit( 'animationcomplete-' + Cat.CATWALKFRONT )
			},
		})
	},

	walkFromLeftOfAtzeToBar: ( p ) => {
		const duration = 6000
		p.cat.nextMotions = p.nextMotions ? p.nextMotions : [
			// Cat.idle({ cat: p.cat, duration: 600000 }),
			Cat.idle,
			motions.jumpOnBar,
			// motions.walkFromLeftOfAtzeToBar,
		]
		const ease = Phaser.Math.Easing.Linear

		p.cat.follower.setRotation( 0 * Math.PI )
		p.cat.follower.setFlipX( true )
		p.cat.follower.setDepth( 6 )

		p.cat.follower.scene.tweens.add({
			targets: p.cat.follower,
			scale: 0.8 * p.cat.fullScale,
			duration: duration,
			ease: ease,
		})
		p.cat.follower.play({ key: Cat.CATGETUP })
		p.cat.follower.off(  'animationcomplete-' + Cat.CATGETUP )
		p.cat.follower.once( 'animationcomplete-' + Cat.CATGETUP, () => {
			p.cat.follower.play({ key: Cat.CATWALKFRONT, repeat: 0, frameRate: 5 })
			p.cat.follower.off(  'animationcomplete-' + Cat.CATWALKFRONT )
			p.cat.follower.once( 'animationcomplete-' + Cat.CATWALKFRONT, () => {
				p.cat.follower.play({ key: Cat.CATTURNSIDEWAYS })
				p.cat.follower.off(  'animationcomplete-' + Cat.CATTURNSIDEWAYS )
				p.cat.follower.once( 'animationcomplete-' + Cat.CATTURNSIDEWAYS, () => {
					// p.cat.follower.setRotation( -0.08 * Math.PI )
					p.cat.follower.setRotateToPath( true, 10 )
					p.cat.follower.play({ key: Cat.CATWALK })
					p.cat.follower.off(  'animationcomplete-' + Cat.CATWALK )
					p.cat.follower.once( 'animationcomplete-' + Cat.CATWALK, () => {
						p.cat.follower.setRotation( 0 )
						p.cat.follower.play({ key: Cat.CATSITDOWN })
						p.cat.follower.off( 'animationcomplete-' + Cat.CATSITDOWN )
						p.cat.follower.once( 'animationcomplete-' + Cat.CATSITDOWN, () => {
							p.cat.follower.emit( Cat.NEXTMOTION )
						})
					})
				})
			})
		})

		const path = new Phaser.Curves.Path( p.cat.follower.x, p.cat.follower.y ).splineTo([
			Up.vec( 335 * s, 400 * s),
			Up.vec( 355 * s, 415 * s),
			Up.vec( 425 * s, 410 * s),
			Up.vec( 475 * s, 400 * s),
			Up.vec( 550 * s, 370 * s),
		])

		p.cat.follower.setPath( path, {
			duration: duration,
			delay: 1000,
			yoyo: false,
			repeat: 0,
			// ease: 'quad.inout',
			ease: ease,
			positionOnPath: true,
			rotateToPath: false,
			onComplete: () => {
				p.cat.follower.setRotation( 0.0 * Math.PI )
				p.cat.follower.anims.stop()
				p.cat.follower.emit( 'animationcomplete-' + Cat.CATWALK )
			},
		})
	},
}


