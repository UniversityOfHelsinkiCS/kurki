package kurki.servlet;

import kurki.util.Configuration;
import kurki.db.DBConnectionManager;
import kurki.model.Teacher;
import kurki.*;

import java.io.*;
import java.sql.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import kurki.util.LocalisationBundle;

import org.apache.velocity.*;
import org.apache.velocity.context.*;
import org.apache.velocity.exception.*;
import org.apache.velocity.servlet.*;

public class LoginManager extends VelocityServlet {

    private String LOGIN_SEPARATOR = ",";
    protected String loginManagers = LOGIN_SEPARATOR;
    
    @Override
    public synchronized void init()
	throws ServletException {
	ServletContext ctx = getServletContext();
	
	/*
	 *  Konfiguraatio...
	 */
	try {
	    Properties p = new Properties();
	    FileInputStream fis = new FileInputStream( ctx.getRealPath(ctx.getInitParameter("configurationFile")) );
	    p.load(fis);
	    
	    Enumeration propertyNames = p.propertyNames();
	    while ( propertyNames.hasMoreElements() ) {
		String key   = (String)propertyNames.nextElement();
		String value = p.getProperty( key );
		Configuration.setProperty( key, value );
	    }
	    /*
	     *  Henkilöt, joilla päivitysoikeus
	     */
	    if ( Configuration.isPropertySet("loginManagers") ) {
		StringTokenizer st = new StringTokenizer( (String)Configuration.getProperty("loginManagers"), "," );

		while ( st.hasMoreTokens() ) {
		    String login = st.nextToken().trim();
		    if ( login.length() > 0 )
			this.loginManagers += login+LOGIN_SEPARATOR;
                }
	    }
	} catch ( Exception e ) {
	    throw new ServletException(LocalisationBundle.getString("virhetilanne")+"<br>"+e.getMessage() );
	}
    }
	
    @Override
    public Template handleRequest( HttpServletRequest req,
				   HttpServletResponse res,
				   Context context )
	throws Exception {
	Template template = null;
	String error = "";

	String ruser = req.getHeader("uid");

	if ( ruser != null && this.loginManagers.indexOf( LOGIN_SEPARATOR+ruser+LOGIN_SEPARATOR ) >= 0 ) {

	    Vector teachers = new Vector();
	    Connection con = DBConnectionManager.createConnection();
	    Statement stmt = null;
	    ResultSet rs = null;
	    try {
		stmt = con.createStatement();

		if ( req.getParameter("save") != null ) {
		    Enumeration pnames = req.getParameterNames();
		    while (pnames.hasMoreElements()) {
			String p = (String)pnames.nextElement();
			StringTokenizer st = new StringTokenizer(p, ":");

			if ( st.hasMoreTokens() && st.nextToken().equals("htunnus") ) {
			    String htunnus = st.nextToken();
			    String oktunnus = (st.hasMoreTokens() ? st.nextToken() : "");
			    String ktunnus  = req.getParameter(p);
			    if ( !ktunnus.equals(oktunnus) ) {
				if ( stmt.executeUpdate("UPDATE henkilo SET ktunnus='"+ktunnus+"'\n"
							+"  WHERE htunnus='"+htunnus+"'") != 1 ) {
				    error+= LocalisationBundle.getString("ohjaajan") + " " +htunnus+" "+LocalisationBundle.getString("kirjauseionnistu") +".<br>";
				}
			    }
			}
		    }
		}

		rs = stmt.executeQuery( "SELECT htunnus, etunimet, sukunimi, hetu, ktunnus\n"
					+"FROM henkilo\n"
					+"WHERE aktiivisuus='K'\n"
					+"ORDER BY sukunimi" );

		while (rs.next()) {
		    teachers.add( new Teacher( rs.getString("htunnus"),
					       rs.getString("etunimet"),
					       rs.getString("sukunimi"),
					       rs.getString("hetu"),
					       rs.getString("ktunnus") ) );
		}
	    } finally {
		try {
		    if ( rs != null ) rs.close();
		    if ( stmt != null ) stmt.close();
		} catch ( Exception e ) {}
		DBConnectionManager.closeConnection( con );
	    }

	    context.put( "teachers", teachers );
	    context.put( "error", error );
	    
	    try {
		template = getTemplate("loginmanager.vm");
	    } catch ( ResourceNotFoundException rnfe ) {
		
	    } catch ( Exception e ) {
		
	    }
	}
        
        //lokalisaatiobundlen lisääminen kontekstiin
        context.put("bundle", ResourceBundle.getBundle("localisationBundle", Session.locale));
        
	return template;
    }
}
