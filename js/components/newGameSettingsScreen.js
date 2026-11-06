export function newGameSettingsScreen(props) {
    return {
        $template: /*html*/`
            <section v-scope="headerApp({ cancel: true, eyes: false, book: false })"></section>
			<button @click="screen = 'gameScreen'">Zacat</button>
        `,
    }
}