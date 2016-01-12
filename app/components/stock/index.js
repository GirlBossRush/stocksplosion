import "./stock.styl"

import React from "react"

const LABELS = {
  buy: "bought",
  sell: "sold",
  wait: "wait"
}

export default function Stock({active, stock, onClick}) {
  const label = LABELS[stock.status] || ""
  const styles = {
    container: {
      backgroundColor: active ? `hsl(${stock.hue}, 100%, 96%)` : "",
      borderRightColor: active ? `hsl(${stock.hue}, 100%, 47%)` : ""
    },
    symbol: {
      backgroundColor: `hsl(${stock.hue}, 100%, 47%)`,
      textShadow: `1px 1px 0 hsl(${stock.hue}, 100%, 30%)`
    },
    name: {
      textDecoration: active ? "underline" : "none"
    }
  }

  return <section data-actionable data-component="stock" onClick={onClick} style={styles.container}>
    <div className="symbol" style={styles.symbol}>
      {stock.symbol}
    </div>

    <div className="primary">
      <div style={styles.name}>{stock.name}</div>

      <div className="label">{label}</div>
    </div>

  </section>
}
