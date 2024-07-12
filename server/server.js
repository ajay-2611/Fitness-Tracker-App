const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const entriesRoutes = require('./routes/entries');

const app = express();

mongoose.connect('mongodb+srv://Ajay-26:<Ajay-26>@cluster2.k3xpcnj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster2'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

app.use(cors({
    origin:[
        '*',
        "http://localhost:8000"
        },
        credentials:true    
             }  ));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
