package umm3601.database;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;


// Controller that manages information about people's goals.
public class EmotionController {

    private final Gson gson;
    private MongoDatabase database;
    // goalCollection is the collection that the goals data is in.
    private final MongoCollection<Document> emotionCollection;

    // Construct controller for goals.
    public EmotionController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        emotionCollection = database.getCollection("emotions");
    }

    // get a goal by its ObjectId, not used by client, for potential future use
    public String getEmotion(String id) {
        FindIterable<Document> jsonEmotions
            = emotionCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonEmotions.iterator();
        if (iterator.hasNext()) {
            Document goal = iterator.next();
            return goal.toJson();
        } else {
            // We didn't find the desired goal
            return null;
        }
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified. If the goal parameter is
    // specified, then the collection is filtered so only documents of that
    // specified goal are found.
    public String getEmotions(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        // We will need more statements here for different objects,
        // such as emoji, category, etc.

        // "goal" will be a key to a string object, where the object is
        // what we get when people enter their goals as a text body.
        // "goal" is the purpose of the goal
        if (queryParams.containsKey("mood")) {
            String targetContent = (queryParams.get("mood")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("mood", contentRegQuery);
        }


        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingEmotions = emotionCollection.find(filterDoc);

        return JSON.serialize(matchingEmotions);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param mood
     * @param description
     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the goal, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewEmotion(String mood, Integer intensity, String description, String date) {

        // makes the search Document key-pairs
        Document newEmotion = new Document();
        newEmotion.append("mood", mood);
        newEmotion.append("description", description);
        newEmotion.append("intensity", intensity);
        newEmotion.append("date", date);
        // Append new goals here

        try {
            emotionCollection.insertOne(newEmotion);
            ObjectId id = newEmotion.getObjectId("_id");
            System.err.println("Successfully added new goal [_id=" + id + ", mood=" + mood + ", intensity=" + intensity
                + " description=" + description + ", date=" + date + ']');
            // return JSON.serialize(newGoal);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
