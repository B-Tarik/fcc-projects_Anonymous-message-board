import React, {useState} from 'react';

import {validateThread} from '../../validation';

const NewThread = ({history}) => {

  
  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    var obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    // validate input
    if(validateThread({text: obj['text'], password: obj['delete_password'], board: obj['board']})) return 
    
    const url = '/api/threads/' + obj['board'];
    
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj), 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      history.push(data.redirectUrl)
    })
    .catch(error => console.error('Error:', error));
  }
  
  
  return (
    <div className="new-thread">
      <h3>Create new Thread</h3>
      <div className="form-container">
        <form className="new-thread-form" onSubmit={handleSubmit}>
          <textarea 
            className="form-thread" 
            type="text" 
            placeholder="Thread text..." 
            name="text"  
            minLength='3'
            maxLength='1500'
            required
          />
          <input 
            className="form-password" 
            type="text" 
            placeholder="Password to delete" 
            name="delete_password"
            pattern='^[a-zA-Z0-9]{3,30}$'
            title="Use only letters and numbers. (3 chars min - 30 max)"
            required 
          />
          <select className="form-board" name="board" required>
            <option value="">Select Board</option>
            <option value="general">General</option>
            <option value="test">Test</option>
            <option value="board1">Board 1</option>
            <option value="board2">Board 2</option>
            <option value="board3">Board 3</option>
            <option value="board4">Board 4</option>
          </select>
          <input className="form-submit" type="submit" defaultValue="Submit" />
        </form>
      </div>
    </div>
  );
}

export default NewThread;