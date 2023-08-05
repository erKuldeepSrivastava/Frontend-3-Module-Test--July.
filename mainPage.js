// Define constants and variables to store DOM elements and data
const ipAddressSpan = document.querySelector("#ipAddress");
const lattitudeSpan = document.querySelector("#lat-info");
const longitudeSpan = document.querySelector("#long-info");
const citySpan = document.querySelector("#city-info");
const regionSpan = document.querySelector("#region-info");
const organisationSpan = document.querySelector("#org-info");
const hostNameSpan = document.querySelector("#host-info");
const timeZoneSpan = document.querySelector("#timeZoneSpan");
const dateAndTimeSpan = document.querySelector("#dateAndTimeSpan");
const pincodeSpan = document.querySelector("#pincodeSpan");
const messageSpan = document.querySelector("#messageSpan");
const cardsDiv = document.querySelector(".cards");
const searchInput = document.querySelector("#search");
const iframe = document.querySelector("#map-iframe");
let postOffices = [];
let ipAddress = "";

// Function to fetch client's IP address from the ipify API
async function getClientIp() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    ipAddress = data.ip;
    toGetGeolocation(ipAddress);
    // Display the IP address on the web page
    ipAddressSpan.textContent = ipAddress;
  } catch (error) {
    console.log("Error fetching IP:", error);
  }
}

// Function to get geolocation data using IP address
async function toGetGeolocation(IP) {
  try {
    const res = await fetch(`http://ip-api.com/json/${IP}`);
    const data = await res.json();
    // Update the DOM elements with geolocation data
    lattitudeSpan.textContent = data.lat;
    longitudeSpan.textContent = data.lon;
    citySpan.textContent = data.city;
    regionSpan.textContent = data.region;
    organisationSpan.textContent = data.org;
    hostNameSpan.textContent = data.isp;
    iframe.setAttribute(
      "src",
      `https://maps.google.com/maps?q=${data.lat},${data.lon}&z=15&output=embed`
    );
    timeZoneSpan.textContent = data.timezone;
    dateAndTimeSpan.textContent = new Date().toLocaleString();
    pincodeSpan.textContent = data.zip;
    // Fetch post office data using the zip code
    await getAllPostOffices(data.zip);
  } catch (error) {
    console.log(error);
  }
}

// Function to fetch post office data using pincode
async function getAllPostOffices(pincode) {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    const obj = data[0];
    messageSpan.textContent = obj.Message;
    postOffices = obj.PostOffice;
    // Render post office data on the web page
    renderPostOffices();
  } catch (error) {
    console.log(error);
  }
}

// Function to render post office data on the web page
function renderPostOffices() {
  cardsDiv.innerHTML = ""; // Clear previous results

  postOffices.forEach((office) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    cardDiv.innerHTML = `
        <span>Name: <span class="innerSpan">${office.Name}</span></span>
        <span>Branch Type: <span class="innerSpan">${office.BranchType}</span></span>
        <span>Delivery Status: <span class="innerSpan">${office.DeliveryStatus}</span></span>
        <span>District: <span class="innerSpan">${office.District}</span></span>
        <span>Division: <span class="innerSpan">${office.Division}</span></span>`;

    cardsDiv.append(cardDiv);
  });
}

// Event listener to filter post offices based on user input
searchInput.addEventListener("input", () => {
  const filteredPostOffices = postOffices.filter((office) => {
    return (
      office.Name.toLowerCase().includes(
        searchInput.value.trim().toLowerCase()
      ) ||
      office.Block.toLowerCase().includes(
        searchInput.value.trim().toLowerCase()
      )
    );
  });

  cardsDiv.innerHTML = ""; // Clear the previous results before appending the filtered ones

  filteredPostOffices.forEach((office) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    cardDiv.innerHTML = `
        <span>Name: <span class="innerSpan">${office.Name}</span></span>
        <span>Branch Type: <span class="innerSpan">${office.BranchType}</span></span>
        <span>Delivery Status: <span class="innerSpan">${office.DeliveryStatus}</span></span>
        <span>District: <span class="innerSpan">${office.District}</span></span>
        <span>Division: <span class="innerSpan">${office.Division}</span></span>`;

    cardsDiv.append(cardDiv);
  });
});

// Call the function to get the IP address when the page loads
getClientIp();
