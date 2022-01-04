const mongoose = require('mongoose');

const userScheema = new mongoose.Schema({
    accountType: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
},
    { timestamps: true }
);



const Account = mongoose.model('account', userScheema);
module.exports = Account;