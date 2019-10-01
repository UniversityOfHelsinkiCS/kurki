create or replace package body arvostelu05 as

function arvostele (
   kkoodi in char,
   lv in number, 
   lk in char,
   tp in char,
   knro in number,
   kuka in char ) return integer is
 
   cursor kurssitiedot is
     select * 
     from kurssi
     where 
        kurssikoodi=kkoodi and
        lukuvuosi=lv and
        lukukausi=lk and
        tyyppi=tp and
        kurssi_nro=knro
     for update of arvostelu_pvm;


   cursor oppilas is
     select hetu, Laskari_lasnaolo_lkm,
     LASKARISUORITUKSET, laskarisuoritukset_summa,
     LASKARIHYVITYS, HARJOITUSTYO_LASNAOLO_LKM,
     HARJOITUSTYOPISTEET, HARJOITUSTYO_SUMMA, 
     HARJOITUSTYOHYVITYS,
     KOEPISTEET,KOEPISTEET_SUMMA,YHTEISPISTEET,  ARVOSANA,
     VIIMEINEN_KASITTELY_PVM, laajuus_op, laajuus_ov,kielikoodi
     from osallistuminen
     where kurssikoodi=kkoodi and
        lukuvuosi=lv and
        lukukausi=lk and
        tyyppi=tp and
        kurssi_nro=knro and 
        voimassa='K' and
        (kommentti_2 is null or Kommentti_2 <>'MANUAL') and
        (jaassa is null or jaassa ='S') 
     for update of laskari_lasnaolo_lkm,laskarisuoritukset_summa,
         laskarihyvitys,harjoitustyo_lasnaolo_lkm,
         harjoitustyo_summa, harjoitustyohyvitys,
         koepisteet_summa,yhteispisteet, viimeinen_kasittely_pvm,
         kypsyys_pvm, arvosana, laajuus_op, laajuus_ov,kielikoodi;

    i integer;
    apu integer;
    apu2 integer;

    ylaraja                number(3);

    -- laskurit
    laskaripistesumma      number(3);
    harjoitustyopistesumma number(3);
    koepistesumma          number(3);
--    koepistesumma2         number(3);
--    koesummavertaa         number(3);
    laskarilasnaoloja      number(3);
    hyvaksytyt_tyot        number(3);
    hyvaksytyt_kokeet      number(3);

    -- maksimipisteet
    koemaksimi        number(3);
    koemaksimi2       number(3);
    laskarimaksimi         number(3);
    harjoitustyomaksimi    number(3);
    maksimipisteet         number(3);
    yhteispisteet          number(3);
    uudelleenskaalattu     number(3);
    loppupisteet           number(3);
    koesumma1              number(3);
	koesumma2              number(3);
	koesumma3              number(3);
	koesumma4              number(3);
	hyvkoe1                number(3);
	hyvkoe2                number(3);
    hyvkoe3                number(3);
    hyvkoe4                number(3);

    -- hyvitykset
    laskari_hyvitys         number(3);
    harjoitustyo_hyvitys    number(3);
    koe_hyvitys             number(3);  -- ylim koe.
    yhteishyvitys          number(3);  -- normaalien koepisteiden lisaksi

    -- osallistumisia
    laskareita             boolean;
    harjoitustoita         boolean;
    kokeita                boolean;
    ylimkoe                boolean;
    -- määrät
    koe_lkm                number(3);
    ht_lkm                 number(3);
    lh_lkm                 number(3);

    arvos varchar(2);
    aindex number(2);
    koko_op number(4,1);
    koko_ov number(4,1);
    kieli varchar(2);
	
    ktiedot Kurssitiedot%rowtype;
  -- arvostelutapoja
    ht_korvaa_laskarit_abs boolean := false;
    ht_korvaa_laskarit_max boolean := false;
    koe_korvaa_laskarit_abs boolean := false;
    koe_korvaa_laskarit_max boolean := false;
    ht_korvaa_k_ja_l_max boolean := false;
    ht_korvaa_k_ja_l_abs boolean := false;
    skaalattu_korvaa_muut boolean := false;
    alasskaalattu_korvaa boolean := false;
    vaihtoehtoinen_puolikas boolean := false;
    viimeinen_koe_korvaa boolean := false;
    vaihtoehtoiset_kokeet boolean := false;
    vain_hyvaksytty boolean := false;
    puoliksi boolean := false;
    vaihtoehtoinen_pari boolean := false;
	kaksikoetta boolean :=false;

  function pistesumma(pistetaulukko char, eka integer, viimeinen integer, 
     alkiokoko integer) return integer is 
    -- lasketaan taulukon alkioiden [eka..viimeinen] summa
    -- palautetaan 0, jos alkiot kelvottomia tai tyhjiä
	
    i integer; 
    yht integer;
	begin
	  yht:=0;
      for i in eka..viimeinen loop
        apu:=alkio(pistetaulukko,alkiokoko,i);
        if apu>=0 and apu<100 then
          yht:= yht+apu;
        end if;
      end loop;
      return yht;
   end;	

   function parimaksimiensumma(pistetaulukko char, eka integer, viimeinen integer,
      alkiokoko integer, etaisyys integer) return integer is
      -- lasketaan taulukon alkioparien 
      -- [(eka, eka+etaisyys)..(viimeinen,viimeinen+etaisyys)]
      -- maksimiarvojen summa
    
      i integer;
      yht integer:=0;
      m1 integer;
      m2 integer;
	begin  
      for i in eka..viimeinen loop
         m1:=alkio(pistetaulukko,alkiokoko,i);
         m2:=alkio(pistetaulukko,alkiokoko,i+etaisyys);
         if (m1<0) or (m1>=100) then
            m1:=0;
         end if;
         if (m2<0) or (m2>=100) then 
            m2:=0;
         end if;
         yht:= yht + greatest(m1,m2);
      end loop;
      return yht;
    end;
	
	function ylirajan(pistetaulukko char, rajataulukko char, eka integer, vika integer, askelkoko integer)
       return integer is
   -- laskee montako arvoa pisteeulukon alkioissa [eka..vika] on suurempia 
   -- tai yhtäsuuria kuin vastaavat rajataulukon alkiot

      p integer :=0;
      raja integer :=0;
      lkm integer :=0;
	begin  
      for i in eka..vika loop
        p:= alkio(pistetaulukko,askelkoko,i);
        raja:= alkio(rajataulukko,askelkoko,i);
        if p>=raja then
           lkm:=lkm+1;
        end if;
      end loop;
      return lkm;
    end;
   
    function toinenylirajan(pistetaulukko char, rajataulukko char, eka integer, vika integer, 
      alkiokoko integer, etaisyys integer) return integer is
   -- laskee sellaisten pisteparien lukumäärän, joista toinen on isompi kuin rajataulukon arvo
   
      i integer;
      yht integer :=0;
      m1 integer :=0;
      m2 integer :=0;
	  r1 integer := 0;
	  r2 integer :=0;
      lkm integer :=0;
	begin  
      for i in eka..vika loop
         m1:=alkio(pistetaulukko,alkiokoko,i);
         r1:=alkio(rajataulukko,alkiokoko,i);
         m2:=alkio(pistetaulukko,alkiokoko,i+etaisyys);
         r2:=alkio(rajataulukko,alkiokoko,i+etaisyys);
         if m1>=r1 or m2>=r2 then
           lkm:=lkm+1;
         end if;
      end loop;
	  return lkm;
    end;
	
begin
    open kurssitiedot;
    fetch kurssitiedot into ktiedot;
    if kurssitiedot%notfound then
       close kurssitiedot;
       return -1;
    end if;

    if ktiedot.arvostellaanko='E' then
       vain_hyvaksytty:=true;
    end if;

    -- säännöt
    if ktiedot.laskentakaava=2 then
       ht_korvaa_laskarit_max := true;
       vaihtoehtoiset_kokeet:=false;
       kaksikoetta:=false;
    elsif ktiedot.laskentakaava=3 then
       ht_korvaa_laskarit_abs :=true;
       vaihtoehtoiset_kokeet:=false;
       kaksikoetta:=false;
    elsif ktiedot.laskentakaava=4 then
       koe_korvaa_laskarit_max:= true;
       vaihtoehtoiset_kokeet:=false;
       kaksikoetta:=false;
    elsif ktiedot.laskentakaava=5 then
       koe_korvaa_laskarit_abs:= true;
       vaihtoehtoiset_kokeet:=false;
       kaksikoetta:=false;
    elsif ktiedot.laskentakaava=6 then
       ht_korvaa_k_ja_l_max:= true;
       vaihtoehtoiset_kokeet:=false;
       kaksikoetta:=false;
    elsif ktiedot.laskentakaava=7 then
       ht_korvaa_k_ja_l_abs:= true;
       vaihtoehtoiset_kokeet:=false;
       kaksikoetta:=false;
    elsif ktiedot.laskentakaava=8 then
       skaalattu_korvaa_muut:=true;
       vaihtoehtoiset_kokeet:=false;
       kaksikoetta:=false;
    elsif ktiedot.laskentakaava=9 then
       alasskaalattu_korvaa:=true;
       vaihtoehtoiset_kokeet:=false;
       kaksikoetta:=false;
    elsif ktiedot.laskentakaava=10 then
       kaksikoetta:=false;
       puoliksi:= true;
       vaihtoehtoiset_kokeet := true;
    elsif ktiedot.laskentakaava=11 then
       kaksikoetta:=false;
       viimeinen_koe_korvaa:=true;
       vaihtoehtoiset_kokeet := true;
    elsif ktiedot.laskentakaava=12 then
       kaksikoetta:=true;
       puoliksi:= true;
       vaihtoehtoiset_kokeet:= true;
    elsif ktiedot.laskentakaava=13 then
       kaksikoetta:=true;
       viimeinen_koe_korvaa:=true;
       vaihtoehtoiset_kokeet := true;
    elsif ktiedot.laskentakaava=14 then
       kaksikoetta:=false;
       vaihtoehtoinen_pari:= true;
       vaihtoehtoiset_kokeet:= true;
    elsif ktiedot.laskentakaava=15 then
       kaksikoetta:=true;
       vaihtoehtoinen_pari:= true;
       vaihtoehtoiset_kokeet:= true;
    end if;
       
    -- selvitetään maksimipisteet
    if ktiedot.max_laskaripisteet is null then
       laskarimaksimi:=0;
    else
       laskarimaksimi:= ktiedot.max_laskaripisteet;
    end if;
    if ktiedot.harjoitustyopisteet is null then
        harjoitustyomaksimi:=0;
    else
        harjoitustyomaksimi:= ktiedot.harjoitustyopisteet;
    end if;

    koemaksimi:=0;
    if ktiedot.valikokeet_lkm is null then
       koe_lkm:=0;
    else
       koe_lkm:= ktiedot.valikokeet_lkm;
    end if;

    -- koemaksimi
    for i in 1..koe_lkm loop
       apu:=alkio(ktiedot.max_koepisteet,3,i);
       koemaksimi:= koemaksimi+apu;
    end loop;
    if vaihtoehtoiset_kokeet then
       koemaksimi:= koemaksimi / 2;
    end if;
    -- kokonaismaksimi
    if ht_korvaa_laskarit_abs or ht_korvaa_laskarit_max or
       koe_korvaa_laskarit_abs or koe_korvaa_laskarit_max then
       maksimipisteet:= koemaksimi+harjoitustyomaksimi;
    elsif ht_korvaa_k_ja_l_abs or ht_korvaa_k_ja_l_abs then
       maksimipisteet:=harjoitustyomaksimi;
    else
       maksimipisteet:= koemaksimi+harjoitustyomaksimi+laskarimaksimi;
    end if;
  
    -- opiskelijoiden läpikäynti
    for op in oppilas loop
  
     -- laskarisilmukka - lasketaan laskarihyvitys ja läsnaolot
       laskaripistesumma:=0;
       laskarilasnaoloja:=0;
       laskareita:=false;
       apu:=0;
       apu2:=0;
       if ktiedot.laskarikerta_lkm is null then
         lh_lkm:=0;
       else
         lh_lkm:= ktiedot.laskarikerta_lkm;
       end if;
       for i in 1..lh_lkm loop
          apu:= alkio(op.LASKARISUORITUKSET,3,i);
          if apu>=0 and apu<100 then
             laskareita:=true;
             laskaripistesumma:= laskaripistesumma+apu;
          end if;
          apu2:=alkio(ktiedot.HYVAKSYTTY_LASKARILASNAOLO,3,i);
          if apu>=apu2 then  
             laskarilasnaoloja:= laskarilasnaoloja+1;
          end if;
       end loop;
       if lh_lkm=0 or laskarimaksimi=0 then
          laskari_hyvitys:=0;
       else
          laskari_hyvitys:= asteikosta(ktiedot.LISAPISTERAJAT,4,
             laskarimaksimi,laskaripistesumma);
       end if;
        
    -- harjoitustyösilmukka - lasketaan harjoitustyohyvitys ja hyväksytyt työt
       harjoitustyopistesumma:=0;
       hyvaksytyt_tyot:=0;
       apu:=0;
       apu2:=0;
       harjoitustoita:=false;
       if ktiedot.harjoitustyo_lkm is null then
          ht_lkm:= 0;
       else
          ht_lkm:=ktiedot.harjoitustyo_lkm;
       end if;
       for i in 1..ht_lkm loop
          apu:=alkio(op.HARJOITUSTYOPISTEET,3,i);
          if apu>=0 and apu<100 then
             harjoitustoita:=true;
             harjoitustyopistesumma:= harjoitustyopistesumma+apu;
          end if;
          apu2:= alkio(ktiedot.MIN_HARJOITUSTYOPISTEET,3,i);
          if apu>=apu2 then
             hyvaksytyt_tyot:= hyvaksytyt_tyot+1;
          end if;
       end loop;
       if ht_lkm=0 or harjoitustyomaksimi=0 then
          harjoitustyo_hyvitys:= 0;
       else    
          harjoitustyo_hyvitys:= 
             asteikosta(ktiedot.HARJOITUSTYON_PISTERAJAT,4,
                 harjoitustyomaksimi,harjoitustyopistesumma);
       end if;

    -- koesilmukka - lasketaan koepisteiden summa, hyväksytyt koesuoritukset
    -- ja mahdollisen ylimääräisen kokeen hyvitys
       koepistesumma:=0;
       koesumma1:=0;
       koesumma2:=0;
       koesumma3:=0;
       koesumma4:=0;       
       -- koesummavertaa :=0;
       hyvaksytyt_kokeet:=0;
       koe_hyvitys:=0;
	   if regexp_instr(op.koepisteet,'\d')=0 then
  --     if instr(op.koepisteet,'??,??,??,??,??',1)=1 or instr(op.koepisteet,'  ,  ,  ,  ,  ',1)=1 then
         kokeita:=false;
         koepistesumma:=0;
         ylimkoe:=false;
        -- koehyvitys:=0;
       else
         kokeita:=true;
         if vaihtoehtoiset_kokeet then
           if kaksikoetta then
              if puoliksi then
                koesumma1:= pistesumma(op.koepisteet,1,koe_lkm/4,3);
                hyvkoe1:= ylirajan(op.koepisteet,ktiedot.min_koepisteet,1,koe_lkm/4,3);
                koesumma2:= pistesumma(op.koepisteet,koe_lkm/4+1,koe_lkm/2,3);
                hyvkoe2:= ylirajan(op.koepisteet,ktiedot.min_koepisteet,koe_lkm/4+1,koe_lkm/2,3);
                koesumma3:= pistesumma(op.koepisteet,koe_lkm/2+1,3*koe_lkm/4,3);
                hyvkoe3:= ylirajan(op.koepisteet,ktiedot.min_koepisteet,koe_lkm/2+1,3*koe_lkm/4,3);
                koesumma4:= pistesumma(op.koepisteet,3*koe_lkm/4+1,koe_lkm,3);
                hyvkoe4:= ylirajan(op.koepisteet,ktiedot.min_koepisteet,3*koe_lkm/4+1,koe_lkm,3);
                koepistesumma:= greatest(koesumma1,koesumma2) +
                   greatest(koesumma3, koesumma4);
                hyvaksytyt_kokeet:= greatest(hyvkoe1, hyvkoe2) + greatest(hyvkoe3,hyvkoe4);
              elsif viimeinen_koe_korvaa then
                koesumma1:= pistesumma(op.koepisteet,1,koe_lkm/2-1,3);
                hyvkoe1:= ylirajan(op.koepisteet,ktiedot.min_koepisteet,1,koe_lkm/2-1,3);
                koesumma2:= alkio(op.koepisteet,3,koe_lkm/2);
                if koesumma2>= alkio(ktiedot.min_koepisteet,3,koe_lkm/2) then
                   hyvkoe2:=koe_lkm/2-1;
                else
                   hyvkoe2:=0;
                end if;
                koesumma3:= pistesumma(op.koepisteet,koe_lkm/2+1,koe_lkm-1,3);
                hyvkoe3:= ylirajan(op.koepisteet,ktiedot.min_koepisteet,koe_lkm/2+1,koe_lkm-1,3);
                koesumma4:= alkio(op.koepisteet,3, koe_lkm);
                if koesumma4>=  alkio(ktiedot.min_koepisteet,3,koe_lkm) then
                   hyvkoe4:=koe_lkm/2-1;
                else
                   hyvkoe4:=0;
                end if;
                koepistesumma:= greatest(koesumma1,koesumma2) +
                   greatest(koesumma3, koesumma4);
                hyvaksytyt_kokeet:= greatest(hyvkoe1, hyvkoe2) + greatest(hyvkoe3,hyvkoe4);
              else
                -- joka tehtävällä korvaava pari
                koesumma1:= parimaksimiensumma(op.koepisteet,1,koe_lkm/4,3,koe_lkm/4);
                hyvkoe1:= toinenylirajan(op.koepisteet, ktiedot.min_koepisteet, 1,koe_lkm/4,3,koe_lkm/4);
                koesumma2:= parimaksimiensumma(op.koepisteet,koe_lkm/2+1,3*koe_lkm/4,3,koe_lkm/4);
                hyvkoe2:= toinenylirajan(op.koepisteet, ktiedot.min_koepisteet,koe_lkm/2+1,3*koe_lkm/4,3,koe_lkm/4);
                koepistesumma:= koesumma1+koesumma2;
                hyvaksytyt_kokeet:= hyvkoe1+hyvkoe2;
              end if;
           else
              -- on vain 'yksi' koe, jolla voi olla vaihtoehtoja
              if puoliksi then
                koesumma1:= pistesumma(op.koepisteet,1,koe_lkm/2,3);
                hyvkoe1:= ylirajan(op.koepisteet,ktiedot.min_koepisteet,1,koe_lkm/2,3);
                koesumma2:= pistesumma(op.koepisteet,koe_lkm/2+1,koe_lkm,3);       
                hyvkoe1:= ylirajan(op.koepisteet,ktiedot.min_koepisteet,koe_lkm/2+1,koe_lkm,3);   
                koepistesumma:= greatest(koesumma1,koesumma2);
                hyvaksytyt_kokeet:=greatest(hyvkoe1,hyvkoe2); 
              elsif viimeinen_koe_korvaa then
                koesumma1:= pistesumma(op.koepisteet,1,koe_lkm -1,3);
                hyvkoe1:= ylirajan(op.koepisteet,ktiedot.min_koepisteet,1,koe_lkm-1,3);
                koesumma2:= alkio(op.koepisteet,3,koe_lkm);
                if koesumma2>= alkio(ktiedot.min_koepisteet,3,koe_lkm) then
                   hyvkoe2:=koe_lkm-1;
                else
                   hyvkoe2:=0;
                end if;
                koepistesumma:= greatest(koesumma1, koesumma2);
                hyvaksytyt_kokeet:=greatest(hyvkoe1, hyvkoe2); 
              else
                -- jokainen tehtävä korvattavissa
                koepistesumma:= parimaksimiensumma(op.koepisteet,1,koe_lkm/2,3,koe_lkm/2);
                hyvaksytyt_kokeet:= toinenylirajan(op.koepisteet,ktiedot.min_koepisteet,1,koe_lkm/2,3,koe_lkm/2); 
              end if;
           end if;
         else
           -- ei vaihtoehtoja
           if koe_korvaa_laskarit_abs or koe_korvaa_laskarit_max then
              apu:=alkio(op.koepisteet,3,koe_lkm);
              koepistesumma:= pistesumma(op.koepisteet,1,koe_lkm-1,3);
              if apu>=0 and apu<100 then
                 koe_hyvitys:=apu;
              else
                 koe_hyvitys:=0;
              end if;
              ylimkoe:=true;     
           else
              ylimkoe:=false;
              koe_hyvitys:=0;     
              koepistesumma:= pistesumma(op.koepisteet,1,koe_lkm,3);
              hyvaksytyt_kokeet:= ylirajan(op.koepisteet, ktiedot.min_koepisteet,1,koe_lkm,3);
           end if;
         end if;
       end if;		 

       -- Kootaan yhteen kaikki hyvitykset

       if ht_korvaa_laskarit_abs then 
          if harjoitustoita then
             yhteishyvitys:= harjoitustyo_hyvitys;
          else
             yhteishyvitys:= laskari_hyvitys;
          end if;
       elsif ht_korvaa_k_ja_l_abs or ht_korvaa_k_ja_l_max then
          yhteishyvitys:= laskari_hyvitys;
       elsif ht_korvaa_laskarit_max then
          yhteishyvitys:= greatest(laskari_hyvitys,harjoitustyo_hyvitys);
       elsif koe_korvaa_laskarit_abs then
          if ylimkoe then
             yhteishyvitys:= koe_hyvitys;
          else
             yhteishyvitys:= laskari_hyvitys;
          end if;
       elsif koe_korvaa_laskarit_max then
          yhteishyvitys:= greatest(laskari_hyvitys,koe_hyvitys);
       else
          yhteishyvitys:= laskari_hyvitys+harjoitustyo_hyvitys;
       end if;
     
     -- asetetaan arvostelussa kaytettava pistemaara
     -- koesummavertaa := greatest(koepistesumma,koepistesumma2); 
       yhteispisteet := koepistesumma + yhteishyvitys;
       if alasskaalattu_korvaa then
          uudelleenskaalattu:= 
            round(koepistesumma*(koemaksimi-(harjoitustyomaksimi+laskarimaksimi))/koemaksimi);
          loppupisteet:= greatest(uudelleenskaalattu+yhteishyvitys,koepistesumma);  
       elsif skaalattu_korvaa_muut then
          uudelleenskaalattu:= round(koepistesumma*maksimipisteet/koemaksimi);
          loppupisteet:= greatest(yhteispisteet,uudelleenskaalattu);
       elsif ht_korvaa_k_ja_l_max then
          loppupisteet:= greatest(yhteispisteet,harjoitustyo_hyvitys);
       elsif ht_korvaa_k_ja_l_abs then
          if harjoitustoita then
             loppupisteet:= harjoitustyo_hyvitys;
          else
             loppupisteet:= yhteispisteet;
          end if;
       else
          loppupisteet:= yhteispisteet;     
       end if;
	   
	 --   lasketaan arvosana
	 
       if  not (laskareita or harjoitustoita or kokeita) then
           ARVOS:='-';
       elsif (hyvaksytyt_kokeet< ktiedot.pakolliset_koe_lkm)        or
           (laskarilasnaoloja< ktiedot.pakolliset_laskarikerta_lkm) or
           (hyvaksytyt_tyot<  ktiedot.pakolliset_harjoitustyo_lkm) or
           (laskaripistesumma< ktiedot.pakolliset_laskaritehtava_lkm)  or
           (koepistesumma< ktiedot.min_koepisteet_summa) or
           (harjoitustyopistesumma< ktiedot.min_harjoitustyopisteet_summa)  or
           (loppupisteet< ktiedot.min_yhteispisteet)     then
           ARVOS:='0';
       elsif vain_hyvaksytty then
           ARVOS:='+';
       else
           if ktiedot.arvosanarajat is null then
              ARVOS:='0';
           else
              aindex:= asteikosta(ktiedot.arvosanarajat,4,8,loppupisteet);
              if aindex=0 then
                 ARVOS:='0';
              elsif aindex=1 then
                 ARVOS:='1';
              elsif Aindex=2 then
                 ARVOS:='2';
              elsif Aindex=3 then
                 ARVOS:='3';
              elsif Aindex=4 then
                 ARVOS:='4';
              elsif Aindex=5 then
                 ARVOS:='5';
              else
                 ARVOS:='0';
              end if;
           end if;
       end if;
     -- tarkistetaan laajuus
     if op.laajuus_ov is null then
        koko_ov:=ktiedot.opintoviikot;
     else
        koko_ov:=op.laajuus_ov;
     end if; 
     if op.laajuus_op is null then
        if ktiedot.opintopisteet is null then
           koko_op:= 2*koko_ov;
        else
           koko_op:= ktiedot.opintopisteet;
        end if;
     else
        koko_op:= op.laajuus_op;
     end if;
	 -- asetetaan kielikoodi jos se puuttuu
	 if op.kielikoodi is null then
	    kieli:= ktiedot.kielikoodi;
	 else
        kieli:= op.kielikoodi ;
     end if;		
     -- vienti kantaan
     UPDATE osallistuminen
        set laskari_lasnaolo_lkm=  laskarilasnaoloja,
            laskarisuoritukset_summa= laskaripistesumma,
            harjoitustyo_lasnaolo_lkm= hyvaksytyt_tyot,
            harjoitustyo_summa=  harjoitustyopistesumma,
            laskarihyvitys=  laskari_hyvitys,
            harjoitustyohyvitys=  harjoitustyo_hyvitys,
            koepisteet_summa=  koepistesumma,
            yhteispisteet= loppupisteet,
            arvosana=   arvos,
            viimeinen_kasittely_pvm= sysdate,
            kypsyys_pvm = sysdate,
            tenttija= kuka,
            laajuus_ov=koko_ov,
            laajuus_op=koko_op,
			kielikoodi=kieli
        where current of oppilas;
    end loop;
    -- kurssitietojen päivitys
    update kurssi 
       set paivitys_PVM =sysdate,
           arvostelu_pvm =sysdate,
           arvostelija=kuka
    where current of Kurssitiedot;
   
    commit;
    return 0;
 exception 
    when others then
    rollback;
    return -1; 
 end;
   
  

   

   

  
         

  function asteikosta(asteikko char, alkiokoko integer, alkioita integer,
    haettava integer) return integer is
    -- Käydään läpi merkkijonotaulukko ja palautetaan sen alkion indeksi,
    -- jossa oleva arvo on ensi 
    viimeinen integer;
    osui boolean;
    i integer;
    vuorossa integer;
    tekstina varchar(12);
    arvo integer;

  begin
    viimeinen := ceil(length(asteikko)/alkiokoko);
    if alkioita <= viimeinen then
       viimeinen:= alkioita;
    end if;
    i:= (viimeinen-1)*alkiokoko+1;
    osui:= false;
    vuorossa:=viimeinen;
    while not osui loop
       if i<1 then
          osui:=true;
          vuorossa:=0;
       else
          tekstina:= substr(asteikko,i,alkiokoko-1);
          arvo:= to_number(tekstina);
          if haettava>= arvo then
             osui:=true;
          else
             vuorossa:=vuorossa-1;
             i:=i-alkiokoko;
          end if;
       end if;
    end loop;
    return vuorossa;
  exception
    when invalid_number then
       return -1;
    when others then 
       return -2;
  end;
    
 

  function alkio (teksti in char, alkiokoko in integer, i in integer) 
      return integer is
   -- palauttaa merkkijonotaulukosta indeksin i mukaisen alkion
   -- taulukossa alkio muodostuu arvosta ja yhden merkin pituisesta
   -- erottimesta. Alkiot ovat kiinteäpituisia. Alkiokoko antaa pituuden,
   -- jossa on mukana erotin
   -- - jos alkion arvo on välillä 0-99 se palautetaan sellaisenaan
   -- - jos arvo on '+'  palautetaan 100
   -- - jos arvo on tyhjä '  ' palautetaan -1
   -- - jos taulukossa ei ole indeksin osoittamaa alkiota palutetaan -2
   -- - jos taulukko on sekaisin palautetaan -3

   apu varchar(12);
   spaces varchar(12):=    '            ';
   unknown   varchar(12):= '????????????';
   arvo  integer;
 begin
   if teksti is null or i<1 or (i-1)*alkiokoko+1>length(teksti) then
      arvo:= -2;
   else  
      apu:=substr(teksti,(i-1)*alkiokoko +1,alkiokoko-1);
      if apu= substr(unknown,1,alkiokoko-1) or
         apu= substr(spaces,1,alkiokoko-1) then
         arvo:= -1;
      elsif ltrim(apu)='+' then
        arvo:= 100;
      else
        arvo:= to_number(apu);
      end if;
   end if;
   return arvo;
 exception
   when invalid_number then
        return -3;
   when others then
        return -3;
 end;
    

end arvostelu05;
/
show errors
exit

