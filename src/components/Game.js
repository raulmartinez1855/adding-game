import React, { Component, Fragment } from 'react';
import Number from './Number';

const colors = {
  new: 'lightblue',
  playing: 'deepskyblue',
  won: 'lightgreen',
  lost: 'lightcoral'
};

const computeTarget = (numbers, size) => {
  const selections = new Set();

  while (selections.size < size) {
    const randomElement = Math.floor(Math.random() * numbers.length);
    selections.add(randomElement);
  }

  let target = 0;
  selections.forEach(v => {
    target += numbers[v];
  });

  return target;
};

const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Game extends Component {
  state = {
    gameStatus: 'new',
    remainingSeconds: this.props.initialSeconds,
    selectedIds: []
  };
  /* Instance Properties */
  challengeNumbers = Array.from({ length: this.props.challengeSize }).map(
    () => {
      const [min, max] = this.props.challengeRange;
      return randomNumberBetween(min, max);
    }
  );
  target = computeTarget(this.challengeNumbers, this.props.answerSize);

  /* Lifecycle Methods */
  componentDidMount() {
    if (this.props.autoPlay) this.startGame();
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  /* Class Methods */
  isClickable = index => !this.state.selectedIds.includes(index);

  startGame = () => {
    this.setState({ gameStatus: 'playing' }, () => {
      this.intervalId = setInterval(() => {
        this.decreaseSeconds();
      }, 1000);
    });
  };

  decreaseSeconds = () => {
    this.setState(prevState => {
      const remainingSeconds = prevState.remainingSeconds - 1;
      if (remainingSeconds === 0) {
        clearInterval(this.intervalId);
        return { gameStatus: 'lost', remainingSeconds: 0 };
      }
      return { remainingSeconds };
    });
  };

  selectNumber = index => {
    this.setState(
      prevState => {
        if (this.state.gameStatus !== 'playing') return null;
        const selectedIds = [...prevState.selectedIds, index];
        return { gameStatus: this.calcGameStatus(selectedIds), selectedIds };
      },
      () => {
        if (this.state.gameStatus !== 'playing') {
          clearInterval(this.intervalId);
        }
      }
    );
  };

  calcGameStatus = idArray => {
    const sum = idArray.reduce((acc, cv) => {
      return (acc += this.challengeNumbers[cv]);
    }, 0);
    console.log(`sum === ${sum}, target === ${this.target}`);
    if (idArray.length !== this.props.answerSize) return 'playing';
    return sum === this.target ? 'won' : 'lost';
  };

  render() {
    const { answerSize, initialSeconds } = this.props;
    const { gameStatus, remainingSeconds } = this.state;
    return (
      <div className="game">
        <div className="help">
          Pick {answerSize} numbers that sum to the target in {initialSeconds}{' '}
          seconds
        </div>
        <div className="target nes-containernes-container" style={{ backgroundColor: colors[gameStatus] }}>
          {gameStatus === 'new' ? '?' : this.target}
        </div>
        <div className="challenge-numbers">
          {this.challengeNumbers.map((v, i) => {
            return (
              <Number
                key={i}
                index={i}
                onClick={() => this.selectNumber(i)}
                value={gameStatus === 'new' ? '?' : v}
                clickable={this.isClickable(i)}
              />
            );
          })}
        </div>
        <div className="footer">
          {gameStatus === 'playing' && (
            <div className="timer-value">{remainingSeconds}</div>
          )}
          {gameStatus === 'new' && (
            <button className="nes-btn is-error" onClick={this.startGame}>
              Start
            </button>
          )}
          {['won', 'lost'].includes(gameStatus) && (
            <Fragment>
              <div>You {gameStatus}</div>
              <button
                className="nes-btn is-error"
                onClick={this.props.resetGame}
              >
                Play Again
              </button>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default Game;
