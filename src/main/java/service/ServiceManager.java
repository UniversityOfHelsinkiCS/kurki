package service;

import java.io.Serializable;
import service.exception.UndefinedRoleException;
import service.exception.ServiceAlreadyDefinedException;
import service.exception.NullIdException;
import service.exception.ServicesLockedException;
import service.exception.ServicesNotLockedException;
import java.util.*;
import java.util.Map.Entry;
import kurki.servicehandlers.AbstractVelocityServiceProvider;

/**
 * Luokka palveluiden hallitsemiseen.
 */
public class ServiceManager implements Serializable {
    
    private static ServiceManager instance = null;
    private static boolean locked = false;
    protected static final int DEF_NO_OF_ROLES = 1;
    private static int noOfRoles = DEF_NO_OF_ROLES;
    /**
     * Määritellyt palvelut
     */
    private static Hashtable<String, ServiceAdapter> services = new Hashtable();
    protected static final Vector servicesByRoles = new Vector();
    
    /**
     * Metodi määrittelee uuden palvelun ja kirjaa sen services hajautustauluun.
     * 
     * @param id Palvelun tunniste
     * @param lowest_role_to_allow Alhaisin käyttäjärooli, jolla on oikeus käyttää palvelua
     * @param description Palvelun kuvaus
     * @param handler Palvelunkäsittelijä
     * @throws NullIdException
     * @throws ServiceAlreadyDefinedException
     * @throws ServicesLockedException
     * @throws UndefinedRoleException 
     */
    public static void defineService(String id, int lowest_role_to_allow, String description, AbstractVelocityServiceProvider handler)
	throws NullIdException, ServiceAlreadyDefinedException, ServicesLockedException, UndefinedRoleException {
	if (locked)
	    throw new ServicesLockedException();

	else if (lowest_role_to_allow < 0 || lowest_role_to_allow >= noOfRoles) 
	    throw new UndefinedRoleException();

	else if (id == null)
	    throw new NullIdException();

	else if (services.containsKey(id))
	    throw new ServiceAlreadyDefinedException(); 

	ServiceAdapter newService = new ServiceAdapter(id, lowest_role_to_allow, description, handler);
	services.put(id, newService);
    }
    
    /**
     * Lukitsee jokaiselle käyttäjäroolille roolin 
     * oikeuttamat palvelut.
     * 
     * @see #initializeAndAddServices() 
     * @see #changeRolesFromVectorIntoTable() 
     * @throws ServicesLockedException
     */
    public static void lockServices() 
	throws ServicesLockedException {
	if (locked) throw new ServicesLockedException();
	
	locked = true;
        initializeAndAddServices();
        changeRolesFromVectorIntoTable();
	instance = new ServiceManager();
    }
    
    /**
     * Alustaa servicesByRoles-vektorin ja lisää kyseiseen vektoriin 
     * jokaiselle käyttäjäroolille omaan vektoriinsa roolin oikeuttamat palvelut.
     */
    private static void initializeAndAddServices() {
        for (int i=0; i<noOfRoles; i++) {
	    servicesByRoles.add(i, new Vector());
	}
        
	Enumeration serviceList = services.elements();
	Service service;

	while (serviceList.hasMoreElements()) {
	    service = (Service)serviceList.nextElement();
            
	    for (int i = service.getLowestRole(); i<noOfRoles; i++) {
		((Vector)servicesByRoles.get(i)).add(service);
	    }
	}
    } 
    
    /**
     * Vaihtaa servicesByRoles-vektorin jokaiselle käyttäjäroolille roolin 
     * oikeuttamat palvelut vektorista ServiceAdapter taulukkoon.
     */
    private static void changeRolesFromVectorIntoTable() {
        for (int i=0; i<noOfRoles; i++) {
	    Vector servicesForRoleVector = (Vector)servicesByRoles.get(i);
	    Service[] servicesForRoleTable = (ServiceAdapter[])servicesForRoleVector.toArray(new ServiceAdapter[servicesForRoleVector.size()]);
	    Arrays.sort(servicesForRoleTable);
	    servicesByRoles.set(i, servicesForRoleTable); 
	}
    }
    
    /**
     * Selvittää onko parametrina annetulla käyttäjäroolilla oikeus käyttää parametrina annettua palvelua.
     * 
     * @param service Palvelu, jonka käyttöoikeutta selvitetään
     * @param role Käyttäjän rooli
     * @return Onko käyttäjällä oikeus käyttää palvelua?
     */
    public boolean isValidServiceFor(Service service, int role) {
	
	ServiceAdapter[] servicesForRole = (ServiceAdapter[])servicesByRoles.get(role);
	int found = Arrays.binarySearch(servicesForRole, service);
	
	return found >= 0;
    }
    
    /**
     * Asettaa käyttäjäroolien lukumäärän.
     * 
     * @param amount roolien lukumäärä
     * @throws ServicesLockedException 
     */
    public static void setNoOfRoles(int amount)
	throws ServicesLockedException {
	
	if (locked) throw new ServicesLockedException();
	
	noOfRoles = amount;
    }
    
    public static ServiceManager getInstance() throws ServicesNotLockedException {
	if (!locked) throw new ServicesNotLockedException();
	return instance;
    }
    
    public static int getNoOfServices() {
	return services.size();
    }
    
    public Service getService( String id ) {
	
	if ( id == null ) return null;
	else return (ServiceAdapter)services.get(id);
    }
    
    public Service[] getValidServicesFor(int role) {
	
	if ( role < 0 || role >= noOfRoles ) { return null; }
	else {
	    return (ServiceAdapter[])servicesByRoles.get(role);
	}
    }

    @Override
    public String toString() {
        String ret = "There are " + services.size() + " entries in the ServiceManager: <br>";
        Iterator<Entry<String,ServiceAdapter>> eit = services.entrySet().iterator();
        int count = 0;
        while(eit.hasNext()) {
            count++;
            Entry<String,ServiceAdapter> entry = eit.next();
            ServiceAdapter service = entry.getValue();
            ret += " " + count + ". Key in Hashtable: " + entry.getKey() + 
                    " || Description: " + service.getDesc() + 
                    " || Id: " + service.getId() +
                    " || Label: " + service.getLabel() +
                    " || Value: " + service.getValue() +
                    " || Smallest Role number: " + service.role + 
                    "<br>";
        }
        return ret;
    }
    
    
}
