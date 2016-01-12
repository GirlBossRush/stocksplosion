import "./stocks.styl"

import moment from "moment"
import formatApiRequest from "helpers/format-api-request"
import React, {Component} from "react"
import Stock from "components/stock"
import StockDetail from "components/stock-detail"
import createStockViewModel, {parsePrices} from "view-models/stock"

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

  getVisibleStocks(query) {
    query = query || this.state.query

    const {stocks} = this.state
    const pattern = new RegExp(query, "i")

    function matchedQuery({name, symbol}) {
      return [name, symbol].some(criteria => criteria.search(pattern) !== -1)
    }

    return query.length > 0 ? stocks.filter(matchedQuery) : stocks
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
        stocks[index].prices = parsePrices(prices)
        this.setState({activeStockId: stock.id, stocks})
      })
  }

  handleQueryKey(event) {
    let delta = {
      38: -1, // Up arrow
      40: 1  // Down arrow
    }[event.keyCode]

    if (!delta) return

    event.preventDefault()

    const {activeStockId} = this.state
    const stocks = this.getVisibleStocks()
    const {length} = stocks
    const currentIndex = stocks.findIndex(({id}) => id === activeStockId)

    // Implements torus cursor, wrapping around the stocks from both sides.
    delta = currentIndex + delta
    delta %= length
    delta += length
    delta %= length

    this.setState({activeStockId: stocks[delta].id})
  }

  handleQueryChange({target: {value}}) {
    const query = value.trim()
    const visibleStocks = this.getVisibleStocks(query)
    let {activeStockId} = this.state

    // Reset the cursor to the first selection.
    if (query.length === 0 || visibleStocks.length === 1) activeStockId = visibleStocks[0].id

    this.setState({activeStockId, query})
  }

  render() {
    if (this.state.stocks.length === 0) return this.renderPlaceholder()

    const {activeStockId, stocks, query} = this.state
    const visibleStocks = this.getVisibleStocks()

    return <section data-component="stocks">
      <div className="stock-list">
        <input
          autoFocus
          className="field stock-search"
          onChange={this.handleQueryChange.bind(this)}
          onKeyDown={this.handleQueryKey.bind(this)}
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
