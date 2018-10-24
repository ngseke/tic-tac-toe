const 公開圈圈叉叉 = new Vue({
  el: `#app`,
  data: {
    page: 0,
    game: null,
    gameCounter: null,
    me: 1,
    timer: null,
    timeToStart: null,
    chat: null,
    chatInputText: ``,
  },
  mounted () {
    this.init()
  },
  methods: {
    setTimer () {
      if(!this.timer)
        this.timer = setInterval(this.setTimeToStart(), 1000)
    },
    clearTimer () {
      clearInterval(this.timer)
      this.timer = null
    },
    init () {
      db.ref(`gameCounter`).on(`value`, snapshot => this.gameCounter = snapshot.val())
      db.ref(`game`).on(`value`, snapshot => {
        this.game = snapshot.val()
        this.setTimer()
      })
      db.ref(`chat`).orderByKey().limitToLast(chatMaxNumber).on(`value`, snapshot => {
        this.chat = snapshot.val()
      })
    },
    submitChat () {
      if(this.chatInputText !== ``)
      db.ref(`chat`).push({
        name: this.convertNumberToTypeText(this.me),
        content: this.chatInputText,
        date: moment().format(`x`),
      })
      this.chatInputText = ``
    },
    submitChatInfo () {
      const winner = this.convertNumberToTypeText(this.game.result.winner)
      let content = `優秀的 ${winner} 贏了，他實在好棒棒`
      if (winner === 3) content = `然而並沒有所謂的贏家
      `
      db.ref(`chat`).push({
        name: `info`,
        content,
        date: moment().format(`x`),
      })
    },
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
    setResult (result) {
      this.game.result = {
        date: parseInt(moment().format(`x`)),
        board: Object.assign({}, this.game.board),
        direction: result.direction,
        winner: result.winner,
      }
    },
    checkGame () {
      const result = this.judgeBoard()
      if (this.judgeBoard()) {
        this.setResult(result)
        this.clearBoard()
        this.submitGameCounter()
        this.setTimer()
        this.submitChatInfo()
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
      let result = null
      const board = this.game.board
      const types = [1, 2]

      types.forEach(type => {
        for (let i = 0; i < 3; i++) {
          if (board[i][0] === type && board[i][1] === type && board[i][2] === type) { // 檢查橫
            result = { winner: type, direction: [`h`, i] }
          }
          if (board[0][i] === type && board[1][i] === type && board[2][i] === type) { // 檢查直
            result = { winner: type, direction: [`v`, i] }
          }
        }
        if([0, 1, 2].every(i => board[i][i] === type)) {  // 檢查斜線
          result = { winner: type, direction: [`s`, 0] }
        }
        if([0, 1, 2].every(i => board[i][2 - i] === type)) {  // 檢查反斜線
          result = { winner: type, direction: [`bs`, 0] }
        }
      })

      if (board.every(row => row.every(block => block !== 0)) && result === null)
        result = { winner: 3, direction: [`hidden`, 0] }

      return result
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
      const lastDate = moment(this.game.result.date).add(interval, 's')
      const now = moment()

      if (now.isBefore(lastDate)) {
        const duration = moment(lastDate - now).format('s')
        this.timeToStart = duration
      } else {
        this.timeToStart = -1
        this.clearTimer()
      }
      return this.setTimeToStart
    },
    convertNumberToTypeText (number) {
      if (number === 1) return `O`
      if (number === 2) return `X`
      return number
    },
    convertDate (x) {
      return moment(x, 'x').fromNow()
    },
    togglePage (n = null) {
      const max = 2
      this.page = n ? n : (this.page + max + 1) % max
    },
    getLineClass (row, col) {
      const classObject = {}
      if (!this.isWaiting || !this.game) {
        classObject.hidden = true
      } else {
        const direction = this.game.result.direction[0]
        const number = this.game.result.direction[1]
        if (this.isWaiting && this.game)
          classObject[direction] = true
        if ([`s`, `bs`].some(val => direction === val))
          classObject.hidden = !(row === 1 && col === 1)
        if (direction === `h`)
          classObject.hidden = !(row === number && col === 1)
        if (direction === `v`)
          classObject.hidden = !(col === number && row === 1)
      }

      return classObject
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
    },
    round () {
      if(this.isWaiting) return this.gameCounter - 1
      return this.gameCounter
    },

  },
  watch: {
    chat () {
      this.$nextTick(() => {
        this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
     })
    }
  }
})
