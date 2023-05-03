const express = require('express')
const chargebee = require("chargebee")
// CORS is enabled only for demo. Please dont use this in production unless you know about CORS
const cors = require('cors')

chargebee.configure({site : "sharvil-jp-test", 
  api_key : "test_Foj4eaaqwUsiL3Yu3X1xSpGTBv3enNHw"});
const app = express()

app.use(express.urlencoded())
app.use(cors())

app.post("/api/listPlans", (req, res) => {
  chargebee.item_price.list({
    limit : 10
  }).request(function(error,result) {
    if(error){
      //handle error
      console.log(error);
    }else{
      for(var i = 0; i < result.list.length;i++){
          var entry=result.list[i]
          console.log(entry);
          var item = entry.item;
        }
        res.send(result.list);
      }  
  });
});

app.post("/api/generate_checkout_new_url", (req, res) => {
  chargebee.hosted_page.checkout_new({
    subscription : {
      plan_id : req.body.plan_id
    },
    customer: {
      id : "_test_Azz5jsTd6TtWE5Ao"
    }
  }).request(function(error,result){
    if(error){
      //handle error
      console.log(error);
    }else{
      res.send(result.hosted_page);
    }
  });
});

app.post("/api/create_customer", (req, res) => {
  chargebee.customer.create({
  first_name : "John",
  last_name : "Doe",
  email : "john@test.com",
  locale : "fr-CA",
  billing_address : {
    first_name : "John",
    last_name : "Doe",
    line1 : "PO Box 9999",
    city : "Walnut",
    state : "California",
    zip : "91789",
    country : "US"
    }
}).request(function(error,result) {
  if(error){
    //handle error
    console.log(error);
  }else{
    console.log(result);
    var customer = result.customer;
    var card = result.card;
    res.send(result);
  }
});
});

app.post("/api/generate_checkout_existing_url", (req, res) => {
  chargebee.hosted_page.checkout_existing({
    subscription : {
      id : "1mhuIhIQhDeD9KFIJ"
    }, 
  }).request(function(error,result){
    if(error){
      //handle error
      console.log(error);
    }else{
      res.send(result.hosted_page);
    }
  });
});

app.post("/api/generate_update_payment_method_url", (req, res) => {
  chargebee.hosted_page.manage_payment_sources({
    customer : {
      id : "cbdemo_sir"
    }, 
  }).request(function(error,result){
    if(error){
      //handle error
      console.log(error);
    }else{
      res.send(result.hosted_page);
    }
  });
});


app.post("/api/generate_portal_session", (req, res) => {
  chargebee.portal_session.create({
    customer : {
      id : "cbdemo_sir"
    }, 
  }).request(function(error,result){
    if(error){
      //handle error
      console.log(error);
    }else{
      res.send(result.portal_session);
    }
  });
});

app.post('/api/generate_payment_intent', (req, res) => {
  chargebee.payment_intent.create(req.body)
  .request(function(error,result) {
      if(error){
          res.status(error.http_status_code || 500);
          res.json(error);
      } else{
          res.json(result);
      }
  });
});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(8000, () => console.log('Example app listening on port 8000!'))
