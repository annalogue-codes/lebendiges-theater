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
import { log, randomElementOf } from '../utils/general'
import * as Up from '../utils/phaser'
import { game } from '../constants'


/* Keys for animations */
// const SITTING = 'sitting'
const CATSLEEPING = 'catSleeping'
const CATIDLE = 'catIdle'
const CATSIT = 'catSit'
const CATSITDOWN = 'catSitDown'
const CATGETUP = 'catGetUp'
const CATWALK = 'catWalk'
const CATJUMP = 'catJump'
const CATWALKFRONT = 'catWalkFront'
const CATTURNFRONT = 'catTurnFront'
const CATTURNSIDEWAYS = 'catTurnSideways'

const NEXTMOTION = 'nextmotion'
const NEXTSOUND = 'nextsound'

type Cat = {
	follower: Phaser.GameObjects.PathFollower,
	fullScale: number,
	sounds: {
		meow: { key: string, volume: number },
		meowmeowmeow: { key: string, volume: number },
		attention: { key: string, volume: number },
		purr: { key: string, volume: number },
	},
	randomSounds: { key: string, volume: number }[],
	soundTimeInterval: [ number, number ],
	mute: boolean,
	nextMotions: [ Motion, ...Motion[] ],
	position?: string,
}
type Motion = (p: { cat: Cat, nextMotions?: [Motion, ...Motion[]], duration?: number }) => void

const newCat = ( scene: Phaser.Scene, startX: number, startY: number, scale: number ): Cat => {

	const startPath = new Phaser.Curves.Path( startX, startY )
	const catFullScale = 0.8
	const follower = new Phaser.GameObjects.PathFollower( scene, startPath, startX, startY, game.sprites.CAT.CAT.key, 18 )
		.addToDisplayList()
		.addToUpdateList()
		.setFlipX( true )
		.setScale( scale * catFullScale )

	follower.anims.create({
		key: CATIDLE,
		frameRate: 4,
		repeat: -1,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( game.sprites.CAT.CAT.key, {
			start: 18,
			end: 18,
		}),
	})
	follower.anims.create({
		key: CATSLEEPING,
		frameRate: 2,
		repeat: -1,
		yoyo: true,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNames( game.sprites.CAT.CATSLEEPING.key, {
			start: 0,
			end: 3,
		}),
		repeatDelay: 5000,
	})
	follower.anims.create({
		key: CATGETUP,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( game.sprites.CAT.CAT.key, {
			start: 20,
			end: 23,
		}),
	})
	follower.anims.create({
		key: CATSITDOWN,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( game.sprites.CAT.CAT.key, {
			start: 13,
			end: 18,
		}),
	})
	follower.anims.create({
		key: CATWALK,
		frameRate: 10,
		repeat: -1,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( game.sprites.CAT.CAT.key, {
			start: 0,
			end: 11,
		}),
	})
	follower.anims.create({
		key: CATWALKFRONT,
		frameRate: 5,
		repeat: -1,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNames( game.sprites.CAT.CAT.key, {
			start: 58,
			end: 62,
		}),
	})
	follower.anims.create({
		key: CATTURNFRONT,
		frameRate: 5,
		repeat: 0,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNames( game.sprites.CAT.CAT.key, {
			start: 52,
			end: 56,
		}),
	})
	follower.anims.create({
		key: CATTURNSIDEWAYS,
		frameRate: 5,
		repeat: 0,
		skipMissedFrames: true,
		frames: [
			...scene.anims.generateFrameNames( game.sprites.CAT.CAT.key, {
				start: 56,
				end: 55,
			}),
			...scene.anims.generateFrameNames( game.sprites.CAT.CAT.key, {
				start: 53,
				end: 54,
			}),
		]
	})
	follower.anims.create({
		key: CATJUMP,
		frameRate: 5,
		repeat: 0,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( game.sprites.CAT.CAT.key, {
			start: 64,
			end: 69,
		}),
	})
	// })

	// Interactivity
	follower.setInteractive()

	// scene.sys.events.once( Up.SHUTTINGDOWN, () => {
	// 	Up.sound.fadeOut({
	// 		scene: scene,
	// 		sounds: [ purr ],
	// 		duration: 500,
	// 	})
	// })

	// Return
	const cat: Cat = {
		follower: follower,
		fullScale: catFullScale,
		sounds: {
			meow:         game.soundsPersistant.CAT.MEOW,
			meowmeowmeow: game.soundsPersistant.CAT.MEOWMEOWMEOW,
			attention:    game.soundsPersistant.CAT.ATTENTION,
			purr:         game.soundsPersistant.CAT.PURR,
		},
		randomSounds: [],
		soundTimeInterval: [10, 25],
		mute: false,
		nextMotions: [idle],
		position: undefined,
	}

	const purr = cat.follower.scene.sound.get( game.soundsPersistant.CAT.PURR.key ) as Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
	purr.on('complete', () => {
		follower.off('pointerover')
		follower.once('pointerover', () => {
			purr.play({ volume: 0.7 })
		})
	})
	purr.on('stop', () => {
		follower.off('pointerover')
		follower.once('pointerover', () => {
			purr.play({ volume: 0.7 })
		})
	})
	follower.off('pointerover')
	follower.once('pointerover', () => {
		purr.play({ volume: 0.7 })
	})
	follower.on('pointerout', () => {
		Up.audio.fadeOut({
			scene: scene,
			sounds: [ purr ],
			duration: 500,
		})
	})

	scene.events.off( 'soloOn' )
	scene.events.on( 'soloOn', (e: {solo: string[] }) => {
		if ( e.solo.includes( 'cat' ) ) return
		cat.mute = true
	})
	scene.events.off( 'soloOff' )
	scene.events.on( 'soloOff', () => {
		cat.mute = false
	})
	scene.events.off( Phaser.Scenes.Events.PAUSE )
	scene.events.on( Phaser.Scenes.Events.PAUSE, () => {
		cat.mute = true
		// stopRandomCatSounds({ cat: cat })
	})
	scene.events.off( Phaser.Scenes.Events.RESUME )
	scene.events.on( Phaser.Scenes.Events.RESUME, () => {
		cat.mute = false
		// playRandomCatSounds({ cat: cat, preDelay: true })
	})
	follower.off( NEXTMOTION )
	follower.on( NEXTMOTION, () => {
		playNextMotion({ cat: cat })
	})
	scene.events.off( Up.SHUTTINGDOWN )
	scene.events.once( Up.SHUTTINGDOWN, () => {
		follower.off( NEXTMOTION )
		stopRandomCatSounds({ cat: cat })
	})

	return cat
}

const playNextRandomCatSound = (p: { cat: Cat }) => {
	log( 'follower: nextsound' )
	p.cat.follower.off( NEXTSOUND )

	const next = randomElementOf( p.cat.randomSounds )
	if ( !next ) return

	p.cat.follower.once( NEXTSOUND, () => {
		playNextRandomCatSound({ cat: p.cat })
	})
	if ( !p.cat.mute ) p.cat.follower.scene.sound.get( next.key ).play({ volume: next.volume })
	const [ tmin, tmax ] = p.cat.soundTimeInterval
	const rndSeconds = Phaser.Math.Between( tmin, tmax )
	p.cat.follower.scene.time.delayedCall( rndSeconds * 1000, () => {
		p.cat.follower.emit( NEXTSOUND )
	})
}
const playRandomCatSounds = (p: { cat: Cat, preDelay?: boolean }) => {
	log( 'playRandomCatSounds' )
	p.cat.follower.off( NEXTSOUND )

	if ( !p.cat.randomSounds.length ) return

	p.cat.follower.once( NEXTSOUND, () => {
		playNextRandomCatSound({ cat: p.cat })
	})
	if (p.preDelay) {
		const rndSeconds = Phaser.Math.Between( 5, 15 )
		p.cat.follower.scene.time.delayedCall( rndSeconds * 1000, () => {
			p.cat.follower.emit( NEXTSOUND )
		})
	} else {
		p.cat.follower.emit( NEXTSOUND )
	}
}
const stopRandomCatSounds = (p: { cat: Cat }) => {
	log( 'stopRandomCatSounds' )
	p.cat.follower.off( NEXTSOUND )
}

const playNextMotion = (p: { cat: Cat }) => {
	log('next motion')
	const nextMotion = randomElementOf( p.cat.nextMotions )
	p.cat.follower.anims.stop()
	nextMotion({ cat: p.cat })
}

const idle: Motion = async ( p ) => {
	// p.cat.follower.removeListener( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + CATIDLE )
	log('idle started')
	p.cat.follower.play({ key: CATIDLE })

	const duration = p.duration ? p.duration : Phaser.Math.Between( 100, 5000 )
	p.cat.follower.scene.time.delayedCall( duration, () => {
		p.cat.follower.emit( NEXTMOTION )
	})
}

const sitDown = (p: { cat: Cat }) => {
	// p.cat.follower.pathTween.stop()
	// const tweens = scene.tweens.getTweensOf( cat.follower )
	p.cat.follower.play( CATSITDOWN )
}

export type {
	Cat,
	Motion
}
export {
	// constants
	CATSLEEPING,
	CATIDLE,
	CATSIT,
	CATSITDOWN,
	CATGETUP,
	CATWALK,
	CATWALKFRONT,
	CATJUMP,
	CATTURNFRONT,
	CATTURNSIDEWAYS,
	NEXTMOTION,
	// functions: initialization
	newCat,
	// functions: sounds
	playRandomCatSounds,
	stopRandomCatSounds,
	// functions: motions
	idle,
	sitDown
}
