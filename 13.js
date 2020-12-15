const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./13.txt", {encoding:"utf8"}).trim();

const testInput = `939
7,13,x,x,59,x,31,19`.trim();

function partOne(input){
  let [ts, busList] = input.split("\n");
  let buses = busList.split(",").filter(i => i !== "x").map(i => parseInt(i));
  let bestBus = [null, Math.min()];
  buses.forEach(bus => {
    if((bus - (ts % bus)) < bestBus[1]){
      bestBus = [bus, bus - (ts % bus)];
    }
  });
  return bestBus;
}

assert.deepEqual(partOne(testInput), [59, 5]);
let result = partOne(input);
console.log("Part 1", result[0] * result[1]);

function part2(busList){
  let constraints = [];
  busList.split(",").map(i => i === "x" ? "0" : i).map(i => parseInt(i)).forEach((i, idx) => {
    if(i){
       constraints.push([i, idx]);
    }
  });
  
  console.log(constraints);
}
assert.equal(part2(testInput.split("\n")[1]), 1068788);


