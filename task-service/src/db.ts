import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todo_db';

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB at', MONGO_URI);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}