package kurki.servicehandlers;

import kurki.util.Configuration;
import kurki.util.Log;
import kurki.model.Course;
import kurki.model.Offering;
import kurki.*;

import java.io.*;
import java.util.*;
import javax.servlet.http.*;
import kurki.model.Osasuoritus.OsasuoritusTyyppi;
import kurki.servlet.Index;
import kurki.util.LocalisationBundle;
import org.apache.velocity.context.*;

public class CourseBasics extends AbstractVelocityServiceProvider 
    implements Serializable {

    private String SEPARATOR = "_";
    @Override
    public String handleRequest( Session session, 
				 HttpServletRequest req, 
				 HttpServletResponse res, 
				 Context context ) throws Exception {
        
        //lokalisaatiobundlen lisääminen kontekstiin
        context.put("bundle", ResourceBundle.getBundle("localisationBundle", Session.locale));

	Log log         = (Log)Configuration.getProperty( "log" );
	String template = "coursebasics.vm";
	Course course   = session.getSelectedCourse();
	String error = "";
	String result = "";

	String doBasic = req.getParameter("doBasic");
	String doScoreDef = req.getParameter("doScoreDef");
	// 	String  = req.getParameter("");

	if ( doBasic != null ) {
	    kurki.model.Osasuoritus part = null;

	    for ( int p=0; p < OsasuoritusTyyppi.ARVOSANA.ID; p++ ) {
		int nbr;
		int required;
		int xtr;

		String par = null;		
		try {
		    par = nullIfEmpty( req.getParameter( "no"+p + SEPARATOR+"nbr") );
		    if ( par != null ) {
			nbr = Integer.parseInt( par );
			part = course.getPart( p, true );
			if (!part.setNbrOfOfferings( nbr )) {
			    part = null;
			    throw new NumberFormatException();
			}
		    }
		} catch ( NumberFormatException nfe ) {
		    String pstring = null;
		    switch (p) {
		    case 0: pstring = LocalisationBundle.getString("laskuharjoitusten"); break;
		    case 1: pstring = LocalisationBundle.getString("harjoitustoiden"); break;
		    case 2: pstring = LocalisationBundle.getString("kokeiden"); break;
		    }
		    error += "<li>"+pstring+LocalisationBundle.getString("lkmAnnetVirhe")+par+"\". (0-18)</li>\n";
		}
		if ( part != null ) {
		    try {
			par = nullIfEmpty( req.getParameter( "no"+p + SEPARATOR+"req") );
			if ( par != null ) {
			    required = Integer.parseInt( par );
			    if (!part.setRequiredOfferings( required )) 
				throw new NumberFormatException();
			}
		    } catch ( NumberFormatException nfe ) {
			String pstring = null;
			switch (p) {
			case 0: pstring = LocalisationBundle.getString("laskuharjoitusten"); break;
                        case 1: pstring = LocalisationBundle.getString("harjoitustoiden"); break;
                        case 2: pstring = LocalisationBundle.getString("kokeiden"); break;
		   }
			error += "<li>"+pstring+LocalisationBundle.getString("pakolKertojenMaara")+LocalisationBundle.getString("lkmAnnetVirhe")+par
                                +"\". (0 - "+LocalisationBundle.getString("lkm")+")</li>\n";
		    }

		    try {
			par = nullIfEmpty( req.getParameter( "no"+p + SEPARATOR+"xtr") );
			if ( par != null ) {
			    xtr = Integer.parseInt( par );
			    if ( !part.setXtrScore( xtr ) )
				throw new NumberFormatException();
			}
		    } catch ( NumberFormatException nfe ) {
			String pstring = null;
			switch (p) {
                        case 0: pstring = LocalisationBundle.getString("laskuharjoitusten"); break;
                        case 1: pstring = LocalisationBundle.getString("harjoitustoiden"); break;
			}
			error += "<li>"+pstring+LocalisationBundle.getString("lisapAnnetVirheel")+par+"\". (0 - 60)</li>\n";
		    }
		}
	    }
	    if ( error.length() > 0 ) error = "<ul>\n"+error+"</ul>\n";

	    course.commitCourseInfo();
	}
	else if ( doScoreDef != null ) {
	    Vector parts = course.getParts();
	    for ( int p=0; p < parts.size(); p++ ) {
		kurki.model.Osasuoritus part = (kurki.model.Osasuoritus)parts.get( p );
		int pid = part.getType();
		Offering[] offerings = part.getOfferings();

		for ( int o=0; o < offerings.length; o++ ) {
		    int oid = offerings[o].getId();
		    int max = 0;
		    int min = 0;

		    String par = null;
		    String errcause = null;
		    try {
			par = nullIfEmpty( req.getParameter( "no"+pid+SEPARATOR+oid+SEPARATOR+"max") );
			if ( par != null ) {
			    if (!offerings[o].setMaxScore( Integer.parseInt( par ) ))
				throw new NumberFormatException();
			}
		    } catch ( NumberFormatException nfe ) {
			String pstring = null;
			switch (pid) {
			case 0: pstring = LocalisationBundle.getString("laskuharjoitukset"); break;
			case 1: pstring = LocalisationBundle.getString("harjtyo"); break;
			case 2: pstring = LocalisationBundle.getString("koePieni"); break;
			}
			error += "<li>"+(oid+1)+". "+pstring
			    +LocalisationBundle.getString("maksimPisteetVirhe")+par+"\". (0-99)</li>\n";
		    }

		    try { 		
			par = nullIfEmpty( req.getParameter( "no"+pid+SEPARATOR+oid+SEPARATOR+"min") );
			if ( par != null ) {
			    if (!offerings[o].setMinScore( min = Integer.parseInt( par ) ))
				throw new NumberFormatException();
			}
		    } catch ( NumberFormatException nfe ) {
			String pstring = null;
			switch (pid) {
                        case 0: pstring = LocalisationBundle.getString("laskuharjoitukset"); break;
			case 1: pstring = LocalisationBundle.getString("harjtyo"); break;
			case 2: pstring = LocalisationBundle.getString("koePieni"); break;
			}
			error += "<li>"+(oid+1)+". "+pstring
			    +LocalisationBundle.getString("hyvaksRajaVirhe")+par+"\". (0-"
                                +LocalisationBundle.getString("max")+")</li>\n";
		    }
		}
	    }
	    if ( error.length() > 0 ) error = "<ul>\n"+error+"</ul>\n";
	    course.commitCourseInfo();
	}

	if ( nullIfEmpty(error) != null )
	    context.put( Index.ERROR, error );

        return template;
    }
}
