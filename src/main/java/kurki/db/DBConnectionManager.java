package kurki.db;

import java.io.*;
import java.sql.*;
import kurki.util.Configuration;
import kurki.util.LocalisationBundle;
import kurki.util.LocalisationBundle;

/**
 * Luokka tietokantayhteyksien hallitsemiseen.
 */
public class DBConnectionManager 
    implements Serializable {

    /**
     * Luo tietokantayhteyden.
     * 
     * @return Luotu yhteys
     * 
     * @throws SQLException Jos tietokantayhteyden luonti ei onnistunut
     * @throws ClassNotFoundException Jos tietokanta-ajurin luokkaa ei löydy
     */
    public static Connection createConnection() throws SQLException, ClassNotFoundException {
	Class.forName((String)Configuration.getProperty("dbDriver"));

	Connection con = DriverManager.getConnection((String)Configuration.getProperty("dbServer"),
						      (String)Configuration.getProperty("dbUser"),
						      (String)Configuration.getProperty("dbPassword"));
	if (con == null)
	    throw new SQLException(LocalisationBundle.getString("tietokantaVirhe"));
	else
	    return con;
    }

    /**
     * Sulkee tietokantayhteyden.
     * 
     * @param con Suljettava yhteys
     */
    public static void closeConnection(Connection con) {
	try {
	    con.close();
	} catch (SQLException e) {}
    }
}
