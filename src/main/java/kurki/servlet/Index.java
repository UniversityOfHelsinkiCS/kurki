package kurki.servlet;

import kurki.util.Configuration;
import kurki.util.Log;
import kurki.model.CourseInfo;
import kurki.util.LocalisationBundle;
import kurki.servicehandlers.AbstractVelocityServiceProvider;
import kurki.servicehandlers.CourseBasics;
import kurki.*;
import service.*;

import java.io.*;
import java.sql.SQLException;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import kurki.exception.InitFailedException;
import kurki.model.Course;

import org.apache.velocity.*;
import org.apache.velocity.context.*;
import org.apache.velocity.servlet.*;
import service.exception.NullIdException;

public class Index extends VelocityServlet implements Log, Serializable {

    //Nää on jotain http parametrien nimiä millä tää spagetti kommunikoi sisäisesti
    //(AbstractVelocityServiceProviderit puhuu tälle YyberServletille)
    public static final String RESULT = "result";
    public static final String ERROR = "error";
    public static final String INDEX = "index";
    public static final String SERVICE = "service";
    public static final String COURSE = "course";
    private boolean initialized = false;
    private final String BASIC_TEMPLATE = "index.vm";
    private final String SYNCHRONIZATION_ERROR = "syncerror.vm";
    public static final String TIMESTAMP = "TS";
    private int session_lenght = 3600;
    public static final String KURKI_SESSION = "session";
    
    private static String result = null;

    static {
        Session.initialize();
    }

    @Override
    public synchronized void init() {
        if (!initialized) {
                init_config();
            initialized = true;
        }
    }

    private void init_config() {
        ServletContext ctx = getServletContext();
        
        
        File configurationFile = new File(ctx.getRealPath(ctx.getInitParameter("configurationFile")));
        if (!configurationFile.exists()) {
            throw new IllegalArgumentException("The file " + configurationFile.getAbsolutePath() + " does not exist!");
        }
        Configuration.setPropertiesFile(configurationFile);
        //Lisätään tieto lokista konfiguraatioon.
        Configuration.setProperty("log", this);
    }
    
    /**
     * Metodi hakee olemassaolevan istunnon tai luo uuden istunnon, 
     * jos istuntoa ei ole tai istunto on epäkelpo. 
     * 
     * @param servletRequest Servlet pyyntö
     * @return Istunto
     */
    private HttpSession getSession(HttpServletRequest servletRequest) {
        boolean oldSession = servletRequest.getRequestedSessionId() != null;
        HttpSession httpSession = servletRequest.getSession();
        httpSession.setMaxInactiveInterval(session_lenght);
        if (!ServletMonitor.getMonitor().lock(httpSession)) {
            httpSession = servletRequest.getSession(true);
            ServletMonitor.getMonitor().lock(httpSession);
        }
        
        if (oldSession && httpSession.isNew()) {
            Index.result += LocalisationBundle.getString("istuntoVanhentunutError");
        }
        return  httpSession;
    }

    @Override
    protected void doRequest(HttpServletRequest servletRequest,
            HttpServletResponse servletResponse)
            throws ServletException, IOException {
        
        String timestamp;
        String error = "";
        String result = "";
        CourseInfo course;
        Session session = null;
        Context context = null;
        AbstractVelocityServiceProvider serviceProvider;
        Template template = null;
        HttpSession httpSession = null;

        try { 
            setContentType(servletRequest, servletResponse);
            context = createContext(servletRequest, servletResponse);
            context.put("bundle", LocalisationBundle.getBundle());
   //         servletResponse.setContentType("text/html;charset=UTF-8");
           
            
            httpSession = getSession(servletRequest);
            Object tmpSession = httpSession.getAttribute(KURKI_SESSION);

            if (tmpSession != null) {
                session = (Session) tmpSession;
            } else {
                String ruser = servletRequest.getRemoteUser();
                
                if (ruser==null && Configuration.getProperty("development") != null ) {
                    ruser = Configuration.getProperty("development").toString(); 
                }
                
                session = Session.getInstance(ruser);
                httpSession.setAttribute(KURKI_SESSION, session);
            }

            /*
             *  Millä kursseilla käyttäjä on ohjaajana tai luennoitsijana
             *  --> courses
             */
            CourseInfo[] courseInfos = session.getCourseInfos();
            context.put("courseInfos", (courseInfos.length > 0 ? courseInfos : null));


            /*
             *  Selvitä valittu kurssi
             */
            try {
                // Onko kurssivalinta tullut http-parametrina?
                course = session.getCourseInfo(nullIfEmpty(servletRequest.getParameter(COURSE)));
            } catch (Exception e) {
                course = null;
            }

            // kurssi http-parametrina
            if (course != null) {
                session.setSelectedCourse(course);
            } // kurssi valittu aikaisemmin
            else if (session.courseSelected()) {
                course = session.getSelectedCourseInfo();
            }

            context.put("selectedCourse", session.getSelectedCourse());

            /*
             *  Selvitä mihin toimintoihin käyttäjä on oikeutettu 
             *  suhteessa valittuun kurssiin
             */
            if (session.courseSelected()) {
                context.put("services",
                        session.getValidServices());
            }


            /*
             *  Pyytääkö käyttäjä uutta palvelua?
             */
            String service = nullIfEmpty(servletRequest.getParameter(SERVICE));

            if (service != null
                    && session.courseSelected()) {

                // palvelua ei ole määritelty tai käyttäjän oikeudet eivät riitä
                if (!session.setService(service)) {
                }
            }

            /*
             *  Aikaleiman tarkistus
             */
            String reqts = servletRequest.getParameter(TIMESTAMP);
            Object tmp = httpSession.getAttribute(TIMESTAMP);
            if (tmp != null) {
                timestamp = (String) tmp;
            } else {
                timestamp = null;
            }

            /*
             *  Palvelin ja käyttöliittymä eivät ole synkronissa - kriittinen toiminto
             */
            if (reqts != null && timestamp != null && !reqts.equals(timestamp)) {
                template = getTemplate(SYNCHRONIZATION_ERROR);
            } 
            //Kurssi ja palvelu valittu
            else if (session.courseSelected()
                    && session.serviceSelected()) {
                
                serviceProvider = session.getSelectedService().getHandler();
                context.put("selectedService", session.getSelectedService());

                String serviceTemplateName = serviceProvider.handleRequest(session, servletRequest, servletResponse, context);

                if (serviceTemplateName != null) {
                    template = getTemplate(serviceTemplateName);
                }
            } // muuten pyydä valitsemaan palvelu
            else {
                template = getTemplate(BASIC_TEMPLATE);
            }

            try {
                /*
                 *  Uusi aikaleima.
                 */
                timestamp = "" + System.currentTimeMillis();
                httpSession.setAttribute(TIMESTAMP, timestamp);
                context.put(TIMESTAMP, timestamp);

                /*
                 *  Automaattinen välitallennus - päällä vai poissa?
                 */
                tmp = nullIfEmpty(servletRequest.getParameter("asToggle"));
                if (tmp != null) {
                    context.put("asToggle", tmp);
                    httpSession.setAttribute("asToggle", tmp);

                } else if ((tmp = httpSession.getAttribute("asToggle")) != null) {
                    context.put("asToggle", tmp);
                }

                context.put("sessionLen", "" + session_lenght);
            } catch (IllegalStateException ise) {
            }


            context.put("webmaster", (String) Configuration.getProperty("webmaster"));

            if (nullIfEmpty(error) != null) {
                context.put(Index.ERROR, error);
            }
            if (nullIfEmpty(result) != null) {
                context.put(Index.RESULT, result);
            }

            /*
             *  bail if we can't find the template
             */
            if (template == null) {
                return;
            }

            /*
             *  now merge it
             */

            mergeTemplate(template, context, servletResponse);

            /*
             *  call cleanup routine to let a derived class do some cleanup
             */

            requestCleanup(servletRequest, servletResponse, context);
        } catch (Exception e) {
            outputError(e, servletResponse);
        } finally {
            if (httpSession != null) {
                ServletMonitor.getMonitor().unlock(httpSession);
            } else {
                ServletMonitor.getMonitor().notifyAll();
            }
        }
    }

    private void outputError(Exception e, ServletResponse servletResponse) throws IOException {

        /*
         *  call the error handler to let the derived class
         *  do something useful with this failure.
         */
        ServletOutputStream out;
        servletResponse.setContentType("text/html; charset=UTF-8");
        out = servletResponse.getOutputStream();

        out.println("<html><head>\n<title>"+LocalisationBundle.getString("kurkivirhe")+"</title>\n"
                + "<link rel='stylesheet' href='../kurki.css' title='kurki'>\n</head><body>\n"
                + "<div class='error' style='text-align:center;width=500px'>\n"
                + "<h2>"+LocalisationBundle.getString("virheilmoitus")+"</h2>\n<hr>\n<pre align='left'>\n");
        e.printStackTrace(new PrintStream(out));
        out.println("\n</pre>\n<hr>\n<a href=\"mailto:tktl-kurki@cs.Helsinki.FI\">tktl-kurki@cs.Helsinki.FI</a></div></body></html>");

        e.printStackTrace();
    }

    protected String nullIfEmpty(String str) {
        if (str == null || str.equals("")) {
            return null;
        } else {
            return str;
        }
    }
    public static String asNotify(String target) {
        Calendar calendar = Calendar.getInstance();
        int minute = calendar.get(Calendar.MINUTE);
        return target + LocalisationBundle.getString("tallennettuAutom")
                + calendar.get(Calendar.DAY_OF_MONTH)
                + "." + (calendar.get(Calendar.MONTH) + 1)
                + "." + calendar.get(Calendar.YEAR) + " " + LocalisationBundle.getString("klo") + " "
                + calendar.get(Calendar.HOUR_OF_DAY) + ":"
                + (minute < 10 ? "0" + minute : "" + minute) + ".";
    }
    @Override
    protected void setContentType(HttpServletRequest request, HttpServletResponse response ) {
        response.setContentType("text/html;charset=UTF-8");
        try {
            request.setCharacterEncoding("UTF-8");
        }
        catch (Exception e)
        {}
    }
}