gtag("event", "Viewed Home Page", {})

let lastKnownScrollPosition = 0
let ticking = false

function scrollEvent(event) {
  lastKnownScrollPosition = window.scrollY
  const boundingRectOfPricing = document
    .getElementById("spot-savings-section")
    .getBoundingClientRect()

  if (!ticking) {
    window.requestAnimationFrame(() => {
      ticking = false
      if (boundingRectOfPricing.y < 0) {
        document.removeEventListener("scroll", scrollEvent)
        gtag("event", "Viewed Pricing Comparison", {})
      }
    })

    ticking = true
  }
}

document.addEventListener("scroll", scrollEvent)

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu")
  if (mobileMenu.style.display === "none") {
    mobileMenu.style.display = "block"
  } else if (mobileMenu.style.display === "") {
    mobileMenu.style.display = "block"
  } else {
    mobileMenu.style.display = "none"
  }
}

function resetActiveTabs() {
  const tabA = document.getElementById("reference-a")
  const tabB = document.getElementById("reference-b")
  const tabC = document.getElementById("reference-c")
  tabA.classList.remove("active")
  tabB.classList.remove("active")
  tabC.classList.remove("active")
}

function setTabActive(type) {
  const tab = document.getElementById(`reference-${type}`)
  tab.classList.add("active")
}

function resetActiveCopy() {
  const templateA = document.getElementById("template-a")
  const templateB = document.getElementById("template-b")
  const templateC = document.getElementById("template-c")
  const spotAPrice = document.getElementById("spot-a-price")
  const spotAComparisons = document.getElementById("spot-a-comparisons")
  const spotBPrice = document.getElementById("spot-b-price")
  const spotBComparisons = document.getElementById("spot-b-comparisons")
  const spotCPrice = document.getElementById("spot-c-price")
  const spotCComparisons = document.getElementById("spot-c-comparisons")
  const awsAPrice = document.getElementById("aws-a-price")
  const awsAComparisons = document.getElementById("aws-a-comparisons")
  const awsBPrice = document.getElementById("aws-b-price")
  const awsBComparisons = document.getElementById("aws-b-comparisons")
  const awsCPrice = document.getElementById("aws-c-price")
  const awsCComparisons = document.getElementById("aws-c-comparisons")
  const digitaloceanAPrice = document.getElementById("digitalocean-a-price")
  const digitaloceanAComparisons = document.getElementById(
    "digitalocean-a-comparisons"
  )
  const digitaloceanBPrice = document.getElementById("digitalocean-b-price")
  const digitaloceanBComparisons = document.getElementById(
    "digitalocean-b-comparisons"
  )
  const digitaloceanCPrice = document.getElementById("digitalocean-c-price")
  const digitaloceanCComparisons = document.getElementById(
    "digitalocean-c-comparisons"
  )
  templateA.style.display = "none"
  templateB.style.display = "none"
  templateC.style.display = "none"
  spotAPrice.style.display = "none"
  spotAComparisons.style.display = "none"
  spotBPrice.style.display = "none"
  spotBComparisons.style.display = "none"
  spotCPrice.style.display = "none"
  spotCComparisons.style.display = "none"
  awsAPrice.style.display = "none"
  awsAComparisons.style.display = "none"
  awsBPrice.style.display = "none"
  awsBComparisons.style.display = "none"
  awsCPrice.style.display = "none"
  awsCComparisons.style.display = "none"
  digitaloceanAPrice.style.display = "none"
  digitaloceanAComparisons.style.display = "none"
  digitaloceanBPrice.style.display = "none"
  digitaloceanBComparisons.style.display = "none"
  digitaloceanCPrice.style.display = "none"
  digitaloceanCComparisons.style.display = "none"
}

function setActiveCopy(type) {
  const template = document.getElementById(`template-${type}`)
  const spotPrice = document.getElementById(`spot-${type}-price`)
  const spotComparisons = document.getElementById(`spot-${type}-comparisons`)
  const awsPrice = document.getElementById(`aws-${type}-price`)
  const awsComparisons = document.getElementById(`aws-${type}-comparisons`)
  const digitaloceanPrice = document.getElementById(
    `digitalocean-${type}-price`
  )
  const digitaloceanComparisons = document.getElementById(
    `digitalocean-${type}-comparisons`
  )
  template.style.display = "flex"
  spotPrice.style.display = "block"
  spotComparisons.style.display = "grid"
  awsPrice.style.display = "block"
  awsComparisons.style.display = "grid"
  digitaloceanPrice.style.display = "block"
  digitaloceanComparisons.style.display = "grid"
}

function togglePriceChart(type) {
  gtag("event", "Price Comparison - Clicked scenario " + type, {})
  amplitude.track("Price Comparison - Clicked scenario " + type)
  resetActiveTabs()
  setTabActive(type)
  resetActiveCopy()
  setActiveCopy(type)
}

async function handleLogInClick(source) {
  gtag("event", `Clicked ${source} button`, {})
  amplitude.track(`Clicked ${source} button`)

  if (!lock) {
    await initializeAuth0()
  }

  lock.checkSession(
    {
      redirect_uri: redirectUrl,
      responseType: "token id_token",
    },
    function (err, authResult) {
      if (err) {
        lock.show()
      } else {
        window.location.href = "/ui"
      }
    }
  )
}

async function handleSignUpClick() {
  gtag("event", "Clicked Sign Up button", {})
  amplitude.track("Clicked Sign Up button")

  if (!lock) {
    await initializeAuth0()
  }

  lock.show({ initialScreen: "signUp" })
}

function trackEvent(name) {
  amplitude.track(name)
}

const imageUrlMap = {
  serverClasses: "static-files/images/spot-1-server-configs.gif",
  makeBid: "static-files/images/spot-2-bid-easily.png",
  useKubectl: "static-files/images/spot-3-consume-via-kubectl-short.gif",
  priceChange: "static-files/images/spot-4-stay-informed.png",
  automate: "static-files/images/spot-5-operate-with-terraform.png",
}

function toggleFeature(element, feature) {
  const parentElement = element.parentElement
  const collection = document.getElementsByClassName("how-it-works-feature")
  for (let el of collection) {
    if (el === parentElement) {
      if (el.classList.contains("active")) {
        el.classList.remove("active")
      } else {
        el.classList.add("active")
      }
    } else {
      if (el.classList.contains("active")) {
        el.classList.remove("active")
      }
    }
  }
  const imageUrl = imageUrlMap[feature]
  updateHowItWorksVisual(imageUrl)
}

function toggleFeatureMobile(element) {
  const parentElement = element.parentElement
  const collection = document.getElementsByClassName(
    "how-it-works-feature-mobile"
  )
  for (let el of collection) {
    if (el === parentElement) {
      if (el.classList.contains("active")) {
        el.classList.remove("active")
      } else {
        el.classList.add("active")
      }
    } else {
      if (el.classList.contains("active")) {
        el.classList.remove("active")
      }
    }
  }
}

function updateHowItWorksVisual(imagePath) {
  const visualElement = document.getElementById("how-it-works-visual")
  visualElement.src = imagePath
}
