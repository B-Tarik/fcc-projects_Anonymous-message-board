'use strict';

export const validateThread = ({text, password, board}) => {
  
  const textLength = `${text}`.length;
  const arr = ['general', 'test', 'board1', 'board2', 'board3', 'board4'];
  
  if(textLength < 3 || textLength > 1500) return false
  if(/^[a-zA-Z0-9]{3,30}$/.test(password)) return false
  if(arr.indexOf(board) === -1) return false
  
  return true
}


export const validateReply = ({text, password, board}) => {
  
  const textLength = `${text}`.length;
  const arr = ['general', 'test', 'board1', 'board2', 'board3', 'board4'];
  
  if(textLength < 1 || textLength > 250) return false
  if(/^[a-zA-Z0-9]{3,30}$/.test(password)) return false
  if(arr.indexOf(board) === -1) return false
  
  return true
}