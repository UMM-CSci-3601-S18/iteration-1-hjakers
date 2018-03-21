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


// Controller that manages information about people's items.
public class GoalController {

    private final Gson gson;
    private MongoDatabase database;
    // itemCollection is the collection that the goals data is in.
    private final MongoCollection<Document> itemCollection;

    // Construct controller for items.
    public GoalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        itemCollection = database.getCollection("goals");
    }

    // get an item by its ObjectId, not used by client, for potential future use
    public String getItem(String id) {
        FindIterable<Document> jsonItems
            = itemCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonItems.iterator();
        if (iterator.hasNext()) {
            Document item = iterator.next();
            return item.toJson();
        } else {
            // We didn't find the desired item
            return null;
        }
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified. If the goal parameter is
    // specified, then the collection is filtered so only documents of that
    // specified goal are found.
    public String getItems(Map<String, String[]> queryParams) {

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
        FindIterable<Document> matchingItems = itemCollection.find(filterDoc);

        return JSON.serialize(matchingItems);
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
    public String addNewItem(String goal, String category, String name) {

        // makes the search Document key-pairs
        Document newItem = new Document();
        newItem.append("goal", name);
        newItem.append("category", category);
        newItem.append("name", goal);
        // Append new items here

        try {
            itemCollection.insertOne(newItem);
            ObjectId id = newItem.getObjectId("_id");
            System.err.println("Successfully added new item [goal=" + goal + ", category=" + category + " name=" + name + ']');
            // return JSON.serialize(newItem);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

}
