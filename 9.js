const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./9.txt", {encoding:"utf8"}).trim().split("\n").map(i => parseInt(i));

const testInput = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`.trim().split("\n").map(i => parseInt(i));

function findPair(buffer, target){
  const smallBuffer = buffer.filter(i => i <= target / 2);
  for(let i = 0; i < smallBuffer.length; i++){
    const num1 = smallBuffer[i]
    for(let j = 0; j < buffer.length; j++){
      const num2 = buffer[j];
      if(num2 + num1 === target){
        return [num1, num2];
      }
    }
  }
  return null;
}

function partOne(input, preamble = 25){
  let buffer = input.slice(0, preamble);
  for(let i = preamble; i < input.length; i++){
    if(!findPair(buffer, input[i])){
      return input[i];
    }
    buffer.shift();
    buffer.push(input[i]);
  }
}

assert.equal(partOne(testInput, 5), 127);
console.log("Part 1", partOne(input));

function partTwo(input, target){
  for(let i = 0; i < input.length; i++){
    let accum = 0;
    let j = 0;
    while(accum < target){
      accum += input[i + j];
      j++;
    }
    if(accum === target){
      return Math.max(... input.slice(i, i + j)) + Math.min(... input.slice(i, i + j));
    }
  }
}

assert.equal(partTwo(testInput, partOne(testInput, 5)), 62);
console.log("Part 2", partTwo(input, partOne(input)));
