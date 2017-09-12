var express=require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

//app conig
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//moongose/model config
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type: Date , default:Date.now}
});
 var Blog=mongoose.model("Blog",blogSchema);
//  Blog.create({
//     title:"Test Blog",
//     image:"https://images.unsplash.com/photo-1455383333344-451b6147021b?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=28ca5d5a1de1b9252287abe3cea80c59",
//     body:"hello this is a blog post" 
//  },function(err,blog){
//      if(err){
//          console.log(err);
//      }else{
//          console.log(blog);
//      }
//  });
//restful routing

app.get("/",function(req,res){
    
 
    res.redirect("/blogs");
})
//index
app.get("/blogs",function(req,res){
    
       Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       } else{
            res.render("index",{blogs:blogs});
       }
    });
});
    
//NEW    
app.get("/blogs/new",function(req, res) {
    res.render("new");
});


//create a new blog
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//show info of particular blog
app.get("/blogs/:id",function(req, res) {
  //find the specific blog
  Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
          console.log(err);
          res.redirect("/");
      } else{
          res.render("show",{blog:foundBlog});
      }
  });
});    
 //edit route
app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
          res.redirect("/");
      } else{
          res.render("edit",{blog:foundBlog});
      }
  });
});
//update 
app.put("/blogs/:id",function(req,res){
        req.body.blog.body=req.sanitize(req.body.blog.body);

  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
      if(err){
          res.redirect("/blogs");
      }else{
          res.redirect("/blogs/"+req.params.id);
      }
  }) ;

});
app.delete("/blogs/:id",function(req,res){
      Blog.findByIdAndRemove(req.params.id,function(err,updatedBlog){
         if(err){
             res.redirect("/blogs");
         } else{
            res.redirect("/blogs"); 
         }
      });
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("working");
});