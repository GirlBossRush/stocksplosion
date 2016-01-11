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

  handleQueryChange({target: {value}}) {
    this.setState({query: value.trim()})
  }

  render() {
    if (this.state.stocks.length === 0) return this.renderPlaceholder()

    const {stocks, query} = this.state
    const pattern = new RegExp(query, "i")
    let {activeStockId} = this.state

    function matchedQuery({name, symbol}) {
      return [name, symbol].some(criteria => criteria.search(pattern) !== -1)
    }

    const visibleStocks = query.length > 0 ? stocks.filter(matchedQuery) : stocks

    activeStockId = visibleStocks.length === 1 ? visibleStocks[0].id : activeStockId

    return <section data-component="stocks">
      <div className="stock-list">
        <input
          className="field stock-search"
          onChange={this.handleQueryChange.bind(this)}
          placeholder="Search by symbol or name."
          type="text"
          value={query} />

        <div className="stocks">
          {visibleStocks.length > 0 ? visibleStocks.map((stock, index) => <Stock
            active={stock.id === activeStockId}
            key={index}
            onClick={this.fetchStockDetails.bind(this, stock.id)}
            stock={stock} />) : <div className="no-results">No results for "{query}"</div>}
        </div>
      </div>

      <div className="stock-detail">
        {activeStockId && <StockDetail stock={stocks.find(stock => stock.id === activeStockId)} />}
      </div>
    </section>
  }

  renderPlaceholder() {
    return <section data-component="stocks">
      Loading
    </section>
  }
}

export default Stocks
