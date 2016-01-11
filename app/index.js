import "babel-polyfill"

import React from "react"
import {render} from "react-dom"
import {hashHistory, IndexRoute, Route, Router} from "react-router"
import Application from "./containers/application"
import Stocks from "./containers/stocks"

document.addEventListener("DOMContentLoaded", () => {
  render(<Router history={hashHistory}>
    <Route component={Application} path="/">
      <IndexRoute component={Stocks} />
    </Route>
  </Router>, document.querySelector("main"))
})
