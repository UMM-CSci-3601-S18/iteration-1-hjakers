package umm3601.database;

import spark.Request;
import spark.Response;

public class SummaryRequestHandler {

    private final SummaryController summaryController;
    public SummaryRequestHandler(SummaryController summaryController){
        this.summaryController = summaryController;
    }

/*Method called from Server when the 'api/users' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of users in JSON formatted String
     */

    public String getSummaries(Request req, Response res)
    {
        res.type("application/json");
        return summaryController.getSummaries(req.queryMap().toMap());
    }
}
