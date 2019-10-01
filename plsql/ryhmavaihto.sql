create or replace function ryhmavaihto
  (puusi in number,
   pkdi in varchar2,
   plv in number,
   plk in varchar2,
   ptpi in varchar2,
   pknr in number,
   prno in number,
   phetu in varchar2,
   pkommentti in varchar2) return number is

   rrn number(4);
   virhe boolean;
   syy number(2);

   cursor rn is
     select ryhma_nro
     from opetus where
       kurssikoodi=pkdi and
       lukukausi=plk and
       lukuvuosi=plv and
       kurssi_nro=pknr and
       tyyppi=ptpi and
       ilmo_jnro=puusi;

begin
   open rn;
   virhe:= false;
   fetch rn into rrn;
   if rn%notfound then
      virhe:=true;
      syy:= -1;
   else
     syy:= rrn;
     lock table osallistuminen in share update mode;
     update osallistuminen
     set ryhma_nro= rrn,
         ilmo_jnro=Puusi,
         kommentti_1= pkommentti
     where
       kurssikoodi=pkdi and
       lukuvuosi=plv and
       lukukausi=plk and
       tyyppi=ptpi and
       kurssi_nro=pknr and
       ryhma_nro= prno and
       hetu= phetu and
       jaassa is null and
       voimassa='K';

     if sql%rowcount<>1 then
         virhe:=true;
         syy:= -2;
     end if;
   end if;

   if not virhe then
       lock table ilmolukumaarat in share update mode;
       update ilmolukumaarat
       set lukumaara=lukumaara-1
       where kurssikoodi=pkdi and
           lukuvuosi=plv and
           lukukausi=plk and
           tyyppi=ptpi and
           kurssi_nro=pknr and
           ryhma_nro= prno;
       if sql%rowcount<>1 then
          virhe:= true;
          syy:= -3;
       end if;
   end if;


   if not virhe then
       lock table ilmolukumaarat in share update mode;
       update ilmolukumaarat
       set lukumaara=lukumaara+1
       where kurssikoodi=pkdi and
        lukuvuosi=plv and
        lukukausi=plk and
        tyyppi=ptpi and
        kurssi_nro=pknr and
        ryhma_nro= rrn;
        if sql%rowcount<>1 then
           virhe:=true;
           syy:= -4;
        end if;
   end if;

   if not virhe then
       commit;
--       if sql%notfound then
--         virhe:=true;
--         syy:= -5;
--       end if;
   else
      rollback;
   end if;

 close rn;
 return syy;
end;
/
show errors;
exit;

