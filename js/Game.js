class Game{
    constructor(){
        this.board = new Board();
        this.players = this.createPlayers();
        this.ready = false;
    }

    get activePlayer(){
        return this.players.find(p => p.active);
    }

    /** 
     * Initializes game. 
     */    
    startGame(){
        this.board.drawHTMLBoard();
        this.activePlayer.activeToken.drawHTMLToken();
        this.ready = true;
    }
    /** 
     * Creates two player objects
     * @return  {Array}    An array of two Player objects.
     */
    createPlayers(){
        const players = [];
        players.push(new Player('Marci', 1,'#e15258', true));
        players.push(new Player('Gabi', 2, '#e59a13'));
        return players;
    }

    /**
     * Branches code, depending on what key player presses
     * @param   {Object}    e - Keydown event object
     */
    handleKeyDown(event){
        if(this.ready){
            if(event.key === "ArrowLeft"){
                this.activePlayer.activeToken.moveLeft();
            }else if(event.key === "ArrowRight"){
                this.activePlayer.activeToken.moveRight(this.board.columns);
            }else if(event.key === "ArrowDown"){
                this.playToken();
            }
        }
    }

    playToken(){
        const token = this.activePlayer.activeToken;
        const columnLocation = token.columnLocation;
        const spaces = this.board.spaces[columnLocation];
        let target = null;

        for(let i = spaces.length-1; i>=0; i--){
            if(!spaces[i].token){
                target = spaces[i];
                break;
            }
        }
        if(target){
            this.ready = true;
            const game = this;
            token.drop(target,function(){
                game.updateGameState(token, target);
            });
        }
    }

    /** 
     * Switches active player. 
     */
    switchPlayers(){
        for(let player of game.players){
            player.active = !player.active;
        }
    }

    /** 
     * Checks if there a winner on the board after each token drop.
     * @param   {Object}    target - Targeted space for dropped token.
     * @return  {boolean}   Boolean value indicating whether the game has been won (true) or not (false)
     */
    checkForWin(target){
    	const owner = target.token.owner;
    	let win = false;
	
    	// vertical
    	for (let x = 0; x < this.board.columns; x++ ){
            for (let y = 0; y < this.board.rows - 3; y++){
                if (this.board.spaces[x][y].owner === owner && 
    				this.board.spaces[x][y+1].owner === owner && 
    				this.board.spaces[x][y+2].owner === owner && 
    				this.board.spaces[x][y+3].owner === owner) {
                    	win = true;
                }           
            }
        }
	
    	// horizontal
    	for (let x = 0; x < this.board.columns - 3; x++ ){
            for (let y = 0; y < this.board.rows; y++){
                if (this.board.spaces[x][y].owner === owner && 
    				this.board.spaces[x+1][y].owner === owner && 
    				this.board.spaces[x+2][y].owner === owner && 
    				this.board.spaces[x+3][y].owner === owner) {
                    	win = true;
                }           
            }
        }
		
    	// diagonal
    	for (let x = 3; x < this.board.columns; x++ ){
            for (let y = 0; y < this.board.rows - 3; y++){
                if (this.board.spaces[x][y].owner === owner && 
    				this.board.spaces[x-1][y+1].owner === owner && 
    				this.board.spaces[x-2][y+2].owner === owner && 
    				this.board.spaces[x-3][y+3].owner === owner) {
                    	win = true;
                }           
            }
        }
	
    	// diagonal
    	for (let x = 3; x < this.board.columns; x++ ){
            for (let y = 3; y < this.board.rows; y++){
                if (this.board.spaces[x][y].owner === owner && 
    				this.board.spaces[x-1][y-1].owner === owner && 
    				this.board.spaces[x-2][y-2].owner === owner && 
    				this.board.spaces[x-3][y-3].owner === owner) {
                    	win = true;
                }           
            }
        }
	
    	return win;
    }
    
    /** 
     * Displays game over message.
     * @param {string} message - Game over message.      
     */
    gameOver(message){
        let messageElement = document.getElementById('game-over');
        messageElement.style.display = 'block';
        messageElement.textContent = message;
    }

     /** 
     * Updates game state after token is dropped. 
     * @param   {Object}  token  -  The token that's being dropped.
     * @param   {Object}  target -  Targeted space for dropped token.
     */
    updateGameState(token, target){
        target.mark(token);

        if(!this.checkForWin(target)){
            this.switchPlayers();
            if(this.activePlayer.checkTokens){
                this.activePlayer.activeToken.drawHTMLToken();
                this.ready = true;
            }else{
                this.gameOver('No more tokens');
            }
        }else{
            this.gameOver(`${target.owner.name} wins!`);
        }
    }
}