create or replace function palautaopiskelija
  (pkdi in varchar2,
   plv in number,
   plk in varchar2,
   ptpi in varchar2,
   pknr in number,
   prno in number,
   phetu in varchar2) return number is

   virhe boolean;
   syy number(2);

begin
   virhe:= false;
   syy:= 0;
   lock table osallistuminen in share update mode;
   update osallistuminen
   set voimassa='K'
   where
     kurssikoodi=pkdi and
     lukuvuosi=plv and
     lukukausi=plk and
     tyyppi=ptpi and
     kurssi_nro=pknr and
     ryhma_nro= prno and
     hetu= phetu and
     voimassa='P';

   if sql%rowcount<>1 then
       virhe:=true;
       syy:= 1;
   end if;

   if not virhe then
       commit;
--       if sql%notfound then
--         virhe:=true;
--         syy:= 3;
--       end if;
   else
      rollback;
   end if;

 return syy;
end;
/
show errors;
exit;
