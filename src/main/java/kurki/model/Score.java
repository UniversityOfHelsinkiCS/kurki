package kurki.model;

import kurki.exception.InvalidScoreException;
import service.exception.NullIdException;
import service.*;
import java.io.Serializable;

public class Score extends ComparableOptionAdapter 
    implements Serializable {
    
    public static final int SCORE_LENGTH = 2;
    public static final String UNDEF_SCORE = "??";

    protected Osasuoritus part = null;
    protected Offering offering = null;
    protected String score = null;
    protected boolean scoremod = false;

    public Score( Osasuoritus part, Offering offering, String score ) throws NullIdException {
	if ( part == null || offering == null )
	    throw new NullIdException();

	this.id       = ""+part.getId()+":"+offering.getId()+":"+score;
	this.desc     = score;
	this.part     = part;
	this.offering = offering;
	this.score    = score;
    }

    public Offering getOffering() { return this.offering; }

    public Osasuoritus getPart() { return this.part; }

    public boolean scoreModified() {
	boolean rv = this.scoremod;
	this.scoremod = false;
	return rv;
    }

    /**
       Palauttaa tämän pisteen numeroarvoisena tai
       0, jos arvoa ei ole määritelty tai 
       -1, jos arvo ei ole muutettavissa numeroksi.
     */
    public int intValue() {
	int rv = 0;
	if ( this.score != null ) {
	    try {
		rv = Integer.parseInt( this.score );
	    } catch ( NumberFormatException nfe ) {
		rv = -1;
	    }
	}
	return rv;
    }

    public boolean setScore( Score newScore ) throws InvalidScoreException {
	if ( newScore == null ||
	     !this.part.equals( newScore.part ) ||
	     !this.offering.equals( newScore.offering ) ) {
	    throw new InvalidScoreException();
	}

	// pisteet poistetaan
	if ( this.score != null && newScore.score == null ) {
	    chscore( null );
	}

	// annetaan uuden pisteet
	else if ( this.score == null && newScore.score != null ) {
	    chscore( newScore.score );
	}

	// pisteitä muutetaan
	else if ( this.score != null && newScore.score != null &&
		  !this.score.equals( newScore.score ) ) {
	    chscore( newScore.score );
	}

	return scoremod;
    }

    protected void chscore( String newScore ) {
	this.scoremod = true;
	this.score = newScore;
    }

    protected boolean isNull() { return this.score == null; }

    public String getScore() {
	return this.score;
    }

    public String toString() {
	return ( this.score == null ? "" : this.score );
    }
}
