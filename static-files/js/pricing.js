gtag("event", "Viewed Pricing Page", {})

const regionSelector = document.getElementById("regionSelector")
const classesSelector = document.getElementById("classSelector")
const pricingPeriodSelector = document.getElementById("pricingPeriodSelector")
let pricingTable = null

const defaultPriceFormatOptions = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 3,
}

function formatPrice(price) {
  return price
    ? new Intl.NumberFormat("us-EN", defaultPriceFormatOptions).format(price)
    : ""
}

function extractServerPricingDetails(data = {}) {
  let pricingList = []
  const serverClassTypes = new Set()
  const serverRegions = new Set()

  for (const region in data.regions) {
    for (const serverType in data.regions?.[region]) {
      const server = data.regions?.[region]?.[serverType]
      pricingList.push({
        category: server?.category,
        displayName: server?.display_name,
        cpu: server?.cpu,
        region: server?.description,
        marketPrice: server?.market_price,
        memory: server?.memory,
      })

      // Add region to the set
      serverRegions.add(server?.description)
      // Add server type to the set
      serverClassTypes.add(server?.category)
    }
  }

  // Add all the regions as options in the Region selector
  serverRegions.forEach((type) => {
    regionSelector.add(new Option(type, type))
  })
  // Add all the possible server classes as options in the Class selector
  serverClassTypes.forEach((type) => {
    classesSelector.add(new Option(type, type))
  })

  return pricingList
}

function initDataTable(data) {
  pricingTable = $("#pricingTable").DataTable({
    data,
    columns: [
      { title: "Class", data: "category", defaultContent: "" },
      { title: "Type", data: "displayName", defaultContent: "" },
      { title: "Region", data: "region", defaultContent: "" },
      { title: "vCPUs", data: "cpu", defaultContent: "" },
      { title: "Memory (GB)", data: "memory", defaultContent: "" },
      {
        title: "Current Market Price",
        data: "marketPrice",
        defaultContent: "",
      },
    ],
    columnDefs: [
      {
        target: 0,
        visible: false,
        searchable: true,
      },
      {
        target: 4,
        type: "num",
        render: function (data, type, row) {
          if (type === "sort") {
            return parseFloat(data)
          }
          return data
        },
      },
      {
        target: 5,
        type: "num-fmt",
        render: function (data, type, row) {
          if (type === "display" && data) {
            return `<span class="market-price">${formatPrice(
              data
            )}</span><span class="pricing-period"> / ${
              pricingPeriodSelector.value
            }</span>`
          }
          return data
        },
      },
    ],
    order: [[5, "asc"]], // sort data by market price by default
    paging: false,
    ordering: true,
    searching: true,
    info: false,
    dom: "lrtp",
  })
}

async function getPricingData() {
  const url = `https://${
    window.location.origin.includes("ngpc-staging")
      ? "ngpc-staging"
      : "ngpc-prod"
  }-public-data.s3.us-east-2.amazonaws.com/percentiles.json`
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (err) {
    console.error(`Error fetching pricing data from ${url}`, err)
  }
}

regionSelector.addEventListener("change", function () {
  const selectedRegion = this.value
  gtag(
    "event",
    "Pricing Table - Filtered servers by region:  " + selectedRegion,
    {}
  )
  amplitude.track(
    "Pricing Table - Filtered servers by region:  " + selectedRegion
  )
  pricingTable
    .column(2)
    .search(selectedRegion === "all" ? "" : selectedRegion)
    .draw()
})

classesSelector.addEventListener("change", function () {
  const selectedClass = this.value
  gtag(
    "event",
    "Pricing Table - Filtered servers by class:  " + selectedClass,
    {}
  )
  amplitude.track(
    "Pricing Table - Filtered servers by class:  " + selectedClass
  )
  pricingTable
    .column(0)
    .search(selectedClass === "all" ? "" : selectedClass)
    .draw()
})

pricingPeriodSelector.addEventListener("change", function () {
  const selectedPricePeriod = this.value
  gtag("event", "Pricing Table - Viewed prices " + selectedPricePeriod, {})
  amplitude.track("Pricing Table - Viewed prices " + selectedPricePeriod)
  pricingTable.rows().every(function () {
    let row = this.data()
    if (row.marketPrice === "") return
    if (selectedPricePeriod === "per month") {
      row.marketPrice = row.marketPrice * 24 * 30
    } else {
      row.marketPrice = row.marketPrice / (24 * 30)
    }

    this.invalidate() // Invalidate the data to update the row
  })
  pricingTable.draw()
})

getPricingData().then((rawData) => {
  const processedData = extractServerPricingDetails(rawData)
  initDataTable(processedData)
})
