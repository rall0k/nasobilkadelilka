function shuffleArray(array) {
	const arr = [...array]
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

export function gameScreen(props) {
    return {
        $template: /*html*/`
			<main class="gameScreen">
				<section v-scope="headerApp({ cancel: true, book: false })"></section>

				<section class="container" v-if="currentExample()">
					<section class="progress-panel">
						<div class="progress-stats">
							<span>Vyriešené: <strong>{{ solvedCount() }} / {{ gameSettings.numbers.length }}</strong></span>
							<span v-if="wrongCount() > 0" class="wrong-badge">Na opravu: {{ wrongCount() }}</span>
						</div>
						<div class="progress-dots">
							<span 
								v-for="(item, idx) in gameSettings.numbers" 
								class="dot"
								:class="{
									'solved': item.solved,
									'wrong': !item.solved && item.status === 'wrong',
									'current': idx === gameSettings.queue[0]
								}"
								:title="item.example"
							></span>
						</div>
					</section>

					<section class="box" :class="{ 'box-wrong': currentExample()?.status === 'wrong' && !currentExample()?.solved }">
						<h1 class="caption">
							{{ currentExample()?.status === 'wrong' ? 'Oprava príkladu' : 'Príklad' }}
						</h1>

						<div class="example">
							{{ currentExample()?.example }} = 
							<span class="answer-slot" :class="feedbackState">
								{{ selectedChoice !== null ? selectedChoice : '?' }}
							</span>
						</div>

						<section class="choices">
							<button 
								v-for="choice in (currentExample()?.choices || [])"
								@click="selectChoice(choice)"
								:disabled="isChecking"
								:class="getChoiceClass(choice)"
							>
								{{ choice }}
							</button>
						</section>
					</section>
				</section>
			</main>
		`,
		selectedChoice: null,
		isChecking: false,
		feedbackState: '',

		currentExample() {
			if (!this.gameSettings || !this.gameSettings.queue || !this.gameSettings.queue.length) {
				return null
			}
			const currentIdx = this.gameSettings.queue[0]
			return this.gameSettings.numbers[currentIdx] || null
		},

		solvedCount() {
			if (!this.gameSettings || !this.gameSettings.numbers) return 0
			return this.gameSettings.numbers.filter(item => item.solved).length
		},

		wrongCount() {
			if (!this.gameSettings || !this.gameSettings.numbers) return 0
			return this.gameSettings.numbers.filter(item => !item.solved && item.status === 'wrong').length
		},

		getChoiceClass(choice) {
			if (this.selectedChoice === null) return ''
			const current = this.currentExample()
			if (!current) return ''

			if (choice === this.selectedChoice) {
				return choice === current.result ? 'correct' : 'wrong'
			}
			return ''
		},

		selectChoice(choice) {
			if (this.isChecking) return
			const currentIdx = this.gameSettings.queue[0]
			const current = this.gameSettings.numbers[currentIdx]
			if (!current) return

			this.selectedChoice = choice
			this.isChecking = true
			current.attempts++

			if (choice === current.result) {
				current.solved = true
				current.status = 'correct'
				this.feedbackState = 'correct'

				setTimeout(() => {
					this.selectedChoice = null
					this.feedbackState = ''
					this.isChecking = false

					if (this.gameSettings.queue.length <= 1) {
						this.screen = 'resultScreen'
						this.gameSettings.queue = []
					} else {
						this.gameSettings.queue.shift()
					}
				}, 450)
			} else {
				current.solved = false
				current.status = 'wrong'
				current.wrongAttempts++
				this.feedbackState = 'wrong'

				setTimeout(() => {
					const failedIdx = this.gameSettings.queue.shift()
					current.choices = shuffleArray(current.choices)

					if (this.gameSettings.queue.length === 0) {
						this.gameSettings.queue.push(failedIdx)
					} else {
						this.gameSettings.queue = shuffleArray(this.gameSettings.queue)
						const randomPos = Math.floor(Math.random() * this.gameSettings.queue.length) + 1
						this.gameSettings.queue.splice(randomPos, 0, failedIdx)
					}

					this.selectedChoice = null
					this.feedbackState = ''
					this.isChecking = false
				}, 650)
			}
		}
    }
}
