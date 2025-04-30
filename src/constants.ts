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

import * as Up from './utils/phaser/common'

// ascii letters only
const VERSION = '1.0.59'
const NAMEOFGAME = 'atzeunddu'
const INITIALSCENE = 'fassade'

// // Adaptive asset quality
// const WIDTH  = ( Ug.onMobileDevice() && !Ug.onTablet() ) ? 800 : 1600
// const HEIGHT = ( Ug.onMobileDevice() && !Ug.onTablet() ) ? 450 : 900
// const SCALE  = ( Ug.onMobileDevice() && !Ug.onTablet() ) ? 1 : 2

// Non-adaptive asset quality
const WIDTH  = 1600
const HEIGHT =  900
const SCALE  = false ? 1 : 2

const currentCacheName = `${NAMEOFGAME}-${VERSION}`

// Extend the interface from module phaser/common
declare module "./utils/phaser/common" {
	interface State {
		// conversations: { [key: string]: Conversation },
		entranceopen: boolean,
		womanWelcomed: boolean,
		metAtze: boolean,
		atzeCommentedFoundPeople: number,
		cashierSpoke: boolean,
		piano: string,
		presentation: string,
		arrivedAtWimmelbild: boolean,
		arrivedAtBouncer: boolean,
		peopleFound: Array<string>,
		peopleFoundPrevious: Array<string>,
		inventory: Array<string>,
		givenToAtze: Array<string>,
	}
	// type PartialState = Partial<State>
}

const initialState: Up.State = {

	hasStarted: false,
	paused: false,
	previousScene: INITIALSCENE,
	currentScene: INITIALSCENE,
	solo: [],
	// conversations: {},
	entranceopen: false,
	womanWelcomed: false,
	metAtze: false,
	atzeCommentedFoundPeople: 0,
	cashierSpoke: false,
	piano: 'sfx',
	presentation: '',
	arrivedAtWimmelbild: false,
	arrivedAtBouncer: false,
	peopleFound: [],
	peopleFoundPrevious: [],
	inventory: [],
	givenToAtze: [],
}

const config = {
	name: NAMEOFGAME,
	width:  WIDTH,
	height: HEIGHT,
	scale:  SCALE,
	gravity: 0,
	durationSceneTransition: 2000,
} as const
type ConfigOption = (typeof config)[keyof typeof config]

const initialScenes = [
	"fassade",
	"entrance",
]

const scenes = {
	Init: 'init',
	Loader: 'loader',
	Fassade: 'fassade',
	Entrance: 'entrance',
	Foyer: 'foyer',
	Trailers: 'trailers',
	Cashier: 'cashier',
	Hallway: 'hallway',
	Stagedoor: 'stagedoor',
	Stage: 'stage',
	Backstage: 'backstage',
	Piano: 'piano',
	Showroom: 'showroom',
	Looper: 'looper',
	Paint: 'paint',
	Presentation: 'presentation',
	Wimmelbild: 'wimmelbild',
	Snooze: 'snooze',
} as const
type Scene = (typeof scenes)[keyof typeof scenes]

const images = {
	other: {
		circle: { key: `other/${WIDTH}x${HEIGHT}/glowCircle_small.png` },
	},
	backstage: {
		background:     { key: `backstage/${WIDTH}x${HEIGHT}/television.png` },
		wunschmaschine: { key: `strayitems/${WIDTH}x${HEIGHT}/wunschmaschine.png` },
	},
	cashier: {
		background:     { key: `cashier/${WIDTH}x${HEIGHT}/background.jpg` },
		bandaid:        { key: `strayitems/${WIDTH}x${HEIGHT}/bandaid.png` },
	},
	entrance: {
		background:     { key: `entrance/${WIDTH}x${HEIGHT}/background.png` },
		doorleft:       { key: `entrance/${WIDTH}x${HEIGHT}/doorLeft.png` },
		doorright:      { key: `entrance/${WIDTH}x${HEIGHT}/doorRight.png` },
		inner:          { key: `entrance/${WIDTH}x${HEIGHT}/inner.png` },
		raindrop:       { key: `other/${WIDTH}x${HEIGHT}/raindrop.png` },
		knife:          { key: `strayitems/${WIDTH}x${HEIGHT}/knife.png` },
	},
	fassade: {
		background:     { key: `fassade/${WIDTH}x${HEIGHT}/background.png` },
		doorleft:       { key: `fassade/${WIDTH}x${HEIGHT}/doorLeft.png` },
		doorright:      { key: `fassade/${WIDTH}x${HEIGHT}/doorRight.png` },
		doorinner:      { key: `fassade/${WIDTH}x${HEIGHT}/doorInner.png` },
		pillar1:        { key: `fassade/${WIDTH}x${HEIGHT}/pillar1.png` },
		pillar2:        { key: `fassade/${WIDTH}x${HEIGHT}/pillar2.png` },
		raindrop:       { key: `other/${WIDTH}x${HEIGHT}/raindrop.png` },
	},
	foyer: {
		background:     { key: `foyer/${WIDTH}x${HEIGHT}/background.jpg` },
		cashier:        { key: `foyer/${WIDTH}x${HEIGHT}/cashier.png` },
		shutters:       { key: `foyer/${WIDTH}x${HEIGHT}/shutters.png` },
		// stray items
		bandaid:        { key: `strayitems/${WIDTH}x${HEIGHT}/bandaid.png` },
		pass:           { key: `strayitems/${WIDTH}x${HEIGHT}/pass.png` },
	},
	trailers: {
		background:     { key: `trailers/${WIDTH}x${HEIGHT}/flatscreen.png` },
		button1a:       { key: `trailers/${WIDTH}x${HEIGHT}/button-1-a.png` },
		button1b:       { key: `trailers/${WIDTH}x${HEIGHT}/button-1-b.png` },
		button2a:       { key: `trailers/${WIDTH}x${HEIGHT}/button-2-a.png` },
		button2b:       { key: `trailers/${WIDTH}x${HEIGHT}/button-2-b.png` },
		button3a:       { key: `trailers/${WIDTH}x${HEIGHT}/button-3-a.png` },
		button3b:       { key: `trailers/${WIDTH}x${HEIGHT}/button-3-b.png` },
	},
	hallway: {
		background:     { key: `hallway/${WIDTH}x${HEIGHT}/background.jpg` },
		railing:        { key: `hallway/${WIDTH}x${HEIGHT}/railing.png` },
		railingstage:   { key: `hallway/${WIDTH}x${HEIGHT}/railing-stage.png` },
		bouncer:        { key: `hallway/${WIDTH}x${HEIGHT}/bouncer.png` },
		trumpet:        { key: `strayitems/${WIDTH}x${HEIGHT}/trumpet.png` },
	},
	inventory: {
		// stray items
		chest:          { key: `strayitems/${WIDTH}x${HEIGHT}/chest.png` },
		bandaid:        { key: `strayitems/${WIDTH}x${HEIGHT}/bandaid-button.png` },
		crystals:       { key: `strayitems/${WIDTH}x${HEIGHT}/crystals-button.png` },
		knife:          { key: `strayitems/${WIDTH}x${HEIGHT}/knife-button.png` },
		trumpet:        { key: `strayitems/${WIDTH}x${HEIGHT}/trumpet-button.png` },
		pass:           { key: `strayitems/${WIDTH}x${HEIGHT}/pass-button.png` },
		wig:            { key: `strayitems/${WIDTH}x${HEIGHT}/wig-button.png` },
		wunschmaschine: { key: `strayitems/${WIDTH}x${HEIGHT}/wunschmaschine-button.png` },
	},
	looper: {
		background:     { key: `looper/${WIDTH}x${HEIGHT}/background.jpg` },
		darkCircle:     { key: `looper/${WIDTH}x${HEIGHT}/darkCircle.png` },
		redCircle:      { key: `looper/${WIDTH}x${HEIGHT}/redCircle.png` },
	},
	paint: {
		background:     { key: `paint/${WIDTH}x${HEIGHT}/background.jpg` },
		brush1:         { key: `paint/${WIDTH}x${HEIGHT}/brush1.png` },
		brush2:         { key: `paint/${WIDTH}x${HEIGHT}/brush2.png` },
		brush3:         { key: `paint/${WIDTH}x${HEIGHT}/brush3.png` },
		crystals:       { key: `strayitems/${WIDTH}x${HEIGHT}/crystals.png` },
	},
	piano: {
		background:     { key: `piano/${WIDTH}x${HEIGHT}/background.jpg` },
		button:         { key: `piano/${WIDTH}x${HEIGHT}/button.png` },
		whitekeys:      { key: `piano/${WIDTH}x${HEIGHT}/whitekeys.blank.png` },
		blackkeys:      { key: `piano/${WIDTH}x${HEIGHT}/blackkeys.png` },
		lineg:          { key: `piano/${WIDTH}x${HEIGHT}/lineG.png` },
		linea:          { key: `piano/${WIDTH}x${HEIGHT}/lineA.png` },
		lineb:          { key: `piano/${WIDTH}x${HEIGHT}/lineB.png` },
		linec:          { key: `piano/${WIDTH}x${HEIGHT}/lineC.png` },
		lined:          { key: `piano/${WIDTH}x${HEIGHT}/lineD.png` },
		linee:          { key: `piano/${WIDTH}x${HEIGHT}/lineE.png` },
		linef:          { key: `piano/${WIDTH}x${HEIGHT}/lineF.png` },
	},
	// presentation: {
	// 	background: { key: `presentation/${WIDTH}x${HEIGHT}/background.jpg` },
	// 	buttonleft: { key: `presentation/${WIDTH}x${HEIGHT}/buttonLeft.png` },
	// 	buttonlefthover: { key: `presentation/${WIDTH}x${HEIGHT}/buttonLeftHover.png` },
	// 	buttonright: { key: `presentation/${WIDTH}x${HEIGHT}/buttonRight.png` },
	// 	buttonrighthover: { key: `presentation/${WIDTH}x${HEIGHT}/buttonRightHover.png` },
	// 	podiumhorizontal01: { key: `presentation/${WIDTH}x${HEIGHT}/podiumHorizontal01.jpg` },
	// 	podiumhorizontal02: { key: `presentation/${WIDTH}x${HEIGHT}/podiumHorizontal02.jpg` },
	// 	podiumvertikal01: { key: `presentation/${WIDTH}x${HEIGHT}/podiumVertikal01.jpg` },
	// 	podiumvertikal02: { key: `presentation/${WIDTH}x${HEIGHT}/podiumVertikal02.jpg` },
	// 	stimmederzukunfthorizontal01: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftHorizontal01.jpg` },
	// 	stimmederzukunfthorizontal02: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftHorizontal02.jpg` },
	// 	stimmederzukunftvertikal01: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftVertikal01.jpg` },
	// 	stimmederzukunftvertikal02: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftVertikal02.jpg` },
	// 	familiennachthorizontal01: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtHorizontal01.jpg` },
	// 	// familiennachthorizontal02: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtHorizontal02.jpg` },
	// 	familiennachtvertikal01: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtVertikal01.jpg` },
	// 	familiennachtvertikal02: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtVertikal02.jpg` },
	// },
	showroom: {
		background:     { key: `showroom/${WIDTH}x${HEIGHT}/background.jpg` },
		wig:            { key: `strayitems/${WIDTH}x${HEIGHT}/wig.png` },
		// podiumvertikal01: { key: `presentation/${WIDTH}x${HEIGHT}/podiumVertikal01.jpg` },
		// podiumvertikal02: { key: `presentation/${WIDTH}x${HEIGHT}/podiumVertikal02.jpg` },
		// stimmederzukunftvertikal01: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftVertikal01.jpg` },
		// stimmederzukunftvertikal02: { key: `presentation/${WIDTH}x${HEIGHT}/stimmeDerZukunftVertikal02.jpg` },
		// familiennachtvertikal01: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtVertikal01.jpg` },
		// familiennachtvertikal02: { key: `presentation/${WIDTH}x${HEIGHT}/familiennachtVertikal02.jpg` },
	},
	stage: {
		background:    { key: `stage/${WIDTH}x${HEIGHT}/background.jpg` },
		// background: { key: `stage/${WIDTH}x${HEIGHT}/6-Buhne.small.png` },
		albirea:       { key: `stage/${WIDTH}x${HEIGHT}/albirea.png` },
		bach:          { key: `stage/${WIDTH}x${HEIGHT}/bach.png` },
		bear:          { key: `stage/${WIDTH}x${HEIGHT}/bear.png` },
		entlein:       { key: `stage/${WIDTH}x${HEIGHT}/entlein.png` },
		hauptmann:     { key: `stage/${WIDTH}x${HEIGHT}/hauptmann.png` },
		neinhorn:      { key: `stage/${WIDTH}x${HEIGHT}/neinhorn.png` },
		ronja:         { key: `stage/${WIDTH}x${HEIGHT}/ronja.png` },
		ronjastanding: { key: `stage/${WIDTH}x${HEIGHT}/ronjastanding.png` },
		sams:          { key: `stage/${WIDTH}x${HEIGHT}/sams.png` },
		question:      { key: `dialogue/${WIDTH}x${HEIGHT}/question.png` },
		exclamation:   { key: `dialogue/${WIDTH}x${HEIGHT}/exclamation.png` },
		funny:         { key: `dialogue/${WIDTH}x${HEIGHT}/funny.png` },
		bye:           { key: `dialogue/${WIDTH}x${HEIGHT}/bye.png` },
	},
	stagedoor: {
		background: { key: `stagedoor/${WIDTH}x${HEIGHT}/background.jpg` },
		bouncer:    { key: `stagedoor/${WIDTH}x${HEIGHT}/bouncer.png` },
	},
	wimmelbild: {
		berlin:    { key: `wimmelbild/${WIDTH}x${HEIGHT}/berlin.jpg` },
		lensplus:  { key: `wimmelbild/${WIDTH}x${HEIGHT}/lensplus.png` },
		lensminus: { key: `wimmelbild/${WIDTH}x${HEIGHT}/lensminus.png` },
	},
}

const sprites = {
// const sprites = SCALE === 1 ? {
// 	backstage: {
// 		knobprogram: { key: `backstage/${WIDTH}x${HEIGHT}/knob-program.png` , width: 78 , height: 76 },
// 		knobred:     { key: `backstage/${WIDTH}x${HEIGHT}/knob-red.png`     , width: 34 , height: 26 },
// 		knobyellow1: { key: `backstage/${WIDTH}x${HEIGHT}/knob-yellow1.png` , width: 34 , height: 26 },
// 		knobyellow2: { key: `backstage/${WIDTH}x${HEIGHT}/knob-yellow2.png` , width: 34 , height: 26 },
// 	},
// 	cat: {
// 		cat:         { key: `cat/${WIDTH}x${HEIGHT}/cat.png`         , width: 125    , height: 125 },
// 		catsleeping: { key: `cat/${WIDTH}x${HEIGHT}/catSleeping.png` , width:  92.75 , height:  63 },
// 	},
// 	entrance: {
// 		womaninposter: { key: `entrance/${WIDTH}x${HEIGHT}/womanInPoster.png` , width: 62.5 , height: 73 },
// 	},
// 	foyer: {
// 		atze:        { key: `foyer/${WIDTH}x${HEIGHT}/atze.png`         , width: 152.4  , height: 152.333 },
// 		atzetalking: { key: `foyer/${WIDTH}x${HEIGHT}/atzeTalking.png`  , width:  40.6  , height:  35.5   },
// 		snorlax:     { key: `foyer/${WIDTH}x${HEIGHT}/snorlax.png`      , width:  75    , height: 108     },
// 		choco:       { key: `foyer/${WIDTH}x${HEIGHT}/choco.png`        , width:  25    , height:  38     },
// 		snowman:     { key: `foyer/${WIDTH}x${HEIGHT}/snowman.png`      , width:  24.5  , height:  24.5   },
// 		wastebasket: { key: `foyer/${WIDTH}x${HEIGHT}/wastebasket.png`  , width:  31    , height:  31     },
// 		cashierhead: { key: `foyer/${WIDTH}x${HEIGHT}/cashier-head.png` , width:  19.54 , height:  23     },
// 	},
// 	hallway: {
// 		bouncerhead: { key: `hallway/${WIDTH}x${HEIGHT}/bouncer-head.png`, width: 37, height: 43 },
// 	},
// 	piano: {
// 		linewobble: { key: `piano/${WIDTH}x${HEIGHT}/lineWobble.png`, width: 40.5, height: 450 },
// 	},
// 	showroom: {
// 		melodia: { key: `showroom/${WIDTH}x${HEIGHT}/melodia.png`, width: 61.9, height: 63.5 },
// 	},
// 	stage: {
// 		albireaarm:    { key: `stage/${WIDTH}x${HEIGHT}/albirea-arm.png`    , width: 61.8   , height: 76   },
// 		albireahead:   { key: `stage/${WIDTH}x${HEIGHT}/albirea-head.png`   , width: 39.2   , height: 44   },
// 		bachhead:      { key: `stage/${WIDTH}x${HEIGHT}/bach-head.png`      , width: 43     , height: 48   },
// 		bearhand:      { key: `stage/${WIDTH}x${HEIGHT}/bear-hand.png`      , width: 28.5   , height: 24   },
// 		bearhead:      { key: `stage/${WIDTH}x${HEIGHT}/bear-head.png`      , width: 38.1   , height: 38.5 },
// 		hauptmannhead: { key: `stage/${WIDTH}x${HEIGHT}/hauptmann-head.png` , width: 26.8   , height: 34.5 },
// 		mouse:         { key: `stage/${WIDTH}x${HEIGHT}/mouse.png`          , width: 14.75  , height: 20   },
// 		neinhornhead:  { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-head.png`  , width: 45     , height: 44.5 },
// 		neinhornleg:   { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-leg.png`   , width: 66.375 , height: 117   },
// 		neinhorntail:  { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-tail.png`  , width: 81     , height: 156   },
// 		ronjahead:     { key: `stage/${WIDTH}x${HEIGHT}/ronja-head.png`     , width: 44     , height: 38.5 },
// 		samshead:      { key: `stage/${WIDTH}x${HEIGHT}/sams-head.png`      , width: 37.4   , height: 30   },
// 		// albirea:       { key: `wimmelbild/${WIDTH}x${HEIGHT}/albirea.png`   , width: 72     , height: 72   },
// 		// // atze:       { key: `wimmelbild/${WIDTH}x${HEIGHT}/atze.png`      , width: 72     , height: 72   },
// 		// bach:          { key: `wimmelbild/${WIDTH}x${HEIGHT}/bach.png`      , width: 72     , height: 72   },
// 		// bear:          { key: `wimmelbild/${WIDTH}x${HEIGHT}/bear.png`      , width: 72     , height: 72   },
// 		// entlein:       { key: `wimmelbild/${WIDTH}x${HEIGHT}/entlein.png`   , width: 72     , height: 72   },
// 		// hauptmann:     { key: `wimmelbild/${WIDTH}x${HEIGHT}/hauptmann.png` , width: 72     , height: 72   },
// 		// neinhorn:      { key: `wimmelbild/${WIDTH}x${HEIGHT}/neinhorn.png`  , width: 72     , height: 72   },
// 		// ronja:         { key: `wimmelbild/${WIDTH}x${HEIGHT}/ronja.png`     , width: 72     , height: 72   },
// 		// sams:          { key: `wimmelbild/${WIDTH}x${HEIGHT}/sams.png`      , width: 71.5   , height: 71.5 },
// 	},
// 	stagedoor: {
// 		bouncerhead: { key: `stagedoor/${WIDTH}x${HEIGHT}/bouncer-head.png` , width: 100 , height: 117 },
// 		bouncerarm : { key: `stagedoor/${WIDTH}x${HEIGHT}/bouncer-arm.png`  , width: 169 , height: 205 },
// 	},
// 	wimmelbild: {
// 		// atze:   { key: `wimmelbild/${WIDTH}x${HEIGHT}/atze.png`, width: 72, height: 72 },
// 		albirea:   { key: `wimmelbild/${WIDTH}x${HEIGHT}/albirea.png`   , width: 72   , height: 72   },
// 		bach:      { key: `wimmelbild/${WIDTH}x${HEIGHT}/bach.png`      , width: 72   , height: 72   },
// 		bear:      { key: `wimmelbild/${WIDTH}x${HEIGHT}/bear.png`      , width: 72   , height: 72   },
// 		entlein:   { key: `wimmelbild/${WIDTH}x${HEIGHT}/entlein.png`   , width: 72   , height: 72   },
// 		hauptmann: { key: `wimmelbild/${WIDTH}x${HEIGHT}/hauptmann.png` , width: 72   , height: 72   },
// 		neinhorn:  { key: `wimmelbild/${WIDTH}x${HEIGHT}/neinhorn.png`  , width: 72   , height: 72   },
// 		ronja:     { key: `wimmelbild/${WIDTH}x${HEIGHT}/ronja.png`     , width: 72   , height: 72   },
// 		sams:      { key: `wimmelbild/${WIDTH}x${HEIGHT}/sams.png`      , width: 71.5 , height: 71.5 } ,
// 	},
// } : {
	backstage: {
		knobprogram: { key: `backstage/${WIDTH}x${HEIGHT}/knob-program.png` , width: 156 , height: 152 },
		knobred:     { key: `backstage/${WIDTH}x${HEIGHT}/knob-red.png`     , width:  68 , height:  52 },
		knobyellow1: { key: `backstage/${WIDTH}x${HEIGHT}/knob-yellow1.png` , width:  68 , height:  52 },
		knobyellow2: { key: `backstage/${WIDTH}x${HEIGHT}/knob-yellow2.png` , width:  68 , height:  52 },
	},
	cashier: {
		blinking: { key: `cashier/${WIDTH}x${HEIGHT}/cashier-blink.png` , width: 307 , height: 380 },
		talking:  { key: `cashier/${WIDTH}x${HEIGHT}/cashier-talk.png`  , width: 307 , height: 380 },
	},
	cat: {
		cat:         { key: `cat/${WIDTH}x${HEIGHT}/cat.png`         , width: 250   , height: 250 },
		catsleeping: { key: `cat/${WIDTH}x${HEIGHT}/catSleeping.png` , width: 185.5 , height: 125 },
	},
	entrance: {
		womaninposter: { key: `entrance/${WIDTH}x${HEIGHT}/womanInPoster.png`, width: 125, height: 145 },
	},
	foyer: {
		atze:        { key: `foyer/${WIDTH}x${HEIGHT}/atze.png`         , width: 304.7   , height: 304.666 },
		atzetalking: { key: `foyer/${WIDTH}x${HEIGHT}/atzeTalking.png`  , width:  81.2   , height:  71     },
		snorlax:     { key: `foyer/${WIDTH}x${HEIGHT}/snorlax.png`      , width: 149.857 , height: 216     },
		choco:       { key: `foyer/${WIDTH}x${HEIGHT}/choco.png`        , width:  50     , height:  75     },
		snowman:     { key: `foyer/${WIDTH}x${HEIGHT}/snowman.png`      , width:  49     , height:  49     },
		wastebasket: { key: `foyer/${WIDTH}x${HEIGHT}/wastebasket.png`  , width:  62     , height:  62     },
		cashierhead: { key: `foyer/${WIDTH}x${HEIGHT}/cashier-head.png` , width:  39.00  , height:  46     },
	},
	hallway: {
		bouncerhead: { key: `hallway/${WIDTH}x${HEIGHT}/bouncer-head.png`     , width:  74, height:  86 },
		kangaroo:    { key: `hallway/${WIDTH}x${HEIGHT}/kangaroo.png`         , width: 100, height:  43 },
		friends:     { key: `hallway/${WIDTH}x${HEIGHT}/friends.png`          , width: 170, height:  94 },
		prisoners:   { key: `hallway/${WIDTH}x${HEIGHT}/prisoners.png`        , width:  95, height:  97 },
		guitar:      { key: `hallway/${WIDTH}x${HEIGHT}/guitar.png`           , width: 153, height: 125 },
		car:         { key: `hallway/${WIDTH}x${HEIGHT}/car.png`              , width:  94, height:  65 },
		princess:    { key: `hallway/${WIDTH}x${HEIGHT}/princess.png`         , width: 110, height: 112 },
	},
	piano: {
		linewobble: { key: `piano/${WIDTH}x${HEIGHT}/lineWobble.png`, width: 80.8333, height: 900 },
	},
	showroom: {
		melodia: { key: `showroom/${WIDTH}x${HEIGHT}/melodia.png`, width: 123.8, height: 126.5 },
	},
	stage: {
		albireaarm:    { key: `stage/${WIDTH}x${HEIGHT}/albirea-arm.png`    , width: 123.4  , height: 152   },
		albireahead:   { key: `stage/${WIDTH}x${HEIGHT}/albirea-head.png`   , width:  78.2  , height:  87.5 },
		bachhead:      { key: `stage/${WIDTH}x${HEIGHT}/bach-head.png`      , width:  85.9  , height:  95.5 },
		bearhand:      { key: `stage/${WIDTH}x${HEIGHT}/bear-hand.png`      , width:  56.75 , height:  47   },
		bearhead:      { key: `stage/${WIDTH}x${HEIGHT}/bear-head.png`      , width:  76.2  , height:  76.5 },
		hauptmannhead: { key: `stage/${WIDTH}x${HEIGHT}/hauptmann-head.png` , width:  53.5  , height:  68.5 },
		mouse:         { key: `stage/${WIDTH}x${HEIGHT}/mouse.png`          , width:  29.25 , height:  39   },
		neinhornhead:  { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-head.png`  , width:  89.8  , height:  89   },
		neinhornleg:   { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-leg.png`   , width: 132.75 , height: 234   },
		neinhorntail:  { key: `stage/${WIDTH}x${HEIGHT}/neinhorn-tail.png`  , width: 162    , height: 312   },
		ronjahead:     { key: `stage/${WIDTH}x${HEIGHT}/ronja-head.png`     , width:  88    , height:  77   },
		samshead:      { key: `stage/${WIDTH}x${HEIGHT}/sams-head.png`      , width:  74.8  , height:  59   },
		// albirea:       { key: `wimmelbild/${WIDTH}x${HEIGHT}/albirea.png`   , width: 144    , height: 144   },
		// // atze:       { key: `wimmelbild/${WIDTH}x${HEIGHT}/atze.png`      , width: 144    , height: 144   },
		// bach:          { key: `wimmelbild/${WIDTH}x${HEIGHT}/bach.png`      , width: 144    , height: 144   },
		// bear:          { key: `wimmelbild/${WIDTH}x${HEIGHT}/bear.png`      , width: 144    , height: 144   },
		// entlein:       { key: `wimmelbild/${WIDTH}x${HEIGHT}/entlein.png`   , width: 144    , height: 144   },
		// hauptmann:     { key: `wimmelbild/${WIDTH}x${HEIGHT}/hauptmann.png` , width: 144    , height: 144   },
		// neinhorn:      { key: `wimmelbild/${WIDTH}x${HEIGHT}/neinhorn.png`  , width: 144    , height: 144   },
		// ronja:         { key: `wimmelbild/${WIDTH}x${HEIGHT}/ronja.png`     , width: 144    , height: 144   },
		// sams:          { key: `wimmelbild/${WIDTH}x${HEIGHT}/sams.png`      , width: 143    , height: 143   },
	},
	stagedoor: {
		bouncerhead: { key: `stagedoor/${WIDTH}x${HEIGHT}/bouncer-head.png`, width: 200, height: 234 },
		bouncerarm : { key: `stagedoor/${WIDTH}x${HEIGHT}/bouncer-arm.png` , width: 373, height: 410 },
	},
	wimmelbild: {
		// atze:   { key: `wimmelbild/${WIDTH}x${HEIGHT}/atze.png`      , width: 144, height: 144 },
		albirea:   { key: `wimmelbild/${WIDTH}x${HEIGHT}/albirea.png`   , width: 144, height: 144 },
		bach:      { key: `wimmelbild/${WIDTH}x${HEIGHT}/bach.png`      , width: 144, height: 144 },
		bear:      { key: `wimmelbild/${WIDTH}x${HEIGHT}/bear.png`      , width: 144, height: 144 },
		entlein:   { key: `wimmelbild/${WIDTH}x${HEIGHT}/entlein.png`   , width: 144, height: 144 },
		hauptmann: { key: `wimmelbild/${WIDTH}x${HEIGHT}/hauptmann.png` , width: 144, height: 144 },
		neinhorn:  { key: `wimmelbild/${WIDTH}x${HEIGHT}/neinhorn.png`  , width: 144, height: 144 },
		ronja:     { key: `wimmelbild/${WIDTH}x${HEIGHT}/ronja.png`     , width: 144, height: 144 },
		sams:      { key: `wimmelbild/${WIDTH}x${HEIGHT}/sams.png`      , width: 143, height: 143 },
	},
}

const soundsPersistant = {
	ambience: {
		cityrain:     { key: 'ambience/cityrain.mp3'     , volume: 1    },
		jazz:         { key: 'ambience/jazz.mp3'         , volume: 0.05 },
		lofi:         { key: 'ambience/lofi.mp3'         , volume: 0.4  },
		noblesberlin: { key: 'ambience/noblesBerlin.mp3' , volume: 1  },
		silence:      { key: 'ambience/silence.mp3'      , volume: 1  },
	},
	cat: {
		meow:         { key: 'cat/nya.mp3'             , volume: 1    },
		meowmeowmeow: { key: 'cat/meowmeowmeow.mp3'    , volume: 0.2  },
		attention:    { key: 'cat/wants-attention.mp3' , volume: 1    },
		purr:         { key: 'cat/purr.mp3'            , volume: 0.15 },
	},
}

const sounds = {
	backstage: {
		switchdouble: { key: 'backstage/switchDouble.mp3', volume: 1 },
		switchlarge:  { key: 'backstage/switchLarge.mp3' , volume: 1 },
		switchsmall:  { key: 'backstage/switchSmall.mp3' , volume: 1 },
	},
	cashier: {
		repertoire: { key: 'cashier/repertoire.mp3'        , volume: 1 },
		pass:       { key: 'cashier/pass.mp3'              , volume: 1 },
		bandaid:    { key: 'cashier/bandaid.mp3'           , volume: 1 },
		yvette_0:   { key: 'cashier/yvette_ueberblick.mp3' , volume: 1 },
		yvette_1:   { key: 'cashier/yvette_ruecken.mp3'    , volume: 1 },
	},
	entrance: {
		womaninposter: { key: 'entrance/womanInPoster.mp3', volume: 1 },
		womanknife:    { key: 'entrance/womanKnife.mp3'   , volume: 1 },
		womanbuehne:   { key: 'entrance/womanBuehne.mp3'  , volume: 1 },
	},
	foyer: {
		woistdennnur:                { key: 'foyer/atze/01 - woIstDennNur.mp3'      , volume: 1 },
		ohhallo:                     { key: 'foyer/atze/02 - ohHallo.mp3'           , volume: 1 },
		obenimspielzimmer:           { key: 'foyer/atze/03 - obenImSpielzimmer.mp3' , volume: 1 },
		found_bandaid:               { key: 'foyer/atze/found_bandaid.mp3'          , volume: 1 },
		found_crystals:              { key: 'foyer/atze/found_crystals.mp3'         , volume: 1 },
		found_everyone:              { key: 'foyer/atze/found_everyone.mp3'         , volume: 1 },
		found_firstpeople:           { key: 'foyer/atze/found_firstpeople.mp3'      , volume: 1 },
		found_morepeople:            { key: 'foyer/atze/found_morepeople.mp3'       , volume: 1 },
		found_wig:                   { key: 'foyer/atze/found_wig.mp3'              , volume: 1 },
		found_knife:                 { key: 'foyer/atze/found_knife.mp3'            , volume: 1 },
		found_pass:                  { key: 'foyer/atze/found_pass.mp3'             , volume: 1 },
		found_trumpet:               { key: 'foyer/atze/found_trumpet.mp3'          , volume: 1 },
		found_wunschmaschine:        { key: 'foyer/atze/found_wunschmaschine.mp3'   , volume: 1 },
		missing_bandaid:             { key: 'foyer/atze/missing_bandaid.mp3'        , volume: 1 },
		missing_crystals:            { key: 'foyer/atze/missing_crystals.mp3'       , volume: 1 },
		missing_knife:               { key: 'foyer/atze/missing_knife.mp3'          , volume: 1 },
		missing_trumpet:             { key: 'foyer/atze/missing_trumpet.mp3'        , volume: 1 },
		missing_pass:                { key: 'foyer/atze/missing_pass.mp3'           , volume: 1 },
		missing_wig:                 { key: 'foyer/atze/missing_wig.mp3'            , volume: 1 },
		missing_wunschmaschine:      { key: 'foyer/atze/missing_wunschmaschine.mp3' , volume: 1 },
		missing_albirea:             { key: 'foyer/atze/missing_albirea.mp3'        , volume: 1 },
		missing_bach:                { key: 'foyer/atze/missing_bach.mp3'           , volume: 1 },
		missing_bear:                { key: 'foyer/atze/missing_bear.mp3'           , volume: 1 },
		missing_entlein:             { key: 'foyer/atze/missing_entlein.mp3'        , volume: 1 },
		missing_hauptmann:           { key: 'foyer/atze/missing_hauptmann.mp3'      , volume: 1 },
		missing_neinhorn:            { key: 'foyer/atze/missing_neinhorn.mp3'       , volume: 1 },
		missing_ronja:               { key: 'foyer/atze/missing_ronja.mp3'          , volume: 1 },
		missing_sams:                { key: 'foyer/atze/missing_sams.mp3'           , volume: 1 },
		// others characters
		snowman:                     { key: 'ambience/silence.mp3'                   , volume: 0.01 },
		bin_barf:                    { key: 'foyer/bin_barf.mp3'                     , volume: 1 },
		bin_chewinggum:              { key: 'foyer/bin_chewinggum.mp3'               , volume: 1 },
		bin_morgensabends:           { key: 'foyer/bin_morgensabends.mp3'            , volume: 1 },
		bin_obiwan:                  { key: 'foyer/bin_obiwan.mp3'                   , volume: 1 },
		bin_r2d2:                    { key: 'foyer/bin_r2d2.mp3'                     , volume: 1 },
		guitar_waswollenwirtrinken:  { key: 'foyer/guitar_waswollenwirtrinken.mp3'   , volume: 1 },
	},
	hallway: {
		foundTrumpet:                { key: 'hallway/bouncer_foundtrumpet.mp3'       , volume: 1 },
	},
	inventory: {
		found:                       { key: 'strayitems/found.mp3'             , volume: 0.8 },
	},
	looper: {
		switchsmall:  { key: 'backstage/switchSmall.mp3'    , volume: 1 },

		pop_punk_drums:   { key: 'looper/poppunk/drums.mp3'       , volume: 1 },
		pop_punk_bass:    { key: 'looper/poppunk/bass.mp3'        , volume: 1 },
		pop_punk_chords:  { key: 'looper/poppunk/chords.mp3'      , volume: 1 },
		pop_punk_melody:  { key: 'looper/poppunk/melody.mp3'      , volume: 1 },
		pop_punk_texture: { key: 'looper/poppunk/texture.mp3'     , volume: 1 },

		boom_bap_drums:   { key: 'looper/boombap/drums.mp3'       , volume: 1 },
		boom_bap_bass:    { key: 'looper/boombap/bass2.mp3'        , volume: 1 },
		boom_bap_chords:  { key: 'looper/boombap/chords.mp3'      , volume: 1 },
		boom_bap_melody:  { key: 'looper/boombap/melody.mp3'      , volume: 1 },
		boom_bap_texture: { key: 'looper/boombap/percussion.mp3'  , volume: 1 },

		ghost_drums:   { key: 'looper/ghost/drums.mp3'       , volume: 1 },
		ghost_bass:    { key: 'looper/ghost/bass.mp3'        , volume: 1 },
		ghost_chords:  { key: 'looper/ghost/chords.mp3'      , volume: 1 },
		ghost_melody:  { key: 'looper/ghost/melody.mp3'      , volume: 1 },
		ghost_texture: { key: 'looper/ghost/texture.mp3'     , volume: 1 },

		indian_drums:   { key: 'looper/indian/drums.mp3'       , volume: 1 },
		indian_bass:    { key: 'looper/indian/bass.mp3'        , volume: 1 },
		indian_chords:  { key: 'looper/indian/chords.mp3'      , volume: 1 },
		indian_melody:  { key: 'looper/indian/melody.mp3'      , volume: 1 },
		indian_texture: { key: 'looper/indian/texture.mp3'     , volume: 1 },
	},
	piano: {
		f:  { key: 'piano/piano/09.mp3', volume: 1 },
		fs: { key: 'piano/piano/10.mp3', volume: 1 },
		g:  { key: 'piano/piano/11.mp3', volume: 1 },
		gs: { key: 'piano/piano/12.mp3', volume: 1 },
		a:  { key: 'piano/piano/13.mp3', volume: 1 },
		as: { key: 'piano/piano/14.mp3', volume: 1 },
		b:  { key: 'piano/piano/15.mp3', volume: 1 },
		c:  { key: 'piano/piano/16.mp3', volume: 1 },
		cs: { key: 'piano/piano/17.mp3', volume: 1 },
		d:  { key: 'piano/piano/18.mp3', volume: 1 },
		ds: { key: 'piano/piano/19.mp3', volume: 1 },
		e:  { key: 'piano/piano/20.mp3', volume: 1 },
		f2: { key: 'piano/piano/21.mp3', volume: 1 },
		applause:      { key: 'piano/sfx/applause.mp3'      , volume: 1 },
		boing:         { key: 'piano/sfx/boing.mp3'         , volume: 1 },
		bottlepop:     { key: 'piano/sfx/bottlepop.mp3'     , volume: 1 },
		bubble:        { key: 'piano/sfx/bubble.mp3'        , volume: 1 },
		bubbles:       { key: 'piano/sfx/bubbles.mp3'       , volume: 1 },
		bellrattle:    { key: 'piano/sfx/bellrattle.mp3'    , volume: 1 },
		sadtrombone:   { key: 'piano/sfx/sadtrombone.mp3'   , volume: 1 },
		harpglissup:   { key: 'piano/sfx/harpglissup.mp3'   , volume: 1 },
		harpglissdown: { key: 'piano/sfx/harpglissdown.mp3' , volume: 1 },
		cashregister:  { key: 'piano/sfx/cashregister.mp3'  , volume: 1 },
		comiccowbells: { key: 'piano/sfx/comiccowbells.mp3' , volume: 1 },
		dog:           { key: 'piano/sfx/dog.mp3'           , volume: 1 },
		doorslam:      { key: 'piano/sfx/doorslam.mp3'      , volume: 1 },
		footstep:      { key: 'piano/sfx/footstep.mp3'      , volume: 1 },
		helicopter:    { key: 'piano/sfx/helicopter.mp3'    , volume: 1 },
		horsegallop:   { key: 'piano/sfx/horsegallop.mp3'   , volume: 1 },
		plop:          { key: 'piano/sfx/plop.mp3'          , volume: 1 },
		swoop1:        { key: 'piano/sfx/swoop1.mp3'        , volume: 1 },
		swoop2:        { key: 'piano/sfx/swoop2.mp3'        , volume: 1 },
		swoop3:        { key: 'piano/sfx/swoop3.mp3'        , volume: 1 },
		telephone:     { key: 'piano/sfx/telephone.mp3'     , volume: 1 },
		thunder:       { key: 'piano/sfx/thunder.mp3'       , volume: 1 },
		typewriter1:   { key: 'piano/sfx/typewriter1.mp3'   , volume: 1 },
		typewriter2:   { key: 'piano/sfx/typewriter2.mp3'   , volume: 1 },
		windchimes:    { key: 'piano/sfx/windchimes.mp3'    , volume: 1 },
	},
	showroom: {
		tuba:    { key: 'showroom/melodia/tuba.mp3'    , volume: 1 },
		parcour: { key: 'showroom/melodia/parcour.mp3' , volume: 1 },
	},
	stage: {
		albirea_albirea:       { key: 'stage/albirea_albirea.mp3' , volume: 1 },
		albirea_bach:       { key: 'stage/albirea_bach.mp3' , volume: 1 },

		bach_albirea:       { key: 'stage/bach_albirea.mp3' , volume: 1 },
		bach_bach:       { key: 'stage/bach_bach.mp3' , volume: 1 },
		bach_bear:       { key: 'stage/bach_bear.mp3' , volume: 1 },
		bach_ente:       { key: 'stage/bach_ente.mp3' , volume: 1 },
		bach_hauptmann:       { key: 'stage/bach_hauptmann.mp3' , volume: 1 },
		bach_neinhorn:       { key: 'stage/bach_neinhorn.mp3' , volume: 1 },

		hauptmann_hauptmann:       { key: 'stage/hauptmann_hauptmann.mp3' , volume: 1 },
		hauptmann_neinhorn:        { key: 'stage/hauptmann_neinhorn.mp3'  , volume: 1 },

		neinhorn_hauptmann:        { key: 'stage/neinhorn_hauptmann.mp3'  , volume: 1 },
		neinhorn_neinhorn:         { key: 'stage/neinhorn_neinhorn.mp3'   , volume: 1 },

		ronja_neinhorn:            { key: 'stage/ronja_neinhorn.mp3'      , volume: 1 },
	},
	stagedoor: {
		allewiederda:      { key: 'stagedoor/allewiederda.mp3'       , volume: 1 },
		buehneleer:        { key: 'stagedoor/buehneleer.mp3'         , volume: 1 },
		ersteschauspieler: { key: 'stagedoor/ersteschauspieler.mp3'  , volume: 1 },
		kommherein:        { key: 'stagedoor/kommherein.mp3'         , volume: 1 },
		langsamvoll:       { key: 'stagedoor/langsamvoll.mp3'        , volume: 1 },
		spielzimmer:       { key: 'stagedoor/spielzimmer.mp3'        , volume: 1 },
		vielspass:         { key: 'stagedoor/vielspass.mp3'          , volume: 1 },
		willkommen:        { key: 'stagedoor/willkommen.mp3'         , volume: 1 },
	},
	wimmelbild: {
		albirea:   { key: 'wimmelbild/albirea.mp3'     , volume: 1 },
		bach:      { key: 'wimmelbild/bach.mp3'        , volume: 1 },
		//bear:      { key: 'wimmelbild/bear.mp3'        , volume: 1 },
		bear:      { key: 'ambience/silence.mp3'       , volume: 1 },
		entlein:   { key: 'wimmelbild/entlein.mp3'     , volume: 1 },
		hauptmann: { key: 'wimmelbild/hauptmann.mp3'   , volume: 1 },
		neinhorn:  { key: 'wimmelbild/neinhorn.mp3'    , volume: 1 },
		ronja:     { key: 'wimmelbild/ronja.mp3'       , volume: 1 },
		sams:      { key: 'wimmelbild/sams.mp3'        , volume: 1 },
		found:     { key: 'wimmelbild/harpglissup.mp3' , volume: 0.7 },
	},
}

const videos = {
	// backstage: {
	// 	// maske: { key: 'backstage/backstage01.mp4', volume: 0.7 },
	// 	// neinhorn: { key: 'backstage/backstage02.mp4', volume: 0.7 },
	// 	maske: { key: 'backstage/josephine.mp4', volume: 0.7 },
	// 	neinhorn: { key: 'backstage/claire.mp4', volume: 0.7 },
	// },
}

const binaries = {
	looper: {
		impulseresponse: { key: 'looper/impulse_response2.wav' },
	},
}


const game: Up.Game = {

	...Up.hasCache({ cacheName: currentCacheName }),
	...Up.hasState({ key: NAMEOFGAME, initialState: initialState }),

	config: config,

	scenes: scenes,
	initialScenes: initialScenes,

	images: images,
	sprites: sprites,
	soundsPersistant: soundsPersistant,
	sounds: sounds,
	videos: videos,
	binaries: binaries,
}

// function getState (): State {
// 	const state = Up.getState({ game: game })
// 	return state as State
// }
// function game.state.add ( change: StateProperties ): State {
// 	const newState = { ...getState(), ...change }
// 	Up.setState({ game: game, newState: newState })
// 	return newState
// }

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
	// cache,
	// getState,
	// game.state.add,
	INITIALSCENE,
	// Shortcuts
	h, w, s,
}

