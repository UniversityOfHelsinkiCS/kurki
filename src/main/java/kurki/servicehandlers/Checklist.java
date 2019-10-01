package kurki.servicehandlers;

import java.util.ResourceBundle;
import kurki.*;

import javax.servlet.http.*;
import org.apache.velocity.context.*;

public class Checklist extends AbstractVelocityServiceProvider {
    @Override
    public String handleRequest( Session session, 
				 HttpServletRequest req, 
				 HttpServletResponse res, 
				 Context context ) throws Exception {
	String template = "checklist.vm";
        
        //lokalisaatiobundlen lisääminen kontekstiin
        context.put("bundle", ResourceBundle.getBundle("localisationBundle", Session.locale));
	return template; 
    }
}

