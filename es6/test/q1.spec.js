import {assert} from 'chai';
import {Board} from '../target/nurikabe.js';
import {TESTCASES, ANSWERS} from  '../target/testcases.js';

describe("Q1 - isValidStr - problems", () => {

  TESTCASES.forEach((v, index) => {
    it("teestcase problem " + (index + 1), () => {
      assert(Board.isValidStr(v));
    });
  });
});

describe("Q1 - isValidStr - answers", () => {

  ANSWERS.forEach((v, index) => {
    it("teestcase answer " + (index + 1), () => {
      assert(Board.isValidStr(v));
    });
  });
});

describe("Q1 - isValidStr - invalid case", () => {

  it("1 line is not valid", () => {
    var str = "1, ,1, ,1\n";
    assert.notOk(Board.isValidStr(str));
  });

  it("1 column is not valid", () => {
    var str = "1\n" + 
              " \n" + 
              " \n" + 
              " \n" + 
              "2\n";
    assert.notOk(Board.isValidStr(str));
  });

  it("Has invalid str is not valid", () => {
    var str = "1,s,1, ,1\n" + 
              " , , , , \n" + 
              " ,3, , , \n" + 
              " , , , , \n" + 
              "2, ,1, ,1\n";
    assert.notOk(Board.isValidStr(str));
  });

  it("Different field count  is not valid", () => {
    var str = "1,s,1, ,1\n" + 
              " , , , , \n" + 
              " ,3, , , , \n" + 
              " , , , , \n" + 
              "2, ,1, ,1\n";
    assert.notOk(Board.isValidStr(str));
  });

});
