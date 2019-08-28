import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import AppTitle from './common/appTitle.jsx';

const CodeSolution = () => {
  
  
  return (
    <div className="inner-container">
      
      <AppTitle title={<h1>Anonymous Message Board</h1>} />
      <div className="code-solution">
        <h2>Code Solution</h2>
        <ol>
          
          <li>Only allow your site to be loading in an <i>iFrame</i> on your own pages.</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q1}
          </SyntaxHighlighter>

          <li>Do not allow <i>DNS prefetching</i>.</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q2}
          </SyntaxHighlighter>

          <li>Only allow your site to send the referrer for your own pages.</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q3}
          </SyntaxHighlighter>

          <li>I can <b>POST</b> a thread to a specific message board by passing form data text and delete_password to <code>/api/threads/{'{'}board{'}'}</code>.(Recomend res.redirect to board page <code>/b/{'{'}board{'}'})</code> Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q4}
          </SyntaxHighlighter>
          
          <li>I can <b>POST</b> a reply to a thead on a specific board by passing form data text, delete_password, & thread_id to <code>/api/replies/{'{'}board{'}'}</code> and it will also update the bumped_on date to the comments date.(Recomend res.redirect to thread page <code>/b/{'{'}board{'}'}/{'{'}thread_id{'}'})</code> In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q5}
          </SyntaxHighlighter>
          
          <li>I can <b>GET</b> an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from <code>/api/threads/{'{'}board{'{'}'}'}</code>. The reported and delete_passwords fields will not be sent.</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q6}
          </SyntaxHighlighter>
          
          <li>I can <b>GET</b> an entire thread with all it's replies from <code>/api/replies/{'{'}board{'}'}?thread_id={'{'}thread_id{'}'}</code>. Also hiding the same fields.</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q7}
          </SyntaxHighlighter>
          
          <li>I can delete a thread completely if I send a DELETE request to <code>/api/threads/{'{'}board{'}'}</code> and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q8}
          </SyntaxHighlighter>
          
          <li>I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to <code>/api/replies/{'{'}board{'{'}'}'}</code> and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q9}
          </SyntaxHighlighter>
          
          <li>I can report a thread and change it's reported value to true by sending a PUT request to <code>/api/threads/{'{'}board{'}'}</code> and pass along the thread_id. (Text response will be 'success')</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q10}
          </SyntaxHighlighter>
          
          <li>I can report a reply and change it's reported value to true by sending a PUT request to <code>/api/replies/{'{'}board{'}'}</code> and pass along the thread_id & reply_id. (Text response will be 'success')</li>

          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q11}
          </SyntaxHighlighter>
          
          <li>Complete functional tests that wholely test routes and pass.</li>
          
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q12_1}
          </SyntaxHighlighter>
          
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q12_2}
          </SyntaxHighlighter>
          
        </ol>
      </div>   
      
    </div>
  );
}

const q1 = `app.use(helmet.frameguard({ action: 'sameorigin' }))`;
  const q2 = `app.use(helmet.dnsPrefetchControl());`
  const q3 = `app.use(helmet.referrerPolicy({ policy: 'same-origin' }));`
  const q4 = `async function newThread(req, res, next) {
  try {
    const {board} = req.params;
    const {text, delete_password} = req.body
    const thread = {
      board,
      text,
      delete_password,
      created_on: new Date(),
      bumped_on : new Date(),
      reported : false,
      replies : []
    };
    
    const { error } = validate({text, delete_password, board});
    if (error) return res.json({message: error.details[0].message});
    
    thread.text = sanitizeHtml(thread.text)
  
    const createdThread = await db.Thread.create(thread)
    
    if(createdThread) return res.json({
            success: true,
            createdThread,
            redirectUrl: '/b/'+ board + '/'
        })
    
    res.json({message: 'something went wrong, Try again!'})
    
  } catch(err) {
    return next(err)
  }
}`
  const q5 = `async function newReply(req, res, next) {
  try {
    const {board} = req.params;
    const {thread_id, text, delete_password} = req.body;
    const reply = {
      text,
      delete_password,
      created_on : new Date(),
      reported : false,
    }
    
    const { error } = validate({thread_id, text, delete_password, board});
    if (error) return res.json({message: error.details[0].message});
    
    reply.text = sanitizeHtml(reply.text)

    const createdReply = await db.Thread.findOneAndUpdate({_id: thread_id}, {$set: {bumped_on: new Date()}, $push: {replies: reply}}, {new: true})
    if(createdReply) return res.json({success: true, createdReply})
    
    res.json({message: 'something went wrong, Try again!'})

  } catch(err) {
    return next(err)
  }
}`
  const q6 = `async function getThreads(req, res, next) {
  try {
    const {board} = req.params;
    
    const {error} = validate({board});
    if (error) return res.json({message: error.details[0].message});
    
    let threads = await db.Thread.find(
      {board}, 
      {replies: { $slice: -3 }},
      {
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      }
    )
      .sort({bumped_on: -1})
      .limit(10)
      .lean()
    
    threads.forEach(elm => elm.replycount = elm.replies.length)
    
    if(threads) return res.json({success: true, threads});

    res.json({message: 'not found!'})
    
  } catch(err) {
    return next(err)
  }
}`
  const q7 = `async function getReplies(req, res, next) {
  try {
    const {thread_id} = req.query;
    
    const { error } = validate({thread_id});
    if (error) return res.json({message: error.details[0].message});
      
    const fullThread = await db.Thread.findOne(
      {_id: thread_id},
      {
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      }
    )

    if(fullThread) return res.json({success: true, fullThread});

    res.json({message: 'not found!'})
    
  } catch(err) {
    return next(err)
  }
}`
  const q8 = `async function deleteThread(req, res, next) {
  try {
    const {thread_id, delete_password} = req.body;
    
    const { error } = validate({thread_id, delete_password});
    if (error) return res.json({message: error.details[0].message});
    
    const data = await db.Thread.findOneAndDelete({_id: thread_id, delete_password})
    
    if(data) return res.json({success:true})

    res.json({message:'incorrect password'})
    
  } catch(err) {
    return next(err)
  }
}`
  const q9 = `async function deleteReply(req, res, next) {
  try {
   const {thread_id, reply_id, delete_password} = req.body;
    
   const {error} = validate({thread_id, reply_id, delete_password});
   if (error) return res.json({message: error.details[0].message});
   
   const data = await db.Thread.findOneAndUpdate({
     _id: thread_id, replies : {
       $elemMatch: { _id: reply_id, delete_password}
     }
   }, {"replies.$.text": "[deleted]"})
   
   if(data) return res.json({success:true});
    
   res.json({message:'incorrect password'})
    
  } catch(err) {
    return next(err)
  }
}`
  const q10 = `async function reportThread(req, res, next) {
  try {
    const {thread_id} = req.body;
    
    const {error} = validate({thread_id});
    if (error) return res.json({message: error.details[0].message});
    
    const data = await db.Thread.findByIdAndUpdate(thread_id, {reported: true})
    
    if(data) return res.json({success:true})
    
    res.json({message: 'something went wrong, Try again!'})
    
  } catch(err) {
    return next(err)
  }
}`
  const q11 = `async function reportReply(req, res, next) {
  try {
   const {thread_id, reply_id} = req.body;
    
   const {error} = validate({thread_id, reply_id});
   if (error) return res.json({message: error.details[0].message});
  
   const data = await db.Thread.findOneAndUpdate({_id: thread_id, "replies._id": reply_id}, {"replies.$.reported": true})
   if(data) return res.json({success:true})
    
   res.json({message: 'something went wrong, Try again!'})
    
  } catch(err) {
    return next(err)
  }
}`
  const q12_1 = `suite('Functional Tests', function() {
  
  let Id; 
  let Id2; 
  let Id3; 

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
       test('creating 2 new threads', function(done) {
        chai.request(server)
        .post('/api/threads/test')
        .send({text:'new text', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
         
        chai.request(server)
        .post('/api/threads/test')
        .send({text:'new text 2', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('get 10 recent threads with max 3 replies', function(done){
        chai.request(server)
        .get('/api/threads/test')
        .query({})
        .end(function(err,res){
          assert.equal(res.status, 200);
          
          assert.isObject(res.body);
          
          assert.isAtMost(res.body.threads.length, 10);
          assert.isAtMost(res.body.threads[0].replies.length, 3);
          
          assert.property(res.body.threads[0], '_id');
          assert.property(res.body.threads[0], 'created_on');
          assert.property(res.body.threads[0], 'bumped_on');
          assert.property(res.body.threads[0], 'text');
          assert.property(res.body.threads[0], 'replies');
          
          Id = res.body.threads[0]._id;
          Id2 = res.body.threads[1]._id;
          
          done();
        })
      })
      
    });
    
    suite('DELETE', function() {
      
      test('delete thread with good password', function(done) {
        chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id:Id, delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"success":true}');
          done();
        });
      });
      
      test('delete thread with bad password', function(done) {
        chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id: Id2, delete_password: 'nopass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"message":"incorrect password"}');
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      
      test('report thread', function(done) {
        chai.request(server)
        .put('/api/threads/test')
        .send({thread_id: Id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"success":true}');
          done();
        });
      });
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('reply to thread', function(done) {
        chai.request(server)
        .post('/api/replies/test')
        .send({thread_id: Id2, text:'a new reply', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('Get all replies for 1 thread', function(done) {
        chai.request(server)
        .get('/api/replies/test')
        .query({thread_id: Id2})
        .end(function(err, res){
          assert.isObject(res.body);
          
          assert.equal(res.status, 200);
          assert.equal(res.body.fullThread.replies[res.body.fullThread.replies.length-1].text, 'a new reply');
          
          assert.property(res.body.fullThread, '_id');
          assert.property(res.body.fullThread, 'created_on');
          assert.property(res.body.fullThread, 'bumped_on');
          assert.property(res.body.fullThread, 'text');
          assert.property(res.body.fullThread, 'replies');
          
          Id3 = res.body.fullThread.replies[0]._id;
          
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      
      test('report reply', function(done) {
        chai.request(server)
        .put('/api/replies/test')
        .send({thread_id:Id2 ,reply_id:Id3})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"success":true}');
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
      test('delete reply with bad password', function(done) {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: Id2 ,reply_id: Id3, delete_password: 'nopass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"message":"incorrect password"}');
          done();
        });
      });
      
      test('delete reply with valid password', function(done) {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: Id2 ,reply_id: Id3, delete_password: 'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"success":true}');
          done();
        });
      });
      
    });
    
  });

});`
  
  const q12_2 = `  Functional Tests

    API ROUTING FOR /api/threads/:board

      POST

        ✓ creating 2 new threads (657ms)

      GET

        ✓ get 10 recent threads with max 3 replies (132ms)

      DELETE

        ✓ delete thread with good password (93ms)

        ✓ delete thread with bad password (80ms)

      PUT

        ✓ report thread (95ms)

    API ROUTING FOR /api/replies/:board

      POST

        ✓ reply to thread (103ms)

      GET

        ✓ Get all replies for 1 thread (176ms)

      PUT

        ✓ report reply (111ms)

      DELETE

        ✓ delete reply with bad password (123ms)

        ✓ delete reply with valid password (80ms)



  10 passing (2s)`

export default CodeSolution;