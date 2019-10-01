/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package kurki.util;

import java.util.ResourceBundle;
import kurki.Session;

/**
 *
 * @author mkctammi
 */
public class LocalisationBundle {
    public static String getString(String request) {
        return ResourceBundle.getBundle("localisationBundle", Session.locale).getString(request);
    }
    public static ResourceBundle getBundle() {
        return ResourceBundle.getBundle("localisationBundle", Session.locale);
    }
}
