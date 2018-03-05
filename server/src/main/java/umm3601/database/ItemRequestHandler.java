package umm3601.database;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;
import umm3601.database.ItemController;

public class ItemRequestHandler {
    private final ItemController itemController;
    public ItemRequestHandler(ItemController itemController){
        this.itemController = itemController;
    }
    /**Method called from Server when the 'api/items/:id' endpoint is received.
     * Get a JSON response with a list of all the users in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getEmojiJSON(Request req, Response res) {
        return getItemJSON(req, res, "emoji");
    }

    public String getEmojis(Request req, Response res) {
        return  getItems(req, res, "emoji");
    }

    public String getGoalJSON(Request req, Response res) {
        return getItemJSON(req, res, "goals");
    }

    public String getGoals(Request req, Response res) {
        return getItems(req, res, "goals");
    }

    public String getItemJSON(Request req, Response res, String collection){
        res.type("application/json");
        String id = req.params("id");
        String item;
        try {
            item = itemController.getItem(id, collection);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested item id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (item != null) {
            return item;
        } else {
            res.status(404);
            res.body("The requested item with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/items' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of users in JSON formatted String
     */
    public String getItems(Request req, Response res, String collection)
    {
        res.type("application/json");
        return itemController.getItems(req.queryMap().toMap(), collection);
    }

    /**Method called from Server when the 'api/users/new'endpoint is recieved.
     * Gets specified user info from request and calls addNewUser helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the user was added successfully or not
     */
    public String addNewItem(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String name = dbO.getString("name");
                    String category = dbO.getString("category");
                    String goal = dbO.getString("goal");

                    System.err.println("Adding new item [name=" + name + ", category=" + category + " goal=" + goal + ']');
                    return itemController.addNewItem(name, category, goal);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new item request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

}
