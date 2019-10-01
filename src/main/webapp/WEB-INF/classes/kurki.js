function next(textObj, lbound, hbound) {
	var val= parseInt(textObj.value);
	var newVal;

	if (val == "") newVal= lbound;
	else if (val < hbound) newVal= val+1;
	else if (val >= hbound) newVal= hbound;

	textObj.value= ""+newVal;
}

function prev(textObj, lbound, hbound) {
	var val= parseInt(textObj.value);
	var newVal;

	if (val == "") newVal= hbound;
	else if (val > lbound) newVal= val-1;
	else if (val <= lbound) newVal= lbound;

	textObj.value= ""+newVal;
}

function htesti (kieli,hetu) {
    
    if (hetutest(hetu.value)) {
	return true;
    } else {
	alert('$bundle.getString("henktunVirheel")');
	hetu.select();
	hetu.focus();
	return false;
    }
}

function hetutest (hetu) {
    var a= hetu.toUpperCase();
    var nmb="0123456789";
    var oikea= "0123456789ABCDEFHJKLMNPRSTUVWXY";

    if (a=="")
	return true;

    if (a.length<7)
	return false;

    var sum=0;
    var tmm=0;
    var wm=0;

    if (a.charAt(0)=='X') {
	var k = new Array(7,3,1,7,3,1,7,3,1,7,3,1);
	var ho= a.substring(1,a.length-1);
	var pit= ho.length-1;
	for (var i=0; i <=pit ; i++) {
	    if ((ho.charAt(pit-i) < '0') || (ho.charAt(pit-i)>'9'))
		return false;
	    sum= sum +(k[i]* Number(ho.charAt(pit-i)));
	}
	var vika= sum % 10;
	if (vika==0)
	    tmm=0;
	else
	    tmm=10-vika;
	vm= Number(a.charAt(a.length-1));
	if (vm!=tmm)
	    return false;
	else
	    return true;
    }
    else {
	if (a.length<10)
	    return false;
	var b= a.charAt(6);
	if ((b=='-')||(b=='A'))
	    h= a.substring(0,6) + a.substring(7,a.length-1);
	else
	    h= a.substring(0,a.length-1);
	for (var j=0; j < h.length; j++) { 
	    if ((h.charAt(j) < '0') || (h.charAt(j)>'9'))
		return false;
	}
	var hn = Number(h);
	var tm= a.charAt(a.length-1);
	var m31= hn % 31;
	if (tm!=oikea.charAt(m31))
	    return false;
	else
	    return true;
    }
}

function clear(textfield){
  textfield.value = "";
  return true;
}

function isEmpty (textfield) {
    a=textfield.value;
    if (a=="") {
	return true;
    } else {
	return false;
    }
}

function isNonEmpty(textfield, name) {
    a=textfield.value;
    if (a=="") {
	alert('$bundle.getString("anna")+name+"!"');
	return false;
    }
    else 
	return true;
}

function isNumber(textField) {
    intValue= Number(textField.value); 
    if (isNaN(intValue)) {
	return false;
    } else {
	return true; 
    }
}
 
function isInRange(intValue, lower, upper) { 
    if (intValue < lower || intValue > upper) {
	return false;
    } else {
	return true; 
    }
} 
function isDate(textField) { 
    a=textField.value;
    dotpos1= a.indexOf(".");
    dotpos2= a.lastIndexOf(".");
    if (dotpos1>0 && dotpos1<3 && dotpos2==a.length-5 && dotpos2>=dotpos1+1) {
	d = a.substring(0,dotpos1);
	m = a.substring(dotpos1+1,dotpos2);
	y = a.substring(dotpos2+1,a.length);
	if (isInRange(y,1901,2099) && isInRange(m,1,12) && isInRange(d,1,31)) {
	    if ((m==4 || m==6 || m==9 || m==11) && d>30) {
		return false;
	    } else {
		if (m==2){ 
		    if (d>29) {
			return false;
		    } else { 
			if (d==29 && ((y/4)!=parseInt(y/4))) {
			    return false;
			} else {
			    return true;
			}
		    }
		} else {
		    return true;
		}
	    }
	}
	else {
	    return false;
	}
    } else {
	return false;
    }
}
 
function numcheck(textField) { 
    if (isNonEmpty(textField)) {
	if (isNumber(textField)) {
	    return true 
	}
	else {  
	    str = textField.value + '$bundle.getString("eiOleNumero")';  
	    alert(str);  
	    textField.select();  
	    textField.focus();  
	    return false;  
	} 
    } 
    return true 
} 
 
function rangecheck(textField, lower, upper) { 
    if (textField.value != "") {
	var str = '$bundle.getString("annaNumeroLukujen")'+lower+'$bundle.getString("valiJa")'+upper+'$bundle.getString("valilta")'+"\n"; 
	if (isNumber(textField)) { 
	    intValue = Number(textField.value); 
	    if (isInRange(intValue, lower, upper)) {
		return true 
	    }
	    else {
		alert(str); 
                textField.value = "";
		textField.select(); 
		textField.focus(); 
		return false; 
	    }
	}
	else {
	    alert(str);
            textField.value = "";
	    textField.select(); 
	    textField.focus(); 
	    return false;
	}
    }
    return true
}
 
function datecheck(textField) {
    if (!isEmpty(textField)) {

	if (isDate(textField)) {
	    return true;
	}
	else {
	    alert('$bundle.getString("annaKelvolPaivays")');
	    textField.select(); 
	    textField.focus(); 
	    return false;
	}
    }
    return true
}
 
function presencecheck(textField) {
    if (isNonEmpty(textField)) 
	return true;
    else {
	str= '$bundle.getString("kentta")'+textField.name+'$bundle.getString("onPakol")';
	alert(str);
	textField.select(); 
	textField.focus(); 
	return false;
    }
}

function listcheck( field, chars) {
    if (isEmpty(field)) {
        return true;
    }
    else {
       if (chars.indexOf(field.value)>-1){
           return true;
       }
       else {
           str= '$bundle.getString("kentta")' + field.name + '$bundle.getString("voisisaltaa")' + chars;
           alert(str);
           field.select();
           field.focus();
           return false;
       }
}
}

function checkScore( textField ) {
  textField.value = textField.value.toUpperCase();
  var strValue= trim(textField.value);
  var intValue= Number(strValue); 

  if (strValue == "") return true;

  strValue = strValue.replace("+", "p").replace("-", "m");

  var ps = eval("document.predefScores.ps"+strValue);

  if ( ps == null ) {
    if ( !isNaN(intValue) ) {
      if ( document.sdef != null && 
           rangecheck(textField, 0, Number(document.sdef.maxscoreold.value)) ) {
        return true;
      }
      else {
	textField.value = "";
        textField.select(); 
	textField.focus();
  	return false;
      }
    }
    else {
      textField.value = "";
      textField.select(); 
      textField.focus();
      return false;
    }
  } else {
    return true;
  }
}

function checkRadio(radio, textField) {
  var strValue= textField.value;
  strValue = trim(strValue); 
  textField.value = strValue;

  var intValue= Number(strValue); 


  if ( strValue == "" ) {
    radio[0].checked = true;
  }
  else {
    strValue = strValue.replace("+", "p").replace("-", "m");

    var ps = eval("document.predefScores.ps"+strValue);

    if (ps != null) {
      radio[ ps.value ].checked = true;
    }
    else if ( document.sdef != null && !isNaN(intValue) ) {
      var i = intValue + Number(document.predefScores.psSize.value);
      radio[i].checked = true;
    }
    else {
      alert('$bundle.getString("annetMerkkiEiOleTunnettu")');
    }
  } 
  return true;
}

function trim(str){
  return str.replace(/^\s+/,"").replace(/\s+$/,"");
// Ei toimi Konquerorilla: return str.replace(/^\s*|\s*$/g, "");
}

function oldScore(oldValue, textField, radio) {
  oldVal = oldValue.value;

  textField.value = oldVal;

  if (radio != null) {
    var intValue= Number(textField.value); 

    if ( oldVal == "" ) {
      radio[0].checked = true;
    }
    else {
      oldVal = oldVal.replace("+", "p").replace("-", "m");

      var ps = eval("document.predefScores.ps"+oldVal);
      if (ps != null) {
        radio[ps.value].checked = true;
      }
      else if ( document.sdef != null && !isNaN(intValue) ) {
        var i = intValue + Number(document.predefScores.psSize.value);
        radio[i].checked = true;
      }
      else {
        radio[0].checked = true;
      }
    }
  }
  return true;
}

function checkAndSubmitStudentFind(form) {
  var rv = true;
  var msg = "";
  var lname = trim(form.lname.value);
//  var fname = trim(form.fname.value);
  var idvalue = trim(form.idvalue.value);

  if (form.doSearch.selectedIndex == 2) {
    if ( lname == "" && idvalue == "" ) {
      rv = false;
      msg += '$bundle.getString("annetHakuPeruste")'+'\n';
    }
  }
  if (!rv) {
    form.doSearch.options[0].selected = true;
    alert(msg);
  }
  else {
    form.submit();
  }
}

function doEditRequest(sid) {
   document.doEditReq.sid.value = sid;
   document.doEditReq.submit();
}

function modifyCheck( newVal, oldVal, smod, imgName ) {
  if ( newVal != oldVal ) {
    document.images[imgName].src = "../images/modified.gif";
    if ( smod.value == 'n' ) {
      var mc= parseInt(document.modifyWatch.modCount.value);
      mc = mc + 1;
      document.modifyWatch.modCount.value = mc;
    }
    smod.value = 'y';
  }
  else {
    document.images[imgName].src = "../images/transparent25x25.gif";
    if ( smod.value == 'y' ) {
      var mc= parseInt(document.modifyWatch.modCount.value);
      mc = mc - 1;
      document.modifyWatch.modCount.value = mc;
    }
    smod.value = 'n';
  }
  return true;
}

function setValue( textField, newVal ) {
  textField.value = newVal;
  return true;
}

function isModified() {
  var isMod = document.modifyWatch.modCount.value > "0";
  if (isMod) {
    alert('$bundle.getString("TallenTaiPeru")');
  }
  return isMod;
}

function defreezeStudent( stid ) {
  if ( document.defreeze != null && document.defreeze.defreeze != null ) {
    document.defreeze.defreeze.value = ""+stid;
    document.defreeze.submit();
  }
}