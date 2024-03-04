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

import { game, getState, addState, w, h, s } from '../constants'
import { debug, log } from '../utils/general'
import * as Set from '../utils/set'
import * as Ug from '../utils/general'
import * as Up from '../utils/phaser'

import * as Cat from '../sprites/cat'
import * as Inventory from '../utils/inventory'

/* Main part */

// enum Position {
// 	floorFront = 'floorFront',
// 	barFront = 'barFront',
// 	barEnd = 'barEnd',
// }


export default class Foyer extends Phaser.Scene {

	constructor() {
		super( game.scenes.FOYER )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		this.events.once( Up.ASSETSLOADED, () => { go( this ) } )
		Inventory.load({ game: game, scene: this })
		Up.loadAssets({ game: game, scene: this })
	}

	// update() {
	// }
}

function go ( scene: Phaser.Scene ): void {
	// Ambience
	Up.addBackground({ game: game, scene: scene, key: game.images.FOYER.BACKGROUND.key })
	Up.addAmbience({ game: game, scene: scene, key: game.soundsPersistant.AMBIENCE.JAZZ.key, volume: game.soundsPersistant.AMBIENCE.JAZZ.volume, fadeIn: 3000 })

	// Sounds
	let currentTalk: Phaser.Sound.BaseSound

	const woIstDennNur = scene.sound.get( game.sounds.FOYER.WOISTDENNNUR.key )
	const ferdiesTrompete = scene.sound.get( game.sounds.FOYER.FERDISTROMPETE.key )
	const ohHallo = scene.sound.get( game.sounds.FOYER.OHHALLO.key )
	const obenImSpielzimmer = scene.sound.get( game.sounds.FOYER.OBENIMSPIELZIMMER.key )

	const atzesSounds = [ woIstDennNur, ferdiesTrompete, ohHallo, obenImSpielzimmer ]

	const snowman_hey = Up.audio.add({ scene: scene, sound: game.sounds.FOYER.snowman_hey })
	const wastebasket_hey = Up.audio.add({ scene: scene, sound: game.sounds.FOYER.wastebasket_hey })

	// Objects
	const snorlax = scene.add.sprite( 500 * s, 257 * s, game.sprites.FOYER.SNORLAX.key ).setScale( 0.5 )
	snorlax.anims.create({
		key: 'snorlaxSnooze',
		frameRate: 5,
		repeat: -1,
		repeatDelay: 7000,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.SNORLAX.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.SNORLAX.key, {
				start: 0,
				end: 0,
			}),
		],
	})
	snorlax.play( 'snorlaxSnooze' )

	const choco = scene.add.sprite( 522 * s, 270 * s, game.sprites.FOYER.CHOCO.key )
	choco.setFlipX(true)
	choco.anims.create({
		key: 'foyerchoco',
		frameRate: 7,
		repeat: -1,
		repeatDelay: 1500,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.CHOCO.key, {
				start: 0,
				end: 7,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.CHOCO.key, {
				start: 0,
				end: 0,
			}),
		],
	})
	choco.play( 'foyerchoco' )

	// Snowman
	const snowmanHead = scene.add.sprite(    277 * s, 289 * s, game.sprites.FOYER.SNOWMAN.key ).setOrigin( 0 ).setInteractive()
	const snowman     = scene.add.rectangle( 277 * s, 285 * s, 30 * s, 70 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	snowmanHead.anims.create({
		key: 'talk',
		frameRate: 5,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.SNOWMAN.key, {
				start: 1, end: 18,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.SNOWMAN.key, {
				start: 17, end: 0,
			}),
		],
	})
	snowman.off( Phaser.Input.Events.POINTER_UP )
	snowman.once( Phaser.Input.Events.POINTER_UP, snowmanTalk )
	function snowmanTalk () {
		if ( atzesSounds.some( sound => sound.isPlaying ) ) return

		currentTalk?.stop()
		snowmanHead.play( 'talk' )
		currentTalk = Up.audio.play({ scene: scene, audio: snowman_hey }).sound
		Array("complete", "stop").forEach( (event: string) => snowman_hey.sound.on( event, () => {
			snowmanHead.stop().setFrame( 0 )
			snowman.once( Phaser.Input.Events.POINTER_UP, snowmanTalk )
		}))
	}

	// Wastebasket
	const wastebasketHead = scene.add.sprite(    624 * s, 328 * s, game.sprites.FOYER.WASTEBASKET.key ).setOrigin( 0 ).setInteractive()
	const wastebasket     = scene.add.rectangle( 623 * s, 330 * s, 31 * s, 52 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	wastebasketHead.anims.create({
		key: 'talk',
		frameRate: 5,
		repeat: -1,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.WASTEBASKET.key, {
				start: 1, end: 19,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.WASTEBASKET.key, {
				start: 18, end: 0,
			}),
		],
	})
	wastebasket.off( Phaser.Input.Events.POINTER_UP )
	wastebasket.once( Phaser.Input.Events.POINTER_UP, wastebasketTalk )
	function wastebasketTalk () {
		if ( atzesSounds.some( sound => sound.isPlaying ) ) return

		currentTalk?.stop()
		wastebasketHead.play( 'talk' )
		currentTalk = Up.audio.play({ scene: scene, audio: wastebasket_hey }).sound
		Array("complete", "stop").forEach( (event: string) => wastebasket_hey.sound.on( event, () => {
			wastebasketHead.stop().setFrame( 0 )
			wastebasket.once( Phaser.Input.Events.POINTER_UP, wastebasketTalk )
		}))
	}

	// Cashier
	if ( Set.toArray( getState().peopleFound ).length > 2 ) {
		const cashier     = scene.add.image(  695 * s, 253 * s, game.images.FOYER.CASHIER.key )
		const cashierHead = scene.add.sprite( 680.2 * s, 248.7 * s, game.sprites.FOYER.CASHIERHEAD.key ).setOrigin( 0 ).setInteractive()

		cashierHead.anims.create({
			key: 'blink',
			frameRate: 5,
			repeat: 0,
			delay: 3000,
			showBeforeDelay: true,
			skipMissedFrames: true,
			frames: [
				...scene.anims.generateFrameNumbers( game.sprites.FOYER.CASHIERHEAD.key, {
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
				...scene.anims.generateFrameNumbers( game.sprites.FOYER.CASHIERHEAD.key, {
					start: 5, end: 10,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.FOYER.CASHIERHEAD.key, {
					start: 9, end: 4,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.FOYER.CASHIERHEAD.key, {
					start: 5, end: 10,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.FOYER.CASHIERHEAD.key, {
					start: 9, end: 4,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.FOYER.CASHIERHEAD.key, {
					start: 5, end: 10,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.FOYER.CASHIERHEAD.key, {
					start: 0, end: 3,
				}),
				...scene.anims.generateFrameNumbers( game.sprites.FOYER.CASHIERHEAD.key, {
					start: 2, end: 0,
				}),
			],
		})

		cashierHead.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'blink' )
		cashierHead.on(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'blink', () => {
			const dice = Ug.randomInt( 0, 20000 )
			if ( dice < 5000 ) {
				cashierHead.play({ key: 'blink', delay: dice } )
				return
			}
			const delay     = Ug.randomInt( 1000, 8000 )
			const stopAfter = Ug.randomInt( 4000, 16000 )
			scene.time.delayedCall( delay, () => {
				cashierHead.play( 'talk' )
				scene.time.delayedCall( stopAfter, () => {
					cashierHead.play( 'blink' )
				})
			})
		})
		cashierHead.play( 'blink' )
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


	// Atze
	const atze = scene.add.sprite( 362 * s, 274 * s, game.sprites.FOYER.ATZE.key ).setOrigin( 0, 0 )
	atze.setScale( 0.85 )
	atze.setDepth( 5 )
	const atzeHead = scene.add.sprite( 412 * s, 303 * s, game.sprites.FOYER.ATZETALKING.key, 0 ).setOrigin( 0, 0 )
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
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZE.key, {
				start: 0,
				end: 4,
			}),
			...Array.from( { length: 10 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZE.key, {
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
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZE.key, {
				start: 6,
				end: 10,
			}),
			...Array.from( { length: 10 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZE.key, {
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
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZE.key, {
				start: 12,
				end: 16,
			}),
			...Array.from( { length: 10 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZE.key, {
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
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZE.key, {
				start: 18,
				end: 22,
			}),
			...Array.from( { length: 10 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZE.key, {
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
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 9,
				end: 11,
			}),
			...Array.from( { length: 3 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			// ...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
			// 	start: 0,
			// 	end: 2,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
			// 	start: 1,
			// 	end: 0,
			// }),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
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
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			// ...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
			// 	start: 9,
			// 	end: 11,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
			// 	start: 0,
			// 	end: 2,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
			// 	start: 1,
			// 	end: 0,
			// }),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
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
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 6,
			}),
			// ...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
			// 	start: 9,
			// 	end: 11,
			// }),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 9,
				end: 11,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 9,
				end: 11,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 2,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 6,
			}),
			...Array.from( { length: 5 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
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
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 2,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 9,
				end: 11,
			}),
			...Array.from( { length: 1 }, () =>
				scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
					start: 0,
					end: 6,
				})
			).flat(),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 3,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 2,
				end: 0,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 9,
				end: 11,
			}),
			// ...Array.from( { length: 3 }, () =>
			// 	scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
			// 		start: 0,
			// 		end: 6,
			// 	})
			// ).flat(),
			// ...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
			// 	start: 0,
			// 	end: 2,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
			// 	start: 1,
			// 	end: 0,
			// }),
			// ...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
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
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 4,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 2,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
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
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 0,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 4,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 2,
				end: 6,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 5,
				end: 1,
			}),
			...scene.anims.generateFrameNumbers( game.sprites.FOYER.ATZETALKING.key, {
				start: 8,
				end: 12,
			}),
		],
	})


	const atzeExplain = () => {
		currentTalk?.stop()
		atzeHead.off( Phaser.Animations.Events.ANIMATION_START )
		atzeHead.once( Phaser.Animations.Events.ANIMATION_START, () => {
			obenImSpielzimmer.play({ volume: game.sounds.FOYER.OBENIMSPIELZIMMER.volume })
		})
		atzeHead.play( 'obenImSpielzimmer' )
		obenImSpielzimmer.off( Phaser.Sound.Events.COMPLETE )
		obenImSpielzimmer.once( Phaser.Sound.Events.COMPLETE, () => {
			atzeHead.stopOnFrame( atzeHead.anims.get( 'obenImSpielzimmer' ).frames[ 0 ] )
			scene.time.delayedCall( 2000, () => {
				atzeHead.play( 'atzeTalking' )
				atze.play( 'atzeRabbit' )

				atzeFrame.off( Phaser.Input.Events.POINTER_UP )
				atzeFrame.once( Phaser.Input.Events.POINTER_UP, () => {
					atzeExplain()
				})
			})
		})
	}
	function atzeSpeak ( topic: string ) {
		const sound = scene.sound.get( game.sounds.FOYER[ topic ].key )
		const volume = game.sounds.FOYER[ topic ].volume
		atzeHead.play( 'talking' )
		sound.play({ volume: volume })
		sound.off( Phaser.Sound.Events.COMPLETE )
		sound.once( Phaser.Sound.Events.COMPLETE, () => {
			atzeHead.stop().setFrame( 0 )
			scene.time.delayedCall( 2000, () => {
				atzeHead.play( 'atzeTalking' )
				atze.play( 'atzeRabbit' )
			})
		})
	}

	if ( !getState().metAtze ) {
		scene.time.delayedCall( 4000, () => {
			atzeHead.off( Phaser.Animations.Events.ANIMATION_START )
			atzeHead.once( Phaser.Animations.Events.ANIMATION_START, () => {
				atze.play( 'atzeBow' )
				console.log( 'wodennnur-start' )
				woIstDennNur.play({ volume: game.sounds.FOYER.WOISTDENNNUR.volume })
				console.log( 'wodennnur-end' )
				woIstDennNur.off( Phaser.Sound.Events.COMPLETE )
				woIstDennNur.once( Phaser.Sound.Events.COMPLETE, () => {
					atzeHead.stopOnFrame( atzeHead.anims.get( 'woIstDennNur' ).frames[ 0 ] )
					atzeHead.playAfterDelay( 'ferdiesTrompete', 3500 )
					atzeHead.off( Phaser.Animations.Events.ANIMATION_START )
					atzeHead.once( Phaser.Animations.Events.ANIMATION_START, () => {
						ferdiesTrompete.play({ volume: game.sounds.FOYER.FERDISTROMPETE.volume })
					})
				})
				ferdiesTrompete.off( Phaser.Sound.Events.COMPLETE )
				ferdiesTrompete.once( Phaser.Sound.Events.COMPLETE, () => {
					atzeHead.stopOnFrame( atzeHead.anims.get( 'ferdiesTrompete' ).frames[ 0 ] )
					atzeHead.playAfterDelay( 'ohHallo', 100 )
					atzeHead.off( Phaser.Animations.Events.ANIMATION_START )
					atzeHead.once( Phaser.Animations.Events.ANIMATION_START, () => {
						ohHallo.play({ volume: game.sounds.FOYER.OHHALLO.volume })
					})
				})
				ohHallo.off( Phaser.Sound.Events.COMPLETE )
				ohHallo.once( Phaser.Sound.Events.COMPLETE, () => {
					atzeHead.stopOnFrame( atzeHead.anims.get( 'ohHallo' ).frames[ 0 ] )
					atzeHead.playAfterDelay( 'obenImSpielzimmer', 2000 )
					atzeHead.off( Phaser.Animations.Events.ANIMATION_START )
					atzeHead.once( Phaser.Animations.Events.ANIMATION_START, () => {
						obenImSpielzimmer.play({ volume: game.sounds.FOYER.OBENIMSPIELZIMMER.volume })
					})
				})
				obenImSpielzimmer.off( Phaser.Sound.Events.COMPLETE )
				obenImSpielzimmer.once( Phaser.Sound.Events.COMPLETE, () => {
					atzeHead.stopOnFrame( atzeHead.anims.get( 'obenImSpielzimmer' ).frames[ 0 ] )
					addState({ metAtze: true })
					scene.time.delayedCall( 5000, () => {
						atzeHead.play( 'atzeTalking' )
						atze.play( 'atzeRabbit' )
						atze.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeBow' )
						atze.on( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeBow', () => { atze.play( 'atzeRabbit' ) })

						atzeFrame.off( Phaser.Input.Events.POINTER_UP )
						atzeFrame.once( Phaser.Input.Events.POINTER_UP, () => {
							atzeExplain()
						})
					})
				})
			})
			atzeHead.play( 'woIstDennNur' )
		})
	} else {
		scene.time.delayedCall( 1500, () => {
			atzeHead.play( 'atzeTalking' )
			atze.play( 'atzeRabbit' )
		})
		atze.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeBow' )
		atze.on( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeBow', () => { atze.play( 'atzeRabbit' ) })

		atzeFrame.off( Phaser.Input.Events.POINTER_UP )
		atzeFrame.once( Phaser.Input.Events.POINTER_UP, () => {
			atzeExplain()
		})
	}
	atze.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeRabbit' )
	atze.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeWishMachine' )
	atze.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeGold' )
	atze.on( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeRabbit', () => { atze.play( 'atzeWishMachine' ) })
	atze.on( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeWishMachine', () => { atze.play( 'atzeGold' ) })
	atze.on( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atzeGold', () => { atze.play( 'atzeBow' ) })

	// Stray Items
	const icons = Inventory.getIcons({ game: game, scene: scene })
	for ( let [ index, item ] of Object.entries( icons ) ) {
		( item as Phaser.GameObjects.Image ).off( Phaser.Input.Events.POINTER_UP ).on( Phaser.Input.Events.POINTER_UP, () => {
			console.log( 'clicked' )
			atzeSpeak( 'found_' + index )
		})
	}

	const chest = scene.add.image( 715 * s, 395 * s, game.images.inventory.chest.key )
		.setOrigin( 0 ).setInteractive()
	chest.on( 'pointerup', () => { Inventory.toggleChest( icons) })

	const trumpet = scene.add.image( 695 * s, 253 * s, game.images.FOYER.trumpet.key ).setInteractive()
	trumpet.on( 'pointerup', () => { Inventory.add( 'knife' ) })


	// EXits
	const piano = scene.add.rectangle( 370 * s, 265 * s, 65 * s, 50 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: piano,
		nextScene: game.scenes.PIANO,
	})

	const entranceExit = scene.add.rectangle( 0, 180 * s, 160 * s, 450 * s, 0x553366)
		.setOrigin( 0 ).setDepth( 11 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: entranceExit,
		nextScene: game.scenes.ENTRANCE,
		soundsToKeep: [
			game.soundsPersistant.AMBIENCE.CITYRAIN,
			game.soundsPersistant.AMBIENCE.JAZZ,
		],
	})
	const stairs1 = scene.add.rectangle( 210 * s, 110 * s, 145 * s, 100 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: stairs1,
		nextScene: game.scenes.HALLWAY,
	})
	const stairs2 = scene.add.rectangle( 295 * s, 210 * s, 50 * s, 35 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: stairs2,
		nextScene: game.scenes.HALLWAY,
	})
	const backstage = scene.add.rectangle( 435 * s, 225 * s, 40 * s, 50 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: backstage,
		nextScene: game.scenes.BACKSTAGE,
	})
	const trailers = scene.add.rectangle( 710 * s, 140 * s, 90 * s, 57 * s, 0x553366 )
		.setOrigin( 0 ).setDepth( 2 ).setInteractive().setAlpha( debug ? 0.5 : 0.001 )
	Up.addExit({
		game: game,
		scene: scene,
		exit: trailers,
		nextScene: game.scenes.TRAILERS,
	})

	log(`${scene.scene.key} created.`)
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
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.anims.play({ key: Cat.CATWALK })
		})
		p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALK )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALK, () => {
			p.cat.follower.play({ key: Cat.CATSITDOWN})
		})
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
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
				p.cat.follower.emit( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALK )
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

		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.setFlipX( false )
			p.cat.follower.anims.timeScale = 1.5
			p.cat.follower.play({ key: Cat.CATJUMP })
		})
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP, () => {
			p.cat.follower.setFlipX( true )
			p.cat.follower.anims.timeScale = 2
			p.cat.follower.play({ key: Cat.CATSITDOWN })
			p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
			p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
				p.cat.follower.anims.timeScale = 1
				p.cat.follower.play( Cat.CATGETUP )
				p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
				p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
					p.cat.follower.setFlipX( false )
					p.cat.follower.anims.timeScale = 1
					p.cat.follower.play( Cat.CATSITDOWN )
					p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
					p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
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
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.chain([
				{ key: Cat.CATWALK },
			])
		})
		p.cat.follower.play(
			{ key: Cat.CATGETUP }
		)

		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
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
		p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.setFlipX( true )
			p.cat.follower.setRotation( -0.5 * Math.PI )
			p.cat.follower.play({ key: Cat.CATJUMP })
			p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP )
			p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATJUMP, () => {
				p.cat.follower.setFlipX( false )
				p.cat.follower.setRotation( 0 )
				p.cat.follower.play({ key: Cat.CATSITDOWN })
				p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
				p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
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
		p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			// p.cat.follower.setRotation( -0.25 * Math.PI )
			p.cat.follower.play({ key: Cat.CATWALKFRONT })
			p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALKFRONT )
			p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALKFRONT, () => {
				p.cat.follower.setRotation( 0 )
				p.cat.follower.setFlipX( true )
				p.cat.follower.play({ key: Cat.CATSITDOWN })
				p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
				p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
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
				p.cat.follower.emit( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALKFRONT )
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
		p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP )
		p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATGETUP, () => {
			p.cat.follower.play({ key: Cat.CATWALKFRONT, repeat: 0, frameRate: 5 })
			p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALKFRONT )
			p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALKFRONT, () => {
				p.cat.follower.play({ key: Cat.CATTURNSIDEWAYS })
				p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATTURNSIDEWAYS )
				p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATTURNSIDEWAYS, () => {
					// p.cat.follower.setRotation( -0.08 * Math.PI )
					p.cat.follower.setRotateToPath( true, 10 )
					p.cat.follower.play({ key: Cat.CATWALK })
					p.cat.follower.off(  Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALK )
					p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALK, () => {
						p.cat.follower.setRotation( 0 )
						p.cat.follower.play({ key: Cat.CATSITDOWN })
						p.cat.follower.off( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN )
						p.cat.follower.once( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATSITDOWN, () => {
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
				p.cat.follower.emit( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + Cat.CATWALK )
			},
		})
	},
}


