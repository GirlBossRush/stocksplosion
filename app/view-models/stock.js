const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function getSymbolHue(symbol) {
  return Array
    .from(symbol.toUpperCase())
    .reduce((accumulator, character, i) => accumulator + ALPHABET.indexOf(character) * (13 + i), 0) % 360
}

export default function createStockViewModel(stock) {
  return Object.assign({}, stock, {
    hue: getSymbolHue(stock.symbol)
  })
}
