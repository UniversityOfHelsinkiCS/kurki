package kurki.servicehandlers;

import kurki.*;

import javax.servlet.http.*;
import org.apache.velocity.context.*;

public abstract class AbstractVelocityServiceProvider{
    
    /**
       Käsittelee http-pyynnön kutsumalla handleService-metodia ja
       huolehtimalla Templaten käsittelyyn liittyvistä 
       virhetilanteista.
    */
    public abstract String handleRequest( Session session, 
				   HttpServletRequest req, 
				   HttpServletResponse res, 
				   Context ctx ) throws Exception;

    /**
     * Metodi tarkastaa onko parametrina annettu String-olio null tai tyhjä.
     * 
     * @param toBeChecked tarkastettava String-olio
     * @return Null, jos tarkastettava String-olio on null tai tyhjä. Muuten tarkastettava String-olio trimmattuna.
     */
    protected String nullIfEmpty(String toBeChecked) {
	if (toBeChecked == null) return null;
	else {
	    toBeChecked = toBeChecked.trim();
	    if (toBeChecked.equals("")) return null;
	    else return toBeChecked;
	}
    }
}
