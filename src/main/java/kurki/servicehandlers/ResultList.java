package kurki.servicehandlers;

import kurki.util.Configuration;
import kurki.util.Log;
import java.util.ResourceBundle;
import kurki.*;

import javax.servlet.http.*;
import org.apache.velocity.context.*;

public class ResultList extends AbstractVelocityServiceProvider {
    @Override
    public String handleRequest( Session session, 
				 HttpServletRequest req, 
				 HttpServletResponse res, 
				 Context context ) throws Exception {

	Log log         = (Log)Configuration.getProperty( "log" );
	String template = "resultlist.vm";
        
        //lokalisaatiobundlen lisääminen kontekstiin
        context.put("bundle", ResourceBundle.getBundle("localisationBundle", Session.locale));

        return template;
    }
}

