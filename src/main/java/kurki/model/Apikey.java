package kurki.model;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import kurki.db.DBConnectionManager;
import kurki.util.RandomString;

/**
 *
 * @author mluukkai
 */
public class Apikey {

    private String ktunnus;
    private String key;
    private String voimassa;

    public String getKey() {
        return key;
    }

    public String getKtunnus() {
        return ktunnus;
    }

    public String getVoimassa() {
        return voimassa;
    }

    public Apikey(String ktunnus, String key, String voimassa) {
        this.ktunnus = ktunnus;
        this.key = key;
        this.voimassa = voimassa;
    }

    protected static final String APIKEYS_OF_USER
            = "SELECT * FROM apikey WHERE ktunnus=?\n";

    protected static final String APIKEYS_WITH_VALUE
            = "SELECT * FROM apikey WHERE key=?\n";

    protected static final String INSERT_APIKEY
            = "INSERT INTO apikey (ktunnus, key, voimassa) VALUES (?, ?, ?)\n";

    private static Apikey byUsername(String user) {
        try {
            Connection con = DBConnectionManager.createConnection();
            CallableStatement statement = con.prepareCall(APIKEYS_OF_USER);

            statement.setString(1, user);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                String key = resultSet.getString("key");
                String tunnus = resultSet.getString("ktunnus");
                String voimassa = resultSet.getString("voimassa");

                return new Apikey(tunnus, key, voimassa);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
    
    private static List<Apikey> nonexistent(String key) {
        List<Apikey> keys = new ArrayList<Apikey>();
        try {
            Connection con = DBConnectionManager.createConnection();
            CallableStatement statement = con.prepareCall(APIKEYS_WITH_VALUE);

            statement.setString(1, key);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                String avain = resultSet.getString("key");
                String tunnus = resultSet.getString("ktunnus");
                String voimassa = resultSet.getString("voimassa");
                keys.add(new Apikey(tunnus, avain, voimassa));
            }
            
            return keys;
        } catch (Exception e) {
            return null;
        }    
    }

    private static boolean save(String key, String user) {
        try{
            Connection con = DBConnectionManager.createConnection();
            PreparedStatement statement = con.prepareStatement(INSERT_APIKEY);
            statement.setString(1, user);
            statement.setString(2, key);
            statement.setString(3, "K");
            statement.executeUpdate();
            statement.close();       
        return true;
        } catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }

    public static Apikey getByUsername(String user) {
        Apikey apikey = Apikey.byUsername(user);
        
        if (apikey==null) {
            while ( true ) {
                String key = new RandomString(20).nextString();
                List<Apikey> keys = nonexistent(key);
                if ( keys==null || keys.isEmpty() ) {
                    if ( save(key, user) ) {
                        
                    } else {
                        return new Apikey("paska", "paska", "paska");
                    }
                    apikey = Apikey.byUsername(user);
                    break;
                } else {
                    return new Apikey(""+keys.size(), ""+keys.size(), ""+keys.size());
                }
            }
            
        }
        return apikey;
    }
        
}
