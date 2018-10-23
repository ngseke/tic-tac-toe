const 公開圈圈叉叉 = new Vue({
  el: `#app`,
  data: {
    game: null,
    gameCounter: null,
    me: 1,
    timer: null,
    interval: 15,
    timeToStart: null,
  },
  mounted () {
    this.init()
    this.timer = setInterval(() => {
      this.setTimeToStart()
    }, 1000)
  },
  methods: {
    init () {
      db.ref(`gameCounter`).on(`value`, snapshot => this.gameCounter = snapshot.val())
      db.ref(`game`).on(`value`, snapshot => {
        this.game = snapshot.val()
      })
    },
    // 發送當前局面
    submitGame () {
      db.ref('game/').set(this.game).then(() => {
      })
    },
    submitGameCounter () {
      db.ref('gameCounter/').set(this.gameCounter + 1)
    },
    clickBlock (row, col) {
      if(this.game.board[row][col] === 0 && this.isEnabled && !this.isWaiting) {
        this.game.board[row][col] = this.me
        this.setPrevious(row, col, this.me)
        this.checkGame()
      }
    },
    setResult (winner) {
      this.game.result = {
        date: parseInt(moment().format(`x`)),
        board: Object.assign({}, this.game.board),
        winner
      }
    },
    checkGame () {
      const winner = this.judgeBoard()
      if (this.judgeBoard()) {
        this.setResult(winner)
        this.clearBoard()
        this.submitGameCounter()
      }
      this.submitGame()
    },
    clearBoard () {
      this.game.board.forEach((row, index, array) => {
        this.game.board[index] = [0, 0, 0]
        this.game.previous = null
        this.submitGame()
      })
    },
    judgeBoard () {
      let winner = null
      const board = this.game.board
      const types = [1, 2]

      types.forEach(type => {
        for (let i = 0; i < 3; i++) {
          if (board[i][0] === type && board[i][1] === type && board[i][2] === type) // 檢查橫
            winner = type
          if (board[0][i] === type && board[1][i] === type && board[2][i] === type) // 檢查直
            winner = type
        }
        if([0, 1, 2].every(i => board[i][i] === type)) winner = type      // 檢查斜線
        if([0, 1, 2].every(i => board[i][2 - i] === type)) winner = type  // 檢查反斜線
      })

      return winner
    },
    setPrevious (row, col, me) {
      this.game.previous = {
        position: { row, col },
        type: me,
      }
    },
    isBlockPrevious (row, col) {
      const p = (this.game.previous) ? this.game.previous.position : null
      return (p) ? row === p.row && col === p.col : false
    },
    setTimeToStart () {
      const interval = this.interval
      const lastDate = moment(this.game.result.date).add(interval, 's')
      const now = moment()

      if (now.isBefore(lastDate)) {
        const duration = moment(lastDate - now).format('s')
        this.timeToStart = duration
      } else {
        this.timeToStart = -1
      }
    },
    convertNumberToTypeText (number) {
      if (number === 1) return `O`
      if (number === 2) return `X`
      return number
    }
  },
  computed: {
    isEnabled () {
      try {
        return !(this.game.previous.type === this.me)
      }
      catch {
        return true
      }
    },
    board () {
      if(this.timeToStart === null) return [[0,0,0],[0,0,0],[0,0,0]]
      if (this.timeToStart < 0) {
        return this.game.board
      } else {
        return this.game.result.board
      }
    },
    isWaiting () {
      return this.timeToStart >= 0 && this.timeToStart !== null
    }
  }
})
