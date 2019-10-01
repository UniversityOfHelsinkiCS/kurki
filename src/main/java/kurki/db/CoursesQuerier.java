/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package kurki.db;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import kurki.Rooli;
import kurki.model.CourseInfo;
import service.exception.NullIdException;

/**
 *
 * @author mkctammi
 */
public class CoursesQuerier implements Serializable {

    //Kuinka monta kuukautta kursseja saa muokata
    private static final int MONTHS_OPEN = 12;
    private static final int SUPER_OPEN = 48;
    private static final String COURSE_INFOS = //<editor-fold defaultstate="collapsed" desc="courseInfos">

            // LUENTO- (JA LABORATORIOKURSSIT)
            "SELECT DISTINCT k.kurssikoodi, k.lukuvuosi, k.lukukausi, k.tyyppi, k.tila,\n"
            + "    k.kurssi_nro, k.nimi AS nimi, k.alkamis_pvm AS alkamis_pvm, k.paattymis_pvm,\n"
            + "    decode(k.tila, 'J', 'X', 'A') AS orderBy\n"
            + "  FROM kurssi k, opetus o, opetustehtavan_hoito oh, henkilo h\n"
            + "  WHERE k.paattymis_pvm > to_date('31.12.2001','DD.MM.YYYY')\n"
            + "    AND ADD_MONTHS( k.paattymis_pvm, " + MONTHS_OPEN + " ) >= SYSDATE\n"
            //	+"    AND k.alkamis_pvm <= SYSDATE+30\n"
            + "    AND k.tila not in ('S', 'O')\n"
            // 	+"    AND k.tila not in ('S', 'O', 'J')\n" // ei jäädytettyjä kursseja
            //	+"    AND k.tyyppi in ('K', 'S')\n" // vain luentokurssit ja seminaarit
            + "    AND k.tyyppi in ('K', 'S', 'A')\n" // luento- ja laboratoriokurssit sekä seminaarit
            + "    AND o.kurssikoodi = k.kurssikoodi AND oh.kurssikoodi = k.kurssikoodi\n"
            + "    AND o.lukukausi = k.lukukausi AND oh.lukukausi = k.lukukausi\n"
            + "    AND o.lukuvuosi = k.lukuvuosi AND oh.lukuvuosi = k.lukuvuosi\n"
            + "    AND o.tyyppi = k.tyyppi AND oh.tyyppi = k.tyyppi\n"
            + "    AND o.kurssi_nro = k.kurssi_nro AND oh.kurssi_nro = k.kurssi_nro\n"
            + "    AND oh.htunnus = h.htunnus\n"
            + "    AND h.ktunnus = ?\n"
            // KOKEET
            + "UNION\n"
            + "(SELECT DISTINCT ku.kurssikoodi, ku.lukuvuosi, ku.lukukausi, ku.tyyppi, ku.tila,\n"
            + "    ku.kurssi_nro, ku.nimi || ', koe ' || TO_CHAR(ku.paattymis_pvm, 'DD.MM.YY'),\n"
            + "    ku.alkamis_pvm, ku.paattymis_pvm, decode(ku.tila, 'J', 'X', 'A') AS orderBy\n"
            + "  FROM kurssi ku, koe ko, henkilo h\n"
            + "  WHERE ku.paattymis_pvm > to_date('31.12.2001','DD.MM.YYYY')\n"
            + "    AND ADD_MONTHS( ku.paattymis_pvm, " + MONTHS_OPEN + " ) >= SYSDATE\n"
            //	+"    AND ku.paattymis_pvm <= SYSDATE+30\n"
            + "    AND ku.tyyppi = 'L'\n" // vain kokeet
            + "    AND ku.tila not in ('S', 'O')\n"
            // 	+"    AND ku.tila not in ('S', 'O', 'J')\n" // ei jäädytettyjä kursseja
            + "    AND ko.kurssikoodi = ku.kurssikoodi\n"
            + "    AND ko.lukukausi = ku.lukukausi\n"
            + "    AND ko.lukuvuosi = ku.lukuvuosi\n"
            + "    AND ko.tyyppi = ku.tyyppi\n"
            + "    AND ko.kurssi_nro = ku.kurssi_nro\n"
            + "    AND h.htunnus = ko.htunnus\n"
            + "    AND h.ktunnus = ?)\n"
            + "ORDER BY orderBy ASC, nimi ASC, alkamis_pvm ASC";
    //</editor-fold>
    private static final String SUPER_INFOS = //<editor-fold defaultstate="collapsed" desc="superInfos">

            "SELECT DISTINCT k.kurssikoodi, k.lukuvuosi, k.lukukausi, k.tyyppi, k.tila,\n"
            + "    k.kurssi_nro, k.nimi AS nimi, k.alkamis_pvm AS alkamis_pvm, k.paattymis_pvm,\n"
            + "    decode(k.tila, 'J', 'X', 'A') AS orderBy\n"
            + "  FROM kurssi k\n"
            + "  WHERE k.paattymis_pvm > to_date('31.12.2001','DD.MM.YYYY')\n"
            + "    AND ADD_MONTHS( k.paattymis_pvm, " + SUPER_OPEN + " ) >= SYSDATE\n"
            //	+"    AND k.alkamis_pvm <= SYSDATE+30\n"
            //      +"    AND k.tyyppi in ('K', 'S')\n" // vain luentokurssit ja seminaarit
            + "    AND k.tyyppi in ('K', 'S', 'A')\n" // luento- ja laboratoriokurssit sekä seminaarit
            + "    AND k.tila not in ('S', 'O')\n"
            // 	+"    AND k.tila not in ('S', 'O', 'J')\n" // ei jäädytettyjä kursseja

            // KOKEET
            + "UNION\n"
            + "(SELECT DISTINCT ku.kurssikoodi, ku.lukuvuosi, ku.lukukausi, ku.tyyppi, ku.tila,\n"
            + "    ku.kurssi_nro, ku.nimi || ', koe ' || TO_CHAR(ku.paattymis_pvm, ' DD.MM.YY'),\n"
            + "    ku.alkamis_pvm, ku.paattymis_pvm, decode(ku.tila, 'J', 'X', 'A') AS orderBy\n"
            + "  FROM kurssi ku\n"
            + "  WHERE ku.paattymis_pvm > to_date('31.12.2001','DD.MM.YYYY')\n"
            + "    AND ADD_MONTHS( ku.paattymis_pvm, " + SUPER_OPEN + " ) >= SYSDATE\n"
            //	+"    AND ku.paattymis_pvm <= SYSDATE+30\n"
            + "    AND ku.tila not in ('S', 'O')\n"
            // 	+"    AND ku.tila not in ('S', 'O', 'J')\n" // ei jäädytettyjä kursseja
            + "    AND ku.tyyppi = 'L')\n" // vain kokeet
            + "ORDER BY orderBy ASC, nimi ASC, alkamis_pvm ASC";
    //</editor-fold>
    public static class CourseQueryResult implements Serializable{
        public HashMap<String, CourseInfo> coursesMap;
        public CourseInfo[] coursesList;

        public CourseQueryResult(HashMap<String, CourseInfo> coursesMap, CourseInfo[] coursesList) {
            this.coursesMap = coursesMap;
            this.coursesList = coursesList;
        }
        
    }

    public static CourseQueryResult super_infos() throws SQLException, ClassNotFoundException, NullIdException {
        Connection databaseConnection = DBConnectionManager.createConnection();
        PreparedStatement preparedStatement = databaseConnection.prepareStatement(SUPER_INFOS);
        return execute_statement(databaseConnection, preparedStatement);
    }

    public static CourseQueryResult course_infos(String ruser) throws SQLException, ClassNotFoundException, NullIdException {
        Connection databaseConnection = DBConnectionManager.createConnection();
        PreparedStatement preparedStatement = databaseConnection.prepareStatement(COURSE_INFOS);
        preparedStatement.setString(1, ruser);
        preparedStatement.setString(2, ruser);
        return execute_statement(databaseConnection, preparedStatement);
    }

    private static CourseQueryResult execute_statement(Connection databaseConnection, PreparedStatement preparedStatement) throws NullIdException, SQLException {
        ResultSet resultSet = preparedStatement.executeQuery();

        HashMap<String, CourseInfo> coursesMap = new HashMap();
        ArrayList<CourseInfo> coursesList = new ArrayList();

        while (resultSet.next()) {
            int lukuvuosi = resultSet.getInt("lukuvuosi");
            String lukukausi = resultSet.getString("lukukausi");
            String tila = resultSet.getString("tila");
            String nameaux = " [" + lukukausi + ("" + lukuvuosi).substring(2, 4) + "]";

            CourseInfo cinfo = new CourseInfo(resultSet.getString("kurssikoodi"),
                    lukuvuosi,
                    lukukausi,
                    resultSet.getString("tyyppi"),
                    resultSet.getInt("kurssi_nro"),
                    resultSet.getString("nimi") + nameaux,
                    Rooli.SUPER); // kurssin perustiedot
            if (tila != null && tila.equals("J")) {
                cinfo.freeze();
            }
            coursesMap.put(cinfo.getId(), cinfo);
            coursesList.add(cinfo);
        }

        resultSet.close();
        preparedStatement.close();
        
        DBConnectionManager.closeConnection(databaseConnection);
        return new CourseQueryResult(coursesMap, coursesList.toArray(new CourseInfo[coursesList.size()]));
    }
}
