import React, { Component } from 'react';
import Game from './Game';
import '../index.css';

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

export default GameContainer;
