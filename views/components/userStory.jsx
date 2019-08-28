import React from 'react';
import AppTitle from './common/appTitle.jsx';

const UserStory = () => {
  return (
    <div className="inner-container">
      
      <AppTitle title={<h1>Anonymous Message Board</h1>} />
      <div className="user-story" >
        <h2>User Story</h2>
        <ol>
          <li>Only allow your site to be loading in an <i>iFrame</i> on your own pages.</li>

          <li>Do not allow <i>DNS prefetching</i>.</li>

          <li>Only allow your site to send the referrer for your own pages.</li>

          <li>I can <b>POST</b> a thread to a specific message board by passing form data text and delete_password to <code>/api/threads/{'{'}board{'}'}</code>.(Recomend res.redirect to board page <code>/b/{'{'}board{'}'})</code> Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).</li>

          <li>I can <b>POST</b> a reply to a thead on a specific board by passing form data text, delete_password, & thread_id to <code>/api/replies/{'{'}board{'}'}</code> and it will also update the bumped_on date to the comments date.(Recomend res.redirect to thread page <code>/b/{'{'}board{'}'}/{'{'}thread_id{'}'})</code> In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.</li>

          <li>I can <b>GET</b> an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from <code>/api/threads/{'{'}board{'{'}'}'}</code>. The reported and delete_passwords fields will not be sent.</li>

          <li>I can <b>GET</b> an entire thread with all it's replies from <code>/api/replies/{'{'}board{'}'}?thread_id={'{'}thread_id{'}'}</code>. Also hiding the same fields.</li>

          <li>I can delete a thread completely if I send a DELETE request to <code>/api/threads/{'{'}board{'}'}</code> and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')</li>

          <li>I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to <code>/api/replies/{'{'}board{'{'}'}'}</code> and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')</li>

          <li>I can report a thread and change it's reported value to true by sending a PUT request to <code>/api/threads/{'{'}board{'}'}</code> and pass along the thread_id. (Text response will be 'success')</li>

          <li>I can report a reply and change it's reported value to true by sending a PUT request to <code>/api/replies/{'{'}board{'}'}</code> and pass along the thread_id & reply_id. (Text response will be 'success')</li>

          <li>Complete functional tests that wholely test routes and pass.</li>
          
        </ol>
      </div>      
      
    </div>
  );
}

export default UserStory;