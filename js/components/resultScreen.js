export function resultScreen(props) {
    return {
        $template: /*html*/`
			<section v-scope="headerApp({ cancel: true, book: false })"></section>
			result screen
		`,
    }
}