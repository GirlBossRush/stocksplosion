import "./stock.styl"

import React, {Component} from "react"

class Stock extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {props} = this

    const symbolStyle = {
      backgroundColor: `hsl(${props.hue}, 100%, 47%)`,
      textShadow: `1px 1px 0 hsl(${props.hue}, 100%, 30%)`
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
