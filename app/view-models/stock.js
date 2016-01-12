import {sortBy} from "lodash"
import moment from "moment"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function getSymbolHue(symbol) {
  return Array
    .from(symbol.toUpperCase())
    .reduce((accumulator, character, i) => accumulator + ALPHABET.indexOf(character) * (11 + i), 0) % 360
}

export function parsePrices(prices) {
  return sortBy(Object
    .keys(prices)
    .map(date => {
      return {
        date: moment(date),
        value: prices[date]
      }
    }), "date")
}

export default function createStockViewModel(stock) {
  return Object.assign({}, stock, {
    hue: getSymbolHue(stock.symbol),
    status: "indeterminate",
    prices: []
  })
}
