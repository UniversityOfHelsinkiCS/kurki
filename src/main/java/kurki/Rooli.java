package kurki;
public class Rooli {
    // Tunnistetun käyttäjäryhmät. Huom! Lueteltava oikeuksien mukaisessa
    // järjestyksessä, alkaen siitä, jolla vähiten oikeuksia.
    public static final int OUTSIDER = 0;
    public static final int TUTOR = 1;
    public static final int PRIVILEGED = 2; // käytännöllinen vastuuhlö 
    public static final int SUPER = 3; // kaikkiin kursseihin oikeudet
    
    public static final int NO_OF_ROLES = 4;
}
