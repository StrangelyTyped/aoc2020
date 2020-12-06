const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./6.txt", {encoding:"utf8"}).trim();

function* computeAnyAnswerSet(input){
  let answers = new Set();
  let lastChr = "";
  for(const chr of input){
    if(chr === "\n"){
      if(lastChr === "\n"){
        yield answers;
        answers = new Set();
      }
    } else {
      answers.add(chr);
    }
    lastChr = chr;
  }
  yield answers;
}

let anySum = 0;
for(const answerSet of computeAnyAnswerSet(input)){
  anySum += answerSet.size;
}
console.log("Part 1", anySum);


function* iteratorFilter(iterable, predicate){
  for(const item of iterable){
    if(predicate(item)){
      yield item
    }
  }
}

function* iteratorMap(iterable, mapping){
  for(const item of iterable){
    yield mapping(item);
  }
}

function* computeAllAnswerSet(input){
  let answers = new Map();
  let lastChr = "";
  let groupSize = 0;
  for(const chr of input){
    if(chr === "\n"){
      if(lastChr === "\n"){
        yield new Set(iteratorMap(iteratorFilter(answers, ([k, v]) => v === groupSize), ([k, v]) => k));
        answers = new Map();
        groupSize = 0;
      } else {
        groupSize++;
      }
    } else {
      answers.set(chr, answers.has(chr) ? answers.get(chr) + 1 : 1);
    }
    lastChr = chr;
  }
  yield answers;
}

let allSum = 0;
for(const answerSet of computeAllAnswerSet(input)){
  allSum += answerSet.size;
}
console.log("Part 2", allSum);


