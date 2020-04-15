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
    let sql = ` SELECT u.*,r.role_name FROM user u LEFT JOIN role r ON u.role_id = r.role_id`
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

router.get('/get/:id',function(req,res){
    let id = req.params.id
    let sql = ` SELECT * FROM user WHERE user_id = ${id} `
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

router.post('/create',function(req,res){
  console.log(req.body)
    let user_name = req.body['user_name'];
    let user_password = req.body['user_password'];
    let user_fname = req.body['user_fname'];
    let user_lname = req.body['user_lname'];
    let user_email = req.body['user_email'];
    let role_id = req.body['role_id'];
    let user_status = req.body['user_status'];
    let sql_chk = ` SELECT COUNT(*) AS COUNT FROM user WHERE user_name = '${user_name}' OR user_email = '${user_email}' `;
    let sql_add = ` INSERT INTO user (user_name, user_password, user_fname, user_lname, user_email, role_id, user_status)
    VALUES ('${user_name}', '${user_password}', '${user_fname}', '${user_lname}', '${user_email}', '${role_id}', '${user_status}') `;
    db.query(sql_chk, function(err, result) {
      if(err){
        response.message = err
        response.isPass = false
        res.json(response)
      }else{
        if(result[0].COUNT > 0){
          response.data = result
          response.isPass = false
          response.message = "Username or Email is already exist."
          res.json(response)
        }else{
          db.query(sql_add, function(err, result) {
            if(err){
              response.message = err
              response.isPass = false
              res.json(response)
            }else{
              response.data = result
              response.message = "Save success."
              response.isPass = true
              res.json(response)
            }
          });
        }
      }
      return res
    });
});

router.post('/update',function(req,res){
    let user_id = req.body['user_id'];
    let user_name = req.body['user_name'];
    let user_password = req.body['user_password'];
    let user_fname = req.body['user_fname'];
    let user_lname = req.body['user_lname'];
    let user_email = req.body['user_email'];
    let role_id = req.body['role_id'];
    let user_status = req.body['user_status'];
    let sql_chk = ` SELECT COUNT(*) AS COUNT FROM user WHERE user_id <> '${user_id}' AND (user_name = '${user_name}' OR user_email = '${user_email}') `;
    let sql = ` UPDATE user SET user_name = '${user_name}'
              , user_password = '${user_password}'
              , user_fname = '${user_fname}'
              , user_lname = '${user_lname}'
              , user_email = '${user_email}'
              , role_id = '${role_id}'
              , user_status = '${user_status}'
              WHERE user_id =  '${user_id}' `;
    db.query(sql_chk, function(err, result) {
      if(err){
        response.message = err
        response.isPass = false
        res.json(response)
      }else{
        if(result[0].COUNT > 0){
          response.data = result
          response.isPass = false
          response.message = "Username or Email is already exist."
          res.json(response)
        }else{
          db.query(sql, function(err, result) {
            if(err){
              response.message = err
              response.isPass = false
              res.json(response)
            }else{
              response.data = result
              response.message = "Save success."
              response.isPass = true
              res.json(response)
            }
          });
        }
      }
      return res
    });
});

router.post('/delete', function(req, res){
  let user_id = req.body['user_id'];
  let sql = ` DELETE FROM user WHERE user_id = '${user_id}' `
  db.query(sql, function(err, result) {
    if(err){
      response.message = err
      response.isPass = false
      res.json(response)
    }else{
      response.data = result
      response.message = "Delete success."
      response.isPass = true
      res.json(response)
    }
    return res
  });
});
 
// router.route('/getall?')
//     .get((req, res, next) => { 
//         // ทำการแสดงข้อมูลทั้งหมด
//         let sql = ' SELECT * FROM user '
//         console.log(db)
//         db.query(sql,(error, results, fields)=>{
//             // เกิด error ในคำสั่ง sql
//             if(error) return res.status(500).json({
//                 "status": 500,
//                 "message": "Internal Server Error" // error.sqlMessage
//             })
//             // แสดงข้อมูลกร๊ไม่เกิด error
//             const result = {
//                 "status": 200,
//                 "data": results
//             }
//             return res.json(result)        
//         })
//     })
    // .post(validation(schema),(req, res, next) => {   
    //     // เตรียมฟิดล์และค่าของข้อมูลที่จะเพิ่ม
    //     let user = {
    //         "name": req.body.name, 
    //         "email": req.body.email 
    //     }
    //     let sql = ' INSERT INTO tbl_users SET ? '
    //     db.query(sql, user, (error, results, fields)=>{
    //         // เกิด error ในคำสั่ง sql
    //         if(error) return res.status(500).json({
    //             "status": 500,
    //             "message": "Internal Server Error" // error.sqlMessage
    //         })
    //         // เพื่อไม่ต้องไปดึงข้อมูลที่เพิ่งเพิม มาแสดง ให้เราใช้เฉพาะ id ข้อมูลใหม่ที่เพิ่งเพิม
    //         // รวมกับชุดข้อมูลที่เพิ่งเพิ่ม เป็น ข้อมูลที่ส่งกลับออกมา
    //         user = [{'id':results.insertId, ...user}]
    //         const result = {
    //             "status": 200,
    //             "data": user
    //         }
    //         return res.json(result)        
    //     })
    // })
 
// router.route('/user/:id')
//     .all((req, res, next) => { 
//         // ตรวจสอบว่า id user ที่ส่งเข้ามาเพื่อดูข้อมูล / แก้ไข / ลบ มีอยู่ในฐานข้อมูลหรือไม่
//         let sql = ' SELECT * FROM tbl_users WHERE id = ? '
//         db.query(sql, [req.params.id], (error, results, fields)=>{
//             // เกิด error ในคำสั่ง sql
//             if(error) return res.status(500).json({
//                 "status": 500,
//                 "message": "Internal Server Error" // error.sqlMessage
//             })
//             // กรณีไม่พบข้อมูล 
//             if(results.length ===0) return res.status(400).json({
//                 "status": 400,
//                 "message": "Not found user with the given ID"
//             }) 
//             res.user = results // ถ้ามี id นั้นอยู่ในฐานข้อมูล ส่งข้อมูลผู้ใช้นั้นไปทำงานต่อ
//             next()  
//         })        
//     })
//     .get((req, res, next) => { 
//         // ถ้าเป็นการแสดงข้อมูลของ ผู้ใช้ id ใด ก็นำค่าที่ถูกส่งมาไปแสดง
//         const result = {
//             "status": 200,
//             "data": res.user
//         }
//         return res.json(result)
//     })
//     .put(validation(schema),(req, res, next) => {   
//         // ถ้าเป็นการแก้ไขข้อมูล ก็เตรียมรูปแบบข้อมูลที่รับมาสำหรับแก้ไข
//         let user = {
//             "name": req.body.name, 
//             "email": req.body.email 
//         }        
//         // ทำการอัพเดท โดยอิง id ที่พบ
//         let sql = ' UPDATE tbl_users SET ? WHERE id = ? '
//         db.query(sql, [user, req.params.id], (error, results, fields)=>{
//             // เกิด error ในคำสั่ง sql
//             if(error) return res.status(500).json({
//                 "status": 500,
//                 "message": "Internal Server Error" // error.sqlMessage
//             })
//             // ถ้ามีการแก้ไขค่าใหม่ 
//             if(results.affectedRows > 0) {
//                 // เอาค่าฟิลด์ทีได้ทำการอัพเดท ไปอัพเดทกับข้อมูลทั้งหมด
//                 user = Object.assign(res.user[0], user)
//             }else{ // มีการอัพเดท แต่เป็นค่าเดิม
//                 user = res.user
//             }
//             // ส่งรายการข้อมูลที่อัพเทกลับไป
//             const result = {
//                 "status": 200,
//                 "data": user
//             }
//             return res.json(result)        
//         })
//     })
//     .delete((req, res, next) => { 
//         // ถ้าเป็นการลบข้อมูล จาก id ใดๆ 
//         let sql = ' DELETE FROM tbl_users WHERE id = ? '
//         db.query(sql, [req.params.id],(error, results, fields)=>{
//             if(error) return res.status(500).json({
//                 "status": 500,
//                 "message": "Internal Server Error" // error.sqlMessage
//             })
//             // ใช้ค่าข้อมูลถ้าค้นเจอ ก่อนลบ ส่งออกไป เป็นการบอกว่า รายการนี้คือรายการที่ถูกลบไปแล้ว
//             const result = {
//                 "status": 200,
//                 "data": res.user
//             }
//             return res.json(result)        
//         })
//     })
 
module.exports = router