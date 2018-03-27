package umm3601.summary;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;

public class SummaryRequestHandler {

    private final SummaryController summaryController;
    public SummaryRequestHandler(SummaryController summaryController){
        this.summaryController = summaryController;
    }

/*Method called from Server when the 'api/users/:id' endpoint is received.
     * Get a JSON response with a list of all the users in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */

    public String getSummaryJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String summary;
        try {
            summary = summaryController.getSummary(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested user id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (summary != null) {
            return summary;
        } else {
            res.status(404);
            res.body("The requested user with id " + id + " was not found");
            return "";
        }
    }




/*Method called from Server when the 'api/users' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of users in JSON formatted String
     */

    public String getSummarys(Request req, Response res)
    {
        res.type("application/json");
        return summaryController.getSummarys(req.queryMap().toMap());
    }
}
