const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./7.txt", {encoding:"utf8"}).trim();

const testInput = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`.trim();

const testInput2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`.trim();

const regex = /(.*) bags contain (.*)./;
function parseBagMap(input){
  const bagMap = new Map();
  input.split("\n").forEach(line => {
    const match = regex.exec(line);
    if(!match){
      return;
    }
    const outerBag = match[1];
    const innerBags = new Map();
    if(match[2] !== "no other bags"){
      const re = /(\d+) ([a-z ]+) bag/g;
      let match2;
      while(match2 = re.exec(match[2])){
        innerBags.set(match2[2], parseInt(match2[1]));
      }
    }
    bagMap.set(outerBag, innerBags);
  });
  return bagMap;
}

function findOuterBags(targetColour, bagMap){
  const openList = [targetColour];
  const closedList = [];

  while(openList.length){
    const localColour = openList.pop();
    if(localColour !== targetColour){
      closedList.push(localColour);
    }
    for(const entry of bagMap){
      if(entry[1].has(localColour) && !closedList.includes(entry[0]) && !openList.includes(entry[0])){
        openList.push(entry[0]);
      }
    }
  }
  return closedList;
}


assert.deepEqual(findOuterBags("shiny gold", parseBagMap(testInput)).sort(), ["bright white", "muted yellow", "dark orange", "light red"].sort());
console.log("Part 1", findOuterBags("shiny gold", parseBagMap(input)).length);

function expandBag(targetColour, bagMap){
  const expandMap = new Map();
  expandMap.set(targetColour, 1);
  for(const [nestedColour, quantity] of bagMap.get(targetColour)){
    const nestMap = expandBag(nestedColour, bagMap);
    for(const [reallyNestedColour, nestedQuantity] of nestMap){
      expandMap.set(reallyNestedColour, (expandMap.has(reallyNestedColour) ? expandMap.get(reallyNestedColour) : 0) + (nestedQuantity * quantity));
    }
  }
  return expandMap;
}

function mapSum(map){
  let sum = 0;
  for(const [k, v] of map){
    sum += v;
  }
  return sum;
}

// -1 because the shiny gold ends up in the results
assert.equal(mapSum(expandBag("shiny gold", parseBagMap(testInput))) - 1, 32);
assert.equal(mapSum(expandBag("shiny gold", parseBagMap(testInput2))) - 1, 126);
console.log("Part 2", mapSum(expandBag("shiny gold", parseBagMap(input))) - 1);



