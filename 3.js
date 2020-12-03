const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./3.txt", {encoding:"utf8"}).trim();

function countTrees(input, slope){
  const lines = input.split("\n");
  const data = [].concat(...lines.map(i => i.split("")));

  let count = 0;
  for(let i = 0, j = 0; i < lines.length; i += slope[1], j++){
    const x = data[i * lines[0].length + ((j * slope[0]) % lines[0].length)];
    count += (x === "#" ? 1 : 0);
  }
  return count;
}

const testInput = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;

assert.equal(countTrees(testInput, [3, 1]), 7);
console.log("Part 1", countTrees(input, [3, 1]));

const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
];

assert.deepEqual(slopes.map(i => countTrees(testInput, i)), [2, 7, 3, 4, 2]);
console.log("Part 2", slopes.map(i => countTrees(input, i)).reduce((accum, i) => accum * i, 1));

