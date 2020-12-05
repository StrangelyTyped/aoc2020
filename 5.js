const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./5.txt", {encoding:"utf8"}).trim();

const seatCols = 8;
const seatRows = 128;

function* computeSeat(input){
  let x = (seatCols - 1) / 2;
  let y = (seatRows - 1) / 2;
  let xI = (x + 0.5) / 2;
  let yI = (y + 0.5) / 2;
  for(const chr of input){
    if(chr === "\n"){
      yield [x, y];
      x = (seatCols - 1) / 2;
      y = (seatRows - 1) / 2;
      xI = (x + 0.5) / 2;
      yI = (y + 0.5) / 2;
    } else if(chr === "L" || chr === "R"){
      x += (chr === "R" ? xI : -xI);
      xI /= 2;
    } else if(chr === "F" || chr === "B"){
      y += (chr === "B" ? yI : -yI);
      yI /= 2;
    }
  }
  return [x, y];
}

function* computeSeat2(input){
  let x = 0;
  let y = 0;
  for(const chr of input){
    if(chr === "\n"){
      yield [x, y];
      x = y = 0;
    } else if(chr === "L" || chr === "R"){
      x <<= 1;
      if(chr == "R"){
        x |= 1;
      }
    } else if(chr === "F" || chr === "B"){
      y <<= 1;
      if(chr === "B"){
        y |= 1;
      }
    }
  }
  return [x, y];
}

assert.deepEqual(computeSeat("BFFFBBFRRR").next().value, [7, 70])
assert.deepEqual(computeSeat("FFFBBBFRRR").next().value, [7, 14])
assert.deepEqual(computeSeat("BBFFBBFRLL").next().value, [4, 102])

assert.deepEqual(computeSeat2("BFFFBBFRRR").next().value, [7, 70])
assert.deepEqual(computeSeat2("FFFBBBFRRR").next().value, [7, 14])
assert.deepEqual(computeSeat2("BBFFBBFRLL").next().value, [4, 102])

let maxId = 0;
for(const seat of computeSeat2(input)){
  maxId = Math.max(maxId, seat[0] + 8 * seat[1]);
}
console.log("Part 1", maxId);

const input2 = input.split("\n").sort().join("\n");
let lastSeat = -1;
for(const seat of computeSeat2(input2)){
  let seatId = seat[1] * 8 + seat[0];
  if(lastSeat !== -1 && lastSeat === seatId - 2){
    console.log("Part 2", seatId - 1);
  }
  lastSeat = seatId;
}

