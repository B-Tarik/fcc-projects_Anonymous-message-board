import React, {useState, useEffect} from 'react';
import AppTitle from './common/appTitle.jsx';
import FullThread from './fullThread.jsx';
import SubmitReply from './submitReply.jsx';


const Thread = ({history}) => {
  
  const [fullThread, setFullThread] = useState([]);

  const arr = history.location.pathname.split('/')
  const id = arr[4];
  const boardName = arr[3];
  const uppercaseBoardName = boardName.charAt(0).toUpperCase() + boardName.slice(1);
  
  
  return (
    <div className="inner-container">
      
      <AppTitle title={<h1>Welcome to <a href={"/app/b/"+boardName}>{uppercaseBoardName}</a> board</h1>} />
      
      <FullThread 
        id={id} 
        boardName={boardName}
        fullThread={fullThread}
        setFullThread={setFullThread}
        history={history}
      />
      
      <SubmitReply 
        id={id}
        boardName={boardName}
        fullThread={fullThread}
        setFullThread={setFullThread}
      />
      
    </div>
  );
}

export default Thread;