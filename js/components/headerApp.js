export function headerApp(props) {
    return {
        $template: /*html*/`
			<header class="header-app">
				<i class="fa-solid fa-book-open" @click="screen = 'learningTableScreen'" v-if="book"></i>
				<i class="fa-solid fa-eye" @click="console.log('toggle visible result')" v-if="eyes"></i>
				<i class="fa-solid fa-eye-slash" @click="console.log('toggle visible result')" v-if="eyes"></i>
				<i class="fa-solid fa-xmark" @click="screen = 'homeScreen'" v-if="cancel"></i>
			</header>
		`,
		cancel: props.cancel,
		eyes: props.eyes,
		book: props.book,
    }
}