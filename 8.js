const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./8.txt", {encoding:"utf8"}).trim();

const testInput = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`.trim();

function parseAsm(input){
  const asm = [];
  let state = 0;
  let instBuf = "";
  let ofsBuf = 0;
  let sign = 1;
  for(const chr of input){
    if(state === 0){
      if(chr === " "){
        state = 1;
      } else {
        instBuf += chr;
      }
    } else if(state === 1){
      if(chr === "+"){
        sign = 1;
        state = 2;
      } else if(chr === "-"){
        sign = -1;
        state = 2;
      }
    } else if(state === 2){
      if(chr === "\n"){
        asm.push([instBuf, ofsBuf * sign]);
        ofsBuf = 0;
        instBuf = "";
        state = 0;
      } else {
        ofsBuf *= 10;
        ofsBuf += parseInt(chr);
      }
    }
  }
  asm.push([instBuf, ofsBuf * sign]);
  return asm;
}

function* asmEngine(asm){
  const state = {
    acc: 0,
    ip: 0,
  };

  while(state.ip < asm.length){
    const [inst, arg] = asm[state.ip];
    if(inst === "acc"){
      state.acc += arg;
      state.ip++;
    }else if(inst === "nop"){
      state.ip++;
    }else if(inst === "jmp"){
      state.ip += arg;
    }else{
      throw new Error("Unknown instruction " + inst);
    }
    yield state;
  }
  return state;
}

function partOne(asm){
  let visitedInstructions = new Set();
  const engine = asmEngine(asm);
  let state;
  do {
    if(state){
      visitedInstructions.add(state.ip);
    }
    const it = engine.next();
    if(it.done){
      return {state, done: true};
    }
    state = it.value;
  }while(!visitedInstructions.has(state.ip));
  return {state, done: false};
}
assert.equal(partOne(parseAsm(testInput)).state.acc, 5);
console.log("Part 1", partOne(parseAsm(input)).state.acc);

function partTwo(asm){
  for(let i = 0; i < asm.length; i++){
    if(asm[i][0] !== "jmp" && asm[i][0] !== "nop"){
      continue;
    }
    const asm2 = [...asm];
    asm2[i] = [asm2[i][0] === "jmp" ? "nop" : "jmp", asm2[i][1]];
    const res = partOne(asm2);
    if(res.done){
      return res.state;
    }
  }
}

assert.equal(partTwo(parseAsm(testInput)).acc, 8);
console.log("Part 2", partTwo(parseAsm(input)).acc);
