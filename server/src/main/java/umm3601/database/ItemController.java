package umm3601.database;

import com.google.gson.Gson;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.*;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;



// Controller that manages information about people's items.
public class ItemController {

    private final Gson gson;
    private final ItemControllerUtility itemControllerUtility = new ItemControllerUtility(this);
    private MongoDatabase database;
    private final MongoCollection<Document> itemCollection;
    private final MongoCollection<Document> emojiCollection;
    private final MongoCollection<Document> userIdCollection;
    // Goals data has not been setup yet, but the collection can still be here
    private final MongoCollection<Document> goalCollection;

    // Construct controller for items.
    public ItemController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        itemCollection = database.getCollection("items");
        goalCollection = database.getCollection("goals");
        emojiCollection = database.getCollection("emoji");
        userIdCollection = database.getCollection("userId");
        // if the userId is new, setup the id index
        if(userIdCollection.count() == 0) {
            setupUserId();
        }
    }

    // This sets up an index so that we can get the largest userId when assigning new ones
    private void setupUserId() {
        BsonDocument bsonDocument = new BsonDocument();
        bsonDocument.append("user_id", new BsonInt32(-1)); // -1 means descending order
        userIdCollection.createIndex(bsonDocument);
    }

    // This uses the aforementioned index to get the most recent userId
    public int getNewUserId() {
        int returnInt = 0;
        FindIterable<Document> doc = userIdCollection.find().sort(new BsonDocument("user_id", new BsonInt32(-1)));
        if(doc.first() != null) {
            Document document = doc.first();
            returnInt = document.getInteger("user_id");
            return ++returnInt; // Do not change order of ++, this makes it so that it is updated before being returned
        }
        else {
            return returnInt;
        }
    }

    private MongoCollection<Document> getCollectionByName(String nameOfCollection) {
        return itemControllerUtility.getCollectionByName(nameOfCollection);
    }

    public String getItem(String id, String collection) {
        FindIterable<Document> jsonItems
            = itemControllerUtility.getCollectionByName(collection)
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
    public String getItems(Map<String, String[]> queryParams, String collectionName) {

        Document filterDoc = new Document();

        // This bit of code parametrizes the queryParams.containsKey code that we
        // will no longer need because it's all in this loop
        // Update: It works in the intended way depending on the type
        String[] keys = ItemControllerUtility.getKeysByCollectionName(collectionName);
        String[] keyTypes = ItemControllerUtility.getKeyTypesByCollectionName(collectionName);
        for(int i = 0; i < keys.length && i < keyTypes.length; i++) {
            if(queryParams.containsKey(keys[i])) {
                switch(keyTypes[i]) {
                    case "int": {
                        if(!(queryParams.get(keys[i])[0].equals("0"))) {
                            int targetInt = Integer.parseInt(queryParams.get(keys[i])[0]);
                            System.out.println(targetInt);
                            filterDoc.append(keys[i], targetInt);
                            System.out.println(filterDoc.toJson());
                        }
                    }
                    // kick the can down the line for someone else to figure out how to exclude things that
                        // aren't in there but are still keyed
                    /*case "String": {
                        if(!(queryParams.get(keys[i])[0] .equals(""))) {
                            String targetContent = (queryParams.get(keys[i])[0]);
                            Document contentRegQuery = new Document();
                            contentRegQuery.append("$regex", targetContent);
                            contentRegQuery.append("$options", "i");
                            filterDoc.append(keys[i], contentRegQuery);
                        }
                    }*/
                    // it was messing with the code so I commented it out 3/6/18 -ALC
                    /*case "long": {
                        if(!(queryParams.get(keys[i])[0].equals("0"))) {
                            long targetLong = Long.parseLong(queryParams.get(keys[i])[0]);
                            filterDoc.append(keys[i], targetLong);
                        }
                    }*/
                    // we're not filtering by booleans on the back-end, too many issues
                    /*case "boolean": {
                        boolean targetBool = Boolean.parseBoolean(queryParams.get(keys[i])[0]);
                        filterDoc.append(keys[i], targetBool);
                    }*/
                }
            }
        }

        /*// "goal" will be a key to a string object, where the object is
        // what we get when people enter their goals as a text body.
        if (queryParams.containsKey("goal")) {
            String targetContent = (queryParams.get("goal")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("goal", contentRegQuery);
        }

        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        if (queryParams.containsKey("name")) {
            String targetContent = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", contentRegQuery);
        }*/

        // FindIterable comes from mongo, Document comes from Bson
        System.out.println(filterDoc.toJson());
        FindIterable<Document> matchingItems = itemControllerUtility.getCollectionByName(collectionName).find(filterDoc);

        return JSON.serialize(matchingItems);
    }

    /**
     * Helper method which appends received item information to the to-be added document

     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the goal, but you can separate multiple arguments
    // by commas as we add them.
    // JUST FOR GOALS AS OF 3/6/18 -- if some kind soul wants to generalize this, go right ahead!
    public String addNewItem(int user_id, String goal, long timeCreated, boolean complete) {

        Document newItem = new Document();
        newItem.append("user_id", user_id);
        newItem.append("goal", goal);
        newItem.append("timeCreated", timeCreated);
        newItem.append("complete", complete);
        // Append new items here

        try {
            itemCollection.insertOne(newItem);
            ObjectId id = newItem.getObjectId("_id");
            System.err.println("Successfully added new item [user_id " + user_id +
                " goal: " + goal + " timeCreated: " + timeCreated + "complete: " + complete +']');
            // return JSON.serialize(newItem);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public MongoCollection<Document> getItemCollection() {
        return itemCollection;
    }

    public MongoCollection<Document> getEmojiCollection() {
        return emojiCollection;
    }

    public MongoCollection<Document> getUserIdCollection() {
        return userIdCollection;
    }

    public MongoCollection<Document> getGoalCollection() {
        return goalCollection;
    }
}
