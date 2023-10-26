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
import Loader from './scenes/loader'
import Start from './scenes/start'
import Fassade from './scenes/fassade'
import Entrance from './scenes/entrance'
import Foyer from './scenes/foyer'
import Piano from './scenes/piano'
import Snooze from './scenes/snooze'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	fullscreenTarget: 'app',
	title: 'Lebendiges Theater',
	width: game.width,
	height: game.height,
	backgroundColor: '#2d2d2d',
	scale: {
		parent: 'app',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	render: {
		pixelArt: false,
		antialias: true,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: game.gravity },
			debug: false,
		},
	},
	dom: {
		createContainer: true
	},
	scene: [Loader, Start, Fassade, Entrance, Foyer, Piano, Snooze],
}

const theGame = new Phaser.Game(config)

export default theGame
