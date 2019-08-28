import React, {useState} from 'react';

import {validateReply} from '../../validation';
import {notifyError} from '../../helper';


const SubmitReply = ({id, boardName, fullThread, setFullThread}) => {
  
  
  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    // validate input
    if(validateReply({text: obj['text'], password: obj['delete_password'], board: boardName})) return
    
    obj['thread_id'] = id;

    const url = '/api/replies/' + boardName;
    
    fetch(url, {
      method: 'POST', 
      body: JSON.stringify(obj),
      headers: {
          'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      
      if(!data.success) return notifyError(data.message)
      setFullThread([data.createdReply])
      
    })
    .catch(error => console.error('Error:', error));

    e.target.reset();

  }
  
  return (
    <div id="submit-url" className="submit-thread">
      <h3>Submit new Reply</h3>
      <div className="form-container">
        <form className="submit-thread-form" onSubmit={handleSubmit}>
          <textarea 
            className="form-thread" 
            type="text" 
            placeholder="Reply text..." 
            name="text"  
            defaultValue={""}
            minLength='3'
            maxLength='250'
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
          <input className="form-submit" type="submit" defaultValue="Submit" />
        </form>
      </div>
    </div>
  );
}

export default SubmitReply;