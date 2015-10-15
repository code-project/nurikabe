import {assert} from 'chai';
import {Board} from '../target/nurikabe.js';
import {TESTCASES, ANSWERS} from  '../target/testcases.js';

describe("Q2 - getCell", () => {
  const case1 = "1, ,1, ,1\n" + 
                " , , , , \n" + 
                " ,3, , , \n" + 
                " , , , , \n" + 
                "2, ,1, ,1\n";

  const case2 = "x,x,x,x,x\n" +
                "x,+,+,x,+\n" +
                "1,x,3,x,2\n" +
                "x,x,x,x,x\n" +
                "+,2,x,1,x\n";

  it ("number field", () => {
    var board = new Board(case1);
    var cell = board.getCell(0, 0);
    assert.ok(cell);
    assert.ok(cell.isNumber());
  });

  it ("space field", () => {
    var board = new Board(case1);
    var cell = board.getCell(1, 1);
    assert.ok(cell);
    assert.ok(cell.isSpace());
  });

  it ("space field", () => {
    var board = new Board(case2);
    var cell = board.getCell(4, 4);
    assert.ok(cell);
    assert.ok(cell.isWall());
  });
  
});

