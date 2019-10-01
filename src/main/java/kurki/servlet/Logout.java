package kurki.servlet;


import java.io.*;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.*;
import javax.servlet.http.*;
import kurki.Session;
import org.apache.velocity.Template;
import org.apache.velocity.context.Context;
import org.apache.velocity.exception.MethodInvocationException;
import org.apache.velocity.exception.ParseErrorException;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.apache.velocity.servlet.VelocityServlet;

public class Logout extends VelocityServlet {

    @Override
    public void service( HttpServletRequest req, HttpServletResponse res )
	throws ServletException, IOException {
	HttpSession s = req.getSession();
        
	s.invalidate();
        Context context = createContext(req, res);
	context.put("bundle", ResourceBundle.getBundle("localisationBundle", Session.locale));
        Template template = null;
        try {
            template = getTemplate("logout.vm");
        } catch (ResourceNotFoundException ex) {
            Logger.getLogger(Logout.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParseErrorException ex) {
            Logger.getLogger(Logout.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(Logout.class.getName()).log(Level.SEVERE, null, ex);
        }
        try {
            mergeTemplate(template, context, res);
        } catch (ResourceNotFoundException ex) {
            Logger.getLogger(Logout.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParseErrorException ex) {
            Logger.getLogger(Logout.class.getName()).log(Level.SEVERE, null, ex);
        } catch (MethodInvocationException ex) {
            Logger.getLogger(Logout.class.getName()).log(Level.SEVERE, null, ex);
        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(Logout.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(Logout.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}