const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const User = require('./models/user.js')
// Define a port to run the server
const PORT = 3001;
const http = require('http');
const Project=require('./models/porject.js')

const server = http.createServer(app)
const { Server } = require('socket.io')
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust this to match your frontend's origin
        methods: ["GET", "POST"],
         credentials: true,
    },
})
// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',  // or wherever your React app runs
    credentials: true                // 🔥 must be true to support cookies
}));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/collab' }),
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

mongoose.connect('mongodb://127.0.0.1:27017/collab')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use(passport.initialize());
app.use(passport.session());


// 1️⃣ Local Strategy: Authenticate with `mail` and `password`
passport.use(new LocalStrategy(
    { usernameField: 'mail' },  // use 'mail' instead of default 'username'
    async (mail, password, done) => {
        try {
            const user = await User.findOne({ mail });
            if (!user) return done(null, false, { message: 'User not found' });

            const match = await bcrypt.compare(password, user.pass);
            if (!match) return done(null, false, { message: 'Wrong password' });

            return done(null, user._id);  // ✅ Auth success
        } catch (err) {
            return done(err);
        }
    }
));


// 2️⃣ Serialize: Store only the user ID in session
passport.serializeUser((user, done) => {
    done(null, user);  // Only store user ID
});


// 3️⃣ Deserialize: Fetch full user from DB each request
passport.deserializeUser(async (id, done) => {
    done(null, id);  // ✅ Only attach {_id: "..."} to req.user
});


// 4️⃣ Middleware: Protect routes 
function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) return next(); // ✅ User is logged in
    return res.status(401).json({ msg: 'You must be logged in' });
}



io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
  });

  socket.on('delta_update', async ({ roomId, delta }) => {
    // Broadcast delta to other users in the room
    socket.to(roomId).emit('delta_update', delta);

    // Optional: Fetch existing content, apply delta, then save (if needed)
    try {
      const project = await Project.findById(roomId);
      if (project) {
        const QuillDelta = require('quill-delta'); // npm install quill-delta
        const Delta = new QuillDelta(project.content || []);
        const updated = Delta.compose(delta);
        project.content = updated;
        await project.save();
      }
    } catch (err) {
      console.error('Error saving delta:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/user', async(req, res) => {
    if (req.isAuthenticated()) {
        let userid=req.user
        let user =await User.findById(req.user)
        let name=user.name
        res.json({ user: req.user,name:name }); // From Passport session
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});


app.post('/signup', async (req, res) => {

    let data = req.body
    console.log(data)
    let hashed = await bcrypt.hash(data.password, 10);
    let user = new User({
        name: data.username,
        pass: hashed,
        mail: data.mail,
        project: [],
        request: [],
        friend: [],
    })
    await user.save()
    res.json({ msg: 'usersaved' })
})
app.post('/signin', passport.authenticate('local'), (req, res) => {
    res.json({ msg: 'Logged in successfully', user: req.user });
});

app.post('/add_project', async (req, res) => {
    let data = req.body
    console.log("adding", data.name)
    let project= await new Project({
        name:data.project,
        users:[req.user],
        content:''
    })
    await project.save()
    let user = await User.findOne({ _id:req.user })
    if (user) {
        user.project.push(project._id)
        await user.save()
        return res.json({ _id: project._id, name: project.name });
    } else {
        res.json({ msg: 'not found' })
    }
})



app.post('/search', async (req, res) => {
    let data = req.body
    console.log("searching for", data)
    let user = await User.findOne({ name: data.dostname })
    if (user) {
        res.json({ msg: 'found', user })
    } else {
        res.json({ msg: 'not found' })
    }
})

app.post('/send_request', async (req, res) => {
    let data = req.body

    let sender = req.user
    console.log(sender)
    let receiver = await User.findById(data.id)
    receiver.request.push(sender)
    receiver.save()
    if (receiver) {

        res.json({ msg: 'req sent' })
    } else {
        res.json({ msg: 'req not sent ' })
    }
})

app.get('/request', async (req, res) => {
    let user_name = req.user
    let user = await User.findOne({ _id: user_name })
    let request = user.request

    if (request) {
        res.json({ msg: 'req sent', request })
    } else {
        res.json({ msg: 'req not sent ' })
    }
})
app.get('/user_by_id/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name _id');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching user' });
    }
});


app.post('/accept_request', async (req, res) => {
  const receiver = await User.findById(req.user);
  const sender = await User.findById(req.body.id);

  if (!receiver || !sender) return res.status(404).json({ msg: 'User not found' });

  // Remove request
  receiver.request = receiver.request.filter(id => id.toString() !== sender._id.toString());

  // Add each other as friends
  receiver.friend.push(sender._id);
  sender.friend.push(receiver._id);

  await receiver.save();
  await sender.save();

  res.json({ msg: 'Friend request accepted ' });
});

app.post('/reject_request', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const receiver = await User.findById(req.user._id);
    if (!receiver) return res.status(404).json({ msg: 'User not found' });

    receiver.request = receiver.request.filter(id => id.toString() !== req.body.id);
    await receiver.save();

    res.json({ msg: 'Friend request rejected' });
});



app.get('/get_projects', async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user || !user.project || user.project.length === 0) {
      return res.json([]); // Return empty list if no projects
    }

    // Get all project documents by their IDs
    const projects = await Promise.all(
      user.project.map(async (projId) => {
        const proj = await Project.findById(projId);
        if (proj) {
          return { _id: proj._id, name: proj.name };
        }
        return null; // in case a project ID no longer exists
      })
    );

    // Filter out any nulls (projects not found)
    const filtered = projects.filter(p => p !== null);

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});
app.get('/dost_list', async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user || !user.friend || user.friend.length === 0) {
      return res.json({ dost_list: [] });
    }

    // Fetch all friends by their IDs and get their name + _id
    const friends = await User.find({ _id: { $in: user.friend } }).select('name _id');

    // Format each friend as { _id, name }
    const dost_list = friends.map(friend => ({
      _id: friend._id,
      name: friend.name
    }));

    res.json({ dost_list });
  } catch (err) {
    console.error('Error fetching dost list:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});
app.post('/add_member_to_project', async (req, res) => {
  const { project_id, user_id } = req.body;

  try {
    const project = await Project.findById(project_id);
    const user = await User.findById(user_id);

    if (!project || !user) {
      return res.status(404).json({ msg: 'Invalid project or user' });
    }

    // Add user to project.users[] if not already present
    if (!project.users.includes(user_id)) {
      project.users.push(user_id);
      await project.save();
    }

    // Add project to user's project[] if not already present
    if (!user.project.includes(project_id)) {
      user.project.push(project_id);
      await user.save();
    }

    res.json({ msg: 'success' });
  } catch (err) {
    console.error('Error adding member to project:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});
app.get('/get_project/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Not found' });
    res.json({ content: project.content });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});




