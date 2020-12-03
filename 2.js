const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./2.txt",{encoding:"utf8"}).trim();

const testInput = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`.split("\n");

function lex(predicateProvider){
  return function(line){
    let state = 0;
    let min = 0, max = 0;
    let letter = "";
    let predicate;
    for(let i of line){
        if(state === 0){
            if(i === "-"){
                state = 1;
            } else {
                min *= 10
                min += parseInt(i)
            }
        } else if(state == 1){
            if(i === " "){
                state = 2;
            } else {
                max *= 10
                max += parseInt(i)
            }
        } else if(state == 2){
            if(i === ":"){
                state = 3;
            } else {
                letter += i;
            }
        } else if(state === 3){
          if(i !== " "){
            state = 4;
	    predicate = predicateProvider(min, max, letter);
            predicate.next();
          }
        }
	if(state === 4){
            predicate.next(i);
        }
    }

    return predicate.next().value;
  }
}

function* part1Predicate(minCount, maxCount, targetLetter){
  let count = 0;
  let letter = yield;
  while(letter){
    if(letter === targetLetter){
      count++;
    }
    letter = yield;
  }
  return count >= minCount && count <= maxCount;
}

assert.equal(testInput.filter(lex(part1Predicate)).length, 2)
console.log("Part 1", input.split("\n").filter(lex(part1Predicate)).length)

function* part2Predicate(pos1, pos2, targetLetter){
  let matchingLetters = [];
  let letter = yield;
  let pos = 1;
  while(letter){
    if(pos === pos1 || pos === pos2){
      matchingLetters.push(letter);
    }
    letter = yield;
    pos++;
  }
  return (targetLetter === matchingLetters[0]) !== (targetLetter === matchingLetters[1]);
}

assert.equal(testInput.filter(lex(part2Predicate)).length, 1)
console.log("Part 2", input.split("\n").filter(lex(part2Predicate)).length)

