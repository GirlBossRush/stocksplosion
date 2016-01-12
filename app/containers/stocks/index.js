import "./stocks.styl"

import moment from "moment"
import formatApiRequest from "helpers/format-api-request"
import React, {Component} from "react"
import Action from "components/action"
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
      .then(stockData => {
        const stocks = stockData.map(createStockViewModel)

        this.setState({stocks})
        this.setStockDetails({stockId: stocks[0].id})
      })
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

  handleDateChange(property, {target: {value}}) {
    if (!value.length === 0) return

    const {range} = this.state

    range[property] = moment(value)
    this.setState({range})
    this.setStockDetails({range})
  }

  handleQueryChange({target: {value}}) {
    const query = value.trim()
    const visibleStocks = this.getVisibleStocks(query)

    this.setState({query})

    if (visibleStocks.length === 1) this.setStockDetails({stockId: visibleStocks[0].id})
  }

  handleQueryKey(event) {
    let delta = {
      38: -1, // Up arrow
      40: 1  // Down arrow
    }[event.keyCode]

    if (!delta) return

    event.preventDefault()

    let {activeStockId} = this.state
    const stocks = this.getVisibleStocks()
    const {length} = stocks
    const currentIndex = stocks.findIndex(({id}) => id === activeStockId) || 0

    // Implements torus cursor, wrapping around the list from top and bottom.
    delta = currentIndex + delta
    delta %= length // Limit to domain to entries for positive deltas
    delta += length // Reverse negative deltas
    delta %= length // Limit deltas greater than domain

    activeStockId = stocks[delta].id

    this.setState({activeStockId})
    this.setStockDetails({stockId: activeStockId})
  }

  render() {
    const {activeStockId, range, stocks, query} = this.state
    const activeStock = stocks.find(({id}) => id === activeStockId)
    const visibleStocks = this.getVisibleStocks()

    if (stocks.length === 0 || !activeStock) return <div data-placeholder />

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
            onClick={this.setStockDetails.bind(this, {stockId: stock.id})}
            stock={stock} />) : <div className="no-results">No results for "{query}"</div>}
        </div>
      </div>

      <div className="stock-detail">
        <div className="stock-actions">
          <input
            className="field"
            onChange={this.handleDateChange.bind(this, "start")}
            placeholder="start"
            type="date"
            value={range.start.format("YYYY-MM-DD")} />

          <input
            className="field"
            onChange={this.handleDateChange.bind(this, "end")}
            placeholder="end"
            type="date"
            value={range.end.format("YYYY-MM-DD")} />

          <div className="actions">
            <Action onClick={this.setStockStatus.bind(this)} stock={activeStock} type="buy" />
            <Action onClick={this.setStockStatus.bind(this)} stock={activeStock} type="sell" />
            <Action onClick={this.setStockStatus.bind(this)} stock={activeStock} type="hold" />
          </div>
        </div>

        <StockDetail stock={activeStock} />
      </div>
    </section>
  }

  setStockDetails({stockId, range}) {
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

  setStockStatus({stockId, status}) {
    const {stocks} = this.state
    const index = stocks.findIndex(({id}) => id === stockId)

    Object.assign(stocks[index], {status})
    this.setState({stocks})
  }
}

export default Stocks
