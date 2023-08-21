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

/* eslint-disable no-unused-vars */

export const CONFIG = {
	width: 1600,
	height: 900,
	// 300 is a good setting for jump and runs
	gravity: 0,
}

export enum SCENES {
	LOADER = 'Loader',
	ENTRANCE = 'Entrance',
	COZYROOM = 'CozyRoom',
	SNOOZE = 'Snooze',
}

export const PREVIOUSSCENES = 'previousScenes'

export enum TEXTURES {
	BUTTON = 'button',
	BUTTON_PLAY = 'button_play',
}

export const COLORS = {
	BACKGROUND: new Phaser.Display.Color(18, 3, 48, 255),
	TEXT: new Phaser.Display.Color(255, 255, 255, 255),
	PRIMARY: new Phaser.Display.Color(242, 19, 183, 255),
};

