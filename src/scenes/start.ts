
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

import { debug, onMobileDevice } from '../helpers/general'
import { } from '../helpers/special'
import { game, getState, setState, initialGameState, SCENES, IMAGES, SOUNDS, AMBIENCE } from '../constants'
import * as Cat from '../sprites/cat'

export default class Start extends Phaser.Scene {

	constructor() {
		super( SCENES.START )
	}

	// init() {
	// }

	// preload() {
	// }

	create() {
		setState({ ...initialGameState, ...getState() })
		/*
			background-color: #9e0059;
		*/
		// Images
		// load svg as bitmap: see https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Loader.LoaderPlugin-svg
		// this.load.svg('logo',   'logo.svg', { width: windowW, height: windowH } )
		// const svg = this.cache.text.get('writing')
		// const writing = `${style}<div style='display: grid; place-content: center; width: 100%; height: 100%;'>${svg}</div>${script}`
		const writing = `${style}<div id='dom-container'>${text}</div>${script}`
		const domElem = this.add.dom(0, 0, 'div', 'width: 100%; height: 100%;').setOrigin(0, 0).setHTML( writing )

		const container = document.getElementById('dom-container')
		const start = document.getElementById('start')

		// FIXME: remove me
		// setState({ currentScene: SCENES.PIANO })

		if ( !debug && onMobileDevice() && container ) setFullscreenTrigger( this, container )
		if ( container && start ) resumeCurrentSceneListener( this, domElem, container, start )

		// Load ALL assests of the game and display the start button when finished
		this.load.image( IMAGES.FASSADE, 'images/fassade/base.jpg' )
		this.load.image( IMAGES.FASSADEPILLARONE, 'images/fassade/pillar-1.png' )
		this.load.image( IMAGES.FASSADEPILLARTWO, 'images/fassade/pillar-2.png' )
		this.load.image( IMAGES.RAIN, 'images/fassade/rain-particle.png')
		this.load.image( IMAGES.ENTRANCEFRAME, 'images/entrance/door-frame.1600x900.png' )
		this.load.image( IMAGES.ENTRANCEDOORLEFT, 'images/entrance/door-left.1600x900.png' )
		this.load.image( IMAGES.ENTRANCEDOORRIGHT, 'images/entrance/door-right.1600x900.png' )
		this.load.image( IMAGES.ENTRANCEINNER, 'images/entrance/inner.1600x900.png' )
		this.load.spritesheet( IMAGES.WOMANINPOSTER, 'images/entrance/woman-in-poster.1600x900.png', { frameWidth: 195.3333 * game.scale, frameHeight: 195 * game.scale } )
		this.load.image( IMAGES.FOYER, 'images/foyer/base.1600x900.jpg' )
		this.load.image( IMAGES.ATZEBOW, 'images/foyer/atze-bow.1600x900.png' )

		this.load.audio( AMBIENCE.CITYRAIN, ['sounds/city-rain.webm'])
		this.load.audio( AMBIENCE.LOFI, ['music/silent-wood.mp3'])
		this.load.audio( AMBIENCE.JAZZY, ['music/jazzy.opus'])
		this.load.audio( SOUNDS.HELLO, ["sounds/hello.webm"])
		this.load.audio( SOUNDS.WOMANSPEECH, ['sounds/woman-in-poster.webm'])
		this.load.audio( SOUNDS.GALLOP, ['sounds/sfx/1650_Horse GallopR.webm'])

		Cat.loadCat( this )

		if (start) this.load.once( Phaser.Loader.Events.COMPLETE, () => {
			// Fassade
			this.sound.add( AMBIENCE.CITYRAIN )
			this.sound.add( AMBIENCE.JAZZY )
			this.sound.add( SOUNDS.HELLO )
			// Entrance
			this.sound.add( AMBIENCE.LOFI )
			this.sound.add( SOUNDS.WOMANSPEECH )
			// SFX
			this.sound.add( SOUNDS.GALLOP )
			// other

			start.classList.add('visible')
			console.log(`All assets loaded.`)
		})
		this.load.start()


		console.log(`${this.scene.key} created.`)
	}

	// update() {
	// }
}

const setFullscreenTrigger = ( scene: Phaser.Scene, elem: HTMLElement ) => {
	elem.onclick = () => {
		if (!scene.scale.isFullscreen) {
			scene.scale.startFullscreen()
			screen.orientation.lock('landscape').catch( () => {
				console.log( 'Orientation locking is not supported.' )
			})
		}
	}
}

const resumeCurrentSceneListener = ( scene: Phaser.Scene, domElem: Phaser.GameObjects.DOMElement, container: HTMLElement, start: HTMLElement ) => {
	start.onclick = () => {
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
				console.log( 'start has stopped' )
				scene.scene.stop( SCENES.START )
			}
		})
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
	width: 100%;
	height: 100%;
	background-color: #b0c4b1;
	opacity: 1;
}
#dom-container.fade-out {
	opacity: 0;
	transition: opacity 3s linear;
}

@font-face { font-family: 'TmonMonsori'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/TmonMonsori.woff') format('woff'); font-weight: normal; font-style: normal; }

#start,
.jumping {
	user-select: none;
	position: relative;
	font-family: 'TmonMonsori';
	color: #fff;
	text-shadow: 0 1px #ccc, 0 2px #ccc, 0 3px #ccc, 0 4px #ccc, 0 5px #ccc, 0 6px 0 transparent, 0 7px transparent, 0 8px transparent, 0 9px transparent, 0 10px 10px rgba(0, 0, 0, 0.4);
}
#start {
	top: 500px;
	width: fit-content;
	padding: 0.2em 0.4em;
	margin: 0 auto;
	font-size: 40px;
	cursor: pointer;
	pointer-events: auto;
	text-align: center;
	visibility: hidden;
	opacity: 0;
}
#start.visible {
	animation: fade-in 1s ease 0s forwards;
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
#start span {
	display: inline-block;
	position: relative;
	top: 0px;
}
#start:hover span {
	animation: wave 0.5s ease alternate;
	animation-iteration-count: 2;
}
#start span:nth-child(2){
  animation-delay:0.1s;
}
#start span:nth-child(3){
  animation-delay:0.2s;
}
#start span:nth-child(4){
  animation-delay:0.3s;
}
#start span:nth-child(5){
  animation-delay:0.4s;
}

.jumping {
	top: 0px;
	left: 0px;
	font-size: 80px;
}
.jumping span {
	position: absolute;
	top: 20px;
	left: 0px;
	display: inline-block;
}

@keyframes wave {
  100%{
	top: -20px;
	text-shadow: 0 1px #ccc,
				 0 2px #ccc,
				 0 3px #ccc,
				 0 4px #ccc,
				 0 5px #ccc,
				 0 6px #ccc,
				 0 7px #ccc,
				 0 8px #ccc,
				 0 9px #ccc,
				 0 50px 25px rgba(0, 0, 0, 0.2);
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
	top: -20px;
	text-shadow: 0 1px #ccc,
				 0 2px #ccc,
				 0 3px #ccc,
				 0 4px #ccc,
				 0 5px #ccc,
				 0 6px #ccc,
				 0 7px #ccc,
				 0 8px #ccc,
				 0 9px #ccc,
				 0 50px 25px rgba(0, 0, 0, 0.2);
  }
}
#a {
	offset-path: path(
		"m 1608,85 c 0,0 -208,15 -315,48 -88,27 -193,43 -245,129 -42,70 -15,206 60,238 76,33 197,-40 218,-121 23,-93 -75,-190 -156,-242 -101,-65 -238,-74 -355,-51 -74,14 -123,94 -195,114 -71,19 -149,-15 -221,0 -59,12 -132,22 -165,72 -31,46 -26,117 -2,167 16,36 51,74 91,77 45,4 98,-28 116,-69 16,-36 -40,-81 -24,-116 9,-20 21,-31 58,-31 h 15"
	);
	animation: bounce 0.3s ease infinite alternate, move 12s ease-in-out forwards;
	animation-delay:0.0s;
}
#t {
	offset-rotate: reverse;
	offset-path: path(
		"m -27,243 c 0,0 81,122 143,120 70,-3 103,-96 149,-149 40,-47 129,-90 110,-149 -12,-39 -76,-49 -116,-40 -35,8 -66,41 -77,76 -9,29 -4,69 18,91 42,43 117,49 177,40 86,-13 141,-149 226,-131 55,11 114,81 100,135 -13,49 -73,64 -138,64 h -19"
	);
	animation: bounce 0.3s ease infinite alternate, move 10s ease-in-out 2.5s forwards;
	animation-delay:0.1s;
}
#z {
	offset-rotate: reverse;
	offset-path: path(
		"m 333,929 c 0,0 -56,-83 -53,-129 4,-68 41,-146 101,-177 61,-31 111,-34 176,-138 56,-89 193,-13 235,-85 26,-45 15,-124 -28,-152 -22,-15 -60,-12 -77,17 -13,22 -53,35 -76,35 h -8"
	);
	animation: bounce 0.3s ease 0.2s infinite alternate, move 10s ease-in-out 3.1s forwards;
}
#e {
	offset-rotate: reverse;
	offset-path: path(
		"m 1466,925 c 0,0 -43,-100 -85,-133 -36,-28 -84,-40 -129,-42 -63,-2 -116,61 -183,45 -46,-11 -98,-42 -110,-87 -14,-50 27,-106 55,-146 42,-59 73,-81 124,-143 45,-54 58,-190 1,-252 -50,-53 -161,-69 -218,-13 -107,105 49,187 65,292 15,100 -99,230 -202,232 -86,2 -181,-101 -177,-187 3,-67 154,-66 150,-133 -2,-33 -44,-57 -82,-57 h -9"
	);
	animation: bounce 0.3s ease 0.3s infinite alternate, move 10s ease-in-out 4s forwards;
}
#und {
	offset-rotate: 0deg;
	offset-path: path(
		"m 800,-127 -1,427"
	);
	animation: bounce 0.3s ease 0.4s infinite alternate, move 4s ease-in-out 13s forwards;
}
#d {
	offset-rotate: 0deg;
	offset-path: path(
		"m 1657,300 h -719"
	);
	animation: bounce 0.3s ease 0.5s infinite alternate, move 2s ease-in-out 15s forwards;
}
#u {
	offset-rotate: reverse;
	offset-path: path(
		"m 1675,300 c 0,0 -70,-30 -106,-23 -14,3 -21,22 -34,23 -22,2 -14,-26 -63,-25 -19,0 -44,25 -28,50 17,27 52,15 59,-2 8,-20 -6,-41 -20,-48 -17,-8 -51,-6 -70,7 -16,11 -23,36 -3,55 17,16 50,6 56,-16 8,-26 -31,-48 -48,-56 -30,-14 -45,-11 -65,2 -51,35 -26,88 -60,115 -12,9 -30,19 -43,12 -54,-30 9,-166 -52,-178 -46,-9 -42,107 -89,109 -26,1 -27,-56 -53,-56 -13,0 -15,30 -27,30 h -23"
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
<div id='start' class='no-select'>
	<span>S</span>
	<span>T</span>
	<span>A</span>
	<span>R</span>
	<span>T</span>
</div>
`

