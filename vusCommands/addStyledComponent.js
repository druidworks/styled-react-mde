var fs = require("fs");
var path = require("path");
var changeCase = require("change-case");

const tsxTemplate = fs.readFileSync(path.resolve("vusCommands/templates/styledComponentTsx.text"), { encoding: "utf8" });
const styleTemplate = fs.readFileSync(path.resolve("vusCommands/templates/styledComponentStyle.text"), { encoding: "utf8" });

function addStyledComponent(filePath, rawComponentName) {
  console.log("running... addStyledComponent(", filePath, ", ", rawComponentName, ")\n");
  if (filePath && rawComponentName && fs.existsSync(filePath)) {
    const directoryPath = path.join(filePath, changeCase.camelCase(rawComponentName));
    const camelCaseComponentName = changeCase.pascalCase(rawComponentName);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
      if (fs.existsSync(directoryPath)) {
        const regex = new RegExp("<%componentName%>", "g");
        fs.writeFileSync(path.join(directoryPath, "index.tsx"), tsxTemplate.replace(regex, camelCaseComponentName), { encoding: "utf8" });
        fs.writeFileSync(path.join(directoryPath, "style.tsx"), styleTemplate.replace(regex, camelCaseComponentName), { encoding: "utf8" });
        console.log("    Component Created.\n\n");
      }
    } else {
      console.log("Directory already exists\n", directoryPath);
      console.log("\n");
    }
  }
}

module.exports = addStyledComponent;
