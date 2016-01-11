import "./stock.styl"

import React, {Component} from "react"

class Stock extends Component {
  render() {
    const {active, stock, onClick} = this.props

    const styles = {
      container: {
        backgroundColor: active ? `hsl(${stock.hue}, 100%, 96%)` : ""
      },
      symbol: {
        backgroundColor: `hsl(${stock.hue}, 100%, 47%)`,
        textShadow: `1px 1px 0 hsl(${stock.hue}, 100%, 30%)`
      }
    }

    return <section data-component="stock" onClick={onClick} style={styles.container}>
      <div className="symbol" style={styles.symbol}>
        {stock.symbol}
      </div>

      <div className="primary">
        {stock.name}
      </div>
    </section>
  }
}

export default Stock
