create or replace function kurkiilmo (
   kkoodi in char, 
   lukuk  in char,
   lukuv  in number,
   tp     in char,
   knro   in number,
   inro   in number,
   htunnus in char) return varchar is

   rnro integer;

   cursor tarkista is
     select ryhma_nro 
     from osallistuminen 
     where hetu=htunnus and
        kurssikoodi= kkoodi and
        lukukausi=lukuk and
        lukuvuosi=lukuv and
        tyyppi=tp and
        kurssi_nro=knro and 
        voimassa in ('K', 'P', 'X');

   cursor hae_ryhma_nro is 
      select ryhma_nro  
        from opetus
        where ilmo_jnro = inro and
          kurssikoodi= kkoodi and
          lukukausi=lukuk and
          lukuvuosi=lukuv and
          tyyppi=tp and
          kurssi_nro=knro;
      
tulos varchar2(50):= 'ok';
apu integer;

begin
   open hae_ryhma_nro;
   fetch hae_ryhma_nro into rnro;
   close hae_ryhma_nro;
   open tarkista;
   fetch tarkista into apu;
   if tarkista%notFound then
      insert into osallistuminen (hetu, kurssikoodi, lukukausi, lukuvuosi,
           tyyppi, kurssi_nro, ilmo_jnro, ilmoittautumis_pvm,
           viimeinen_kasittely_pvm, voimassa, ryhma_nro)
         values (htunnus, kkoodi, lukuk, lukuv, tp, knro, 
           inro, sysdate, sysdate, 'K', rnro);
      update ilmolukumaarat 
        set lukumaara=lukumaara+1
        where  
           kurssikoodi= kkoodi and
           lukukausi=lukuk and
           lukuvuosi=lukuv and
           tyyppi=tp and
           kurssi_nro=knro and
           ryhma_nro= rnro;
      commit;
      tulos:= 'ok';
   else
      tulos:= 'virhe: opiskelija on jo ilmoittautunut kurssille.';
   end if;
   close tarkista;
   return tulos;

   exception
      when others then 
          return 'virhe: ' || sqlErrM;
          rollback;
end;
/
show errors
exit
