package kurki.util;

import java.util.*;

public class MultiValueCounter {
    private Hashtable counts = new Hashtable();

    public void entry( Object name ) {
	if ( name == null ) return;

	Object oldval = counts.get( name );

	if ( oldval == null ) {
	    counts.put( name, new Integer(1) );
	}
	else {
	    counts.put( name, new Integer( ((Integer)oldval).intValue() + 1 ) );
	}
    }
    public int getCount( Object name ) {
	if ( name == null ) return -1;

	Object val = counts.get( name );
	if ( val == null ) return 0;
	else return ((Integer)val).intValue();
    }
    public void clear() { counts.clear(); }
}

