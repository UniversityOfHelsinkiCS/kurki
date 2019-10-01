create or replace package arvostelu05 as

   function arvostele (
      kkoodi in char,
      lv in number,
      lk in char,
      tp in char,
      knro in number, 
      kuka in char) 
   return integer;

   function 

   function alkio (
      teksti in char,
      alkiokoko in integer,
      i integer) 
   return integer;

   function asteikosta (
      asteikko in char,
      alkiokoko in integer,
      alkioita in integer,
      haettava integer ) 
   return integer;

end arvostelu05;

/
show errors
exit

