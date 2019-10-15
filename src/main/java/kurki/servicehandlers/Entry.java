package kurki.servicehandlers;

import kurki.util.Configuration;
import kurki.util.Log;
import kurki.model.Student;
import kurki.model.Course;
import kurki.model.Offering;
import kurki.*;

import java.util.*;
import javax.servlet.http.*;
import kurki.model.Osasuoritus.OsasuoritusTyyppi;
import kurki.servlet.Index;
import kurki.util.LocalisationBundle;
import org.apache.velocity.context.*;

public class Entry extends AbstractVelocityServiceProvider {

    public static final String RANGE_OP = "..";
    @Override
    public String handleRequest( Session session, 
				 HttpServletRequest req, 
				 HttpServletResponse res, 
				 Context context ) throws Exception {
        
        //lokalisaatiobundlen lisääminen kontekstiin
        context.put("bundle", ResourceBundle.getBundle("localisationBundle", Session.locale));

	Log log         = (Log)Configuration.getProperty( "log" );
	String template = "entry.vm";
	Course course   = session.getSelectedCourse();
	String error = "";
	String result = "";

	// Opiskelijasuodattimen tulkinta
	String studentFilter = "";
	String studentFilterDesc;

	/*
	 *  Http-parametrit 
	 */
	String ptype = req.getParameter( "ptype" );
	String offering    = req.getParameter( "offering" );
	String chtype  = nullIfEmpty( req.getParameter( "chtype" ) );
	String commit = nullIfEmpty( req.getParameter( "commit" ) );

	String scoredef   = req.getParameter( "scoredef" );
	String defreeze   = nullIfEmpty( req.getParameter( "defreeze" ) );
	String maxscore   = nullIfEmpty( req.getParameter( "maxscore" ) );
	String minscore   = nullIfEmpty( req.getParameter( "minscore" ) );

	// annettu opiskelijasuodatin
 	String filter   = req.getParameter( "filter" );
	
	/*
	 *  Toiminnot.
	 */
       context.put("pt",ptype);
       //aseta puuttuva offering valinta
       if (offering==null)
          offering="0";
	/*
	 *  Kirjattavan osasuoritteen valinta.
	 */
	if ( chtype == null && 
	     ptype != null && 
	     ptype.equals( ""+course.getPartType() ) ) {

	    String err = "";
	    try {
		err = LocalisationBundle.getString("suorTyyppi");
		course.selectPart( Integer.parseInt( ptype ) );

		err = LocalisationBundle.getString("suorKerta");
		course.selectOffering( Integer.parseInt( offering ) );

		err = "";
	    } catch ( NumberFormatException nfe ) {
		nfe.printStackTrace();
		log.log(LocalisationBundle.getString("virheellinenHttpP") + ": "+err, nfe );
	    }

	    /*
	     *  Opiskelijat: ryhmän, henkilötunnuksen tai sukunimem mukaan.
	     */
	    course.newSearch();
	    StringTokenizer st = new StringTokenizer( filter, ",\t\n\r\f" );
	    while ( st.hasMoreTokens() ) {
		String term = st.nextToken().trim();

		if ( term.length() == 0 ) continue;
		
		if ( studentFilter.length() > 0 ) studentFilter += ", ";

		// Haku ryhmän mukaan, jos annettu kokonaisluku...
		try {
		    int g = Integer.parseInt( term );
		    course.findByGroup( g );
		    studentFilter += g;
		}

		// ...muuten haetaan sukunimen tai henkilötunnuksen mukaan
		catch ( NumberFormatException nfe ) {
		    // Haetaan sukunimiväliä
		    int r = term.indexOf( RANGE_OP );
		    if ( r >= 0 ) {
			String from = term.substring(0, r).trim();
			String to = term.substring(r + RANGE_OP.length(),
						   term.length()).trim();

			course.findByLastNameRange( nullIfEmpty(from),
						    nullIfEmpty(to) );

			studentFilter += from+RANGE_OP+to;
		    } 
		    // Haetaan sukunimeä tai henkilötunnusta
		    else {
			studentFilter += term;
                        if (term.charAt(0) == '$') { 
                           course.findByStudentID(term.substring(1,term.length()));
                        }
                        else {
			   term = term.replace('*', '%')+"%";
			   if (term.charAt(0) == '#') {
			      course.findBySSN(term.substring(1, term.length()));
			   }
			   else {
			       course.findByLastName( term );
			   }
                        }
		    }
		}
	    }

	    if ( course.getSelectedPart().maxScoreDefined() )
		context.put( "autosave", "document.scores" );
	    context.put( "students", course.getStudents() );
	}

	/*
	 *  Vaihdetaan kirjattavan osasuoritteen tyyppiä.
	 */
	else if ( ptype != null ) {
	    try {
		int newPType = Integer.parseInt( ptype );
		course.selectPart( newPType );

		if ( newPType >= OsasuoritusTyyppi.ARVOSANA.ID ) {
		    course.getSelectedPart().selectOffering( 0 );
		}
		
		// Ota kommentti pois, jos haluat, ettei opiskelijoita näytetä
		// heti kirjattavan suoritteen tyyppiä muutettaessa.
// 		course.getSelectedPart().selectOffering( Part.UNDEF );
		studentFilter = filter;
	    } catch ( NumberFormatException nfe ) {
		log.log(LocalisationBundle.getString("virheellinenHttpP") + ": ", nfe );
	    }

	    // Kommentoi pois, jos haluat, ettei opiskelijoita näytetä
	    // heti kirjattavan suoritteen tyyppiä muutettaessa.
	    if ( course.getSelectedPart().maxScoreDefined() )
		context.put( "autosave", "document.scores" );
	    context.put( "students", course.getStudents() );
	}

	/*
	 *  Kirjattavan osasuoritteen perustietojen määritys.
	 */
	else if ( scoredef != null ) {
	    int maxs = -1;
	    int mins = -1;
	    try {
		Offering selectedOffering = course.getSelectedPart().getSelectedOffering();

		if ( maxscore != null ) {
		    maxs = Integer.parseInt( maxscore );
		    selectedOffering.setMaxScore( maxs );
		}

		if ( minscore != null ) {
		    mins = Integer.parseInt( minscore );
		    selectedOffering.setMinScore( mins );
		}

		if ( course.getSelectedPart().maxScoreDefined() )
		    context.put( "autosave", "document.scores" );
		context.put( "students", course.getStudents() );
	    } catch ( NumberFormatException nfe ) {
		if ( maxs == -1 ) error += "<li>" + LocalisationBundle.getString("osasuorituksenMpAV") + ".</li>";
		else if ( mins == -1 ) error += "<li>" + LocalisationBundle.getString("osasuorituksenHrAV") + ".</li>";
	    }
	    course.commitCourseInfo();

	    studentFilter = null;
	}

	/*
	 *  Kirjataan annetut pisteet.
	 */
	else if ( commit != null ) {
	    Vector students = course.getStudents();
            boolean pointErrors= false;

	    for ( int i=0; i < students.size(); i++ ) {
		Student s = (Student)students.get(i); // Käsiteltävä opiskelija
		String textPoints = req.getParameter( "t"+s.getId() ); // Pisteet tekstikentästä (t)
		String radioPoints = req.getParameter( "r"+s.getId() ); // Pisteet radiosta
                
                   
		if ( textPoints != null ) {
                    if (radioPoints != null && !textPoints.equals(radioPoints)) {
			error += "<li>" + LocalisationBundle.getString("pisteetRistiriitaiset1") + " " + s.getLabel() + " " + LocalisationBundle.getString("pisteetRistiriitaiset2") + "\n</li>";
                        pointErrors=true;
		    }
		    else if ( !s.setScore( course.getSelectedPart(), textPoints.toUpperCase() ) )
			error += "<li>" + LocalisationBundle.getString("pisteetVirheelliset1") + " " +s.getLabel()+ " " + LocalisationBundle.getString("pisteetVirheelliset2") + ": "+textPoints+"\n</li>";
		}
	    }
            if (pointErrors)
		error += "<li><font color=\"red\">" + LocalisationBundle.getString("jsEiToimi") + "</font></li>";
	    if ( !course.commitScores( req.getHeader("uid") ) ) {
		error += course.getMessage();
	    }
	    if ( course.getSelectedPart().maxScoreDefined() )
		context.put( "autosave", "document.scores" );
	    context.put( "students", course.getStudents() );
             context.put("bundle", ResourceBundle.getBundle("localisationBundle", Session.locale));
	    studentFilter = null;
	}
	/*
	 * Opiskelijan sulatus
	 */
	else if ( defreeze != null ) {
	    try {
		int sid = Integer.parseInt( defreeze );
		Student s = course.getStudent( sid );
		if ( !course.defreezeStudent( s ) ) {
		    error += "<li>" + LocalisationBundle.getString("sulatusEO") + ": "+course.getMessage()+"</li>";
		}
		else {
		    result += "<li>" + LocalisationBundle.getString("opiskelija") + "<i>"+s.getLabel()+"</i> " + LocalisationBundle.getString("sulatettu") + ". \n"
			+ LocalisationBundle.getString("oodiHuom") + ".</li>";
			
		}
	    } catch ( NumberFormatException nfe ) {
		error += "<li>" + LocalisationBundle.getString("jaadytysEO") + ".</li>";
	    }
	    
	    if ( course.getSelectedPart().maxScoreDefined() )
		context.put( "autosave", "document.scores" );
	    context.put( "students", course.getStudents() );
	}
	else {
	    course.selectOffering( kurki.model.Osasuoritus.UNDEF );
	}

	String par = nullIfEmpty( req.getParameter("studentFilter") );
	if ( par != null && studentFilter == null ) {
	    studentFilter = par;
	}

	studentFilterDesc = course.getSelectDescription();
	
	if ( nullIfEmpty( req.getParameter("asNotify") ) != null ) {
	    context.put( Index.RESULT, Index.asNotify(LocalisationBundle.getString("pA")));
	}
	
// 	System.out.println("here");

// 	// Annettu opiskelijasuodatin
// 	ctx.put( "filter", nullIfEmpty( filter ) );

	// Opiskelija suodattimen tulkinta
	context.put( "studentFilter",
		 ( nullIfEmpty( studentFilter ) == null
		   ? ""
		   : studentFilter ) );
	context.put( "studentFilterDesc",
		 ( nullIfEmpty( studentFilterDesc ) == null
		   ? LocalisationBundle.getString("kaikkiopiskelijat")
		   : studentFilterDesc ) );

	context.put( Index.ERROR, nullIfEmpty( error ) );
	context.put( Index.RESULT, nullIfEmpty( result ) );	
/*
	 *  Laskuharjoitus/koe/harjoitustyö kerrat.
	 */
	if ( course.getSelectedPart() != null )
	    context.put( "offerings", course.getSelectedPart().getOfferings() );

        return template;
    }
}

