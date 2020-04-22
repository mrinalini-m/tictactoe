class TicTacToe {
  constructor(player1 = null, player2 = null) {
    this.players = {
      x: { name: player1, display: 'x', score: 0 },
      o: { name: player2, display: 'o', score: 0 },
    }
    this.board = null
    this.currPlayer = this.players.x
    this.moveCount = 0
  }

  init() {
    this.createNewBoard()
    this.printGameBoard(this.board)
  }

  nextPlayer() {
    this.currPlayer =
      this.currPlayer === this.players.x ? this.players.o : this.players.x
  }

  isGameOver() {
    return this.moveCount >= 9
  }

  createNewBoard() {
    const board = []
    for (let i = 0; i < 3; i++) {
      board.push(['', '', ''])
    }
    this.board = board
  }

  updateBoard(row, col, currPlayer) {
    const board = this.board
    board[row][col] = currPlayer.display

    const cellVal = this.createElement('span', `cell-${currPlayer.display}`)
    cellVal.innerText = currPlayer.display

    this.updateElement(`#c-${row}-${col}`, cellVal)
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

  handleClickCell(e) {
    const cell = e.target.id.split('-')
    cell.shift()
    const [row, col] = cell
    const validPlay = !this.board[row][col]
    if (validPlay) {
      this.updateBoard(row, col, this.currPlayer)
      this.nextPlayer()
      this.moveCount++

      if (this.isGameOver()) console.log('game over')
    }
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
