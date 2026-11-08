function shuffleArray(array) {
	const arr = [...array]
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

function generateChoices(number, multiplier) {
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
						<!-- <section class="box">
							<h1 class="caption">Režím</h1>
							<section class="choices"></section>
						</section>
						<section class="box">
							<h1 class="caption">Počet odpovedí</h1>
							<section class="choices"></section>
						</section> -->
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
		startGame() {
			const examples = []
			const sortedNumbers = [...this.numbers].sort((a, b) => a - b)

			sortedNumbers.forEach(number => {
				for (let i = 1; i <= 10; i++) {
					examples.push({
						n1: number,
						n2: i,
						attempts: 0,
						wrongAttempts: 0,
						solved: false,
						status: 'unanswered', // unanswered | correct | wrong
						example: `${number} x ${i}`,
						result: number * i,
						choices: generateChoices(number, i)
					})
				}
			})

			const shuffledExamples = shuffleArray(examples)

			this.gameSettings = {
				numbers: shuffledExamples,
				queue: shuffledExamples.map((_, index) => index)
			}
			this.screen = 'gameScreen'
		}
    }
}
