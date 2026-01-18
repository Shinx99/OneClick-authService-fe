// script/setup.js
const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting project setup...');

// Check Node.js version
const nodeVersion = process.versions;
console.log('Node.js version:, ${nodeVersion}');

// Check npm
try{
  const npmVersion = execSync('npm -v',{encoding:'utf-8'}).trim();
  console.log('npm version:, ${npmVersion}\n');
}catch(error){
  console.error('npm not found. Please install npm before proceeding.');
  process.exit(1);
};

// clean old installations
if(fs.existsSync('node_modules')){
  console.log('Cleaning old installations....');
  fs.rmSync('node_modules',{recursive:true,force:true});
  if(fs.existsSync('pakge-lock.json')){
    fs.unlinkSync('package-lock.json');
  }
}


// Install dependencies
console.log('Installing dependencies...');

try{
  execSync('npm install', {stdio:'inherit'});
  console.log('Dependencies installed successfully.');

}catch(error){
  console.error('Error installing dependencies:',error);
  process.exit(1);
};

// Setup .env.local
if(!fs.existsSync('.env.local')){
  console.log('Setting up .env.local file...');
  fs.copyFileSync('.env.example','.env');
  console.log('.env file created from .env.example');
}else{
  console.log('.env file already exists. Skipping setup.')
}

console.log('Setup completed.\n');
console.log('Remember to configure your .env file before running: npm run dev.');