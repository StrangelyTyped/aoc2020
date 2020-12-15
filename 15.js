const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./15.txt", {encoding:"utf8"}).trim();

function partOne(input, iters){
  const inputNums = input.split(",").map(i => parseInt(i));
  const prevMap = new Map();
  let lastNumber, turns = 0;
  function announce(i){
    if(prevMap.has(i)){
      const prev = prevMap.get(i);
      prevMap.set(i, [prev[0] + 1, turns, prev[1]]);
    } else {
      prevMap.set(i, [1, turns, 0]);
    }
    lastNumber = i;
    turns++;
  }
  inputNums.forEach(announce);
  for(let j = inputNums.length; j < iters; j++){
    const res = prevMap.get(lastNumber);
    if(res[0] === 1){
      announce(0);
    }else{
      announce(j - res[2] - 1);
    }
  }
  return lastNumber;
}

assert.equal(partOne("0,3,6", 10), 0);
assert.equal(partOne("1,3,2", 2020), 1);
assert.equal(partOne("2,1,3", 2020), 10);
assert.equal(partOne("1,2,3", 2020), 27);
assert.equal(partOne("2,3,1", 2020), 78);
assert.equal(partOne("3,2,1", 2020), 438);
assert.equal(partOne("3,1,2", 2020), 1836);

console.log("Part 1",partOne(input, 2020));
// Brute force and slow as hell but meh
console.log("Part 2",partOne(input, 30000000));
