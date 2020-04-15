const express = require('express')
const router = express.Router()
const mysql = require('mysql');
const db = require('../config/config.js') // เรียกใช้งานเชื่อมกับ MySQL

// Response handling
let response = {
  status: 200,
  isPass: false,
  data: [],
  message: "",
  totalPage: 0
};


router.get('/getall', function(req, res){
    let sql = ` SELECT r.* FROM role r `
    db.query(sql, function(err, result) {
      if(err){
        response.message = err
        response.isPass = false
        res.json(response)
      }else{
        response.data = result
        response.isPass = true
        res.json(response)
      }
      return res
    });
});


 
module.exports = router