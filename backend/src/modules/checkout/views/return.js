initialize();

async function initialize() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const sessionId = urlParams.get("session_id");
  const response = await fetch(`/api/v1/checkout/session-status?session_id=${sessionId}`);
  const session = await response.json();

  if (session.status == "open") {
    window.location.replace(`${process.env.SERVER_BASE_URL}/api/v1/checkout/checkout.html`);
  } else if (session.status == "complete") {
    document.getElementById("success").classList.remove("hidden");
    document.getElementById("customer-email").textContent = session.customer_email;
  }
}
