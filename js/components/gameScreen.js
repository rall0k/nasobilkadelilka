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
			<main class="gameScreen" @vue:mounted="initTimer()" @vue:unmounted="clearTimer()">
				<section v-scope="headerApp({ cancel: true, book: false })"></section>

				<section class="container" v-if="currentExample()">
					<section class="progress-panel">
						<div class="progress-stats">
							<span>Vyriešené: <strong>{{ solvedCount() }} / {{ gameSettings.numbers.length }}</strong></span>
							<span v-if="wrongCount() > 0" class="wrong-badge">Na opravu: {{ wrongCount() }}</span>
							<span v-if="gameSettings.timeLimit" class="timer-badge" :class="{ 'timer-low': remainingTime <= 1 }">
								Čas: <strong>{{ remainingTime }}s</strong>
							</span>
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

						<div class="timer-bar-wrapper" v-if="gameSettings.timeLimit">
							<div 
								class="timer-bar" 
								:class="{ 'timer-low': remainingTime <= 1 }"
								:style="{ width: ((remainingTime / gameSettings.timeLimit) * 100) + '%' }"
							></div>
						</div>

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
		remainingTime: 0,
		timerInterval: null,

		initTimer() {
			this.startQuestionTimer()
		},

		clearTimer() {
			if (this.timerInterval) {
				clearInterval(this.timerInterval)
				this.timerInterval = null
			}
		},

		startQuestionTimer() {
			this.clearTimer()
			if (!this.gameSettings || !this.gameSettings.timeLimit) return

			this.remainingTime = this.gameSettings.timeLimit
			this.timerInterval = setInterval(() => {
				if (this.screen !== 'gameScreen') {
					this.clearTimer()
					return
				}
				if (this.isChecking) return

				this.remainingTime--
				if (this.remainingTime <= 0) {
					this.clearTimer()
					this.handleTimeout()
				}
			}, 1000)
		},

		handleTimeout() {
			if (this.isChecking || !this.gameSettings.queue.length) return
			const currentIdx = this.gameSettings.queue[0]
			const current = this.gameSettings.numbers[currentIdx]
			if (!current) return

			this.isChecking = true
			current.attempts++
			current.solved = false
			current.status = 'wrong'
			current.wrongAttempts++
			this.feedbackState = 'wrong'

			setTimeout(() => {
				if (this.screen !== 'gameScreen') return
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
				this.startQuestionTimer()
			}, 650)
		},

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

			this.clearTimer()
			this.selectedChoice = choice
			this.isChecking = true
			current.attempts++

			if (choice === current.result) {
				current.solved = true
				current.status = 'correct'
				this.feedbackState = 'correct'

				setTimeout(() => {
					if (this.screen !== 'gameScreen') return
					this.selectedChoice = null
					this.feedbackState = ''
					this.isChecking = false

					if (this.gameSettings.queue.length <= 1) {
						this.clearTimer()
						this.screen = 'resultScreen'
						this.gameSettings.queue = []
					} else {
						this.gameSettings.queue.shift()
						this.startQuestionTimer()
					}
				}, 450)
			} else {
				current.solved = false
				current.status = 'wrong'
				current.wrongAttempts++
				this.feedbackState = 'wrong'

				setTimeout(() => {
					if (this.screen !== 'gameScreen') return
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
					this.startQuestionTimer()
				}, 650)
			}
		}
    }
}
