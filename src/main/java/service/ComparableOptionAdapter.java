package service;

import java.io.Serializable;
import service.exception.NullIdException;

public abstract class ComparableOptionAdapter implements ComparableOption, Serializable {
    protected Comparable id;
    protected String desc;

    protected ComparableOptionAdapter() {}

    public ComparableOptionAdapter( Comparable id, String description )
	throws NullIdException {

	if ( id == null ) { throw new NullIdException(); }

	this.id = id;
	this.desc = description;
    }

    public ComparableOptionAdapter( ComparableOption clone ) {
	this.id = clone.getComparableId();
	this.desc = clone.getDesc();
    }
 
    @Override
    public String getLabel() { return this.desc; }

    @Override
    public String getValue() { return ""+this.id; }

    @Override
    public String getDesc() { return this.desc; }

    @Override
    public Comparable getComparableId() { return this.id; }

    @Override
    public boolean equals(Object another) {
	if ( another != null ) 
	    return this.compareTo( another ) == 0;
	else
	    return false;
    }

    @Override
    public int compareTo( Object another ) {
	return this.getComparableId().compareTo( ((ComparableOption)another).getComparableId() );
     }

    @Override
    public String toString() {
	return this.desc + " ("+this.id+")";
    }
}
