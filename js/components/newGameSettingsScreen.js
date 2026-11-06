export function newGameSettingsScreen(props) {
    return {
        $template: /*html*/`
            <section v-scope="headerApp({ cancel: true, book: false })"></section>
			<button @click="screen = 'gameScreen'">Zacat</button>
			new game settings screen
        `,
    }
}