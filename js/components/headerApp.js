export function headerApp(props) {
    return {
        $template: /*html*/`
			<header class="header-app">
				<i class="fa-solid fa-book-open" @click="screen = 'learningTableScreen'" v-if="book"></i>
				<i class="fa-solid fa-xmark" @click="screen = 'homeScreen'" v-if="cancel"></i>
			</header>
		`,
		cancel: props.cancel,
		book: props.book,
    }
}