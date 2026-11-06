export function resultScreen(props) {
    return {
        $template: /*html*/`
			<section v-scope="headerApp({ cancel: true, eyes: false, book: false })"></section>
		`,
    }
}