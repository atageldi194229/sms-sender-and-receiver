const fs = require("fs");
const path = require("path");

let s = fs.readFileSync(path.join(__dirname, "contacts.txt")).toString();

let obj = s
  .split("\n")
  .map((e) => e.trim())
  .filter((e) => e.length > 6)
  .reduce((p, e) => {
    p[e] = !!p[e] ? p[e] + 1 : 1;
    return p;
  }, {});

console.log(Object.values(obj).filter((e) => e > 1).length);
