export function gameScreen(props) {
    return {
        $template: /*html*/`
			<main class="gameScreen">
				<section v-scope="headerApp({ cancel: true, eyes: false, book: false })"></section>
			</main>
		`,
    }
}