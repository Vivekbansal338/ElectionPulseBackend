import fs from "fs";
function getimagefromdata(inputFilePath, outputFilePath) {
  // Read the input JSON file
  fs.readFile(inputFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    try {
      const dataoutput = JSON.parse(data);
      const images = dataoutput.users.map((user) => user.image);

      // Write the transformed data to a new JSON file
      fs.writeFile(outputFilePath, JSON.stringify(images, null, 2), (err) => {
        if (err) {
          console.error(`Error writing file: ${err}`);
          return;
        }
        console.log(
          `Output file (${outputFilePath}) has been generated successfully.`
        );
      });
    } catch (error) {
      console.error(`Error parsing JSON: ${error}`);
    }
  });
}

// Example usage:
const inputFilePath = "./dummyusers.json";
const outputFilePath = "output.json";
getimagefromdata(inputFilePath, outputFilePath);
