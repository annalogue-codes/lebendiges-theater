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

// import { onMobileDevice } from "./utils/general"

/* eslint-disable no-unused-vars */

import Phaser from 'phaser'
import * as Ug from './utils/general'
import * as Up from './utils/phaser'
import * as Set from './utils/set'

// ascii letters only
const VERSION = '1.0.1'
const NAMEOFGAME = 'atzeunddu'
const INITIALSCENE = 'fassade'
const WIDTH =  Ug.onMobileDevice() ? 800 : 1600
const HEIGHT = Ug.onMobileDevice() ? 450 : 900
const SCALE =  Ug.onMobileDevice() ? 1 : 2

// // delete cache

await caches.delete( `${NAMEOFGAME}-cache` )
await caches.delete( `${NAMEOFGAME}-1.0.0-cache` )

const cache = await Up.openCache({ nameOfCache: `${NAMEOFGAME}-${VERSION}` })


type State = Up.MinimalState & {
	// conversations: { [key: string]: Conversation },
	entranceopen: boolean,
	womanHasSpoken: boolean,
	metAtze: boolean,
	piano: string,
	presentation: string,
	painting: Phaser.GameObjects.RenderTexture | undefined,
	arrivedAtWimmelbild: boolean,
	peopleFound: Set.Set,
	inventory: Set.Set,
	givenToAtze: Set.Set,
}

type StateFields = Ug.MakePropertiesOptional<State>

// type StateFields = {
// 	paused?: boolean,
// 	previousScene?: string,
// 	currentScene?: string,
// 	solo?: Array<string>,
// 	// conversations?: { [key: string]: Conversation },
// 	entranceopen?: boolean,
// 	womanHasSpoken?: boolean,
// 	metAtze?: boolean,
// 	piano?: string,
// 	presentation?: string,
// 	painting?: Phaser.GameObjects.RenderTexture | undefined,
// 	peopleFound?: Set.Set,
// }
const initialState: State = {
	hasStarted: false,
	paused: false,
	previousScene: INITIALSCENE,
	currentScene: INITIALSCENE,
	solo: [],
	// conversations: {},
	entranceopen: false,
	womanHasSpoken: false,
	metAtze: false,
	piano: 'sfx',
	presentation: '',
	painting: undefined,
	arrivedAtWimmelbild: false,
	peopleFound: Set.newSet(),
	inventory: Set.newSet(),
	givenToAtze: Set.newSet(),
}


const game: Up.Game = {
	config: {
		name: NAMEOFGAME,
		width: Ug.onMobileDevice() ? 800 : 1600,
		height: Ug.onMobileDevice() ? 450 : 900,
		scale: Ug.onMobileDevice() ? 1 : 2,
		gravity: 0,
		durationSceneTransition: 2000,
	},
	stateKey: NAMEOFGAME,
	initialState: initialState,
	cache: cache,
	scenes: {
		INIT: 'init',
		LOADER: 'loader',
		FASSADE: 'fassade',
		ENTRANCE: 'entrance',
		FOYER: 'foyer',
		TRAILERS: 'trailers',
		HALLWAY: 'hallway',
		STAGEDOOR: 'stagedoor',
		STAGE: 'stage',
		BACKSTAGE: 'backstage',
		PIANO: 'piano',
		SHOWROOM: 'showroom',
		PAINT: 'paint',
		PRESENTATION: 'presentation',
		WIMMELBILD: 'wimmelbild',
		SNOOZE: 'snooze',
	},
	images: {
		OTHER: {
			CIRCLE: { key: `other/${WIDTH}x${HEIGHT}/glowCircle_small.png` },
		},
		BACKSTAGE: {
			BACKGROUND:  { key: `backstage/${WIDTH}x${HEIGHT}/television.png` },
		},
		ENTRANCE: {
			BACKGROUND: { key: `entrance/${WIDTH}x${HEIGHT}/background.png` },
			DOORLEFT: { key: `entrance/${WIDTH}x${HEIGHT}/doorLeft.png` },
			DOORRIGHT: { key: `entrance/${WIDTH}x${HEIGHT}/doorRight.png` },
			INNER: { key: `entrance/${WIDTH}x${HEIGHT}/inner.png` },
			RAINDROP: { key: `other/${WIDTH}x${HEIGHT}/raindrop.png` },
		},
		FASSADE: {
			BACKGROUND: { key: `fassade/${WIDTH}x${HEIGHT}/background.png` },
			DOORLEFT: { key: `fassade/${WIDTH}x${HEIGHT}/doorLeft.png` },
			DOORRIGHT: { key: `fassade/${WIDTH}x${HEIGHT}/doorRight.png` },
			DOORINNER: { key: `fassade/${WIDTH}x${HEIGHT}/doorInner.png` },
			PILLAR1: { key: `fassade/${WIDTH}x${HEIGHT}/pillar1.png` },
			PILLAR2: { key: `fassade/${WIDTH}x${HEIGHT}/pillar2.png` },
			RAINDROP: { key: `other/${WIDTH}x${HEIGHT}/raindrop.png` },
		},
		FOYER: {
			BACKGROUND: { key: `foyer/${WIDTH}x${HEIGHT}/background.jpg` },
			CASHIER: { key: `foyer/${WIDTH}x${HEIGHT}/cashier.png` },
			SHUTTERS: { key: `foyer/${WIDTH}x${HEIGHT}/shutters.png` },
		},
		TRAILERS: {
			BACKGROUND: { key: `trailers/${WIDTH}x${HEIGHT}/flatscreen.png` },
			BUTTON1A: { key: `trailers/${WIDTH}x${HEIGHT}/button-1-a.png` },
			BUTTON1B: { key: `trailers/${WIDTH}x${HEIGHT}/button-1-b.png` },
			BUTTON2A: { key: `trailers/${WIDTH}x${HEIGHT}/button-2-a.png` },
			BUTTON2B: { key: `trailers/${WIDTH}x${HEIGHT}/button-2-b.png` },
			BUTTON3A: { key: `trailers/${WIDTH}x${HEIGHT}/button-3-a.png` },
			BUTTON3B: { key: `trailers/${WIDTH}x${HEIGHT}/button-3-b.png` },
		},
		HALLWAY: {
			BACKGROUND: { key: `hallway/${WIDTH}x${HEIGHT}/background.jpg` },
			RAILING: { key: `hallway/${WIDTH}x${HEIGHT}/railing.png` },
			RAILINGSTAGE: { key: `hallway/${WIDTH}x${HEIGHT}/railingstage.png` },
		},
		PAINT: {
			BACKGROUND: { key: `paint/${WIDTH}x${HEIGHT}/background.jpg` },
			BRUSH1: { key: `paint/${WIDTH}x${HEIGHT}/brush1.png` },
			BRUSH2: { key: `paint/${WIDTH}x${HEIGHT}/brush2.png` },
			BRUSH3: { key: `paint/${WIDTH}x${HEIGHT}/brush3.png` },
		},
		PIANO: {
			BACKGROUND: { key: `piano/${WIDTH}x${HEIGHT}/background.jpg` },
			BUTTON: { key: `piano/${WIDTH}x${HEIGHT}/button.png` },
			WHITEKEYS: { key: `piano/${WIDTH}x${HEIGHT}/whitekeys.blank.png` },
			BLACKKEYS: { key: `piano/${WIDTH}x${HEIGHT}/blackkeys.png` },
			LINEG: { key: `piano/${WIDTH}x${HEIGHT}/lineG.png` },
			LINEA: { key: `piano/${WIDTH}x${HEIGHT}/lineA.png` },
			LINEB: { key: `piano/${WIDTH}x${HEIGHT}/lineB.png` },
			LINEC: { key: `piano/${WIDTH}x${HEIGHT}/lineC.png` },
			LINED: { key: `piano/${WIDTH}x${HEIGHT}/lineD.png` },
			LINEE: { key: `piano/${WIDTH}x${HEIGHT}/lineE.png` },
			LINEF: { key: `piano/${WIDTH}x${HEIGHT}/lineF.png` },
		},
		// PRESENTATION: {
		// 	BACKGROUND: { key: `presentation/${WIDTH}x${HEIGHT}/background.jpg` },
		// 	BUTTONLEFT: { key: `presentation/${WIDTH}x${HEIGHT}/buttonLeft.png` },
		// 	BUTTONLEFTHOVER: { key: `presentation/${WIDTH}x${HEIGHT}/buttonLeftHover.png` },
		// 	BUTTONRIGHT: { key: `presentation/${WIDTH}x${HEIGHT}/buttonRight.png` },
		// 	BUTTONRIGHTHOVER: { key: `presentation/${WIDTH}x${HEIGHT}/buttonRightHover.png` },
		// 	PODIUMHORIZONTAL01: { key: `presentation/${WIDTH}x${HEIGHT}/podiumHorizontal01.jpg` },
		// 	PODIUMHORIZONTAL02: { key: `presentation/${WIDTH}x${HEIGHT}/podiumHorizontal02.jpg` },
		// 	PODIUMVERTIKAL01: { key: `presentation/${WIDTH}x${HEIGHT}/podiumVertikal01.jpg` },
		// 	PODIUMVERTIKAL02: { key: `presentation/${WIDTH}x${HEIGHT}/podiumVertikal02.jpg` },
		// 	STIMMEDERZUKUNFTHORIZONTAL01: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftHorizontal01.jpg` },
		// 	STIMMEDERZUKUNFTHORIZONTAL02: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftHorizontal02.jpg` },
		// 	STIMMEDERZUKUNFTVERTIKAL01: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftVertikal01.jpg` },
		// 	STIMMEDERZUKUNFTVERTIKAL02: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftVertikal02.jpg` },
		// 	FAMILIENNACHTHORIZONTAL01: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtHorizontal01.jpg` },
		// 	// FAMILIENNACHTHORIZONTAL02: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtHorizontal02.jpg` },
		// 	FAMILIENNACHTVERTIKAL01: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtVertikal01.jpg` },
		// 	FAMILIENNACHTVERTIKAL02: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtVertikal02.jpg` },
		// },
		SHOWROOM: {
			BACKGROUND: { key: `showroom/${WIDTH}x${HEIGHT}/background.jpg` },
			// PODIUMVERTIKAL01: { key: `presentation/${WIDTH}x${HEIGHT}/podiumVertikal01.jpg` },
			// PODIUMVERTIKAL02: { key: `presentation/${WIDTH}x${HEIGHT}/podiumVertikal02.jpg` },
			// STIMMEDERZUKUNFTVERTIKAL01: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftVertikal01.jpg` },
			// STIMMEDERZUKUNFTVERTIKAL02: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftVertikal02.jpg` },
			// FAMILIENNACHTVERTIKAL01: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtVertikal01.jpg` },
			// FAMILIENNACHTVERTIKAL02: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtVertikal02.jpg` },
		},
		STAGE: {
			BACKGROUND: { key: `stage/${WIDTH}x${HEIGHT}/background.jpg` },
			// BACKGROUND: { key: `stage/${WIDTH}x${HEIGHT}/6-Buhne.small.png` },
			ALBIREA: { key: `stage/${WIDTH}x${HEIGHT}/albirea.png` },
			BACH: { key: `stage/${WIDTH}x${HEIGHT}/bach.png` },
			BEAR: { key: `stage/${WIDTH}x${HEIGHT}/bear.png` },
			ENTLEIN: { key: `stage/${WIDTH}x${HEIGHT}/entlein.png` },
			HAUPTMANN: { key: `stage/${WIDTH}x${HEIGHT}/hauptmann.png` },
			NEINHORN: { key: `stage/${WIDTH}x${HEIGHT}/neinhorn.png` },
			RONJA: { key: `stage/${WIDTH}x${HEIGHT}/ronja.png` },
			RONJASTANDING: { key: `stage/${WIDTH}x${HEIGHT}/ronjastanding.png` },
			SAMS: { key: `stage/${WIDTH}x${HEIGHT}/sams.png` },
			QUESTION: { key: `dialogue/${WIDTH}x${HEIGHT}/question.png` },
			EXCLAMATION: { key: `dialogue/${WIDTH}x${HEIGHT}/exclamation.png` },
			FUNNY: { key: `dialogue/${WIDTH}x${HEIGHT}/funny.png` },
			BYE: { key: `dialogue/${WIDTH}x${HEIGHT}/bye.png` },
		},
		STAGEDOOR: {
			BACKGROUND: { key: `stagedoor/${WIDTH}x${HEIGHT}/background.jpg` },
		},
		WIMMELBILD: {
			BERLIN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/berlin.jpg` },
			LENSPLUS: { key: `wimmelbild/${WIDTH}x${HEIGHT}/lensplus.png` },
			LENSMINUS: { key: `wimmelbild/${WIDTH}x${HEIGHT}/lensminus.png` },
		},
	},
	sprites: SCALE === 1 ? {
		BACKSTAGE: {
			KNOBPROGRAM: { key: `backstage/${WIDTH}x${HEIGHT}/knob-program.png`, width: 78, height: 76 },
			KNOBRED:     { key: `backstage/${WIDTH}x${HEIGHT}/knob-red.png`    , width: 34, height: 26 },
			KNOBYELLOW1: { key: `backstage/${WIDTH}x${HEIGHT}/knob-yellow1.png`, width: 34, height: 26 },
			KNOBYELLOW2: { key: `backstage/${WIDTH}x${HEIGHT}/knob-yellow2.png`, width: 34, height: 26 },
		},
		ENTRANCE: {
			WOMANINPOSTER: { key: `entrance/${WIDTH}x${HEIGHT}/womanInPoster.png`, width: 62.5, height: 73 },
		},
		FOYER: {
			ATZE: { key: `foyer/${WIDTH}x${HEIGHT}/atze.png`, width: 152.4, height: 152.333 },
			ATZETALKING: { key: `foyer/${WIDTH}x${HEIGHT}/atzeTalking.png`, width: 40.6, height: 35.5 },
			SNORLAX: { key: `foyer/${WIDTH}x${HEIGHT}/snorlax.png`, width: 75, height: 108 },
			CHOCO: { key: `foyer/${WIDTH}x${HEIGHT}/choco.png`, width: 25, height: 38 },
		},
		PIANO: {
			LINEWOBBLE: { key: `piano/${WIDTH}x${HEIGHT}/lineWobble.png`, width: 40.5, height: 450 },
		},
		SHOWROOM: {
			MELODIA: { key: `showroom/${WIDTH}x${HEIGHT}/melodia.png`, width: 61.9, height: 63.5 },
		},
		WIMMELBILD: {
			ALBIREA: { key: `wimmelbild/${WIDTH}x${HEIGHT}/albirea.png`, width: 72, height: 72 },
			// ATZE: { key: `wimmelbild/${WIDTH}x${HEIGHT}/atze.png`, width: 72, height: 72 },
			BACH: { key: `wimmelbild/${WIDTH}x${HEIGHT}/bach.png`, width: 72, height: 72 },
			BEAR: { key: `wimmelbild/${WIDTH}x${HEIGHT}/bear.png`, width: 72, height: 72 },
			ENTLEIN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/entlein.png`, width: 72, height: 72 },
			HAUPTMANN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/hauptmann.png`, width: 72, height: 72 },
			NEINHORN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/neinhorn.png`, width: 72, height: 72 },
			RONJA: { key: `wimmelbild/${WIDTH}x${HEIGHT}/ronja.png`, width: 72, height: 72 },
			SAMS: { key: `wimmelbild/${WIDTH}x${HEIGHT}/sams.png`, width: 71.5, height: 71.5 },
		},
		STAGE: {
			ALBIREAARM: { key: `stage/${WIDTH}x${HEIGHT}/albirea-arm.png`, width: 61.8, height: 76 },
			ALBIREAHEAD: { key: `stage/${WIDTH}x${HEIGHT}/albirea-head.png`, width: 39.2, height: 44 },
			BACHHEAD: { key: `stage/${WIDTH}x${HEIGHT}/bach-head.png`, width: 43, height: 48 },
			BEARHAND: { key: `stage/${WIDTH}x${HEIGHT}/bear-hand.png`, width: 28.5, height: 24 },
			BEARHEAD: { key: `stage/${WIDTH}x${HEIGHT}/bear-head.png`, width: 38.1, height: 38.5 },
			HAUPTMANNHEAD: { key: `stage/${WIDTH}x${HEIGHT}/hauptmann-head.png`, width: 26.8, height: 34.5 },
			MOUSE: { key: `stage/${WIDTH}x${HEIGHT}/mouse.png`, width: 14.75, height: 20 },
			NEINHORNHEAD: { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-head.png`, width: 45, height: 44.5 },
			NEINHORNLEG: { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-leg.png`, width: 66.375, height: 117 },
			NEINHORNTAIL: { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-tail.png`, width: 81, height: 156 },
			RONJAHEAD: { key: `stage/${WIDTH}x${HEIGHT}/ronja-head.png`, width: 44, height: 38.5 },
			SAMSHEAD: { key: `stage/${WIDTH}x${HEIGHT}/sams-head.png`, width: 37.4, height: 30 },
			ALBIREA: { key: `wimmelbild/${WIDTH}x${HEIGHT}/albirea.png`, width: 72, height: 72 },
			// ATZE: { key: `wimmelbild/${WIDTH}x${HEIGHT}/atze.png`, width: 72, height: 72 },
			BACH: { key: `wimmelbild/${WIDTH}x${HEIGHT}/bach.png`, width: 72, height: 72 },
			BEAR: { key: `wimmelbild/${WIDTH}x${HEIGHT}/bear.png`, width: 72, height: 72 },
			ENTLEIN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/entlein.png`, width: 72, height: 72 },
			HAUPTMANN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/hauptmann.png`, width: 72, height: 72 },
			NEINHORN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/neinhorn.png`, width: 72, height: 72 },
			RONJA: { key: `wimmelbild/${WIDTH}x${HEIGHT}/ronja.png`, width: 72, height: 72 },
			SAMS: { key: `wimmelbild/${WIDTH}x${HEIGHT}/sams.png`, width: 71.5, height: 71.5 },
		},
		CAT: {
			CAT: { key: `cat/${WIDTH}x${HEIGHT}/cat.png`, width: 125, height: 125 },
			CATSLEEPING: { key: `cat/${WIDTH}x${HEIGHT}/catSleeping.png`, width: 92.75, height: 63 },
		}
	} : {
		BACKSTAGE: {
			KNOBPROGRAM: { key: `backstage/${WIDTH}x${HEIGHT}/knob-program.png`, width: 156, height: 152 },
			KNOBRED:     { key: `backstage/${WIDTH}x${HEIGHT}/knob-red.png`    , width: 68, height: 52 },
			KNOBYELLOW1: { key: `backstage/${WIDTH}x${HEIGHT}/knob-yellow1.png`, width: 68, height: 52 },
			KNOBYELLOW2: { key: `backstage/${WIDTH}x${HEIGHT}/knob-yellow2.png`, width: 68, height: 52 },
		},
		ENTRANCE: {
			WOMANINPOSTER: { key: `entrance/${WIDTH}x${HEIGHT}/womanInPoster.png`, width: 125, height: 145 },
		},
		FOYER: {
			ATZE: { key: `foyer/${WIDTH}x${HEIGHT}/atze.png`, width: 304.7, height: 304.666 },
			ATZETALKING: { key: `foyer/${WIDTH}x${HEIGHT}/atzeTalking.png`, width: 81.2, height: 71 },
			SNORLAX: { key: `foyer/${WIDTH}x${HEIGHT}/snorlax.png`, width: 149.857, height: 216 },
			CHOCO: { key: `foyer/${WIDTH}x${HEIGHT}/choco.png`, width: 50, height: 75 },
		},
		PIANO: {
			LINEWOBBLE: { key: `piano/${WIDTH}x${HEIGHT}/lineWobble.png`, width: 80.8333, height: 900 },
		},
		SHOWROOM: {
			MELODIA: { key: `showroom/${WIDTH}x${HEIGHT}/melodia.png`, width: 123.8, height: 126.5 },
		},
		WIMMELBILD: {
			ALBIREA: { key: `wimmelbild/${WIDTH}x${HEIGHT}/albirea.png`, width: 144, height: 144 },
			// ATZE: { key: `wimmelbild/${WIDTH}x${HEIGHT}/atze.png`, width: 144, height: 144 },
			BACH: { key: `wimmelbild/${WIDTH}x${HEIGHT}/bach.png`, width: 144, height: 144 },
			BEAR: { key: `wimmelbild/${WIDTH}x${HEIGHT}/bear.png`, width: 144, height: 144 },
			ENTLEIN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/entlein.png`, width: 144, height: 144 },
			HAUPTMANN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/hauptmann.png`, width: 144, height: 144 },
			NEINHORN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/neinhorn.png`, width: 144, height: 144 },
			RONJA: { key: `wimmelbild/${WIDTH}x${HEIGHT}/ronja.png`, width: 144, height: 144 },
			SAMS: { key: `wimmelbild/${WIDTH}x${HEIGHT}/sams.png`, width: 143, height: 143 },
		},
		STAGE: {
			ALBIREAARM: { key: `stage/${WIDTH}x${HEIGHT}/albirea-arm.png`, width: 123.4, height: 152 },
			ALBIREAHEAD: { key: `stage/${WIDTH}x${HEIGHT}/albirea-head.png`, width: 78.2, height: 87.5 },
			BACHHEAD: { key: `stage/${WIDTH}x${HEIGHT}/bach-head.png`, width: 85.9, height: 95.5 },
			BEARHAND: { key: `stage/${WIDTH}x${HEIGHT}/bear-hand.png`, width: 56.75, height: 47 },
			BEARHEAD: { key: `stage/${WIDTH}x${HEIGHT}/bear-head.png`, width: 76.2, height: 76.5 },
			HAUPTMANNHEAD: { key: `stage/${WIDTH}x${HEIGHT}/hauptmann-head.png`, width: 53.5, height: 68.5 },
			MOUSE: { key: `stage/${WIDTH}x${HEIGHT}/mouse.png`, width: 29.25, height: 39 },
			NEINHORNHEAD: { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-head.png`, width: 89.8, height: 89 },
			NEINHORNLEG: { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-leg.png`, width: 132.75, height: 234 },
			NEINHORNTAIL: { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-tail.png`, width: 162, height: 312 },
			RONJAHEAD: { key: `stage/${WIDTH}x${HEIGHT}/ronja-head.png`, width: 88, height: 77 },
			SAMSHEAD: { key: `stage/${WIDTH}x${HEIGHT}/sams-head.png`, width: 74.8, height: 59 },
			ALBIREA: { key: `wimmelbild/${WIDTH}x${HEIGHT}/albirea.png`, width: 144, height: 144 },
			// ATZE: { key: `wimmelbild/${WIDTH}x${HEIGHT}/atze.png`, width: 144, height: 144 },
			BACH: { key: `wimmelbild/${WIDTH}x${HEIGHT}/bach.png`, width: 144, height: 144 },
			BEAR: { key: `wimmelbild/${WIDTH}x${HEIGHT}/bear.png`, width: 144, height: 144 },
			ENTLEIN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/entlein.png`, width: 144, height: 144 },
			HAUPTMANN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/hauptmann.png`, width: 144, height: 144 },
			NEINHORN: { key: `wimmelbild/${WIDTH}x${HEIGHT}/neinhorn.png`, width: 144, height: 144 },
			RONJA: { key: `wimmelbild/${WIDTH}x${HEIGHT}/ronja.png`, width: 144, height: 144 },
			SAMS: { key: `wimmelbild/${WIDTH}x${HEIGHT}/sams.png`, width: 143, height: 143 },
		},
		CAT: {
			CAT: { key: `cat/${WIDTH}x${HEIGHT}/cat.png`, width: 250, height: 250 },
			CATSLEEPING: { key: `cat/${WIDTH}x${HEIGHT}/catSleeping.png`, width: 185.5, height: 125 },
		}
	},
	soundsPersistant: {
		AMBIENCE: {
			CITYRAIN: { key: 'ambience/cityrain.mp3', volume: 1 },
			LOFI: { key: 'ambience/lofi.mp3', volume: 0.4 },
			JAZZ: { key: 'ambience/jazz.mp3', volume: 0.05 },
			NOBLESBERLIN: { key: 'ambience/noblesBerlin.mp3', volume: 1 },
		},
		CAT: {
			MEOW: { key: 'cat/nya.mp3', volume: 1 },
			MEOWMEOWMEOW: { key: 'cat/meowmeowmeow.mp3', volume: 0.2 },
			ATTENTION: { key: 'cat/wants-attention.mp3', volume: 1 },
			PURR: { key: 'cat/purr.mp3', volume: 0.15 },
		},
	},
	sounds: {
		BACKSTAGE: {
			SWITCHDOUBLE: { key: 'backstage/switchDouble.mp3', volume: 1 },
			SWITCHLARGE:  { key: 'backstage/switchLarge.mp3' , volume: 1 },
			SWITCHSMALL:  { key: 'backstage/switchSmall.mp3' , volume: 1 },
		},
		ENTRANCE: {
			WOMANINPOSTER: { key: 'entrance/womanInPoster.mp3', volume: 0.8 },
		},
		FOYER: {
			WOISTDENNNUR:                { key: 'foyer/atze/01 - woIstDennNur.mp3',      volume: 1 },
			FERDISTROMPETE:              { key: 'foyer/atze/02 - ferdiesTrompete.mp3',   volume: 1 },
			OHHALLO:                     { key: 'foyer/atze/03 - ohHallo.mp3',           volume: 1 },
			OBENIMSPIELZIMMER:           { key: 'foyer/atze/04 - obenImSpielzimmer.mp3', volume: 1 },
			found_bandaid:               { key: 'foyer/atze/found_bandaid.mp3',          volume: 1 },
			found_cristals:              { key: 'foyer/atze/found_cristals.mp3',         volume: 1 },
			found_everyone:              { key: 'foyer/atze/found_everyone.mp3',         volume: 1 },
			found_hair:                  { key: 'foyer/atze/found_hair.mp3',             volume: 1 },
			found_knife:                 { key: 'foyer/atze/found_knife.mp3',            volume: 1 },
			found_pass:                  { key: 'foyer/atze/found_pass.mp3',             volume: 1 },
			found_wunschmaschine:        { key: 'foyer/atze/found_wunschmaschine.mp3',   volume: 1 },
			missing_bandaid:             { key: 'foyer/atze/missing_bandaid.mp3',        volume: 1 },
			missing_cristals:            { key: 'foyer/atze/missing_cristals.mp3',       volume: 1 },
			missing_hair:                { key: 'foyer/atze/missing_hair.mp3',           volume: 1 },
			missing_knife:               { key: 'foyer/atze/missing_knife.mp3',          volume: 1 },
			missing_pass:                { key: 'foyer/atze/missing_pass.mp3',           volume: 1 },
			missing_wunschmaschine:      { key: 'foyer/atze/missing_wunschmaschine.mp3', volume: 1 },
			missing_albirea:             { key: 'foyer/atze/missing_albirea.mp3',        volume: 1 },
			missing_bach:                { key: 'foyer/atze/missing_bach.mp3',           volume: 1 },
			missing_bear:                { key: 'foyer/atze/missing_bear.mp3',           volume: 1 },
			missing_entlein:             { key: 'foyer/atze/missing_entlein.mp3',        volume: 1 },
			missing_hauptmann:           { key: 'foyer/atze/missing_hauptmann.mp3',      volume: 1 },
			missing_neinhorn:            { key: 'foyer/atze/missing_neinhorn.mp3',       volume: 1 },
			missing_ronja:               { key: 'foyer/atze/missing_ronja.mp3',          volume: 1 },
			missing_sams:                { key: 'foyer/atze/missing_sams.mp3',           volume: 1 },
		},
		PIANO: {
			F:  { key: 'piano/piano/09.mp3', volume: 1 },
			FS: { key: 'piano/piano/10.mp3', volume: 1 },
			G:  { key: 'piano/piano/11.mp3', volume: 1 },
			GS: { key: 'piano/piano/12.mp3', volume: 1 },
			A:  { key: 'piano/piano/13.mp3', volume: 1 },
			AS: { key: 'piano/piano/14.mp3', volume: 1 },
			B:  { key: 'piano/piano/15.mp3', volume: 1 },
			C:  { key: 'piano/piano/16.mp3', volume: 1 },
			CS: { key: 'piano/piano/17.mp3', volume: 1 },
			D:  { key: 'piano/piano/18.mp3', volume: 1 },
			DS: { key: 'piano/piano/19.mp3', volume: 1 },
			E:  { key: 'piano/piano/20.mp3', volume: 1 },
			F2: { key: 'piano/piano/21.mp3', volume: 1 },
			APPLAUSE: { key: 'piano/sfx/applause.mp3', volume: 1 },
			BOING: { key: 'piano/sfx/boing.mp3', volume: 1 },
			BOTTLEPOP: { key: 'piano/sfx/bottlepop.mp3', volume: 1 },
			BUBBLE: { key: 'piano/sfx/bubble.mp3', volume: 1 },
			BUBBLES: { key: 'piano/sfx/bubbles.mp3', volume: 1 },
			BELLRATTLE: { key: 'piano/sfx/bellrattle.mp3', volume: 1 },
			SADTROMBONE: { key: 'piano/sfx/sadtrombone.mp3', volume: 1 },
			HARPGLISSUP: { key: 'piano/sfx/harpglissup.mp3', volume: 1 },
			HARPGLISSDOWN: { key: 'piano/sfx/harpglissdown.mp3', volume: 1 },
			CASHREGISTER: { key: 'piano/sfx/cashregister.mp3', volume: 1 },
			COMICCOWBELLS: { key: 'piano/sfx/comiccowbells.mp3', volume: 1 },
			DOG: { key: 'piano/sfx/dog.mp3', volume: 1 },
			DOORSLAM: { key: 'piano/sfx/doorslam.mp3', volume: 1 },
			FOOTSTEP: { key: 'piano/sfx/footstep.mp3', volume: 1 },
			HELICOPTER: { key: 'piano/sfx/helicopter.mp3', volume: 1 },
			HORSEGALLOP: { key: 'piano/sfx/horsegallop.mp3', volume: 1 },
			PLOP: { key: 'piano/sfx/plop.mp3', volume: 1 },
			SWOOP1: { key: 'piano/sfx/swoop1.mp3', volume: 1 },
			SWOOP2: { key: 'piano/sfx/swoop2.mp3', volume: 1 },
			SWOOP3: { key: 'piano/sfx/swoop3.mp3', volume: 1 },
			TELEPHONE: { key: 'piano/sfx/telephone.mp3', volume: 1 },
			THUNDER: { key: 'piano/sfx/thunder.mp3', volume: 1 },
			TYPEWRITER1: { key: 'piano/sfx/typewriter1.mp3', volume: 1 },
			TYPEWRITER2: { key: 'piano/sfx/typewriter2.mp3', volume: 1 },
			WINDCHIMES: { key: 'piano/sfx/windchimes.mp3', volume: 1 },
		},
		SHOWROOM: {
			TUBA: { key: 'showroom/melodia/tuba.mp3', volume: 1 },
			PARCOUR: { key: 'showroom/melodia/parcour.mp3', volume: 1 },
		},
		STAGE: {
			hauptmann_hauptmann: { key: 'stage/hauptmann_hauptmann.mp3', volume: 1 },
			hauptmann_neinhorn: { key: 'stage/hauptmann_neinhorn.mp3', volume: 1 },
			neinhorn_neinhorn: { key: 'stage/neinhorn_neinhorn.mp3', volume: 1 },
			neinhorn_ronja: { key: 'stage/neinhorn_ronja.mp3', volume: 1 },
			neinhorn_hauptmann: { key: 'stage/neinhorn_hauptmann.mp3', volume: 1 },
		},
		WIMMELBILD: {
			ALBIREA: { key: 'wimmelbild/albirea.mp3', volume: 1 },
			BACH: { key: 'wimmelbild/womanInPoster_bach.mp3', volume: 0.8 },
			BEAR: { key: 'wimmelbild/womanInPoster_bear.mp3', volume: 0.8 },
			ENTLEIN: { key: 'wimmelbild/womanInPoster_entlein.mp3', volume: 0.8 },
			HAUPTMANN: { key: 'wimmelbild/womanInPoster_hauptmann.mp3', volume: 0.8 },
			NEINHORN: { key: 'wimmelbild/womanInPoster_neinhorn.mp3', volume: 0.8 },
			RONJA: { key: 'wimmelbild/ronja.mp3', volume: 1 },
			SAMS: { key: 'wimmelbild/womanInPoster_sams.mp3', volume: 0.8 },
			FOUND: { key: 'wimmelbild/harpglissup.mp3', volume: 1 },
		},
	},
	videos: {
		// BACKSTAGE: {
		// 	// MASKE: { key: 'backstage/backstage01.mp4', volume: 0.7 },
		// 	// NEINHORN: { key: 'backstage/backstage02.mp4', volume: 0.7 },
		// 	MASKE: { key: 'backstage/josephine.mp4', volume: 0.7 },
		// 	NEINHORN: { key: 'backstage/claire.mp4', volume: 0.7 },
		// },
	},
}

function getState (): State {
	const state = Up.getState({ game: game })
	return state as State
}
function addState ( change: StateFields ): State {
	const newState = { ...getState(), ...change }
	Up.setState({ game: game, newState: newState })
	return newState
}

// Shortcuts
const h = game.config.height
const w = game.config.width
const s = game.config.scale





// other
// const directions = ['LEFT', 'RIGHT', 'UP', 'DOWN'] as const
// type Direction = typeof directions[number]
//
// const COLORS = {
// 	BACKGROUND: new Phaser.Display.Color(18, 3, 48, 255),
// 	TEXT: new Phaser.Display.Color(255, 255, 255, 255),
// 	PRIMARY: new Phaser.Display.Color(242, 19, 183, 255),
// }


export {
	game,
	cache,
	getState,
	addState,
	INITIALSCENE,
	// Shortcuts
	h, w, s,
}

