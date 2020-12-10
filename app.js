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
    console.log( req.body.firstName );
    console.log( req.body.lastName );
    console.log( req.body.email );

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

// curl -X POST \
//   https://server.api.mailchimp.com/3.0/lists \
//   -H 'authorization: Basic <USERNAME:PASSWORD>' \
//   -d '{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"visibility":"pub","double_optin":false,"marketing_permissions":false}'


app.listen( process.env.PORT || 3000, function() {
    console.log("  3000 listening....");
})

//  aa533ba8e06335eb4a667b4fa35681f2-us7
//  68ffac6cd6