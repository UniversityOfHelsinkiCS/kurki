package kurki.servlet;
import javax.servlet.http.*;

public class ServletMonitor {
    private static ServletMonitor servletMonitor = new ServletMonitor();

    private ServletMonitor() {}

    /**
     * Lukitsee session-olion, jos istunto on validi.
     * 
     * @param session Lukittava istunto
     * @return Onko istunto validi 
     */
    public synchronized boolean lock(HttpSession session) {
	try {
	    while (session.getAttribute("lock") != null) {
		try {
		    wait();
		} catch (InterruptedException e) {}
	    }
	    session.setAttribute("lock", "lock");
	    return true;
	} catch (IllegalStateException sessionInvalidated) {
	    return false;
	}
    }

    public synchronized boolean unlock(HttpSession session) {
	try {
	    session.removeAttribute("lock");
	    return true;
	} catch (IllegalStateException ise) {
	    return false;
	} finally {
	    notifyAll();
	}
    }
    
    public static ServletMonitor getMonitor() {
	return servletMonitor;
    }
}
