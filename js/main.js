import { createApp } from 'https://unpkg.com/petite-vue?module'
import { headerApp } from './components/headerApp.js'
import { homeScreen } from './components/homeScreen.js'
import { learningTableScreen } from './components/learningTableScreen.js'
import { newGameSettingsScreen } from './components/newGameSettingsScreen.js'
import { gameScreen } from './components/gameScreen.js'
import { resultScreen } from './components/resultScreen.js'

createApp({
    screen: "learningTableScreen", // homeScreen | newGameSettingsScreen | gameScreen | resultScreen | learningTableScreen
	headerApp,
	homeScreen,
    learningTableScreen,
    newGameSettingsScreen,
    gameScreen,
    resultScreen
}).mount()