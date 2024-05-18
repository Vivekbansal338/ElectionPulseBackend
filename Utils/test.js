import fs from "fs";

function sortPartiesBySymbol(inputFile, outputFile) {
  // Read the file
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
    } else {
      // Parse the JSON data
      const parties = JSON.parse(data);

      // Sort the parties by symbol and name
      const sortedParties = parties.sort((a, b) => {
        if (a.name === null && b.name === null) {
          return 0;
        } else if (a.name === null) {
          return 1;
        } else if (b.name === null) {
          return -1;
        } else {
          const nameComparison = a.name.localeCompare(b.name);
          if (nameComparison !== 0) {
            return nameComparison;
          } else {
            if (a.symbol === null && b.symbol === null) {
              return 0;
            } else if (a.symbol === null) {
              return 1;
            } else if (b.symbol === null) {
              return -1;
            } else {
              return a.symbol.localeCompare(b.symbol);
            }
          }
        }
      });

      // Write the sorted parties to the output file
      fs.writeFile(
        outputFile,
        JSON.stringify(sortedParties, null, 2),
        (err) => {
          if (err) {
            console.error(`Error writing file to disk: ${err}`);
          } else {
            console.log(`File has been written to ${outputFile}`);
          }
        }
      );
    }
  });
}

// Usage
sortPartiesBySymbol(
  "./stateparties.json",
  "sorted_stateparties_with_nameandsymbol.json"
);
