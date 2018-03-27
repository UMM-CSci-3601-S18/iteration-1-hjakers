package umm3601.database;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;


// Controller that manages information about people's goals.
public class GoalController {

    private final Gson gson;
    private MongoDatabase database;
    // goalCollection is the collection that the goals data is in.
    private final MongoCollection<Document> goalCollection;

    // Construct controller for goals.
    public GoalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        goalCollection = database.getCollection("goals");
    }

    // get a goal by its ObjectId, not used by client, for potential future use
    public String getGoal(String id) {
        FindIterable<Document> jsonGoals
            = goalCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonGoals.iterator();
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
    public String getGoals(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        // We will need more statements here for different objects,
        // such as emoji, category, etc.

        // "goal" will be a key to a string object, where the object is
        // what we get when people enter their goals as a text body.
        // "goal" is the purpose of the goal
        if (queryParams.containsKey("goal")) {
            String targetContent = (queryParams.get("goal")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("goal", contentRegQuery);
        }

        // category is the category of the goal, also a String
        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        // name is the title of the goal
        if (queryParams.containsKey("name")) {
            String targetContent = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", contentRegQuery);
        }

        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingGoals = goalCollection.find(filterDoc);

        return JSON.serialize(matchingGoals);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param name
     * @param goal
     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the goal, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewGoal(String goal, String category, String name) {

        // makes the search Document key-pairs
        Document newGoal = new Document();
        newGoal.append("goal", name);
        newGoal.append("category", category);
        newGoal.append("name", goal);
        // Append new goals here

        try {
            goalCollection.insertOne(newGoal);
            ObjectId id = newGoal.getObjectId("_id");
            System.err.println("Successfully added new goal [_id=" + id + ", goal=" + goal + ", category=" + category + " name=" + name + ']');
            // return JSON.serialize(newGoal);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public String editGoal(String id, String goal, String category, String name) {

        Document newGoal = new Document();
        newGoal.append("goal", name);
        newGoal.append("category", category);
        newGoal.append("name", goal);

        Document setQuery = new Document();
        setQuery.append("$set", newGoal);

        Document searchQuery = new Document().append("_id", new ObjectId(id));


        try {
            goalCollection.updateOne(searchQuery, setQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.err.println("Successfully updated goal [_id" + id1 + ", goal=" + goal + ", category=" + category + " name=" + name + ']');
            return JSON.serialize(id1);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

}
