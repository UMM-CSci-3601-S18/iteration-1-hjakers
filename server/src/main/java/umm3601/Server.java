package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import spark.Request;
import spark.Response;

import umm3601.database.GoalController;
import umm3601.database.GoalRequestHandler;
import umm3601.database.JournalController;
import umm3601.database.JournalRequestHandler;


import umm3601.database.EmotionController;
import umm3601.database.EmotionRequestHandler;

import umm3601.database.ResourceController;
import umm3601.database.ResourceRequestHandler;

import java.io.IOException;

import umm3601.database.SummaryController;
import umm3601.database.SummaryRequestHandler;


import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

public class Server {
    private static final String databaseName = "dev";

    private static final int serverPort = 4567;

    public static void main(String[] args) throws IOException {

        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase(databaseName);

        GoalController goalController = new GoalController(database);
        GoalRequestHandler goalRequestHandler = new GoalRequestHandler(goalController);

        EmotionController emotionController = new EmotionController(database);
        EmotionRequestHandler emotionRequestHandler = new EmotionRequestHandler(emotionController);

        SummaryController summaryController = new SummaryController(database);
        SummaryRequestHandler summaryRequestHandler = new SummaryRequestHandler(summaryController);

        ResourceController resourceController = new ResourceController(database);
        ResourceRequestHandler resourceRequestHandler = new ResourceRequestHandler(resourceController);

        JournalController journalController = new JournalController(database);
        JournalRequestHandler journalRequestHandler = new JournalRequestHandler(journalController);


        //Configure Spark
        port(serverPort);
        enableDebugScreen();


        // Specify where assets like images will be "stored"
        staticFiles.location("/public");

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));


        // Simple example route
        get("/hello", (req, res) -> "Hello World");

        // Redirects for the "home" page
        redirect.get("", "/");

        redirect.get("/", "http://localhost:9000");

        /////////////// Endpoints ///////////////////
        /////////////////////////////////////////////

        //List goals, filtered using query parameters
        get("api/emotions", emotionRequestHandler::getEmotions);
        get("api/emotions/:id", emotionRequestHandler::getEmotionJSON);
        post("api/emotions/new", emotionRequestHandler::addNewEmotion);

        get("api/goals", goalRequestHandler::getGoals);
        get("api/goals/:id", goalRequestHandler::getGoalJSON);
        post("api/goals/new", goalRequestHandler::addNewGoal);
        post("api/goals/edit", goalRequestHandler::editGoal);

        //List summary page
        get("api/summarys", summaryRequestHandler::getSummaries);

        //Resources for appropriate response
        get("api/resources", resourceRequestHandler::getResources);


        //List journals, filtered using query parameters

        get("api/journals", journalRequestHandler::getJournals);
        get("api/journals/:id", journalRequestHandler::getJournalJSON);
        post("api/journals/new", journalRequestHandler::addNewJournal);


        // An example of throwing an unhandled exception so you can see how the
        // Java Spark debugger displays errors like this.
        get("api/error", (req, res) -> {
            throw new RuntimeException("A demonstration error");
        });

        // Called after each request to insert the GZIP header into the response.
        // This causes the response to be compressed _if_ the client specified
        // in their request that they can accept compressed responses.
        // There's a similar "before" method that can be used to modify requests
        // before they they're processed by things like `get`.
        after("*", Server::addGzipHeader);

        // Handle "404" file not found requests:
        notFound((req, res) -> {
            res.type("text");
            res.status(404);
            return "Sorry, we couldn't find that!";
        });
    }

    // Enable GZIP for all responses
    private static void addGzipHeader(Request request, Response response) {
        response.header("Content-Encoding", "gzip");
    }
}
