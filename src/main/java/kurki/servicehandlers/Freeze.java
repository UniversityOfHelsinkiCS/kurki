package kurki.servicehandlers;

import kurki.util.Configuration;
import kurki.util.Log;
import kurki.model.Course;
import kurki.model.CourseInfo;

import java.io.*;
import java.sql.SQLException;
import java.util.*;
import javax.servlet.http.*;

import org.apache.velocity.*;
import org.apache.velocity.context.*;
import org.apache.velocity.app.*;

import javax.mail.*; 
import javax.mail.internet.*;
import kurki.exception.NullParameterException;
import kurki.servlet.Index;
import kurki.util.LocalisationBundle;
import service.exception.NullIdException;

public class Freeze extends AbstractVelocityServiceProvider {
   public static final String KURKIMAIL = "<a href=\"mailto:tktl-kurki@cs.helsinki.fi\">tktl-kurki@cs.helsinki.fi</a>";
   
   @Override
    public String handleRequest(kurki.Session session, 
				 HttpServletRequest req, 
				 HttpServletResponse res, 
				 Context context) throws Exception {
        
        context.put("bundle", ResourceBundle.getBundle("localisationBundle", kurki.Session.locale));

	Log log         = (Log)Configuration.getProperty( "log" );
	String template = "freeze.vm";
	Course course = session.getSelectedCourse();
	String freeze = req.getParameter("freeze");
	String error = "";
	String result = "";
        
       

	if (freeze != null) {
            
           error = x(nullIfEmpty(req.getParameter("examDate")), error, course);

	    if ( course.getExamDate() != null ) {
		CourseInfo ci = course.getCourseInfo();
		boolean isFirstTime = false;
                String deptAddress="@cs.helsinki.fi";
		String resultList = "";
                List <String> informed = new ArrayList <String>();
		String oodiAddress = (String)Configuration.getProperty("oodi");
                String userID= req.getHeader("uid");
		String userToAddress = userID+deptAddress;
                String donID= course.getDonKtunnus();
                String donAddress= null;
                if (donID==null) { 
                   donAddress= course.getDonEmail();
                }   
                else { 
                   donAddress= donID + deptAddress;
                }
		/*
		 *  Tuloslista jäädytyksen tekijälle sekä Oodi-siirroista vastaavalle.
		 */
		String subject = "KURKI: "+ci.getName();
		if (course.isFrozen()) {
		    subject += " korjaukset / modifications";
		}
		else {
		    subject += " tulokset / results";
		}

                course.newSearch();
		VelocityContext results = setResults(new VelocityContext(), course, session);
		
		// Korjauslista
		if (course.isFrozen()) {
		    results.put( "inc_changes", "true" ); // vain muutokset
		}

		Calendar calendar = Calendar.getInstance();
		results.put( "sysdate", 
			     +calendar.get(Calendar.DAY_OF_MONTH)+"."
			     +(calendar.get(Calendar.MONTH)+1)+"."
			     +calendar.get(Calendar.YEAR) );

		StringWriter stringWriter = new StringWriter();
                Velocity.mergeTemplate("checklist99.vm", "utf-8", results, stringWriter);
                
		if  (course.freeze(0)) {
                    informed.add(oodiAddress);
                    informed.add(userToAddress);
                    if (donAddress != null && !donAddress.equals(userToAddress))
                        informed.add(donAddress);
                        
		    //sendMail(subject, stringWriter.toString(), oodiAddress, userToAddress);
                    sendMail(subject, stringWriter.toString(), informed);
                    
		    result = FreezingSucceededMessage(result, oodiAddress, isFirstTime);
// 		    // Heitetään käyttäjä pihalle järjestelmästä
// 		    req.getSession().invalidate();
// 		    res.sendRedirect("https://ilmo.cs.helsinki.fi/kurki/jaassa.html");
		}
		else {
                    error = FreezingFailedError(error, course);
		}
	    }
	}

	if (nullIfEmpty(result) != null)
	    context.put(Index.RESULT, result);
	if (nullIfEmpty(error) != null )
	    context.put(Index.ERROR, error);
	
        return template;
   }
   
   private String x(String examDate, String error, Course course) throws SQLException, ClassNotFoundException {
        if (examDate != null) {
            if (course.setExamDate(examDate)) {
                course.commitGradeDef();
                return error;
            }
            else {
                error += "<li>"+course.getMessage();
                return error;
            }
        }
        else if (course.getExamDate() == null) {
            error += "<li>" + LocalisationBundle.getString("annaSuorPvm") + "</li>";
            return error;
        }
        return error;
   }
   
   private String FreezingSucceededMessage(String result, String oodiAddress, Boolean isFirstTime) {
        result = "<center><h3>" + LocalisationBundle.getString("jaadytysInfo") + "</h3></center>\n"
            +"<ul>\n";

        if (isFirstTime ) {
            result += "<li>" + LocalisationBundle.getString("jaadytysInfo2")
                +": <a href='mailto:"+oodiAddress+"'>"+oodiAddress+"</a> "
                + LocalisationBundle.getString("jaadytysInfo2Jatkoa") + " "
                +KURKIMAIL
                +"</li>";
        }
        result += "<li>" + LocalisationBundle.getString("jaadytysInfo3") + ".</li>";

        result += "<li>" + LocalisationBundle.getString("jaadytysInfo4") 
            +".</li></ul>\n";
        return result;
   }
   
   /**
    * 
    * 
    * @param error String-olio, johon virheilmoitus talletetaan
    * @param course Istunnossa valittu kurssi
    * @return String-olio, joka sisältää jäädytyksen epäonnistumisesta ilmoittavan virheilmoituksen
    */
   private String FreezingFailedError(String error, Course course) {
        String errorMessage = course.getMessage();
        if (errorMessage == null) {
            error = LocalisationBundle.getString("jaadytysEpaonnistui") + ". "
                + LocalisationBundle.getString("jaadytysEpaonnistuiInfo") + " "
                + KURKIMAIL
                + "</li>";
        }
        else {
            error = LocalisationBundle.getString("jaadytysEpaonnistui") + " ("+errorMessage+"). "
                + LocalisationBundle.getString("jaadytysEpaonnistuiInfo") + " "
                + KURKIMAIL
                + "</li>";
        }
        return error;
   }
   
   /**
    * 
    * 
    * @param subject
    * @param msg
    * @param oodiAddress
    * @param userToAddress
    * @throws AddressException
    * @throws MessagingException 
    */
   //private void sendMail(String subject, String msg, String oodiAddress, String userToAddress) 
   //        throws AddressException, MessagingException {
 private void sendMail(String subject, String msg, List <String> recievers) 
           throws AddressException, MessagingException {        
        List<Address> addresses = new ArrayList<Address>();
        for (String r:recievers) { 
            if ( r!=null ) {
                addresses.add(new InternetAddress(r));
            }
            
            //message.addRecipient(Message.RecipientType.TO, new InternetAddress( r ) );
        }
        Address[] addressArray = addresses.toArray(new Address[0]);
        
        Properties properties = new Properties();
        properties.put("mail.smtp.host", "localhost");
        javax.mail.Session mailSession = javax.mail.Session.getInstance(properties,null);
        InternetAddress from = new InternetAddress((String)Configuration.getProperty("webmaster"));
        MimeMessage message;

        // Jäädytysilmoitus Oodisiirroista vastaavalle ja jäädytyksen suorittajalle
        message = new MimeMessage(mailSession);
        message.setFrom(from);
        message.addRecipients(Message.RecipientType.TO, addressArray);

//        message.addRecipient(Message.RecipientType.TO, new InternetAddress( userToAddress ) );
        message.setSubject(subject);
        message.setText(msg,"utf-8","html");
        Transport.send(message);
   }
   
   /**
    * Metodi lisää velocitycontextiin avain-arvo pareja.
    * 
    * @param results Contexti johon lisätään
    * @param course Istunnossa valittu kurssi
    * @param session Käyttäjän istunto
    * @throws SQLException
    * @throws NullIdException
    * @throws NullParameterException
    * @throws ClassNotFoundException 
    */
   private VelocityContext setResults(VelocityContext results, Course course, kurki.Session session) 
           throws SQLException, NullIdException, NullParameterException, ClassNotFoundException {
        results.put("bundle", ResourceBundle.getBundle("localisationBundle", kurki.Session.locale));
        results.put("students", course.getStudents());
        results.put("selectedCourse", session.getSelectedCourse());
        results.put("inc_ssn", "true"); // Opiskelijanro (HL08/8/)
        results.put("inc_name", "true"); // Nimi
// 	results.put("inc_lhsum", "true"); // Laskaripisteet
// 	results.put("inc_lhsumname", "LH-pisteet"); //  Laskaripisteiden sarakeotsake
// 	results.put("inc_htsum", "true"); // Harjoitustyöpisteet
// 	results.put("inc_htsumname", "HT-pisteet"); //  Harjoitustyöpisteiden sarakeotsake
// 	results.put("inc_koesum", "true"); // Koepisteet 
// 	results.put("inc_koesumname", "Koepisteet"); //  Koepisteiden sarakeotsake
// 	results.put("inc_sum", "true"); // Yhteispisteet
// 	results.put("inc_sumname", "Yhteispisteet"); // Yhteispisteiden sarakeotsake
// 	results.put("inc_signature", "true"); // Hyväksyjän allekirjoitus
        results.put("inc_crunits", "true"); // opintopisteet
        results.put("inc_lang","true");
        results.put("inc_cruname", "OP");
        results.put("inc_langname", "   ");
        results.put("inc_statistics", "true"); // Tilastot
        results.put("inc_grade", "true"); // Arvosana
        results.put("inc_gradename", "Arvosana"); // Arvosanan sarakeotsake
        results.put("inc_accepted", "true"); // Hyväksytyt
        results.put("inc_failed", "true"); // Hylätyt   
// 	results.put("inc_", "true");
        return results;
   }
}

