package kurki;

import kurki.db.DBConnectionManager;
import kurki.model.Student;
import kurki.model.Course;
import kurki.model.CourseInfo;
import kurki.exception.InitFailedException;
import kurki.exception.NullParameterException;
import kurki.exception.CourseNotDefinedException;
import service.exception.NullIdException;
import service.exception.ServicesNotDefinedException;
import service.*;

import java.util.*;
import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import kurki.db.CoursesQuerier;
import kurki.db.CoursesQuerier.CourseQueryResult;
import kurki.servicehandlers.*;
import kurki.util.Configuration;
import kurki.util.LocalisationBundle;
import service.exception.ServicesNotLockedException;

public class Session implements java.io.Serializable {

    public static Locale locale = new Locale("fi");
    public static final int STUDENT_ON_COURSE = 0;
    public static final int STUDENT_NOT_ON_COURSE = 1;
    public static final int STUDENT_REMOVED = 2;
    public static final String LOGIN_SEPARATOR = "*";
    public static final int DEFAULT_RS_MAX_SIZE = 50;
    private static boolean initialized = false;
    protected String ruser = null;
    protected static ServiceManager serviceManager = null;
    private CourseQueryResult courses;
    
    /**
     ** Käsittelyssä oleva kurssi.
     */
    protected Course selectedCourse = null;
    /**
     ** Valittu palvelu.
     */
    protected Service selectedService = null;
    
    static {
        initialize();
    }

    /**
     ** Alustaa istunnon määrittelemällä ohjelmistoon toteutetut palvelut ja niiden käsittelijät.
     */
    public static void initialize() {
        if (initialized) {
            return;
        }

        initialized = true;
        try {
            ServiceManager.setNoOfRoles(Rooli.NO_OF_ROLES);
            ServiceManager.defineService("1entry", Rooli.TUTOR, LocalisationBundle.getString("1entry"), new Entry());
            ServiceManager.defineService("2participants", Rooli.TUTOR, LocalisationBundle.getString("2participants"), new Participants());
            ServiceManager.defineService("3coursebasics", Rooli.TUTOR, LocalisationBundle.getString("3coursebasics"), new CourseBasics());
            ServiceManager.defineService("4checklist", Rooli.TUTOR, LocalisationBundle.getString("4checklist"), new Checklist());
            ServiceManager.defineService("5grades", Rooli.TUTOR, LocalisationBundle.getString("5grades"), new Grades());
            ServiceManager.defineService("6resultlist", Rooli.TUTOR, LocalisationBundle.getString("6resultlist"), new ResultList());
            ServiceManager.defineService("7freezing", Rooli.TUTOR, LocalisationBundle.getString("7freezing"), new Freeze());
            ServiceManager.lockServices();
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(0);
        }
    }

    /**
     ** Estetään ilmentymien luonti ulkopuolisilta.
     */
    protected Session(String ruser)
            throws InitFailedException, SQLException, NullIdException, ClassNotFoundException {
        if ( ruser == null || ruser.length() == 0 ) throw new InitFailedException(LocalisationBundle.getString("kayttajanTE") + ".");
        this.ruser = ruser;
        init();
    }

    /**
     ** Onko käyttäjä jo valinnut käsiteltävän kurssin.
     */
    public boolean courseSelected() {
        return this.selectedCourse != null;
    }

    public synchronized Vector findStudents(String lname,
            String fname,
            int idtype,
            String idvalue,
            int group,
            int state,
            int resultLimit)
            throws SQLException, NullIdException, NullParameterException, ClassNotFoundException {

        CourseInfo courseInfo = this.selectedCourse.getCourseInfo();

        boolean onCourse = state != STUDENT_NOT_ON_COURSE;
        String sstate = null;

        switch (state) {

            // kurssilla 
            case STUDENT_ON_COURSE:
                sstate = "'K'";
                break;

            // ei kurssilla (..not in..)
            case STUDENT_NOT_ON_COURSE:
                sstate = "'K', 'P'";
                break;

            // poistettu kurssilta
            case STUDENT_REMOVED:
                sstate = "'P'";
                break;
            default:
                sstate = "'K'";
        }


        String select = "SELECT DISTINCT op.hetu,\n"
                + "    INITCAP(op.sukunimi) AS sukunimi,\n"
                + "    NLS_INITCAP(op.etunimi) AS etunimi,\n"
                + "    op.personid,\n"
                + "    op.sahkopostiosoite AS sposti"
                + (onCourse
                ? ",\n    os.ilmo_jnro,\n    os.ryhma_nro,\n    os.jaassa,\n"
                + "    os.laskarisuoritukset,\n    os.harjoitustyopisteet,\n    os.koepisteet\n"
                : "\n")
                + "  FROM opiskelija op"
                + (onCourse ? ", osallistuminen os\n" : "\n")
                + "  WHERE ";

        String courseWhere =
                "os.kurssikoodi = '" + courseInfo.getCCode() + "'\n"
                + "      AND os.lukukausi = '" + courseInfo.getTerm() + "'\n"
                + "      AND os.lukuvuosi = " + courseInfo.getYear() + "\n"
                + "      AND os.tyyppi = '" + courseInfo.getType() + "'\n"
                + "      AND os.kurssi_nro = " + courseInfo.getCNO() + "\n"
                + "      AND os.voimassa in (" + sstate + ")";

        if (onCourse) {
            select += "op.hetu = os.hetu\n";

            if (group > 0) {
                select += "    AND os.ilmo_jnro = " + group + "\n";
            }

            select += "    AND " + courseWhere + "\n";
        } else {
            select += "op.hetu NOT IN\n"
                    + "    (SELECT hetu FROM osallistuminen os WHERE\n"
                    + "      " + courseWhere + ")\n";
        }

        if (lname != null) {
            select += "    AND UPPER(sukunimi) LIKE '"
                    + Course.SQLApostrophe(lname.toUpperCase()) + "'\n";
        }

        if (fname != null) {
            select += "    AND UPPER(etunimi) LIKE '"
                    + Course.SQLApostrophe(fname.toUpperCase()) + "'\n";
        }

        if ( idvalue != null && !idvalue.startsWith("0")) {
            idvalue = "0"+idvalue;
        }
        
        if (idvalue != null) {
            if (idtype == 0) {
                //hae sarakkeen hetu avulla = opnro
                select += "   AND op.hetu LIKE '" + Course.SQLApostrophe(idvalue) + "'\n";
            } else if (idtype == 1) {
                // hae henkilötunnuksella
                idvalue = Course.SQLApostrophe(Student.checkSSN(idvalue, false));
                select += "    AND op.personid LIKE '" + idvalue + "'\n";
            }
        }

        select += "  ORDER BY sukunimi ASC, etunimi ASC";

        Connection con = DBConnectionManager.createConnection();
        Statement stmt = null;
        ResultSet rs = null;
        Vector students = new Vector();

        try {
            stmt = con.createStatement();
            rs = stmt.executeQuery(select);
            String[] scorecols = {"laskarisuoritukset", "harjoitustyopisteet", "koepisteet"};

            int sid = 0;
            while (rs.next()
                    && (resultLimit < 0 || sid < resultLimit)) {
                Student student = new Student(sid,
                        rs.getString("hetu"),
                        rs.getString("sukunimi"),
                        rs.getString("etunimi"),
                        rs.getString("sposti"),
                        (onCourse ? rs.getInt("ilmo_jnro") : Student.UNDEF_GROUP));

                student.setSNO(rs.getString("personid"));

                if (onCourse) {
                    student.setGroupID(rs.getInt("ryhma_nro"));
                    student.setState(rs.getString("jaassa"));
                    boolean hasScores = false;
                    for (int i = 0; i < scorecols.length && !hasScores; i++) {
                        String scores = rs.getString(scorecols[i]);
                        if (scores != null
                                && !scores.startsWith("??,??,??,??,??-??,??,??,??,??-??,??,??,??,??-??,??,??")) {
                            hasScores = true;
                        }
                    }
                    student.setHasScores(hasScores);
                }
                students.add(sid, student);
                sid++;
            }
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stmt != null) {
                    stmt.close();
                }
            } catch (Exception e) {
            }
            DBConnectionManager.closeConnection(con);
        }

        return students;
    }

    /**
     ** Suorittaa tarvittavat alustukset ja palauttaa uuden ilmentymän * tästä
     * luokasta.
     */
    public static Session getInstance(String ruser)
            throws InitFailedException, SQLException, NullIdException, ClassNotFoundException {
        return new Session(ruser);
    }

    /**
     ** Käsiteltävissä olevan kurssin perustiedot.
     */
    public CourseInfo getSelectedCourseInfo() throws CourseNotDefinedException {
        if (this.selectedCourse == null) {
            throw new CourseNotDefinedException();
        } else {
            return this.selectedCourse.getCourseInfo();
        }
    }

    public Course getSelectedCourse() {
        return this.selectedCourse;
    }

    /**
     ** Kaikkien niiden kurssien perustiedot, joilla käyttäjä ohjaajana.
     */
    public CourseInfo[] getCourseInfos() {
        return courses.coursesList;
    }

    /**
     ** Kurssin <tt>cid</tt> perustiedot.
     */
    public CourseInfo getCourseInfo(String cid) throws CourseNotDefinedException {
        if (cid == null) {
            throw new CourseNotDefinedException();
        }
        return (CourseInfo) courses.coursesMap.get(cid);
    }

    public static Locale getLanguage() {
        return locale;
    }

    public static void setLanguage(Locale l) {
        locale = l;
    }

    /**
     ** Käyttäjän päivitysoikeudet.
     */
    public Service[] getValidServices() throws ServicesNotDefinedException {
        if (this.selectedCourse == null) {
            return null;
        }

        Service[] rv = null;
        rv = this.selectedCourse.getCourseInfo().getValidServices();
        return rv;
    }

    /**
     ** Selvitetään, millä kurssilla käyttäjä on luennoitsijana, *
     * laskariohjaajana tai käytännön vastuuhenkilönä sekä * mitä päivityksiä
     * kyseinen käyttäjä saa kurssille tehdä.
     */
    protected void init()
            throws InitFailedException, SQLException, NullIdException, ClassNotFoundException {
            if (Configuration.getSuperUsers().contains(this.ruser)) {
                courses = CoursesQuerier.super_infos();
            } else {
                courses = CoursesQuerier.course_infos(this.ruser);
            }
    }

    /**
     ** Onko käyttäjä oikeutettu suorittamaan <tt>action</tt>-päivityksen.
     */
    public boolean isValidService(String service)
            throws CourseNotDefinedException, ServicesNotDefinedException {

        if (this.selectedCourse == null) {
            throw new CourseNotDefinedException();
        }

        return this.selectedCourse.getCourseInfo().isValidService(service);
    }

    public boolean isValidService(Service service)
            throws CourseNotDefinedException, ServicesNotDefinedException {

        if (this.selectedCourse == null) {
            throw new CourseNotDefinedException();
        }

        return this.selectedCourse.getCourseInfo().isValidService(service);
    }

    /**
     ** Valitaan kurssi <tt>cinfo</tt> käsittelyyn.
     */
    public boolean setSelectedCourse(CourseInfo cinfo)
            throws SQLException, NullIdException, ClassNotFoundException, NullPointerException {
        try {
            this.selectedCourse = new Course((CourseInfo) courses.coursesMap.get(cinfo.getId()));
        } catch (NullPointerException npe) {
            npe.printStackTrace();
            this.selectedCourse = null;
            return false;
        }
        return true;
    }

    /**
     ** Valitaan kurssi <tt>cid</tt> käsittelyyn.
     */
    public boolean setSelectedCourse(String cid)
            throws SQLException, NullIdException, ClassNotFoundException, NullPointerException {
        try {
            return setSelectedCourse(new CourseInfo(cid, null, -1));
        } catch (NullIdException nie) {
            return false;
        }
    }

    public Service getSelectedService() {
        return this.selectedService;
    }

    public boolean setService(String serviceId) {
        Service service = null;
        try {
            service = ServiceManager.getInstance().getService(serviceId);
        } catch (ServicesNotLockedException ex) {
            Logger.getLogger(Session.class.getName()).log(Level.SEVERE, null, ex);
        }

        if (service != null
                && courseSelected()
                && service.isValidServiceFor(this.selectedCourse.getUserRole())) {

            this.selectedService = service;
            return true;
        } else {
            this.selectedService = null;
            return false;
        }
    }

    public boolean serviceSelected() {
        return this.selectedService != null;
    }

    public String toString() {
        return "\n"+ LocalisationBundle.getString("kasitKurssi") + selectedCourse;
    }
}
