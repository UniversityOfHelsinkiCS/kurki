/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package kurki.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import kurki.Session;
import kurki.model.Apikey;
import static kurki.servlet.Index.KURKI_SESSION;
import kurki.util.LocalisationBundle;

/**
 *
 * @author mluukkai
 */
public class Api extends HttpServlet{
        
    public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException{

        String ruser = request.getHeader("uid"); 
        
        Apikey apikey = Apikey.getByUsername(ruser);

        PrintWriter out = response.getWriter();
        out.println("<html>");
        out.println("<body>");
        
        if (apikey!=null) {
            out.println("<p>apikey of "+ruser+ " <em>"+apikey.getKey()+"</em></p>");
        } else {
            out.println("<p>"+ruser+" has no apikeys</p>");
        }
        
        out.println("<a href='https://opetushallinto.cs.helsinki.fi/kurki_api?authorization="+apikey.getKey()+"'<a>go to api documentation<a/>"); 
        
        out.println("</body>");
        out.println("</html>");
    }
}