const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./14.txt", {encoding:"utf8"}).trim();

const testInput = `
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
`.trim();

const maskRe = /mask = ([01X]+)/;
const setRe = /mem\[([0-9]+)\] = ([0-9]+)/;

function partOne(input){
  const lines = input.split("\n");
  let mask = "";
  const memory = [];
  for(const line of lines){
    const match1 = maskRe.exec(line);
    if(match1){
      mask = match1[1];
      continue;
    }
    const match2 = setRe.exec(line);
    if(!match2){
      throw new Error("Parse error: " + line);
    }
    const offset = parseInt(match2[1]);
    let value = parseInt(match2[2]);
    for(let i = 0; i < mask.length; i++){
      if(mask[i] === "X"){
        continue;
      }
      let mod = (1 << (mask.length - i - 1));
      if(mask[i] === "0"){
        mod = ~mod;
        value = value & mod;
      }else if(mask[i] === "1"){
        value = value | mod;
      }
	      if(value < 0){
 value += Math.pow(2, 32);
	      }
    }
    memory[offset] = value;
  }
  return memory.reduce((accum, i) => accum + (i || 0), 0);
}

assert.equal(partOne(testInput), 165);
console.log("Part 1 (broken)", partOne(input));

