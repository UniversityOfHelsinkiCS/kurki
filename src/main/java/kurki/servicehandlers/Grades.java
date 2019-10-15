package kurki.servicehandlers;

import kurki.util.Configuration;
import kurki.util.Log;
import kurki.model.Course;
import kurki.*;

import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import javax.servlet.http.*;
import kurki.model.Osasuoritus.OsasuoritusTyyppi;
import kurki.servlet.Index;
import kurki.util.LocalisationBundle;
import org.apache.velocity.context.*;

public class Grades extends AbstractVelocityServiceProvider
        implements Serializable {

    @Override
    public String handleRequest(Session session,
            HttpServletRequest req,
            HttpServletResponse res,
            Context context) throws Exception {

        //lokalisaatiobundlen lisääminen kontekstiin
        context.put("bundle", ResourceBundle.getBundle("localisationBundle", Session.locale));

        Log log = (Log) Configuration.getProperty("log");
        String template = "grades.vm";
        Course course = session.getSelectedCourse();
        String error = "";
        String result = "";
        boolean ok = true;

        String[] partNames = {LocalisationBundle.getString("lh2"), LocalisationBundle.getString("ht2"), LocalisationBundle.getString("koe2"), LocalisationBundle.getString("Arvosana")};

        String saveBasic = nullIfEmpty(req.getParameter("saveBasic"));
        String makeAssessment = nullIfEmpty(req.getParameter("makeAssessment"));
        String modBoundaries = nullIfEmpty(req.getParameter("modBoundaries"));
        String saveBoundaries = nullIfEmpty(req.getParameter("saveBoundaries"));

        /*
         * Tallenna lomakkeen tiedot
         */
        if (!course.isFrozen()
                && (saveBasic != null || modBoundaries != null || makeAssessment != null)) {

            Vector parts = course.getParts();


            if (req.getParameter("examDate") != null) {
                String examDate = nullIfEmpty(req.getParameter("examDate"));
                if (!course.setExamDate(examDate)) {
                    error += "<li>" + LocalisationBundle.getString("suorpvmEiKelpaa") + ": '"
                            + examDate + "'. " + LocalisationBundle.getString("pvm") + " [" + course.getMessage() + "]</li>";
                }
            } else if (course.getExamDate() == null) {
                error += "<li>" + LocalisationBundle.getString("annaSuorPvm") + "</li>";
                ok = false;
            }

            String scale = nullIfEmpty(req.getParameter("scale"));
            course.setScale(scale);

            try {
                course.setGradingConvention(Integer.parseInt(req.getParameter("convention")));
            } catch (NumberFormatException nfe) {
            }

            for (int i = 0; i < parts.size() - 2; i++) {
                kurki.model.Osasuoritus part = (kurki.model.Osasuoritus) parts.get(i);
                int ptype = part.getType();
                String val;
                boolean valOK = true;

                val = nullIfEmpty(req.getParameter("reqo_" + ptype));
                if (val != null) {
                    try {
                        if (!part.setRequiredOfferings(Integer.parseInt(val))) {
                            valOK = false;
                        }
                    } catch (NumberFormatException nfe) {
                        valOK = false;
                    }
                    if (!valOK) {
                        error += "<li>" + partNames[ptype]
                                + ": " + LocalisationBundle.getString("osasuorLkmVirhe") + ".</li>";
                    }
                    valOK = true;
                }
                val = nullIfEmpty(req.getParameter("reqs_" + ptype));
                if (val != null) {
                    try {
                        if (!part.setRequiredScore(Integer.parseInt(val))) {
                            valOK = false;
                        }
                    } catch (NumberFormatException nfe) {
                        valOK = false;
                    }
                    if (!valOK) {
                        error += "<li>" + partNames[ptype]
                                + ": " + LocalisationBundle.getString("osuudenHRVirhe") + ".</li>";
                    }
                    valOK = true;
                }
                val = nullIfEmpty(req.getParameter("xtr_" + ptype));
                if (val != null && ptype != OsasuoritusTyyppi.KOE.ID) {
                    try {
                        if (!part.setXtrScore(Integer.parseInt(val))) {
                            valOK = false;
                        }
                    } catch (NumberFormatException nfe) {
                        valOK = false;
                    }
                    if (!valOK) {
                        error += "<li>" + partNames[ptype] + ": " + LocalisationBundle.getString("lisapmVirhe") + ".</li>";
                    }
                    valOK = true;
                }
                val = nullIfEmpty(req.getParameter("xtr1st_" + ptype));
                if (val != null && ptype != OsasuoritusTyyppi.KOE.ID) {
                    try {
                        if (!part.setFirstXtrScore(Integer.parseInt(val))) {
                            valOK = false;
                        }
                    } catch (NumberFormatException nfe) {
                        valOK = false;
                    }
                    if (!valOK) {
                        error += "<li>" + partNames[ptype]
                                + ": " + LocalisationBundle.getString("ensLpRVirhe") + ".</li>";
                    }
                    valOK = true;
                }
                val = nullIfEmpty(req.getParameter("step_" + ptype));
                if (val != null && ptype != OsasuoritusTyyppi.KOE.ID) {
                    try {
                        if (!part.setXtrStep(Double.parseDouble(val))) {
                            valOK = false;
                        }
                    } catch (NumberFormatException nfe) {
                        valOK = false;
                    }
                    if (!valOK) {
                        error += "<li>" + partNames[ptype]
                                + ": " + LocalisationBundle.getString("lpKartuntavaliVirhe") + ".</li>";
                    }
                    valOK = true;
                }
            }
            if (!course.commitGradeDef()) {
                ok = false;
                error = course.getMessage();
            }
        }

        /*
         *  Pisterajojen muokkauspyyntö.
         */

        if (modBoundaries != null) {
            template = "grades_boundaries.vm";
        } /*
         *   Pisterajojen tallennus.
         */ else if (saveBoundaries != null && ok) {
            Vector parts = course.getParts();

            for (int i = 0; i < parts.size(); i++) {
                kurki.model.Osasuoritus part = (kurki.model.Osasuoritus) parts.get(i);
                int ptype = part.getType();
                int xtrScore = part.getXtrScore();
                boolean borderOK;
                String val;

                for (int s = 0; s < xtrScore; s++) {
                    borderOK = true;
                    val = nullIfEmpty(req.getParameter("sb_" + ptype + "_" + s));

                    if (val != null) {
                        try {
                            if (!part.setScoreBoundary(s, Integer.parseInt(val))) {
                                borderOK = false;
                            }
                        } catch (NumberFormatException nfe) {
                            borderOK = false;
                        }
                        if (!borderOK) {
                            error += "<li>" + partNames[ptype]
                                    + ": " + s + ". " + LocalisationBundle.getString("PRVirhe") + ": '"
                                    + val + "'. (1-" + part.getMaxScoreCount() + ")</li>";
                        }
                    }
                }

            }

            if (!course.commitGradeDef()) {
                error += course.getMessage();
            } else {
                result += LocalisationBundle.getString("pJARajatTallennettu");
            }
        } /*
         *  Arvostelu
         */ else if (makeAssessment != null && ok) {
            if (course.makeAssessment(req.getHeader("uid"))) {
                DateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");
                Calendar calendar = Calendar.getInstance();

                result = LocalisationBundle.getString("arvosteluSuor")
                        + dateFormat.format(calendar.getTime()) + ".";

                // Kaikki opiskelijat
                course.newSearch(true);
                context.put("students", course.getStudents());
                context.put("selectedCourse", session.getSelectedCourse());
                context.put("resultList", "true");
                context.put("sysdate",
                        +calendar.get(Calendar.DAY_OF_MONTH) + "."
                        + (calendar.get(Calendar.MONTH) + 1) + "."
                        + calendar.get(Calendar.YEAR));
            } else {
                error += "<li>" + LocalisationBundle.getString("virhe") + ": " + course.getMessage() + "</li>";
            }
        }
        context.put(Index.ERROR, nullIfEmpty(error));
        context.put(Index.RESULT, nullIfEmpty(result));
        return template;
    }
}
