package kurki.model;

import kurki.util.LocalisationBundle;
import service.exception.NullIdException;
import service.*;

import java.util.*;
import java.io.Serializable;

public class Osasuoritus extends ComparableOptionAdapter 
    implements Serializable {

    void setMaxScore(int val) {
        offerings[0].initMaxScore(val);
    }

    public enum OsasuoritusTyyppi {
        LASKARI(0, "Laskuharjoitus"),
        HARJOITUSTYO(1,"Harjoitustyö"),
        KOE(2,"Koe"),
        ARVOSANA(3,"Arvosana"),
        OPINTOPISTEET(4,"Opintopisteet"),
        KIELIKOODI(5,"Kielikoodi");
        
        public final int ID;
        public final String KUVAUS;
        public static final int TYYPPEJA_YHTEENSA = 6;
        
        private OsasuoritusTyyppi(int id, String name) {
            this.ID = id;
            this.KUVAUS = name;
        }
    }
    
    public static final int MAX_OFFERINGS = 18;
    public static final int MAX_XTR_SCORE = 60;
    public static final int HI_LIMIT = 999;

    public static final int UNDEF = Integer.MIN_VALUE;

    protected static final String[] gradeCodes =
    { "0", "+", "1", "2", "3", "4", "5" };

    protected static final String[] grades =
    { "1", "2", "3", "4", "5" };

    protected static final String[] EMPTY = {};
    protected static final String[] kielet = {"S","R","E"};

    protected static final Vector gradesVec = new Vector( Arrays.asList(grades) ); 
 

    protected String[] genericScores = {"+"};
    protected Offering[] offerings = null;
    protected boolean partDefMod = false;
    protected int maxValue=0;
    protected Offering selectedOffering = null;

    protected int requiredOfferings = 0;
    protected int requiredScore = 0;

    protected Vector scoreBoundaries = null;
    protected boolean scoreBoundariesMod = true;
 
    protected int xtrScore = 0;
    protected int firstXtr = 1;
    protected double xtrStep = 1;
    
    
    public Osasuoritus( int type ) throws NullIdException {

	if ( type < 0 || type >= OsasuoritusTyyppi.TYYPPEJA_YHTEENSA ) {
	    throw new NullIdException( LocalisationBundle.getString("suoritustyyppi")
                    +type+LocalisationBundle.getString("tuntematon"));
	}

	this.id = new Integer( type );

	if ( type == OsasuoritusTyyppi.ARVOSANA.ID ) {
            this.genericScores = gradeCodes;
        }
        if ( type == OsasuoritusTyyppi.KIELIKOODI.ID ) {
              this.genericScores = kielet;
        }

        if (type== OsasuoritusTyyppi.OPINTOPISTEET.ID) {
          this.genericScores = EMPTY;
      }
    }

    public Osasuoritus( int type, int items ) throws NullIdException {
	// Tällä luodaan osatyyppi. 
        // Tyyppi voidaan luoda myös ilman osia items=0.
        this(type);

	if ( items < 0 ) {
	     throw new NullIdException( LocalisationBundle.getString("MaaraEiVoiOllaNegat") );
	}
        
	// luodaan items kappaletta osasuorituksia 
	try {
	     this.offerings = new Offering[ items ];
	    // Luodan osat
	    for (int i = 0; i < this.offerings.length; i++) {
		this.offerings[i] = new Offering(i);
            }	    
	} catch ( Exception e ) { e.printStackTrace(); }
      // varmistetaan - onko jotain syytä  varmistaa HL ? 
          this.setNbrOfOfferings( items );
    }

    public Osasuoritus( int type, Offering[] offerings ) throws NullIdException {
	this(type);

	this.offerings = offerings;
	this.setNbrOfOfferings( offerings.length );
    }

    public Osasuoritus( int type, Offering[] offerings, int requiredOfferings, int xtrScore ) throws NullIdException {
	this(type);
	
	this.offerings = offerings;
	this.setNbrOfOfferings( offerings.length );

	this.requiredOfferings = (requiredOfferings < this.offerings.length ? requiredOfferings : this.offerings.length);
	this.xtrScore = xtrScore;
    }

    public Osasuoritus( Osasuoritus another ) {
	this.id            = another.id;
	this.genericScores = another.genericScores;
	this.desc          = another.desc;
	this.offerings     = (Offering[])another.offerings.clone();
	this.requiredOfferings      = another.requiredOfferings;
	this.xtrScore      = another.xtrScore;
    }

    public int getFirstXtrScore() {
	return firstXtr;
    }
    
    public String getAbbreviation() {
        return LocalisationBundle.getString("part" + this.getId() + "abbreviation");	
    }

    @Override
    public String getLabel() {
        return LocalisationBundle.getString("part" + this.getId() + "label");
    }
    
    

    public int getXtrScore() {
	if ( this.getType() == OsasuoritusTyyppi.KOE.ID ) {
	    return getMaxScoreCount();
	}
	else {
	    return this.xtrScore;
	}
    }

    public int getXtrScore( String score ) {
	final int UNDEF_XTR_SCORE = 0;
	int rv = UNDEF_XTR_SCORE;
	if ( score != null ) {
	    try {
		int sc = Integer.parseInt( score );
		int i = 0;
		for ( ; i < scoreBoundaries.size(); i++ ) {
		    int limit = ((Integer)scoreBoundaries.get( i )).intValue();
		    if ( sc < limit ) return i;
		}
		return i;
	    } catch ( NumberFormatException nfe ) {
		rv = UNDEF_XTR_SCORE;
	    }
	}
	return rv;
    }
    
    public String[] getGenericScores() { return this.genericScores; }

    public Vector getGrades() {
	return gradesVec;
    }

    public int getId() { return ((Integer)this.id).intValue(); }
    
    public int getMaxScoreCount() {
	if ( this.getId() == OsasuoritusTyyppi.ARVOSANA.ID ) return HI_LIMIT;

	int count = 0;

	for ( int i=0; i < this.offerings.length; i++ ) {
	    count += this.offerings[ i ].getMaxScore();
	}
	return count;
    }

    public int getMinScoreCount() {
	int count = 0;

	for ( int i=0; i < this.offerings.length; i++ ) {
	    count += this.offerings[ i ].getMinScore();
	}
	return count;
    }

    public int getNbrOfOfferings() { return this.offerings.length; }

    public Offering getOffering( int offering ) {

	if ( offering == UNDEF || offering < 0 || offering >= this.offerings.length ) {
	    return null;
	}
	else {
 	    System.out.println("Part#getOffering: "+this.offerings[ offering ]);
	    return this.offerings[ offering ];
	}
    }

    public Offering[] getOfferings() { return this.offerings; }

    public int getRequiredScore() { return this.requiredScore; }

    public int getRequiredOfferings() { return requiredOfferings; }

    public Vector getScoreBoundaries() {
	if ( this.scoreBoundaries == null ) recalcScoreBoundaries();
	return this.scoreBoundaries;
    }

    public Offering getSelectedOffering() { return this.selectedOffering; }

    public int getType() { return ((Integer)this.id).intValue(); }

    public double getXtrStep() {
	return xtrStep;
    }

    public String htmlRefConversion( String grade ) {
	return grade.replace('+', 'p').replace('-', 'm');
    }

    public boolean isValidScore( Offering offering, String score ) {
	if ( score == null ) return true;
	else {
	    score = score.trim();
	    if ( score.equals("") ) return true;
	}
	
	for ( int i=0; i < genericScores.length; i++ )
	    if ( genericScores[i].equals(score) ) return true;
	
	if ( this.getType() == OsasuoritusTyyppi.ARVOSANA.ID || this.getType() == OsasuoritusTyyppi.KIELIKOODI.ID ) return false;
 

	try {
	    int s = Integer.parseInt( score );         
	    if ( s >= 0 && s <= offering.getMaxScore() )
		return true;
	} catch ( NumberFormatException nfe ) {
	    return false;
	}
	return false;
    }

    public boolean maxScoreDefined() {
	boolean rv = false;

	if ( this.selectedOffering != null ) {
	    if ( this.selectedOffering.maxScoreDefined()
		 || this.getType()==OsasuoritusTyyppi.ARVOSANA.ID 
                 || this.getType()==OsasuoritusTyyppi.KIELIKOODI.ID )
		rv = true;
	}
	return rv;
    }

    public boolean partDefMod() {
	boolean rv = this.partDefMod;
	this.partDefMod = false;
	return rv;
    }

    public Vector recalcScoreBoundaries() {
	int size = xtrScore;	
	Vector sb = new Vector();
	double score = firstXtr;
	for ( int i=0; i < size; i++ ) {
	    sb.add( i, new Integer( (int)Math.round( score ) ) );
	    score += xtrStep;
	}
	
	this.scoreBoundaries = sb;
	this.scoreBoundariesMod = true;
	return this.scoreBoundaries;
    }

    public boolean scoreBoundariesMod() {
	boolean rv = this.scoreBoundariesMod;
	this.scoreBoundariesMod = false;
	return rv;
    }

    public boolean selectOffering( int offering ) {
	if (offering == UNDEF ) {
	    this.selectedOffering = null;
	    return true;
	}
	else {
	    this.selectedOffering = getOffering( offering );
	    return ( this.selectedOffering != null ? true : false );
	}
    }

    public boolean setFirstXtrScore( int firstScore ) {
	if ( firstScore < 1 || firstScore > getMaxScoreCount() ) return false;
	else {
	    if ( this.firstXtr != firstScore ) {
		this.scoreBoundaries = null;
		this.scoreBoundariesMod = true;
		this.partDefMod = true;
		this.firstXtr = firstScore;
	    }
	    return true;
	}
   } 
    public boolean setNbrOfOfferings( int nbr )
	throws NullIdException {

	if ( nbr > MAX_OFFERINGS ||  nbr < 0 ) return false;

	int len = this.offerings.length;

	if ( nbr != len ) {
	    Offering[] newOfferings = new Offering[ nbr ];

	    int i = 0;
	    for (; i < len && i < nbr; i++ ) {
		newOfferings[i] = this.offerings[i];
	    }
	    for (; i < nbr; i++ ) {
		newOfferings[i] = new Offering(i);
	    }
	    this.offerings = newOfferings;
	    if ( this.requiredOfferings > nbr ) this.requiredOfferings = nbr;
	    this.partDefMod = true;
	    return true;
	}
	else return true;
    }

    public boolean setRequiredOfferings( int req ) {
	if ( req < 0 || req > this.offerings.length ) return false;
	else if ( req != this.requiredOfferings ) {
	    this.requiredOfferings = req;
	    this.partDefMod = true;
	}
	return true;
    }
    
    public boolean setRequiredScore( int reqs ) {
	if ( reqs < 0 || reqs > HI_LIMIT ) return false;
        if ( reqs != this.requiredScore ) {
            this.requiredScore = reqs;
            this.partDefMod = true;
        }
        return true;
    }      

    public boolean setScoreBoundary( int score, int reqs ) {
	if ( this.scoreBoundaries == null ) {
	    this.scoreBoundaries = new Vector();
	    this.scoreBoundaries.setSize( xtrScore );
	    this.scoreBoundariesMod = true;
	}

	if ( score < 0 || score >= this.scoreBoundaries.size() ) return false;
	else {
	    Object prev = this.scoreBoundaries.set( score, new Integer(reqs) );
	    if ( prev == null || ((Integer)prev).intValue() != reqs ) {
		this.scoreBoundariesMod = true;
	    }
	    return true;
	}
    }

    public void setScoreBoundaries( String sb ) {
	if ( sb == null || sb.equals("") ) return;

	StringTokenizer st = new StringTokenizer( sb, ",-" );
	int i = 0;

	while ( st.hasMoreTokens() && i < xtrScore ) {
	    String val = st.nextToken();

	    val = val.trim();
	    try {		
		if ( val.length() > 0 ) {
		    setScoreBoundary( i, Integer.parseInt( val ) );
		}

		// Kaikki arvot tulee olla määritelty
		else {
		    recalcScoreBoundaries();
		    return;
		}
	    } catch ( NumberFormatException nfe ) {}
	    i++;
	}

	if ( this.scoreBoundaries == null ) {
	    recalcScoreBoundaries();
	    return;
	}
	else if ( this.scoreBoundaries.size() != xtrScore ) {
            
	    System.out.println(LocalisationBundle.getString("kantaEiVastaa"));

	    Vector oldVals = this.scoreBoundaries;

	    recalcScoreBoundaries();

	    for ( int j=0; j < this.scoreBoundaries.size() && j < oldVals.size(); j++ ) {
		this.scoreBoundaries.set( j, oldVals.get(j) );
	    }
	}
    }

    public boolean setXtrStep( double xtrStep ) {
	if ( xtrStep <= 0 || xtrStep > HI_LIMIT ) return false;
	if ( xtrStep != this.xtrStep ) {
	    this.xtrStep = xtrStep;
	    this.partDefMod = true;
	    this.scoreBoundaries = null;
	    this.scoreBoundariesMod = true;
	}
	return true;
    }

    public boolean setXtrScore( int xtr ) {
	if ( xtr < 0 || xtr > MAX_XTR_SCORE ) return false;
	if ( xtr != this.xtrScore ) {
	    this.xtrScore = xtr;
	    this.partDefMod = true;
	    this.scoreBoundaries = null;
	    this.scoreBoundariesMod = true;
	}
	return true;
    }    
}
