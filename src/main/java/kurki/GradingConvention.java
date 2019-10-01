package kurki;

import java.util.ArrayList;
import kurki.util.LocalisationBundle;
import service.*;

public class GradingConvention extends ComparableOptionAdapter{
    protected String helpTxt = "";
    public static final int DEFAULT_CONVENTION = 1;
    
    protected boolean conventionMod = false;
    public static final GradingConvention Normaali = new GradingConvention(1);
    public static final GradingConvention ParempiHTKorvaaL = new GradingConvention(2);
    public static final GradingConvention TehtyHTKorvaaL = new GradingConvention(3);
    public static final GradingConvention ParempiLisaKoeKorvaaL = new GradingConvention(4);
    public static final GradingConvention TehtyLisakoeKorvaaL = new GradingConvention(5);
    public static final GradingConvention ParempiHTKorvaaMuut = new GradingConvention(6);
    public static final GradingConvention TehtyHTKorvaaMuut = new GradingConvention(7);
    public static final GradingConvention Ylosskaalattu = new GradingConvention(8);
    public static final GradingConvention Alasskaalattu = new GradingConvention(9);
    public static final GradingConvention VaihtoehtonaPuolikas = new GradingConvention(10);
    public static final GradingConvention VaihtoehtonaViimeinenKoe = new GradingConvention(11);
    public static final GradingConvention Vaihtoehtona2Neljannes = new GradingConvention(12);
    public static final GradingConvention VaihtoehtonaPuolikkaanViimeinen = new GradingConvention(13);
    public static final GradingConvention VaihtoehtoJokaiselle=new GradingConvention(14);
    public static final GradingConvention VaihtoehtoJokaiselleOsina=new GradingConvention(15);
    protected static final ArrayList<GradingConvention> conventions = new ArrayList();       
    
    static {
    //Convention names and descriptions no longer set by strings
    conventions.add(Normaali);
    conventions.add(ParempiHTKorvaaL);
    conventions.add(TehtyHTKorvaaL);
    conventions.add(ParempiLisaKoeKorvaaL);
    conventions.add(TehtyLisakoeKorvaaL);
    conventions.add(ParempiHTKorvaaMuut);
    conventions.add(TehtyHTKorvaaMuut);
    conventions.add(Ylosskaalattu);
    conventions.add(Alasskaalattu);
    conventions.add(VaihtoehtonaPuolikas);
    conventions.add(VaihtoehtonaViimeinenKoe);
    conventions.add(Vaihtoehtona2Neljannes);
    conventions.add(VaihtoehtonaPuolikkaanViimeinen);
    conventions.add(VaihtoehtoJokaiselle);
    conventions.add(VaihtoehtoJokaiselleOsina);
    }
    
    public static final int CONVENTIONS_COUNT = conventions.size();
    
    public GradingConvention( int id ) {
	this.id = new Integer( id );
	this.desc = "Not in use";
	this.helpTxt = "Not in use";
    }
    
    public static ArrayList<GradingConvention> getGradingConventions() {
        return conventions;
    }

    @Override
    public String getLabel() {
        return LocalisationBundle.getString("conventionLabel" + id);
    }
    
    public int getId() {
	return ((Integer)this.id).intValue();
    }

    public String getHelp() { return LocalisationBundle.getString("conventionHelp" + id); }
}
