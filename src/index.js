import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const colors = {
  new: 'lightblue',
  playing: 'deepskyblue',
  won: 'lightgreen',
  lost: 'lightcoral'
};

const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const computeTarget = (numbers, size) => {
  let target = 0;
  while (size--) {
    const randomElement = Math.floor(Math.random() * numbers.length);
    target += numbers[randomElement];
  }
  return target;
};

class Number extends Component {
  render() {
    const { clickable } = this.props;
    return (
      <button
        className="number"
        style={{
          opacity: clickable ? 1 : 0.3,
          pointerEvents: clickable ? 'auto' : 'none'
        }}
        onClick={this.props.onClick}
      >
        {this.props.value}
      </button>
    );
  }
}

class Game extends Component {
  state = {
    gameStatus: 'new',
    remainingSeconds: this.props.initialSeconds,
    selectedIds: []
  };
  /* Instance Properties */
  challengeNumbers = Array.from({ length: this.props.challengeSize }).map(
    () => {
      return randomNumberBetween(...this.props.challengeRange);
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
        console.log(selectedIds);
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
    const sum = idArray.reduce((acc, cv) => (acc += this.challengeNumbers[cv]));
    if (idArray.length !== this.props.answerSize) return 'playing';
    console.log(`sum === ${sum}, target === ${this.target}`);
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
        <div className="target" style={{ backgroundColor: colors[gameStatus] }}>
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
            <button onClick={this.startGame}>Start</button>
          )}
          {['won', 'lost'].includes(gameStatus) && (
            <button onClick={this.props.resetGame}>Play Again</button>
          )}
        </div>
      </div>
    );
  }
}

class GameContainer extends Component {
  state = {
    gameId: 1
  };

  resetGame = () => {
    this.setState(prevState => {
      const gameId = prevState.gameId + 1;
      return { gameId };
    });
  };

  render() {
    const { gameId } = this.state;
    return (
      <Game
        key={gameId}
        autoPlay={gameId > 1}
        challengeRange={[2, 8]}
        challengeSize={6}
        answerSize={4}
        initialSeconds={15}
        gameId={gameId}
        resetGame={this.resetGame}
      />
    );
  }
}

ReactDOM.render(<GameContainer />, document.getElementById('root'));
