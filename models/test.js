var async = require("async");
var db = require("./index_m");

function CACreate(email, name, organisation, year, number, ref_code, norefcode, cb) {
    cadetail = { email, name };
    if (organisation != false) cadetail.organisation = organisation;
    if (year != false) cadetail.year = year;
    if (number != false) cadetail.number = number;
    if (ref_code != false) cadetail.ref_code = ref_code;
    if (norefcode != false) cadetail.norefcode = norefcode;

    var CA = new db.ca(cadetail);

    CA.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log("New CA: " + CA);
        cb(null, CA);
    });
}


function createGenreCAs(cb) {
    async.series(
        [
            function (callback) {
                CACreate("car4@gmail.com", "Rothfuss","car20", 3,1234567890, "ca2","Ca2", callback);
            },
            function (callback) {
                CACreate("car5@gmail.com", "casd", "car21", 3, 8686567890, "ca3", "Ca4", callback);
            },
            function (callback) {
                CACreate("car6@gmail.com", "asdf", "car22", 3, 7272567890, "ca5", false, callback);
            },
        ],
        // optional callback
        cb
    );
}

async.series(
    [createGenreCAs],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log("FINAL ERR: " + err);
        } else {
            console.log("Test success");
        }
        // All done, disconnect from database
        mongoose.connection.close();
    }
);
