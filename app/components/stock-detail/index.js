import "./stock-detail.styl"

import {max, min} from "lodash"
import React from "react"

export default function StockDetail({stock: {hue, prices}}) {
  const lowestValue = min(prices, price => price.value).value
  const highestValue = max(prices, price => price.value).value
  const baseSaturation = 47
  let previousValue

  const priceComponents = prices.map(({date, value}, index) => {
    const delta = previousValue ? value - previousValue : 0
    const label = {
      [lowestValue]: "LOWEST",
      [highestValue]: "HIGHEST"
    }[value]

    const barStyle = {
      backgroundColor: `hsl(${hue}, 100%, ${value / highestValue * baseSaturation}%)`,
      color: `hsl(${hue}, 100%, 90%)`,
      flex: `0 1 ${value / highestValue * 75}%`
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

  return <section data-component="stock-detail">
    <div className="prices">
      <div className="inner">
        {priceComponents}
      </div>
    </div>
  </section>
}
