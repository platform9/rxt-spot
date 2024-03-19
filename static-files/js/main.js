function loadHTML(url, id) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data

      if (id === "nav-placeholder") {
        document.getElementById("spotNavbarLogo").href = window.location.origin
      }
    })
    .catch((err) => console.error("Failed to load content: ", err))
}

loadHTML("/static-files/html/nav.html", "nav-placeholder")
loadHTML("/static-files/html/footer.html", "footer-placeholder")

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
