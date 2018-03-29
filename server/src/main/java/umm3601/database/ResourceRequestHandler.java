package umm3601.database;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class ResourceRequestHandler {
    private final ResourceController resourceController;
    public ResourceRequestHandler(ResourceController resourceController){
        this.resourceController = resourceController;
    }

    /**Method called from Server when the 'api/resources' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of users in JSON formatted String
     */

    // Gets the goals from the DB given the query parameters
    public String getResources(Request req, Response res)
    {
        //debugging code
        //System.out.println("It went in RRHandler and did getResources()");
        res.type("application/json");
        return resourceController.getResources(req.queryMap().toMap());
    }

}
