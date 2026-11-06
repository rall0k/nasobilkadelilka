export function homeScreen() {
	return {
		$template: /*html*/`
			<main class="homeScreen">
				<section class="card">
					<i class="fa-solid fa-book-open"></i>
					<button @click="screen = 'learningTableScreen'">Učiť sa</button>
				</section>
				<section class="card">
					<i class="fa-solid fa-gamepad"></i>
					<button @click="screen = 'newGameSettingsScreen'">Nová hra</button>
				</section>
			</main>
		`,
	}
}