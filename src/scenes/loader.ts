
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

import { debug, log, onMobileDevice } from '../utils/general'
import * as Up from '../utils/phaser'
import { game, getState, addState, s } from '../constants'

export default class Loader extends Phaser.Scene {

	constructor() {
		super( game.scenes.LOADER )
	}

	// init() {
	// }

	// preload() {
	// 	Up.loadAssets( this )
	// }

	create() {
		Up.setState({ game: game, newState: { ...game.initialState, ...getState() } })
		/*
			background-color: #9e0059;
		*/
		// Images
		// load svg as bitmap: see https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Loader.LoaderPlugin-svg
		// this.load.svg('logo',   'logo.svg', { width: windowW, height: windowH } )
		// const svg = this.cache.text.get('writing')
		// const writing = `${style}<div style='display: grid; place-content: center; width: 100%; height: 100%;'>${svg}</div>${script}`
		const writing = `${style}<div id='dom-container'>${text}</div>${script}`
		const domElem = this.add.dom(0, 0, 'div', `width: ${100 / s}%; height: ${100 / s}%; scale: ${s}`).setOrigin(0).setHTML( writing )

		const container = document.getElementById('dom-container')
		const start = document.getElementById('start')
		const restart = document.getElementById('restart')

		if ( !container || !start || !restart ) { console.error( 'Could not access container or start element.' ); return }

		// if (debug) addState({ currentScene: game.scenes.STAGE })

		if ( onMobileDevice() ) setFullscreenTrigger( this, container )
		resumeCurrentSceneListener( this, domElem, container, start )
		resumeCurrentSceneListener( this, domElem, container, restart, true )

		// Add all assets into the cache
		const addAssetsToCache = async () => {
			for ( const room of Object.values( game.images ) ) for ( const value of Object.values( room ) ) {
				await Up.addToCache({ cache: game.cache, key: value.key })
			}
			for ( const room of Object.values( game.sprites ) ) for ( const value of Object.values( room ) ) {
				await Up.addToCache({ cache: game.cache, key: value.key })
			}
			for ( const room of Object.values( game.sounds ) ) for ( const value of Object.values( room ) ) {
				await Up.addToCache({ cache: game.cache, key: value.key })
			}
			for ( const room of Object.values( game.videos ) ) for ( const value of Object.values( room ) ) {
				await Up.addToCache({ cache: game.cache, key: value.key })
			}
			for ( const category of Object.values( game.soundsPersistant) ) for ( const value of Object.values( category ) ) {
				await Up.addToCache({ cache: game.cache, key: value.key })
			}
			// Load ambient sounds
			for ( const category of Object.values( game.soundsPersistant ) ) for ( const value of Object.values( category ) ) {
				await Up.loadAudioFromCache({ cache: game.cache, scene: this, key: value.key })
			}
			for ( const spritesheet of Object.values( game.sprites.CAT ) ) {
				await Up.loadSpriteFromCache({ cache: game.cache, scene: this, key: spritesheet.key, width: spritesheet.width, height: spritesheet.height })
			}

			log( `cacheComplete.` )
			this.events.emit( 'cacheComplete' )
		}
		addAssetsToCache()

		this.events.once( 'cacheComplete', () => {
			this.load.once( Phaser.Loader.Events.COMPLETE, () => {
				log( `All assets loaded.` )
				// Add ambient sounds
				Object.values( game.soundsPersistant ).forEach( category => { Object.values( category ).forEach( value => {
					this.sound.add( value.key )
				})})

				start.classList.add( 'visible' )
				if ( JSON.stringify( getState() ) !== JSON.stringify( game.initialState ) ) restart.classList.add( 'visible' )

				log( `Persistant sounds added.` )
				if ( debug ) resumeCurrentScene( this, domElem, container )
			})
			this.load.start()
		})

	}

	// update() {
	// }
}

function setFullscreenTrigger (
	scene: Phaser.Scene,
	elem: HTMLElement
): void {
	elem.onclick = () => {
		if (scene.scale.isFullscreen) return

		scene.scale.startFullscreen()
		screen.orientation.lock('landscape').catch( () => {
			console.log( 'Orientation locking is not supported.' )
		})
	}
}

function resumeCurrentScene (
	scene: Phaser.Scene,
	domElem: Phaser.GameObjects.DOMElement,
	container: HTMLElement
): void {
	domElem.pointerEvents = 'none'
	container.style.pointerEvents = 'none'

	const currentScene = getState().currentScene
	scene.scene.run( currentScene )

	container.classList.add('fade-out')
	scene.add.tween({
		targets: scene.cameras.main,
		alpha: 0,
		duration: 3000,
		ease: Phaser.Math.Easing.Linear,
		onComplete: () => {
			console.log( 'Loader has stopped.' )
			scene.scene.stop( game.scenes.LOADER )
		}
	})
}
function resumeCurrentSceneListener (
	scene: Phaser.Scene,
	domElem: Phaser.GameObjects.DOMElement,
	container: HTMLElement,
	button: HTMLElement,
	restart?: boolean,
): void {
	button.onclick = () => {
		if ( restart ) Up.setState({ game: game, newState: { ...game.initialState } })
		resumeCurrentScene( scene, domElem, container )
	}
}

const style = `
<style>
svg #path1 {
	stroke-dasharray: 300;
	stroke-dashoffset: 300;
	animation: write 3s linear forwards;
}
@keyframes write {
	0% {
		stroke-dashoffset: 300;
	}
	100% {
		stroke-dashoffset: 0;
	}
}

.no-select {
	-webkit-tap-highlight-color: transparent;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
.no-select:focus {
	outline: none !important;
}

#dom-container {
	display: block;
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #b0c4b1;
	opacity: 1;
}
#dom-container.fade-out {
	opacity: 0;
	transition: opacity 3s linear;
}


#buttons ,
.jumping {
	user-select: none;
	position: relative;
	font-family: 'TmonMonsori', sans-serif;
	color: #fff;
	text-shadow: 0 1px #ccc, 0 2px #ccc, 0 3px #ccc, 0 4px #ccc, 0 5px #ccc, 0 6px 0 transparent, 0 7px transparent, 0 8px transparent, 0 9px transparent, 0 10px 10px rgba(0, 0, 0, 0.4);
}
#buttons {
	top: 250px;
	margin: 0 auto;
	width: fit-content;
	height: fit-content;
	padding: 0.2em 0.4em;
	font-size: 60px;
	text-align: center;
	vertical-align: center;
}
#restart {
	font-size: 55px;
}
#buttons div {
	font-family: 'Noto Sans Symbols2', sans-serif;
	vertical-align: center;
	margin: 0 0.5em;
	display: none;
	visibility: hidden;
	opacity: 0;
}
#buttons div.visible {
	display: inline-block;
	cursor: pointer;
	pointer-events: auto;
	animation: fade-in 1s ease 0s forwards;
}
#buttons span {
	vertical-align: center;
	position: relative;
	display: inline-block;
	top: 0px;
}
#buttons span:hover {
	animation: jump 0.2s ease-out alternate;
	animation-iteration-count: 4;
}


@keyframes fade-in {
	0% {
		visibility: hidden;
		opacity: 0;
	}
	1% {
		visibility: visible;
		opacity: 0;
	}
	100% {
		visibility: visible;
		opacity: 1;
	}
}

.jumping {
	top: 0px;
	left: 0px;
	font-size: 40px;
}
.jumping span {
	position: absolute;
	top: 20px;
	left: 0px;
	display: inline-block;
}

@keyframes jump {
  100%{
	top: -10px;
	text-shadow: 0 1px #ccc,
				 0 2px #ccc,
				 0 3px #ccc,
				 0 4px #ccc,
				 0 5px #ccc,
				 0 6px #ccc,
				 0 7px #ccc,
				 0 8px #ccc,
				 0 9px #ccc,
				 0 25px 12px rgba(0, 0, 0, 0.2);
  }
}
@keyframes move {
	0% {
		offset-distance: 0%;
	}
	100% {
		offset-distance: 100%;
	}
}
@keyframes bounce{
  100%{
	top: -10px;
	text-shadow: 0 1px #ccc,
				 0 2px #ccc,
				 0 3px #ccc,
				 0 4px #ccc,
				 0 5px #ccc,
				 0 6px #ccc,
				 0 7px #ccc,
				 0 8px #ccc,
				 0 9px #ccc,
				 0 25px 12px rgba(0, 0, 0, 0.2);
  }
}
#a {
	offset-path: path(
		"m 804,42 c 0,0 -104,7 -157,24 -44,13 -96,21 -122,64 -21,35 -7,103 30,119 38,16 98,-20 109,-60 11,-46 -37,-95 -78,-121 -50,-32 -119,-37 -177,-25 -37,7 -61,47 -97,57 -35,9 -74,-7 -110,0 -29,6 -66,11 -82,36 -15,23 -13,58 -1,83 8,18 25,37 45,38 22,2 49,-14 58,-34 8,-18 -20,-40 -12,-58 4,-10 10,-15 29,-15 h 7"
	);
	animation: bounce 0.3s ease infinite alternate, move 12s ease-in-out forwards;
	animation-delay:0.0s;
}
#t {
	offset-rotate: reverse;
	offset-path: path(
		"m -13,121 c 0,0 40,61 71,60 35,-1 51,-48 74,-74 20,-23 64,-45 55,-74 -6,-19 -38,-24 -58,-20 -17,4 -33,20 -38,38 -4,14 -2,34 9,45 21,21 58,24 88,20 43,-6 70,-74 113,-65 27,5 57,40 50,67 -6,24 -36,32 -69,32 h -9"
	);
	animation: bounce 0.3s ease infinite alternate, move 10s ease-in-out 2.5s forwards;
	animation-delay:0.1s;
}
#z {
	offset-rotate: reverse;
	offset-path: path(
		"m 166,464 c 0,0 -28,-41 -26,-64 2,-34 20,-73 50,-88 30,-15 55,-17 88,-69 28,-44 96,-6 117,-42 13,-22 7,-62 -14,-76 -11,-7 -30,-6 -38,8 -6,11 -26,17 -38,17 h -4"
	);
	animation: bounce 0.3s ease 0.2s infinite alternate, move 10s ease-in-out 3.1s forwards;
}
#e {
	offset-rotate: reverse;
	offset-path: path(
		"m 733,462 c 0,0 -21,-50 -42,-66 -18,-14 -29,-20 -51,-21 -31,-1 -31,15 -61,12 -31,-3 -44,-27 -50,-49 -7,-25 8,-47 22,-67 21,-29 36,-40 62,-71 22,-27 -13,-85 -42,-116 -25,-26 -80,-34 -109,-6 -53,52 75,93 84,174 7,50 -28,146 -86,153 -58,7 -101,12 -138,-20 -37,-32 -50,-86 -26,-127 24,-41 86,-44 84,-77 -1,-16 -22,-28 -41,-28 h -4"
	);
	animation: bounce 0.3s ease 0.3s infinite alternate, move 10s ease-in-out 4s forwards;
}
#und {
	offset-rotate: 0deg;
	offset-path: path(
		"m 400,-63 0,213"
	);
	animation: bounce 0.3s ease 0.4s infinite alternate, move 4s ease-in-out 13s forwards;
}
#d {
	offset-rotate: 0deg;
	offset-path: path(
		"m 828,150 h -359"
	);
	animation: bounce 0.3s ease 0.5s infinite alternate, move 2s ease-in-out 15s forwards;
}
#u {
	offset-rotate: reverse;
	offset-path: path(
		"m 837,150 c 0,0 -35,-15 -53,-11 -7,1 -10,11 -17,11 -11,1 -7,-13 -31,-12 -9,0 -22,12 -14,25 8,13 26,7 29,-1 4,-10 -3,-20 -10,-24 -8,-4 -25,-3 -35,3 -8,5 -11,18 -1,27 8,8 25,3 28,-8 4,-13 -15,-24 -24,-28 -15,-7 -22,-5 -32,1 -25,17 -13,44 -30,57 -6,4 -15,9 -21,6 -27,-15 4,-83 -26,-89 -23,-4 -21,53 -44,54 -13,0 -13,-28 -26,-28 -6,0 -7,15 -13,15 h -11"
	);
	animation: bounce 0.3s ease 0.6s infinite alternate, move 10s ease-in-out 12s forwards;
}

</style>
`

const script = ``

const text = `
<div class='jumping'>
	<span id='a'>A</span>
	<span id='t'>t</span>
	<span id='z'>z</span>
	<span id='e'>e</span>
	<span id='und'>&</span>
	<span id='u'>u</span>
	<span id='d'>D</span>
</div>
<div id='buttons' class='no-select'>
	<div id='restart'><span>&#11119;</span></div>
	<div id='start'><span>&#11146;</span></div>
</div>
`

