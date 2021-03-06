var http = require ('http');    
var url = require('url') ;
var GInfo = require ('./WS');
var express= require('express');
var app= express();
var port = process.env.PORT || 3000;
var mongoose = require ('mongoose');
mongoose.connect ('mongodb://tvt:tvt@ds013004.mlab.com:13004/tvtime');
var conn=mongoose.connection;
// var fs = require("fs");
var user = require ('./user');
var show = require ('./show');
var showM= mongoose.model('Show',show);
var userM= mongoose.model('User',user); 

conn.on('error', function(err) {
    console.log('connection error: ' + err);
 });

conn.once('open',function() {
     console.log('connected successfuly to the remote DB');
    app.get('/airing',function(req, res){

        console.log("Airing list "+req.query.date);
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
          GInfo.airingToday(res,req.query.date); 
    });



    app.get('/insertUserShow',function(req, res){

        console.log("insert new show "+req.query.name+" for user "+req.query.user);
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
          GInfo.insertUserShow(res,req.query.name,req.query.id,req.query.img,req.query.user,userM,showM); 
    });

    app.get('/getUserShows',function(req, res){

        console.log("Getting shows list for user "+req.query.userID);
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
          GInfo.getUserShows(res,req.query.userID,userM); 
    });

    app.get('/removeUserShow',function(req, res){

        console.log("remove show "+req.query.name+" for user "+req.query.user);
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
          GInfo.removeUserShow(res,req.query.name,req.query.id,req.query.user,userM,showM); 
    });

    app.post('/Usersignin',function(req, res){
        
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
        GInfo.insertUser(res,req.query.idtoken,userM); 
          
    });

    app.get('/showdata',function(req, res){

        console.log("get show "+req.query.id+" details");
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
          GInfo.showdata(res,req.query.id); 
    });

     app.get('/updateUserShowEpisode',function(req, res){

        console.log("update show "+req.query.showId+" details");
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
          GInfo.updateUserShowEpisode(res,req.query.id,req.query.showId,req.query.season,req.query.episode,userM); 
    });

      app.get('/checkShow',function(req, res){
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
          GInfo.checkShow(res,req.query.showID,req.query.userID,userM); 
    });

      app.get('/youtube',function(req, res){
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
          GInfo.youtube(res,req.query.name); 
    });



    app.get('/explore',function(req, res){

        console.log("recommended series");
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
        GInfo.getRecommended(res);

    });


    app.get('/search',function(req, res){

        console.log("recommended series");
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
        GInfo.search(res,req.query.query);

    });

       app.get('/showEpisode',function(req, res){
        console.log("get episode details for show "+req.query.id);
        res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Status' :200});
        GInfo.showEpisode(res,req.query.id,req.query.season,req.query.episode);

    });


    app.get('/getAllStud',function(req, res){
        console.log("Getting all students grades list");   
        res.set('function-name' , 'getAllStud' );
        res.set('parameter' , 'none' );
        GInfo.getAllStud(gradeM,res);
        

    });

    app.get('/getStudGradeByID',function(req,res){
        console.log("Getting all excellent student's grades by ID="+req.query.id);   
        res.set('function-name','getStudGradeByID');
        res.set('parameter','id='+req.query.id);
        GInfo.getStudGradeByID(req.query.id,gradeM,res);
    });

    app.get('/getExcellenceByYear',function(req,res){
        console.log("Getting all excellent students grades by Year="+req.query.year);
        res.set('function-name','getExcellenceByYear');
        res.set('parameter','year='+req.query.year);
        GInfo.getExcellenceByYear(req.query.year,gradeM,res);
    });



    app.listen(port);
    console.log("listening on port "+port+" and waiting for WS requests");
    
 });







