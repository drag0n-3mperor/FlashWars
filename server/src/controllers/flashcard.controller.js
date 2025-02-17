import { Flashcard, flashcard_zod_schema } from "../models/flashcard.model.js";
import { FlashcardCollection } from "../models/flashcard_collection.model.js";
import { User } from "../models/user.model.js";

// controller for creating flash card
const flashcard_create = async (req, res) => {
  try {
    const { question, answer, topic } = req.body; // answer field is optional
    if (!topic || !question) {
      return res
        .status(400)
        .json({ success: false, message: "Topic and question are required" });
    }
    const topicSmall = topic.toLowerCase();

    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing" }); // user must be signed-in
    }

    console.log("User ID:", userId); // Log user ID (debugg log)

    let collection = await FlashcardCollection.findOne({
      topic: topicSmall,
      userId,
    });
    console.log("Collection found:", collection); // Log collection (debugg log)

    // If no flashcard collection for that topic exists for that user, create a new collection automatically
    if (!collection) {
      collection = new FlashcardCollection({
        userId: userId.toString(),
        topic: topicSmall,
        FlashcardsId: [],
      });
      await collection.save();
      console.log("New collection created:", collection); // Log new collection
      req.user.flashcardCollections.push(collection._id);
      await req.user.save();
    }

    // Validating using the zod schema
    const parsed = flashcard_zod_schema.safeParse({
      question: String(question), // Ensure it's explicitly a string
      answer: answer ? String(answer) : "", // Handle optional answer (fallback empty string is answer is null)
      flashcardCollectionId: collection._id.toString(),
    });

    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.issues); // Log validation issues (debugg log)
      return res.status(400).json({
        success: false,
        message: parsed.error.issues.map((i) => i.message).join(", "),
      });
    }

    // After successful validation, save the flashcard
    const flashcard = new Flashcard(parsed.data);
    await flashcard.save();

    // Pushing the flashcard into the collection
    collection.FlashcardsId.push(flashcard._id);
    await collection.save();

    console.log("Flashcard created successfully:", flashcard); // Log created flashcard

    res.status(201).json({
      success: true,
      message: "Flashcard created successfully",
      flashcard,
    });
  } catch (error) {
    console.log("Error occurred:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//controller for viewing flashcard by topic name
const flashcard_view_topicname = async (req, res) => {
  try {
    const { topic, username } = req.params;
    if (!topic) {
      return res
        .status(400)
        .json({ success: false, message: "Topic is required" });
    }

    const topicSmall = topic.toLowerCase();
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing" }); //user must be signed in
    }

    //find a collection for that topic and user
    const collection = await FlashcardCollection.findOne({
      topic: topicSmall,
      userId,
    });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "No flashcards found for this topic",
      });
    }

    const flashcards = await Promise.all(
      collection.FlashcardsId.map(async (e, ind) => await Flashcard.findById(e))
    );

    res.status(200).json({
      success: true,
      topic: collection.topic,
      flashcards,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//controller for viewing all existing collections along with their user data for a topic name
const flashcard_view_all_topicname = async (req, res) => {
  try {
    const { searchQuery } = req.params;
    if (!searchQuery) {
      25;
      return res
        .status(400)
        .json({ success: false, message: "Topic is required" });
    }

    const topicSmall = searchQuery.toLowerCase();

    // find collections for the topic
    const collections = await FlashcardCollection.find({ topic: topicSmall });
    console.log("Search query:", searchQuery);

    if (collections.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No flashcard collections found for this topic",
      });
    }

    const userIds = collections.map((collection) => collection.userId);

    // find users for those IDs
    const users = await User.find({ _id: { $in: userIds } }).select(
      "-password -email"
    );

    res.status(200).json({
      success: true,
      collections,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//controller for viewing the flashcard collection of an user
const flashcard_view = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing" });
    }

    const collections = await FlashcardCollection.find({ userId });
    if (!collections) {
      return res.status(404).json({
        success: false,
        message: "No flashcard collection found for this user",
      });
    }

    res.status(200).json({
      success: true,
      collections,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//controller for viewing the flashcards of an user
const flashcard_show = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { limit, answerOnly } = req.query;
    console.log(req.query.limit);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing" });
    }

    const user = await User.findById(userId);
    const collections = user?.flashcardCollections?.map((e) => e[0]) || [];
    // console.log(collections);

    const pipeline = [
      {
        $match: { flashcardCollectionId: { $in: collections } }, // Ensure correct field
      },
    ];

    // Conditionally filter out empty answers if answerOnly is true
    if (answerOnly) {
      pipeline.push({
        $match: { answer: { $ne: "" } },
      });
    }

    // Sample a random set of documents
    const sampleSize = Number.isNaN(parseInt(limit)) ? 1 : parseInt(limit);
    pipeline.push({ $sample: { size: sampleSize } });

    // Execute the aggregation
    const flashcards = await Flashcard.aggregate(pipeline);
    // console.log(flashcards);

    if (!flashcards.length) {
      return res.status(404).json({
        success: false,
        message: "No flashcard collection found for this user",
      });
    }

    res.status(200).json({
      success: true,
      flashcards: flashcards,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const flashcard_view_all = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing" });
    }

    const collections = await FlashcardCollection.find({ userId });
    if (!collections) {
      return res.status(404).json({
        success: false,
        message: "No flashcard collection found for this user",
      });
    }

    const flashcardCollections = await collections.reduce(
      async (accPromise, collection) => {
        const acc = await accPromise;
        const flashcards = await Flashcard.find({
          _id: { $in: collection.FlashcardsId },
        });

        acc[collection.topic] = flashcards;
        return acc;
      },
      Promise.resolve({})
    );

    console.log(collections);

    res.status(200).json({
      success: true,
      collections: flashcardCollections,
      topics: collections.map((e) => e.topic),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//controller for viewing all flashcards of a collection
const flashcard_view_of_collection = async (req, res) => {
  try {
    const { flashcardCollectionId } = req.params;
    // const userId = req.user?._id;
    // if (!userId) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Unauthorized: User ID missing" });
    // }
    const flashcards = await Flashcard.find({ flashcardCollectionId });
    const collection = await FlashcardCollection.findById(
      flashcardCollectionId
    );
    if (!flashcards) {
      return res.status(404).json({
        success: false,
        message: "No flashcards found for this collection",
      });
    }
    res.status(200).json({
      success: true,
      flashcards,
      topic: collection.topic,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//editing a single flashcard
const flashcard_edit = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const { question, answer, topic } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing" }); //user must be signed-in
    }

    //find flashcard by the flashcardId
    const flashcard = await Flashcard.findById(flashcardId);
    console.log(flashcard);
    if (!flashcard) {
      return res
        .status(404)
        .json({ success: false, message: "Flashcard not found" });
    }
    let topicSmall = topic?.toLowerCase();
    let newCollection = null;
    if (topicSmall) {
      //finding the newCollection
      newCollection = await FlashcardCollection.findOne({
        topic: topicSmall,
        userId,
      });
      console.log(newCollection);
      //if no such collection of that topic exists  make a new collection
      if (!newCollection) {
        newCollection = new FlashcardCollection({
          userId: userId.toString(),
          topic: topicSmall,
          FlashcardsId: [],
        });
        newCollection.FlashcardsId.push(flashcardId);
        console.log(newCollection.FlashcardsId);
        await newCollection.save();
        const res = await FlashcardCollection.findById(newCollection._id);
        console.log(res);
      }
      // If the topic has changed, remove flashcard from the old collection
      if (
        String(flashcard.flashcardCollectionId) !== String(newCollection._id)
      ) {
        const oldCollection = await FlashcardCollection.findById(
          flashcard.flashcardCollectionId
        );
        if (oldCollection) {
          oldCollection.FlashcardsId = oldCollection.FlashcardsId.filter(
            (id) => id.toString() !== flashcardId
          );
          await oldCollection.save();
        }
        flashcard.flashcardCollectionId = newCollection._id; // Move to new collection
      }
    }
    // Update flashcard fields
    if (question) flashcard.question = question;
    if (answer !== undefined) flashcard.answer = answer;
    await flashcard.save();
    res.status(200).json({
      success: true,
      message: "Flashcard updated successfully",
      flashcard,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//deleting a single flash card
const flashcard_delete = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing" });
    }

    // find the flashcard
    const flashcard = await Flashcard.findById(flashcardId);
    if (!flashcard) {
      return res
        .status(404)
        .json({ success: false, message: "Flashcard not found" });
    }

    // find the collection of the flashcard
    const collection = await FlashcardCollection.findById(
      flashcard.flashcardCollectionId
    );
    if (!collection || collection.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot delete this flashcard",
      });
    }

    // remove flashcard from the collection's FlashcardsId array
    collection.FlashcardsId = collection.FlashcardsId.filter(
      (id) => id.toString() !== flashcardId
    );
    await collection.save();

    // delete the flashcard
    await flashcard.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Flashcard deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  flashcard_create,
  flashcard_view,
  flashcard_view_all,
  flashcard_view_topicname,
  flashcard_show,
  flashcard_edit,
  flashcard_delete,
  flashcard_view_of_collection,
  flashcard_view_all_topicname,
};
