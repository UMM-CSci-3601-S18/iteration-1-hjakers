package umm3601.database;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;


/*
 * Controller that manages requests for info about users.
 */

public class SummaryController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> summaryCollection;


/*
     * Construct a controller for users.
     *
     * @param database the database containing user data
     */

    public SummaryController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        summaryCollection = database.getCollection("emotions");
    }

/* Helper method which iterates through the collection, receiving all
     * documents if no query parameter is specified. If the age query parameter
     * is specified, then the collection is filtered so only documents of that
     * specified age are found.
     *
     * @param queryParams
     * @return an array of Users in a JSON formatted string
     */

    public String getSummaries(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("mood")) {
            String targetMood = queryParams.get("mood")[0];
            filterDoc = filterDoc.append("mood", targetMood);
        }

        if(queryParams.containsKey("date")){
            String targetDate = queryParams.get("date")[0];
            filterDoc = filterDoc.append("date", targetDate);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingSummaries = summaryCollection.find(filterDoc);

        return JSON.serialize(matchingSummaries);
    }
}
