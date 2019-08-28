import React, {useState} from 'react';

import NewThread from './newThread.jsx';
import Boards from './boards.jsx';
import AppTitle from './common/appTitle.jsx';

const Home = ({history}) => {
  
  return (
    <div className="inner-container">
      <AppTitle title={<h1>Anonymous Message Board</h1>} />
      <Boards />
      <NewThread history={history} />
    </div>
  );
}

export default Home;