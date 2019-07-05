const game = new Game();

const beginBtn = document.getElementById('begin-game');
/** 
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
beginBtn.addEventListener('click', function(){
    game.startGame();
    this.style.display = 'none';
    document.getElementById('play-area').style.opacity = '1';
});

/** 
 * Listen for keyboard presses
 */
document.addEventListener('keydown', function(event){
    game.handleKeyDown(event);
});