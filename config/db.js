const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, { connectTimeoutMS: 2000, family: 4 });
        console.log("Database connected !");
    } catch (error) {
        console.error("Error with Database connection :", error);
    }
})();