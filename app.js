const express       = require("express");
const bodyParser    = require("body-parser");
const request       = require("request");
const https         = require("https");
const app           = express();

app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( express.static( "public" ) );

app.get( "/", function( req, res ) {
    res.sendFile( __dirname + "/signup.html");
});

app.post( "/", function( req, res ) {

    var email = req.body.email;
    var fname = req.body.firstName;
    var lname = req.body.lastName;
    console.log( fname );
    console.log( lname );
    console.log( email );

    var data = {
        members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: fname,
                        LNAME: lname
                    }
                }
            ]
        };

    var url = "https://us7.api.mailchimp.com/3.0/lists/68ffac6cd6?"
    var jsonData = JSON.stringify( data );

    const options = {
        method: "POST",
        auth: "lbashir73:aa533ba8e06335eb4a667b4fa35681f2-us7"
    }

    const request = https.request( url, options, function( response ) {

        console.log( response.statusCode );
        if ( response.statusCode === 200 ) {
            res.sendFile(__dirname + "/success.html");
        } 
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on( "data", function( data ) {
            console.log( JSON.parse( data ) );
        })
    })

    request.write( jsonData );
    request.end();
});

app.post( "/failure", function( req, res ) {
    res.redirect( "/" );
});

app.listen( process.env.PORT || 3000, function() {
    console.log("  3000 listening....");
})
