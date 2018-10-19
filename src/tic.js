const vm = new Vue({
  el: `#app`,
  data: {
    a: null
  },
  mounted () {
    db.ref(`board`).on(`value`, (snapshot) => {
      this.a = JSON.stringify(snapshot.val())
    })
  },
  methods: {

  },
})
