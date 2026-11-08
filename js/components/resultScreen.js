export function resultScreen(props) {
    return {
        $template: /*html*/`
			<main class="resultScreen">
				<section v-scope="headerApp({ cancel: true, book: false })"></section>

				<section class="container">
					<section class="summary-box">
						<h1 class="caption">Vyhodnotenie</h1>
						<div class="stats">
							<div class="stat-item">
								<span class="label">Počet príkladov:</span>
								<span class="value">{{ totalExamples() }}</span>
							</div>
							<div class="stat-item">
								<span class="label">Na 1. pokus (bez chyby):</span>
								<span class="value success">{{ firstTryCount() }}</span>
							</div>
							<div class="stat-item">
								<span class="label">Počet nesprávnych pokusov:</span>
								<span class="value" :class="{ 'error': totalWrongAttempts() > 0 }">{{ totalWrongAttempts() }}</span>
							</div>
							<div class="stat-item">
								<span class="label">Celkový počet pokusov:</span>
								<span class="value">{{ totalAttempts() }}</span>
							</div>
							<div class="stat-item">
								<span class="label">Priemerný čas premýšľania:</span>
								<span class="value">{{ averageThinkingTime() }} s</span>
							</div>
							<div class="stat-item">
								<span class="label">Úspešnosť:</span>
								<span class="value">{{ successRate() }} %</span>
							</div>
						</div>
					</section>

					<section class="actions">
						<button @click="screen = 'newGameSettingsScreen'">Nová hra</button>
						<button @click="screen = 'homeScreen'">Domov</button>
					</section>

					<section class="list">
						<section class="table" v-for="n1 in practicedNumbers()">
							<h1 class="caption">{{ n1 }}</h1>
							<section class="rows">
								<div 
									class="row" 
									v-for="item in examplesForNumber(n1)"
									:class="{ 'row-perfect': item.wrongAttempts === 0, 'row-mistake': item.wrongAttempts > 0 }"
								>
									<span class="example-text">{{ item.example }} = {{ item.result }}</span>
									<i class="fa-solid fa-circle-check check-icon" v-if="item.wrongAttempts === 0"></i>
									<span class="attempt-circle" v-else>{{ item.attempts }}x</span>
								</div>
							</section>
						</section>
					</section>
				</section>
			</main>
		`,

		totalExamples() {
			if (!this.gameSettings || !this.gameSettings.numbers) return 0
			return this.gameSettings.numbers.length
		},

		firstTryCount() {
			if (!this.gameSettings || !this.gameSettings.numbers) return 0
			return this.gameSettings.numbers.filter(item => item.solved && item.wrongAttempts === 0).length
		},

		totalAttempts() {
			if (!this.gameSettings || !this.gameSettings.numbers) return 0
			return this.gameSettings.numbers.reduce((sum, item) => sum + item.attempts, 0)
		},

		totalWrongAttempts() {
			if (!this.gameSettings || !this.gameSettings.numbers) return 0
			return this.gameSettings.numbers.reduce((sum, item) => sum + item.wrongAttempts, 0)
		},

		averageThinkingTime() {
			const attempts = this.totalAttempts()
			if (!attempts || !this.gameSettings) return '0.00'
			const totalMs = this.gameSettings.totalThinkingTimeMs || 0
			return (totalMs / attempts / 1000).toFixed(2)
		},

		successRate() {
			const attempts = this.totalAttempts()
			if (!attempts) return 0
			return Math.round((this.totalExamples() / attempts) * 100)
		},

		practicedNumbers() {
			if (!this.gameSettings || !this.gameSettings.numbers) return []
			const unique = [...new Set(this.gameSettings.numbers.map(item => item.n1))]
			return unique.sort((a, b) => a - b)
		},

		examplesForNumber(n1) {
			if (!this.gameSettings || !this.gameSettings.numbers) return []
			return this.gameSettings.numbers
				.filter(item => item.n1 === n1)
				.sort((a, b) => a.n2 - b.n2)
		}
    }
}
