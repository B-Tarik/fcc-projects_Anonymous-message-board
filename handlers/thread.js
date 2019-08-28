'use strict';

const db = require('../models');
const Joi = require('@hapi/joi');
const sanitizeHtml = require('sanitize-html');


function validate(req) {
  const schema = {
    thread_id: Joi.objectId(),
    text: Joi.string().min(3).max(1500),
    delete_password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    board: Joi.string().valid('general', 'test', 'board1', 'board2', 'board3', 'board4')
  };
  return Joi.validate(req, schema, { stripUnknown: true });
}


async function getThreads(req, res, next) {
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
}


async function newThread(req, res, next) {
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
    
    const {error} = validate({text, delete_password, board});
    if (error) return res.json({message: error.details[0].message});
    
    thread.text = sanitizeHtml(thread.text)
  
    const createdThread = await db.Thread.create(thread)
    
    if(createdThread) return res.json({
            success: true,
            createdThread,
            redirectUrl: 'app/b/'+ board + '/'
        })
    
    res.json({message: 'something went wrong, Try again!'})
    
  } catch(err) {
    return next(err)
  }
}


async function reportThread(req, res, next) {
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
}


async function deleteThread(req, res, next) {
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
}


module.exports = {getThreads, newThread, reportThread, deleteThread}