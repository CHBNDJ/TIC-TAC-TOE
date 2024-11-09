
let userSymbol;
let cpuSymbol;
let gameMode;

// Variables de score
let userScore = 0;
let cpuScore = 0;
let player1Score = 0;
let player2Score = 0;
let tiesScore = 0;

function saveSymbolChoices(symbol) {
    sessionStorage.setItem('selectedSymbol', symbol);
    userSymbol = symbol;
    cpuSymbol = symbol === 'X' ? 'O' : 'X';
    enableGameButtons();
    updateTurnDisplay();
}

function enableGameButtons() {
    document.getElementById('new-game-cpu').disabled = false;
    document.getElementById('new-game-player').disabled = false;
}

function startGame(mode) {
    gameMode = mode;
    const selectedSymbol = sessionStorage.getItem('selectedSymbol');
    
    document.querySelector('.game-menu').style.display = 'none';
    document.querySelector('.game-start').style.display = 'flex';

 // Définir les symboles en fonction du choix de l'utilisateur
if (selectedSymbol === 'X') {
    document.getElementById('YOU-symbol').innerText = 'X (YOU)';
    document.getElementById('CPU-symbol').innerText = 'O (CPU)';
    document.getElementById('player1-symbol').innerText = 'X (P1)';
    document.getElementById('player2-symbol').innerText = 'O (P2)'; 
    

} else {
    document.getElementById('YOU-symbol').innerText = 'O (YOU)';
    document.getElementById('CPU-symbol').innerText = 'X (CPU)';
    document.getElementById('player1-symbol').innerText = 'X (P1)';
    document.getElementById('player2-symbol').innerText = 'O (P2)';
   

    document.querySelector('.your-score').style.backgroundColor = "#F2B137";  // Couleur pour O
    document.querySelector('.cpu-score').style.backgroundColor = "#31C3BD"; 

}



if (gameMode === 'cpu') {
    document.querySelector('.your-score').style.display = 'flex';
    document.querySelector('.cpu-score').style.display = 'flex';
    document.querySelector('.ties-score').style.display = 'flex';
    document.querySelector('.player1-score').style.display = 'none';
    document.querySelector('.player2-score').style.display = 'none';
} else if (gameMode === 'player') {
    document.querySelector('.player1-score').style.display = 'flex';
    document.querySelector('.player2-score').style.display = 'flex';
    document.querySelector('.ties-score').style.display = 'flex';
    document.querySelector('.your-score').style.display = 'none';
    document.querySelector('.cpu-score').style.display = 'none';
}


if (gameMode === 'cpu' && turn === cpuSymbol) {
    setTimeout(cpuPlay, 800)
}

    resetBoard();
}

let turn = "X";

function updateTurnDisplay() {
    const xSymbol = document.getElementById('X-symbol');
    const oSymbol = document.getElementById('O-symbol');
    xSymbol.style.display = turn === 'X' ? 'flex' : 'none';
    oSymbol.style.display = turn === 'O' ? 'flex' : 'none';
    
}

document.getElementById('pick-symbol-row').addEventListener('click', function() {
    saveSymbolChoices('X');
});

document.getElementById('pick-symbol-circle').addEventListener('click', function() {
    saveSymbolChoices('O');
});

document.getElementById('new-game-cpu').addEventListener('click', function() {
    startGame('cpu');
});

document.getElementById('new-game-player').addEventListener('click', function() {
    startGame('player');
});

const clickInTurn = document.querySelectorAll('.grid-item');
clickInTurn.forEach(item => {
    item.addEventListener('click', addTurn);
});

function addTurn(e) {
    if (e.target.firstChild) return; // Empêche de jouer sur une case déjà occupée

    const turnDisplay = document.createElement('div');
    turnDisplay.classList.add(turn === 'X' ? 'cross' : 'circle');
    e.target.appendChild(turnDisplay);
    e.target.removeEventListener('click', addTurn);

    if (checkScore()) return; // Arrête le jeu si un gagnant est trouvé

    turn = turn === "X" ? "O" : "X";
    updateTurnDisplay();

    // Si le mode est CPU et c'est au tour du CPU, il joue automatiquement
    if (gameMode === 'cpu' && turn === cpuSymbol) {
        setTimeout(cpuPlay, 800);  // Délai pour simuler un temps de réflexion du CPU
    }
}

function cpuPlay() {
    const emptySquares = Array.from(document.querySelectorAll('.grid-item')).filter(square => !square.firstChild);

    if (emptySquares.length === 0) return; // Aucun coup possible si la grille est pleine

    // Choisir une case vide au hasard
    const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    
    const cpuMove = document.createElement('div');
    cpuMove.classList.add(cpuSymbol === 'X' ? 'cross' : 'circle');
    randomSquare.appendChild(cpuMove);
    randomSquare.removeEventListener('click', addTurn);

    if (checkScore()) return; // Arrête le jeu si le CPU gagne

    turn = turn === "X" ? "O" : "X";
    updateTurnDisplay();
}

function checkScore() {
    const allSquares = document.querySelectorAll('.grid-item');
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        const circleWins = combo.every(index => allSquares[index].firstChild?.classList.contains("circle"));
        const crossWins = combo.every(index => allSquares[index].firstChild?.classList.contains("cross"));

        if (circleWins || crossWins) {
            const winnerSymbol = circleWins ? 'O' : 'X';
            const winnerName = winnerSymbol === userSymbol ? "YOU" : "CPU";

           combo.forEach(index => {
                // Applique la couleur de fond et le box-shadow corrects
                if (winnerSymbol === 'X') {
                    allSquares[index].style.backgroundColor = '#31C3BD';
                    allSquares[index].style.boxShadow = 'inset 0 -8px 0 0 rgb(49, 195, 189)';
                } else {
                    allSquares[index].style.backgroundColor = '#F2B137';
                    allSquares[index].style.boxShadow = 'inset 0 -8px 0 0 rgba(242, 177, 55, 1)';
                }
                
                if (allSquares[index].firstChild) {
                    allSquares[index].firstChild.classList.add(winnerSymbol === 'X' ? 'winner-cross' : 'winner-circle');
                }
            });

            showVictoryOverlay(winnerName, winnerSymbol);
            return true;  // Jeu terminé, un gagnant a été trouvé
        }
    }

    // Vérification de match nul
    const isDraw = Array.from(allSquares).every(square => square.firstChild);
    if (isDraw) {
        showVictoryOverlay("DRAW");
        return true; // Jeu terminé, match nul
    }
    
    return false;  // Aucun gagnant pour l'instant
}


// Sélection du bouton restart présent dès le chargement de la page
const restartBtn = document.querySelector('.restart');

// Gestionnaire d'événement pour le bouton restart
restartBtn.addEventListener("click", () => {
    showVictoryOverlay(null, null, true);  // Appel avec isRestart = true pour afficher l'option de redémarrage
});

function showVictoryOverlay(winner, winningSymbol = null, isRestart = false) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const overlayBanner = document.createElement("div");
    overlayBanner.classList.add("overlay-banner");

    const bannerContainer = document.createElement("div");
    bannerContainer.classList.add("banner-container");

    const playerWins = document.createElement("p");
    const contentTitle = document.createElement("h1");
    contentTitle.classList.add("content-title");



 // Cas où on clique sur le bouton restart
    if (isRestart) {
        contentTitle.innerText = "RESTART GAME?";
        contentTitle.style.color = "#A8BFC9";
    } else {
        // Cas normal de victoire ou d'égalité
        if (winner === "DRAW") {
            contentTitle.innerText = "ROUND TIED";
            contentTitle.style.color = "#A8BFC9";
            tiesScore++; // Incrémente le score d'égalité
        } else {
            playerWins.innerText = winner === "YOU" ? 'YOU WON!' : 'OH NO YOU LOST...';
            contentTitle.innerText = `${winningSymbol} TAKES THE ROUND`;
            contentTitle.style.color = winningSymbol === "X" ? "#31C3BD" : "#F2B137";
            
            // Met à jour le score en fonction du mode et du gagnant
            if (gameMode === 'cpu') {
                if (winner === "YOU") {
                    userScore++;
                } else {
                    cpuScore++;
                }
            } else {
                if (winningSymbol === userSymbol) {
                    player1Score++;
                } else {
                    player2Score++;
                }
            }
        }

        updateScoreDisplay();  // Met à jour l'affichage des scores
        playerWins.classList.add("player-wins");
    }

    const contentBtn = document.createElement('div');
    contentBtn.classList.add("content-btn");

    const quitBtn = document.createElement('button');
    quitBtn.classList.add("quit-btn");
    quitBtn.innerText = "QUIT";

    const nextRoundBtn = document.createElement('button');
    nextRoundBtn.classList.add("next-round-btn");
    nextRoundBtn.innerText = "NEXT ROUND";
    nextRoundBtn.addEventListener("click", () => {
        overlay.remove();
        resetBoard();
        updateTurnDisplay();

        if (userSymbol === "X") {
            turn = "X";
        } else {
            turn = "X";
        }
        
        if (gameMode === 'cpu' && turn === cpuSymbol) {
            setTimeout(cpuPlay, 500);
        }
    })

    // Création des boutons "No, Cancel" et "Yes, Restart"
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add("cancel-btn");
    cancelBtn.innerText = "NO, CANCEL";
    cancelBtn.addEventListener("click", () => overlay.remove());  // Ferme la bannière sans action

    const restartGameBtn = document.createElement('button');
    restartGameBtn.classList.add("restart-game-btn");
    restartGameBtn.innerText = "YES, RESTART";
    restartGameBtn.addEventListener("click", () => location.reload()); //
       


    quitBtn.addEventListener("click", () => location.reload());
    nextRoundBtn.addEventListener("click", () => {
        overlay.remove();
        resetBoard();
    });

        // Ajouter les boutons au conteneur en fonction de isRestart
    if (isRestart) {
        contentBtn.appendChild(cancelBtn);
        contentBtn.appendChild(restartGameBtn);
    } else {
        contentBtn.appendChild(quitBtn);
        contentBtn.appendChild(nextRoundBtn);
    }

    overlay.appendChild(overlayBanner);
    overlayBanner.appendChild(bannerContainer);
    bannerContainer.appendChild(playerWins);
    bannerContainer.appendChild(contentTitle);
    bannerContainer.appendChild(contentBtn);
   

    document.body.appendChild(overlay);
}



// Met à jour l'affichage des scores
function updateScoreDisplay() {
    document.getElementById('score-YOU').innerText = userScore;
    document.getElementById('score-CPU').innerText = cpuScore;
    document.getElementById('score-TIES').innerText = tiesScore;
    document.getElementById('score-player1').innerText = player1Score;
    document.getElementById('score-player2').innerText = player2Score;
}

function resetBoard() {
    const allSquares = document.querySelectorAll('.grid-item');
    allSquares.forEach(square => {
        square.innerHTML = "";
        square.style.backgroundColor = "";
        square.style.boxShadow = "";
        square.addEventListener('click', addTurn);

        const symbol = square.firstChild;
        if (symbol) {
            symbol.classList.remove("winner-cross", "winner-circle");
        }
    });

    turn = "X";
    updateTurnDisplay();
}

updateTurnDisplay();
updateScoreDisplay();  // Initialise l'affichage des scores au chargement