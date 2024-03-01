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


import { game } from './constants'
import Init from './scenes/init'
import Loader from './scenes/loader'
import Fassade from './scenes/fassade'
import Entrance from './scenes/entrance'
import Foyer from './scenes/foyer'
import Backstage from './scenes/backstage'
import Hallway from './scenes/hallway'
import Stagedoor from './scenes/stagedoor'
import Stage from './scenes/stage'
import Piano from './scenes/piano'
import Showroom from './scenes/showroom'
import Paint from './scenes/paint'
// import Presentation from './scenes/presentation'
import Wimmelbild from './scenes/wimmelbild'
import Snooze from './scenes/snooze'

const config: Phaser.Types.Core.GameConfig = {
	// type: Phaser.AUTO,
	type: Phaser.AUTO,
	parent: 'app',
	fullscreenTarget: 'app',
	title: 'Atze & Du',
	width: game.config.width,
	height: game.config.height,
	backgroundColor: '#2d2d2d',
	scale: {
		parent: 'app',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	render: {
		// Smooth:
		pixelArt: false,
		antialias: true,
		// Rough:
		// pixelArt: true,
		// antialias: false,
	},
	fps: {
		forceSetTimeOut: true,
		target: 30
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: game.config.gravity },
			debug: false,
		},
	},
	dom: {
		createContainer: true
	},
	scene: [Init, Loader, Fassade, Entrance, Foyer, Backstage, Hallway, Stagedoor, Stage, Piano, Showroom, Paint, Wimmelbild, Snooze],
}

const theGame = new Phaser.Game(config)

export default theGame
