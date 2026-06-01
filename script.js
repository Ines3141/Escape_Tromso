// JavaScript source code
function checkCode() {
  let code = document.getElementById("codeInput").value;

  if (code === "TROMSO") {
    window.location.href = "Stations/HTML/station_1.html";
  } else {
    document.getElementById("message").textContent = "Wrong code. Try again.";
  }
}
