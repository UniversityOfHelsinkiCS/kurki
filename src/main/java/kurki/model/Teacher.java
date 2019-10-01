package kurki.model;

import kurki.util.LocalisationBundle;

public class Teacher {
    public String htunnus;
    public String etunimet;
    public String sukunimi;
    public String hetu;
    public String ktunnus;

    public Teacher( String htunnus,
		    String etunimet,
		    String sukunimi,
		    String hetu,
		    String ktunnus ) {

	this.htunnus = htunnus;
	this.etunimet = etunimet;
	this.sukunimi = sukunimi;
	this.hetu = hetu;
	this.ktunnus = (ktunnus != null ? ktunnus : "");
    }
    @Override
    public String toString() {
	return 
	    "<tr><td>"+sukunimi+"</td>\n<td>"+etunimet+"</td>\n<td>"+hetu+"</td>\n"
	    +"<td><input type=\"text\" name=\""+LocalisationBundle.getString(htunnus)+":"+htunnus+":"+ktunnus
	    +"\" value=\""+ktunnus+"\" size=\"12\" maxlength=\"12\"></td>\n</tr>";
    }
}
