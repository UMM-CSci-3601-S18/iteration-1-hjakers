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

public class ResourceControllerBasicSpec {
    private ResourceController resourceController;
    private ObjectId testID;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> emotionDocuments = db.getCollection("resources");

        emotionDocuments.drop();

        List<Document> testResources = new ArrayList<>();
        testResources.add(Document.parse("{" +
            "resource: \"youtube-link-1\" " +
            "category: \"happy\" " +
            "name: \"a\" }"));
        testResources.add(Document.parse("{" +
            "resource: \"youtube-link-2\" " +
            "category: \"happy\" " +
            "name: \"b\" }"));
        testResources.add(Document.parse("{" +
            "resource: \"youtube-link-3\" " +
            "category: \"mad\" " +
            "name: \"c\" }"));

        testID = new ObjectId();
        BasicDBObject tester = new BasicDBObject("_id", testID);
        tester = tester.append("resource", "youtube-link-4")
            .append("category", "scared")
            .append("name", "d");

        emotionDocuments.insertMany(testResources);
        emotionDocuments.insertOne(Document.parse(tester.toJson()));

        resourceController = new ResourceController(db);
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

    private static String getName(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("name")).getValue();
    }

    private static String getCategory(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("category")).getValue();
    }

    @Test
    public void getAllResources() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = resourceController.getResources(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4", 4, docs.size());
        List<String> resources = docs
            .stream()
            .map(ResourceControllerBasicSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("a", "b", "c", "d");
        assertEquals("Names should match", expectedNames, resources);
    }

    @Test
    public void getResourceByName(){
        Map<String, String[]> argMap = new HashMap<>();
        // Mongo in resourceController is doing a regex search so can just take a Java Reg. Expression
        // This will search the category for letters 'f' and 'c'.
        argMap.put("name", new String[] { "d" });
        String jsonResult = resourceController.getResources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 1", 1, docs.size());
        List<String> name = docs
            .stream()
            .map(ResourceControllerBasicSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("d");
        assertEquals("Names should match", expectedName, name);
    }
}
