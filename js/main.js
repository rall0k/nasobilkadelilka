import { createApp } from 'https://unpkg.com/petite-vue?module'
import { headerApp } from './components/headerApp.js'
import { homeScreen } from './components/homeScreen.js'
import { learningTableScreen } from './components/learningTableScreen.js'
import { newGameSettingsScreen } from './components/newGameSettingsScreen.js'
import { gameScreen } from './components/gameScreen.js'
import { resultScreen } from './components/resultScreen.js'

createApp({
    screen: "homeScreen", // homeScreen | newGameSettingsScreen | gameScreen | resultScreen | learningTableScreen
	gameSettings: {
		numbers: [],
		queue: [],
		timeLimit: null,
		mode: 'multiply'
	},
	numbers: [],
	timeLimit: null, // null (bez limitu) | 3 | 5 | 10
	mode: 'multiply', // 'multiply' (Násobilka) | 'divide' (Delilka)
	headerApp,
	homeScreen,
    learningTableScreen,
    newGameSettingsScreen,
    gameScreen,
    resultScreen
}).mount()

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('./sw.js').catch(err => {
			console.error('Chyba pri registrácii Service Workera:', err)
		})
	})
}
