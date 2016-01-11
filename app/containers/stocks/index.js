import "./stocks.styl"

import React, {Component} from "react"

class Stocks extends Component {
  constructor(props) {
    super(props)

    this.state = {
      query: "",
      stocks: []
    }
  }

  render() {
    return <section data-component="stocks">
      <h1>Stocks</h1>
    </section>
  }
}

export default Stocks
