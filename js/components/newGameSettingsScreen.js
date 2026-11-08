function shuffleArray(array) {
	const arr = [...array]
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

function generateMultiplyChoices(number, multiplier) {
	const correct = number * multiplier
	const candidates = new Set()

	for (let i = 1; i <= 10; i++) {
		if (i !== multiplier) {
			candidates.add(number * i)
		}
		if (i !== number) {
			candidates.add(i * multiplier)
		}
	}

	const offsets = [-3, -2, -1, 1, 2, 3, -number, number]
	offsets.forEach(offset => {
		const val = correct + offset
		if (val > 0 && val !== correct) {
			candidates.add(val)
		}
	})

	while (candidates.size < 10) {
		const randomVal = Math.floor(Math.random() * 100) + 1
		if (randomVal !== correct) {
			candidates.add(randomVal)
		}
	}

	const wrongChoices = shuffleArray([...candidates]).slice(0, 3)
	return shuffleArray([correct, ...wrongChoices])
}

function generateDivideChoices(quotient) {
	const correct = quotient
	const candidates = new Set()

	for (let i = 1; i <= 10; i++) {
		if (i !== correct) {
			candidates.add(i)
		}
	}

	const wrongChoices = shuffleArray([...candidates]).slice(0, 3)
	return shuffleArray([correct, ...wrongChoices])
}

export function newGameSettingsScreen(props) {
    return {
        $template: /*html*/`
			<main class="newGameSettingsScreen">
				<section v-scope="headerApp({ cancel: true, book: false })"></section>

				<section class="container">
					<section class="list">
						<section class="box">
							<h1 class="caption">Čísla na preskúšanie</h1>
							<section class="choices">
								<button 	@click="addNumber(number)" 
											v-for="number in [...Array(10).keys()].map(i => i = i + 1)"
											:class="{'active': numbers.includes(number)}"
								>
									{{ number }}
								</button>
							</section>
						</section>
						<section class="box">
							<h1 class="caption">Režim</h1>
							<section class="choices">
								<button 
									class="choice-text"
									@click="setMode('multiply')"
									:class="{'active': mode === 'multiply'}"
								>
									Násobilka
								</button>
								<button 
									class="choice-text"
									@click="setMode('divide')"
									:class="{'active': mode === 'divide'}"
								>
									Delilka
								</button>
							</section>
						</section>
						<section class="box">
							<h1 class="caption">Časový limit na otázku</h1>
							<section class="choices">
								<button 
									@click="setTimeLimit(null)"
									:class="{'active': timeLimit === null}"
									title="Bez časového limitu"
								>
									&infin;
								</button>
								<button 
									v-for="sec in [3, 5, 10, 15, 20, 25, 30]"
									@click="setTimeLimit(sec)"
									:class="{'active': timeLimit === sec}"
								>
									{{ sec }}s
								</button>
							</section>
						</section>
					</section>
					<button class="start-btn" @click="startGame()" v-if="numbers.length">Začať hru</button>
				</section>
			</main>
        `,
		addNumber(number) {
			if(this.numbers.includes(number)) {
				let nums = this.numbers.filter((_, index) => index !== this.numbers.indexOf(number))
				this.numbers = nums
			}
			else {
				this.numbers.push(number)
			}
		},
		setMode(selectedMode) {
			this.mode = selectedMode
		},
		setTimeLimit(limit) {
			this.timeLimit = limit
		},
		startGame() {
			const examples = []
			const sortedNumbers = [...this.numbers].sort((a, b) => a - b)
			const isDivide = this.mode === 'divide'

			sortedNumbers.forEach(number => {
				for (let i = 1; i <= 10; i++) {
					if (isDivide) {
						const dividend = number * i
						examples.push({
							n1: number,
							n2: i,
							attempts: 0,
							wrongAttempts: 0,
							thinkingTimeMs: 0,
							solved: false,
							status: 'unanswered', // unanswered | correct | wrong
							example: `${dividend} : ${number}`,
							result: i,
							choices: generateDivideChoices(i)
						})
					} else {
						examples.push({
							n1: number,
							n2: i,
							attempts: 0,
							wrongAttempts: 0,
							thinkingTimeMs: 0,
							solved: false,
							status: 'unanswered', // unanswered | correct | wrong
							example: `${number} x ${i}`,
							result: number * i,
							choices: generateMultiplyChoices(number, i)
						})
					}
				}
			})

			const shuffledExamples = shuffleArray(examples)

			this.gameSettings = {
				numbers: shuffledExamples,
				queue: shuffledExamples.map((_, index) => index),
				timeLimit: this.timeLimit,
				mode: this.mode,
				totalThinkingTimeMs: 0
			}
			this.screen = 'gameScreen'
		}
    }
}
