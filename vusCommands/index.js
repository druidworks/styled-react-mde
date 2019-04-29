var program = require("commander");
var addStyledComponent = require("./addStyledComponent");

try {
  console.log("Starging command line application\n--------------------------------------");
  program
    .version("1.0.0")
    .command("addStyledComponent <filePath> <componentName>")
    .description("Creates a styled component in the directory specified")
    .action(function(filePath, componentName) {
      addStyledComponent(filePath, componentName);
    });

  program.parse(process.argv);
} catch (e) {
  console.log("Error starting command line\n", e.stack);
  console.log("\n");
}
