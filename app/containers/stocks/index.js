import "./stocks.styl"

import moment from "moment"
import formatApiRequest from "helpers/format-api-request"
import React, {Component} from "react"
import Stock from "components/stock"
import StockDetail from "components/stock-detail"
import createStockViewModel from "view-models/stock"

class Stocks extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeStockId: null,
      query: "",
      stocks: []
    }
  }

  componentDidMount() {
    fetch(formatApiRequest())
      .then(response => response.json())
      .then(stocks => this.setState({
        stocks: stocks.map(createStockViewModel)
      }))
  }

  fetchStockDetails(stockId) {
    const {stocks} = this.state
    const index = stocks.findIndex(stock => stock.id === stockId)
    const stock = stocks[index]
    const url = formatApiRequest(`/${stock.symbol}`, {
      enddate: moment().format("YYYYMMDD"),
      startdate: moment().subtract(5, "year").format("YYYYMMDD")
    })

    fetch(url)
      .then(response => response.json())
      .then(({prices}) => {
        stocks[index].prices = prices
        this.setState({activeStockId: stock.id, stocks})
      })
  }

  render() {
    if (this.state.stocks.length === 0) return this.renderPlaceholder()

    const {activeStockId, stocks} = this.state

    return <section data-component="stocks">
      <div className="stock-list">
        {this.renderStocks()}
      </div>

      <div className="stock-detail">
        {activeStockId && <StockDetail stock={stocks.find(stock => stock.id === activeStockId)}/>}
      </div>
    </section>
  }

  renderPlaceholder() {
    return <section data-component="stocks">
      Loading
    </section>
  }

  renderStocks() {
    const {activeStockId, stocks} = this.state

    return stocks.map((stock, index) => <Stock
      active={stock.id === activeStockId}
      key={index}
      onClick={this.fetchStockDetails.bind(this, stock.id)}
      stock={stock} />)
  }
}

export default Stocks
