/*
 * This file generates the html snippet necessary to update team entries for Sanskriti.
 * DEPENDENCIES: airtable npm package
 * 	Type 'npm install airtable' before running.
 *
 * The output spits on the console but you can pipe it into anything you want.
 */

var fs = require('fs');
var imagedir = './imagesfromnode';
var https = require('https');

if (!fs.existsSync(imagedir)){
    fs.mkdirSync(imagedir);
}

var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'keySIUaospAEm4rXP' }).base('appczTUlRRIgi8Aax');
base('Core').select({
    view: 'Main View'
}).firstPage(function(error, records) {
    if (error) {
        console.log(error);
    } else {
    	var left = true;

        records.forEach(function(record) {
        	writeProfile(record.fields, left);
        	left = !left;
        	let filename = record.fields.Name.substr(0,record.fields.Name.indexOf(' ')).toLowerCase();
			var file = fs.createWriteStream(`${imagedir}/${filename}.jpg`);
			var request = https.get(record.fields.Picture[0].url, function(response) {
			  	response.pipe(file);
			});
        });
    }
});

var writeProfile = function(person, pos) {
	let name = person['Name'];
	let firstnamelower = name.substr(0,name.indexOf(' ')).toLowerCase();
	let hometown = person['Hometown']
	let major = person['Major']
	let favmoment = person['Favorite Moment']
	let position = person['Position']

	console.log('<section class="bio-entry">');
    console.log(`\t<p><span class="image ${pos ? 'left' : 'right'}"><img src="images/people/${firstnamelower}.jpg" alt="" /></span>`);
    console.log('\t\t<header>');
    console.log(`\t\t\t<h4>${name}</h4>`);
    console.log(`\t\t\t<p>${position}</p>`);
    console.log('\t\t</header>');
    console.log(`\t\t<span class="bio-items">Hailing from <i>${hometown}</i><br>`);
    console.log(`\t\tStudying <b>${major}</b></span><br><br><br>`);
    console.log(`\t\t<blockquote>${favmoment}</blockquote>`);
    console.log('\t</p>');
    console.log('</section>');
}

//writeProfile();