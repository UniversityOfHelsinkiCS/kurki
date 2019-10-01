package kurki.model;

import kurki.Rooli;
import kurki.util.LocalisationBundle;
import service.exception.NullIdException;
import service.exception.ServicesNotLockedException;
import service.*;


public class CourseInfo extends ComparableOptionAdapter {
    protected int userRole;

    protected String ccode;
    protected int year;
    protected String term;
    protected String type;
    protected int cno;
    protected boolean isFrozen = false;
   
    protected ServiceManager serviceManager = null;

    public CourseInfo( String id, String name )
	throws NullIdException {
	
	this( id, name, Rooli.OUTSIDER );
    }

    public CourseInfo( String id, String name, int userRole )
	throws NullIdException {

	super( id, name );
	init();
 
	this.userRole = userRole;
    }

    public CourseInfo( String ccode, int year, String term,
		       String type,  int cno,  String name,
		       int userRole) throws NullIdException {

	super( ccode+"."+year+"."+term+"."+type+"."+cno, name );

	if ( ccode == null || term == null || type == null || name == null ) {
	    throw new NullIdException(LocalisationBundle.getString("nulleikelpaa"));
	}

	init();

	this.ccode = ccode;
	this.year = year;
	this.term = term;
	this.type = type;
	this.cno = cno;
	this.userRole = userRole;
    }
    
    public void freeze() { this.isFrozen = true; }
    
    public String getId() { return (String)this.id; }

    public String getName() { return this.desc; }

    public int getYear() { return this.year; }
    public int getCNO() { return this.cno; }
    public String getCCode() { return this.ccode; }
    public String getTerm() { return this.term; }
    public String getType() { return this.type; }
    
    public Service[] getValidServices() {
	return this.serviceManager.getValidServicesFor( this.userRole );
    }

    protected void init() {
	try {
	    this.serviceManager = ServiceManager.getInstance();
	} catch ( ServicesNotLockedException e ) {
	    e.printStackTrace();
	    System.exit(0);
	}
    }

    public boolean isFrozen() { return this.isFrozen; }

    public boolean isValidService( String service ) {
	if ( service == null ) return false;

	return isValidService( this.serviceManager.getService(service) );
    }

    public boolean isValidService( Service service ) {
	return service.isValidServiceFor( this.userRole );
    }

    public int getUserRole() {
	return this.userRole;
    }

    @Override
    public String toString() {
        return "ccode: " + this.ccode + "\t\tdesc: "+ this.desc + "\t\tterm: "+ this.term + "\t\ttype: " + this.type;
    }
    
    

}
