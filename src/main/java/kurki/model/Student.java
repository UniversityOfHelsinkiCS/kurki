package kurki.model;

import kurki.exception.NullParameterException;
import service.exception.NullIdException;
import service.*;

import java.util.*;
import java.io.Serializable;
import kurki.model.Osasuoritus.OsasuoritusTyyppi;
import kurki.util.LocalisationBundle;


public class Student extends ComparableOptionAdapter 
    implements Serializable {

    public static final int UNDEF_GROUP = -1;

    protected String address = null;
    protected String bday = null;
    protected String email = null;
    protected java.util.Date enrolment = null;
    protected String fname = null;
    protected int group = UNDEF_GROUP;
    protected int groupID = UNDEF_GROUP;
    protected boolean hasScores = false;
    protected String lname = null;
    protected String major = null;
    protected String phone = null;
    protected String prevlname = null;
    protected Vector[] scores = new Vector[ OsasuoritusTyyppi.TYYPPEJA_YHTEENSA ];
    protected int[] scoreTotal = { 0, 0, 0 }; // Yhteispisteet { lh, ht, koe }
    protected String state = null;
    protected String sno = null;    // 08/7 alkaen HETU - HL
    protected String ssn = null;    // 08/7 alkaen opiskelijanumero -HL
    protected int startYear = 0;
    protected int[] validScoreCount = { 0, 0, 0, 0, 0, 0 }; // korjattu 07/06 HL
    protected int[] xtrScore = { 0, 0, 0 }; // Yhteispisteet { lh, ht, koe }
    protected int xtrTotal = 0;
    protected int creditsNewUnits = 0;
    protected String language = "0";

    protected LinkedList scoreUpdate = new LinkedList();

    public Student( int id, String ssn ) throws NullIdException {
	this( id, ssn, LocalisationBundle.getString("nimiKannasta"));
    }

    public Student( int id, String ssn, String name ) throws NullIdException {
	super( new Integer( id ), name );
	this.ssn = ssn;

	this.lname = name;
    }

    public Student( int id, String ssn, String lname, String fname, int group ) throws NullIdException {
	this( id, ssn, lname, fname, null, group );
    }

    public Student( int id, String ssn, String lname, String fname, String email, int group )
	throws NullIdException {
	super( new Integer( id ), "" );
	this.ssn = ( ssn == null ? "??????????": ssn );
	this.group = group;
	this.email = email;

	this.lname = lname;

	this.fname = ( fname == null ? "" : fname );

	int i = this.fname.indexOf(" ");
	if ( i <= 0 ) i = this.fname.length();

	this.desc = this.lname+", "
	    +this.fname.substring(0, i );
  
	this.bday = ( this.ssn.length() <4
		      ? "?"
		      : ".."+this.ssn.substring( this.ssn.length()-3, this.ssn.length()));
    }

    /*
    * HETUsta pois -
    */
    public static String checkSSN( String ssn, boolean nullIfNotValid ) {
	if ( ssn == null ) return null;

	// otetaan väliviiva pois...
	int il = ssn.indexOf("-");
	if ( il > 0 ) {
	    int idlen = ssn.length();
	    ssn = ssn.substring( 0, il )
		+( il < idlen
		   ? ssn.substring( il+1, idlen )
		   : "" );
	}
	ssn = ssn.toUpperCase();
	
	if ( !nullIfNotValid ) return ssn;
	else {
	    return ssn;
	}
    }


    public int compareTo( Object another ) {
	int sup = super.compareTo( another );
	if ( sup == 0 ) {
	    return this.ssn.compareTo( ((Student)another).ssn );
	}
	else {
	    return sup;
	}
    }

     public boolean defreeze() {
	if ( this.isFrozen() ) {
	    this.state = "S";
	    return true;
	}
	else return false;
    }

    public void freeze() {
	this.state = "J";
    }

    public String getAddress() {
	return this.address;
    }

    public String getBirthday() {
	return this.bday;
    }

    public String getCreditsNew() { 
        if (this.creditsNewUnits==0) 
            return "";
        else
            return ""+this.creditsNewUnits; 
    }

    public int getGroup() { return this.group; }
    public int getGroupID() { return this.groupID; }

    public String getGrade() {
	String grade = null;

	if ( this.scores[OsasuoritusTyyppi.ARVOSANA.ID] != null )
	    grade = ((Score)this.scores[OsasuoritusTyyppi.ARVOSANA.ID].get(0)).getScore();

	return grade;
    }

    public int getId() {
	return ((Integer)this.id).intValue();
    }

    public String getEMail() { return this.email; }

    public String getEnrolment() {
	if ( this.enrolment != null ) {
	    Calendar c = Calendar.getInstance();
	    c.setTime( this.enrolment );

	    String day = ""+c.get( Calendar.DAY_OF_MONTH );
	    if ( day.length() < 2 ) day = "0"+day;

	    String month = ""+(c.get( Calendar.MONTH ) + 1);
	    if ( month.length() < 2 ) month = "0"+month;

	    String year = ""+c.get( Calendar.YEAR );
	    if ( year.length() < 2 ) year = "0"+year;

	    String hour = ""+c.get( Calendar.HOUR_OF_DAY );
	    if ( hour.length() < 2 ) hour = "0"+hour;

	    String min = ""+c.get( Calendar.MINUTE );
	    if ( min.length() < 2 ) min = "0"+min;

	    String sec = ""+c.get( Calendar.SECOND );
	    if ( sec.length() < 2 ) sec = "0"+sec;

	    return  day+"."+month+"."+year+": "+hour+"."+min+"."+sec;
	} else return "?";
    }

    public String getFName() { return this.fname; }
    public String getLName() { return this.lname; }
    public String getLanguage() {
      if (this.language==null || this.language.length()==0)
        return " ";
      else
         return this.language; }
    public String getMajor() { return this.major; }
    public String getName() { return this.lname+", "+this.fname; }
    public String getPhone() { return this.phone; }
    public String getPrevLName() { return this.prevlname; }

    public String getScore( Osasuoritus part ) {
	if ( part == null ) { return null; }
	if ( part.getType() == OsasuoritusTyyppi.ARVOSANA.ID ) {
	    return getScore( part, part.getOffering(0) );
	}
	else {          
	    return ""+this.scoreTotal[ part.getType() ];
	}
    }

    private Vector getExamScoreVector(){        
        for (Vector osasuoritusVector : this.scores) {
            if (osasuoritusVector==null) {
                continue;
            }          
            
            if (osasuoritusVector.isEmpty()) {
                continue;
            }
            Score score = (Score)osasuoritusVector.get(0);
            if ( score.getPart().getId() == 2 ) {
                return osasuoritusVector;
            }       
        }     
        
        return new Vector();
    }
    
    private int[] examScoresFrom(Osasuoritus part,Course course){
        int kokeita = course.getKokeita();
        int[] pisteet = new int[kokeita];
        
        Vector examScoreVector = getExamScoreVector();
        
        for (int i = 0; i < kokeita; i++) {
            Score koeSuoritus = (Score)examScoreVector.get(i);
            int score = koeSuoritus.intValue();
            if ( score>=0 ) {
                pisteet[i] = score;
            }
        }
        
        return pisteet;
    }
    
    public String getExamScore( Osasuoritus part, Course course) {
	if ( part == null ) { return null; }

        if ( course.getLaskentakaava()==14) {
            int sum = 0;
            int examCount = course.getKokeita();
            
            int[] examScores = examScoresFrom(part, course);
            for (int j = 1; j <= examCount/2; j++) {
                int i = j-1;
                sum += Math.max(examScores[i],examScores[examCount/2+i]);
            }

            return ""+sum;
        }        
        if ( course.getLaskentakaava()==15) {
            int sum = 0;
            int examCount = course.getKokeita();
            
            int[] examScores = examScoresFrom(part, course);
            for (int j = 1; j <= examCount/4; j++) {
                int i = j-1;
                sum += Math.max(examScores[i],examScores[examCount/4+i]);
            }
            for (int j = examCount/2+1; j <= 3*examCount/4; j++) {
                int i = j-1;
                sum += Math.max(examScores[i],examScores[examCount/4+i]);
            }
            return ""+sum;
        }
            
	return ""+this.scoreTotal[ part.getType() ];

    }
    
    
    public String getScore( Osasuoritus part, Offering offering ) {
	if ( part == null || offering == null ) return null;

	int ptype = part.getType();
	int oid = offering.getId();
	String rv = null;
	// Onko halutun suorituksen arvosanat ladattu?
	if ( ptype >= 0
	     && ptype < this.scores.length
	     && this.scores[ ptype ] != null 
	     && this.scores[ ptype ].get( oid ) != null ) {

	    rv = ((Score)this.scores[ ptype ].get( oid )).getScore();
	}
	return rv;
    }

    public Vector getScores( int ptype ) {
	if ( this.scores[ ptype ] == null ) return null;
	else return this.scores[ ptype ];
    }

    public int getScoreTotal() {
	int scoreSum = 0;
	for ( int i=0; i < this.scoreTotal.length; i++ ) {
	    scoreSum += this.scoreTotal[ i ];
	}
	return scoreSum;
    }

    public Iterator getScoreUpdate() {
	Iterator rv = this.scoreUpdate.iterator();
	this.scoreUpdate = new LinkedList();
	return rv;
    }
    
    public String getSSN() {return this.ssn; }
    
    public String getSSNID() { return this.ssn; }

    public String getSubSSN( int start, int end ) {
	String tmpssn = this.getSSN();
	int ssnlen = tmpssn.length();
	String rv = null;

	if ( tmpssn != null && start >= 0 && start < ssnlen ) {
	    if ( end > ssnlen ) end = ssnlen;
	    rv = tmpssn.substring( start, end );
	}
	return rv;
    }

    public int getStartYear() { return this.startYear; }
    public String getState() { return this.state; }

    public int getValidScoreCount( int pid ) {
	if ( pid >= 0 && pid < this.validScoreCount.length )
	    return this.validScoreCount[ pid ];
	else return -1;
    }

    public String getXtrScore( Osasuoritus part ) {
	if ( part == null ) return null;
	int pid = part.getType();
	if ( pid == OsasuoritusTyyppi.ARVOSANA.ID ) return null;
	return ""+xtrScore[ pid ];
    }

    public String getXtrTotal() {
	return ""+this.xtrTotal;
    }

    public boolean hasScores() { return this.hasScores; }

    public boolean isDefrost() { return this.state != null && this.state.equals("S"); }

    public boolean isFrozen() { return this.state != null && this.state.equals("J"); }

    public boolean isNew() { return this.state == null; }

    public void setAddress( String address ) { this.address = address; }

    public void setCreditsNew(int cdt) {this.creditsNewUnits=cdt;}
    
    public void setEnrolment( java.util.Date date ) {
	this.enrolment = date;
    }

    public void setGroup( int group ) {
	this.group = group;
    }

    public void setGroupID( int groupID ) {
	this.groupID = groupID;
    }

    public void setHasScores( boolean hasScores ) {
	this.hasScores = hasScores;
    }

    public void setMajor( String major ) { this.major = major; }
    public void setLanguage (String lng) { this.language = lng; }

    public void setPhone( String phone ) { this.phone = phone; }
    public void setPrevLName( String prevlname ) { this.prevlname = prevlname; }

    /**
       Opiskelija numeron asetus.
    */
    public void setSNO( String sno ) {
	this.sno = sno;
    }

    public boolean setScore( Osasuoritus part, String score )
	throws NullParameterException {
	return setScore( part, part.getSelectedOffering(), score );
    }

    public boolean setScore( Osasuoritus part, Offering offering, String score )
	throws NullParameterException {
	
	boolean invalidScore = false;

	if ( part == null || offering == null ) throw new NullParameterException();
	if ( score != null ) {
	    score = score.trim();
	    if (score.equals("") || score.equals("??")) score = null;
	}

	if ( !part.isValidScore( offering, score ) ) {
	    score = null;
	    invalidScore = true;
	}

	int pid = part.getType();
	int oid = offering.getId();

	if ( this.scores[pid] == null ) {
	    this.scores[pid] = new Vector();
	    this.scores[pid].setSize( part.getNbrOfOfferings() );
	}
        
	try {
	    Score newScore = new Score( part, offering, score );
	    Score oldScore = null;
	    int ns = newScore.intValue();
	    int os = 0;
	    
	    // Korvataanko kenties joku aikaisemmin muutettu piste?
	    if ( this.scores[pid].get( oid ) != null ) {
		oldScore = (Score)this.scores[pid].get( oid );
		os = oldScore.intValue();
	    }

	    // vanhoja pisteitä ei määritelty --> nämä pisteet kirjataan ensimmäistä kertaa
	    if ( oldScore == null ) {
		this.scores[pid].set( oid, newScore );
		if ( pid < this.scoreTotal.length && ns >= 0 )
		    this.scoreTotal[pid] += ns;
		if ( score != null ) validScoreCount[pid] += 1;
	    }

	    // pisteitä muutettu
	    else if ( !invalidScore ) {
		oldScore.setScore( newScore );
		newScore = oldScore;
		if ( pid < this.scoreTotal.length ) {
		    if ( os >= 0 )
			this.scoreTotal[pid] -= os;
		    if ( ns >= 0 )
			this.scoreTotal[pid] += ns;
		}
		if ( score == null ) validScoreCount[pid] -= 1;
	    }

	    if ( newScore.scoreModified() ) {
		this.scoreUpdate.add( newScore );
	    }

	    // Yhteispisteet...

	    // Suoritus kirjattu onnistuneesti
	    this.hasScores = true;
	} catch ( Exception e ) {
	    e.printStackTrace();
	}
	return true;
    }

    public void setStartYear( int startYear ) { this.startYear = startYear; }

    public boolean setState( String state ) {
	if ( state == null || state.equals("J") || state.equals("S") ) {
	    this.state = state;
	    return true;
	}
	else {
	    return false;
	}
    }

    public void setXtrTotal( int xtrTotal ) {
	if ( xtrTotal >= 0 ) this.xtrTotal = xtrTotal;
    }

    public void setXtrScore( int pid, int xtrScore ) {
	if ( pid >= 0 && pid < this.xtrScore.length && xtrScore >= 0 )
	    this.xtrScore[ pid ] = xtrScore;
    }
}
