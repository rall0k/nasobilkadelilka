export function learningTableScreen(props) {
    return {
        $template: /*html*/`
			<section v-scope="headerApp({ cancel: true, book: false })"></section>
			learning table screen
		`,
    }
}