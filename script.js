// Define constants and variables to store DOM elements and data
const ipAddressSpan = document.querySelector(".ipAddress");
const getStartedBtn = document.querySelector("#getStartedBtn");
let ipAddress = "";

// Function to fetch client's IP address from the ipify API
async function getClientIp() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    ipAddress = data.ip;
    // Display the IP address on the web page
    ipAddressSpan.textContent = ipAddress;
  } catch (error) {
    console.log("Error fetching IP:", error);
  }
}

// Call the function to get the IP address when the page loads
getClientIp();

// Add event listener to the "Get Started" button
getStartedBtn.addEventListener("click", () => {
  // Redirect to the "mainPage" when the button is clicked
  location.href = "./mainPage";
});
