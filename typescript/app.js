var GeneratePuzzle = (function () {
    function GeneratePuzzle() {
        this.getPuzzleParent = document.querySelector('.puzzle');
    }
    // Generate puzzle.
    GeneratePuzzle.prototype.generatePuzzle = function () {
        for (var i = 1; i <= 16; i++) {
            var div = document.createElement('div');
            var p = document.createElement('p');
            p.appendChild(document.createTextNode(String(i)));
            div.appendChild(p);
            div.setAttribute('id', String(i));
            div.setAttribute('data-attr', String(i));
            this.getPuzzleParent.appendChild(div);
        }
    };
    return GeneratePuzzle;
}());
var RemoveRandomPuzzlePiece = (function () {
    function RemoveRandomPuzzlePiece() {
        this.getPuzzlePieces = document.querySelector('.puzzle').children;
    }
    RemoveRandomPuzzlePiece.prototype.removeRandomPuzzlePiece = function () {
        var randomPuzzlePiece = this.getPuzzlePieces[Math.floor(Math.random() * this.getPuzzlePieces.length)];
        if (randomPuzzlePiece.tagName === 'DIV') {
            randomPuzzlePiece.children[0].style.visibility = 'hidden';
            randomPuzzlePiece.style.backgroundColor = '#333333';
            randomPuzzlePiece.setAttribute('data-attr', true);
            randomPuzzlePiece.innerHTML = '-';
        }
        else {
            // If the tagName is not div, run again function until it is.
            this.removeRandomPuzzlePiece();
        }
    };
    return RemoveRandomPuzzlePiece;
}());
var ShufflePuzzlePieces = (function () {
    function ShufflePuzzlePieces() {
        this.getPuzzle = document.querySelector('.puzzle');
        this.getPuzzlePieces = document.querySelector('.puzzle').children;
    }
    // Insert after specific node.
    ShufflePuzzlePieces.prototype.insertAfter = function (newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };
    // Add break to make 4x4 grid.
    ShufflePuzzlePieces.prototype.makeRectangular = function () {
        this.insertAfter(document.createElement('br'), this.getPuzzlePieces[3]);
        this.insertAfter(document.createElement('br'), this.getPuzzlePieces[8]);
        this.insertAfter(document.createElement('br'), this.getPuzzlePieces[13]);
    };
    ShufflePuzzlePieces.prototype.shuffleArr = function (a) {
        for (var i = a.length; i; i--) {
            var j = Math.floor(Math.random() * i);
            _a = [a[j], a[i - 1]], a[i - 1] = _a[0], a[j] = _a[1];
        }
        var _a;
    };
    ShufflePuzzlePieces.prototype.shufflePuzzlePieces = function () {
        var puzzlePiecesinnerHMTL = [];
        for (var i = 0; i < this.getPuzzle.children.length; i++) {
            puzzlePiecesinnerHMTL.push(this.getPuzzle.children[i].innerHTML);
            this.getPuzzle.children[i].innerHTML = '';
        }
        this.shuffleArr(puzzlePiecesinnerHMTL);
        ;
        for (var i = 0; i < puzzlePiecesinnerHMTL.length; i++) {
            $(this.getPuzzle.children[i]).append(puzzlePiecesinnerHMTL[i]);
        }
    };
    return ShufflePuzzlePieces;
}());
var MovePiecesAlgo = (function () {
    function MovePiecesAlgo() {
        this.getPuzzlePieces = document.querySelector('.puzzle').children;
        this.puzzleToArr = Array.prototype.slice.call(this.getPuzzlePieces);
        this.jArr = [[], [], [], []];
    }
    MovePiecesAlgo.prototype.createJaggedArr = function () {
        var i = 0, j = 0;
        while (i < 18) {
            // if(this.getPuzzlePieces[i] === undefined){
            //     break;
            // }
            if (i === 5) {
                j++;
            }
            if (i === 9) {
                j++;
            }
            if (i === 14) {
                j++;
            }
            if (i === 18) {
                j++;
            }
            this.jArr[j].push(this.getPuzzlePieces[i]);
            i++;
        }
        this.jArr[j].push(this.getPuzzlePieces[18]);
    };
    MovePiecesAlgo.prototype.removeBrEl = function () {
        this.createJaggedArr();
        for (var i = 0; i < this.jArr.length; i++) {
            for (var j = 0; j < this.jArr[i].length; j++) {
                if (this.jArr[i][j].tagName === 'BR') {
                    this.jArr[i].splice(j, 1);
                }
            }
        }
    };
    MovePiecesAlgo.prototype.piecesMoves = function () {
        var pieces = this.getPuzzlePieces;
        var emptyPiece;
        var left = 0;
        var right = 0;
        var moveX = 1;
        var moveY = 0;
        this.removeBrEl();
        checkGoal();
        $('.puzzle > div').on('click', function () {
            var sourceId = '#' + this.id;
            var sourceText = $(sourceId).find('p').text();
            var targetText = '-';
            $('.puzzle > div').each(function () {
                $(this).hover(function () {
                    $(this).css('background-color', '#333333');
                }, function () {
                    $(this).css('background-color', '');
                });
                var id = '#' + this.id;
                if ($(id).text() === '-') {
                    if (pieceRules(sourceId, id)) {
                        $('.stats__num-of-tries > span').html(moveX++);
                        refreshGrid(id, sourceText);
                        $(id).css('background-color', '#191919');
                        $(id).removeClass('bg');
                        refreshGrid(sourceId, targetText);
                        $(sourceId).css('background-color', 'rgb(89, 89, 89)');
                        $(sourceId).addClass('bg');
                        if (checkGoal()) {
                            $('.stats__victory').html('You won!!!');
                        }
                        else {
                            $('.stats__victory').html('');
                        }
                    }
                    else if (sourceId != id) {
                        return false;
                    }
                }
            });
        });
    };
    return MovePiecesAlgo;
}());
function checkGoal() {
    var count = 0, loop = 1;
    $('.puzzle > div').each(function () {
        var id = '#' + this.id;
        if (parseInt($(id).text()) === loop++) {
            $(id).css('color', 'lightgreen');
            count++;
        }
        else {
            $(id).css('color', 'white');
        }
    });
    if (count === 15) {
        return true;
    }
    else {
        return false;
    }
}
function refreshGrid(target, text) {
    $(target).html("<p>" + text + "</p>");
}
function pieceRules(sourceId, targetId) {
    switch (targetId) {
        case '#16':
            if (sourceId === '#12' || sourceId === '#15') {
                return true;
            }
            else {
                return false;
            }
        case '#15':
            if (sourceId === '#11' || sourceId === '#14' || sourceId === '#16') {
                return true;
            }
            else {
                return false;
            }
        case '#14':
            if (sourceId === '#10' || sourceId === '#13' || sourceId === '#15') {
                return true;
            }
            else {
                return false;
            }
        case '#13':
            if (sourceId === '#9' || sourceId === '#14') {
                return true;
            }
            else {
                return false;
            }
        case '#12':
            if (sourceId === '#8' || sourceId === '#11' || sourceId === '#16') {
                return true;
            }
            else {
                return false;
            }
        case '#11':
            if (sourceId === '#7' || sourceId === '#10' || sourceId === '#12' || sourceId === '#15') {
                return true;
            }
            else {
                return false;
            }
        case '#10':
            if (sourceId === '#6' || sourceId === '#9' || sourceId === '#11' || sourceId === '#14') {
                return true;
            }
            else {
                return false;
            }
        case '#9':
            if (sourceId === '#5' || sourceId === '#10' || sourceId === '#13') {
                return true;
            }
            else {
                return false;
            }
        case '#8':
            if (sourceId === '#4' || sourceId === '#7' || sourceId === '#12') {
                return true;
            }
            else {
                return false;
            }
        case '#7':
            if (sourceId === '#3' || sourceId === '#6' || sourceId === '#8' || sourceId === '#11') {
                return true;
            }
            else {
                return false;
            }
        case '#6':
            if (sourceId === '#2' || sourceId === '#5' || sourceId === '#7' || sourceId === '#10') {
                return true;
            }
            else {
                return false;
            }
        case '#5':
            if (sourceId === '#1' || sourceId === '#6' || sourceId === '#9') {
                return true;
            }
            else {
                return false;
            }
        case '#4':
            if (sourceId === '#3' || sourceId === '#8') {
                return true;
            }
            else {
                return false;
            }
        case '#3':
            if (sourceId === '#2' || sourceId === '#4' || sourceId === '#7') {
                return true;
            }
            else {
                return false;
            }
        case '#2':
            if (sourceId === '#1' || sourceId === '#3' || sourceId === '#6') {
                return true;
            }
            else {
                return false;
            }
        case '#1':
            if (sourceId === '#2' || sourceId === '#5') {
                return true;
            }
            else {
                return false;
            }
    }
}
var InitializeGame = (function () {
    function InitializeGame() {
        this.generatePuzzle = new GeneratePuzzle();
        this.shufflePuzzlePieces = new ShufflePuzzlePieces();
        this.removeRandomPuzzlePiece = new RemoveRandomPuzzlePiece;
        this.movePiecesAlgo = new MovePiecesAlgo();
    }
    InitializeGame.prototype.init = function () {
        var _this = this;
        $('.stats__shuffle').on('click', function () {
            $('.stats__num-of-tries > span').html(0);
            $('.puzzle').empty();
            generatePuzzle.generatePuzzle();
            _this.shufflePuzzlePieces.shufflePuzzlePieces();
            _this.shufflePuzzlePieces.makeRectangular();
            _this.removeRandomPuzzlePiece.removeRandomPuzzlePiece();
            _this.movePiecesAlgo.piecesMoves();
        });
    };
    return InitializeGame;
}());
var generatePuzzle = new GeneratePuzzle();
generatePuzzle.generatePuzzle();
var shufflePuzzlePieces = new ShufflePuzzlePieces();
shufflePuzzlePieces.shufflePuzzlePieces();
shufflePuzzlePieces.makeRectangular();
var removeRandomPuzzlePiece = new RemoveRandomPuzzlePiece();
removeRandomPuzzlePiece.removeRandomPuzzlePiece();
var movePiecesAlgo = new MovePiecesAlgo();
movePiecesAlgo.piecesMoves();
var initializeGame = new InitializeGame();
initializeGame.init();
