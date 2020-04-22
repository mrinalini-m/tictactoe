class TicTacToe {
  constructor(player1 = 'Player 1', player2 = 'Player 2') {
    this.players = {
      x: { name: player1, display: 'x' },
      o: { name: player2, display: 'o' },
    }
    this.score = { x: 0, o: 0 }
    this.board = null
    this.currPlayer = this.players.x
    this.moveCount = 0
    this.winner = null
  }

  init() {
    // create new board, print out the score board and game board on init
    this.createNewBoard()
    this.printScoreBoard(this.score)
    this.printGameBoard(this.board)
  }

  createElement(tag, className, id) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)
    if (id) element.id = id
    return element
  }

  getElement(selector) {
    return document.querySelector(selector)
  }

  updateElement(selector, newVal) {
    const element = this.getElement(selector)
    element.append(newVal)
  }

  nextPlayer() {
    this.currPlayer =
      this.currPlayer === this.players.x ? this.players.o : this.players.x
  }

  isGameOver() {
    return this.moveCount >= 9
  }

  handleGameOver() {
    // Update score board and score only if there is a winner
    if (this.winner) {
      this.updateScore()
      this.updateScoreBoard()
    }
    // print winner
    this.printEndMessage(this.winner)
  }

  getWinner(row, col) {
    const b = this.board,
      currP = this.currPlayer.display

    if (
      // Horizontal
      (b[row][0] === currP && b[row][1] === currP && b[row][2] === currP) ||
      // Vertical
      (b[0][col] === currP && b[1][col] === currP && b[2][col] === currP) ||
      // Diagonal
      (b[0][0] === currP && b[1][1] === currP && b[2][2] === currP) ||
      (b[2][0] === currP && b[1][1] === currP && b[0][2] === currP)
    )
      return this.currPlayer
    return false
  }

  updateScore() {
    const winner = this.winner && this.winner.display
    if (winner) this.score[winner] = this.score[winner] + 1
  }

  handleClickCell(e) {
    const cell = e.target.id.split('-')
    cell.shift()
    const [row, col] = cell

    const validPlay = !this.board[row][col] && !this.winner
    if (!validPlay) return

    this.updateGameBoard(row, col, this.currPlayer)
    this.moveCount++
    const winner = this.getWinner(row, col)
    if (winner) {
      this.winner = this.currPlayer

      this.handleGameOver()
      return
    }
    if (this.isGameOver()) this.handleGameOver()

    this.nextPlayer()
  }

  createNewBoard() {
    const board = []
    for (let i = 0; i < 3; i++) {
      board.push(['', '', ''])
    }
    this.board = board
  }

  updateGameBoard(row, col, currPlayer) {
    const board = this.board
    board[row][col] = currPlayer.display

    const cellVal = this.createElement('span', `cell-${currPlayer.display}`)
    cellVal.innerText = currPlayer.display
    this.updateElement(`#c-${row}-${col}`, cellVal)
  }

  updateScoreBoard() {
    const display = this.winner.display,
      score = this.score[display]

    const scoreBoard = this.getElement(`#score-${display}`)
    scoreBoard.innerText = `${this.winner.name}: ${score}`
  }

  printEndMessage(winner) {
    const message = winner ? `${winner.name} won!` : 'Nobody won.',
      game = this.getElement('#game'),
      element = this.createElement('div', 'message')

    element.innerText = message
    game.append(element)
  }

  printScoreBoard(score) {
    const game = this.getElement('#game'),
      scoreBoard = this.createElement('div', 'score')
    game.append(scoreBoard)

    const p1Score = this.createElement('div', null, 'score-x'),
      p2Score = this.createElement('div', null, 'score-o')

    p1Score.innerText = `${this.players.x.name}: ${score.x}`
    p2Score.innerText = `${this.players.o.name}: ${score.o}`

    scoreBoard.append(p1Score)
    scoreBoard.append(p2Score)
  }

  printGameBoard(board) {
    const game = this.getElement('#game'),
      gameBoard = this.createElement('div', 'board')

    game.append(gameBoard)

    for (let i = 0; i < board.length; i++) {
      const row = board[i],
        boardRow = this.createElement('div', 'row', i)
      gameBoard.append(boardRow)

      for (let j = 0; j < row.length; j++) {
        const boardCol = this.createElement('div', 'col', `c-${i}-${j}`)
        boardRow.append(boardCol)
        boardCol.addEventListener('click', this.handleClickCell.bind(this))
      }
    }
  }
}

const game = new TicTacToe('a', 'b')
game.init()
