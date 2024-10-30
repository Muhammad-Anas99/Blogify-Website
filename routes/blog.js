const { Router } = require("express");
const multer = require('multer')
const path = require('path')
const router = Router();
const Blog = require('../models/blog.js')
const Comment = require('../models/comment.js')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null,fileName)
}
})

const upload = multer({ storage: storage })


router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    })
})

router.get('/:id',async(req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments =  await Comment.find({blogId:req.params.id}).populate("createdBy");
console.log(comments)
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
})

router.post('/comment/:blogId',async (req,res)=>{
    await Comment.create({
    content:req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  })

  return res.redirect(`/blog/${req.params.blogId}`)
})


router.post('/',upload.single('coverImage'),async(req,res)=>{
    const {title,body} = req.body;
    const blog =await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`,
    })
    return res.redirect('/')
})

router.get('/delete/:_id',async(req,res)=>{
    let user =await Blog.findOneAndDelete({_id:req.params._id})
    res.redirect('/')
  })



module.exports = router;
