//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/journalDB', { useNewUrlParser: true })

const postSchema = new mongoose.Schema({
  title: String,
  content:String
})
const Post = mongoose.model("Post", postSchema)


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.redirect("/home")
})


// GET all posts
app.get("/home", (req, res) => {
  // get all items from our database and render them in our list view
  Post.find({}, (err, posts) => {

      if (posts.length === 0) {
        console.log("No posts yet");
        res.render("home", {allPosts: posts })
      }
      else {
        res.render("home", {allPosts: posts })
      }
  })
})
// GET a single post
app.get("/posts/:customPostId", (req, res) => {
  const customPostId = req.params.customPostId;
  console.log(customPostId);

  Post.findOne({_id: customPostId}, (err, foundPost) => {
    res.render("post", {postTitle: foundPost.title, postContent: foundPost.content})
  });

})

app.get("/about-us", (req, res) => {
  res.render("about", {content: aboutContent})
})

app.get("/contact-us", (req, res) => {
  res.render("contact", {content: contactContent})
})

// CREATE a new post
app.get("/compose", (req, res) => {
  res.render("compose")
})
app.post("/compose", (req, res) => {

  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  })
  newPost.save((err) => {
    if(!err){
      res.redirect("/home")
    }
  });
})




// LISTENING on PORT 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
