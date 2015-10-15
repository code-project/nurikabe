class CellKind {
  constructor() {}

  static get number() { return 1;}
  static get wall() { return 2;}
  static get space() { return 3;}
}

class Cell {
  constructor(kind, x, y) {
    this.kind = kind;
    this.x = x;
    this.y = y;
  }

  isNumber() { return this.kind === CellKind.number;}
  isWall() { return this.kind === CellKind.wall;}
  isSpace() { return this.kind === CellKind.space;}

  //BEGIN_CHALLENGE
  isFixed() { throw "Need override";}
  clone() { throw "Need override";}
  toString() { throw "Need override";}
  //END_CHALLENGE
}


//BEGIN_CHALLENGE
class NumberCell extends Cell {
  constructor(x, y, n) {
    super(CellKind.number, x, y)
    this.number = n;
    this.children = [this];
    this._islands = null;
    this.solveFixed = false;
  }

  childCount() { return this.children.length;}
  isFixed() { return this.childCount() === this.number;}
  remains() { return this.number - this.childCount();}

  getIslands() {
    if (this._islands) {
      return this._islands;
    }
    var ret = partitions(this, this.children);
    ret.shift();//Remove first;
    return ret;
  }

  hasIslands() {
    return this.getIslands().length > 0;
  }

  addChild(cell) {
    this.children.push(cell);
    cell.owner = this;
    this._islands = null;
  }

  isIslandChild(cell) {
    if (cell.owner !== this) {
      return false;
    }
    var islands = this.getIslands();
    if (islands.length === 1) {
      return false;
    }
    for (let i=1; i<islands.length; i++) {
      if (islands[i].indexOf(cell) !== -1) {
        return true;
      }
    }
    return false;
  }

  toString() { return this.number.toString();}

  clone() {
    return new NumberCell(this.x, this.y, this.number);
  }
}

class Wall extends Cell {
  constructor(x, y) {
    super(CellKind.wall, x, y);
  }
  isFixed() { return true;}

  toString() { return "x";}

  clone() {
    return new Wall(this.x, this.y);
  }
}

class Space extends Cell {
  constructor(x, y) {
    super(CellKind.space, x, y);
    this.reachable = null;
    this.owner = null;
    this.notWall = false;
    this.notNumber = [];
  }
  isFixed() { return !!this.owner;}

  notAllowed(number) {
    return this.notNumber.indexOf(number) !== -1;
  }

  toString() { return this.isFixed() ? "+" : " ";}

  clone() {
    var ret = new Space(this.x, this.y);
    ret.notWall = this.notWall;
    return ret;
  }
}
//END_CHALLENGE

//BEGIN_CHALLENGE
/*
//END_CHALLENGE
export class Board {
  static isValidStr(str) {
    //ToDo
    return false;
  }

  constructor(str) {
    //ToDo
    this.str = str;
  }

  getCell(x, y) {
    //ToDo
    return null;
  }

  answerSpaceCount() {
    //ToDo
    return 0;
  }

  answerWallCount() {
    //ToDo
    return 0;
  }

  hasSquareWalls() {
    //ToDo
    return false;
  }

  isSolved() {
    //ToDo
    return false;
  }

  isInvalid() {
    //ToDo
    return true;
  }

  solve() {
    //ToDo
    return this;
  }

  toString() {
    //ToDo
    return this.str;
  }
}
//BEGIN_CHALLENGE
*/
//END_CHALLENGE

//BEGIN_CHALLENGE
export class Board {
  static buildCells(str) {
    if (!str) {
      return null;
    }
    let lines = str.split("\n").filter((v) =>{ return v;});
    if (lines.length <= 1) {
      return null;
    }
    let fieldCount = lines[0].split(",").length;
    if (fieldCount <= 1) {
      return null;
    }
    let cells = [];
    for (let y=0; y<lines.length; y++) {
      let fields = lines[y].split(",");
      if (fields.length !== fieldCount) {
        return null;
      }
      let row = [];
      for (let x=0; x<fields.length; x++) {
        let s = fields[x].trim();
        let cell = null;
        switch (s) {
          case "": 
            cell = new Space(x, y);
            break;
          case "+": 
            cell = new Space(x, y);
            break;
          case "x":
            cell = new Wall(x, y);
            break;
          default:
            let n = parseInt(s);
            if (n.toString() === s) {
              cell = new NumberCell(x, y, n);
            }
            break;
        }
        if (!cell) {
          return null;
        }
        row.push(cell);
      }
      cells.push(row);
    }
    return cells;
  }

  static isValidStr(str) {
    return Board.buildCells(str) !== null;
  }

  constructor(str) {
    this.cells = Board.buildCells(str);
    this.backtracks = [
      BacktrackIslands,
      BacktrackIfWall,
      BacktrackIfNumber,
      BacktrackIfNumber2,
      BacktrackOneRoute
    ];
  }

  height() {
    return this.getCells().length;
  }

  width() {
    return this.getCells()[0].length;
  }

  answerSpaceCount() {
    if (this._answerSpaceCount) {
      return this._answerSpaceCount;
    }
    var ret = this.array(v => v.isNumber()).reduce((ret, v) => ret + v.number, 0);
    this._answerSpaceCount = ret;
    return ret;
  }

  answerWallCount() {
    return this.height() * this.width() - this.answerSpaceCount();
  }

  getCells() {
    return this.cells;
  }

  getCell(x, y) {
    return this.getCells()[y][x];
  }


  hasSquareWalls() {
    var self = this;
    return self.array(v => v.isWall()).some(v => {
      var right = self.right(v);
      var lower = self.lower(v);
      var lowerRight = self.lowerRight(v);
      return right && lower && lowerRight && right.isWall() && lower.isWall() && lowerRight.isWall();
    });
  }

  isInvalid() {
    function hasIsoratedWall() {
      var walls = self.wallBlocks();
      if (walls.length === 1) {
        return false;
      }
      return walls.some(array => {
        return self.wallExpandable(array[0]).length === 0;
      });
    }
    function hasConnectedIsland() {
      function isOthers(cell, number) {
        if (cell.isNumber()) return cell !== number;;
        if (cell.isSpace()) return cell.owner && cell.owner !== number;
        return false;
      }
      return self.array(v => v.isNumber()).some(number => {
        return number.children.some(v => {
          return self.surround(v, (v2) => isOthers(v2, number)).length > 0;
        });
      });
    }
    function hasShortageIsland() {
      return self.array(v => v.isNumber()).some(cell => {
        var reachable = self.reachable(cell);
        return cell.childCount() + reachable.length < cell.number;
      });
    }
    var self = this;
    return this.hasSquareWalls() || hasIsoratedWall() || hasConnectedIsland() || hasShortageIsland()
  }

  isSolved() {
    if (this.isInvalid()) {
      return false;
    }
    var numbers = this.array(v => v.isNumber());
    var spaces = this.array(v => v.isSpace());

    if (numbers.length + spaces.length !== this.answerSpaceCount()) {
      return false;
    }
    if (this.wallBlocks().length !== 1) {
      return false;
    }
    return !numbers.some(v => !v.isFixed() || v.hasIslands());
  }

  isNext(a, b) {
    if (a.x === b.x) {
      return Math.abs(a.y - b.y) === 1;
    } else if (a.y === b.y) {
      return Math.abs(a.x - b.x) === 1;
    }
    return false;
  }

  isCornerConnected(a, b) {
    let xMax = a.x > b.x ? a.x : b.x;
    let xMin = a.x < b.x ? a.x : b.x;
    let yMax = a.y > b.y ? a.y : b.y;
    let yMin = a.y < b.y ? a.y : b.y;

    return xMax - xMin === 1 && yMax - yMin === 1;
  }

  wallBlocks() {
    var walls = this.array(v => v.isWall());
    return partitions(walls.shift(), walls);
  }

  clone() {
    var board = new Board();
    var cells = this.getCells();
    var cloneCells = [];
    for (let y=0; y<cells.length; y++) {
      var row = cells[y];
      var cloneRow = [];
      for (let x=0; x<row.length; x++) {
        cloneRow.push(row[x].clone());
      }
      cloneCells.push(cloneRow);
    }
    board.cells = cloneCells;

    this.array(v => v.isSpace()).forEach(origin => {
      var cell = board.getCell(origin.x, origin.y);
      if (origin.owner) {
        var number = board.getCell(origin.owner.x, origin.owner.y);
        board.toNumber(cell, number);
      }
      if (origin.reachable) {
        let reachable = [];
        for (let i=0; i<origin.reachable.length; i++) {
          reachable.push(board.getCell(origin.reachable[i].x, origin.reachable[i].y));
        }
        cell.reachable = reachable;
      }
    });
    board.reset();
    return board;
  }

  toString() {
    return this.getCells().map((row) => {
      return row.map(v => v.toString()).join(",");
    }).join("\n");
  }

  upper(cell) {
    if (!cell) return null;
    return cell.y > 0 ? this.getCells()[cell.y - 1][cell.x] : null;
  }

  lower(cell) {
    if (!cell) return null;
    return cell.y + 1 < this.height() ? this.getCells()[cell.y + 1][cell.x] : null;
  }

  left(cell) {
    if (!cell) return null;
    return cell.x > 0 ? this.getCells()[cell.y][cell.x - 1] : null;
  }

  right(cell) {
    if (!cell) return null;
    return cell.x + 1 < this.width() ? this.getCells()[cell.y][cell.x + 1] : null;
  }

  upperLeft(cell) {
    return this.upper(this.left(cell));
  }

  upperRight(cell) {
    return this.upper(this.right(cell));
  }

  lowerLeft(cell) {
    return this.lower(this.left(cell));
  }

  lowerRight(cell) {
    return this.lower(this.right(cell));
  }

  toWall(oldCell) {
    if (oldCell && oldCell.isSpace() && !oldCell.isFixed()) {
      this.getCells()[oldCell.y][oldCell.x] = new Wall(oldCell.x, oldCell.y);
      this.changed = true;
    }
  }

  toNumber(target, number) {
    number.addChild(target);
    this.changed = true;
  }

  reset() {
    this.changed = false;
  }

  wallExpandable(wall, walls, ret) {
    var self = this;
    if (!walls) {
      walls = [];
    }
    if (!ret) {
      ret = [];
    }
    if (!wall) {
      return ret;
    }
    if (this.array(v => v.isWall()).length >= this.answerWallCount()) {
      return ret;      
    }
    walls.push(wall);
    var surround = this.surround(wall);
    surround.filter(v => {
      return v.isSpace() && !v.isFixed() && !v.notWall && !ret.find(v2 => v === v2);
    }).forEach(v => ret.push(v));
    surround.filter(v => {
      return v.isWall() && !walls.find(v2 => v === v2);
    }).forEach(v => self.wallExpandable(v, walls, ret));
    return ret;
  }

  numberExpandable(number, target, processed, ret) {
    var self = this;
    if (!target) {
      target = number;
      processed = [];
      ret = [];
    }
    if (!number || number.isFixed()) {
      return ret;
    }
    if (processed.indexOf(target) !== -1) {
      return ret;
    }
    processed.push(target);

    var surround = this.surround(target);
    surround.filter(v => {
      return v.isSpace() && !v.isFixed() && !v.notAllowed(number) && !ret.find(v2 => v === v2);
    }).forEach(v => ret.push(v));
    surround.filter(v => {
      return v.owner && v.owner === number;
    }).forEach(v => self.numberExpandable(number, v, processed, ret));
    return ret;
  }

  reachable(number, target, rest, ret) {
    function reachableSpace(v) {
      if (!v.isSpace() || (v.owner && v.owner !== number) || v.notAllowed(number)) {
        return false;
      }
      let surround = self.surround(v);
      return !surround.some(v2 => {
        if (v2.isNumber()) {
          return number !== v2;
        }
        return v2.isSpace() && v2.owner && number !== v2.owner;
      });
    }
    function doReachable(target, rest, ret) {
      if (target.isNumber() || (target.owner === number && !number.isIslandChild(target))) {
        rest = number.remains();
      }

      if (number !== target) {
        if (ret.has(target) && ret.get(target) >= rest) {
          return ret;
        }
        ret.set(target, rest);
      }
      if (rest === 0) {
        return ret;
      }
      self.surround(target).filter(v => reachableSpace(v)).forEach(
        v => doReachable(v, rest - 1, ret)
      );
      return ret;
    }
    var self = this;
    return Array.from(doReachable(number, number.remains(), new Map()).keys()).filter(v => !v.isFixed());
  }

  surround(cell, filter) {
    var ret = [];
    ret.push(this.upper(cell));
    ret.push(this.lower(cell));
    ret.push(this.left(cell));
    ret.push(this.right(cell));
    return ret.filter(v => {
      if (!v) {
        return false;
      }
      if (filter) {
        return filter(v);
      }
      return true;
    });
  }

  isBlocked(cell) {
    function isWall(v) {
      return v && v.isWall();
    }
    let upper = this.upper(cell);
    let lower = this.lower(cell);
    let left  = this.left(cell);
    let right = this.right(cell);

    if (isWall(upper) && isWall(left) && isWall(this.upperLeft(cell))) return true;
    if (isWall(upper) && isWall(right) && isWall(this.upperRight(cell))) return true;
    if (isWall(lower) && isWall(left) && isWall(this.lowerLeft(cell))) return true;
    if (isWall(lower) && isWall(right) && isWall(this.lowerRight(cell))) return true;

    return false;
  }

  array(filter) {
    var cells = this.getCells();
    var ret = [];
    for (let y=0; y<cells.length; y++) {
      ret = ret.concat(cells[y]);
    }
    if (filter) {
      ret = ret.filter(filter);
    }
    return ret;
  }

  solveSkip() {
    function isOwnerDifferent(owner, target) {
      if (!target) {
        return false;
      }
      if (target.isNumber()) {
        return target !== owner;
      }
      if (target.isSpace() && target.owner) {
        return target.owner !== owner;
      }
      return false;
    }
    var self = this;
    this.array(cell => cell.isNumber() || (cell.isSpace() && cell.isFixed())).forEach(cell => {
      let owner = cell.isNumber() ? cell : cell.owner;
      let ur = self.upperRight(cell);
      if (isOwnerDifferent(owner, ur)) {
        self.toWall(self.upper(cell));
        self.toWall(self.right(cell));
      }
      let rr = self.right(self.right(cell));
      if (isOwnerDifferent(owner, rr)) {
        self.toWall(self.right(cell));
      }
      let lr = self.lowerRight(cell);
      if (isOwnerDifferent(owner, lr)) {
        self.toWall(self.right(cell));
        self.toWall(self.lower(cell));
      }
      let ll = self.lower(self.lower(cell));
      if (isOwnerDifferent(owner, ll)) {
        self.toWall(self.lower(cell));
      }
    });
  }

  solveWallExpandable() {
    var self = this;
    this.wallBlocks().forEach(walls => {
      let expandable = self.wallExpandable(walls[0]);
      if (expandable.length === 1) {
        self.toWall(expandable[0]);
      }
    });
  }

  solveNumberExpandable() {
    var self = this;
    this.array(cell => cell.isNumber() && !cell.isFixed()).forEach(cell => {
      let expandable = self.numberExpandable(cell);
      if (expandable.length === 1) {
        self.toNumber(expandable[0], cell);
      } else if (expandable.length == 2 && self.isCornerConnected(expandable[0], expandable[1])) {
        let a = expandable[0];
        let b = expandable[1];

        let c = self.getCell(a.x, b.y);
        let d = self.getCell(b.x, a.y);

        let target = c === cell || c.owner === cell ? d : c;
        if (cell.remains() === 1 || self.surround(target, v => (v.isNumber() && v !== cell) || (v.isSpace() && v.owner && v.owner !== cell)).length > 0) {
          self.toWall(target);          
        }
      }
    });
  }

  solveNumberFixed() {
    var self = this;
    this.array(cell => cell.isNumber() && cell.isFixed() && !cell.solveFixed).forEach(cell => {
      cell.children.forEach(v => {
        self.surround(v, v2 => {
          return v2.isSpace() && !v2.isFixed();
        }).forEach(v3 => self.toWall(v3));
      });
      cell.solveFixed = true;
    });
  }

  solveReachable() {
    var self = this;
    var reachable = new Reachable();
    this.array(cell => cell.isNumber() && !cell.isFixed()).forEach(cell => {
      let items = self.reachable(cell);
      if (items.length === cell.remains()) {
        items.forEach(v => self.toNumber(v, cell));
      } else {
         reachable.add(cell, items);
      }
    });
    this.array(cell => cell.isSpace() && !cell.isFixed()).forEach(cell => {
      let numbers = reachable.reachable(cell);
      if (numbers.length === 0) {
        self.toWall(cell);
      } else if (numbers.length === 1 && (cell.notWall || reachable.get(numbers[0]).length === 1 || self.isBlocked(cell))) {
        self.toNumber(cell, numbers[0]);
      } else {
        cell.reachable = numbers;
      }
    });
  }

  solveIslands() {
    var self = this;
    this.array(cell => cell.isNumber() && cell.hasIslands()).forEach(cell => {
      cell.getIslands().map(array => self.numberExpandable(cell, array[0], [], [])).forEach(array => {
        if (array.length === 1) {
          self.toNumber(array[0], cell);
        }
      });
    });
  }

  solve(backtrackCount) {
    var self = this;
    var funcs = [
      this.solveNumberFixed,
      this.solveSkip,
      this.solveWallExpandable,
      this.solveNumberExpandable,
      this.solveReachable,
      this.solveIslands
    ];
    if (typeof(backtrackCount) === "undefined") {
      backtrackCount = 1;
    }
    var cells = this.getCells();
    do {
      this.reset();
      funcs.forEach(f => {
        var t = new Date().getTime();
        f.call(self);
      });
    } while (this.changed);
    if (backtrackCount === 0 || this.isSolved() || this.isInvalid()) {
      return this;
    }
    var result = this.backtrack(backtrackCount - 1);
    if (!result) {
      return this;
    }
    this.cells = result.cells;
    if (result.isSolved()) {
      return this;
    }
    return this.solve(backtrackCount);
  }

  backtrack(backtrackCount) {
    var len = this.backtracks.length;
    for (let i=0; i<len; i++) {
      let Clazz = this.backtracks.shift();
      this.backtracks.push(Clazz);

      let t = new Date().getTime();
      let backtrack = new Clazz(this, backtrackCount);
      let result = backtrack.solve();
      if (result) {
        return result;
      }
    }
  }
}

class Reachable {
  constructor() {
    this.map = new Map();
  }

  add(number, items) {
    this.map.set(number, items);
  }

  get(number) {
    return this.map.get(number);
  }

  count(cell) {
    return this.reachable(cell).length;
  }

  reachable(cell) {
    var self = this;
    var ret = [];
    Array.from(this.map.keys()).forEach(key => {
      let items = self.map.get(key);
      if (items.indexOf(cell) !== -1) {
        ret.push(key)
      }
    });
    return ret;
  }
}

class Backtrack {
  constructor(board, backtrackCount) {
    this.board = board.clone();
    this.backtrackCount = backtrackCount;
    this.changed = false;
  }

  spaces() { return this.board.array(v => v.isSpace() && !v.isFixed())}
  doSolve(target) { return null;}

  solve() {
    var spaces = this.spaces();
    while (spaces.length > 0) {
      var target = spaces.shift();
      var result = this.doSolve(target);
      if (result) {
        return result;
      }
    }
    return this.changed ? this.board : null;
  }
}

class BacktrackIfWall extends Backtrack {
  constructor(board, backtrackCount) {
    super(board, backtrackCount);
  }

  spaces() { 
    var board = this.board;
    return super.spaces().filter(v => !v.notWall).filter(v => {
      var spaces = board.surround(v, v => v.isSpace());
      return spaces.length < 3;
    }).sort((a, b) =>{
      var asl = board.surround(a, v => v.isSpace()).length;
      var bsl = board.surround(b, v => v.isSpace()).length;
      var arl = a.reachable.length;
      var brl = b.reachable.length;

      if (asl === 1 && bsl === 1) {
        return arl <= brl ? -1 : 1;
      }
      if (asl === 1 || bsl === 1) {
        return asl === 1 ? -1 : 1;
      }
      if (arl === brl) {
        return asl <= bsl ? -1 : 1;
      }
      return arl < brl ? -1 : 1;
    });
  }

  doSolve(target) {
    var board = this.board;
    var newBoard = board.clone();
    newBoard.toWall(newBoard.getCell(target.x, target.y));
    newBoard.solve(this.backtrackCount);
    if (newBoard.isSolved()) {
      return newBoard;
    }
    if (newBoard.isInvalid()) {
      if (target.reachable.length === 1) {
        board.toNumber(target, target.reachable[0]);
        return board;
      } else {
        target.notWall = true;
        this.changed = true;
      }
    }
    return null; 
  }
}

class BacktrackIslands extends Backtrack {
  constructor(board, backtrackCount) {
    super(board, backtrackCount);
  }

  spaces() { 
    var board = this.board;
    var numbers = board.array(v => v.isNumber() && v.hasIslands());
    if (numbers.length === 0) {
      return [];
    }
    return super.spaces().filter(v => v.reachable.some(v2 => numbers.indexOf(v2) !== -1));
  }

  doSolve(target) {
    var board = this.board;
    var numbers = board.array(v => v.isNumber() && v.hasIslands());
    for (let i=0; i<numbers.length; i++) {
      let number = numbers[i];
      if (target.reachable.indexOf(number) === -1) {
        continue;
      }
      let newBoard = board.clone();
      newBoard.toNumber(
        newBoard.getCell(target.x, target.y),
        newBoard.getCell(number.x, number.y)
      );
      newBoard.solve(this.backtrackCount);
      if (newBoard.isSolved()) {
        return newBoard;
      }
      if (newBoard.isInvalid()) {
        if (target.reachable.length === 1) {
          board.toWall(target);
          return board;
        } else {
          target.notNumber.push(number);
          this.changed = true;
        }
      }
    }
    return null; 
  }
}

class BacktrackIfNumber extends Backtrack {

  constructor(board, backtrackCount) {
    super(board, backtrackCount);
  }

  spaces() { 
    return super.spaces().filter(v => !v.notWall && v.reachable.length === 1);
  }

  doSolve(target) {
    var board = this.board;
    var newBoard = board.clone();
    newBoard.toNumber(
      newBoard.getCell(target.x, target.y),
      newBoard.getCell(target.reachable[0].x, target.reachable[0].y)
    );
    newBoard.solve(this.backtrackCount);
    if (newBoard.isSolved()) {
      return newBoard;
    }
    if (newBoard.isInvalid()) {
      board.toWall(target);
      return board;
    } 
    return null;
  }
}

class BacktrackIfNumber2 extends Backtrack {

  constructor(board, backtrackCount) {
    super(board, backtrackCount);
  }

  spaces() { 
    return super.spaces().filter(v => v.notWall && v.reachable.length === 2);
  }

  doSolve(target) {
    function inner(a, b) {
      var newBoard = board.clone();
      newBoard.toNumber(
        newBoard.getCell(target.x, target.y),
        newBoard.getCell(a.x, a.y)
      );
      newBoard.solve(backtrackCount);
      if (newBoard.isSolved()) {
        return newBoard;
      }
      if (newBoard.isInvalid()) {
        board.toNumber(target, b);
        return board;
      } 
      return null;
    }
    var backtrackCount = this.backtrackCount;
    var board = this.board;
    return inner(target.reachable[0], target.reachable[1]) ||
           inner(target.reachable[1], target.reachable[0]);
  }

}

class BacktrackOneRoute extends Backtrack {

  constructor(board, backtrackCount) {
    super(board, backtrackCount);
  }

  solve() {
    function isLeafWithSingleRoute(cell, reachable, remains, prev) {
      if (remains === 1) {
        return true;
      }
      var next = board.surround(cell, v => v.isSpace() && !v.isFixed() && reachable.indexOf(v) !== -1 && v !== prev);
      if (next.length !== 1) {
        return false;
      }
      return isLeafWithSingleRoute(next[0], reachable, remains - 1, cell);
    }
    function getNext(cell, reachable, prev) {
      var next = board.surround(cell, v => v.isSpace() && !v.isFixed() && reachable.indexOf(v) !== -1 && v !== prev);
      return next.length === 1 ? next[0] : null;
    }
    var board = this.board;
    var numbers = board.array(v => v.isNumber() && !v.isFixed()).sort((a, b) => a.remains() > b.remains() ? -1 : 1);
    while (numbers.length > 0) {
      let number = numbers.shift();
      let reachable = board.reachable(number);
      let spaces = reachable.filter(v => isLeafWithSingleRoute(v, reachable, number.remains(), null));
      let prev = null;
      while (spaces.length > 0) {
        let newBoard = board.clone();
        let initialTarget = spaces.shift();
        let target = initialTarget;
        while (target != null) {
          newBoard.toNumber(
            newBoard.getCell(target.x, target.y),
            newBoard.getCell(number.x, number.y)
          );
          target = getNext(target, reachable, prev);
        }
        newBoard.solve(this.backtrackCount);
        if (newBoard.isSolved()) {
          return newBoard;
        }
        if (newBoard.isInvalid()) {
          if (initialTarget.reachable.length === 1) {
            board.toWall(initialTarget);
          } else {
            initialTarget.notNumber.push(number);
          }
          return board;
        } 
      }
    }
    return null;
  }
}

function partitions(initial, remains) {
  let ret = [];
  let target = [initial];
  let island = [initial];
  remains = remains.filter(v => v !== initial);
  while (remains.length > 0) {
    let newTarget = remains.filter(v => {
      return target.some(v2 => {
        if (v2.x === v.x) {
          return v.y === v2.y - 1 || v.y === v2.y + 1;
        }
        if (v2.y === v.y) {
          return v.x === v2.x - 1 || v.x === v2.x + 1;
        }
        return false;
      });
    });
    target = newTarget;
    if (target.length === 0) {
      ret.push(island);
      target = [remains.shift()];
      island = [];
    }
    island = island.concat(target);
    remains = remains.filter(v => target.indexOf(v) === -1);
  }
  ret.push(island);
  return ret;
}

//END_CHALLENGE

// This module is referred by both browser and node.
if (typeof(window) !== "undefined") {
  window.Board = Board;
}