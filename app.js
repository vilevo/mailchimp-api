const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post('/failure', function(req, res){
  res.redirect("/");
});

app.post('/', function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const url = "https://us7.api.mailchimp.com/3.0/lists/b0b8b5a2ad";

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const option = {
    method: "POST",
    auth: "coursierdhopital:bb55ce2651485a221b90809e71e62a38-us7"
  };

  const request = https.request(url, option, function(response){
    response.on("data", function(data){
      data = JSON.parse(data);
      console.log(response.statusCode);
      if(response.statusCode = 200){
          res.sendFile(__dirname + "/success.html");
      }else{
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});
app.listen(process.env.PORT || 3000, function(){
  console.log('Server is running on port 3000...');
});
