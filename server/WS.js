//var mongoose = require ('mongoose');
//var grade = require ('./grade');
var request = require("request")
var http = require ('http');
var https = require ('https');  
var gradeM;
// Serialize a document 


var viewArr=module.exports=
{

    getRecommended : function (res) { 
        var url =
        request({
          url:'https://api.themoviedb.org/3/tv/on_the_air?api_key=fa67dde53cd1a4800f274049291de923' ,
           json: true
          }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
        res.json(body); // Print the json response
    }
});

    },

    airingToday : function (res,date) { 

        request({
            url: 'http://api.tvmaze.com/schedule?country=US&date='+String(date),
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {   
        res.json(body); // Print the json response
    }
})
        
        // gradeM.aggregate( { $unwind: '$students'},{ $match: {'students.GPA': {$gte: 90}}}
        //     ,{ $group: {_id:'$year',
        //     students: {$push: {id:'$students.id',firstName:'$students.firstName',
        //     lastName:'$students.lastName',
        //     GPA:'$students.GPA',}}}},{$project : {
        //         _id : 0 ,
        //         year : '$_id' ,
        //         students : '$students'
        //     }},{$sort:{year:1}}).exec(function (err, data) {
        //         if (err) {res.set('Status' , 404 );
        //         res.send( "err: " + err);}
        //         else
        //         {
        //             res.set('Status' , 200 );
        //             res.send(JSON.stringify(data)); 
        //         }});
    },

    getStudGradeByID : function (id,gradeM,res) {  //get student's grades by id
    gradeM.aggregate( { $unwind: '$students'},{ $match: {'students.id': {$eq: parseInt(id)},'students.GPA': {$gte: 90}}}
        ,{ $group: {_id:'$year',
        students: {$push: {id:'$students.id',firstName:'$students.firstName',
        lastName:'$students.lastName',
        GPA:'$students.GPA',}}}},{$project : {
            _id : 0 ,
            year : '$_id' ,
            students : '$students'
        }},{$sort:{year:1}}).exec(function (err, data) {
            if (err) {res.set('Status' , 404 );
            res.send( "err: " + err);}
            else
            {
                res.set('Status' , 200 );
                res.send(JSON.stringify(data)); 
            }});

    },

        getExcellenceByYear: function(year,gradeM,res) {   //get all students with GPA>=90 by year
            gradeM.aggregate( {$match: {year: parseInt(year)}},{ $unwind: '$students'},{$match: {'students.GPA': {$gte: 90}}},
                { $group: {_id:'$year',
                students: {$push: {id:'$students.id',firstName:'$students.firstName',
                lastName:'$students.lastName',
                GPA:'$students.GPA',}}}},{$project : {
                    _id : 0 ,
                    year : '$_id' ,
                    students : '$students'
                }},{$sort:{year:1}}).exec(function (err, data) {
                    if (err) {res.set('Status' , 404 );
                    res.send( "err: " + err);}
                    else
                    {
                        res.set('Status' , 200 );
                        res.send(JSON.stringify(data)); 
                    }});
            }

        };