export function gameScreen(props) {
    return {
        $template: /*html*/`
			<main class="gameScreen">
				<section v-scope="headerApp({ cancel: true, book: false })"></section>
				game screen
			</main>
		`,
    }
}