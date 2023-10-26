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
import { game, getState, setState } from '../constants'
import { log } from '../helpers/general'

const SHUTTINGDOWN = 'shuttingdown'

const changeFullscreen = ( scene: Phaser.Scene, start: boolean, stop: boolean ) => { return () => {
	if (stop && scene.scale.isFullscreen) {
		scene.scale.stopFullscreen()
		return
	}
	if (start && !scene.scale.isFullscreen) {
		scene.scale.startFullscreen()
		// scene.scale.lockOrientation( 'landscape-primary' )
		window.screen.orientation.unlock()
		window.screen.orientation.lock('landscape-primary')
			.catch((error) => {
				console.log( `Locking orientation failed with: ${error}` )
			})
	}
	return
}}
const toggleFullscreen = ( scene: Phaser.Scene ) => changeFullscreen( scene, true, true )
const startFullscreen = ( scene: Phaser.Scene ) => changeFullscreen( scene, true, false )
const stopFullscreen = ( scene: Phaser.Scene ) => changeFullscreen( scene, false, true )

const addBackground = ( scene: Phaser.Scene, key: string ) => {
	const background = scene.add.image( 0, 0, key ).setOrigin(0, 0)
		.setSize( game.width, game.height )
		.setDisplaySize( game.width, game.height )
	return background
}

const addAmbience = (p: {
	scene: Phaser.Scene,
	key: string,
	volume?: number,
	fadeIn?: number,
}) => {
	const ambience = p.scene.sound.get( p.key )

	if (ambience.isPlaying) return ambience

	ambience.play({
		volume: p.fadeIn ? 0 : (p.volume ? p.volume : 1),
		loop: true
	})
	if (p.fadeIn) {
		p.scene.tweens.add({
			targets: ambience,
			volume: p.volume ? p.volume : 1,
			duration: p.fadeIn,
		})
	}
	return ambience
}

const addExit = (p: {
	scene: Phaser.Scene,
	nextScene: string,
	exit: Phaser.GameObjects.GameObject,
	soundsToKeep?: Phaser.Sound.BaseSound[],
	pre?: () => void
}) => {
	p.exit.setInteractive()
	p.exit.once( Phaser.Input.Events.POINTER_UP, () => {
		exitTo({ scene: p.scene, nextScene: p.nextScene, soundsToKeep: p.soundsToKeep, pre: p.pre })
	})
}

const exitTo = (p: {
	scene: Phaser.Scene,
	nextScene: string,
	soundsToKeep?: Phaser.Sound.BaseSound[],
	pre?: () => void
}) => {
	if ( p.nextScene == p.scene.scene.key ) return
	if (p.pre) p.pre()

	p.scene.sys.events.emit( SHUTTINGDOWN )
	p.scene.scene.moveBelow( p.scene, p.nextScene )
	p.scene.scene.run( p.nextScene )
	console.log( `exitTo: ${p.nextScene}`)
	setState({ currentScene: p.nextScene })
	p.scene.add.tween({
		targets: p.scene.cameras.main,
		alpha: 0,
		duration: 3000,
		ease: Phaser.Math.Easing.Linear,
		onComplete: () => {
			p.scene.events.once( Phaser.Scenes.Events.SHUTDOWN, () => {
				console.log( `${p.scene.scene.key} has stopped.` )
			})
			p.scene.scene.stop()
		}
	})
	const soundsPlaying = p.scene.sound.getAllPlaying()
	const soundsToKeep = p.soundsToKeep ? p.soundsToKeep : []
	const soundsToFadeOut = soundsPlaying.filter( sound => !soundsToKeep.includes( sound ) )
	sound.fadeOut({ scene: p.scene, sounds: soundsToFadeOut, duration: 3000 })
}


const aniWithDuration = (p: { cat: Phaser.GameObjects.PathFollower, key: string, duration: number, fraction: number }) => {
	return {
		key: p.key,
		frameRate: p.cat.anims.get( p.key ).getTotalFrames() * 1000 / (p.fraction * p.duration),
	}
}
const vec  = (x: number, y: number) => new Phaser.Math.Vector2(x, y)

const sound = {
	fadeOut: (p: { scene: Phaser.Scene, sounds: Phaser.Sound.BaseSound[], duration: number }) => {
		p.sounds.forEach( oneSound => {
			p.scene.add.tween({
				targets: oneSound,
				volume: 0,
				duration: p.duration,
				ease: Phaser.Math.Easing.Linear,
				onComplete: () => {
					oneSound.stop()
				}
			})
		})
	}
}

export {
	SHUTTINGDOWN,
	sound,
	toggleFullscreen,
	startFullscreen,
	stopFullscreen,
	addBackground,
	addAmbience,
	addExit,
	exitTo,
	aniWithDuration,
	vec
}
