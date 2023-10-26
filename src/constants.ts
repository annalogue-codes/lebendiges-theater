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

export const game = {
	width: 1600,
	height: 900,
	scale: 1,
	// 300 is a good setting for jump and runs
	gravity: 0,
}
export enum SCENES {
	LOADER = 'loader',
	START = 'start',
	FASSADE = 'fassade',
	ENTRANCE = 'entrance',
	FOYER = 'foyer',
	PIANO = 'piano',
	SNOOZE = 'snooze',
}

export type GameStateFields = {
	currentScene?: string,
	entranceopen?: boolean,
	womanHasSpoken?: boolean,
}
export type GameState = {
	currentScene: string,
	entranceopen: boolean,
	womanHasSpoken: boolean,
}
export const initialGameState: GameState = {
	currentScene: SCENES.FASSADE,
	entranceopen: false,
	womanHasSpoken: false,
}
export const stateIsEmpty = () => {
	const stored = localStorage.getItem( 'atzeGameState' )
	const empty = (stored === null)
	console.log( stored === null )
	return empty
}
export const getState: () => GameState = () => {
	const stored = localStorage.getItem( 'atzeGameState' )
	const state = (stored === null) ? initialGameState : JSON.parse( stored )
	return state
}
export const setState = ( state: GameStateFields ) => {
	const stored = localStorage.getItem( 'atzeGameState' )
	const oldState = (stored === null) ? initialGameState : JSON.parse( stored )
	const newState = { ...oldState, ...state }
	localStorage.setItem( 'atzeGameState', JSON.stringify( newState ) )
}


export const PREVIOUSSCENES = 'previousScenes'

export enum IMAGES {
	// Backgrounds
	ONEBYONE = 'onebyone',
	FASSADE = 'fassade',
	FASSADEPILLARONE = 'fassadePillarOne',
	FASSADEPILLARTWO = 'fassadePillarTwo',
	RAIN = 'rain',
	ENTRANCEFRAME = 'entranceFrame',
	ENTRANCEDOORLEFT = 'entranceDoorLeft',
	ENTRANCEDOORRIGHT = 'entranceDoorRight',
	ENTRANCEINNER = 'entranceInner',
	WOMANINPOSTER = 'womaninposter',
	FOYER = 'foyer',
	ATZEBOW = 'atzeBow',
	// Background elements
	// Cursor
	CURSOR = 'cursor',
	// Characters
}

export enum AMBIENCE {
	CITYRAIN = 'cityrain',
	LOFI = 'lofi',
	JAZZY = 'jazzy',
}

export enum SOUNDS {
	HELLO = 'hello',
	MEOW = 'meow',
	MEOWMEOWMEOW = 'meowmeowmeow',
	ATTENTION = 'attention',
	PURR = 'purr',
	WOMANSPEECH = 'womanspeech',
	GALLOP = 'gallop',
}

const directions = ['LEFT', 'RIGHT', 'UP', 'DOWN'] as const
export type Direction = typeof directions[number]

export const COLORS = {
	BACKGROUND: new Phaser.Display.Color(18, 3, 48, 255),
	TEXT: new Phaser.Display.Color(255, 255, 255, 255),
	PRIMARY: new Phaser.Display.Color(242, 19, 183, 255),
}

