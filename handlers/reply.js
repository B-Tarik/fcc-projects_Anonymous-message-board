'use strict';

const db = require('../models');
const Joi = require('@hapi/joi');
const sanitizeHtml = require('sanitize-html');


function validate(req) {
  const schema = {
    reply_id: Joi.objectId(),
    thread_id: Joi.objectId(),
    text: Joi.string().min(3).max(250),
    delete_password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    board: Joi.string().valid('general', 'test', 'board1', 'board2', 'board3', 'board4')
  };
  return Joi.validate(req, schema, { stripUnknown: true });
}


async function getReplies(req, res, next) {
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
}


async function newReply(req, res, next) {
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
}


async function reportReply(req, res, next) {
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
}


async function deleteReply(req, res, next) {
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
}


module.exports = {getReplies, newReply, reportReply, deleteReply}