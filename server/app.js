// imports and setup
const express = require('express')
const app = express()

// routes
app.get("/", (req, res) => res.send("Hi from the root route"))

// telling the app to listen to
app.listen(6969, () => {
    console.log("App is running on port 6969")
})