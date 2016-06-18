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

     search : function (res,query) { 
        var url =
        request({
          url:'https://api.themoviedb.org/3/search/tv?query='+query+'&api_key=fa67dde53cd1a4800f274049291de923' ,
          json: true
      }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
        res.json(body); // Print the json response
    }
});

    },

    youtube : function (res,name) { 
      var YouTube = require('youtube-node');

      var youTube = new YouTube();

      youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

      youTube.search(name+' Trailer', 2, function(error, result) {
          if (error) {
            console.log(error);
        }
        else {
            console.log(JSON.stringify(result, null, 2));
        }
    });

  },

  insertUserShow : function (res,showName,showID,link,userID,userM,showM) {

    var newShow= {
        "id": showID,
        "name":showName,
        "season":1,
        "ep_id": 1,
        "active":true,
        "link":link
    };

    var ShowRec= {
        "id": showID,
        "name":showName,
        "viewers":1
    };

    userM.find({ id: userID },{ shows: { $elemMatch: { id: showID} } } ).exec(function(err,doc){
        var d=JSON.parse(JSON.stringify(doc));
        d.forEach(function(obj)
        { 
            if(obj.shows==0) //update new show for user
            {

                userM.findOne().where('id',userID).update({ 'shows.id': {$ne: newShow.id}}, 
                    {$push: {shows:newShow}
                }
                ).exec(function(err,doc){
                    if (err) {
                        console.log(err);
                    }
                    console.log("viewer "+userID+" is now tracking show "+showID);

                });
            }
            else
            { //enable existing disabled show
                userM.findOne().where('id',showID).update({id: userID, 'shows.id': showID}, 
                    {'$set': {
                        'shows.$.active':true          
                    }}).exec(function(err,doc){
                        console.log("show "+showID+" exists as non-active for viewer "+userID+",show reactivated");
                

                    });


                }

                showM.findOne().where('id',showID).exec(function(err,doc){console.log("doc-"+doc);
                    if(doc==null || doc=="null")
                    {

                        showM.create(ShowRec,function(err,doc){
                            console.log("show "+showID+" added to show DB for the first time");

                        });
                    }
                    else
                    {
                        showM.findOne().where('id',showID).update({id: showID}, 
                            { $inc: { viewers: 1 } }).exec(function(err,doc){
                                console.log("additional viewer added for show "+showID);

                            });                                

                        }

                    });


            }

            );

    });
    

    
    res.end();

},

getUserShows : function (res,userID,userM) {


 userM.find({id: userID}).exec(function(err,doc){
    res.json(doc);

});


},


removeUserShow : function (res,showName,showID,userID,userM,showM) {


 userM.update(
    {id: userID, 'shows.id': showID}, 
    {'$set': {
        'shows.$.active':false          
    }}
    ).exec(function(err,doc){

        console.log("Show removed");

    });

    showM.findOne().where('id',showID).update({id: showID}, 
        { $inc: { viewers: -1 } }).exec(function(err,doc){
            console.log("viewers decreased for show "+showID);


        });       
        res.end();

    },

    checkShow : function (res,showID,userID,userM) {
        console.log(showID+' '+userID);

        userM.find({ id: userID },{ shows: { $elemMatch: { id: showID,active:true} } } ).exec(function(err,doc){
            var d=JSON.parse(JSON.stringify(doc));

            var exist="";
            d.forEach(function(obj)
                { if(obj.shows==0)
                    {

                        exist="null";

                    }

                }

                );
            if(exist=="null")
                res.end("null");    
            res.end(JSON.stringify(doc));

        }

        );


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
    },


    getSeasons : function (res,showID) { 

        request({
            url: 'http://api.tvmaze.com/shows/'+showID+'?embed=seasons',
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {   
        res.json(body); // Print the json response
    }
})
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