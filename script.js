const LOWER_CASE = /^[a-z]+$/;
const UPPER_CASE = /^[A-Z]+$/;

/**
 * 文字列が小文字かどうかを判定する関数
 * @param {string} string 文字列
 * @returns {boolean}
 */
function isLowerCase(string) {
    return LOWER_CASE.test(string);
}
/**
 * 文字列が大文字がどうかを判定する関数
 * @param {string} string 文字列
 * @returns {boolean}
 */
function isUpperCase(string) {
    return UPPER_CASE.test(string);
}
/**
 * 小文字だけの文字列を大文字だけの文字列に、そうでない文字列を小文字だけの文字列に変換する関数
 * @param {string} string 文字列
 * @returns {string}
 */
function swapCase(string) {
    if (LOWER_CASE.test(string)) {
        return string.toUpperCase();
    } else {
        return string.toLowerCase();
    }
}
String.prototype.isLowerCase = function () {
    return /^[a-z]+$/.test(this);
};
String.prototype.isUpperCase = function () {
    return /^[A-Z]+$/.test(this);
};
String.prototype.swapCase = function () {
    if (/^[a-z]+$/.test(this)) {
        return this.toUpperCase();
    } else {
        return this.toLowerCase();
    }
};

class ShogiEngine {
    constructor() {
        // 盤面の初期化
        this.board = [
            ["L", "N", "S", "G", "K", "G", "S", "N", "L"],
            ["", "R", "", "", "", "", "", "B", ""],
            ["P", "P", "P", "P", "P", "P", "P", "P", "P"],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["p", "p", "p", "p", "p", "p", "p", "p", "p"],
            ["", "b", "", "", "", "", "", "r", ""],
            ["l", "n", "s", "g", "k", "g", "s", "n", "l"]
        ];
        
        // 持ち駒の初期化
        this.hands = {
            'p': 0, 'l': 0, 'n': 0, 's': 0, 'g':0, 'b': 0, 'r': 0,
            'P': 0, 'L': 0, 'N': 0, 'S': 0, 'G':0, 'B': 0, 'R': 0
        };

        // 手番
        this.turn = true;

        // 先手の王
        this.firstKing = "k";
        // 後手の王
        this.secondKing = "K";

        // 勝者
        this.winner = 0;  // 0:未定 1:先手 -1:後手

        // 駒の動き
        this.pieceMove = {
            // 前が正（＋）、右が正（＋）、[行(縦方向), 列（横方向）]
            "p": {  // 歩
                move_position: [
                    [1, 0]
                ],
                move_direction: []
            },
            "t": {  // と
                move_position: [
                    [1, -1],
                    [1, 0],
                    [1, 1],
                    [0, -1],
                    [0, 1],
                    [-1, 0]
                ],
                move_direction: []
            },
            "l": {  // 香
                move_position: [],
                move_direction: [
                    [1, 0]
                ]
            },
            "i": {  // 成香
                move_position: [
                    [1, -1],
                    [1, 0],
                    [1, 1],
                    [0, -1],
                    [0, 1],
                    [-1, 0]
                ],
                move_direction: []
            },
            "n": {  // 桂
                move_position: [
                    [2, -1],
                    [2, 1]
                ],
                move_direction: []
            },
            "h": {  // 成桂
                move_position: [
                    [1, -1],
                    [1, 0],
                    [1, 1],
                    [0, -1],
                    [0, 1],
                    [-1, 0]
                ],
                move_direction: []
            },
            "s": {  // 銀
                move_position: [
                    [1, -1],
                    [1, 0],
                    [1, 1],
                    [-1, -1],
                    [-1, 1]
                ],
                move_direction: []
            },
            "j": {  // 成銀
                move_position: [
                    [1, -1],
                    [1, 0],
                    [1, 1],
                    [0, -1],
                    [0, 1],
                    [-1, 0]
                ],
                move_direction: []
            },
            "g": {  // 金
                move_position: [
                    [1, -1],
                    [1, 0],
                    [1, 1],
                    [0, -1],
                    [0, 1],
                    [-1, 0]
                ],
                move_direction: []
            },
            "b": {  // 角
                move_position: [],
                move_direction: [
                    [1, -1],
                    [1, 1],
                    [-1, -1],
                    [-1, 1]
                ]
            },
            "a": {  // 馬
                move_position: [
                    [1, 0],
                    [0, -1],
                    [0, 1],
                    [-1, 0]
                ],
                move_direction: [
                    [1, -1],
                    [1, 1],
                    [-1, -1],
                    [-1, 1]
                ]
            },
            "r": {  // 飛
                move_position: [],
                move_direction: [
                    [1, 0],
                    [0, -1],
                    [0, 1],
                    [-1, 0]
                ]
            },
            "q": {  // 竜
                move_position: [
                    [1, -1],
                    [1, 1],
                    [-1, -1],
                    [-1, 1]
                ],
                move_direction: [
                    [1, 0],
                    [0, -1],
                    [0, 1],
                    [-1, 0]
                ]
            },
            "k": {  // 玉
                move_position: [
                    [1, -1],
                    [1, 0],
                    [1, 1],
                    [0, -1],
                    [0, 1],
                    [-1, -1],
                    [-1, 0],
                    [-1, 1]
                ],
                move_direction: []
            }
        };
        
        // 成り駒の対応
        this.transform = {
            'p': "t",
            'l': "i",
            'n': "h",
            's': "j",
            'b': "a",
            'r': "q"
        };
        this.transform_return = {
            't': "p",
            'i': "l",
            'h': "n",
            'j': "s",
            'a': "b",
            'q': "r"
        };
        this.is_can_transform_row = {
            firstMove: [true, true, true, false, false, false, false, false, false],
            secondMove: [false, false, false, false, false, false, true, true, true]
        };

        // 表記との対応
        this.pieceName = {
            "p": "歩",
            "P": "歩",
            "t": "と",
            "T": "と",
            "l": "香",
            "L": "香",
            "i": "杏",
            "I": "杏",
            "n": "桂",
            "N": "桂",
            "h": "圭",
            "H": "圭",
            "s": "銀",
            "S": "銀",
            "j": "全",
            "J": "全",
            "g": "金",
            "G": "金",
            "b": "角",
            "B": "角",
            "a": "馬",
            "A": "馬",
            "r": "飛",
            "R": "飛",
            "q": "竜",
            "Q": "竜",
            "k": "玉",
            "K": "玉"
        };
        this.convert_row = {
            0: "一",
            1: "二",
            2: "三",
            3: "四",
            4: "五",
            5: "六",
            6: "七",
            7: "八",
            8: "九"
        }
        this.convert_col = {
            0: "９",
            1: "８",
            2: "７",
            3: "６",
            4: "５",
            5: "４",
            6: "３",
            7: "２",
            8: "１"
        }
    }

    displayBoard() {
        // 盤面と持ち駒の表示
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++){
                const piece = this.board[row][col];
                const element = document.getElementById("" + (9 - col) + (row + 1) + "_piece");
                if (piece != "") {
                    element.textContent = this.pieceName[piece];
                    if (isLowerCase(piece)) {
                        element.style.transform = "";
                    } else {
                        element.style.transform = "rotate(180deg)";
                    }
                } else {
                    element.textContent = "";
                }
            }
        }
        for (let piece in this.hands) {
            const pieceElement = document.getElementById("hands_" + piece + "_piece");
            const countElement = document.getElementById("hands_" + piece + "_count");
            if (this.hands[piece] > 0) {
                pieceElement.textContent = this.pieceName[piece];
                countElement.textContent = this.hands[piece];
            } else {
                pieceElement.textContent = "";
                countElement.textContent = "";
            }
        }
    }

    copyBoard(board) {
        const result = [];
        for (let i = 0; i < board.length; i++) {
            result[i] = new Array(...board[i]);
        }
        return result;
    }

    /**
     * 合法手を生成する関数
     * @param {boolean} [turn] - 現在の手番
     * @param {string[][]} [useBoard] - 合法手を探索する局面
     * @return {[(number|undefined), (number|undefined), number, number, undefined|string, boolean]}
    */
    generateLegalMoves(turn, useBoard) {
        if (turn === undefined) turn = this.turn;  // 初期値
        if (useBoard === undefined) useBoard = this.board;  // 初期値

        // 合法手の生成
        let legalMoves = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let piece = useBoard[i][j];
                if (piece == "") {
                    legalMoves = legalMoves.concat(this.getDropMovesForPiece(i, j, turn));
                } else if (isLowerCase(piece) == turn) {  // 手番の駒
                    let piece_kind = piece.toLowerCase()
                    legalMoves = legalMoves.concat(this.getLegalMovesForPiece(i, j, piece_kind, turn, useBoard));
                }
            }
        }
        
        // 手の確認
        for (let index = 0; index < legalMoves.length; index++) {
            let board = this.copyBoard(useBoard);

            let is_drop_pawn = false;
            let is_drop_pawn_check = false;

            // 駒移動後の盤面を作成
            const [from_row, from_col, to_row, to_col, dropped_piece, whether_transform] = legalMoves[index];
            if (from_row !== undefined && from_col !== undefined) {
                // 駒を移動する場合
                let piece = useBoard[from_row][from_col];
                if (whether_transform) {  // 成る場合
                    let transform_piece = this.transform[piece.toLowerCase()];
                    if (isLowerCase(piece)) {
                        piece = transform_piece;
                    } else {
                        piece = transform_piece.toUpperCase();
                    }
                }
                board[to_row][to_col] = piece;
                board[from_row][from_col] = "";
            } else {
                // 持ち駒を打つ場合
                if (isLowerCase(dropped_piece) != turn) {
                    dropped_piece = dropped_piece.swapCase();
                }
                board[to_row][to_col] = dropped_piece;
                if (dropped_piece.toLowerCase() == "p") {
                    is_drop_pawn = true;
                    if (turn && to_row - 1 >= 0) {
                        if (board[to_row - 1][to_col] == this.secondKing) is_drop_pawn_check = true;
                    } else if (!turn && to_row + 1 < 9) {
                        if (board[to_row + 1][to_col] == this.firstKing) is_drop_pawn_check = true;
                    }
                }
            }

            let check;
            // 王手の有無
            check = false;
            for (let i = 0; i < 9; i++) {
                if (check) break;
                for (let j = 0; j < 9; j++) {
                    if (check) break;
                    let piece = board[i][j];
                    if (piece && isLowerCase(piece) != turn) {  // 手番の駒
                        let piece_kind = piece.toLowerCase();
                        const next_legalMoves = this.getLegalMovesForPiece(i, j, piece_kind, !turn, board);
                        for (let move of next_legalMoves) {
                            if (check) break;
                            if (board[move[2]][move[3]] == this.firstKing || board[move[2]][move[3]] == this.secondKing) {
                                check = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (check) {
                legalMoves.splice(index, 1);
                index--;
                continue;
            }

            // 二歩の有無
            check = false
            if (is_drop_pawn) {
                for (let i = 0; i < 9; i++) {
                    if (check) break;
                    let is_p = false;
                    for (let j = 0; j < 9; j++) {
                        if (isLowerCase(board[j][i]) == turn && board[j][i].toLowerCase() == "p") {
                            if (is_p) {
                                check = true;
                                break;
                            } else {
                                is_p = true;
                            }
                        }
                    }
                }
            }
            if (check) {
                legalMoves.splice(index, 1);
                index--;
                continue;
            }

            // 動けない駒の有無
            check = true;
            const piece = board[to_row][to_col];
            const pieceMove = this.pieceMove[piece.toLowerCase()];
            const rowIndex = turn ? -1 :    1;
            const colIndex = turn ?    1 : -1;
            for (let position of pieceMove.move_position) {
                if (!check) break;
                const moveRow = to_row + (position[0] * rowIndex);
                const moveCol = to_col + (position[1] * colIndex);
                if (moveRow >= 0 && moveRow < 9 && moveCol >= 0 && moveCol < 9) {
                    check = false;
                }
            }
            for (let direction of pieceMove.move_direction) {
                if (!check) break;
                const rowDirection = direction[0] * rowIndex;
                const colDirection = direction[1] * colIndex;
                const moveRow = to_row + rowDirection;
                const moveCol = to_col + colDirection;
                if (moveRow >= 0 && moveRow < 9 && moveCol >= 0 && moveCol < 9) {
                    check = false;
                }
            }
            if (check) {
                legalMoves.splice(index, 1);
                index--;
                continue
            }

            // 打ち歩詰めの確認
            check = false
            if (is_drop_pawn_check) {
                if (this.generateLegalMoves(!turn, board).length == 0) {
                    check = true
                }
            }
            if (check) {
                legalMoves.splice(index, 1);
                index--;
                continue;
            }
        }
        
        return legalMoves;
    }

    getLegalMovesForPiece(row, col, piece, turn, board) {
        if (board === undefined)    board = this.board;  // デフォルト値
        
        // 駒の移動可能な座標を返す
        const legalMoves = [];
        const pieceMove = this.pieceMove[piece.toLowerCase()];
        const transform_row = turn ? this.is_can_transform_row.firstMove : this.is_can_transform_row.secondMove;
        const rowIndex = turn ? -1 :    1;
        const colIndex = turn ?    1 : -1;
        for (let position of pieceMove.move_position) {
            const moveRow = row + (position[0] * rowIndex);
            const moveCol = col + (position[1] * colIndex);
            if (moveRow >= 0 && moveRow < 9 && moveCol >= 0 && moveCol < 9 && (!board[moveRow][moveCol] || isLowerCase(board[moveRow][moveCol]) != turn)) {
                legalMoves.push([row, col, moveRow, moveCol, undefined, false]);
                if (piece.toLowerCase() in this.transform && (transform_row[row] || transform_row[moveRow])) {
                    legalMoves.push([row, col, moveRow, moveCol, undefined, true]);
                }
            }
        }
        for (let direction of pieceMove.move_direction) {
            const rowDirection = direction[0] * rowIndex;
            const colDirection = direction[1] * colIndex;
            let moveRow = row;
            let moveCol = col;
            for (let i = 0; i < 9; i++) {
                moveRow += rowDirection;
                moveCol += colDirection;
                if (moveRow < 0 || moveRow >= 9 || moveCol < 0 || moveCol >= 9) break;
                if (!board[moveRow][moveCol] || isLowerCase(board[moveRow][moveCol]) != turn) {
                    legalMoves.push([row, col, moveRow, moveCol, undefined, false]);
                    if (piece.toLowerCase() in this.transform && (transform_row[row] || transform_row[moveRow])) {
                        legalMoves.push([row, col, moveRow, moveCol, undefined, true]);
                    }
                }
                if (board[moveRow][moveCol]) {
                    break;
                }
            }
        }
        return legalMoves
    }

    getDropMovesForPiece(to_row, to_col, turn) {
        // 持ち駒を打つ手の生成
        const dropMoves = []
        for (let piece in this.hands) {
            if (this.hands[piece] > 0 && isLowerCase(piece) == turn) {
                    dropMoves.push([undefined, undefined, to_row, to_col, piece, false]);
            }
        }
        return dropMoves;
    }

    /**
     * 王の数を数える関数
     * @param {boolean} turn - true:先手の王の数を返す false:後手の王の数を返す
     * @return {number}
    */
    countKing(turn) {
        const king = turn ? this.firstKing : this.secondKing;
        let result = 0;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] == king) result++;
            }
        }
        return result;
    }

    /**
     * @typedef {{from_row:(number|undefined), from_col:(number|undefined), to_row:number, to_col:number, piece:string, dropped_piece:(undefined|string), whether_transform:boolean, take_piece:string, moveCount:number, name:string, traditional_name:string, nextIndex:number[], deletedNextIndex:number[], lastIndex:number}} moveObject
     */
    /**
     * 手を適用して盤面を更新
     * @param {[(number|undefined), (number|undefined), number, number, (undefined|string), boolean]} move - 手を示す配列
     * @return {moveObject} - 取った駒を含む手
    */
    makeMove(move) {
        // 手を適用して盤面を更新
        /**
         * 返り値
         * @type {moveObject}
        */
        let result = {};
        let [from_row, from_col, to_row, to_col, dropped_piece, whether_transform] = move;
        result.from_row = from_row;
        result.from_col = from_col;
        result.to_row = to_row;
        result.to_col = to_col;
        result.dropped_piece = dropped_piece;
        result.whether_transform = whether_transform;
        result.piece = "";
        result.take_piece = "";
        result.moveCount = 0;
        result.name = "";
        result.traditional_name = "";
        result.nextIndex = [];
        result.deletedNextIndex = [];
        result.lastIndex = -1;

        const legalMoves = this.generateLegalMoves();

        if (from_row !== undefined && from_col !== undefined) {
            // 駒を移動する場合
            let piece = this.board[from_row][from_col];
            result.piece = piece;
            let take_piece = this.board[to_row][to_col];
            if (whether_transform) {  // 成る場合
                let transform_piece = this.transform[piece.toLowerCase()];
                if (isLowerCase(piece)) {
                    piece = transform_piece;
                } else {
                    piece = transform_piece.toUpperCase();
                }
            }
            this.board[to_row][to_col] = piece;
            this.board[from_row][from_col] = "";
            if (take_piece != "") {  // 持ち駒の追加
                result.take_piece = take_piece;
                if (take_piece.toLowerCase() in this.transform_return) {
                    if (isLowerCase(take_piece)) {
                        take_piece = this.transform_return[take_piece.toLowerCase()];
                    } else {
                        take_piece = this.transform_return[take_piece.toLowerCase()].toUpperCase();
                    }
                }
                const addPieceName = take_piece.swapCase();
                if (!this.hands[addPieceName]) this.hands[addPieceName] = 0;
                this.hands[addPieceName] += 1;
            }
        } else {
            // 持ち駒を打つ場合
            result.piece = dropped_piece;
            if (isLowerCase(dropped_piece) != this.turn) {
                dropped_piece = dropped_piece.swapCase();
            }
            this.hands[dropped_piece] -= 1;
            this.board[to_row][to_col] = dropped_piece;
        }
        
        this.turn = !this.turn;  // 手番交代

        if (!this.generateLegalMoves()) {
            if (this.turn) {
                this.winner = -1;  // 後手の勝ち
            } else {
                this.winner = 1;  // 先手の勝ち
            }
        }
        if (this.countKing(this.turn) == 0) {
            if (this.turn) {
                this.winner = -1;  // 後手の勝ち
            } else {
                this.winner = 1;  // 先手の勝ち
            }
        }

        return result;
    }

    /**
     * 手を戻す
     * @param {moveObject} move - 手
    */
    returnMove(move) {
        const {from_row, from_col, to_row, to_col, dropped_piece, whether_transform, take_piece} = move;
        if (from_row !== undefined && from_col !== undefined) {
            // 駒を移動する場合
            let piece = this.board[to_row][to_col];
            if (whether_transform) {  // 成る場合
                let transform_piece = this.transform_return[piece.toLowerCase()];
                if (isLowerCase(piece)) {
                    piece = transform_piece;
                } else {
                    piece = transform_piece.toUpperCase();
                }
            }
            this.board[from_row][from_col] = piece;
            this.board[to_row][to_col] = "";
            if (take_piece) {  // 持ち駒の追加
                let hand_piece = take_piece.swapCase();
                if (hand_piece.toLowerCase() in this.transform_return) {
                    if (isLowerCase(hand_piece)) {
                        hand_piece = this.transform_return[hand_piece.toLowerCase()];
                    } else {
                        hand_piece = this.transform_return[hand_piece.toLowerCase()].toUpperCase();
                    }
                }
                this.hands[hand_piece] -= 1;
                this.board[to_row][to_col] = take_piece;
            }
        } else {
            // 持ち駒を打つ場合
            this.hands[dropped_piece] += 1;
            this.board[to_row][to_col] = "";
        }
        
        this.turn = !this.turn;  // 手番交代
    }

    playRandomMove() {
        // ランダムな手を選択して適用
        const legalMoves = this.generateLegalMoves(this.turn);
        if (legalMoves) {
            const selectedMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            this.makeMove(selectedMove);
            return selectedMove;
        }
        return undefined;
    }
}


/**
 * 現在の棋譜
 * @type {moveObject[]}
*/
let currentGame = [
    {
        from_row: undefined,
        from_col: undefined,
        to_row: undefined,
        to_col: undefined,
        piece: undefined,
        dropped_piece: undefined,
        whether_transform: undefined,
        take_piece: undefined,
        moveCount: 0,
        traditional_name: "開始局面",
        nextIndex: [],
        deletedNextIndex: [],
        lastIndex: -1
    }
];  // {from_row, from_col, to_row, to_col, dropped_piece, whether_transform, take_piece, nextIndex(array), lastIndex}
/**
 * 現在のインデックス
 * @type {number}
*/
let currentIndex = 0;

// メインの処理
let from_row = undefined;
let from_col = undefined;
let to_row = undefined;
let to_col = undefined;
let dropped_piece = undefined;
let whether_transform = false;
/**
 * 現在の局面での合法手
 * @type {[(number|undefined), (number|undefined), number, number, (string|undefined), boolean][]}
*/
let legalMoves;

let markedElement;

function is_LegalMove(move) {
    for (let legalMove of legalMoves) {
        let sameMove = true;
        for (let i = 0; i < legalMove.length; i++) {
            if (move[i] !== legalMove[i]) {
                sameMove = false;
                break;
            }
        }
        if (sameMove) return true;
    }
    return false;
}
function is_can_transform(from_row_, from_col_, to_row_, to_col_) {
    const transformMove = [from_row_, from_col_, to_row_, to_col_, undefined, true];
    return is_LegalMove(transformMove);
}
function resetValue() {
    from_row = undefined;
    from_col = undefined;
    to_row = undefined;
    to_col = undefined;
    dropped_piece = undefined;
    whether_transform = false;
    if (markedElement) markedElement.style.boxShadow = "";
}

function makeMove() {
    const move = [from_row, from_col, to_row, to_col, dropped_piece, whether_transform];

    let newMove = true;
    for (let i = 0; i < currentGame[currentIndex].nextIndex.length; i++) {
        const move_ = currentGame[currentGame[currentIndex].nextIndex[i]];
        if (move_.from_row === from_row && move_.from_col === from_col && move_.to_row === to_row && move_.to_col === to_col && move_.dropped_piece === dropped_piece && move_.whether_transform === whether_transform) {
            newMove = false;
            nextMove(i);
            break;
        }
    }
    for (let i = 0; i < currentGame[currentIndex].deletedNextIndex.length; i++) {
        const move_ = currentGame[currentGame[currentIndex].deletedNextIndex[i]];
        if (move_.from_row === from_row && move_.from_col === from_col && move_.to_row === to_row && move_.to_col === to_col && move_.dropped_piece === dropped_piece && move_.whether_transform === whether_transform) {
            newMove = false;
            const nextMoveIndex = currentGame[currentIndex].deletedNextIndex.splice(i, 1)[0];
            currentGame[currentIndex].nextIndex.push(nextMoveIndex);
            nextMove(currentGame[currentIndex].nextIndex.length - 1);
            break;
        }
    }


    if (newMove && is_LegalMove(move)) {
        const record_move = shogiEngine.makeMove(move);
        shogiEngine.displayBoard();

        const record_index = currentGame.length;
        // 記録する値を追加
        // 前の手
        record_move.lastIndex = currentIndex;
        record_move.moveCount = currentGame[currentIndex].moveCount + 1;
        // 指し手の表記
        const to_name = (currentGame[currentIndex].to_row == record_move.to_row && currentGame[currentIndex].to_col == record_move.to_col) ? "同　" : shogiEngine.convert_col[record_move.to_col] + shogiEngine.convert_row[record_move.to_row];
        const pieceName = shogiEngine.pieceName[record_move.piece];
        const drop = (record_move.from_row === undefined && record_move.from_col === undefined) ? "打" : "";
        const transform = record_move.whether_transform ? "成" : "";
        const from_name = ((record_move.from_row !== undefined && record_move.from_col !== undefined) && !(currentGame[currentIndex].to_row == record_move.to_row && currentGame[currentIndex].to_col == record_move.to_col)) ? "(" + (9 - record_move.from_col) + (record_move.from_row + 1) + ")" : "";
        record_move.name = to_name + pieceName + drop + transform + from_name;

        let to_name_traditional = to_name;
        let position_traditional = "";  // 右・左
        let direction_traditional = ""; // 上・引・寄・直
        let drop_traditional = "";  // 打
        let transform_traditional = transform;  // 成・不成
        let from_name_traditional = "";  // 変則将棋用
        if (to_name_traditional == "同　") to_name_traditional = "同";
        for (let legalMove of legalMoves) {
            const [from_row_, from_col_, to_row_, to_col_, dropped_piece_, whether_transform_] = legalMove;
            if (dropped_piece_ == undefined && to_row_ == record_move.to_row && to_col_ == record_move.to_col && shogiEngine.board[from_row_][from_col_] == record_move.piece/* 同じ手も排除 */) {
                const turn = isLowerCase(record_move.piece);
                if (record_move.from_row === undefined && record_move.from_col === undefined) {
                    drop_traditional = "打";
                    break;  // "打"がある場合動きは１通りに決まる

                } else if (record_move.from_row == record_move.to_row && from_row_ != record_move.to_row) {
                    direction_traditional = "寄";

                } else if (record_move.from_row < record_move.to_row && from_row_ >= record_move.to_row) {
                    if (turn) {
                        direction_traditional = "引";
                    } else {
                        direction_traditional = "上";
                    }

                } else if (record_move.from_row > record_move.to_row && from_row_ <= record_move.to_row) {
                    if (turn) {
                        direction_traditional = "上";
                    } else {
                        direction_traditional = "引";
                    }

                } else if (turn && record_move.from_col == record_move.to_col && record_move.from_row - 1 == record_move.to_row && shogiEngine.pieceMove[record_move.piece.toLowerCase()].move_direction.length == 0) {
                    direction_traditional = "直";
                    position_traditional = "";
                    break;  // "直"がある場合動きは１通りに決まる

                } else if (!turn && record_move.from_col == record_move.to_col && record_move.from_row + 1 == record_move.to_row && shogiEngine.pieceMove[record_move.piece.toLowerCase()].move_direction.length == 0) {
                    direction_traditional = "直";
                    position_traditional = "";
                    break;  // "直"がある場合動きは１通りに決まる

                } else if (record_move.from_col < from_col_) {
                    if (turn) {
                        position_traditional = "左";
                    } else {
                        position_traditional = "右";
                    }

                } else if (record_move.from_col > from_col_) {
                    if (turn) {
                        position_traditional = "右";
                    } else {
                        position_traditional = "左";
                    }

                } else {
                    from_name_traditional = from_name;
                }
            }
        }
        if (!record_move.whether_transform) {
            for (let legalMove of legalMoves) {
                const [from_row_, from_col_, to_row_, to_col_, dropped_piece_, whether_transform_] = legalMove;
                if (record_move.from_row == from_row_ && record_move.from_col == from_col_ && record_move.to_row == to_row_ && record_move.to_col == to_col_ && whether_transform_ == true) {
                    transform_traditional = "不成";
                }
            }
        }
        record_move.traditional_name = to_name_traditional + pieceName + position_traditional + direction_traditional + drop_traditional + transform_traditional + from_name_traditional;

        if (currentGame[currentIndex]) currentGame[currentIndex].nextIndex.push(record_index);
        currentGame[record_index] = record_move;
        currentIndex = record_index;

        if (shogiEngine.winner == 0) {
            resetValue();
            legalMoves = shogiEngine.generateLegalMoves();
        } else {
            resetValue();
            legalMoves = [];
        }
        document.getElementById("last").disabled = false;
        document.getElementById("next").disabled = true;
    } else {
        resetValue();
    }
    setBranch();
    setKifu();
    setPannelButtonName();
}

function setBranch() {
    const branchElement = document.createElement('div');
    document.getElementById("branch").replaceWith(branchElement);
    branchElement.id = "branch";

    const branchIndex = currentGame[currentIndex].nextIndex;
    for (let i = 0; i < branchIndex.length; i++) {
        const arrayIndex = i;
        const index = branchIndex[arrayIndex];

        const element = document.createElement('div');
        branchElement.appendChild(element);
        const nameButton = document.createElement('button');
        element.appendChild(nameButton);
        const upButton = document.createElement('button');
        element.appendChild(upButton);
        const downButton = document.createElement('button');
        element.appendChild(downButton);
        const deleteButton = document.createElement('button');
        element.appendChild(deleteButton);
        nameButton.textContent = currentGame[index].traditional_name;
        upButton.textContent = "↑";
        downButton.textContent = "↓";
        deleteButton.textContent = "削除";
        nameButton.addEventListener('click', event => {
            nextMove(arrayIndex);
        });
        upButton.addEventListener('click', event => {
            const temp = currentGame[currentIndex].nextIndex[arrayIndex-1];
            currentGame[currentIndex].nextIndex[arrayIndex-1] = currentGame[currentIndex].nextIndex[arrayIndex];
            currentGame[currentIndex].nextIndex[arrayIndex] = temp;
            setBranch();
            if (arrayIndex == 1) setKifu();
        });
        if (i == 0) upButton.disabled = true;
        downButton.addEventListener('click', event => {
            const temp = currentGame[currentIndex].nextIndex[arrayIndex+1];
            currentGame[currentIndex].nextIndex[arrayIndex+1] = currentGame[currentIndex].nextIndex[arrayIndex];
            currentGame[currentIndex].nextIndex[arrayIndex] = temp;
            setBranch();
            if (arrayIndex == 0) setKifu();
        });
        if (i == branchIndex.length - 1) downButton.disabled = true;
        deleteButton.addEventListener('click', event => {
            currentGame[currentIndex].nextIndex.splice(arrayIndex, 1);
            currentGame[currentIndex].deletedNextIndex.push(index);
            setBranch();
            setKifu();
        });
    }
}

function setKifu() {
    const kifuElement = document.createElement('div');
    document.getElementById("kifu").replaceWith(kifuElement);
    kifuElement.id = "kifu";

    const createMoveElement = (_index) => {
        const moveElement = document.createElement('button');
        const moveCountElement = document.createElement('span');
        moveElement.appendChild(moveCountElement);
        moveCountElement.textContent = currentGame[_index].moveCount + ".";
        const moveNameElement = document.createElement('span');
        moveElement.appendChild(moveNameElement);
        moveNameElement.textContent = currentGame[_index].traditional_name;
        if (currentGame[_index].nextIndex.length > 1) {
            const branchCountElement = document.createElement('span');
            moveElement.appendChild(branchCountElement);
            branchCountElement.textContent = "+" + (currentGame[_index].nextIndex.length - 1);
        }
        if (currentGame[_index].lastIndex >= 0 && currentGame[currentGame[_index].lastIndex].nextIndex.indexOf(_index) != 0) {
            moveElement.classList.add("notDefaultMove");
        }
        moveElement.addEventListener('click', event => {
            const difference = currentGame[_index].moveCount - currentGame[currentIndex].moveCount;
            if (difference < 0) {
                for (let i = 0; i < Math.abs(difference); i++) {
                    shogiEngine.returnMove(currentGame[currentIndex]);
                    currentIndex = currentGame[currentIndex].lastIndex;
                }
                shogiEngine.displayBoard();
                moveElement.scrollIntoView({block: "center", behavior: "smooth"});
                legalMoves = shogiEngine.generateLegalMoves();
                setBranch();
                setKifu();
                setPannelButtonName();
                document.getElementById("next").disabled = false;
                document.getElementById("last").disabled = false;
                if (currentGame[currentIndex].lastIndex < 0) document.getElementById("last").disabled = true;
            } else if (difference > 0) {
                for (let i = 0; i < Math.abs(difference); i++) {
                    const moveObject = currentGame[currentGame[currentIndex].nextIndex[0]];
                    shogiEngine.makeMove([moveObject.from_row, moveObject.from_col, moveObject.to_row, moveObject.to_col, moveObject.dropped_piece, moveObject.whether_transform]);
                    currentIndex = currentGame[currentIndex].nextIndex[0];
                }
                shogiEngine.displayBoard();
                moveElement.scrollIntoView({block: "center", behavior: "smooth"});
                legalMoves = shogiEngine.generateLegalMoves();
                setBranch();
                setKifu();
                setPannelButtonName();
                document.getElementById("last").disabled = false;
                document.getElementById("next").disabled = false;
                if (currentGame[currentIndex].nextIndex.length == 0) document.getElementById("next").disabled = true;
            } else {
                moveElement.scrollIntoView({block: "center", behavior: "smooth"});
            }
        });
        return moveElement;
    };

    let index;
    const moves = [];

    index = currentIndex;
    const currentMoveElement = createMoveElement(index)
    kifuElement.appendChild(currentMoveElement);

    index = currentGame[index].lastIndex;
    while (index >= 0) {
        const moveElement = createMoveElement(index);
        kifuElement.insertBefore(moveElement, kifuElement.firstChild);
        index = currentGame[index].lastIndex;
    }

    index = currentGame[currentIndex].nextIndex[0];
    while (index !== undefined) {
        const moveElement = createMoveElement(index);
        kifuElement.appendChild(moveElement);
        index = currentGame[index].nextIndex[0];
    }

    if (currentMoveElement) {
        currentMoveElement.style.fontWeight = "bold";
        currentMoveElement.scrollIntoView({block:"center"});
    }
}

function setPannelButtonName() {
    let name = "";
    if (currentIndex % 2 != 0) {
        name += "▲";
    } else {
        name += "▽";
    }
    name += currentGame[currentIndex].traditional_name;
    if (currentGame[currentIndex].nextIndex.length > 1) {
        name += " +";
    }
    requestAnimationFrame(() => {
        document.getElementById("showPanel").textContent = name;
    });
}

document.getElementById("transform_button").addEventListener('click', event => {
    whether_transform = true;
    makeMove();
});
document.getElementById("not_transform_button").addEventListener('click', event => {
    makeMove();
});
function showTransformDialog() {
    const piece = shogiEngine.board[from_row][from_col];
    const pieceName = shogiEngine.pieceName[piece];
    const transformPieceName = shogiEngine.pieceName[shogiEngine.transform[piece.toLowerCase()]];
    document.getElementById("transform_button").textContent = transformPieceName;
    document.getElementById("not_transform_button").textContent = pieceName;
    if (isLowerCase(piece)) {
        document.getElementById("transform_button").style.transform = "";
        document.getElementById("not_transform_button").style.transform = "";
    } else {
        document.getElementById("transform_button").style.transform = "rotate(180deg)";
        document.getElementById("not_transform_button").style.transform = "rotate(180deg)";
    }
    document.getElementById("confirm_transform").showModal();
}


// メイン
const shogiEngine = new ShogiEngine();
shogiEngine.displayBoard();
legalMoves = shogiEngine.generateLegalMoves();
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        const row = i;
        const col = j;
        document.getElementById("" + (9 - col) + (row + 1)).addEventListener('click', event => {
            if (from_row === undefined && from_col === undefined && dropped_piece === undefined) {
                from_row = row;
                from_col = col;
                event.currentTarget.style.boxShadow = "inset #ccad00 0 0 0 min(0.5vh, 0.5vw)";
                markedElement = event.currentTarget;
            } else {
                to_row = row;
                to_col = col;
                if (!is_can_transform(from_row, from_col, to_row, to_col)) {
                    makeMove();
                } else {
                    showTransformDialog();
                }
            }
        });
    }
}
for (let key in shogiEngine.hands) {
    const piece = key;
    document.getElementById("hands_" + piece).addEventListener('click', event => {
        if (!from_row && !from_col && !dropped_piece) {
            dropped_piece = piece;
            event.currentTarget.style.boxShadow = "inset #fcd523 0 0 0 min(0.5vh, 0.5vw)";
            markedElement = event.currentTarget;
        } else {
            resetValue();
        }
    });
}

function lastMove() {
    if (currentGame[currentIndex] && currentGame[currentIndex].lastIndex >= 0) {
        shogiEngine.returnMove(currentGame[currentIndex]);
        shogiEngine.displayBoard();
        currentIndex = currentGame[currentIndex].lastIndex;
        resetValue();
        legalMoves = shogiEngine.generateLegalMoves();
        document.getElementById("next").disabled = false;
        if (currentGame[currentIndex].lastIndex < 0) {
            document.getElementById("last").disabled = true;
        }
        setBranch();
        setKifu();
        setPannelButtonName();
    } else {
        document.getElementById("last").disabled = true;
    }
}
function nextMove(index) {
    const moveIndex = index || 0;
    if (currentGame[currentIndex] && currentGame[currentIndex].nextIndex[moveIndex] !== undefined) {
        const index = currentGame[currentIndex].nextIndex[moveIndex];
        const move = currentGame[index];
        shogiEngine.makeMove([move.from_row, move.from_col, move.to_row, move.to_col, move.dropped_piece, move.whether_transform]);
        shogiEngine.displayBoard();
        currentIndex = index;
        resetValue();
        legalMoves = shogiEngine.generateLegalMoves();
        document.getElementById("last").disabled = false;
        if (currentGame[currentIndex].nextIndex[0] === undefined) {
            document.getElementById("next").disabled = true;
        }
        setBranch();
        setKifu();
        setPannelButtonName();
    } else {
        document.getElementById("next").disabled = true;
    }
}
document.getElementById("last").addEventListener('click', event => {
    lastMove();
});
document.getElementById("next").addEventListener('click', event => {
    nextMove(0);
});
document.getElementById("showPanel").addEventListener('click', event => {
    document.getElementById("panel").style.display = "flex";
    document.getElementById("showPanel").disabled = true;
});
document.getElementById("closePanel").addEventListener('click', event => {
    document.getElementById("panel").style.display = "";
    document.getElementById("showPanel").disabled = false;
});
//document.getElementById("board_area").requestFullscreen();