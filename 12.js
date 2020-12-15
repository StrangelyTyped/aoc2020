const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./12.txt", {encoding:"utf8"}).trim();

const testInput = `F10
N3
F7
R90
F11`.trim();

function* parseInput(input){
  let action = [];
  for(const chr of input){
    if(chr === "\n"){
      yield action;
      action = [];
    } else if(action.length === 0){
      action.push(chr, 0);
    } else {
      action[1] = action[1] * 10 + parseInt(chr);
    }
  }
  yield action;
}

const dirVectors = [
  [0, -1], // N
  [1, 0],  // E
  [0, 1],  // S
  [-1, 0], // W
];

const cardinalMap = new Map([
  ["N", dirVectors[0]],
  ["E", dirVectors[1]],
  ["S", dirVectors[2]],
  ["W", dirVectors[3]],
]);

function moveOne(input){
  let shipDir = 1;
  let x = 0, y = 0;
  for(const [dir, dist] of parseInput(input)){
    if(dir == "L"){
      shipDir -= dist / 90;
      while(shipDir < 0){ shipDir += dirVectors.length; }
    } else if(dir === "R"){
      shipDir = (shipDir + (dist / 90)) % dirVectors.length;
    } else if(dir === "F" || cardinalMap.has(dir)) {
      let dirVector;
      if(dir === "F"){
        dirVector = dirVectors[shipDir];
      } else {
        dirVector = cardinalMap.get(dir);
      }
      x += dirVector[0] * dist;
      y += dirVector[1] * dist;
    } else {
      throw new Error("Unknown direction " + dir);
    }
  }
  return Math.abs(x) + Math.abs(y);
}

assert.equal(moveOne(testInput), 25);
console.log("Part 1", moveOne(input));



function moveTwo(input){
  let x = 0, y = 0;
  let wX = 10, wY = -1;
  for(const [dir, dist] of parseInput(input)){
    if(dir == "L"){
      // counterclockwise
      for(let i = 0; i < dist; i += 90){
        let oldY = wY;
        wY = -wX;
        wX = oldY;
      }
    } else if(dir === "R"){
      // clockwise
      for(let i = 0; i < dist; i += 90){
        let oldY = wY;
        wY = wX;
        wX = -oldY;
      }
    } else if(dir === "F"){
      x += wX * dist;
      y += wY * dist;
    } else if(cardinalMap.has(dir)) {
      const dirVector = cardinalMap.get(dir);
      wX += dirVector[0] * dist;
      wY += dirVector[1] * dist;
    } else {
      throw new Error("Unknown direction " + dir);
    }
  }
  return Math.abs(x) + Math.abs(y);
}

assert.equal(moveTwo(testInput), 286);
console.log("Part 2", moveTwo(input));



