const axios = require("axios");
const xlsx = require("xlsx");

// Function to introduce a delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchDataAndSaveToExcel() {
  try {
    // Step 1: Define API details
    const apiUrl = "https://your-api-url.com/slot-spin"; // Replace with your API URL
    const bearerToken = "YOUR_BEARER_TOKEN_HERE"; // Replace with your Bearer Token
    const betAmount = 100; // Fixed bet amount for all requests

    const results = []; // Array to store all results

    // Step 2: Loop to make the API requests 1000 times
    for (let i = 0; i < 200; i++) {
      console.log(`Fetching data for request ${i + 1}...`);

      try {
        // Make the API request
        const response = await axios.post(
          apiUrl,
          {
            betAmount: betAmount, // Pass the bet amount in the body if required by your API
          },
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = response.data;

        // Check if the response was successful
        if (responseData.status === 200 && responseData.success) {
          const { winningReward, combination } = responseData.data;

          // Step 3: Format the data for Excel
          results.push({
            "Bet Amount": betAmount,
            "Symbol 1": combination[0] || "",
            "Symbol 2": combination[1] || "",
            "Symbol 3": combination[2] || "",
            Reward: winningReward || 0,
          });
        } else {
          console.error(
            `Error on request ${i + 1}: API response not successful`
          );
        }
      } catch (error) {
        console.error(`Error on request ${i + 1}:`, error.message);
      }

      // Step 4: Add a delay of 5 seconds between requests
      await sleep(1000); // 5000 milliseconds = 5 seconds
    }

    // Step 5: Write all results to an Excel file
    const worksheet = xlsx.utils.json_to_sheet(results);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Slot Spins");

    const outputFilePath = "./api_results.xlsx";
    xlsx.writeFile(workbook, outputFilePath);

    console.log(`All 200 responses saved to Excel file at: ${outputFilePath}`);
  } catch (error) {
    console.error("Error fetching data or writing to Excel:", error);
  }
}

// Call the function
fetchDataAndSaveToExcel();
