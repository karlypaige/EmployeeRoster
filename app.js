const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const http = require("http");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

var employees = [];


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```


//collect manager information
console.log("Please enter information for the Manager");
inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the Manager\'s name?',
    },
    {
      type: 'input',
      name: 'id',
      message: 'What is the Manager\'s ID?'
    },
    {
      type: 'input',
      name: 'email',
      message: 'Please enter the Manager\'s email',
    },
    {
      type: 'input',
      name: 'officeNumber',
      message: 'Please enter the Manager\'s officeNumber',
    },
  ])
  .then((data) => {
    //There is only one manager and they are employee 0
    employees.push(new Manager(data.name, data.id, data.email, data.officeNumber));

    //collect employee information
      console.log("Please enter information for Engineers")
      inquirer
      .prompt([
      {
        message: "Are there any Engineers?",
        name: 'numEngineers',
        type: 'confirm',
      }
      ])
      .then((data) => {
        if(data.numEngineers === true){
          //call function
          constructEngineer();
        }else{
          console.log("Please enter information for Interns")
          inquirer
          .prompt([
            {
              message: "Are there any Interns?",
              name: 'numInterns',
              type: 'confirm',
            }
          ])
          .then((data) => {
            if(data.numInterns == true){
              console.log("There are Interns")
              //call internal function
              constructIntern();
            }
          });
        }
      });
  });

function constructEngineer() {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Name?',
    },
    {
      type: 'input',
      name: 'id',
      message: 'ID?'
    },
    {
      type: 'input',
      name: 'email',
      message: 'Email',
    },
    {
      type: 'input',
      name: 'github',
      message: 'Github user name',
    },
    {
      type: 'confirm',
      name: 'repeat',
      message: 'Are there more Engineers?',
    },
  ])
  .then ((data) => {
    employees.push(new Engineer(data.name, data.id, data.email, data.github));
    if (data.repeat === true) {
      constructEngineer();
    } else if (data.repeat === false){
      console.log("Please enter information for Interns")
          inquirer
          .prompt([
            {
              message: "Are there any Interns?",
              name: 'numInterns',
              type: 'confirm',
            }
          ])
          .then((data) => {
            if(data.numInterns == true){
              //call internal function
              constructIntern();
            }
          });;
    };
  });
};

function constructIntern() {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Name?',
    },
    {
      type: 'input',
      name: 'id',
      message: 'ID?'
    },
    {
      type: 'input',
      name: 'email',
      message: 'Email',
    },
    {
      type: 'input',
      name: 'school',
      message: 'School attended?',
    },
    {
      type: 'confirm',
      name: 'repeat',
      message: 'Are there more Interns?',
    },
  ])
  .then ((data) => {
    employees.push(new Intern(data.name, data.id, data.email, data.school));
    if (data.repeat === true) {
      //call function to construct as many interns as needed
      constructIntern();
    } else {  //once all interns are entered then output the results
      //if directory doesn't exist create it
      fs.stat(OUTPUT_DIR, (err, stats) => {
        if (err) {
          if(err.errno === -4058){
            fs.mkdir(OUTPUT_DIR, (err) => 
              err ? console.error(err) : console.log('Directory Created!')
            )
          }
        }
        //append the file to the new directory
        fs.appendFile("./output/team.html", `'${render(employees)}'`, (err) => 
          err ? console.error(err) : console.log('File Appended!')
        );

        var server = http.createServer(function (req, resp) {
          if (req.url === "/") {
            fs.readFile("./output/team.html", function (err, pgResp){
              if (err) {
                resp.writeHead(404);
                resp.write('Contents you are looking for are Not Found');
              } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
              }
              resp.end();
            });
          } else {
            //4.
            resp.writeHead(200, { 'Content-Type': 'text/html' });
            resp.write('<h1>Product Manaager</h1><br /><br />To create product please enter: ' + req.url);
            resp.end();
          }
        });
        //5.
        server.listen(5050);
        
        console.log('Server Started listening on 5050');
        
      })
    };
  });
};

