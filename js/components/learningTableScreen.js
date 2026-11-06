export function learningTableScreen(props) {
    return {
        $template: /*html*/`
			<main class="learningTableScreen">
				<section v-scope="headerApp({ cancel: true, book: false })"></section>	

				<section class="container">
					<section class="list">
						<section class="table" v-for="n1 in [...Array(10).keys()].map(i => i + 1)">
							<h1 class="caption">{{ n1 }}</h1>
							<section class="rows">
								<div class="row" v-for="n2 in [...Array(11).keys()]">
									{{ n1 }} x {{ n2 }} = {{ n1 * n2 }}
								</div>
							</section>
						</section>
					</section>
				</section>
			</main>
		`,
    }
}