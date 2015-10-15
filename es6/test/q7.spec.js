import {assert} from 'chai';
import {Board} from '../target/nurikabe.js';
import {TESTCASES, ANSWERS} from  '../target/testcases.js';

describe("Q7 - solve", () => {

  TESTCASES.forEach((v, index) => {
    it("teestcase " + (index + 1), () => {
      var t = new Date().getTime();
      var board = new Board(v);
      var result = board.solve();
      assert(result.isSolved());

      var s1 = board.toString().replace(/\+/g, " ").split("\n").filter(v => v.length).join("\n");
      var s2 = ANSWERS[index].replace(/\+/g, " ").split("\n").filter(v => v.length).join("\n");
      assert.equal(s1, s2);
      console.log("testcase " + (index + 1) + ": " + (new Date().getTime() - t) + "ms");
    });
  });
});