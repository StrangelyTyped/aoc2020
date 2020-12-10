const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./10.txt", {encoding:"utf8"}).trim().split("\n").map(i => parseInt(i));

const testInput = `16
10
15
5
1
11
7
19
6
12
4`.trim().split("\n").map(i => parseInt(i));
const testInput2 = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`.trim().split("\n").map(i => parseInt(i));

function partOne(input){
  let lastOutput = 0;
  let diffs = [0, 0, 0, 1];
  input.sort((a, b) => a-b).forEach(i => {
    diffs[i - lastOutput]++;
    lastOutput = i;
  });
  return diffs[1] * diffs[3];
}

assert.equal(partOne(testInput), 35);
assert.equal(partOne(testInput2), 220);
console.log("Part 1", partOne(input));

function findChain(avail, startIdx, from, to, memo){
  let candidateArrangements = 0;
  if(memo.has(from)){
    return memo.get(from);
  }
  for(let i = 0; i < 3 && i + startIdx < avail.length; i++){
    if(avail[startIdx + i] > (from + 3)){
      break;
    }
    if(avail[startIdx + i] + 3 >= to){
      candidateArrangements++;
    } else {
      candidateArrangements += findChain(avail, i + startIdx + 1, avail[startIdx + i], to, memo);
    }
  }
  memo.set(from, candidateArrangements);
  return candidateArrangements;
}

function partTwo(input){
  return findChain(input, 0, 0, input[input.length - 1] + 3, new Map());
}

assert.equal(partTwo(testInput), 8);
assert.equal(partTwo(testInput2), 19208);
console.log("Part 2", partTwo(input));


