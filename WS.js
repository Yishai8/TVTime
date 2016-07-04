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

    showEpisode : function (res,id) { 
        var url =
        request({
          url:'http://api.tvmaze.com/shows/'+id+'/seasons' ,
          json: true
      }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
        res.json(body); // Print the json response
    }
});

    },

showdata : function (res,id) { 
        var url =
        request({
           url:'http://api.tvmaze.com/shows/'+id+'?embed=cast' ,
          json: true
      }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
        res.json(body); // Print the json response
    }
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
    }

        };