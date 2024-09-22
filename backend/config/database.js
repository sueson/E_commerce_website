const mongoose = require("mongoose");

const connectDatabase = ()=> {
    mongoose.connect(process.env.DB_LOCAL_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(conn => {
        console.log(`MongoDB is connected to the host: ${conn.connection.host}`);
    })
    
}

module.exports = connectDatabase;