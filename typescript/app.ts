

class GeneratePuzzle{
    getPuzzleParent = document.querySelector('.puzzle');
    getPuzzlePieces = document.querySelector('.puzzle').children;

    // Generate puzzle.

    generatePuzzle():void{
        for(let i = 1; i <= 15; i++){
            let div = document.createElement('div');
            let p = document.createElement('p');
            p.appendChild(document.createTextNode(String(i)));
            div.appendChild(p);
            div.setAttribute('id', String(i));
            div.setAttribute('data-attr', String(i));
            this.getPuzzleParent.appendChild(div);
        }
        let line = document.createElement('div');
        let lineHTML = document.createElement('p');
        line.setAttribute('id', String(16));
        line.setAttribute('data-attr', String(16));
        lineHTML.innerHTML = '-';
        line.appendChild(lineHTML);
        this.getPuzzleParent.appendChild(line);
    }

}

class SetBackgroundOfLinePiece{
    getPuzzlePieces = document.querySelector('.puzzle').children;
    SetBackgroundOfLinePiece():void{
        for(let i = 0; i < this.getPuzzlePieces.length; i++){
            if(this.getPuzzlePieces[i].tagName === 'DIV'){
                if(this.getPuzzlePieces[i].children[0].innerHTML === '-'){
                    this.getPuzzlePieces[i].style.backgroundColor = '#333333';
                }
            }
        }
    }
}


class ShufflePuzzlePieces{
    getPuzzle = document.querySelector('.puzzle');
    getPuzzlePieces = document.querySelector('.puzzle').children;
    // Insert after specific node.

    insertAfter(newNode, referenceNode):void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    // Add break to make 4x4 grid.

    makeRectangular():void{
        this.insertAfter(document.createElement('br'), this.getPuzzlePieces[3]);
        this.insertAfter(document.createElement('br'), this.getPuzzlePieces[8]);
        this.insertAfter(document.createElement('br'), this.getPuzzlePieces[13]);
    }

    shuffleArr(a){
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }

    shufflePuzzlePieces():void{

        let puzzlePiecesinnerHMTL : string[] = [];

        for(let i = 0; i < this.getPuzzle.children.length; i++){
            puzzlePiecesinnerHMTL.push(this.getPuzzle.children[i].innerHTML);
            this.getPuzzle.children[i].innerHTML = '';
        }

        this.shuffleArr(puzzlePiecesinnerHMTL);;

        for(let i = 0; i < puzzlePiecesinnerHMTL.length; i++){
            $(this.getPuzzle.children[i]).append(puzzlePiecesinnerHMTL[i]);
        }

    }

}

class MovePiecesAlgo{
    getPuzzlePieces = document.querySelector('.puzzle').children;
    puzzleToArr = Array.prototype.slice.call(this.getPuzzlePieces);
    moveRight : false;
    moveLeft : false;
    moveUp : false;
    moveDown : false;
    jArr = [[], [], [], []]


    createJaggedArr():void{
        let i = 0, j = 0;
        while(i < 18){
            // if(this.getPuzzlePieces[i] === undefined){
            //     break;
            // }
            if(i === 5){
                j++
            }
            if(i === 9){
                j++;
            }
            if(i === 14){
                j++;
            }
            if(i === 18){
                j++
            }
            this.jArr[j].push(this.getPuzzlePieces[i]);
            i++;
        }

        this.jArr[j].push(this.getPuzzlePieces[18]);



    }

    removeBrEl(){
        this.createJaggedArr();
        // for(let i = 0; i < this.jArr.length; i++){
        //     for(let j = 0; j < this.jArr[i].length; j++){
        //         if(this.jArr[i][j].tagName === 'BR'){
        //             this.jArr[i].splice(j, 1);
        //         }
        //     }
        // }
    }

    piecesMoves():void{
        let pieces = this.getPuzzlePieces;
        let emptyPiece;
        let left = 0;
        let right = 0;
        let moveX = 1;
        let moveY = 0;
        this.removeBrEl();
        checkGoal();
        
        $('.puzzle > div').on('click', function(){
            let sourceId = '#'+this.id;
            let sourceText =  $(sourceId).find('p').text();
            let targetText = '-';
            $('.puzzle > div').each(function() {
                $(this).hover(
                function() {
                    $(this).css('background-color', '#333333')
                }, function() {
                    $(this).css('background-color', '')
                });
                var id = '#' + this.id;
                if($(id).text() === '-'){
                    if(pieceRules(sourceId, id)){
                        $('.stats__num-of-tries > span').html(moveX++);
                        refreshGrid(id, sourceText);
                        $(id).css('background-color', '#191919');
                        $(id).removeClass('bg')
                        refreshGrid(sourceId, targetText);
                        $(sourceId).css('background-color', 'rgb(89, 89, 89)')
                        $(sourceId).addClass('bg');
                        if (checkGoal()){
                            $('.stats__victory').html('You won!!!');
                        }else{
                            $('.stats__victory').html('');
                        }
                    }else if (sourceId != id) {
                        return false;
                    }
                }
                
            });
        });


    }

}

function checkGoal() {
    var count = 0, loop = 1;

    $('.puzzle > div').each(function(){
        var id = '#' + this.id
        if (parseInt($(id).text()) === loop++){
            $(id).css('color', 'lightgreen');
            count++;
            } else {
            $(id).css('color', 'white');
        }
    });
    if (count === 15){
        return true;
    } else {
        return false;
  }
}

function refreshGrid(target, text){ 
  $(target).html(`<p>${text}</p>`);
}

function pieceRules(sourceId, targetId){
        switch(targetId){

            case '#16':
            if (sourceId === '#12' || sourceId === '#15'){
                return true;
            } else {
                return false;
            }
            case '#15':
            if (sourceId === '#11' || sourceId === '#14' || sourceId === '#16'){
                return true;
            } else {
                return false;
            }
            case '#14':
            if (sourceId === '#10' ||  sourceId === '#13' || sourceId === '#15'){
                return true;
            } else {
                return false;
            }
            case '#13':
            if (sourceId === '#9' || sourceId === '#14'){
                return true;
            } else {
                return false;
            }
            case '#12':
            if (sourceId === '#8' || sourceId === '#11' || sourceId === '#16'){
                return true;
            } else {
                return false;
            }

            case '#11':
            if (sourceId === '#7' || sourceId === '#10' || sourceId === '#12' || sourceId === '#15'){
                return true;
            } else {
                return false;
            }
            case '#10':
            if (sourceId === '#6' || sourceId === '#9' || sourceId === '#11' || sourceId === '#14'){
                return true;
            } else {
                return false;
            }
            case '#9':
            if (sourceId === '#5' || sourceId === '#10' || sourceId === '#13'){
                return true;
            } else {
                return false;
            }
            case '#8':
            if (sourceId === '#4' || sourceId === '#7' || sourceId === '#12'){
                return true;
            } else {
                return false;
            }
            case '#7':
            if (sourceId === '#3' || sourceId === '#6' || sourceId === '#8' || sourceId === '#11'){
                return true;
            } else {
                return false;
            }
            case '#6':
            if (sourceId === '#2' || sourceId === '#5' || sourceId === '#7' || sourceId === '#10'){
                return true;
            } else {
                return false;
            }
            case '#5':
            if (sourceId === '#1' || sourceId === '#6' || sourceId === '#9'){
                return true;
            } else {
                return false;
            }
            case '#4':
            if (sourceId === '#3' || sourceId === '#8'){
                return true;
            } else {
                return false;
            }
            case '#3':
            if (sourceId === '#2' || sourceId === '#4' || sourceId === '#7'){
                return true;
            } else {
                return false;
            }
            case '#2':
            if (sourceId === '#1' || sourceId === '#3' || sourceId === '#6'){
                return true;
            } else {
                return false;
            }
            case '#1':
            if (sourceId === '#2' || sourceId === '#5'){
                return true;
            } else {
                return false;
            }
        }

}

class InitializeGame{

    generatePuzzle = new GeneratePuzzle();
    shufflePuzzlePieces = new ShufflePuzzlePieces();
    setBackgroundOfLinePiece = new SetBackgroundOfLinePiece();
    movePiecesAlgo = new MovePiecesAlgo();

    init():void{
        $('.stats__shuffle').on('click', () => {
            $('.stats__num-of-tries > span').html(0);
            $('.puzzle').empty();
            generatePuzzle.generatePuzzle();
            this.shufflePuzzlePieces.shufflePuzzlePieces();
            this.shufflePuzzlePieces.makeRectangular();
            this.setBackgroundOfLinePiece.SetBackgroundOfLinePiece();
            this.movePiecesAlgo.piecesMoves();
        });

    }

}


let generatePuzzle = new GeneratePuzzle();

generatePuzzle.generatePuzzle();

let shufflePuzzlePieces = new ShufflePuzzlePieces();
shufflePuzzlePieces.shufflePuzzlePieces();
shufflePuzzlePieces.makeRectangular();

let setBackgroundOfLinePiece = new SetBackgroundOfLinePiece();
setBackgroundOfLinePiece.SetBackgroundOfLinePiece();

let movePiecesAlgo = new MovePiecesAlgo();
movePiecesAlgo.piecesMoves();

let initializeGame = new InitializeGame();
initializeGame.init();
