const express = require('express')
const app = express()
const axios = require('axios');
const port = 3434
// set the view engine to ejs
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var m = {};
var surveys = {};
var url = require('url');

app.get('/', (req, res) => res.send('Hello World!'))

 const dataPromise = axios.get('http://192.168.25.10/api/VicidialActiveLists')
 .then(response => response.data)
 .catch(console.error)

app.get('/active', (req, res) => dataPromise.then(data => {
 res.render('active', { list: data })
}))

  app.post('/import', (req, res) => dataPromise.then(data => {
      var submitdate = req.body.submitdate;
      console.log(submitdate);
      var url = 'http://192.168.25.10/api/ImportLimeSurvey/'+submitdate
      console.log(url);

     axios.post(url) 
     .then(response =>{ 
         surveys = response.data;
         console.log(surveys); 
         res.render('active', {imports: surveys, list: data});    
    })
    .catch(error => {console.log(error)
    });  
    
    }));

/**
 * Merges lists 
 *  
 */
app.post('/merge', (req, res) => dataPromise.then(data => {
  // Delete Duplicates 
   deldups(); 
  // DataMerge URL
  var listid = req.body.listid;
  url = 'http://192.168.25.10/api/spDataMerge/'+listid 
  console.log(url)
  axios.post(url)
  .then(response => {console.log(response.data)}) 
  .catch(console.error)
  // SurveyDetailMergeURL
  url = 'http://192.168.25.10/api/SurveyDetailMerge/'
  axios.post(url)
  .then(response => {console.log(response.data)}) 
  .catch(console.error)
  res.render('active', {list: data, listid: listid })
})); 

async function deldups(){ 
  var url = 'http://192.168.25.10/api/DeleteDuplicates/'
  let del = await axios.delete(url)
  .then(response => response.data)
  .catch(console.error)
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))