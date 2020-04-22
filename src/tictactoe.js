class TicTacToe {
  constructor(player1, player2) {
    this.board = null
    this.players = {
      x: { name: player1.toLowerCase(), token: 'x' },
      o: { name: player2.toLowerCase(), token: 'o' },
    }
    this.score = { x: 0, o: 0 }
    this.currPlayer = this.players.x
    this.moveCount = 0
    this.winner = null
    // Bind click handlers so context of this is instance of game.
    this.handleClickCell = this.handleClickCell.bind(this)
    this.handleClickReplay = this.handleClickReplay.bind(this)
  }
  init() {
    this.createNewBoard()
    this.printScoreBoard(this.score)
    this.printGameBoard(this.board)
    this.printReplayButton()
  }

  createElement(tag, className, id, data) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)
    if (id) element.id = id
    if (data) {
      for (const [key, val] of Object.entries(data)) {
        element.dataset[key] = val
      }
    }
    return element
  }

  getElement(selector) {
    return document.querySelector(selector)
  }

  appendToElement(selector, newVal) {
    const element = this.getElement(selector)
    element.append(newVal)
  }

  createNewBoard() {
    const board = []
    for (let i = 0; i < 3; i++) {
      board.push(['', '', ''])
    }
    this.board = board
  }

  updateGameBoard(row, col, playerToken) {
    const board = this.board
    board[row][col] = playerToken

    const cellVal = this.createElement('span', `cell-${playerToken}`)
    cellVal.innerText = playerToken

    this.appendToElement(`#c-${row}-${col}`, cellVal)
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
        const boardCol = this.createElement('div', 'col', `c-${i}-${j}`, {
          row: i,
          col: j,
        })
        boardRow.append(boardCol)
        boardCol.addEventListener('click', this.handleClickCell)
      }
    }
  }

  updateScore() {
    const winner = this.winner && this.winner.token
    if (winner) this.score[winner] = this.score[winner] + 1
  }

  updateScoreBoard() {
    const token = this.winner.token,
      score = this.score[token]

    const scoreBoard = this.getElement(`#score-${token}`)
    scoreBoard.innerText = `${score}`
  }

  printScoreBoard(score) {
    const game = this.getElement('#game'),
      scoreBoard = this.createElement('div', 'score-board')
    game.append(scoreBoard)

    const p1 = this.createElement('div', 'score'),
      p2 = this.createElement('div', 'score'),
      p1Label = this.createElement('span', 'score-label'),
      p2Label = this.createElement('span', 'score-label'),
      p1Score = this.createElement('span', null, 'score-x'),
      p2Score = this.createElement('span', null, 'score-o')

    p1Label.innerText = `${this.players.x.name}: `
    p2Label.innerText = `${this.players.o.name}: `
    p1Score.innerText = `${score.x}`
    p2Score.innerText = `${score.o}`

    p1.append(p1Label)
    p1.append(p1Score)
    p2.append(p2Label)
    p2.append(p2Score)
    scoreBoard.append(p1)
    scoreBoard.append(p2)
  }

  handleClickCell(e) {
    const { row, col } = e.target.dataset,
      validPlay = !this.board[row][col] && !this.winner

    if (!validPlay) return

    this.updateGameBoard(row, col, this.currPlayer.token)
    this.moveCount++
    if (this.didPlayerWin(row, col)) {
      this.winner = this.currPlayer
      this.handleGameOver()
      return
    }
    if (this.isGameOver()) this.handleGameOver()
    this.nextPlayer()
  }

  isGameOver() {
    return this.moveCount >= 9
  }

  resetGame() {
    this.currPlayer = this.players.x
    this.moveCount = 0
    this.winner = null
    this.createNewBoard()

    const cells = document.querySelectorAll('.col')
    for (const cell of cells) {
      cell.innerText = ''
    }
  }

  handleGameOver() {
    if (this.winner) {
      this.updateScore()
      this.updateScoreBoard()
    }

    const cells = document.querySelectorAll('.col')
    for (const cell of cells) {
      cell.removeEventListener('click', this.handleClickCell)
    }

    this.printEndMessage(this.winner)
    this.toggleReplayButton(true)
  }

  handleClickReplay() {
    const cells = document.querySelectorAll('.col')
    for (const cell of cells) {
      cell.addEventListener('click', this.handleClickCell)
    }

    this.resetGame()
    this.clearMessage()
    this.toggleReplayButton(false)
  }

  printReplayButton() {
    const game = this.getElement('#game'),
      button = this.createElement('button', 'btn', 'replay')
    button.innerText = 'Replay'
    button.addEventListener('click', this.handleClickReplay)
    game.append(button)
  }

  toggleReplayButton(display) {
    const replayBtn = this.getElement('#replay')
    replayBtn.style.display = display ? 'block' : 'none'
  }

  didPlayerWin(row, col) {
    const b = this.board,
      currP = this.currPlayer.token

    if (
      // Horizontal
      (b[row][0] === currP && b[row][1] === currP && b[row][2] === currP) ||
      // Vertical
      (b[0][col] === currP && b[1][col] === currP && b[2][col] === currP) ||
      // Diagonal
      (b[0][0] === currP && b[1][1] === currP && b[2][2] === currP) ||
      (b[2][0] === currP && b[1][1] === currP && b[0][2] === currP)
    )
      return true
    return false
  }

  nextPlayer() {
    this.currPlayer =
      this.currPlayer === this.players.x ? this.players.o : this.players.x
  }

  printEndMessage(winner) {
    const message = winner ? `${winner.name} won!` : 'Nobody won.',
      game = this.getElement('#game'),
      element = this.createElement('div', 'message')

    element.innerText = message
    game.append(element)
  }

  clearMessage() {
    const message = this.getElement('.message')
    message.remove()
  }
}
