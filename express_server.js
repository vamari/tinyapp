const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser')






app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
function generateRandomString() {

};

// const users = { 
//   "userRandomID": {
//     id: "userRandomID", 
//     email: "user@example.com", 
//     password: "purple-monkey-dinosaur"
//   },
//  "user2RandomID": {
//     id: "user2RandomID", 
//     email: "user2@example.com", 
//     password: "dishwasher-funk"
//   }
// };

// const findUsersbyEmail = (email) => {
//   for(key in users) {
//     if(users[key].email === email) {
//       return users[key];
//     }
//   }
//   return null;
// }



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies.user_id };

  res.render("urls_index", templateVars);

});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.params);
  const shorturl = req.params.shortURL;
  delete urlDatabase[shorturl];
  console.log(urlDatabase) // Log the POST request body to the console
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:id", (req, res) => {
  
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  res.render("login");
  
  res.send(`{$userName}`)
});


app.post("/login", (req, res) => {
  const cookie = req.body.username;
  console.log("username", req.body.username)
  res.cookie("user_id", cookie) 
  console.log("req.cookie", req.cookies.user_id)
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  
  res.clearCookie("user_id")
  res.redirect("/urls")
});




// app.get("/register", (req, res) => {
//   res.render("register");
// });


//app.post("/register", (req, res) => {
  // const foundUser = findUserByEmail(req.body.email)
  //   if(foundUser) {
  //     res.redirect(`/${foundUser.id}`);
  //   } else {

  //   }




