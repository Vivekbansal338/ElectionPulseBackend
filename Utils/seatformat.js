import fs from "fs";

function addStateToConstituencies(inputFilePath, outputFilePath) {
  // Read the input JSON file
  fs.readFile(inputFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    try {
      const inputData = JSON.parse(data);
      const states = Object.keys(inputData);

      const transformedData = [];

      // Iterate through each state
      states.forEach((state) => {
        // Get the constituencies for the current state
        const constituencies = inputData[state];

        // Add the state name to each constituency object
        const constituenciesWithState = constituencies.map((constituency) => ({
          ...constituency,
          seatType: "Lok Sabha",
          State: state,
        }));

        // Push the transformed data to the result array
        transformedData.push(...constituenciesWithState);
      });

      // Write the transformed data to a new JSON file
      fs.writeFile(
        outputFilePath,
        JSON.stringify(transformedData, null, 2),
        (err) => {
          if (err) {
            console.error(`Error writing file: ${err}`);
            return;
          }
          console.log(
            `Output file (${outputFilePath}) has been generated successfully.`
          );
        }
      );
    } catch (error) {
      console.error(`Error parsing JSON: ${error}`);
    }
  });
}

// Example usage:
const inputFilePath = "./LokSabhaSeats.json";
const outputFilePath = "output.json";
addStateToConstituencies(inputFilePath, outputFilePath);
