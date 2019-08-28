import React, {useState, useEffect} from 'react';
import AppTitle from './common/appTitle.jsx';
import SubmitThread from './submitThread.jsx';
import Threads from './threads.jsx';

const Board = ({history}) => {
  
  
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);

  const boardName = history.location.pathname.split('/')[3];
  const uppercaseBoardName = boardName.charAt(0).toUpperCase() + boardName.slice(1);
  
  
  return (
    <div className="inner-container">
      
      <AppTitle title={<h1>Welcome to <a href={"/app/b/"+boardName}>{uppercaseBoardName}</a> board</h1>} />
      
      <Threads
        boardName={boardName}
        threads={threads}
        setThreads={setThreads}
        replies={replies}
        setReplies={setReplies}
      />
      
      <SubmitThread 
        boardName={boardName}
        threads={threads}
        setThreads={setThreads}
      />
      
    </div>
  );
}

export default Board;