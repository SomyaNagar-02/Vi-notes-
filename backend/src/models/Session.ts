import mongoose, { Schema, Document } from "mongoose";

interface ISession extends Document {
  content: string;
  wordCount: number;
  charCount: number;
  totalTypedChars: number;
  totalPastedChars: number;
  pasteRatio: number;
  pasteEvents: any[];
  keystrokeEvents: any[];
  sessionDuration: number;
}

const sessionSchema = new Schema<ISession>(
  {
    content: String,
    wordCount: Number,
    charCount: Number,
    totalTypedChars: Number,
    totalPastedChars: Number,
    pasteRatio: Number,
    pasteEvents: Array,
    keystrokeEvents: Array,
    sessionDuration: Number,
  },
  { timestamps: true }
);

export default mongoose.model<ISession>("Session", sessionSchema);