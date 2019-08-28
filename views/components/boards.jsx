import React from 'react';


const Boards = () => {
  return (
    <div className="board">
      <h2>All Boards</h2>
      <div className="boards">
        <a className="board-link" href="/app/b/general">General</a>
        <a className="board-link" href="/app/b/test">Test</a>
        <a className="board-link" href="/app/b/board1">Board 1</a>
        <a className="board-link" href="/app/b/board2">Board 2</a>
        <a className="board-link" href="/app/b/board3">Board 3</a>
        <a className="board-link" href="/app/b/board4">Board 4</a>
      </div>
    </div>
  );
}

export default Boards;