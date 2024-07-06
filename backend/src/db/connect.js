import mongoose from 'mongoose'

const connect = async()=>{
    try {
        console.log('attempting to connect to DB');
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log('connected to database....');
    } catch (error) {
        console.log('Failed to connect to database', error.message)
        process.exit(1)
    }
}

export default connect;