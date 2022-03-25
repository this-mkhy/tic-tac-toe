import React from 'react';
import './style.css'

/*
Projct Hierachy
  1-TicTacToe
    2-Game: The Game component renders a board with placeholder values
      3-Board: The Board renders 9 squares
        4-Square: The Square component renders a single <button>
*/

class TicTacToe extends React.Component {
  render() {
    return (
      <div className='tictactoe'>
        <Game />
      </div>
    );
  }
}
export default TicTacToe;

class Game extends React.Component {
  //Lifting State Up
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    //Stores a game’s history as a game progresses
    //To allows players to review a game’s history and see previous versions of a game’s board
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
     
    //Immutability  concept
    //create a copy of the squares array to modify instead of modifying the existing array
    //const squares = this.state.squares.slice();
    const squares = current.squares.slice();
    
    //ignoring a click if someone has won the game or if a Square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // if (this.state.xIsNext)
    //   squares[i] = 'X';
    // else
    //   squares[i] = 'O';

    this.setState({
      //squares: squares,
      history: history.concat([{
        squares: squares,
      }]),
      //stepNumber: 0,
      stepNumber: history.length,
      //flip the value of xIsNext from true to false and vice versa so “X”s and “O”s can take turns
      xIsNext: !this.state.xIsNext
    });
  }

  //to update stepNumber
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      //set xIsNext to true if the number that we’re changing stepNumber to is even
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    //const current = history[history.length - 1];
    const current = history[this.state.stepNumber];

    //let winnerData = calculateWinner(current.squares);
    //console.log(winnerData)
    //[squares[a], [a,b,c]]

    let winner = calculateWinner(current.squares);
    console.log(winner) 
    let nextPlayer = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    let winnerStatus;
    if (winner) {
      winnerStatus = 'Congratulations!! Winner: ' + winner[0] ;
      nextPlayer = ''
    } else if(this.state.stepNumber===9){
      winnerStatus = 'Opps, Draw .. No one win '
      nextPlayer = ''
    }

    const moves = history.map((step, move) => {
      const desc = move 
        ? 'Go to move #' + move 
        : 'Go to game start';
      return (
        <li key={move}>
          <button className='bold'
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <div className="status">{nextPlayer}</div> 
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <h2 className="winner"><mark>{winnerStatus}</mark></h2>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
 
class Board extends React.Component {
 
  renderSquare(i) {
    //send squares as a props. will either be 'X', 'O', or null for empty squares
    return (<Square 
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}/>
    );
  }

  render() {

    return (
      <div className='board'>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
 
//controlled components
//the Square components are now controlled components because the Board has full control over them
//Why? Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they’re clicked
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

//calculate who win
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a,b,c]];
      //return [a,b,c]; 
    }
  }

  return null;
}
