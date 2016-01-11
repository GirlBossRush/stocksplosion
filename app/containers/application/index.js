import "./application.styl"

import React, {Component, PropTypes} from "react"

class Application extends Component {
  render() {
    return <section data-component="application">
      {this.props.children}
    </section>
  }
}

Application.propTypes = {
  children: PropTypes.node.isRequired
}

export default Application
