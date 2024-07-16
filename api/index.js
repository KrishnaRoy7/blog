require('dotenv').config();
const express=require('express')
const cors=require('cors')
const app=express();
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const User=require('./models/user')
const jwt=require('jsonwebtoken')
const Post=require('./models/post')
const cookieParser=require('cookie-parser')
const multer=require('multer')
const fs=require('fs')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename for uploaded files
    }
});

// Create the Multer middleware instance with the defined storage configuration
const uploadMiddleware = multer({ storage: storage });
const secret=process.env.SECRET;
// process.env.MONGO_URL
app.use(cors({credentials:true,origin:'kcrblogapplication.vercel.app'}))
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Database Connected')
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(10); // Await the salt generation
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the generated salt
        const userDoc = await User.create({ username, password: hashedPassword });
        res.json(userDoc);
    } catch (error) {
        // If Mongoose validation error occurs
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(({ message }) => message);
            return res.status(400).json({ error: 'Validation error', errors });
        }
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'An error occurred while registering user' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
        return res.status(400).json('Wrong Credentials');
    }
    const passok = bcrypt.compareSync(password, userDoc.password);
    if (passok) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('Wrong Credentials');
    }
});


app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, secret, (err, info) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        // Send the decoded JWT payload as the response
        res.json(info);
    });
});

app.post('/logout' ,(req,res)=>{
    res.cookie('token','').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    
    // Ensure the path doesn't already contain an extension
    const newPath = path.endsWith(`.${ext}`) ? path : path + '.' + ext;
    
    fs.renameSync(path, newPath);
    
    // fs.renameSync(path, newPath);
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {title,summary,content} = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
      });
      res.json(postDoc);
    });
  
  });


  app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];

        // Ensure the path doesn't already contain an extension
        newPath = path.endsWith(`.${ext}`) ? path : path + '.' + ext;

        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        // Update the post document and retrieve the updated document
        const updatedPost = await Post.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        }, { new: true });

        res.json(updatedPost);
    });
});
app.get('/post', async (req,res) => {
    res.json(
      await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  });

  app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});