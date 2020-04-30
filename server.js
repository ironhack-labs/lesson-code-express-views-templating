// console.log('Running server.js ahhahahha');

/// ALL GLOBAL VARIABLES AND PACKAGES

//   name you give	   name of the package you installed
//       |                    |
const myExpress = require('express');

// package that allows templating and dynamic views
const hbs = require('hbs');

require('dotenv').config();

// here we are creating application
const app = myExpress();

//************ static files ****************************
// Connect "public/" folder to our express app
// makes everything inside public folder accessible to the rest of the app
app.use(myExpress.static('public'));

// sets hbs as default view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// pointing handlebars where to look for partials
hbs.registerPartials(__dirname + '/views/hbs-files/partials');

// import fake data:
const studentsList = require('./students-data.js');
const teacherData = require('./teacher-data'); // <== you don't have to add .js

// ***********************************
// ROUTES:
// ***********************************

///////////////////////////////////////////////////////////////////////////////
// ****************************** HTML ROUTES *********************************
///////////////////////////////////////////////////////////////////////////////

// - these routes don't give us opportunity to dynamically create content (they are static)
// if you want to have pages that describe products you want to sell, you would have to have page for each  product (insane 🤯)

//      '/' => means localhost:3000
//       ^
//       |    callback function as 2nd argument
app.get('/', (req, res) => {
  //   console.log(res);
  // ******** we can use res.send() to send one string to html file ************
  //   res.send(`Welcome to the backend!`);
  // ***************************************************************************

  // ******** we can send whole HTML as string template (really doesn't make sense right? 🤬) ******
  //   res.send(`
  // <html lang="en">
  // <head>
  //     <meta charset="UTF-8">
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //     <meta http-equiv="X-UA-Compatible" content="ie=edge">
  //     <title>Document</title>
  // </head>
  // <body>
  //     <h2>Welcomeeeeeee!</h2>
  // </body>
  // </html>
  // `);

  // ******* we can send a legit file which makes the most sense ✅ ********
  res.sendFile(__dirname + '/views/htmls/index.html');
});

//      '/about' => means localhost:3000/about
//       ^
//       |    callback function as 2nd argument
app.get('/about', (req, res) =>
  res.sendFile(__dirname + '/views/htmls/about.html')
);

///////////////////////////////////////////////////////////////////////////////
// ****************************** HBS ROUTES *********************************
///////////////////////////////////////////////////////////////////////////////

// - HBS is a templating engine that solves the problem that we faced with static HTML pages
// we can have ONE page with bunch of placeholders that will get replaced with actual value of every product

//      '/students' => means localhost:3000/students <===> get the students' data when users hit this route
//       ^
//       |    callback function as 2nd argument
app.get('/students', (req, res) => {
  const justNames = studentsList.map(element => element.firstName);
  //   console.log(justNames);

  //            it's already pre-fixed with "/views/" that's why
  //            we don't have to put the full path here
  //                    ^
  //                    |
  res.render('hbs-files/students-info.hbs', { studentNames: justNames });
  // "render()" sends a template file as a response
});

//      '/random' => means localhost:3000/random
//       ^
//       |    callback function as 2nd argument
app.get('/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * studentsList.length);
  const dataToBeSent = { randomStudent: studentsList[randomIndex] };

  // console.log(dataToBeSent);
  //                                    dataToBeSent: dataToBeSent
  //   res.render('hbs-files/random-student', { dataToBeSent }); ==> if we would keep these {} around, we are actually nesting object inside object
  //                                                                |-> dataToBeSent is already an object so having these curly braces around actually means nesting
  //                                                                |-> then in hsb we would have to say {{ dataToBeSent.randomStudent.firstName }}
  res.render('hbs-files/random-student', dataToBeSent);
});

// **************** PARTIALS ****************************

app.get('/about-teacher', (req, res) => {
  res.render('hbs-files/teacher-info.hbs', teacherData);
});

app.listen(process.env.PORT, () =>
  console.log(`Running on port: ${process.env.PORT}`)
);
