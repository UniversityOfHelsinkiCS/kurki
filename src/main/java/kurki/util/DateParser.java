/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package kurki.util;

import java.util.Calendar;

/**
 *
 * @author mkctammi
 */
public class DateParser {
       
    public static Calendar parseDate(String date) {
        if (date == null || date.length() < 8) {
            return null;
        }
        Calendar c = Calendar.getInstance();
        c.clear();
        
        String val = null;
        
        int i = date.indexOf(".");
        if (i > 0) {
            val = date.substring(0, i);
            date = date.substring(i + 1, date.length());
            c.set(Calendar.DATE, Integer.parseInt(val));
        } else {
            return null;
        }
        
        i = date.indexOf(".");
        if (i > 0) {
            val = date.substring(0, i);
            date = date.substring(i + 1, date.length());
            c.set(Calendar.MONTH, (Integer.parseInt(val) - 1));
        } else {
            return null;
        }
        
        if (date.length() > 0) {
            val = date;
            c.set(Calendar.YEAR, Integer.parseInt(val));
        } else {
            return null;
        }
        
        return c;
    }

}
