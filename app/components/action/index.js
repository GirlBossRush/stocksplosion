import classnames from "classnames"
import {capitalize} from "lodash"
import React from "react"

export default function Action({stock, type, onAction, tabIndex}) {
  function handleAction() {
    onAction({
      stockId: stock.id,
      status: stock.status === type ? "indeterminate" : type // Allow setting of status
    })
  }

  return <div
    className={classnames({action: true, selected: stock.status === type})}
    data-action={type}
    data-actionable
    onClick={handleAction}
    onKeyPress={handleAction}
    tabIndex={tabIndex}>
    {capitalize(type)}
  </div>
}
