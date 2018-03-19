var program = require('commander');
var fs = require('fs')
var path = require('path');

program
  .version('0.2.0')
  .command('createComponent [name]')
  .action(function(name){

    if(name === undefined){
      console.log('no args given')
    }else{
      console.log(name);
    
      var componentTemplate = require('./templates/component.js')(name);
      var controllerTemplate = require('./templates/controller.js')(name);
      var viewTemplate = `<h1>Vista: ${name}</h1>`

      fs.mkdir(path.join(__dirname, `/src/js/components/${name}Component`), function(err){
        if(err)throw err;
        console.log(`Folder ${name}Component created successfully!!`);
        fs.appendFile(`${__dirname}/src/js/components/${name}Component/${name}.component.js`, componentTemplate, (err)=>{
          if(err)throw err;
          console.log(`File: ${name}.component.js created successfully!!`);
        });
        fs.appendFile(`${__dirname}/src/js/components/${name}Component/${name}.ctrl.js`, controllerTemplate, (err)=>{
          if(err)throw err;
          console.log(`File: ${name}.ctrl.js created successfully!!`);
        });
        fs.mkdir(path.join(__dirname, `/public/partials/${name}`), function(err){
          if(err)throw err;
          console.log(`Folder ${name} created successfully!!`);
          fs.appendFile(`${__dirname}/public/partials/${name}/${name}.component.html`, viewTemplate, (err)=>{
            if(err)throw err;
            console.log(`File: ${name}.component.html created successfully!!`);
          });
        });
      });
    }
  });
program
  .command('createService [name]')
  .action(function(name){
    if(name === undefined){
      console.log('no args given')
    }else{
      console.log(name);
      var serviceTemplate = require('./templates/service.js')(name);

      fs.appendFile(`${__dirname}/src/js/services/${name}.service.js`, serviceTemplate, (err)=>{
          if(err)throw err;
          console.log(`File: ${name}.service.js created successfully!!`);
      });
    }
  });
  program.parse(process.argv);