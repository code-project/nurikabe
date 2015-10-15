import {assert} from 'chai';
import {Board} from '../target/nurikabe.js';
import {TESTCASES} from  '../target/testcases.js';

function getCellCount(str) {
  return str.split(/[,\n]/).filter(v => v).length;
}
function getAnswerCount(str) {
  var cells = str.split(/[,\n]/).filter(v => v);
  return cells.map(v => parseInt(v)).filter(v => !isNaN(v)).reduce((a, b) => a + b);
}

describe("Q3 - answerSpaceCount/answerWallCount", () => {

  TESTCASES.forEach((v, index) => {
    it("teestcase " + (index + 1), () => {
      var cellCount = getCellCount(v);
      var answerCount = getAnswerCount(v);
      var board = new Board(v);
      assert.equal(board.answerSpaceCount(), answerCount);
      assert.equal(board.answerWallCount(), cellCount - answerCount);
    });
  });
});

