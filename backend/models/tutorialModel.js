const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema(
    {   
        data: Buffer,
        contentType: String,
        url: String,
        caption: String
    }
);

const sectionSchema = new mongoose.Schema (
    {   
        title: {
        type: String,
        required: true
        },
        content:{
            type: String,
            required: true
        },
        pictures: {
            type: [pictureSchema],
            validate: function(val) {
                return val.length <= 5;        
            },
            message: 'Exceeds the limit of 5 pictures',
            required: false
        }

    }, {_id: false}
);

const tutorialSchema = new mongoose.Schema(
    {
        codeName: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        sections: [sectionSchema],
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt : {
            type: Date,
            default: Date.now
        }
    }
);

tutorialSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
});

const Tutorial = mongoose.model('Tutorial', tutorialSchema);

module.exports = Tutorial;