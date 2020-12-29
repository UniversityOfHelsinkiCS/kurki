REM <PRE>
REM SCHEMA TK_OPHA
 

 CREATE TABLE ARVOSANA(
-- vanhat arvosanat, ei kaytossa
 ARVOSANA                        VARCHAR2(2) NOT NULL
,PRIMARY KEY (ARVOSANA));

CREATE TABLE ARVTAPA(
-- vanhat arvostelutavat, ei kaytossa ?
  TAPA                                     CHAR(1)
, SELITYS                                  VARCHAR2(48)
,PRIMARY KEY (TAPA)
);

CREATE TABLE ENTINEN_OPETUS(
-- vanhoja kurssitietoja <=1995, sovellukset eivat kayta
 LUKUKAUSI                       VARCHAR2(4)
,SIS_TUNNUS                      NUMBER(4)
,KURSSIKOODI                     VARCHAR2(10)
,NIMI                            VARCHAR2(80)
,TYYPPI                          VARCHAR2(1)
,LUKUVUOSI                       NUMBER(4)
);
 
CREATE TABLE ENTISET_ILM(
-- vanhoja osallistumistietoja <=1995, sovellukset eivat kayta
 SOTU                            VARCHAR2(10) NOT NULL
,LUKUKAUSI                       VARCHAR2(4) NOT NULL
,KOHDE                           NUMBER(5) NOT NULL
,KTYYPPI                         VARCHAR2(1)
,VOIMASSA                        VARCHAR2(1)
,PVM                             DATE
,PAAKOHDE                        NUMBER(7)
,KELLO                           NUMBER(8)
,LUKUVUOSI                       NUMBER(4)
,KURSSIKOODI                     VARCHAR2(11)
);

CREATE TABLE HENKILO(
 -- henkilokunta, opettajat
 HTUNNUS                         VARCHAR2(12) NOT NULL
,ETUNIMET                        VARCHAR2(80) NOT NULL
,SUKUNIMI                        VARCHAR2(80) NOT NULL
,KUTSUMANIMI                     VARCHAR2(15)
,AKTIIVISUUS                     VARCHAR2(1)
,HUONE_NRO                       VARCHAR2(5)
,HETU                            VARCHAR2(11)
,OPPIARVO                        VARCHAR2(5)
,TITTELI                         VARCHAR2(80)
,PUHELIN_TYO                     VARCHAR2(20)
,PUHELIN_KOTI                    VARCHAR2(20)
,KATUOSOITE                      VARCHAR2(40)
,POSTINRO                        VARCHAR2(5)
,POSTITOIMIPAIKKA                VARCHAR2(20)
,VALVONTASALDO                   NUMBER(5,2)
,SAHKOPOSTIOSOITE                VARCHAR2(80)
,HALLINNOLLINEN_KOMMENTTI        VARCHAR2(80)
,OPISKELIJA_KOMMENTTI            VARCHAR2(80)
,KTUNNUS                         VARCHAR(12) --kayttajatunnus
,KANNYKKA                        VARCHAR2(20)
,HY_PUHELINLUETTELOSSA           VARCHAR2(1) NOT NULL
,POSTILOKEROHUONE                VARCHAR2(15)
,HY_TYOSUHDE                     VARCHAR2(1) NOT NULL
,PRIMARY KEY (HTUNNUS));

CREATE TABLE HALLINNOLLINEN_RYHMA(
 -- erilaisia ryhmia, mm johtoryhma, mahdollisesti kaytossa
 -- sisalto vaikuttaa vanhentuneelta ?
 HALLINNOLLINEN_RYHMA            VARCHAR2(12) NOT NULL
,TULOSTUS_JARJESTYS              NUMBER(24)
,RYHMA_NIMIKE                    VARCHAR2(80)
,PRIMARY KEY (HALLINNOLLINEN_RYHMA));
 
CREATE TABLE HALLINNOLLINEN_TEHTAVA(
 -- hallinnollisia tehtavia
 TEHTAVATUNNUS                   VARCHAR2(12) NOT NULL
,NIMIKE                          VARCHAR2(80) NOT NULL
,OPETUSVELV_HUOJENNUS            NUMBER(6)
,TEHTAVAKUVAUS                   VARCHAR2(240)
,HALLINNOLLINEN_RYHMA            VARCHAR2(12)
,TULOSTUS_JARJESTYS              NUMBER(4)
,PRIMARY KEY (TEHTAVATUNNUS));
 
CREATE TABLE HALLINNOLLISEN_TEHTAVAN_HOITO(
 -- hallinnollisen tehtavan hoito
 TEHTAVATUNNUS                   VARCHAR2(12) NOT NULL
,HTUNNUS                         VARCHAR2(12) NOT NULL
,ALKAMIS_PVM                     DATE NOT NULL
,PAATTYMIS_PVM                   DATE
,TUNTIMAARA                      NUMBER(5)
,KOMMENTTI                       VARCHAR2(240)
,PRIMARY KEY (HTUNNUS,TEHTAVATUNNUS,ALKAMIS_PVM));
-- viiteavain tehtavatunnus (hallinnollinen_tehtava)
-- viiteavain htunnus (henkilo)
 
CREATE TABLE HUONE(
 -- tyohuone, 
 HUONE_NRO                       VARCHAR2(5) NOT NULL
,PAIKKA_LKM                      NUMBER(3)
,KOKO                            NUMBER(6,1)
,VARUSTELU                       VARCHAR2(240)
,KOMMENTTI                       VARCHAR2(240)
,PRIMARY KEY (HUONE_NRO));
 
CREATE TABLE HUONEVARAUS(
-- huonevaraus
 ID                              NUMBER(38) NOT NULL
 ,HTUNNUS                        VARCHAR2(20) NOT NULL
 ,RHUONE_ID                      NUMBER(38)NOT NULL 
 ,ALKUPVM                        DATE NOT NULL 
 ,LOPPUPVM                       DATE NOT NULL
 ,PRIMARY KEY (ID));
-- viiteavain HTUNNUS (HENKILO)
-- viiteavain RHUONE_ID (RHUONE)

CREATE TABLE ILMOKYSYMYS(
 ilmoittautumisen yhteydessa esitettava kysymys
 KURSSIKOODI                     VARCHAR2(15) NOT NULL
,KYSYMYS_NRO                     NUMBER(3) NOT NULL
,KYSYMYS                         VARCHAR2(1000) NOT NULL
,LYHENNE                         VARCHAR2(20)
,KYSYMYSTYYPPI                   VARCHAR(16)
,VAIHTOEHDOT                     VARCHAR(1000)
,ESITYSTILA                      VARCHAR(2)
,PRIMARY KEY (KURSSIKOODI,KYSYMYS_NRO));
-- viiteavain kurssikoodi 

CREATE TABLE ILMOLUKUMAARAT(
 -- ryhmiin ilmoittautuneiden lukumaara
 KURSSIKOODI                     VARCHAR2(15) NOT NUL
,LUKUKAUSI                       VARCHAR2(1) NOT NULL
,LUKUVUOSI                       NUMBER(4) NOT NULL
,TYYPPI                          VARCHAR2(1) NOT NULL
,KURSSI_NRO                      NUMBER(2) NOT NULL
,RYHMA_NRO                       NUMBER(2) NOT NULL
,LUKUMAARA                       NUMBER(3) NOT NULL
,PRIMARY KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO,RYHMA_NRO));
-- viiteavain KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO,RYHMA_NRO (opetus)

CREATE TABLE ILMOVASTAUS(
-- vastaus ilmoittautumiskysymykseen
 KURSSIKOODI                     VARCHAR2(15) NOT NULL
,KYSYMYS_NRO                     NUMBER(3) NOT NULL
,PERSONID                        VARCHAR2(11) 
 -- hetu, voi olla vanhoissa tietueissa, uusissa tyhja
,VASTAUS                         VARCHAR2(2000) NOT NULL
,LUKUVUOSI                       NUMBER(4)
,LUKUKAUSI                       CHAR(1)
,HETU                            VARCHAR(9) NOT NULL
-- opiskelijanumero
,PRIMARY KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,KYSYMYS_NRO,HETU));
 
CREATE TABLE KALUSTELAJI(
 -- kalustelajeja, ei taida olla kaytossa
 KALUSTELAJI                     VARCHAR2(5) NOT NULL
,KALUSTETYYPPI                   VARCHAR2(50)
,PRIMARY KEY (KALUSTELAJI));
 
CREATE TABLE KALUSTUS(
-- huoneen kalustus, onko kaytossa??
 HUONE_NRO                       VARCHAR2(5) NOT NULL
,KALUSTELAJI                     VARCHAR2(5) NOT NULL
,LUKUMAARA                       NUMBER(9)
,HANKINTA_AIKA                   DATE
,HANKINTA_HINTA                  NUMBER(9,2)
,ARVO                            NUMBER(9,2)
,POISTETTU                       DATE
);
 
CREATE TABLE KERROIN(
-- tuntimaarakertoimia, onkohan enaa kaytossa, sisalto vaikuttaa vanhentuneelta
 VIRKA                           VARCHAR2(20)
,OPETUSTEHTAVA                   VARCHAR2(20)
,KERROIN                         VARCHAR2(3)
,PRIMARY KEY (VIRKA,OPETUSTEHTAVA));
 
CREATE TABLE KIELIKOODI(
 - kieli
 KIELIKOODI                      VARCHAR2(1) NOT NULL
,KIELI                           VARCHAR2(10)
,KIELITUNNUS                     NUMBER(2)
,PRIMARY KEY (KIELIKOODI));
 
CREATE TABLE KOKEEN_TYYPPI(
-- kokeiden tyypit
 TYYPPI                          VARCHAR2(1) NOT NULL
,KUVAUS                          VARCHAR2(30)
,KTNRO                           NUMBER(2)
,PRIMARY KEY (TYYPPI));
 

CREATE TABLE KOETILAISUUS(
-- koetilaisuudet
 LUKUKAUSI                       VARCHAR2(1) NOT NULL
,LUKUVUOSI                       NUMBER(4) NOT NULL
,KOETILAISUUS_NRO                NUMBER(5) NOT NULL
,TOIVOTTU_SALI                   VARCHAR2(12)
,KOE_PVM                         DATE
,ALKAMISAIKA                     DATE
,PAATTYMISAIKA                   DATE
,KOMMENTTI                       VARCHAR2(240)
,VARATTU                         VARCHAR2(1)
,TILA                            VARCHAR2(1)
,PRIMARY KEY (LUKUKAUSI,LUKUVUOSI,KOETILAISUUS_NRO));
-- viiteavain toivottu_sali (sali)

CREATE TABLE KOE(
-- kurssi ja erilliskokeet
 KURSSIKOODI                     VARCHAR2(15) NOT NULL
,LUKUKAUSI                       VARCHAR2(1) NOT NULL
,LUKUVUOSI                       NUMBER(4) NOT NULL
,TYYPPI                          VARCHAR2(1) NOT NULL
,KURSSI_NRO                      NUMBER(2) NOT NULL
,KOE_NRO                         NUMBER(2) NOT NULL
,KOETILAISUUS_NRO                NUMBER(5)
,KOE_TYYPPI                      VARCHAR2(1) NOT NULL
,ILMOITTAUTUNEET_LKM             NUMBER(3) 
-- ei kaytossa
,OSALLISTUNEET_LKM               NUMBER(3)
 -- ei kaytossa
,HTUNNUS                         VARCHAR2(12)
,SALI                            VARCHAR(24)
,PRIMARY KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO,KOE_NRO));
-- viiteavain KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO (kurssi)
-- viiteavain KOE_TYYPPI (kokeen_tyyppi)
-- vitevain htunnus (henkilo)
-- viiteavain sali (SALI)

 
 
CREATE TABLE KURSSI(
-- kurssit
 KURSSIKOODI                     VARCHAR2(15) NOT NULL
,LUKUKAUSI                       VARCHAR2(1) NOT NULL
,LUKUVUOSI                       NUMBER(4) NOT NULL
,TYYPPI                          VARCHAR2(1) NOT NULL
,KURSSI_NRO                      NUMBER(2) NOT NULL
,KIELIKOODI                      VARCHAR2(1) NOT NULL
,NIMI                            VARCHAR2(200) NOT NULL
,OPINTOVIIKOT                    NUMBER(3,1) NOT NULL
,LUENTOTUNNIT                    NUMBER(3)
,LUENTOKERTA_LKM                 NUMBER(3)
,HARJOITUSTUNNIT                 NUMBER(3)
,LASKARIKERTA_LKM                NUMBER(2)
,LYHENNE                         VARCHAR2(12)  -- ei kaytossa
,SALASANA                        VARCHAR2(30)  -- ei kaytossa
,SUORITUS_PVM                    DATE
,TILA                            VARCHAR2(1)
,ALKAMIS_PVM                     DATE
,PAATTYMIS_PVM                   DATE
,PAIVITYS_PVM                    DATE
,MAX_OSALLISTUJA_LKM             NUMBER(3)
,LASKARITEHTAVA_LKM              VARCHAR2(54) -- piilotaulukko[18]: 99,99,.....,99
,PAKOLLISET_LASKARIKERTA_LKM     NUMBER(2)
,PAKOLLISET_LASKARITEHTAVA_LKM   NUMBER(3)
,MAX_LASKARIPISTEET              NUMBER(2)
,HYVAKSYTTY_LASKARILASNAOLO      VARCHAR2(54) -- piilotaulukko
,LISAPISTEALARAJA                NUMBER(3)
,LISAPISTERAJAT                  VARCHAR2(240) -- piilotaulukko[60]: 999,999,... 
,LISAPISTEIDEN_ASKELKOKO         NUMBER(3,1)
,HARJOITUSTYO_LKM                NUMBER(2)
,PAKOLLISET_HARJOITUSTYO_LKM     NUMBER(2)
,HARJOITUSTYOPISTEET             NUMBER(2)
,MAX_HARJOITUSTYOPISTEET         VARCHAR2(54)  -- piilotaulukko[18]: 99,99,.....,99
,MIN_HARJOITUSTYOPISTEET         VARCHAR2(54)  -- piilotaulukko[18]: 99,99,.....,99
,MIN_HARJOITUSTYOPISTEET_SUMMA   NUMBER(3)
,HARJOITUSTYON_PISTERAJAT        VARCHAR2(240)  -- piilotaulukko[60]: 999,999,... 
,HARJOITUSTOIDEN_ASKELKOKO       NUMBER(4,1)
,VALIKOKEET_LKM                  NUMBER(2)
,PAKOLLISET_KOE_LKM              NUMBER(2)
,MAX_KOEPISTEET                  VARCHAR2(54)  -- piilotaulukko[18]: 99,99,.....,99
,MIN_KOEPISTEET                  VARCHAR2(54)  -- piilotaulukko[18]: 99,99,.....,99
,MIN_KOEPISTEET_SUMMA            NUMBER(3)
,MIN_YHTEISPISTEET               NUMBER(3)
,ARVOSTELUN_ASKELKOKO            NUMBER(4,1)
,ARVOSANARAJAT                   VARCHAR2(80)  -- piilotaulukko[5]: 999,999,... 
,ARVOSTELLAANKO                  VARCHAR2(1)
,KOKONAISTIEDOT                  VARCHAR2(800)
,KUVAUSTIETO1                    VARCHAR2(800)
,KUVAUSTIETO2                    VARCHAR2(800)
,KUVAUSTIETO3                    VARCHAR2(800)
,HAKUKYSYMYKSET                  VARCHAR2(1)
,SUUNNITTELUKOMMENTTI            VARCHAR2(240)
,OMISTAJA                        VARCHAR2(30)
,PERUTTAVISSA                    CHAR(1)
,LASKENTAKAAVA                   NUMBER(2)
,ARVOSTELU_PVM                   DATE
,SIIRTO_PVM                      htDATE
,HT_LISAPISTEALARAJA             NUMBER(3)
,ARVOSTELIJA                     VARCHAR2(30)
,OPINTOVIIKOT_YLARAJA            NUMBER(4,1)
,OPINTOPISTEET_YLARAJA           NUMBER(4,1)
,OPINTOPISTEET                   NUMBER(4,1)
,PERIODI                         NUMBER(2)
,KOTISIVU                        VARCHAR(120)
,PERIODI2                        NUMBER(2)
,PRIMARY KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO));
 -- viiteavain KIELIKOODI (kielikoodi)
 -- viiteavain tyyppi (kurssin_tyyppi)
 -- viiteavain kurssikoodi (opintojakso)
 -- viiteavain tila (kurssin_tila)
 -- viiteavain omistaja (henkilo)
 --  viiteavain arvostelija (henkilo)(ktunnus)


CREATE TABLE KURSSIN_TILA(
 -- kurssin tila
 TILA                            VARCHAR2(1) NOT NULL
,KUVAUS                          VARCHAR2(30)
,PRIMARY KEY (TILA));
 
CREATE TABLE KURSSIN_TYYPPI(
-- kurssin_tyyyppi
 TYYPPI                          VARCHAR2(1) NOT NULL
,KUVAUS                          VARCHAR2(30)
,PRIMARY KEY (TYYPPI));
 
 
CREATE TABLE LABRATYO_TILA(
-- harjoitustyon tila, ei kaytossa
 LABRATYO_TILA                   VARCHAR2(1) NOT NULL
,KUVAUS                          VARCHAR2(30)
,PPRIMARY KEY (LABRATYO_TILA));
 
CREATE TABLE LAITOS(
-- laitoksen yhteystietoja, ilmo saattaa kayttaa
 LYHENNE                         VARCHAR2(6)
,RAPNIMI                         VARCHAR2(40)
,VASTHLOMAIL                     VARCHAR2(40)
,PRIMARY KEY (LYHENNE));
 
CREATE TABLE LUKUKAUSI(
-- lukukauden alkamis- ja paattymisajat, ei liene kaytossa
 LUKUKAUSI                       VARCHAR2(1) NOT NULL
,KUVAUS                          VARCHAR2(10)
,ALKAMIS_PVM                     DATE
,PAATTYMIS_PVM                   DATE
,PRIMARY KEY (LUKUKAUSI)
);
 

CREATE TABLE OPETUS(
-- harjoitusryhma tai muu opintokohde
 KURSSIKOODI                     VARCHAR2(15) NOT NULL
,LUKUKAUSI                       VARCHAR2(1) NOT NULL
,LUKUVUOSI                       NUMBER(4) NOT NULL
,TYYPPI                          VARCHAR2(1) NOT NULL
,KURSSI_NRO                      NUMBER(22) NOT NULL
,RYHMA_NRO                       NUMBER(2) NOT NULL
,ILMO_JNRO                       NUMBER(2)
,ILMO                            VARCHAR2(1) -- voiko ilmoittautua
,OPETUSTEHTAVA                   VARCHAR2(3)
,ALKAMISAIKA                     DATE
,PAATTYMISAIKA                   DATE
,ALKAMIS_PVM                     DATE
,PAATTYMIS_PVM                   DATE
,MAX_OSALLISTUJA_LKM             NUMBER(3)
,ILMOITTAUTUNEIDEN_LKM           NUMBER(3) -- ei kaytossa
,KUVAUSTIETO                     VARCHAR2(70)
,KIELI                           VARCHAR2(3)
,PRIMARY KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO,RYHMA_NRO));
-- viiteavain(KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI, KURSSI_NRO) kurssi

CREATE TABLE OPETUSALA(
-- linja
 OPETUSALA                       VARCHAR2(5) NOT NULL
,KUVAUS                          VARCHAR2(240)
,PRIMARY KEY (OPETUSALA));

CREATE TABLE OPETUSPALKKIOT (
-- opetuspalkkiot
 TASO                             NUMBER(2) NOT NULL
, ALKAEN                          DATE NOT NULL
, ASTI                            DATE NOT NULL
, PERUSPALKKA                     NUMBER(6,2)
, PRIMARY KEY (TASO, ALKAEN));
 
CREATE TABLE OPETUSTEHTAVA(
-- opetustehtava
 TYYPPI                          VARCHAR2(3) NOT NULL
,KUVAUS                          VARCHAR2(60) NOT NULL
,OTNRO                           NUMBER(2)
,PRIMARY KEY (TYYPPI));
 
CREATE TABLE OPETUSTEHTAVA_KERTOIMET (
-- opetustehtavien maksukertoimet
  TEHTAVA                         VARCHAR2(4) NOT NUL
, KERROIN                         NUMBER(6,2) NOT NUL
, ALKAEN                          DATE NOT NULL
, ASTI                            DATE NOT NULL
, PRIMARY KEY (TEHTAVA, ALKAEN)
);

CREATE TABLE OPETUSTEHTAVAN_HOITO(
 KURSSIKOODI                     VARCHAR2(15) NOT NULL
,LUKUKAUSI                       VARCHAR2(1) NOT NULL
,LUKUVUOSI                       NUMBER(4) NOT NULL
,TYYPPI                          VARCHAR2(1) NOT NULL
,KURSSI_NRO                      NUMBER(2) NOT NULL
,RYHMA_NRO                       NUMBER(2) NOT NULL
,HTUNNUS                         VARCHAR2(12) NOT NULL
,OPETUSTEHTAVA                   VARCHAR2(3) NOT NULL
,ALKAMIS_PVM                     DATE
,PAATTYMIS_PVM                   DATE
,TUNTIMAARA                      NUMBER(6)
,VASTUUHENKILO                   NUMBER(1)
,TASO                            NUMBER(2)
,KERROIN                         NUMBER(6,2)
,MAKSUPERUSTE                    CHAR(1)
,OHJNRO                          NUMBER(38)
,PRIMARY KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,KURSSI_NRO,TYYPPI,RYHMA_NRO,HTUNNUS,OPETUSTEHTAVA));
-- viiteavain KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,KURSSI_NRO,TYYPPI,RYHMA_NRO (opetus)
-- viiteavain HTUNNUS (henkilo)
-- viiteavain OPETUSTEHTAVA (opetustehtava)
 
CREATE TABLE OPINTOJAKSON_TASO(
-- opintojakson taso
 TASO                            VARCHAR2(1) NOT NULL
,KUVAUS                          VARCHAR2(40)
,PRIMARY KEY (TASO));


CREATE TABLE OPINTOJAKSON_TYYPPI(
-- opintojakson tyyppi
 TYYPPI                          VARCHAR2(1) NOT NULL
,KUVAUS                          VARCHAR2(30)
,OJTNRO                          NUMBER(2)
,PRIMARY KEY (TYYPPI));

CREATE TABLE OPINTOJAKSO(
-- opintojaksot
 KURSSIKOODI                     VARCHAR2(15) NOT NULL
,TULOSTUS_JARJESTYS              NUMBER(4)
,NIMI_SUOMI                      VARCHAR2(100)
,NIMI_RUOTSI                     VARCHAR2(100)
,NIMI_ENGLANTI                   VARCHAR2(100)
,OPINTOVIIKOT                    NUMBER(4,1) -- voi olla nolla
,OPINTOVIIKOT_YLARAJA            NUMBER(4,1) -- voi olla nolla
,TYYPPI                          VARCHAR2(1)
,TASO                            VARCHAR2(1)
,KUVAUS                          VARCHAR2(2000)
,TIIVISTELMA                     VARCHAR2(1200)
,VALIKOKEET_LKM                  NUMBER(2)
,SUUNTAUTUMISVAIHTOEHTO          VARCHAR2(1)
,LUENTOTUNNIT                    NUMBER(3)
,LUENTOKERTA_LKM                 NUMBER(3)
,HARJOITUSTUNNIT                 NUMBER(3)
,HARJOITUSKERTA_LKM              NUMBER(3)
,VOIMASSAOLO_ALKAMIS_PVM         DATE
,VOIMASSAOLO_PAATTYMIS_PVM       DATE
,PAKOLLISUUS                     CHAR(1)
,OPINTOPISTEET                   NUMBER(4,1)
,OPINTOPISTEET_YLARAJA           NUMBER(4,1)
,KOTISIVU                        varchar(120)
,ESITIEDOT                       char(1)
,OPPIMISTAVOITTEET               varchar(240)
,PRIMARY KEY (KURSSIKOODI));
 
CREATE TABLE OPISKELIJA(
-- opiskelija, avaimena opiskelijanro (nimi HETU)
 PERSONID                        VARCHAR2(11)  -- hetu, voi puuttua
,ETUNIMI                         VARCHAR2(25) NOT NULL
,SUKUNIMI                        VARCHAR2(40) NOT NULL
,ENTINEN_SUKUNIMI                VARCHAR2(80)
,OSOITE                          VARCHAR2(120)
,PUHELIN                         VARCHAR2(40)
,SAHKOPOSTIOSOITE                VARCHAR2(50)
,PAA_AINE                        VARCHAR2(3)
,ALOITUSVUOSI                    NUMBER(4)
,KAYTTO_PVM                      DATE
,OPNRO                           VARCHAR2(15) -- opiskelijanumero, ei kaytossa
,LUPA                            VARCHAR2(12) 
,VINKKI                          VARCHAR2(40) -- ei kaytossa
,VARMENNE                        VARCHAR2(20) -- ei kaytossa
,HETU                            VARCHAR(9) PRIMARY KEY);  -- opiskelijanumero
 
CREATE TABLE OPPIARVO(
-- oppiarvo
 OPPIARVO                        VARCHAR2(5) NOT NULL
,KUVAUS                          VARCHAR2(80)
,KUVAUS_RUOTSI                   VARCHAR2(80)
,KUVAUS_ENGLANTI                 VARCHAR2(80)
,PRIMARY KEY (OPPIARVO));
 
CREATE TABLE OSALLISTUMINEN(
-- opiskelijan osallistuminen kurssille
 PERSONID                        VARCHAR2(11) -- hetu, voi puuttua
,KURSSIKOODI                     VARCHAR2(15) NOT NULL
,LUKUKAUSI                       VARCHAR2(1) NOT NULL
,LUKUVUOSI                       NUMBER(4) NOT NULL
,TYYPPI                          VARCHAR2(1) NOT NULL
,KURSSI_NRO                      NUMBER(2) NOT NULL
,RYHMA_NRO                       NUMBER(2) NOT NULL
,KOMMENTTI_1                     VARCHAR2(240)
,KOMMENTTI_2                     VARCHAR2(240)
,LASKARI_LASNAOLO_LKM            NUMBER(2)
,LASKARISUORITUKSET              VARCHAR2(54)  -- piilotaulukko[18]: 99,99,.....,99
,LASKARISUORITUKSET_SUMMA        NUMBER(3)
,LASKARIHYVITYS                  NUMBER(3)
,HARJOITUSTYO_LASNAOLO_LKM       NUMBER(2)
,HARJOITUSTYOPISTEET             VARCHAR2(54)  -- piilotaulukko[18]: 99,99,.....,99
,HARJOITUSTYO_SUMMA              NUMBER(3)
,HARJOITUSTYOHYVITYS             NUMBER(3)
,KOEPISTEET                      VARCHAR2(54)  -- piilotaulukko[18]: 99,99,.....,99
,KOEPISTEET_SUMMA                NUMBER(3)
,YHTEISPISTEET                   NUMBER(3)
,ARVOSANA                        VARCHAR2(2)
,ILMOITTAUTUMIS_PVM              DATE
,VOIMASSA                        VARCHAR2(1)
,VIIMEINEN_KASITTELY_PVM         DATE
,ILMO_JNRO                       NUMBER(2)
,JAASSA                          CHAR(1)
,LAAJUUS_OV                      number(4,1)
,LAAJUUS_OP                      number(4,1)
,HETU                            VARCHAR(9) NOT NULL PRIMARY KEY
,KYPSYYS_PVM                     DATE    -- jotain, muuta tarpeen?
,TENTTIJA                        VARCHAR(200) -- kommentteja
,KIELIKOODI                      VARCHAR(2) -- suorituksen kieli
); 
 
CREATE TABLE PAA_AINE(
-- paa-aine ilmossa
 PAA_AINE                        VARCHAR2(3) NOT NULL
,KUVAUS                          VARCHAR2(30)
,PRIMARY KEY (PAA_AINE));

CREATE TABLE PERIODI(
-- periodien alkamis- ja paattymisajat
VUOSI                             NUMBER(4) NOT NULL
,PNUMERO                          NUMBER(1) NOT NULL
,ALKUPVM                          DATE
,LOPPUPVM                         DATE
,PRIMARY KEY (VUOSI, PNUMERO));

CREATE TABLE PROJEKTI(
--projektit
 KOODI                          VARCHAR2(12) NOT NULL 
,NIMI                           VARCHAR2(32)NOT NULL 
,ALKUPVM                        DATE NOT NULL 
,LOPPUPVM                       DATE
,VASTUUHENKILO                  VARCHAR2(40)
,PRIMARY KEY (KOODI));


CREATE TABLE PROJEKTIVIITE(
-- projektit vanhassa nero jarjestelmassa, tyhja taulu, ei kaytossa
 PROJEKTIVIITE                   VARCHAR2(3) NOT NULL
,KUVAUS                          VARCHAR2(30)
,PRIMARY KEY (PROJEKTIVIITE));

CREATE TABLE PUHELIN_YLEISET(
-- yleisia puhelinnumeroita, nayttaa vanhetuneelta ainakin sisalto
 PAIKKA                          CHAR(5)
,TNRO                            NUMBER(22)
,TEKSTI                          CHAR(40)
);
 
CREATE TABLE RAPORTTI(
-- aputaulu raporttien laadintaan, ei ehka kaytossa?
 RAP                             NUMBER(6)
,RNO                             NUMBER(6)
,RIVI                            VARCHAR2(300)
);
 
CREATE TABLE SALI(
-- opetustilat
 SALI_NRO                        VARCHAR2(12) NOT NULL
,KOKO                            NUMBER(6)
,VARUSTELU                       VARCHAR2(240)
,PRIMARY KEY (SALI_NRO));
 
REM  Tauluun kirjataan salivaraukset joko koetilaisuuksille tai
REM  opetustilaisuuksille. Opetustilaisuuteen viitataan sarakeyhdistelmalla
REM  KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO, RYHMA_NRO
REM  Opetuksen luonne selviaa taulusta opetus.
REM  Koetilaisuuteen viitataan sarakkeella KOETILAISUUS_NRO.
REM  Alkamis- ja paattymispaiva kertovat milloin varaus on voimassa.
REM  Paivaykset voivat olla samat.
REM  
CREATE TABLE SALIVARAUS(
VARAUS_NRO                      NUMBER(6) NOT NULL
,SALI_NRO                        VARCHAR2(12)
,KURSSIKOODI                     VARCHAR2(15)
,LUKUKAUSI                       VARCHAR2(1)
,LUKUVUOSI                       NUMBER(4)
,TYYPPI                          VARCHAR2(1)
,KURSSI_NRO                      NUMBER(2)
,RYHMA_NRO                       NUMBER(2)
,KOETILAISUUS_NRO                NUMBER(5)
,VIIKONPAIVA                     VARCHAR2(2)
,ALKAMIS_PVM                     DATE
,PAATTYMIS_PVM                   DATE
,ALKAMISAIKA                     NUMBER(2)
,PAATTYMISAIKA                   NUMBER(2)
,ESIINTYMISTIHEYS                NUMBER(1)
,JOKAPAIVA                       NUMBER(1)
,VIIKONLOPPU                     NUMBER(1)
,TARKOITUS                       VARCHAR2(80)
,KAYTTAJA                        VARCHAR2(80)
,MA                              NUMBER(1)
,TI                              NUMBER(1)
,KE                              NUMBER(1)
,TR                              NUMBER(1)
,PE                              NUMBER(1)
,LA                              NUMBER(1)
,SU                              NUMBER(1)
,VARAUS_PVM                      DATE
,PRIMARY KEY (VARAUS_NRO));
 
CREATE TABLE SUUNNITTELULUKUKAUSI(
-- mika lienee, taulu on tyhja, ei kaytossa?
 LUKUKAUSI                       VARCHAR2(1)
,LUKUVUOSI                       NUMBER(4)
);
 
CREATE TABLE SUUNTAUTUMISVAIHTOEHTO(
-- suuntautumisvaihtoehto
 SUUNTAUTUMISVAIHTOEHTO          VARCHAR2(1) NOT NULL
,KUVAUS                          VARCHAR2(30)
);

CREATE TABLE TYOPISTE (
-- tyopisteet (nero)
ID                               NUMBER(20)NOT NULL 
, RHUONE_ID                       NUMBER(20)NOT NULL 
, LISAYSPVM                       DATE NOT NULL 
, PUHNRO_ID                       NUMBER(12)
, STATUS                          NUMBER(2)
,PRIMARY KEY (ID));
 
CREATE TABLE TYOPISTEVARAUS (
-- tyopistevaraukset (nero)
ID                               NUMBER(20) NOT NULL 
,TPISTE_ID                       NUMBER(20) NOT NULL 
,VIIKKOTUNNIT                    NUMBER(6,2) NOT NULL 
,ALKUPVM                         DATE NOT NULL 
,LOPPUPVM                        DATE NOT NULL 
,LISAYSPVM                       DATE NOT NULL 
,HENKLO_HTUNNUS                  VARCHAR2(12)
,SELITE                          VARCHAR2(4000) 
,PRIMARY KEY (ID));
-- viiteavain tyopiste_id
-- viiteavain henkilo_htunnus

CREATE TABLE TYOSOPIMUSJAKSO (
-- tyosopimukset (nero)
 SOPIMUSNUMERO                  VARCHAR2(9) NOT NULL 
 ,HENKLO_HTUNNUS                VARCHAR2(12)NOT NULL 
 ,ALKUPVM_JAKSO                 DATE NOT NULL 
 ,LOPPUPVM_JAKSO                DATE NOT NULL
 ,ALKUPVM_SOPIMUS               DATE NOT NULL 
 ,LOPPUPVM_SOPIMUS              DATE NOT NULL 
 ,NIMIKE                        VARCHAR2(50) NOT NULL 
 ,VIRKA_TYOSUHDE                VARCHAR2(1) NOT NULL 
 ,SOPIMUSTYYPPI                 VARCHAR2(1) NOT NULL 
 ,S_SOPIMUSTYYPPI               VARCHAR2(15)
 ,TUNNIT                        NUMBER(17,2)
 ,VV_HOITOPROSENTTI             VARCHAR2(8)
 ,PRJKTI_KOODI                  VARCHAR2(9)
 ,PRJKTI_NIMI                   VARCHAR2(30)
 ,VAKANSSI                      VARCHAR2(6)
 ,NIMIKEKOODI                   VARCHAR2(5)
 ,PRIMARY KEY (SOPIMUSNUMERO));
-- viiteavain henkilo_htunnus (HENKILO)
-- viiteavain PRJKTI_KOODI (PROJEKTI)

CREATE TABLE VANHATOS(
-- vanhoja kurssiosallistumisia viime vuosituhannelta
-- sovellukset eivat kayta
 PERSONID                        VARCHAR2(11)
,KURSSIKOODI                     VARCHAR2(15) NOT NULL
,LUKUKAUSI                       VARCHAR2(1) NOT NULL
,LUKUVUOSI                       NUMBER(4) NOT NULL
,TYYPPI                          VARCHAR2(1) NOT NULL
,KURSSI_NRO                      NUMBER(2) NOT NULL
,RYHMA_NRO                       NUMBER(2) NOT NULL
,KOMMENTTI_1                     VARCHAR2(240)
,KOMMENTTI_2                     VARCHAR2(240)
,LABRATYO_NRO                    VARCHAR2(6)
,LABRATYO_NIMI                   VARCHAR2(60)
,LABRATYO_TUNNIT                 NUMBER(22)
,LABRATYO_TILA                   VARCHAR2(1)
,LABRATYO_VALMISTUMIS_PVM        DATE
,LASKARI_LASNAOLO_LKM            NUMBER(2)
,LASKARISUORITUKSET              VARCHAR2(54)
,LASKARISUORITUKSET_SUMMA        NUMBER(3)
,LASKARIHYVITYS                  NUMBER(3)
,HARJOITUSTYO_LASNAOLO_LKM       NUMBER(2)
,HARJOITUSTYOPISTEET             VARCHAR2(54)
,HARJOITUSTYO_SUMMA              NUMBER(3)
,HARJOITUSTYOHYVITYS             NUMBER(3)
,KOEPISTEET                      VARCHAR2(54)
,KOEPISTEET_SUMMA                NUMBER(3)
,YHTEISPISTEET                   NUMBER(3)
,ARVOSANA                        VARCHAR2(2)
,ILMOITTAUTUMIS_PVM              DATE
,VOIMASSA                        VARCHAR2(1)
,AIHE                            VARCHAR2(80)
,TENTTIJA                        VARCHAR2(80)
,SUORITUSAIKA                    VARCHAR2(80)
,TUTKINTO                        VARCHAR2(80)
,VIIMEINEN_KASITTELY_PVM         DATE
,OMISTAJA                        VARCHAR2(30)
,ILMO_JNRO                       NUMBER(2)
,KYPSYYS_PVM                     DATE
,KYPSYYSPAIKKA                   VARCHAR2(40)
,KYPSYYS_MUUTA                   VARCHAR2(80)
,HETU                            VARCHAR(9)  -- opiskelijanumero
);
 
CREATE TABLE VARAUSTYYPPI(
-- varaustyyppi
 VARAUSTYYPPI                    NUMBER(2) NOT NULL
,JOKAPAIVA                       NUMBER(1) NOT NULL
,VIIKONLOPPU                     NUMBER(1) NOT NULL
,VIIKONPAIVA                     VARCHAR2(2) NOT NULL
,SELITYS                         VARCHAR2(50) NOT NULL
,VIIKONPAIVA_R                   VARCHAR2(3)
,VIIKONPAIVA_E                   VARCHAR2(3)
,SELITYS_R                       VARCHAR2(50)
,SELITYS_E                       VARCHAR2(50)
);
 
CREATE TABLE VASTAANOTTO(
--vastaanottoajat, ei kaytossa
 HTUNNUS                         VARCHAR2(12) NOT NULL
,VIIKONPAIVA                     VARCHAR2(2) NOT NULL
,ALKAMISAIKA                     DATE NOT NULL
,PAATTYMISAIKA                   DATE NOT NULL
,PAIKKA                          VARCHAR2(12) NOT NULL
,ALKAMIS_PVM                     DATE NOT NULL
,PAATTYMIS_PVM                   DATE
,KOMMENTTI                       VARCHAR2(240)
,PRIMARY KEY (HTUNNUS,VIIKONPAIVA,ALKAMIS_PVM,ALKAMISAIKA));

CREATE TABLE VASTAANOTTO_YLEISET(
--  yleiset vastaanotot esim opintoneuvonta, ei kaytossa
 PAIKKA                          CHAR(5)
,TNRO                            NUMBER(2)
,TEKSTI                          VARCHAR2(80)
);
 
CREATE TABLE VIRANHOIDON_TYYPPI(
-- VIRANHOIDON TYYPIT
TYYPPI                           VARCHAR2(12) NOT NULL
,KUVAUS                          VARCHAR2(60) NOT NULL
);

CREATE TABLE VIRANHOITO_HALTIJA(
-- viranhoito
 VIRKA_NRO                       NUMBER(6) NOT NULL
,HTUNNUS                         VARCHAR2(12) NOT NULL
,ALKAMIS_PVM                     DATE NOT NULL
,HOITO_TYYPPI                    VARCHAR2(12) NOT NULL
,PAATTYMIS_PVM                   DATE
,ETULIITE                        VARCHAR2(12)
,TILA                            VARCHAR2(1)
,KOMMENTTI                       VARCHAR2(240)
,OPETUSALA                       VARCHAR2(5)
,PRIMARY KEY (VIRKA_NRO,HTUNNUS,ALKAMIS_PVM,HOITO_TYYPPI));
 
CREATE TABLE VIRAN_ETULIITE(
-- viram etuliite esim ma
 ETULIITE                        VARCHAR2(2) NOT NULL
,KUVAUS                          VARCHAR2(30)
);
 
CREATE TABLE VIRAN_LAATU(
-- virkojen tyypit, pysyva tai tilapainen
 LAATU                           VARCHAR2(12) NOT NULL
,KUVAUS                          VARCHAR2(60) NOT NULL
);
 
CREATE TABLE VIRAN_TILA(
-- viran tilat suunniteltu, pysyva, historiatieto
 TILA                            VARCHAR2(1) NOT NULL
,KUVAUS                          VARCHAR2(30)
);

CREATE TABLE VIRKA(
--virat tai toimet
 VIRKA_NRO                       NUMBER(6) NOT NULL
,TULOSTUS_JARJESTYS              NUMBER(3) NOT NULL
,NIMIKE                          VARCHAR2(80) NOT NULL
,NIMIKELYHENNE                   VARCHAR2(10) NOT NULL
,PALKKAUSLUOKKA                  VARCHAR2(12)
,LAATU                           VARCHAR2(12)
,PERUSTAMIS_PVM                  DATE
,LAKKAUTTAMIS_PVM                DATE
,PROJEKTIVIITE                   VARCHAR2(3)
,KOMMENTTI                       VARCHAR2(240)
,NIMIKE_RUOTSI                   VARCHAR2(80)
,NIMIKELYHENNE_RUOTSI            VARCHAR2(10)
,NIMIKE_ENGLANTI                 VARCHAR2(80)
,NIMIKELYHENNE_ENGLANTI          VARCHAR2(10)
,OPETUSALA                       VARCHAR2(5)
,PRIMARY KEY (VIRKA_NRO));
 
CREATE TABLE VIRKAVAPAUDEN_SYY(
 SYY                             VARCHAR2(3) NOT NULL
,KUVAUS                          VARCHAR2(80)
);
 
CREATE TABLE VIRKAVAPAUS(
-- virkavapau, ei kaytossa talla vuosituhannella
 VIRKA_NRO                       NUMBER(6) NOT NULL
,HTUNNUS                         VARCHAR2(12) NOT NULL
,ALKAMIS_PVM                     DATE NOT NULL
,PAATTYMIS_PVM                   DATE NOT NULL
,TILA                            VARCHAR2(1)
,LAATU                           VARCHAR2(3)
,PERUSTE                         VARCHAR2(240)
,PRIMARY KEY (HTUNNUS,VIRKA_NRO,ALKAMIS_PVM));
 
CREATE TABLE VUOSIVIIKKO(
-- aputaulu salivarausten kasittelyyn, ei kaytossa
 VUOSI                           NUMBER(4)
,VIIKKO                          NUMBER(2)
);
 
CREATE TABLE YHTEYSTIEDOT(
-- henkiloiden yhteystietoja, ei kaytossa
 HTUNNUS                         VARCHAR2(12) NOT NULL
,TYYPPI                          VARCHAR2(3) NOT NULL
,YHTEYSTIETO                     VARCHAR2(120)
,NAKYVYYS                        VARCHAR2(1)
,PRIMARY KEY (HTUNNUS,TYYPPI));
 
CREATE TABLE YHTEYSTYYPPI(
-- yhteystyypit taulua yhteystiedot varten, ei kaytossa?
 TYYPPI                          VARCHAR2(3) NOT NULL
,KUVAUS                          VARCHAR2(15) NOT NULL
);
 
-- viiteavaimet
ALTER TABLE HALLINNOLLINEN_TEHTAVA
  ADD ( CONSTRAINT FK_HT_HR
  FOREIGN KEY (HALLINNOLLINEN_RYHMA) REFERENCES HALLINNOLLINEN_RYHMA);
 
ALTER TABLE HALLINNOLLISEN_TEHTAVAN_HOITO
  ADD ( CONSTRAINT FK_HTH_HLO
 FOREIGN KEY (HTUNNUS) REFERENCES HENKILO);
 
ALTER TABLE HALLINNOLLISEN_TEHTAVAN_HOITO
  ADD ( CONSTRAINT FK_HTH_HT
 FOREIGN KEY (TEHTAVATUNNUS) REFERENCES HALLINNOLLINEN_TEHTAVA);
 
ALTER TABLE HENKILO
  ADD ( CONSTRAINT FK_H_COPP
 FOREIGN KEY (OPPIARVO) REFERENCES OPPIARVO);
 
ALTER TABLE HENKILO
  ADD ( CONSTRAINT FK_H_HUONE
 FOREIGN KEY (HUONE_NRO) REFERENCES HUONE);
 
ALTER TABLE ILMOKYSYMYS
  ADD ( CONSTRAINT FK_IK_OJ
 FOREIGN KEY (KURSSIKOODI) REFERENCES OPINTOJAKSO);
 
ALTER TABLE ILMOLUKUMAARAT
  ADD ( CONSTRAINT FK_ILKM_O
 FOREIGN KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO,RYHMA_NRO) REFERENCES OPETUS);

ALTER TABLE ILMOVASTAUS
  ADD ( CONSTRAINT FK_IV_IK
 FOREIGN KEY (KURSSIKOODI,KYSYMYS_NRO) REFERENCES ILMOKYSYMYS);

ALTER TABLE ILMOVASTAUS
  ADD ( CONSTRAINT FK_IV_op
 FOREIGN KEY (HETU) REFERENCES OPISKELIJA);

ALTER TABLE KALUSTUS
  ADD ( CONSTRAINT FK_KALUSTUS_HUONE
 FOREIGN KEY (HUONE_NRO) REFERENCES HUONE);
 
ALTER TABLE KALUSTUS
  ADD ( CONSTRAINT FK_KALUSTUS_LAJI
 FOREIGN KEY (KALUSTELAJI) REFERENCES KALUSTELAJI);
 
ALTER TABLE KOE
  ADD ( CONSTRAINT FK_KOE_CKOT
 FOREIGN KEY (KOE_TYYPPI) REFERENCES KOKEEN_TYYPPI);
 
ALTER TABLE KOE
  ADD ( CONSTRAINT FK_KOE_H
 FOREIGN KEY (HTUNNUS) REFERENCES HENKILO);
 
ALTER TABLE KOE
  ADD ( CONSTRAINT FK_KOE_K
 FOREIGN KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO) REFERENCES KURSSI);
 
ALTER TABLE KOE
  ADD ( CONSTRAINT FK_KOE_KOE_T
 FOREIGN KEY (LUKUKAUSI,LUKUVUOSI,KOETILAISUUS_NRO) REFERENCES KOETILAISUUS);
 
ALTER TABLE KOETILAISUUS
  ADD ( CONSTRAINT FK_KOE_T_CLUK
 FOREIGN KEY (LUKUKAUSI) REFERENCES LUKUKAUSI);
 
ALTER TABLE KURSSI
  ADD ( CONSTRAINT FK_K_CKIE
 FOREIGN KEY (KIELIKOODI) REFERENCES KIELIKOODI);
 
ALTER TABLE KURSSI
  ADD ( CONSTRAINT FK_K_CKTI
 FOREIGN KEY (TILA) REFERENCES KURSSIN_TILA);
 
ALTER TABLE KURSSI
  ADD ( CONSTRAINT FK_K_CKUT
 FOREIGN KEY (TYYPPI) REFERENCES KURSSIN_TYYPPI);
 
ALTER TABLE KURSSI
  ADD ( CONSTRAINT FK_K_OJ
 FOREIGN KEY (KURSSIKOODI) REFERENCES OPINTOJAKSO);

ALTER TABLE KURSSI
  ADD ( CONSTRAINT FK_K_HENK
  FOREIGN KEY (OMISTAJA) REFERENCES HENKILO);

ALTER TABLE OPETUS
  ADD ( CONSTRAINT FK_O_K
 FOREIGN KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO) REFERENCES KURSSI);
 
ALTER TABLE OPETUSTEHTAVAN_HOITO
  ADD ( CONSTRAINT FK_OH_COPE
 FOREIGN KEY (OPETUSTEHTAVA) REFERENCES OPETUSTEHTAVA);
 
ALTER TABLE OPETUSTEHTAVAN_HOITO
  ADD ( CONSTRAINT FK_OH_H
 FOREIGN KEY (HTUNNUS) REFERENCES HENKILO);
 
ALTER TABLE OPETUSTEHTAVAN_HOITO
  ADD ( CONSTRAINT FK_OTH_O
 FOREIGN KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO,RYHMA_NRO) REFERENCES OPETUS);
 
ALTER TABLE OPINTOJAKSO
  ADD ( CONSTRAINT FK_OJ_COTA
 FOREIGN KEY (TASO) REFERENCES OPINTOJAKSON_TASO);
 
ALTER TABLE OPINTOJAKSO
  ADD ( CONSTRAINT FK_OJ_COTY
 FOREIGN KEY (TYYPPI) REFERENCES OPINTOJAKSON_TYYPPI);
 
ALTER TABLE OPINTOJAKSO
  ADD ( CONSTRAINT FK_OJ_CSUU
 FOREIGN KEY (SUUNTAUTUMISVAIHTOEHTO) REFERENCES SUUNTAUTUMISVAIHTOEHTO);
 
ALTER TABLE OPISKELIJA
  ADD ( CONSTRAINT FK_OPI_CPAA
 FOREIGN KEY (PAA_AINE) REFERENCES PAA_AINE);
 
ALTER TABLE OSALLISTUMINEN
  ADD ( CONSTRAINT FK_OS_O
 FOREIGN KEY (KURSSIKOODI,LUKUKAUSI,LUKUVUOSI,TYYPPI,KURSSI_NRO,RYHMA_NRO) REFERENCES OPETUS);
 
ALTER TABLE OSALLISTUMINEN
  ADD ( CONSTRAINT FK_OS_OP
 FOREIGN KEY (HETU) REFERENCES OPISKELIJA);
 
ALTER TABLE SALIVARAUS
  ADD ( CONSTRAINT FK_SALI_V_KOE_T
 FOREIGN KEY (LUKUKAUSI,LUKUVUOSI,KOETILAISUUS_NRO) REFERENCES KOETILAISUUS);
 
ALTER TABLE SALIVARAUS
  ADD ( CONSTRAINT FK_SALI_V_SALI
 FOREIGN KEY (SALI_NRO) REFERENCES SALI);
 
ALTER TABLE VASTAANOTTO
  ADD ( CONSTRAINT FK_VO_H
 FOREIGN KEY (HTUNNUS) REFERENCES HENKILO);
 
ALTER TABLE VIRANHOITO_HALTIJA
  ADD ( CONSTRAINT FK_VH_CVHT
 FOREIGN KEY (HOITO_TYYPPI) REFERENCES VIRANHOIDON_TYYPPI);
 
ALTER TABLE VIRANHOITO_HALTIJA
  ADD ( CONSTRAINT FK_VH_CVTI
 FOREIGN KEY (TILA) REFERENCES VIRAN_TILA);
 
ALTER TABLE VIRANHOITO_HALTIJA
  ADD ( CONSTRAINT FK_VH_H
 FOREIGN KEY (HTUNNUS) REFERENCES HENKILO);
 
ALTER TABLE VIRANHOITO_HALTIJA ADD ( CONSTRAINT FK_VH_OA
 FOREIGN KEY (OPETUSALA) REFERENCES OPETUSALA);

ALTER TABLE VIRANHOITO_HALTIJA
  ADD ( CONSTRAINT FK_VH_VIRKA
 FOREIGN KEY (VIRKA_NRO) REFERENCES VIRKA);
 
ALTER TABLE VIRKA
  ADD ( CONSTRAINT FK_VIRKA_CPRJ
 FOREIGN KEY (PROJEKTIVIITE) REFERENCES PROJEKTIVIITE);
 
ALTER TABLE VIRKA
  ADD ( CONSTRAINT FK_VIRKA_CVLAA
 FOREIGN KEY (LAATU) REFERENCES VIRAN_LAATU);
 
ALTER TABLE VIRKA
  ADD ( CONSTRAINT FK_V_OA
 FOREIGN KEY (OPETUSALA) REFERENCES OPETUSALA);
 
ALTER TABLE VIRKAVAPAUS
  ADD ( CONSTRAINT FK_VK_CVVS
 FOREIGN KEY (LAATU) REFERENCES VIRKAVAPAUDEN_SYY);
 
ALTER TABLE VIRKAVAPAUS
  ADD ( CONSTRAINT FK_VK_H
 FOREIGN KEY (HTUNNUS) REFERENCES HENKILO);
 
ALTER TABLE VIRKAVAPAUS
  ADD ( CONSTRAINT FK_VK_VIRKA
 FOREIGN KEY (VIRKA_NRO) REFERENCES VIRKA);
 
ALTER TABLE YHTEYSTIEDOT
  ADD ( CONSTRAINT FK_YT_CTYY
 FOREIGN KEY (TYYPPI) REFERENCES YHTEYSTYYPPI);
 
ALTER TABLE YHTEYSTIEDOT
  ADD ( CONSTRAINT FK_YT_H
 FOREIGN KEY (HTUNNUS) REFERENCES HENKILO);
REM </pre>
