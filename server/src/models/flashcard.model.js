import mongoose from "mongoose";
import {z} from "zod";

const flashcard_zod_schema = z.object({
  question: z.string().min(1, "Question is required"), // Required
  answer: z.string().optional(), // Optional
  flashcardCollectionId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"), //ensuring this is a valid mongoDBId
});

const flashcard_schema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String },
  flashcardCollectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FlashcardCollection",
  },
});

// Middleware to validate the schema before saving
flashcard_schema.pre("save", function (next) {
  const flashcard = this.toObject();

  // Ensure `flashcardCollectionId` is converted to a string for validation
  if (flashcard.flashcardCollectionId) {
    flashcard.flashcardCollectionId = flashcard.flashcardCollectionId.toString();
  }

  const parsed = flashcard_zod_schema.safeParse(flashcard);
  if (!parsed.success) {
    return next(new Error(parsed.error.issues.map((i) => i.message).join(", ")));
  }

  next();
});

const Flashcard = mongoose.model("Flashcard", flashcard_schema);

export { Flashcard, flashcard_zod_schema };
