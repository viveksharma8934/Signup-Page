const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  var f=req.body.fname;
  var l=req.body.lname;
  var e=req.body.email;

  const data = {
    members:[
      {
        email_address:e,
        status: "subscribed",
        merge_fields: {
          FNAME:f,
          LNAME:l,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url ="https://us5.api.mailchimp.com/3.0/lists/643206941a";
  const options = {
    method:"post",
    auth : "vivek:666642ae71fc9a5729ea8c95533287bd-us5"
  }
  const requesta = https.request(url,options,function(response){
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function( data){
      console.log(JSON.parse(data));
    })
  })
  requesta.write(jsonData);
  requesta.end();
});

app.post("/failure",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});


app.listen(process.env.PORT || 3000,function(){
  console.log("server is running on port 3000");
});
