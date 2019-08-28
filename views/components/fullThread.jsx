import React, {useState, useEffect} from 'react';

import {notifyInfo, notifyError, formatDate, removeItemFromArr} from '../../helper';


const FullThread = ({id, boardName, threads, setThreads, fullThread, setFullThread, history}) => {
  
  const [reportModal, setReportModal] = useState([]);
  const [deleteModal, setDeleteModal] = useState([]);

  const threadUrl = '/api/threads/' + boardName;
  const replyUrl  = '/api/replies/' + boardName;
  
  
  useEffect(() => {
    
    fetch(replyUrl + '?thread_id=' + id )
    .then(res => res.json())
    .then((data) => {
      console.log([data])
      if(!data.success) return notifyError(data.message)
      setFullThread([data.fullThread])
    })
    .catch(error => console.error('Error:', error));
    
  }, [])
  
  
  const showReportModal = ({reply_id, thread_id, text}) => {
    
    let modalIdx = reportModal.indexOf(thread_id);
    if(reply_id) modalIdx = reportModal.indexOf(reply_id);

    return (
       <div className="modal">
         <h3>Report this {text}?</h3>
         <button className="modal-btn" onClick={() => handleReport({reply_id, thread_id, idx: modalIdx, text})}>Yes</button>
         <button className="modal-btn" onClick={() => cancelReport(modalIdx)}>Cancel</button>
       </div>
    );
  }
  
  
  const showDeleteModal = ({reply_id, thread_id, replyIdx, threadIdx, text}) => {
    
    let modalIdx = deleteModal.indexOf(thread_id);
    if(reply_id) modalIdx = deleteModal.indexOf(reply_id);
      
    return (
       <div className="modal">
         <h3>Delete this {text}?</h3>
         <form onSubmit={e => handleDelete({e, reply_id, thread_id, replyIdx, threadIdx, modalIdx, text})}>
           <input className="modal-input" name='password' placeholder="Enter password" required/>
           <input className="modal-btn" type="submit" defaultValue="Submit" />
         </form>
         <button className="modal-btn" onClick={() => cancelDelete(modalIdx)}>Cancel</button>
       </div>
    );
  }
  
  
  const handleReport = ({reply_id, thread_id, idx, text}) => {
    
    let url = threadUrl
    if(reply_id) url = replyUrl
    
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify({reply_id, thread_id}), 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch(error => console.error('Error:', error));

    cancelReport(idx)
    notifyInfo(text + " has been reported. Thank you.")
  
  }  
  
  
  const handleDelete = ({e, reply_id, thread_id, threadIdx, replyIdx, modalIdx, text}) => {
    e.preventDefault();
    
    const inputSubmit = e.target[1];
    inputSubmit.disabled = true;
    
    let url = threadUrl
    if(reply_id) url = replyUrl

    const data = new FormData(e.target);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({thread_id, reply_id, delete_password: obj['password']}), 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      inputSubmit.disabled = false;
      
      if(!data.success) return notifyError("Password Incorrect!")
      
      notifyInfo(text + " has been removed.")
      
      if(!reply_id) return history.push('/app/b/' + boardName)
      
      fullThread[threadIdx].replies[replyIdx].text = '[deleted]'
      setFullThread(fullThread)
      cancelDelete(modalIdx)
      
    })
    .catch(error => console.error('Error:', error));

 }
  
  
 const cancelReport = idx => {
    setReportModal(removeItemFromArr(reportModal, idx))
 }
  
  
 const cancelDelete = idx => {
    setDeleteModal(removeItemFromArr(deleteModal, idx))
 }
  

 return (
    <div className="board">
      <h2>Full Thread</h2>
      <div className="threads">
        {fullThread[0] === undefined && <h3>Sorry. There are no posts for this link.</h3>}
        
        {fullThread[0] !== undefined && fullThread.map((thread, i) => {

        const replies = thread.replies.map((reply, j) => (
          <div key={reply._id} className="reply">
            {reportModal.includes(reply._id) && showReportModal({reply_id: reply._id, thread_id: thread._id, text: 'Reply'})}
            {deleteModal.includes(reply._id) && 
              showDeleteModal({reply_id: reply._id, thread_id: thread._id, threadIdx: i, replyIdx: j, text: 'Reply'})
            }
            <button 
              className="report"
              title="Report Reply" 
              onClick={() => setReportModal(reportModal.concat(reply._id))}
            >
              <i className="far fa-flag" title="Report Reply"></i>
            </button>
            <button 
              className="delete"
              title="Delete Reply"
              onClick={() => setDeleteModal(deleteModal.concat(reply._id))}
            >
              <i className="far fa-trash-alt" title="Delete Reply"></i>
            </button>
            <div className="reply-text">{reply.text}</div>
            <div className="reply-created">created: {formatDate(reply.created_on)}</div>
          </div>
        ))

        return (
          <div key={thread._id}  className="thread" >
            {reportModal.includes(thread._id) && showReportModal({thread_id: thread._id, text: 'Thread'})}
            {deleteModal.includes(thread._id) && showDeleteModal({thread_id: thread._id, threadIdx: i, text: 'Thread'})}
            <button 
              className="report"
              title="Report Thread" 
              onClick={() => setReportModal(reportModal.concat(thread._id))}
            >
              <i className="far fa-flag"></i>
            </button>
            <button 
              className="delete"
              title="Delete Thread"
              onClick={() => setDeleteModal(deleteModal.concat(thread._id))}
            >
              <i className="far fa-trash-alt"></i>
            </button>
            <div className="thread-text">{thread.text}</div>
            <div className="thread-created">created: {formatDate(thread.created_on)}</div>
            <div className="thread-updated">updated: {formatDate(thread.bumped_on)}</div>
            {replies[0] === undefined && <div className="reply-title">There are no replies yet. Want to start a conversation?</div>}
            {replies[0] !== undefined && (
                <React.Fragment>
                  <div className="reply-title">Replies:</div>
                  {replies}
                </React.Fragment>
              )
            }
            <div className="thread-links">
              <a className="add-reply"  href="#submit-reply">Add a reply</a>
            </div>
          </div>)
      })}
      </div>
    </div>
  );
}

export default FullThread;