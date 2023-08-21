const mongoose =require('mongoose')


// const dbConnect = ()=>{
//     mongoose.set('strictQuery',true)
//     mongoose.connect(process.env.MONGODB_URL)
//     .then(()=>console.log("Data base connected"))
//     .catch((error)=>{
//         console.log('error'+error);
//     })
// }
// module.exports=dbConnect

// ==========
mongoose.set('strictQuery',false);

module.exports = {
   dbConnect :() => {
        mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
        .then(()=>
            console.log('Database connected')
        )
        .catch((err) =>
            console.log("error"+err)
        )
        mongoose.connection.on('connected',()=>{
            console.log('MongoDB connected')
        })
        mongoose.connection.on('disconnected',()=>{
            console.log('MongoDB Disconnected')
        });
    }
};