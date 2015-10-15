import {assert} from 'chai';
import {Board} from '../target/nurikabe.js';
import {TESTCASES, ANSWERS} from  '../target/testcases.js';

describe("Q5 - isSolved - problems", () => {

  TESTCASES.forEach((v, index) => {
    it("teestcase problem " + (index + 1), () => {
      var board = new Board(v);
      assert.notOk(board.isSolved());
    });
  });
});

describe("Q5 - isSolved - answers", () => {

  ANSWERS.forEach((v, index) => {
    it("teestcase answer " + (index + 1), () => {
      var board = new Board(v);
      assert.ok(board.isSolved());
    });
  });
});

describe("Q5 - isSolved - on the way", () => {

  it("1 space", () => {
    var str = "8,+,+,x,3,+,x\n" +
              "x,x,+,x,x,+,x\n" +
              "4,x,+,+,x,x,x\n" +
              "+,x,x,+,+,x,2\n" +
              "+,+,x,x,x,x,+\n" +
              "x,x,1,x,4,x, \n" +
              "1,x,x,x,+,+,+\n";
    var board = new Board(str);
    assert.notOk(board.isSolved());
  });

  it("Some walls", () => {
    var str = "4,x,1,x,1,x,1\n" + 
              " , ,x, ,x, ,x\n" + 
              " ,x,1,x,2, ,x\n" + 
              " , ,x,5, ,x,1\n" + 
              " , , , , ,2,x\n" + 
              "2, , , , , ,x\n" + 
              " , , , , ,x,x\n";
    var board = new Board(str);
    assert.notOk(board.isSolved());
  });

});

describe("Q5 - isSolved - invalid", () => {

  it("has square walls", () => {
    var str = "8,+,+,x,3,+,x\n" +
              "x,x,+,x,x,+,x\n" +
              "4,x,+,x,x,x,x\n" +
              "+,x,x,+,+,x,2\n" +
              "+,+,x,x,x,x,+\n" +
              "x,x,1,x,4,x,x\n" +
              "1,x,x,x,+,+,+\n";
    var board = new Board(str);
    assert.notOk(board.isSolved());
  });

  it("Has separate walls", () => {
    var str = "8,+,+,x,3,+,x\n" +
              "x,x,+,x,x,+,x\n" +
              "4,x,+,+,x,x,x\n" +
              "+,x,x,+,+,x,2\n" +
              "+,+,x,x,x,x,+\n" +
              "x,x,1,x,4,x,x\n" +
              "1,x,x,+,+,+,x\n";
    var board = new Board(str);
    assert.notOk(board.isSolved());
  });

  it("Has more spaces", () => {
    var str = "8,+,+,x,3,+,+\n" +
              "x,x,+,x,x,+,x\n" +
              "4,x,+,+,x,x,x\n" +
              "+,x,x,+,+,x,2\n" +
              "+,+,x,x,x,x,+\n" +
              "x,x,1,x,4,x,x\n" +
              "1,x,x,x,+,+,+\n";
    var board = new Board(str);
    assert.notOk(board.isSolved());
  });

});
