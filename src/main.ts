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

import { CONFIG } from './Constants'
import Loader from './scenes/Loader'
import Snooze from './scenes/Snooze'
import CozyRoom from './scenes/CozyRoom'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	fullscreenTarget: 'app',
	title: 'Lebendiges Theater',
	width: CONFIG.width,
	height: CONFIG.height,
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
			gravity: { y: CONFIG.gravity },
			debug: false,
		},
	},
	scene: [Loader, CozyRoom, Snooze],
}

export default new Phaser.Game(config)
