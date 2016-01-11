import {format as formatUrl} from "url"

export default function formatApiRequest(path = "", query = {}) {
  return formatUrl({
    host: `stocksplosion.apsis.io/api/company${path}`,
    query,
    protocol: "http"
  })
}
