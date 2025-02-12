import mongoose from "mongoose";
import {z} from "zod";

// Zod Schema for Validation
const flashcard_collection_zod_schema = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"), 
    topic: z.string().min(1, "Topic of the collection is required"), 
    FlashcardsId: z.array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Flashcard ObjectId") // array of valid ObjectIds
    ).optional() // can be empty initially
});

// Mongoose Schema
const flashcard_collection_schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    FlashcardsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flashcard" }] // Array of Flashcard ObjectIds
});

// Middleware to Validate with Zod before Saving
flashcard_collection_schema.pre("save", function (next) {
    let flashcardCollection = this.toObject();

    // Ensure ObjectIds are converted to strings
    flashcardCollection.userId = flashcardCollection.userId.toString();
    flashcardCollection.FlashcardsId = flashcardCollection.FlashcardsId.map(id => id.toString());

    const parsed = flashcard_collection_zod_schema.safeParse(flashcardCollection);

    if (!parsed.success) {
        return next(new Error(parsed.error.issues.map(i => i.message).join(", ")));
    }

    if (this.isModified("topic")) {
        this.topic = this.topic.toLowerCase(); // saving the topic name in lower case
    }

    next();
});


const FlashcardCollection = mongoose.model("FlashcardCollection", flashcard_collection_schema);

export { FlashcardCollection, flashcard_collection_zod_schema };
