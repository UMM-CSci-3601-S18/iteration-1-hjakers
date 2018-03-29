package umm3601.database;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

public class EmotionControllerBasicSpec {
    private EmotionController emotionController;
    private ObjectId testID;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> emotionDocuments = db.getCollection("emotions");

        emotionDocuments.drop();

        List<Document> testEmotions = new ArrayList<>();
        testEmotions.add(Document.parse("{" +
            "mood: \"happy\" " +
            "date: \"Wed Mar 1 2018 7:35:02 GMT-0500\" " +
            "intensity: \"2\" " +
            "description: \"I'm feeling good\"}"));
        testEmotions.add(Document.parse("{" +
            "mood: \"sad\" " +
            "date: \"Wed Mar 3 2018 12:02:21 GMT-0500\" " +
            "intensity: \"4\" " +
            "description: \"I'm not feeling good\"}"));
        testEmotions.add(Document.parse("{" +
            "mood: \"happy\" " +
            "date: \"Wed Mar 1 2018 10:14:41 GMT-0500\" " +
            "intensity: \"4\" " +
            "description: \"I'm feeling fantastic\"}"));

        testID = new ObjectId();
        BasicDBObject tester = new BasicDBObject("_id", testID);
        tester = tester.append("mood", "mad")
            .append("date", "Wed Mar 8 2018 10:17:41 GMT-0500")
            .append("intensity", "5")
            .append("description", "I'm really mad");

        emotionDocuments.insertMany(testEmotions);
        emotionDocuments.insertOne(Document.parse(tester.toJson()));

        emotionController = new EmotionController(db);
    }

    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getEmotion(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("mood")).getValue();
    }

    private static String getDescription(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("description")).getValue();
    }

    @Test
    public void getAllEmotions() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = emotionController.getEmotions(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4", 4, docs.size());
        List<String> emotions = docs
            .stream()
            .map(EmotionControllerBasicSpec::getEmotion)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("happy", "happy", "mad", "sad");
        assertEquals("Emotions should match", expectedNames, emotions);
    }

    @Test
    public void getEmotionByMood(){
        Map<String, String[]> argMap = new HashMap<>();
        // Mongo in EmotionController is doing a regex search so can just take a Java Reg. Expression
        // This will search the category for letters 'f' and 'c'.
        argMap.put("mood", new String[] { "happy" });
        String jsonResult = emotionController.getEmotions(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 2", 2, docs.size());
        List<String> desc = docs
            .stream()
            .map(EmotionControllerBasicSpec::getDescription)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedDesc = Arrays.asList("I'm feeling fantastic","I'm feeling good");
        assertEquals("Descriptions should match", expectedDesc, desc);
    }

    @Test
    public void getTestersIDByID() {
        String jsonResult = emotionController.getEmotion(testID.toHexString());
        Document testerDoc = Document.parse(jsonResult);
        assertEquals("Mood should match", "mad", testerDoc.get("mood"));
        String noJsonResult = emotionController.getEmotion(new ObjectId().toString());
        assertNull("No emotion should match",noJsonResult);
    }

    @Test
    public void addEmotionTest(){
        String newId = emotionController.addNewEmotion("happy", 5, "AAAAAAAAMAZING", "Wed Mar 1 2018 7:04:01 GMT-0500");

        assertNotNull("Add new emotion should return true when new emotion record is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = emotionController.getEmotions(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> desc = docs
            .stream()
            .map(EmotionControllerBasicSpec::getDescription)
            .sorted()
            .collect(Collectors.toList());
        // name.get(0) says to get the name of the first person in the database,
        // so "Aaron" will probably always be first because it is sorted alphabetically.
        // 3/4/18: Not necessarily: it is likely that that is how they're stored but we don't know. Find a different way of doing this.
        assertEquals("Should return the desc. of new emotion", "AAAAAAAAMAZING", desc.get(0));
    }
}
