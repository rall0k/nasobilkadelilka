export function newGameSettingsScreen(props) {
    return {
        $template: /*html*/`
			<main class="newGameSettingsScreen">
				<section v-scope="headerApp({ cancel: true, book: false })"></section>

				<section class="container">
					<section class="list">
						<section class="box">
							<h1 class="caption">Čísla na preskúšanie</h1>
							<section class="choices"></section>
						</section>
						<section class="box">
							<h1 class="caption">Režím</h1>
							<section class="choices"></section>
						</section>
						<section class="box">
							<h1 class="caption">Počet odpovedí</h1>
							<section class="choices"></section>
						</section>
					</section>
					<button @click="screen = 'gameScreen'">Začať hru</button>
				</section>
			</main>
        `,
    }
}