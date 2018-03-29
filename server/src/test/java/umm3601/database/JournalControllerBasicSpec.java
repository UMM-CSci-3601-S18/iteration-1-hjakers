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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class JournalControllerBasicSpec {
    private JournalController journalController;
    private ObjectId journalsID;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> journalDocuments = db.getCollection("journals");

        journalDocuments.drop();

        List<Document> testJournals = new ArrayList<>();
        testJournals.add(Document.parse("{\n" +
            "                    title: \"a\",\n" +
            "                    body: \"Abstract\n" +

            "to investigate the relationship between \n" +
            "\n\",\n" +
            "                    date: \"https://www.tandfonline.com/doi/full/10.1080/09638237.2018.1437609\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                   title: \"b\",\n" +
            "                    body: \" n.\n" +
            "\n!\",\n" +
            "                    date: \"https://link.springer.com/article/10.1007/s10597-017-0159-y\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    title: \"c\",\n" +
            "                    body: \" town, \",\n" +
            "                    date: \"https://link.springer.com/article/10.1007/s11469-018-9888-6\",\n" +
            "                }"));

        journalsID = new ObjectId();
        BasicDBObject journal = new BasicDBObject("_id", journalsID);
        journal = journal.append("title", "d")
            .append("body", "present or absent.")
            .append("date", "https://link.springer.com/article/10.1007/s11469-018-9890-z");

        journalDocuments.insertMany(testJournals);
        journalDocuments.insertOne(Document.parse(journal.toJson()));

        journalController = new JournalController(db);
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

    private static String getlink(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("link")).getValue();
    }

    private static String getTitle(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("title")).getValue();
    }

    @Test
    public void getAllJournals() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = journalController.getJournals(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4", 4, docs.size());
        List<String> journals = docs
            .stream()
            .map(JournalControllerBasicSpec::getTitle)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedTitles = Arrays.asList("a", "b", "c", "d");
        assertEquals("Journals should match", expectedTitles, journals);
    }

    /*
     @Test
     public void getJournalByCategory(){
         Map<String, String[]> argMap = new HashMap<>();
         // Mongo in JournalController is doing a regex search so can just take a Java Reg. Expression
         // This will search the category for letters 'f' and 'c'.
         argMap.put("category", new String[] { "[f, c]" });
         String jsonResult = journalController.getItems(argMap);
         BsonArray docs = parseJsonArray(jsonResult);
         assertEquals("Should be 3 journals", 3, docs.size());
         List<String> name = docs
             .stream()
             .map(JournalControllerBasicSpec::getName)
             .sorted()
             .collect(Collectors.toList());
         List<String> expectedName = Arrays.asList("Aurora","John","Kai");
         assertEquals("Names should match", expectedName, name);
     }

     @Test
     public void getJournalsByID() {
         String jsonResult = journalController.getItem(journalsID.toHexString());
         Document journalDoc = Document.parse(jsonResult);
         assertEquals("Name should match", "Hunter", journalDoc.get("name"));
         String noJsonResult = journalController.getJournal(new ObjectId().toString());
         assertNull("No name should maItemstch",noJsonResult);
     }
 */
    @Test
    public void addJournalTest() {
        String newId = journalController.addNewJournal("e", "",
            "Health: is an interdisciplinary journal ");

        assertNotNull("Add new journal should return true when journal is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = journalController.getJournals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> title = docs
            .stream()
            .map(JournalControllerBasicSpec::getTitle)
            .sorted()
            .collect(Collectors.toList());
        // name.get(0) says to get the name of the first person in the database,
        // so "Aaron" will probably always be first because it is sorted alphabetically.
        // 3/4/18: Not necessarily: it is likely that that is how they're stored but we don't know. Find a different way of doing this.
        assertEquals("Should return the title of new journal", "e", title.get(4));
    }

}





