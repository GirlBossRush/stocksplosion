import "./stock-detail.styl"

import {max, min} from "lodash"
import React, {Component} from "react"

class StockDetail extends Component {
  render() {
    const {stock} = this.props
    const symbolStyle = {
      backgroundColor: `hsl(${stock.hue}, 100%, 47%)`,
      textShadow: `1px 1px 0 hsl(${stock.hue}, 100%, 30%)`
    }

    return <section data-component="stock-detail">
      <div className="prices">
        {this.renderPrices()}
      </div>
    </section>
  }

  renderPrices() {
    const {hue, prices} = this.props.stock
    const lowestValue = min(prices, price => price.value).value
    const highestValue = max(prices, price => price.value).value
    const baseSaturation = 47
    let previousValue

    return prices.map(({date, value}, index) => {
      const delta = previousValue ? value - previousValue : 0
      const label = {
        [lowestValue]: "LOWEST",
        [highestValue]: "HIGHEST"
      }[value]

      const barStyle = {
        backgroundColor: `hsl(${hue}, 100%, ${value / highestValue * baseSaturation}%)`,
        color: `hsl(${hue}, 100%, 90%)`,
        width: `${value / highestValue * 100}%`
      }

      // FIXME: Side effects in a map aren't ideal.
      previousValue = value

      return <div className="price" key={index}>
        <div className="bar" style={barStyle}>
          <div>{date.format("YYYY-MM-DD")}</div>
          <div>{value}</div>
        </div>

        <div className="delta" data-delta={delta > 0 ? "positive" : "negative"}>
          {delta.toFixed(2)}
        </div>

        {label && <div className="label">{label}</div>}
    </div>
    })
  }
}

export default StockDetail
