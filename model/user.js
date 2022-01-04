const mongoose = require('mongoose');

const userScheema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
},
    { timestamps: true }
);



const User = mongoose.model('user', userScheema);
module.exports = User;