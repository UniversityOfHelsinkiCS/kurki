package kurki.model;

import service.exception.NullIdException;
import service.*;
import java.io.Serializable;

public class Offering extends ComparableOptionAdapter  
    implements Serializable {

    public static final int UNDEF = 0;
    public static final int MAX_SCORE = 99;

    protected int maxScore  = UNDEF;
    protected int minScore = UNDEF;

    protected boolean scoreDefMod = false;
 
    public Offering( int id ) throws NullIdException {

	if ( id < 0 ) throw new NullIdException("Illegal id (id < 0)!");
	this.id = new Integer(id);
	this.desc = ""+(id+1);
    }

    public Offering( int id, int maxScore ) {
	this.id = new Integer(id);
	this.desc = ""+(id+1);

	this.maxScore = maxScore;
    }

    public Offering( int id, String desc ) {
	this.id = new Integer(id);
	this.desc = desc;
    }

    public Offering( int id, String desc, int maxScore ) {
	 this( id, maxScore );
	 this.desc = desc;
    }

    public int getId() {
	return ((Integer)this.id).intValue();
    }

    public int getMaxScore() { return this.maxScore; }

    public int getMinScore() { return this.minScore; }

    public void initMaxScore( int ms ) {
	this.maxScore = ms;
    }

    public void initMinScore( int ms ) {
	this.minScore = ms;
    }

    public boolean maxScoreDefined() {
	return (this.maxScore != UNDEF && this.maxScore > 0);
    }

    public boolean scoreDefMod() {
	boolean rv = this.scoreDefMod;
	this.scoreDefMod = false;
	return rv;
    }

    
    /**
     **  Osasuorituksen maksimipisteet.
     */ 
    public boolean setMaxScore( int ms ) {
	if ( ms < 0 || ms > MAX_SCORE ) return false;
	if ( this.maxScore != ms ) this.scoreDefMod = true;

	this.maxScore = ms;
	return true;
    }

    /**
     **  Osasuorituksen hyväksymisraja viedään suoraan kantaan.
     */ 
    public boolean setMinScore( int ms ) {	
	if ( ms > this.maxScore || ms < 0 ) return false;
	else {
	    if ( this.minScore != ms ) this.scoreDefMod = true;

	    this.minScore = ms;
	    return true;
	}
    }

    @Override
    public String toString() { return this.desc; }
}
