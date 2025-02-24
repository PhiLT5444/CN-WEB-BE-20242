const express = require("express");
const app = express();

app.get("/", function (req, res) {
    res.send("Hello World!");
});


app.listen(5005, function () {
    console.log("Started application on port %d", 5005);
});
