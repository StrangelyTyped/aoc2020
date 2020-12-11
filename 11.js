const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./11.txt", {encoding:"utf8"}).trim().split("\n").map(i => i.split(""));

const testInput = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`.trim().split("\n").map(i => i.split(""));


function getNeighboursPart1(mapping, i, j){
  let count = 0;
  for(let i2 = Math.max(i - 1, 0); i2 <= i + 1 && i2 < mapping.length; i2++){
    for(let j2 = Math.max(j - 1, 0); j2 <= j + 1 && j2 < mapping[i2].length; j2++){
      if(i === i2 && j === j2){
        continue;
      }
      count += (mapping[i2][j2] === "#" ? 1 : 0);
    }
  }
  return count;
}

function advance(mapping, neighbourFunc, threshold){
  const newMap = [];
  for(let i = 0; i < mapping.length; i++){
    const row = mapping[i];
    const newRow = [];
    for(let j = 0; j < row.length; j++){
      if(mapping[i][j] === "."){
        newRow.push(".");
        continue;
      }
      const neighbourCount = neighbourFunc(mapping, i, j);
      if(mapping[i][j] === "L"){
        //empty
        if(neighbourCount === 0){
          newRow.push("#");
	}else{
          newRow.push("L");
	}
      } else {
        if(neighbourCount >= threshold){
          newRow.push("L");
	} else {
          newRow.push("#");
	}
      }
    }
    newMap.push(newRow);
  }
  return newMap;
}

function reformat(input){
  return input.map(i => i.join("")).join("\n");
}

function run(input, neighbourFunc, threshold){
  let currentState = input;
  let newState = input;
  do {
    currentState = newState;
    newState = advance(currentState, neighbourFunc, threshold);
  } while(reformat(newState) !== reformat(currentState));
  return currentState;
}

function countSeats(input){
  return input.reduce((accum, i) => accum += i.filter(j => j === "#").length, 0);
}

assert.equal(countSeats(run(testInput, getNeighboursPart1, 4)), 37);
console.log("Part 1", countSeats(run(input, getNeighboursPart1, 4)));

const offsetMap = [
 [-1, -1],
 [-1, 0],
 [-1, 1],
 [0, -1],
 [0, 1],
 [1, -1],
 [1, 0],
 [1, 1],
];

function getNeighboursPart2(input, i, j){
  let count = 0;
  offsetMap.forEach(dir => {
    let i2 = i;
    let j2 = j;
    while(true){
      i2 += dir[0];
      j2 += dir[1];
      if(i2 < 0 || j2 < 0 || i2 >= input.length || j2 >= input[i2].length){
        break;
      }
      count += (input[i2][j2] === "#" ? 1 : 0);
      if(input[i2][j2] !== "."){
        break;
      }
    }
  });
  return count;
}

assert.equal(countSeats(run(testInput, getNeighboursPart2, 5)), 26);
console.log("Part 2", countSeats(run(input, getNeighboursPart2, 5)));


