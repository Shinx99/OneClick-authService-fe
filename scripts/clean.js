// script/clean.js
const fs = require('fs');

console.log('Starting cleanup process...');

const itemsToDelete = [
  'node_modules',
  '.next',
  'package-lock.json',
];

itemsToDelete.forEach(item =>{
  if(fs.existsSync(item)){
    console.log(`Removing ${item}...`);
    if(fs.lstatSync(item).isDirectory()){
      fs.rmSync(item, {recursive:true, force:true});
    }else{
      fs.unlinkSync(item);
    }
  }
});

console.log('\n Project cleaned!');
console.log('Run "npm run setup" to reinstall.\n');
