package kurki.util;

import java.io.*;
import java.util.*;

/**
 * Luokka konfiguraatioden käsittelemiseen muistissa.
 */
public class Configuration {

    /**
     * Olioon kirjataan konfiguraatiotiedoston ominaisuudet. 
     */
    protected static Properties properties = new Properties();
    protected static File propertiesFile = null;
    protected static long lmod = 0;
    private static ArrayList<String> superUsers = new ArrayList();

    /**
     * Tarkastaa onko properties-olioon kirjattuna parametrina annettua avainta.
     * 
     * @param name Avaimen nimi
     * @return Onko kirjattuna
     */
    public static boolean isPropertySet(String name) {
        if (name == null) {
            return false;
        }
        return properties.containsKey(name);
    }

    /**
     * Lisää superUsers ArrayListiin konfiguraatio-tiedostossa määrittellyt superUserit.
     */
    private static void buildSuperUsersList() {
        StringTokenizer st = new StringTokenizer(properties.getProperty("superUsers"), ",");
        while (st.hasMoreTokens()) {
            String login = st.nextToken().trim();
            if (login.length() > 0) {
                superUsers.add(login);
            }
        }
    }

    /**
     * Lataa properties-olioon konfiguraatio-tiedostossa määritellyt ominaisuudet.
     */
    private static void loadProperties() {
        if (propertiesFile != null) {
            long lastModified = propertiesFile.lastModified();

            if (lmod != lastModified) {
                lmod = lastModified;
                Properties propertiesTemp = new Properties(properties);

                try {
                    FileInputStream fis = new FileInputStream(propertiesFile);
                    propertiesTemp.load(fis);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                properties = propertiesTemp;
            }
        }
        buildSuperUsersList();
    }
    
    public static Object getProperty(String name) {
        if (name == null) {
            return null;
        }
        loadProperties();
        return properties.get(name);
    }
    
    public static ArrayList<String> getSuperUsers() {
        return superUsers;
    }
    
    public static boolean setProperty(String name, Object value) {
        if (name == null || value == null) {
            return false;
        }

        properties.put(name, value);
        return true;
    }
    
    /**
     * Asettaa käytettävän konfiguraatiotiedoston.
     *
     * @param file Käytettävä tiedosto
     */
    public static void setPropertiesFile(File file) {
        if (file != null && file.exists()) {
            propertiesFile = file;
            loadProperties();
        }
    }
}
