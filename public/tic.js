const vm = new Vue({
  el: `#app`,
  data: {
    game: null,
    gameCounter: null,
    me: 1,
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      db.ref(`gameCounter`).on(`value`, snapshot => this.gameCounter = snapshot.val())
      db.ref(`game`).on(`value`, snapshot => {
        this.game = snapshot.val()
        this.checkBoard()
      })
    },
    submitGame () {
      db.ref('game/').set(this.game)
    },
    clickBlock (row, col) {
      if(this.game.board[row][col] === 0 && this.isEnabled) {
        this.game.board[row][col] = this.me
        this.setPrevious(row, col, this.me)
        this.submitGame()
      }
    },
    clearBoard () {
      this.game.board.forEach((row, index, array) => {
        this.game.board[index] = [0, 0, 0]
        this.submitGame()
      })
    },
    checkBoard () {
      let winner = null
      // this.game.board.forEach((row) => {
      //   if(row.every((val) => val === 1)) winner = 1
      //   if(row.every((val) => val === 2)) winner = 2
      // })
    },
    setPrevious (row, col, me) {
      this.game.previous = {
        position: { col, row },
        type: me,
      }
    },
  },
  computed: {
    isEnabled () {
      try {
        return !(this.game.previous.type === this.me)
      }
      catch{
        return false
      }
    }
  }
})
