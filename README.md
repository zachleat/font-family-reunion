# font-family-reunion

* Hosted at [fontfamily.io](http://fontfamily.io)

## Initializing the repo

`npm install`

## Deploying the site

1. Add a `fontfamily` host to `.ssh/config`
1. Run `grunt deploy`

## Running your own test

### Adding new default fonts to the test list

Add your `font-family` name to `test/src/font-families.json`, preferably in alphabetical order.

Use `test/add-fonts.html` to make adding new font families to the list easier.

### Run the test server and save results to a local database

1. `mongod`
1. `node test/db/index.js` is the data collection site.
1. Navigate to `test/test.html` with your browser and confirm the dialog to save to the database.

## Generating the site

`grunt generate`

Or more explicitly, `node results/parse-results.js` will generate the fontfamily.io web site from the results stored in `font-families-results.json`. The template is in `results/result.ejs`.

