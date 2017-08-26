var fs = require('fs');

var productsFile = fs.readFileSync(__dirname + '/products.txt', 'utf8');
var listingsFile = fs.readFileSync(__dirname + '/listings.txt', 'utf8');

var products = productsFile.split("\n");
var listings = listingsFile.split("\n");

let listingsTotal = listings.length;

let matched = [];
let unmatched = [];
let results = "";

products.forEach((product) => {
    if (product != "" && product != null && product != undefined) {
        product = JSON.parse(product);
        unmatched = [];

        matched.push({
            product_name: product.product_name,
            listings: []
        });
        for (let i = 0; i < listings.length; i++) {
            if (listings[i] != "" && listings[i] != null && listings[i] != undefined) {
                let listing = JSON.parse(listings[i]);

                if (exists(product, listing)) {
                    matched[matched.length - 1].listings.push(listing); //the last entry in the array is going to be the current product
                } else {
                    unmatched.push(JSON.stringify(listing)); //this removes listings that have already been matched, so it doesnt need to recheck them
                }
            }
        }
        results += JSON.stringify(matched[matched.length - 1]) + "\n";
        listings = unmatched;
        //console.log("matched     ----------------- " + matched.length);
        //console.log("Unmatched ----------------- " + unmatched.length);

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write("matched: " + matched.length + " | unmatched: " + unmatched.length);



    }
});
console.log("\n");
console.log(listingsTotal - listings.length + " Listings Matched/n");

fs.writeFile(__dirname + "/Results.txt", results, "utf-8", (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("File Saved! Data located in Results.txt");
    }
});

/*listings = listings.toString().replace(/},{/g, "}\n{");

fs.writeFile(__dirname + "/foo.txt", listings, "utf-8", (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("File Saved!");
    }
});*/


function exists(product, listing) {
    listing = listing.title.toLowerCase();
    listing = listing.replace(/_/g, ''); //remove all underscores
    listing = listing.replace(/-/g, ''); //remove all dashes

    //I don't check family since not all listings have the family specified. manufacturer, and listing is enough
    let model = product.model.toLowerCase();
    if (
        //space added before so it doesn't find the same arrangement of characters within another string
        listing.includes(" " + model) || //as is
        listing.includes(" " + model.replace(/\s+/g, '')) || //no spaces
        listing.includes(" " + model.replace(/_/g, ' ')) || //replace underscore with space
        listing.includes(" " + model.replace(/_/g, '')) || //remove underscore
        listing.includes(" " + model.replace(/-/g, ' ')) || //replace dash with space
        listing.includes(" " + model.replace(/-/g, '')) //remove space
    ) {
        let manufacturer = product.manufacturer.toLowerCase();
        if (
            listing.includes(manufacturer) || //as is
            listing.includes(manufacturer.replace(/\s+/g, '')) || //no spaces
            listing.includes(manufacturer.replace(/_/g, ' ')) || //replace underscore with space
            listing.includes(manufacturer.replace(/_/g, '')) || //remove underscore
            listing.includes(manufacturer.replace(/-/g, ' ')) || //replace dash with space
            listing.includes(manufacturer.replace(/-/g, '')) //remove space
        ) {
            return true; //listing is product
        }
    }
    return false; //listing is not product
}