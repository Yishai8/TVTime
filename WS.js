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
        var rand=Math.ceil(Math.random()*30) ;
        console.log(rand);
        var url =
        request({
          url:'http://api.tvmaze.com/shows?page='+rand ,
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
          url:'http://api.tvmaze.com/search/shows?q='+query ,
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
    userID=parseInt(userID);
    var season;
    var url =
    request({
      url:'http://api.tvmaze.com/shows/'+showID+'/seasons' ,
      json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        var newShow= {
            "id": showID,
            "name":showName,
            "season":body[0].number,
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

    }
});

    
},

insertUser : function (res,token,userM) {
    var user="";
    var url =
    request({
      url:'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+token ,
      json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        var newUser= {
            "id": body.sub,
            "name":body.name,
            "email":body.email,
            "shows":[]
        };

        userM.find({ id: body.sub }).exec(function(err,doc){
            if(doc.length==0)
            {
                console.log("length "+doc.length);
                userM.create(newUser,function(err,doc){
                    console.log("User "+body.name+" added to users DB for the first time");
                    console.log(body.sub);
                    res.json(parseInt(body.sub));
                });
            }
            else
            {
             var d=JSON.parse(JSON.stringify(doc));
             d.forEach(function(obj)
             {
                console.log(obj.id); 
                res.json(parseInt(obj.id));
            });
         }

     });

    }
});


        // var newUser= {
        //     "id": showID,
        //     "name":showName,
        //     "shows":[]
        // };

        // userM.find({ id: userID },{ shows: { $elemMatch: { id: showID} } } ).exec(function(err,doc){
        //     var d=JSON.parse(JSON.stringify(doc));
        //     d.forEach(function(obj)
        //     { 
        //     if(obj.shows==0) //update new show for user
        //     {

        //         userM.findOne().where('id',userID).update({ 'shows.id': {$ne: newShow.id}}, 
        //             {$push: {shows:newShow}
        //         }
        //         ).exec(function(err,doc){
        //             if (err) {
        //                 console.log(err);
        //             }
        //             console.log("viewer "+userID+" is now tracking show "+showID);

        //         });
        //     }
        //     else
        //     { //enable existing disabled show
        //         userM.findOne().where('id',showID).update({id: userID, 'shows.id': showID}, 
        //             {'$set': {
        //                 'shows.$.active':true          
        //             }}).exec(function(err,doc){
        //                 console.log("show "+showID+" exists as non-active for viewer "+userID+",show reactivated");


        //             });


        //         }

        //         showM.findOne().where('id',showID).exec(function(err,doc){console.log("doc-"+doc);
        //             if(doc==null || doc=="null")
        //             {

        //                 showM.create(ShowRec,function(err,doc){
        //                     console.log("show "+showID+" added to show DB for the first time");

        //                 });
        //             }
        //             else
        //             {
        //                 showM.findOne().where('id',showID).update({id: showID}, 
        //                     { $inc: { viewers: 1 } }).exec(function(err,doc){
        //                         console.log("additional viewer added for show "+showID);

        //                     });                                

        //                 }

        //             });


        //     }

        //     );

        // });



        // res.end();


    },

    getUserShows : function (res,userID,userM) {

        userID=parseInt(userID);
       userM.find({id: userID}).exec(function(err,doc){
        res.json(doc);

    });


   },

    /*showEpisode : function (res,id) { 
        var url =
        request({
          url:'http://api.tvmaze.com/shows/'+id+'/seasons' ,
          json: true
      }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log(body);
        res.json(body); // Print the json response
    }
});

},*/

showdata : function (res,id) { 
    var url =
    request({
     url:'http://api.tvmaze.com/shows/'+id+'?embed[]=seasons&embed[]=cast' ,
     json: true
 }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        res.json(body); // Print the json response
    }
});

},

showEpisode : function (res,id,season,ep_id) { 
    var url =
    request({
     url:'http://api.tvmaze.com/shows/'+id+'/episodebynumber?season='+season+'&number='+ep_id ,
     json: true
 }, function (error, response, body) {
    if(error) console.log(error);
    if (!error && response.statusCode === 200) {

        if(body.image==null || body.summary==null || body.summary=='')
        {  
            var url =
            request({
             url:'http://api.tvmaze.com/shows/'+id+'?embed=cast' ,
             json: true
         }, function (error, response, Newbody) {

            if (!error && response.statusCode === 200) {
         // Print the json response
         if(body.image==null &&(body.summary==null || body.summary=='') ) //if episode data is missing fill from show
         {
            body.image=Newbody.image;
            body.summary=Newbody.summary;
        } // Print the json response
        else
            if(body.image==null)
            {
                body.image=Newbody.image;
            }
            else
                body.summary=Newbody.summary;
        }
        res.json(body); // Print the json response
        

    });

            
        }
        else
        {
         res.json(body); 
     }
 }
});

},

removeUserShow : function (res,showName,showID,userID,userM,showM) {

    userID=parseInt(userID);
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
        userID=parseInt(userID);
        console.log(showID+' '+userID);
        userM.find({ id: userID },{ shows: { $elemMatch: { id: showID,active:true} } } ).exec(function(err,doc){
            var d=JSON.parse(JSON.stringify(doc));
            var exist="";
            if(d=="")
                exist="null";               
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