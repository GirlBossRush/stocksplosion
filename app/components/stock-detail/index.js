import "./stock-detail.styl"

import React, {Component} from "react"

class StockDetail extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {props} = this

    const symbolStyle = {
      backgroundColor: `hsl(${props.stock.hue}, 100%, 47%)`,
      textShadow: `1px 1px 0 hsl(${props.stock.hue}, 100%, 30%)`
    }

    return <section data-component="stock-detail">
      <div className="symbol" style={symbolStyle}>
        {props.stock.symbol}
      </div>

      <div className="primary">
        {props.stock.name}
      </div>
    </section>
  }
}

export default StockDetail
