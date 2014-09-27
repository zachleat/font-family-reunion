# font-family-reunion

* Hosted at [fontfamily.io](http://fontfamily.io)

## Running your own test

1. `npm install`
1. `bower install`

### Adding new default fonts to the test list

Add your `font-family` name to `test/src/font-families.json`, preferably in alphabetical order.

### Run the test server and save results to a local database

1. `mongod`
1. `node test/db/index.js` is the data collection site.
1. Navigate to `test/test.html` with your browser and confirm the dialog to save to the database.

## Generating the site

`node results/parse-results.js` will generate the fontfamily.io web site from the results stored in `font-families-results.json`. The template is in `results/result.ejs`.

