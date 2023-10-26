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
import _ from 'lodash'
import { sleep, log } from '../helpers/general'
import * as Ph from '../helpers/special'
import { SOUNDS } from '../constants'


/* Keys for animations */
// const SITTING = 'sitting'

const CAT = 'cat'
const CATIDLE = 'catIdle'
const CATSIT = 'catSit'
const CATSITDOWN = 'catSitDown'
const CATGETUP = 'catGetUp'
const CATWALK = 'catWalk'
const CATJUMP = 'catJump'
const CATLAND = 'catLand'

const NEXTMOTION = 'nextmotion'

const loadCat = ( scene: Phaser.Scene ) => {
	scene.load.spritesheet(CAT, 'images/cat.png', { frameWidth: 250, frameHeight: 250 } )
	scene.load.audio( SOUNDS.MEOW, ['sounds/cat/nya.webm'] )
	scene.load.audio( SOUNDS.MEOWMEOWMEOW, ['sounds/cat/meowmeowmeow.webm'] )
	scene.load.audio( SOUNDS.ATTENTION, ['sounds/cat/wants-attention.webm'] )
	scene.load.audio( SOUNDS.PURR, ['sounds/cat/purr.webm'] )
	scene.load.once( Phaser.Loader.Events.COMPLETE, () => {
		scene.sound.add( SOUNDS.MEOW, { volume: 1 } )
		scene.sound.add( SOUNDS.MEOWMEOWMEOW, { volume: 0.2 } )
		scene.sound.add( SOUNDS.ATTENTION )
		scene.sound.add( SOUNDS.PURR, { volume: 0.7 } )
	})
}

type Cat = {
	follower: Phaser.GameObjects.PathFollower,
	fullScale: number,
	sounds: {
		meow: Phaser.Sound.BaseSound,
		meowmeowmeow: Phaser.Sound.BaseSound,
		attention: Phaser.Sound.BaseSound,
		purr: Phaser.Sound.BaseSound,
	},
	randomSounds: Phaser.Sound.BaseSound[],
	nextMotions: [Motion, ...Motion[]],
	position?: string,
}
type Motion = (p: { cat: Cat, nextMotions?: [Motion, ...Motion[]], duration?: number }) => void

const newCat = ( scene: Phaser.Scene, startX: number, startY: number, scale: number ): Cat => {

	const startPath = new Phaser.Curves.Path( startX, startY )
	const catFullScale = 0.8
	const follower = new Phaser.GameObjects.PathFollower( scene, startPath, startX, startY, CAT, 18 )
		.addToDisplayList()
		.addToUpdateList()
		.setFlipX( true )
		.setScale( scale * catFullScale )

	follower.anims.create({
		key: CATIDLE,
		frameRate: 4,
		repeat: -1,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( CAT, {
			start: 18,
			end: 18,
		}),
	})
	// scene.anims.create({
	// 	key: CATSIT,
	// 	frameRate: 1,
	// 	repeat: 0,
	// 	skipMissedFrames: true,
	// 	frames: scene.anims.generateFrameNames( CAT, {
	// 		prefix: 'sit_',
	// 		start: 5,
	// 		end: 5,
	// 		zeroPad: 0,
	// 	}),
	// })
	follower.anims.create({
		key: CATGETUP,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( CAT, {
			start: 20,
			end: 23,
		}),
	})
	follower.anims.create({
		key: CATSITDOWN,
		frameRate: 6,
		repeat: 0,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( CAT, {
			start: 13,
			end: 18,
		}),
	})
	follower.anims.create({
		key: CATWALK,
		frameRate: 10,
		repeat: -1,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( CAT, {
			start: 0,
			end: 11,
		}),
	})
	follower.anims.create({
		key: CATJUMP,
		frameRate: 5,
		repeat: 0,
		skipMissedFrames: true,
		frames: scene.anims.generateFrameNumbers( CAT, {
			start: 64,
			end: 69,
		}),
	})
	// scene.anims.create({
	// 	key: CATLAND,
	// 	frameRate: 15,
	// 	repeat: 0,
	// 	skipMissedFrames: true,
	// 	frames: scene.anims.generateFrameNames( CAT, {
	// 		prefix: 'jumpstart_',
	// 		start: 11,
	// 		end: 0,
	// 		zeroPad: 0,
	// 	})
	// })

	// Interactivity
	follower.setInteractive()

	const meow = scene.sound.get( SOUNDS.MEOW )
	const meowmeowmeow = scene.sound.get( SOUNDS.MEOWMEOWMEOW )
	const attention = scene.sound.get( SOUNDS.ATTENTION )
	const purr = scene.sound.get( SOUNDS.PURR )
	purr.on('complete', () => {
		follower.once('pointerover', () => {
			purr.play({ volume: 1 })
		})
	})
	purr.on('stop', () => {
		follower.once('pointerover', () => {
			purr.play({ volume: 1 })
		})
	})
	follower.once('pointerover', () => {
		purr.play({ volume: 1 })
	})
	follower.on('pointerout', () => {
		Ph.sound.fadeOut({
			scene: scene,
			sounds: [ purr ],
			duration: 500,
		})
	})
	// scene.sys.events.once( Ph.SHUTTINGDOWN, () => {
	// 	Ph.sound.fadeOut({
	// 		scene: scene,
	// 		sounds: [ purr ],
	// 		duration: 500,
	// 	})
	// })

	// Return
	const cat = {
		follower: follower,
		fullScale: catFullScale,
		sounds: {
			meow: meow,
			meowmeowmeow: meowmeowmeow,
			attention: attention,
			purr: purr,
		},
		randomSounds: [
			meow,
			meow,
			meow,
			meowmeowmeow,
		],
		position: undefined,
		nextMotions: [idle] as [Motion, ...Motion[]],
	}

	follower.on( NEXTMOTION, () => {
		playNextMotion({ cat: cat })
	})
	scene.sys.events.once( Ph.SHUTTINGDOWN, () => {
		follower.off( NEXTMOTION )
		follower.off( 'nextSound' )
	})

	return cat
}

const playNextRandomCatSound = async (p: { cat: Cat, preDelay?: boolean, timeInterval: [number, number] }) => {
	log( 'follower: nextsound')
	p.cat.follower.off( 'nextSound' )
	p.cat.follower.once( 'nextSound', (e: { timeInterval: [number, number] }) => {
		playNextRandomCatSound({ cat: p.cat, timeInterval: e.timeInterval })
	})
	const next = _.sample( p.cat.randomSounds )
	if (!next) return
	next.play()
	const [ tmin, tmax ] = p.timeInterval
	const rndSeconds = Phaser.Math.Between( tmin, tmax )
	await sleep( rndSeconds * 1000 )
	p.cat.follower.emit( 'nextSound', { timeInterval: p.timeInterval } )
}
const playRandomCatSounds = async (p: { cat: Cat, preDelay?: boolean, timeInterval?: [number, number] }) => {
	p.cat.follower.off( 'nextSound' )
	p.cat.follower.once( 'nextSound', (e: { timeInterval: [number, number] }) => {
		playNextRandomCatSound({ cat: p.cat, timeInterval: e.timeInterval })
	})
	const timeInterval = p.timeInterval || [ 10, 25 ]
	if (p.preDelay) {
		const rndSeconds = Phaser.Math.Between( 5, 15 )
		await sleep( rndSeconds * 1000 )
	}
	p.cat.follower.emit( 'nextSound', { timeInterval: timeInterval } )
}
const stopRandomCatSounds = (p: { cat: Cat }) => {
	p.cat.follower.off( 'nextSound' )
}

const playNextMotion = (p: { cat: Cat }) => {
	const nextMotion = _.sample( p.cat.nextMotions )
	log('next motion')
	nextMotion({ cat: p.cat })
}

const idle: Motion = async ( p ) => {
	// p.cat.follower.removeListener( Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + CATIDLE )
	log('idle started')
	p.cat.follower.play({ key: CATIDLE })

	const duration = p.duration ? p.duration : Phaser.Math.Between( 100, 5000 )
	await sleep( duration )

	p.cat.follower.emit( NEXTMOTION )
}

const sitDown = (p: { cat: Cat }) => {
	p.cat.follower.pathTween.stop()
	// const tweens = scene.tweens.getTweensOf( cat.follower )
	p.cat.follower.play( CATSITDOWN )
}

export type {
	Cat,
	Motion
}
export {
	// constants
	CAT,
	CATIDLE,
	CATSIT,
	CATSITDOWN,
	CATGETUP,
	CATWALK,
	CATJUMP,
	CATLAND,
	NEXTMOTION,
	// functions: initialization
	loadCat,
	newCat,
	// functions: sounds
	playRandomCatSounds,
	stopRandomCatSounds,
	// functions: motions
	idle,
	sitDown
}
