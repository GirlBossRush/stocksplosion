import "./stock.styl"

import React, {Component} from "react"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

class Stock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hue: this.getSymbolHue()
    }
  }

  // Generates a good range of predictable colors within the gamut.
  getSymbolHue() {
    const {symbol} = this.props
    return Array
      .from(symbol.toUpperCase())
      .reduce((accumulator, character, i) => accumulator + ALPHABET.indexOf(character) * (12 + i), 0) % 360
  }

  render() {
    const {props, state} = this
    const symbolStyle = {
      backgroundColor: `hsl(${state.hue}, 100%, 50%)`,
      textShadow: `1px 1px 0 hsl(${state.hue}, 100%, 30%)`
    }

    return <section data-component="stock">
      <div className="symbol" style={symbolStyle}>
        {props.symbol}
      </div>

      <div className="primary">
        {props.name}
      </div>
    </section>
  }
}

export default Stock
