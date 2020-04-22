class TicTacToe {
  /**
   * board - 3x3 matrix of empty strings.
   * players - Object representing the players.
   * score - Object representing scores of players.
   * currentPlayer - Current player, initialized to x.
   * moveCount - Current move count
   * @param {string} player1
   * @param {string} player2
   */

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

  /** Create new board, render the score board, game board and replay button. */
  init() {
    this.createNewBoard()
    this.printScoreBoard(this.score)
    this.printGameBoard(this.board)
    this.printReplayButton()
  }

  /** Create and return DOM element with optional class, id and dataset. */
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

  /**
   * Retrieve existing DOM element.
   * @param {string} selector
   * */
  getElement(selector) {
    return document.querySelector(selector)
  }

  /**
   * Retrieve DOM element and append specified value.
   * @param {string} selector
   * @param {string} newVal
   * */

  appendToElement(selector, newVal) {
    const element = this.getElement(selector)
    element.append(newVal)
  }

  /** Create a new board with empty string for cell vals */
  createNewBoard() {
    const board = []
    for (let i = 0; i < 3; i++) {
      board.push(['', '', ''])
    }
    this.board = board
  }

  /**
   * Update the game board with current player's cell with player's token.
   * @param {string} row
   * @param {string} col
   * @param {string} playerToken
   * */

  updateGameBoard(row, col, playerToken) {
    const board = this.board
    board[row][col] = playerToken

    const cellVal = this.createElement('span', `cell-${playerToken}`)
    cellVal.innerText = playerToken

    this.appendToElement(`#c-${row}-${col}`, cellVal)
  }

  /**
   * Create game board and append to DOM
   * @param {Array[]} board - 2d array of rows and cols of game board
   */
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

  /** Get the winner and if the winner exists, increment winning player's score. */
  updateScore() {
    const winner = this.winner && this.winner.token
    if (winner) this.score[winner] = this.score[winner] + 1
  }

  /** Update the winning player's score on the score board */
  updateScoreBoard() {
    const token = this.winner.token,
      score = this.score[token]

    const scoreBoard = this.getElement(`#score-${token}`)
    scoreBoard.innerText = `${score}`
  }

  /**
   * Create score board and append to DOM
   * @param {Number} score
   */
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

  /**
   * Click handler for when a cell is clicked.
   * Check if a move is valid. A move is valid if cell is empty and a winner hasn't been decided.
   * If play isn't valid, return.
   * Otherwise update the game board with current player's token, increment moveCount.
   * Check if each play results in a win and end game if current player wins.
   * Check if game is over each turn and switch player to next player.
   * @param {MouseEvent} e
   */

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

  /** Check if game is over */
  isGameOver() {
    return this.moveCount >= 9
  }

  /**
   * Reset the game by setting current player to player 'x',
   * move count to 0, winner to null.
   * Create a new board and reset cell vals to ''.
   */
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

  /**
   * If there is a winner, update the score and scoreboard.
   * Remove click event listener from cells.
   * Print out game end message and show the replay button.
   */
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

  /**
   * Click handler for replay button.
   * Add click event listeners back to cells,reset the game,
   * clear message and hide replay button
   */
  handleClickReplay() {
    const cells = document.querySelectorAll('.col')
    for (const cell of cells) {
      cell.addEventListener('click', this.handleClickCell)
    }

    this.resetGame()
    this.clearMessage()
    this.toggleReplayButton(false)
  }

  /** Create replay button and append to DOM */
  printReplayButton() {
    const game = this.getElement('#game'),
      button = this.createElement('button', 'btn', 'replay')
    button.innerText = 'Replay'
    button.addEventListener('click', this.handleClickReplay)
    game.append(button)
  }

  /**
   * Toggle replay button display
   * @param {Boolean} display
   */
  toggleReplayButton(display) {
    const replayBtn = this.getElement('#replay')
    replayBtn.style.display = display ? 'block' : 'none'
  }

  /**
   * Check horizontal, vertical and diagonal lines of board to see if current player won.
   * Return true if the player won, otherwise return false.
   * @param {string} row
   * @param {string} col
   */
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

  /** Switch to next player */
  nextPlayer() {
    this.currPlayer =
      this.currPlayer === this.players.x ? this.players.o : this.players.x
  }

  /**
   * Create game end message and append to DOM
   * @param {Object} winner
   */
  printEndMessage(winner) {
    const message = winner ? `${winner.name} won!` : 'Nobody won.',
      game = this.getElement('#game'),
      element = this.createElement('div', 'message')

    element.innerText = message
    game.append(element)
  }

  /** clear out game end message */
  clearMessage() {
    const message = this.getElement('.message')
    message.remove()
  }
}
