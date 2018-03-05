package umm3601.database;

import com.mongodb.client.MongoCollection;
import org.bson.Document;

public class ItemControllerUtility {
    private final ItemController itemController;

    public ItemControllerUtility(ItemController itemController) {
        this.itemController = itemController;
    }

    // returns a MongoCollection<Document> object when given the name in String form of the desired collection
    public MongoCollection<Document> getCollectionByName(String nameOfCollection) {
        switch (nameOfCollection) {
            case "items": {
                return itemController.getItemCollection();
            }
            case "emoji": {
                return itemController.getEmojiCollection();
            }
            case "userId": {
                return itemController.getUserIdCollection();
            }
            case "goals": {
                return itemController.getGoalCollection();
            }
        }
        return null;
    }

    // gets the types of the values associated with the keys, e.g. integer, String, etc. so
    // the ItemController can deal with that
    public static String[] getKeyTypesByCollectionName(String collectionName) {
        switch (collectionName) {
            case "emoji": {
                return new String[]{"int", "int", "long"};
            }
            case "goals": {
                return new String[]{"int", "String", "long", "boolean"};
            }
            case "items": {
                return new String[]{"String", "String", "String"};
            }
            case "userId": {
                return new String[]{"int", "String", "long"};
            }
        }

        return null;
    }

    // returns the keys for the collection specified in the collectionName parameter
    public static String[] getKeysByCollectionName(String collectionName) {
        switch (collectionName) {
            case "emoji": {
                return new String[]{"user_id", "emoji", "datetime"};
            }
            case "goals": {
                return new String[]{"user_id", "goal", "timeCreated", "complete"};
            }
            case "items": {
                return new String[]{"name", "goal", "category"};
            }
            case "userId": {
                return new String[]{"userId", "userName", "timeCreated"};
            }
        }

        return null;
    }

    public int getNewUserId() {
        return itemController.getNewUserId();
    }
}
