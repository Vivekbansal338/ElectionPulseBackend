import fs from "fs";
import path from "path";

export function getCoordinates(directoryPath, name) {
  // Read all files in the directory
  const files = fs.readdirSync(directoryPath);

  // Filter .js files
  const jsFiles = files.filter((file) => path.extname(file) === ".js");

  let coordinates = null;
  let type = null;

  // Process each .js file
  jsFiles.forEach((file) => {
    // Read the file
    const content = fs.readFileSync(path.join(directoryPath, file), "utf8");

    // Find the json_All_AC array in the file content
    const jsonAllACMatch = content.match(/var json_All_AC = (\[[\s\S]*?\]);/);

    if (jsonAllACMatch) {
      // Evaluate the json_All_AC array as JavaScript code
      const jsonAllACArray = eval(jsonAllACMatch[1]);

      // Extract PC_NAME from each object in the array
      jsonAllACArray.forEach((item) => {
        if (
          item.properties &&
          item.properties.PC_NAME &&
          item.properties.PC_NAME === name
        ) {
          // Get the coordinates
          coordinates = item.geometry.coordinates;
          type = item.geometry.type;
        }
      });
    }
  });
  return { coordinates, type };
}
