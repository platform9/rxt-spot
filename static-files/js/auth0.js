const redirectUrl = `https://${window.location.host}/ui`
var lock = null
var webAuth = null
var rackspaceLoginURL = null

const options = {
  auth: {
    redirectUrl,
    responseType: "token",
  },
  theme: {
    logo: "https://spot.rackspace.com/static-files/images/spot-logo-transparent.png",
    primaryColor: "#c91508",
  },
  languageDictionary: {
    emailInputPlaceholder: "Email",
    passwordInputPlaceholder: "Password",
    forgotPasswordAction: "Forgot Password?",
    title: "",
    signUpTerms: `<span>
        By signing up, you agree to our
        <a
          href="https://spot.rackspace.com/docs/terms"
          target="_blank"
          rel="noopener noreferrer"
          style="color:#337ab7"
        >
          Terms of Service
        </a>
      </span>`,
  },
  usernameStyle: "email",
  allowShowPassword: true,
  showTerms: true,
}

async function getClientInfo() {
  const url = `https://${window.location.host}/apis/auth.ngpc.rxt.io/v1/clients`
  try {
    const response = await fetch(url)
    const clients = await response.json()
    const uiClient = (clients || []).find((c) => c.name === "NGPC UI")
    return uiClient
  } catch (err) {
    console.error("Error fetching clients", err)
  }
}

async function initializeAuth0Lock({ client_id, domain } = {}) {
  if (!client_id || !domain) {
    console.error("Cannot initialize Auth0 Lock: client_id or domain not found")
    return
  }
  // Initialize Lock for regular sign up and logins
  lock = new Auth0Lock(client_id, domain, options)
  // Adjust the height of the Auth0 Lock widget
  lock.on("show", function () {
    // Wait for the next tick to ensure the DOM has updated
    setTimeout(function () {
      const lockWidget = document.querySelector(".auth0-lock-widget")
      if (lockWidget) {
        lockWidget.style.height = "max-content"
        lockWidget.style.width = "350px"
      }
    }, 1)
  })
}

function initializeAuth0() {
  getClientInfo().then((client) => {
    initializeAuth0Lock(client)
  })
}

initializeAuth0()
