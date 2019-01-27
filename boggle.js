const dice = [
	'aaafrs',
  'aaeeee',
  'aafirs',
  'adennn',
  'aeeeem',
  'aeegmu',
  'aegmnn',
  'afirsy',
  'bjkqxz',
  'ccenst',
  'ceiilt',
  'ceilpt',
  'ceipst',
  'ddhnot',
  'dhhlor',
  'dhlnor',
  'dhlnor',
  'eiiitt',
  'emottt',
  'ensssu',
  'fiprsy',
  'gorrvw',
  'iprrry',
  'nootuw',
  'ooottu'
];

class Boggle {
	constructor(){
		this.$score = jQuery( '.score' );
		this.$board = jQuery( '.board' );
		this.$dice = jQuery( 'li' );
		this.$word = jQuery( '.word' );
		this.$submit = jQuery( '.submit' );
		this.$previousWords = jQuery( '.previousWords' );
		this._started = false;
		this._currentWord = [];
		this._previousWords = [];
		this._score = 0;
		this._totalScore = 0;
		this._lastLetterIndexes = [];

		this.$dice.on( 'click', this.selectDie.bind( this ) );
		this.$submit.on( 'click', this.submitWord.bind( this ) );
	}

	get hasStarted(){
		return this._started;
	}

	set hasStarted( hasStarted ) {
		this._started = hasStarted;
	}

	get score(){
		return this._score;
	}

	set score( score ) {
		this._score = score;
	}

	get totalScore(){
		return this._totalScore;
	}

	set totalScore( totalScore ) {
		this._totalScore = totalScore;
	}

	get previousWords(){
		return this._previousWords;
	}

	set previousWords( word ) {
		this._previousWords.push( word );
	}

	// TODO: figure out if this is actually adjacent
	get isValidAdjacent(){
		return true;
	}

	transformQ(){
		return 'Qu';
	}

	generateDice(){
		this.$dice.each( ( i, e ) => {
			let diceBlock = dice[ i ],
				randomFace = Math.floor( Math.random() * 6 ),
				showingLetter = diceBlock[ randomFace ];

			jQuery( e ).html( showingLetter === 'q' ? this.transformQ() : showingLetter );
		});
	}

	start(){
		this.generateDice();
	}

	updateScore(){
		switch( this._currentWord.length ) {
			case 3:
			case 4:
				this.score = 1;
				break;
			case 5:
				this.score = 2;
				break;
			case 6:
				this.score = 3;
				break;
				break;
			case 7:
				this.score = 5;
				break;
				break;
			case 8:
				this.score = 11;
				break;
			default:
				this.score = 0;
				break;
		}
	}

	error( el ) {
		el.addClass( 'error' );

		setTimeout( () => {
			el.removeClass( 'error' );
		}, 500 );
	}

	updateWord(){
		this.updateScore();
		this.$word.text( this._currentWord.join( '' ) );
	}

	submitWord(){
		this.totalScore = this.totalScore + this.score;
		this.$score.text( this.totalScore );
		this.previousWords = this._currentWord.join( '' ) + ` ${this.score}`;
		this.$previousWords.html( this.previousWords.join( '<br />' ) );
	}

	addLetter( el ) {
		let i = el.data( 'index' ),
			letter = el.text();

		this.$dice.removeClass( 'previous' );
		// Add to store
		this._lastLetterIndexes.push( i );

		// Add to word
		this._currentWord.push( letter );

		// Select the dice
		el.addClass( 'selected' ).addClass( 'previous' );

		this.updateWord();
	}

	removeLetter( el ) {
		let i = el.data( 'index' ),
			letter = el.text(),
			previous;

		this.$dice.removeClass( 'previous' );

		// Remove last item from array
		this._lastLetterIndexes.splice( -1, 1 );

		// Remove last letter from word
		this._currentWord.splice( -1, 1 );

		previous = this._lastLetterIndexes[ this._lastLetterIndexes.length - 1 ];

		// Select the dice
		el.removeClass( 'selected' );

		jQuery( `li[data-index=${previous}]` ).addClass( 'previous' );

		this.updateWord();
	}

	selectDie( e ) {
		let el = jQuery( e.currentTarget ),
			i = el.data( 'index' ),
			letter = el.text();

		// The die is already selected, remove if it's the latest dice
		if ( el.hasClass( 'selected' ) ) {

			// If this is the last letter selected, deselect it
			if ( this._lastLetterIndexes.length > 1 && i !== this._lastLetterIndexes[ this._lastLetterIndexes.length - 1 ] ) {
				return this.error( el );
			}

			this.removeLetter( el );
		}

		// Already playing, check if the selected dice is adjacent
		else if ( this.hasStarted ) {

			// If not adjacent, show a UI treatment that it's not valid
			if ( ! this.isValidAdjacent ) {
				return this.error( el );
			}

			this.addLetter( el );
		}

		// Just starting
		else {
			this.hasStarted = true;

			this.addLetter( el );
		}
	}
}
