const requiredNode = "24.14.0";
const requiredNpm = "11.12.0";

const currentNode = process.versions.node;

import { execSync } from "child_process";
const currentNpm = execSync("npm -v").toString().trim();

if (currentNode !== requiredNode) {
  console.error(`Se requiere Node ${requiredNode}. Tienes Node ${currentNode}`);
  process.exit(1);
}

if (currentNpm !== requiredNpm) {
  console.error(`Se requiere npm ${requiredNpm}. Tienes npm ${currentNpm}`);
  process.exit(1);
}

console.log("Versiones correctas de Node y npm");
