import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const createChallengeCells = (amount, range) => {
  let set = new Set();
  while (set.size < amount) {
    set.add(Math.floor(Math.random() * range));
  }
  return [...set];
};

const colors = {
  available: '#eee',
  challenge: 'deepskyblue',
  correct: 'lightgreen',
  wrong: 'lightcoral'
};

class Cell extends React.Component {
  backgroundColor() {
    if (this.props.showAsSelected) {
      return this.props.showAsChallenge ? colors.wrong : colors.correct;
    }
    if (this.props.showAsChallenge) {
      return colors.challenge;
    }
    return colors.available;
  }

  render() {
    return (
      <div
        onClick={() => this.props.onClick(this.props.id)}
        className="cell"
        style={{
          width: `${this.props.cellWidth}%`,
          background: this.backgroundColor()
        }}
      />
    );
  }
}

class Game extends React.Component {
  static messages = {
    new: 'Click the Start button to play',
    challenge: 'Memorize these blue cells',
    playing: 'Recall the cells that were blue',
    won: 'You Win!',
    lost: 'Game Over!'
  };

  constructor(props) {
    super(props);
    this.state = {
      gameStatus: 'new',
      selectedCells: []
    };
  }

  /* instance properties */
  grid = [...Array(Math.pow(this.props.gridSize, 2)).keys()];
  cellWidth = 100 / this.props.gridSize - 1;
  challengeCells = createChallengeCells(
    this.props.challengeSize,
    Math.pow(this.props.gridSize, 2)
  );
  playButtonClickable = true;

  startGame = () => {
    clearTimeout(this.timerId);
    this.challengeCells = createChallengeCells(
      this.props.challengeSize,
      Math.pow(this.props.gridSize, 2)
    );
    this.playButtonClickable = false;
    this.setState(
      {
        gameStatus: 'challenge',
        selectedCells: []
      },
      () => {
        this.playButtonClickable = true;
        this.timerId = setTimeout(() => {
          this.setState({ gameStatus: 'playing' });
        }, 3000);
      }
    );
  };

  calcGameStatus = newSelectedCells => {
    const numWrong = newSelectedCells.reduce((a, num) => {
      if (!this.challengeCells.includes(num)) a += 1;
      return a;
    }, 0);
    const numRight = newSelectedCells.reduce((a, num) => {
      if (this.challengeCells.includes(num)) a += 1;
      return a;
    }, 0);
    if (numWrong === this.props.wrongsAllowed) {
      return 'lost';
    }
    if (numRight === this.challengeCells.length) {
      return 'won';
    }
    return 'playing';
  };

  onCellClick = cellId => {
    this.setState(prevState => {
      const ableToChange =
        prevState.gameStatus === 'playing' &&
        !prevState.selectedCells.includes(cellId);
      if (ableToChange) {
        const selectedCells = [...prevState.selectedCells, cellId];
        return {
          selectedCells,
          gameStatus: this.calcGameStatus(selectedCells)
        };
      }
      return null;
    });
  };

  showChallengeCells = () => {
    return ['challenge', 'lost'].includes(this.state.gameStatus);
  };

  showSelectedCells = () => {
    return ['playing', 'won', 'lost'].includes(this.state.gameStatus);
  };

  gameIsIdle = () => {
    return ['new', 'won', 'lost'].includes(this.state.gameStatus);
  };

  render() {
    return (
      <div className="game">
        <div className="help">
          You will have 3 seconds to memorize {this.props.challengeSize} blue
          random cells
        </div>
        <div className="grid">
          {this.grid.map((cell, i) => {
            const cellIsChallenge = this.challengeCells.indexOf(i) >= 0;
            const cellIsSelected = this.state.selectedCells.indexOf(i) >= 0;
            return (
              <Cell
                key={i}
                id={i}
                onClick={this.onCellClick}
                showAsSelected={this.showSelectedCells() && cellIsSelected}
                showAsChallenge={this.showChallengeCells() && cellIsChallenge}
                cellWidth={this.cellWidth}
              />
            );
          })}
        </div>
        <button onClick={this.playButtonClickable ? this.startGame : null}>
          {this.gameIsIdle() && this.state.gameStatus === 'new'
            ? 'Start'
            : 'Play Again'}
        </button>
        <div className="message">{Game.messages[this.state.gameStatus]}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game gridSize={5} challengeSize={6} wrongsAllowed={3} />,
  document.getElementById('root')
);
