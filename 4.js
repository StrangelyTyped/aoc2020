const assert = require("assert");
const fs = require("fs");
const input = fs.readFileSync("./4.txt", {encoding:"utf8"}).trim();

const testInput = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`;

const fieldValidation = new Map();
fieldValidation.set("byr", i => i.length === 4 && parseInt(i) >= 1920 && parseInt(i) <= 2002);
fieldValidation.set("iyr", i => i.length === 4 && parseInt(i) >= 2010 && parseInt(i) <= 2020);
fieldValidation.set("eyr", i => i.length === 4 && parseInt(i) >= 2020 && parseInt(i) <= 2030);
fieldValidation.set("hgt", i => {
  if(i.length < 2) return false;
  const x = parseInt(i);
  const y = i.substr(i.length - 2);
  if(y === "cm"){
    return x >= 150 && x <= 193;
  }
  if(y === "in"){
    return x >= 59 && x <= 76;
  }
  return false;
});
fieldValidation.set("hcl", i => /#[a-f0-9]{6}/.test(i));
fieldValidation.set("ecl", i => ["amb","blu","brn","gry","grn","hzl","oth"].includes(i));
fieldValidation.set("pid", i => i.length === 9 && parseInt(i) >= 0);
fieldValidation.set("cid", i => true);
const fields = Array.from(fieldValidation.keys());
const optionalFields = ["cid"];

function* lex(input){
  let buffer = "";
  let pendingLabel;
  let obj = new Map();
  let state = 0;
  for(const chr of input){
    if(state === 0){
      // State 0 - begin token
      if(chr === "\n"){
        yield obj;
        obj = new Map();
      } else if(chr === ":"){
        state = 1;
        pendingLabel = buffer;
	buffer = "";
      } else {
        buffer += chr;
      }
    } else if(state === 1){
      // State 1 - token value
      if(chr === " " || chr === "\n"){
        obj.set(pendingLabel, buffer);
        buffer = "";
	state = 0;
      } else {
        buffer += chr;
      }
    }
  }
  if(buffer && state === 1){
    obj.set(pendingLabel, buffer);
  }
  yield obj;
}

function passportValid(passport, validate){
  for(const field of fields){
    if(!passport.has(field)){
      if(!optionalFields.includes(field)){
        return false;
      }
    } else {
      const fieldValue = passport.get(field)
      if(validate && !fieldValidation.get(field)(fieldValue)){
        return false;
      }
    }
  }
  return true;
}

function checkPassports(input, validate = false){
  let valid = 0;
  for(const passport of lex(input)){
    if(passportValid(passport, validate)){
      valid++;
    }
  }
  return valid;
}

assert.equal(checkPassports(testInput), 2);
console.log("Part 1", checkPassports(input));


console.log("Part 2", checkPassports(input, true));

