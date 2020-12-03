const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./1.txt",{encoding:"utf8"}).trim();

const testInput = `1721
979
366
299
675
1456`.split("\n").map(i => parseInt(i));

let inputLines = input.split("\n").map(i => parseInt(i));

let attempt1 = (input) => input.filter((i, idx, arr) => arr.includes(2020 - i)).map(i => i * (2020 - i))[0];

assert.equal(attempt1(testInput), 514579)
let part1_1 = attempt1(inputLines);
console.log("Part 1 attempt 1", part1_1)

function attempt2(targetVal, itemCount, arr){
    for(let i = 0; i < arr.length; i++){
        if(arr[i] == targetVal && itemCount == 1){
            return [arr[i]]
        }
        if(arr[i] < targetVal && itemCount > 1){
            let ret = attempt2(targetVal - arr[i], itemCount - 1, arr.slice(i))
            if(ret){
                return [arr[i], ...ret]
            }
        }
    }
    return null;
}

let multReduce = (arr) => arr.reduce((accum, i) => accum * i, 1)

assert.equal(multReduce(attempt2(2020, 2, testInput)), 514579)
assert.equal(multReduce(attempt2(2020, 3, testInput)), 241861950)

let part1_2 = multReduce(attempt2(2020, 2, inputLines))
console.log("Part 1 attempt 2", part1_2);

let part2 = multReduce(attempt2(2020, 3, inputLines))
console.log("Part 2", part2);
