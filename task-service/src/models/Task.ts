import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
    title:      string;
    dueDate:    Date;
    completed:  boolean;
    owner:      string;
}

const TaskSchema = new Schema<ITask>(
    {
        title:     { type: String,   required: true },
        dueDate:   { type: Date,     required: true },
        completed: { type: Boolean,  default: false },
        owner:     { type: String,   required: true },   // ← new
    },
    { timestamps: true }
);

export const Task = model<ITask>('Task', TaskSchema);