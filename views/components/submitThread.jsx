import React, {useState} from 'react';

import {validateThread} from '../../validation';
import {notifyError} from '../../helper';


const SubmitThread = ({boardName, threads, setThreads}) => {
  
  
  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    // validate input
    if(validateThread({text: obj['text'], password: obj['delete_password'], board: boardName})) return

    const url = '/api/threads/' + boardName;
    
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
      setThreads([data.createdThread, ...threads])
      
    })
    .catch(error => console.error('Error:', error));

    e.target.reset();
    document.getElementById('app').scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  
  return (
    <div id="submit-thread" className="submit-thread">
      <h3>Submit new Thread</h3>
      <div className="form-container">
        <form className="submit-thread-form" onSubmit={handleSubmit}>
          <textarea 
            className="form-thread" 
            type="text" 
            placeholder="Thread text..." 
            name="text"  
            defaultValue={""}
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
          <input className="form-submit" type="submit" defaultValue="Submit" />
        </form>
      </div>
    </div>
  );
}

export default SubmitThread;