export function learningTableScreen(props) {
    return {
        $template: /*html*/`
			<section v-scope="headerApp({ cancel: true, eyes: true, book: false })"></section>
		`,
    }
}