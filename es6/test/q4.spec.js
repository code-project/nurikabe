import {assert} from 'chai';
import {Board} from '../target/nurikabe.js';
import {TESTCASES, ANSWERS} from  '../target/testcases.js';

describe("Q4 - hasSquareWalls - problems", () => {

  TESTCASES.forEach((v, index) => {
    it("teestcase problem " + (index + 1), () => {
      var board = new Board(v);
      assert.notOk(board.hasSquareWalls());
    });
  });
});

describe("Q4 - hasSquareWalls - answers", () => {

  ANSWERS.forEach((v, index) => {
    it("teestcase answer " + (index + 1), () => {
      var board = new Board(v);
      assert.notOk(board.hasSquareWalls());
    });
  });
});

describe("Q4 - hasSquareWalls - invalid case", () => {

  it("TopLeft", () => {
    var str = "x,x, , ,3, , , , , ,6, ,2, ,2\n" + 
              "x,x, , , , , , , , , , , , , \n" + 
              " , , , , ,3, , , ,3, ,1, , , \n" + 
              "2, ,3, , , ,3, , , ,1, ,2, ,3\n" + 
              " , , , , , , , , , , , , , , \n" + 
              " , , , , , , , ,1, ,4, , , , \n" + 
              " , ,2, , ,2, ,2, , , , ,4, , \n" + 
              " , , ,1, , , , , , , , , , ,3\n" + 
              " , ,2, , ,2, , , , , , , , , \n" + 
              " , , , , , , ,5, , ,2, , , , \n" + 
              " , , , , ,7, , , , , , ,1, ,1\n" + 
              " , , , , , , , , , , ,4, , , \n" + 
              " , , , ,2, , ,4, , , , , , ,3\n" + 
              " , , , , , , , ,1, , , , , , \n" + 
              "1, , ,2, , , , , , , , , , ,3\n";
    var board = new Board(str);
    assert.ok(board.hasSquareWalls());
  });

  it("TopRight", () => {
    var str = " , , , ,3, , , , , ,6, ,2,x,x\n" + 
              " ,1, , , , , , , , , , , ,x,x\n" + 
              " , , , , ,3, , , ,3, ,1, , , \n" + 
              "2, ,3, , , ,3, , , ,1, ,2, ,3\n" + 
              " , , , , , , , , , , , , , , \n" + 
              " , , , , , , , ,1, ,4, , , , \n" + 
              " , ,2, , ,2, ,2, , , , ,4, , \n" + 
              " , , ,1, , , , , , , , , , ,3\n" + 
              " , ,2, , ,2, , , , , , , , , \n" + 
              " , , , , , , ,5, , ,2, , , , \n" + 
              " , , , , ,7, , , , , , ,1, ,1\n" + 
              " , , , , , , , , , , ,4, , , \n" + 
              " , , , ,2, , ,4, , , , , , ,3\n" + 
              " , , , , , , , ,1, , , , , , \n" + 
              "1, , ,2, , , , , , , , , , ,3\n";
    var board = new Board(str);
    assert.ok(board.hasSquareWalls());
  });

  it("BottomLeft", () => {
    var str = " , , , ,3, , , , , ,6, ,2, ,2\n" + 
              " ,1, , , , , , , , , , , , , \n" + 
              " , , , , ,3, , , ,3, ,1, , , \n" + 
              "2, ,3, , , ,3, , , ,1, ,2, ,3\n" + 
              " , , , , , , , , , , , , , , \n" + 
              " , , , , , , , ,1, ,4, , , , \n" + 
              " , ,2, , ,2, ,2, , , , ,4, , \n" + 
              " , , ,1, , , , , , , , , , ,3\n" + 
              " , ,2, , ,2, , , , , , , , , \n" + 
              " , , , , , , ,5, , ,2, , , , \n" + 
              " , , , , ,7, , , , , , ,1, ,1\n" + 
              " , , , , , , , , , , ,4, , , \n" + 
              " , , , ,2, , ,4, , , , , , ,3\n" + 
              "x,x, , , , , , ,1, , , , , , \n" + 
              "x,x, ,2, , , , , , , , , , ,3\n";
    var board = new Board(str);
    assert.ok(board.hasSquareWalls());
  });

  it("BottomRight", () => {
    var str = " , , , ,3, , , , , ,6, ,2, ,2\n" + 
              " ,1, , , , , , , , , , , , , \n" + 
              " , , , , ,3, , , ,3, ,1, , , \n" + 
              "2, ,3, , , ,3, , , ,1, ,2, ,3\n" + 
              " , , , , , , , , , , , , , , \n" + 
              " , , , , , , , ,1, ,4, , , , \n" + 
              " , ,2, , ,2, ,2, , , , ,4, , \n" + 
              " , , ,1, , , , , , , , , , ,3\n" + 
              " , ,2, , ,2, , , , , , , , , \n" + 
              " , , , , , , ,5, , ,2, , , , \n" + 
              " , , , , ,7, , , , , , ,1, ,1\n" + 
              " , , , , , , , , , , ,4, , , \n" + 
              " , , , ,2, , ,4, , , , , , ,3\n" + 
              " , , , , , , , ,1, , , , ,x,x\n" + 
              "1, , ,2, , , , , , , , , ,x,x\n";
    var board = new Board(str);
    assert.ok(board.hasSquareWalls());
  });

  it("Center", () => {
    var str = " , , , ,3, , , , , ,6, ,2, ,2\n" + 
              " ,1, , , , , , , , , , , , , \n" + 
              " , , , , ,3, , , ,3, ,1, , , \n" + 
              "2, ,3, , , ,3, , , ,1, ,2, ,3\n" + 
              " , , , , , , , , , , , , , , \n" + 
              " , , , , , , , ,1, ,4, , , , \n" + 
              " , ,2, , ,2, ,2, , , , ,4, , \n" + 
              " , , ,1, , , ,x,x, , , , , ,3\n" + 
              " , ,2, , ,2, ,x,x, , , , , , \n" + 
              " , , , , , , ,5, , ,2, , , , \n" + 
              " , , , , ,7, , , , , , ,1, ,1\n" + 
              " , , , , , , , , , , ,4, , , \n" + 
              " , , , ,2, , ,4, , , , , , ,3\n" + 
              " , , , , , , , ,1, , , , , , \n" + 
              "1, , ,2, , , , , , , , , , ,3\n";
    var board = new Board(str);
    assert.ok(board.hasSquareWalls());
  });


});
