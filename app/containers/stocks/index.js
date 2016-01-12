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
      range: {
        end: moment(),
        start: moment().subtract(5, "year")
      },
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

  fetchStockDetails({stockId, range}) {
    range = range || this.state.range
    stockId = stockId || this.state.activeStockId

    const {stocks} = this.state
    const index = stocks.findIndex(stock => stock.id === stockId)
    const stock = stocks[index]
    const url = formatApiRequest(`/${stock.symbol}`, {
      enddate: range.end.format("YYYYMMDD"),
      startdate: range.start.format("YYYYMMDD")
    })

    fetch(url)
      .then(response => response.json())
      .then(({prices}) => {
        stocks[index].prices = parsePrices(prices)
        this.setState({activeStockId: stock.id, stocks})
      })
  }

  handleDateChange(property, {target: {value}}) {
    const {range} = this.state

    range[property] = moment(value)
    this.setState({range})
    this.fetchStockDetails({})
  }

  handleQueryChange({target: {value}}) {
    const query = value.trim()
    const visibleStocks = this.getVisibleStocks(query)
    let {activeStockId} = this.state

    // Reset the cursor to the first selection.
    if (query.length === 0 || visibleStocks.length === 1) activeStockId = visibleStocks[0].id

    this.setState({activeStockId, query})
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

  render() {
    if (this.state.stocks.length === 0) return this.renderPlaceholder()

    const {activeStockId, range, stocks, query} = this.state
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
            onClick={this.fetchStockDetails.bind(this, {stockId: stock.id})}
            stock={stock} />) : <div className="no-results">No results for "{query}"</div>}
        </div>
      </div>

      <div className="stock-detail">
        <div className="date-ranges">
          <input
            className="field"
            onChange={this.handleDateChange.bind(this, "start")}
            type="date"
            value={range.start.format("YYYY-MM-DD")} />

          <input
            className="field"
            onChange={this.handleDateChange.bind(this, "end")}
            type="date"
            value={range.end.format("YYYY-MM-DD")} />
        </div>

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
