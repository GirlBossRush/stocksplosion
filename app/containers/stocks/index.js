import "./stocks.styl"

import React, {Component} from "react"
import Stock from "components/stock"
import createStockViewModel from "view-models/stock"

class Stocks extends Component {
  constructor(props) {
    super(props)

    this.state = {
      query: "",
      stocks: []
    }
  }

  componentDidMount() {
    fetch("http://stocksplosion.apsis.io/api/company")
      .then(response => response.json())
      .then(stocks => this.setState({stocks: stocks.map(createStockViewModel)}))
  }

  render() {
    return <section data-component="stocks">
      <h1>Stocks</h1>

      <div className="stock-list">
        {this.renderStocks()}
      </div>
    </section>
  }

  renderStocks() {
    return this.state.stocks.map((spec, index) => <Stock {...spec} key={index} />)
  }
}

export default Stocks
