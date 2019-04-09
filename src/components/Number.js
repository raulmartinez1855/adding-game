import React, { Component } from 'react';

class Number extends Component {
  render() {
    const { clickable } = this.props;
    return (
      <button
        type="button"
        className="nes-btn"
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

export default Number;
