const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs');
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
function generateRandomString() {
  return Math.ceil(Math.random()*1000).toString();

};


const users = {
    "userRandomID": {
      id: "userRandomID",
      email: "user@example.com",
      // purple-monkey-dinosaur
      password: "$2a$10$wxTKhG5RIkuzsOeExN4V1e3jvfrfs/lC6ole/IYMH5PGnjgHfyH2m"
    },
   "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      // dishwasher-funk
      password: "$2a$10$LI48lX8GIqNQdMaONPlT3OmYE5Ekrm8Nc4PWx5T2m6ImrFRZmfyGm"
    }
  };

  const userAuth = (email) => {
      for(let key in users) {
        if(users[key].email === email) {
          return users[key];
        }
      }
      return null;
    };
// const userAuth = (email,pswd) => {
//   for(let key in users) {
//     if(users[key].email === email && users[key].password === pswd) {
//       return users[key];
//     }
//   }
//   return null;
// };

function checkPermission(req) {
  let userId = req.session.user_id;
  let urlId = req.params.shortURL;
  if (!urlDatabase[urlId]) {
    return {data: null, error: `URL does not exist.` }
  } else if (urlDatabase[urlId][`userID`] !== userId) {
    return {data: null, error: `you do not have permission.` }
  }
  return {data: urlId , error: null}
};
//need to call this in your post for edit and delete


const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};


const getUrlsForUser = (id) => {
  const urls = {}
  for( url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urls[url] = urlDatabase[url];
    }
  } 
  return urls;
}


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
  const user = users[req.cookies.user_id]
  // const templateVars = { urls: urlDatabase, username: req.cookies.user_id };
  const templateVars = { urls: getUrlsForUser(req.cookies.user_id), user:user };
 if (!req.cookies.user_id) res.send("Not authorized");
  res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body); 
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = {
    longURL : req.body.longURL,
    userID : req.cookies.user_id,
  }
  res.redirect(`/urls/${shortURL}`); // Respond with 'Ok' (we will replace this)
});


app.get("/urls/new", (req, res) => {
  const user = users[req.cookies.user_id];
  const templateVars = { urls: urlDatabase, user:user };
  const password = req.body.password;
  if (!user){ 
     return res.redirect("/login")
   }
  res.render("urls_new", templateVars);
});


 function findUserById(userId, users) {
  for(let user in users) {
    if ( user === userId) {
      return users[user];
    }
  }
  return null;
}  



app.get("/urls/:shortURL", (req, res) => {
 
 

 const userObjById = findUserById(req.cookies.user_id, users) 
   const templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL].longURL,
        user: userObjById,
      };
   console.log(urlDatabase)
  res.render("urls_show", templateVars);
})


app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.params);
  const shorturl = req.params.shortURL;
  delete urlDatabase[shorturl];
  console.log(urlDatabase) // Log the POST request body to the console
  res.redirect("/urls"); // Respond with 'Ok' (we will replace this)
});


app.get("/u/:shortURL", (req, res) => {
  
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log(longURL)
  res.redirect(longURL);
});

app.post("/urls/:id", (req, res) => {
  const user = users[req.cookies.user_id];
  urlDatabase[req.params.id] = {longURL: req.body.longURL, userID: user.id }
  res.redirect("/urls");
});

// app.get("/:id", (req, res) => {
// const templateVars = {user: users[req.params.id]};

// res.render("login", templateVars);


// res.send(`{$userName}`)
// });

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = userAuth(email);
    if (user){
      const hashedPassword = user.password;
      const isPasswordCorrect = bcrypt.compareSync(password, hashedPassword);
      if (!isPasswordCorrect) res.status(401).send('Wrong Password');
      res.cookie("user_id", user.id);
      res.redirect("/urls")
    }else{
      res.status(401).send('User Not found');
     }
  });

  
  app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/login");
  });


app.get("/register", (req, res) => {
  const user = users[req.cookies.user_id]
  const templateVars = { urls: urlDatabase, user:user };
  res.render("register", templateVars);
});


app.get("/login", (req, res) => {
  const user = users[req.cookies.user_id];
  const templateVars = { urls: urlDatabase, user:user };
  res.render("login", templateVars);
});
//   const email = req.body.email;
//   const password = req.body.password;
//   const id = generateRandomString();
//   const user = {
//     id: id,
//     email: email,
//     password: password,
//   }
//   users[id] = user;

//   res.redirect("/urls", templateVars)


app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    if (email === "" || password === "") res.status(400).send('Bad Request');
  
    const hashedPassword = bcrypt.hashSync(password, 10);
  
  
    const ifExist = userAuth(email);
    if (ifExist) res.status(400).send('Email exist');
    const id = generateRandomString();
    const user = {
      id: id,
      email: email,
      password: hashedPassword,
    }
    users[id] = user;
  
    res.cookie("user_id", id);
    console.log(users);
    res.redirect("/urls");
  
    });







