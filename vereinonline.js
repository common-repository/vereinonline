

//http://www.professorweb.de/javascript-ajax/iframe-hohe-an-dessen-inhalt-automatisch-anpassen-v2.html
function InitDatepicker(adminpath, showWeek)
{
   InitDatepickerField('.datepicker', adminpath, showWeek);
   //if (typeof jQuery('.datepicker').datepicker === "function") jQuery('.datepicker').datepicker({ width:100, constrainInput:false, yearRange:'-100:+5', changeMonth: true, changeYear: true, dateFormat: 'dd.mm.yy', monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ], firstDay: 1, dayNamesMin: [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ], showOn: 'button', buttonImage: adminpath+'/include/calendar/calendar.gif', buttonImageOnly: true, buttonText: 'Datum auswaehlen', showWeek:showWeek });
}

function InitDatepickerField(field, adminpath, showWeek)
{
   if (typeof jQuery(field).datepicker === "function")
      jQuery(field).datepicker({ width:100, constrainInput:false, yearRange:'-100:+5', changeMonth: true, changeYear: true, dateFormat: 'dd.mm.yy', monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ], firstDay: 1, dayNamesMin: [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ], showOn: 'button', buttonImage: adminpath+'/include/calendar/calendar.gif', buttonImageOnly: true, buttonText: 'Datum auswaehlen', showWeek:showWeek });
}

function OpenPopupWS(url, websvcdata)
{
   var data='inhalt1_html='+encodeURIComponent(jQuery('#inhalt1_html').val());
   data+='&inhalt1_style='+encodeURIComponent(jQuery('#inhalt1_style').val());
   data+='&inhalt1_type='+encodeURIComponent(jQuery('#inhalt1_type').val());
   jQuery.ajax({ type: 'POST', url: './?webservice=savepost&websvcdata='+websvcdata, data: data, success: function(result) 
   {
      OpenPopupBS('./'+url+'&websvcdata='+websvcdata+'&dialog=2',0,0,120);
   } });
}

function OpenPopup(url,x,y,border)
{
   return window.open(url,'','toolbar=no,location=no,directories=no,status=yes,scrollbars=yes,resizable=yes,copyhistory=no,width='+x+',height='+y);
}

function OpenDirectLink(url,caption,referer)
{
   if (referer!='') jQuery.ajax({ type: 'GET', url: './?webservice=savelink&cap='+encodeURIComponent(caption)+'&url='+encodeURIComponent(referer), success: function(result) { window.location.href=url; } });
   else window.location.href=url;
}

function ResetBreadcrumb()
{
   jQuery.ajax({ type: 'GET', url: './?webservice=resetbreadcrumb' });
}

//var layer0, layerpos;
function OpenPopupBS5(url,x,y,border)
{
   //layer0=jQuery('.maincontent').html();
   //layerpos=jQuery(window).scrollTop();
   //jQuery.ajax({ type: 'GET', url: url+'&dialog=1', success: function(result) 
   //{
   //   jQuery(window).scrollTop(0);
   //   jQuery('.maincontent').html(result);
   //} });
   //return;

   var myModal = new bootstrap.Modal(document.getElementById('modaldialog'), { keyboard: false });
   jQuery('#modaldialog .modal-body').css('height',(jQuery(window).height()-border)+'px');
   jQuery('#modaldialogIFrame').css('height','99%');
   jQuery('#modaldialog').modal('hide');
   jQuery('#modaldialogIFrame').attr('src',url);
   myModal.show();
   jQuery("#modaldialog").draggable({ handle: ".modal-header" });

   ResetDirty();
}

var handlerbshide=false;
function OpenPopupBS(url,x,y,border)
{
   if (isBD5) { OpenPopupBS5(url,x,y,border); return; }
   if (!handlerbshide) jQuery('#modaldialog').on('hidden.bs.modal', function () { jQuery('#modaldialogIFrame').attr('src',''); });
   handlerbshide=true;

   jQuery('.modal-body').css('height',(jQuery(window).height()-border)+'px');
   jQuery('#modaldialogIFrame').css('height','99%');
   jQuery('#modaldialog').modal('hide');
   jQuery('#modaldialogIFrame').attr('src',url);
   jQuery('#modaldialog').modal({ show:true, keyboard:true, backdrop:'static' });
   jQuery("#modaldialog").draggable({ handle: ".modal-header" });

   ResetDirty();
}

function CancelPopup()
{
   window.close();
   if (!window.closed) alert("Skripte koennen keine Fenster schliessen, die nicht von ihnen geoeffnet wurden.");
}

function CancelPopupBS()
{
   window.parent.closeModal();
}

//function CancelPopupBS5()
//{
//   jQuery('.maincontent').html(layer0);
//   jQuery(window).scrollTop(layerpos);
//}

function CloseModalX()
{
   if (typeof CheckChanged==='function') if (!CheckChanged()) return;
   CancelPopupBS();
}

function ShowHide(element,show)
{
   if (show) jQuery(element).show(); else jQuery(element).hide();
}

function ShowLightboxSubmit()
{
   setTimeout(function(){ ShowLightBox(); }, 500);
}

var chirodokudrop='';
function Form1Submit()
{
   ResetDirty();
   ShowLightboxSubmit();
   if (chirodokudrop=='') DirectForm1Submit(); else DropZoneSubmit(chirodokudrop,DirectForm1Submit);
}

function DirectForm1Submit()
{
   if (jQuery('.signaturepadcanvas').length>0) PadSave();
   var frm1=document.getElementById('form1');
   if (frm1) frm1.submit();
   SetForm1Value('print','');
}


var klicks=0;
function FormSubmitOnce(form)
{
   klicks++;
   if (klicks>1) return;
   ShowLightboxSubmit();
   DirectFormSubmit(form);
}

function FormSubmit(form)
{
   ShowLightboxSubmit();
   DirectFormSubmit(form);
}

function DirectFormSubmit(form)
{
   if (jQuery('.signaturepadcanvas').length>0) PadSave();
   var frm1=document.getElementById(form);
   if (frm1) frm1.submit();
}

function SetAll()
{
   var frm1=document.getElementById('form1');
   var alle=false;
   for(i=0; i<frm1.elements.length; i++) { if (frm1.elements[i].name.substring(0,6)=="check_" && !frm1.elements[i].disabled && frm1.elements[i].checked==false) alle=true; }
   SetAlleForm('form1', alle, '');
}

function SetAlle(alle)
{
   SetAlleForm('form1', alle, '');
}

function SetAlleForm(form, alle, prefix, onlyvisible=true)
{
   jQuery.each( jQuery("input[name^='nachname']"+(onlyvisible?":visible":"")), function(key, value) { if (jQuery(this).attr('name')!='nachname') { var leer=jQuery(this).val().trim()==''; jQuery(this).css('background-color',leer?'#FFA0A0':''); if (leer) fehler++; } });
   jQuery('#'+form+' input[type=checkbox]'+(prefix==''?'':'[name^='+prefix+']')).each(function(index, value) { if (!jQuery(this).prop("disabled")) if (!onlyvisible || jQuery(this).is(':visible') || !alle) jQuery(this).prop('checked',alle); });
   SetAlleListCount();
}

function SetAlleTeam()
{
   var frm1=document.getElementById('form1');
   var alle=false;
   for(i=0; i<frm1.elements.length; i++) { if (frm1.elements[i].name.substring(0,6)=="kalusr" && !frm1.elements[i].disabled) if (!frm1.elements[i].checked) alle=true; }
   for(i=0; i<frm1.elements.length; i++) { if (frm1.elements[i].name.substring(0,6)=="kalusr" && !frm1.elements[i].disabled) frm1.elements[i].checked=alle; }
   Form1Submit();
}

function SetAlleListCount()
{
   var z=jQuery('.selectedrow:checked').length;
   jQuery('#selectedcount').html(z==0?'':z+' / ');
}

function SetAllBezahlt(bezahlt)
{
   var frm1=document.getElementById('form1');
   for(i=0; i<frm1.elements.length; i++) { if (frm1.elements[i].name.substring(0,6)=="check_") if (document.getElementById("bezahlt_"+frm1.elements[i].name.substring(6)).value==bezahlt) frm1.elements[i].checked=true; }
}

function GetForm1()
{
   return document.getElementById('form1');
}

function GetForm1Element(key)
{
   var frm1=document.getElementById('form1');
   return frm1.elements[key];
}

function GetFormElement(form, key)
{
   var frm1=document.getElementById(form);
   return frm1.elements[key];
}

function SetFormValue(form, key, value)
{
   var frm1=document.getElementById(form);
   var el=frm1.elements[key];
   if (el) el.value=value;
}

function SetForm1Value(key, value)
{
   SetFormValue('form1',key,value);
}

function GetFormValue(form, key)
{
   var frm1=document.getElementById(form);
   var elem=frm1.elements[key];
   if (elem) return elem.value;
}

function GetForm1Value(key)
{
   return GetFormValue('form1',key);
}

function CountSelected()
{
   var frm1=document.getElementById('form1');
   var cnt=0;
   for(i=0; i<frm1.elements.length; i++) if (frm1.elements[i].name.substring(0,6)=="check_") if (frm1.elements[i].checked) cnt++;
   return cnt;
}

function FormCountSelected(form)
{
   var frm1=document.getElementById(form);
   var cnt=0;
   for(i=0; i<frm1.elements.length; i++) if (frm1.elements[i].name.substring(0,6)=="check_") if (frm1.elements[i].checked) cnt++;
   return cnt;
}

function AddAll(field)
{
   var txt=prompt('Wert fuer alle Zeilen (- ist loeschen)');
   if (txt=='') return;
   var frm1=document.getElementById('form1');
   for(i=0; i<frm1.elements.length; i++)
   {
      if (frm1.elements[i].name.substring(0,field.length)==field && (field=='user_' || jQuery('#user_'+frm1.elements[i].name.substring(field.length)).val()!=''))
         frm1.elements[i].value=txt=='-'?'':txt;
   }
}

function GetIDs()
{
   var id='';
   var frm1=document.getElementById('form1');
   for(i=0; i<frm1.elements.length; i++)
      if (frm1.elements[i].name.substring(0,6)=='check_') 
         if (frm1.elements[i].checked)
            id=id+','+frm1.elements[i].name.substring(6);
   return id.substring(1);
}

function GetIDArray()
{
   var ids=[];
   var frm1=document.getElementById('form1');
   for(i=0; i<frm1.elements.length; i++)
      if (frm1.elements[i].name.substring(0,6)=='check_') 
         if (frm1.elements[i].checked)
            ids.push(frm1.elements[i].name.substring(6));
   return ids;
}

function SelectionToggle(chkbox, div, mandant)
{
   var isselected=chkbox.prop('checked');
   jQuery('#'+div+mandant).toggle();
   if (!isselected) LeereFilter('#'+div+mandant);
   if (isselected && (div=='divRollen' || div=='divGruppen')) jQuery('#alle').prop('checked', false);
}

function AlleMitgliederKontakte(form, mandant)
{
   var checked=jQuery('#alle').prop('checked') || jQuery('#chkVerein').prop('checked');
   if (checked==undefined) checked=false;
   if (checked)
   {
      LeereFilter('#divRollen'+mandant);
      //LeereFilter('#divGruppen'+mandant);
      //LeereFilter('#divMembers'+mandant);
      jQuery('#chkRollen'+mandant).prop('checked', false); jQuery('#divRollen'+mandant).hide();
      //jQuery('#chkGruppen'+mandant).prop('checked', false); jQuery('#divGruppen'+mandant).hide();
      //jQuery('#chkMembers'+mandant).prop('checked', false); jQuery('#divMembers'+mandant).hide();
   }
   //jQuery('#chkRollen'+mandant).prop('disabled', checked);
   //jQuery('#chkGruppen'+mandant).prop('disabled', checked);
   //jQuery('#chkMembers'+mandant).prop('disabled', checked);
}

function RGMitgliederKontakte(el,form)
{
   //if (el) jQuery('#alle').prop('checked',false);
}

function LeereFilter(div)
{
   jQuery(div+' input:checkbox').prop('checked', false);
   jQuery(div+' input:text').val('');
   jQuery(div+' input:hidden').val('');
   jQuery(div+' .vapicker').val('');
   jQuery(div+' textarea').val('');
   if (div.substr(0,11)!='#divGruppen') jQuery(div+' select').val(''); else jQuery(div+' select').val('1');
}

function SubSelect(div, mandant)
{
   var e=document.getElementById(div+mandant);
   var isselected=document.getElementById('verein'+mandant).checked;
   var frm1=document.getElementById('form1');
   if (!frm1) frm1=document.getElementById('form2');
   if (frm1 && div=='divSubVerein') for(var i=0; i<frm1.elements.length; i++) if (frm1.elements[i].name.substring(0,7+mandant.length)=='verein'+mandant+'-') frm1.elements[i].checked=isselected;
}

function CheckRequired(paymentBE,saalplananz,msgstart,firma,anrede,name,strasse,ort,email,kontoinhaber,bank,ibanbic,oder,kontoblz,invalidiban,adresseoptional=1)
{
   if (jQuery('#zubuchen').length>0) { if (!jQuery('#zubuchen').prop('checked')) return ''; }
   var msg='';
   if (adresseoptional==1 && FieldExists('rechnungfirma') && FieldExists('rechnungvollername_nachname'))
   {
      if (FieldIsEmpty('rechnungfirma') && FieldIsEmpty('rechnungvollername_nachname')) msg+='\n- '+firma;
      if (FieldIsEmpty('rechnungvollername_anrede') && !FieldIsEmpty('rechnungvollername_nachname')) msg+='\n- '+anrede;
   }
   else
   {
      if (FieldIsEmpty('rechnungvollername_anrede') && !FieldIsEmpty('rechnungvollername_nachname')) msg+='\n- '+anrede;
      if (FieldIsEmpty('rechnungvollername_nachname')) msg+='\n- '+name;
   }
   if (adresseoptional==1 && FieldIsEmpty('rechnungstrasse')) msg+='\n- '+strasse;
   if (adresseoptional==1 && FieldIsEmpty('rechnungadresse_ort')) msg+='\n- '+ort;
   if (adresseoptional==1 && (FieldIsEmpty('rechnungemail') || !isEmailAddress(jQuery('#rechnungemail').val()))) msg+='\n- '+email;
   if (paymentBE!='no')
   {
      if (jQuery('#buchungBezahlart1').prop('checked'))
      {
         if (FieldIsEmpty('konto_inhaber')) msg+='\n- '+kontoinhaber;
         if (FieldIsEmpty('bank')) msg+='\n- '+bank;
         if (paymentBE=='' || paymentBE=='sepa') if (FieldIsEmpty('konto_iban') || FieldIsEmpty('konto_bic')) msg+='\n- '+ibanbic;
         if (jQuery('#konto_ibanlabel').is(":visible") && jQuery('#konto_ibanlabel').html().length>5) msg+='\n- '+invalidiban;
      }
   }
   if (jQuery('input[name="buchungBezahlart"]').attr('type')=='radio') if (jQuery('input[name="buchungBezahlart"]:checked').val()==undefined) msg+='\n- Bezahlart';
   if (saalplananz>0) if (!CheckSaalPersonen(saalplananz)) msg+='\n- Bitte waehlen Sie die korrekte Anzahl Saalplaetze aus';
   if (msg!='') msg=msgstart+':'+msg;
   return msg;
}

function CheckIBANValid()
{
   if (jQuery('#konto_ibanlabel').is(":visible") && jQuery('#konto_ibanlabel').html().length>5) return false;
   return true;
}

function FieldIsEmpty(field)
{
   if (jQuery('#'+field).length>0) return jQuery('#'+field).val()=='';
   var multi=jQuery("input[name='"+field+"[]']");
   if (multi.length==0) return false; // Feld nicht vorhanden
   var empty=true;
   jQuery.each( multi, function(key, value) { if (jQuery(this).prop('checked')) empty=false; });
   return empty;
}

function FieldExists(field)
{
   return jQuery('#'+field).length>0;
}

function isEmailAddress(email)
{
   if (email=='') return false;
   if (email=='(intern)') return true;
   if (email==undefined) return true;
   var pattern = /^(.*)@(.*)\.(.*)$/;
   return email.match(pattern);    
}

function InWarenkorb(id, check)
{
   if (GetFormValue('form2','artikel'+id)=='') SetFormValue('form2','artikel'+id,'1'); 
   var msg;
   if (check) msg=CheckAnzahl(0,id); else msg='';
   if (msg!='')
      alert(msg.substr(1)); 
   else
      FormSubmit('form2'); 
}

function CheckAnzahl(checkAnzahl,warenkorbid)
{
   var anz=0; var msg='';
   var frm2=document.getElementById('form2');
   for(i=0; i<frm2.elements.length; i++)
   {
      if (frm2.elements[i].name.substring(0,7)=='artikel')
      {
         var z=parseInt(frm2.elements[i].value);
         var id=frm2.elements[i].name.substring(7);
         var sub=document.getElementById('auswahl'+id);
         var el;
         var mx;

         if (sub)
            el=document.getElementById('maximal'+sub.value);
         else
            el=document.getElementById('maximal'+id);
         if (el) mx=parseInt(el.value); else mx=100000;
         anz+=z;
         if (z>mx) msg=msg+'\nNur noch '+mx+' Stueck verfuegbar';

         //if (sub)
         //   el=document.getElementById('minanzahl'+sub.value);
         //else
         //   el=document.getElementById('minanzahl'+id);
         //if (el) mx=parseInt(el.value); else mx=0;
         //if (z<mx) msg=msg+'\nMinimale Bestellmenge: '+mx+' Stueck';

         //if (sub)
         //   el=document.getElementById('maxanzahl'+sub.value);
         //else
         //   el=document.getElementById('maxanzahl'+id);
         //if (el) mx=parseInt(el.value); else mx=100000;
         //if (z>mx) msg=msg+'\nMaximale Bestellmenge: '+mx+' Stueck';

         if (z>0 || id==warenkorbid)
         {
            for(ii=0; ii<frm2.elements.length; ii++)
            {
               if (frm2.elements[ii].name.substring(0,17+id.length)=='pflichtattribut_'+id+'_')
               {
                  var idfeld=frm2.elements[ii].name.substring(16);
                  if (jQuery('#artikelattribut_'+idfeld).val()=='') msg=msg+'\nBitte Artikel-Detail "'+frm2.elements[ii].value+'" auswaehlen';
               }
            }
         }
      }
   }
   if (checkAnzahl==1 && anz==0) msg=msg+'\nBitte tragen Sie die gewuenschte Anzahl ein.';
   return msg;
}

function OpenDirect(extra,template,dialog)
{
   if (extra==3 && template>10000) { var o=prompt('Start bei Etikett Nummer','1'); if (''+o=='null') return; SetForm1Value('adressoffset',o); }
   SetForm1Value('extra',extra);
   SetForm1Value('template',template);
   SetForm1Value('dialog',dialog);
   GetForm1().target='';
   if (extra==0) ShowLightboxSubmit();
   DropZoneSubmit('attachments',DirectForm1Submit);
}

function ResetOpen()
{
   SetForm1Value('extra','');
   SetForm1Value('template','');
   SetForm1Value('dialog','0');
   GetForm1().target='';
}

function OpenNewWindow(extra,template)
{
   DropZoneSubmit('attachments', function() { OpenNewWindowNow(extra,template); });
}

function OpenNewWindowNow(extra,template)
{
   if (extra>=0) SetForm1Value('extra',extra);
   if (template>=0) SetForm1Value('template',template);
   SetForm1Value('dialog','1');
   GetForm1().target='PopupWnd';
   var size='width=1200,height=900';
   if (extra==1 || extra==2) size='width=800,height=800';
   if (extra==1000) size='width=1000,height=1000';
   window.open('about:blank', 'PopupWnd', 'toolbar=no,location=no,directories=no,status=yes,scrollbars=yes,resizable=yes,copyhistory=no,'+size);
   window.setTimeout("window.document.forms['form1'].submit();", 1);
}

function ShowLightBox()
{
   var el;
   el=document.getElementById('light'); if (el) el.style.display='block';
   el=document.getElementById('fade'); if (el) el.style.display='block';
}

function ShowLightBoxParent()
{
   jQuery('<div id=\"fadebody\" class=\"lightboxbackground\"></div>').prependTo('body');
   jQuery('#fadebody').css('display','block');
}

function CloseLightBox()
{
   var el;
   el=document.getElementById('light'); if (el) el.style.display='none';
   el=document.getElementById('fade'); if (el) el.style.display='none';
}

function CancelLightBox()
{
   CloseLightBox();
   window.stop();
}

function ShowAndere(el, name, tag)
{
   if (el.value==tag)
   {
      jQuery('#'+name).hide();
      jQuery('#'+name+'id').show();
   }
   else
   {
      jQuery('#'+name+'id').hide();
      jQuery('#'+name+'etc').val('');
   }
}

function HideAndere(name)
{
   jQuery('#'+name).show();
   jQuery('#'+name+'id').hide();
   jQuery('#'+name+'etc').val('');
   if (name.substr(0,3)=='div') jQuery('#'+name.substr(3)).val(''); else jQuery('#'+name).val('');
}

function ShowAndereOption(el, name)
{
   if (el.value=='#')
   {
      jQuery('#'+name+'id').show();
   }
   else
   {
      jQuery('#'+name+'id').hide();
      jQuery('#'+name+'etc').val('');
   }
}

function OpenBox(boxnr)
{
   var el=document.getElementById('box'+boxnr);
   if (el.style.display=='none') el.style.display=''; else el.style.display='none';
}

function Form1SubmitIfCount(typ,cmd)
{
   if (CountSelected()==0)
      alert('Bitte erst '+typ+' markieren');
   else
      Form1SubmitCount(typ,cmd);
}

function Form1SubmitCount(typ,cmd)
{
   SetForm1Value('cmd',cmd);
   DirectForm1Submit();
}

function Form1SubmitIfSelected(typ,cmd,msg)
{
   if (CountSelected()==0)
      alert('Bitte erst '+typ+' markieren');
   else
      Form1SubmitSelected(typ,cmd,msg);
}

function Form1SubmitAll(typ,cmd,msg)
{
   if (confirm(typ+' jetzt wirklich '+msg+'?')) { if (cmd!='') SetForm1Value('cmd',cmd); Form1Submit(); }
}

function Form1SubmitSelected(typ,cmd,msg)
{
   if (confirm('Markierte '+typ+' jetzt wirklich '+msg+'?')) { if (cmd!='') SetForm1Value('cmd',cmd); Form1Submit(); }
}

function FormSubmitIfSelected(form,typ,cmd,msg)
{
   if (FormCountSelected(form)==0) { alert('Bitte erst '+typ+' markieren'); return; }
   if (confirm('Markierte '+typ+' jetzt wirklich '+msg+'?')) { SetFormValue(form,'cmd',cmd); FormSubmit(form); }
}

function PromptAndSubmit()
{
   if (CountSelected()==0) { alert('Bitte erst Buchungen markieren'); return; }
   var txt=prompt('Kontoauszug');
   if (txt=='') { alert('Eingabe eines Kontoauszuges ist notwenig!'); return; }
   if (txt==null) return;
   SetForm1Value('kontoauszug',txt);
   SetForm1Value('cmd','setzebezahltkontoauszug');
   Form1Submit();
}

function GetBanknameBICbyBLZ(blz, bank, bic)
{
   if (blz.value=='') return;
   var elBank=document.getElementById(bank);
   var elBic=document.getElementById(bic);
   jQuery.ajax({ type: 'GET', url: './?webservice=blz&blz='+blz.value, success: function(result) 
   {
      if (result=='') return;
      var data=result.split('\n');
      if (elBank)
      {
         if (elBank.value!='' && elBank.value!=data[1]) if (!confirm(elBank.value+' ueberschreiben mit '+data[1]+'?')) return;
         elBank.value=data[1];
      }
      if (elBic)
      {
         if (elBic.value!='' && elBic.value!=data[0]) if (!confirm(elBic.value+' ueberschreiben mit '+data[0]+'?')) return;
         elBic.value=data[0];
      }
      jQuery('#dataUrl').val(data[2]);
      jQuery('#dataHBCI').val(data[3]=='300'?'':data[3]);
   } });
}

function GetBanknameBICbyIBAN(iban, bank, bic, kontonummer, bankleitzahl, label)
{
   jQuery('#'+label).hide(); 
   if (iban.value=='') return;
   var ibanWert=iban.value.replace(/ /g,'');
   var blz=ibanWert.substr(4,8);
   var land=ibanWert.substr(0,2).toUpperCase();
   if (land!='DE') blz='';
   var elBank=document.getElementById(bank);
   var elBic=document.getElementById(bic);
   var elKto=document.getElementById(kontonummer);
   var elBlz=document.getElementById(bankleitzahl);
   var elLbl=document.getElementById(label);
   jQuery.ajax({ type: 'GET', url: '?webservice=iban&iban='+ibanWert, success: function(result) 
   {
      if (result=='') return;
      var data=result.split('\n');
      var ok=data[0]=='';
      if (elLbl)
      {
         if (!ok) { jQuery('#'+label).html(data[0]); jQuery('#'+label).show(); }
      }
      if (elBank && ok)
      {
         //if (elBank.value!='' && elBank.value!=data[2]) if (!confirm(elBank.value+' ueberschreiben mit '+data[2]+'?')) return;
         elBank.value=data[2];
      }
      if (elBic && ok)
      {
         //if (elBic.value!='' && elBic.value!=data[1]) if (!confirm(elBic.value+' ueberschreiben mit '+data[1]+'?')) return;
         elBic.value=data[1];
      }
      if (ok)
      {
         if (elBlz) elBlz.value=blz;
         if (elKto) if (land=='DE') { var k=ibanWert.substr(12); while (k.substr(0,1)=='0') k=k.substr(1); elKto.value=k; } else elKto.value='';
         jQuery('#dataUrl').val(data[3]);
      }
   } });
}

function GetOrtByPLZ(plz, ort)
{
   if (plz.value=='') return;

   var bl=jQuery('#key_'+ort.substr(0,2)+'bundesland'); 

   jQuery('#'+ort).prop('disabled',true).css('background-color','#f8f8f8');
   jQuery('#'+ort).autocomplete({
    source: function(request, response)
            {
               jQuery.ajax(
               {
                  url: '?webservice=plzmulti', 
                  dataType: 'json', data: { plz:plz.value, bundesland:bl.length }, 
                  success: function( data )
                  {
                     if (data.length==1 && jQuery('#'+ort).val()=='')
                     {
                        var wrt=data[0];
                        if (bl.length>0 && wrt.indexOf(' @')>0) { bl.val(wrt.substr(wrt.indexOf(' @')+2)); wrt=wrt.substr(0, wrt.indexOf(' @')); }
                        jQuery('#'+ort).val(wrt);
                     }
                     //else if (data.length==0)
                     //   alert('PLZ nicht gefunden');
                     else
                        response(data);
                     jQuery('#'+ort).prop('disabled',false).css('background-color','');
                     jQuery('#'+ort).focus();
                  } 
               });
            },
    select: function( event, ui )
    {
       var wrt=ui.item.value;
       if (bl.length>0 && wrt.indexOf(' @')>0) { bl.val(wrt.substr(wrt.indexOf(' @')+2)); wrt=wrt.substr(0, wrt.indexOf(' @')); }
       jQuery('#'+ort).val(wrt);
       jQuery('#'+ort).autocomplete('close');
       jQuery('#'+ort).prop('disabled',false).css('background-color','');
       jQuery('#'+ort).focus();
       event.preventDefault();
    },
    minLength: 0
   });
   jQuery('#'+ort).autocomplete('search', '');
}

function GetFirmaByID(id)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=firma&id='+id, success: function(result)
   {
      if (result=='') return;
      var el=document.getElementById("firma");
      el.value=result;
   } });
}

function CheckNames(field)
{
   var el=document.getElementById(field);
   if (el.value=='') return;
   jQuery.ajax({ type: 'POST', url: './?webservice=name', data: 'wert='+encodeURIComponent(el.value), success: function(result)
   {
      el.value=result;
   } });
}

var calendars=[];
function InitCalendar(feld)
{
   calendars[feld] = new CalendarPopup(feld+'calendardiv');
   calendars[feld].setMonthNames('Januar','Februar','Maerz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember');
   calendars[feld].setDayHeaders('S','M','D','M','D','F','S');
   calendars[feld].setWeekStartDay(1);
   calendars[feld].setTodayText('Heute');
}
function SetCalendar(feld)
{
   calendars[feld].select(document.getElementById(feld), feld+'anchor', 'dd.MM.yyyy');
}

function OpenKontoPicker(name,filter)
{
   window.open('?action=kasse_kontopicker&field='+name+'&value='+encodeURIComponent(document.getElementById(name).value)+'&filter='+encodeURIComponent(filter)+'&dialog=1','','toolbar=no,location=no,directories=no,status=yes,scrollbars=yes,resizable=yes,copyhistory=no,width=500,height=1000');
}

function OpenKreditorPicker(name)
{
   window.open('?action=kasse_kreditorpicker&field='+name+'&kreditor='+encodeURIComponent(document.getElementById(name).value)+'&dialog=1','','toolbar=no,location=no,directories=no,status=yes,scrollbars=yes,resizable=yes,copyhistory=no,width=600,height=350');
}

function SyncSelect(src, dst)
{
   document.getElementById(dst).selectedIndex=document.getElementById(src).selectedIndex;
}

function DeleteZuordnung(form, id)
{
   if (!confirm('Zuordnung wirklich loeschen?')) return;
   SetFormValue(form,'action','kasse_deletezuordnung');
   SetFormValue(form,'deleteid',id);
   FormSubmit(form);
}

function SetMasterValue(checkbox,field,mastervalue,ownvalue)
{
   var el=document.getElementById(field);
   if (checkbox.checked)
   {
      el.value=mastervalue;
      el.readOnly=true;
   }
   else
   {
      el.value=ownvalue;
      el.readOnly=false;
   }
}

function Bankeinzug(form, action)
{
   if (FormCountSelected(form)>0) { SetFormValue(form, 'action','kasse_'+action); DirectFormSubmit(form); } else alert('Bitte erst Eintraege markieren!');
}

function HBCITransaktion(form)
{
   if (FormCountSelected(form)>0) { SetFormValue(form, 'action','kasse_hbciv2sepa'); SetFormValue(form, 'cmd',''); FormSubmit(form); } else alert('Bitte mindestens einen Eintrag markieren!');
}

function RadioGroupSelect(name,nr)
{
   jQuery('.row_'+name).hide();
   jQuery('.row_'+name+nr).show();
}

function Serientermin()
{
   if (document.getElementById('serien').style.display=='')
   {
      jQuery('#serien INPUT, #serien SELECT').val('');
      document.getElementById('serien').style.display='none';
   }
   else
      document.getElementById('serien').style.display='';
}

function InplaceEdit(nr, querystring, tag1, tag2)
{
   var cap=tag1=='sv'?'aktueller Bestand (Inventur)':'Neuer Wert';
   var wrt=document.getElementById('inplacevalue'+nr).innerHTML;
   if (wrt=='ausverkauft') wrt='0'; else if (wrt.substr(0,13)=='ausverkauft (') wrt=wrt.substr(13,wrt.length-14);
   var txt=prompt(cap,wrt);
   if (txt==null) return;
   jQuery('#inplacevalue'+nr).html(txt);
   if (tag1=='cn') if (txt=='') jQuery('#inplacevalue'+nr).parent().removeClass('chironotiz'); else jQuery('#inplacevalue'+nr).parent().addClass('chironotiz');
   if (tag1=='sv') { var w=(parseInt(txt)+parseInt(tag2)); jQuery('#inplacevalue'+nr).parent().prev().prev().prev().prev().html(w); }
   InplaceCall(querystring, txt);
}

function InplaceCall(querystring, txt)
{
   jQuery.ajax({ type: 'POST', url: './?webservice=update', data: 'tag='+encodeURIComponent(querystring)+"&wert="+encodeURIComponent(txt) });
}

function Toggle(id)
{
   var el=document.getElementById(id);
   if (el) { if (el.style.display=='none') el.style.display=''; else el.style.display='none'; }
}

var oldYear=true;
function EnhanceAndVerifyDatum(fld)
{
   var d = new Date();
   var m = d.getMonth()+1; if (m<10) m='0'+m;
   var y = d.getFullYear(); 
   if (fld.value.indexOf('.')>=0)
   {
      var datum=fld.value.split('.',3);
      if (datum[0]=='' || datum[0]==undefined) { return; }
      if (datum[0].length==1) datum[0]='0'+datum[0];
      if (datum[1]==undefined) datum[1]='';
      if (datum[1].length==1) datum[1]='0'+datum[1];
      if (datum[2]==undefined) datum[2]='';
      if (fld.name=='geburtstag')
      {
         if (datum[1]=='') { fld.value=datum[0]+'.'+m+'.'; return; }
         if (datum[2]=='') { fld.value=datum[0]+'.'+datum[1]+'.'; return; }
         if (datum[2]<=30) { datum[2]=parseInt(datum[2])+2000; fld.value=datum[0]+'.'+datum[1]+'.'+datum[2]; }
         if (datum[2]<100) { datum[2]=parseInt(datum[2])+1900; fld.value=datum[0]+'.'+datum[1]+'.'+datum[2]; }
      }
      else
      {
         if (datum[1]=='') { fld.value=datum[0]+'.'+m+'.'+y; return; }
         if (datum[2]=='') { fld.value=datum[0]+'.'+datum[1]+'.'+y; return; }
         if (datum[2]<=30) { datum[2]=parseInt(datum[2])+2000; fld.value=datum[0]+'.'+datum[1]+'.'+datum[2]; }
         if (datum[2]<100) { datum[2]=parseInt(datum[2])+1900; fld.value=datum[0]+'.'+datum[1]+'.'+datum[2]; }
         //if (datum[2]<y) { if (oldYear) alert('Hinweis: altes Jahr eingegeben!'); oldYear=false; }
      }
   }
   else
   {
      if (fld.value=='') return;
      if (fld.value.length==1) { fld.value='0'+fld.value+'.'+m+'.'+y; return; }
      if (fld.value.length==2) { fld.value=fld.value+'.'+m+'.'+y; return; }
      if (fld.value.length==4) { fld.value=fld.value.substr(0,2)+'.'+fld.value.substr(2,2)+'.'+y; return; }
      if (fld.value.length==6) { fld.value=fld.value.substr(0,2)+'.'+fld.value.substr(2,2)+(fld.value.substr(4,2)<='30'?'.20':'.19')+fld.value.substr(4,2); return; }
      if (fld.value.length==8) { fld.value=fld.value.substr(0,2)+'.'+fld.value.substr(2,2)+'.'+fld.value.substr(4,4); return; }
   }
}

function BerechneAlter(heute, el)
{
   if (el.value=='') { jQuery('#alter_geburtstag').html(''); return 0; }
   var geb1=el.value.split('.');
   var heute1=heute.split('.');
   if (geb1.length!=3 || heute1.length!=3) { jQuery('#alter_geburtstag').html(' falsches Datums-Format'); return 0; }
   if (geb1[2]=='') { jQuery('#alter_geburtstag').html(''); return 0; }
   var alter=parseInt(heute1[2])-parseInt(geb1[2]); if (parseInt(heute1[1])<parseInt(geb1[1]) || (parseInt(heute1[1])==parseInt(geb1[1]) && parseInt(heute1[0])<parseInt(geb1[0]))) alter--;
   if (alter<0 || alter>150) { jQuery('#alter_geburtstag').html(''); return 0; }
   jQuery('#alter_geburtstag').html(' =('+alter+' Jahre)');
   return alter;
}

function SetBelegEnable(enable, art)
{
   if (enable && art) jQuery("#datepickerdatum IMG").show(); else jQuery("#datepickerdatum IMG").hide();
   if (enable) jQuery("#art0").removeAttr("disabled"); else jQuery("#art0").attr("disabled",true);
   if (enable) jQuery("#art1").removeAttr("disabled"); else jQuery("#art1").attr("disabled",true);
   if (enable && art) jQuery("#datum").removeAttr("disabled"); else jQuery("#datum").attr("disabled",true);
   if (enable) jQuery("#zweck").removeAttr("disabled"); else jQuery("#zweck").attr("disabled",true);
   if (enable) jQuery("#betrag").removeAttr("disabled"); else jQuery("#betrag").attr("disabled",true);
   if (enable) jQuery("#kat").removeAttr("disabled"); else jQuery("#kat").attr("disabled",true);
   if (enable) jQuery("#kontoid").removeAttr("disabled"); else jQuery("#kontoid").attr("disabled",true);
   if (enable) jQuery("#kontodetailskontoid").removeAttr("disabled"); else jQuery("#kontodetailskontoid").attr("disabled",true);
   if (enable && art) { jQuery("#kontoid2").removeAttr("disabled"); jQuery("#rowkontoid2").show(); } else { jQuery("#kontoid2").attr("disabled",true); jQuery("#rowkontoid2").hide(); }
   if (enable && art) jQuery("#kontodetailskontoid2").removeAttr("disabled"); else jQuery("#kontodetailskontoid2").attr("disabled",true);
   if (enable && art) jQuery("#kontopickerkontoid2").removeAttr("disabled"); else jQuery("#kontopickerkontoid2").attr("disabled",true);
   if (enable && art) jQuery("#unterkonto").removeAttr("disabled"); else jQuery("#unterkonto").attr("disabled",true);
   if (enable) jQuery("#mwst").removeAttr("disabled"); else jQuery("#mwst").attr("disabled",true);
   if (enable) jQuery("#belegnr").removeAttr("disabled"); else jQuery("#belegnr").attr("disabled",true);
   if (enable) jQuery("#rnummer").removeAttr("disabled"); else jQuery("#rnummer").attr("disabled",true);
   if (enable) jQuery("#rnummerlink").show(); else jQuery("#rnummerlink").hide();
   if (enable && art) jQuery("#rtyp").removeAttr("disabled"); else { jQuery("#rtyp").attr("disabled",true); jQuery("#rtyp").val('0'); jQuery("#rtyp").trigger('change'); }
   if (enable) jQuery("#kunde").removeAttr("disabled"); else jQuery("#kunde").attr("disabled",true);
   if (enable) jQuery("#userid").removeAttr("disabled"); else jQuery("#userid").attr("disabled",true);
   if (enable) jQuery("#gruppenid").removeAttr("disabled"); else jQuery("#gruppenid").attr("disabled",true);
   if (enable) jQuery("#veranstaltungid").removeAttr("disabled"); else jQuery("#veranstaltungid").attr("disabled",true);
   if (enable) jQuery("#quelle").removeAttr("disabled"); else jQuery("#quelle").attr("disabled",true);
}

function NeueRechnungsNummer()
{
   jQuery.ajax({ type: 'GET', url: './?webservice=renr&rtyp='+jQuery('#rtyp').val()+"&uid="+jQuery('#userid').val()+"&vid="+jQuery('#veranstaltungid').val()+"&betrag="+jQuery('#betrag').val(), success: function(result) 
   {
      jQuery('#rnummer').val(result);
   } });
}

function NeueKundenNummer(field)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=kunr', success: function(result) 
   {
      jQuery('#'+field).val(result);
   } });
}

function KontoPickerSetze(field,wert)
{
   jQuery.ajax({ url: './?webservice=kontopicker', dataType: 'json', data: { query:encode_utf8(wert), filterart:'' }, success: function( data )
   {
      if (data.length==1)
         KontoPickerSetzeName(field,wert,data[0].label);
      else
         KontoPickerSetzeName(field,wert,wert);
   } });
}

function KontoPickerAktiv(field,aktiv)
{
   jQuery('#kontopicker'+field).prop('disabled',!aktiv);
   jQuery('#kontopicker'+field).trigger('change');
}

function KontoPickerSetzeName(field,wert,name)
{
   jQuery('#'+field).val(wert);
   jQuery('#kontopicker'+field).val(name);
   jQuery('#kontodetails'+field).val(wert); //dropdown
}

function SetBelegData(betrag, id, konto, konto2, kreditor, kreditorname, quelle, kontoname, kontoname2, mwststd) 
{
   jQuery("#betrag").val(betrag==0?'':betrag);
   KontoPickerSetzeName('kontoid',konto,kontoname);
   KontoPickerSetzeName('kontoid2',konto2,kontoname2);
   jQuery("#unterkonto").val(kreditor);
   jQuery("#kreditordetailsunterkonto").html(kreditorname);
   if (id=='' || id==0) return;
   jQuery.ajax({ type: 'GET', url: './?webservicejson&function=GetRechnung&id='+id, success: function(result)
   {
      jQuery("#datum").val(result.datum.substr(8,2)+'.'+result.datum.substr(5,2)+'.'+result.datum.substr(0,4));
      jQuery("#zweck").val(result.zweckkurz);
      jQuery("#kat").val(result.kategorie);
      jQuery("#mwst").val(mwststd==0?'':mwststd);
      jQuery("#belegnr").val(result.beleg);
      jQuery("#kunde").val(result.kunde);
      jQuery("#userid").val(result.userid);
      jQuery("#gruppenid").val("");
      jQuery("#veranstaltungid").val("");
      jQuery("#quelle").val(quelle==-1?result.quelle:quelle);
   } });
}

function ShowHideToggle(id)
{
   if (!jQuery(id).is(':visible')) jQuery(id).show(); else jQuery(id).hide();
}

function CheckGeoAdr(adr)
{
   if (adr=='') return false;
   if (adr=='undefined') return false;
   if (adr==undefined) return false;
   if (adr.indexOf(' / ') && parseFloat(adr)>0) return false;
   return true;
}

function GeoOpenDirect(extra,template,dialog)
{
   var adr=jQuery('#geoadr').val();
   if (!CheckGeoAdr(adr)) { OpenDirect(extra,template,dialog); return; }
   jQuery.ajax({ type: 'GET', url: './?webservice=geo&ort='+encodeURIComponent(adr), success: function(result) 
   {
      if (result!='') jQuery('#geoadr').val(result);
      OpenDirect(extra,template,dialog);
   } });

   //var geocoder = new google.maps.Geocoder();
   //geocoder.geocode(
   //     { address: adr }, 
   //     function(locResult, status)
   //     {
   //        if (status == google.maps.GeocoderStatus.OK)
   //            jQuery('#geoadr').val(locResult[0].geometry.location.lat() +" / " +locResult[0].geometry.location.lng());
   //        OpenDirect(extra,template,dialog);
   //     }
   //);
}

function GeoOpenNewWindow(extra,template)
{
   var adr=jQuery('#geoadr').val();
   if (!CheckGeoAdr(adr)) { OpenNewWindow(extra,template); return; }

   jQuery.ajax({ type: 'GET', url: './?webservice=geo&ort='+encodeURIComponent(adr), success: function(result) 
   {
      if (result!='') jQuery('#geoadr').val(result);
      OpenNewWindow(extra,template);
   } });

   //var geocoder = new google.maps.Geocoder();
   //geocoder.geocode(
   //     { address: adr }, 
   //     function(locResult, status)
   //     {
   //        if (status == google.maps.GeocoderStatus.OK)
   //            jQuery('#geoadr').val(locResult[0].geometry.location.lat() +" / " +locResult[0].geometry.location.lng());
//        OpenNewWindow(extra,template);
   //     }
   //);
}

//Suche nach Umkreis
function BerechneGEO(src, dst, submit)
{
   ShowLightBox();
   var el=document.getElementById(src);
   if (el==undefined) { if (submit!='') DirectFormSubmit(submit); return; }
   var adr=el.value;
   if (!CheckGeoAdr(adr)) { if (submit=='#') OpenNewWindowNow(-1,-1); else if (submit!='') DirectFormSubmit(submit); return; }
   GoogleGeoCoder(adr, dst, submit);
}

function GoogleGeoCoder(adr, geofieldid, submit)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=geo&ort='+encodeURIComponent(adr), success: function(result) 
   {
      if (result!='') jQuery('#'+geofieldid).val(result);
      if (submit=='#') OpenNewWindowNow(-1,-1); else if (submit!='') DirectFormSubmit(submit);
   } });

   ////Client
   //var geocoder = new google.maps.Geocoder();
   //geocoder.geocode(
   //     { address: adr }, 
   //     function(locResult, status)
   //     {
   //        if (status == google.maps.GeocoderStatus.OK)
   //            jQuery('#'+geofieldid).val(locResult[0].geometry.location.lat() + " / " +locResult[0].geometry.location.lng());
   //        //else alert(status);
   //        if (submit!='') DirectFormSubmit(submit);
   //     }
   //);
}

//Mitgliederprofile, Geo-Feld "Neu berechnen"
function BerechneGEOAdr2(geofieldid, submit, prefix)
{
   var pre=prefix; if (pre=='') pre=jQuery('#postgp').val()==0?"p":"g";
   var adrLnd = jQuery('#'+pre+'_land').val();
   var adrStr = jQuery('#'+pre+'_strasse').val();
   var adrPlz = jQuery('#'+pre+'_plz').val();
   var adrOrt = jQuery('#'+pre+'_ort').val();
   if (adrLnd=='') adrLnd='D';
   var adr = adrLnd+"-"+adrPlz+" "+adrOrt+", "+adrStr;
   if (adr==jQuery('#geolastvalue').val() && jQuery('#'+geofieldid).val()!='') { if (submit!='') DirectFormSubmit(submit); return; }
   GoogleGeoCoder(adr, geofieldid, submit);
}

function BerechneLuft(pos1, pos2, luft)
{
   var p1=document.getElementById(pos1).value;
   var p1p=p1.indexOf('/'); 
   var latLng1 = new google.maps.LatLng(p1.substring(0,p1p), p1.substring(p1p+1), true);

   var p2=document.getElementById(pos2).value;
   var p2p=p2.indexOf('/'); 
   var latLng2 = new google.maps.LatLng(p2.substring(0,p2p), p2.substring(p2p+1), true);

   var l=document.getElementById(luft);
   l.value=round2(google.maps.geometry.spherical.computeDistanceBetween(latLng1,latLng2)/1000);
}

function round2(value)
{
    var shift = 100;
    var shifted = Math.round(value * shift);
    return shifted / shift;
}

function AddBelegZeile(zeilennr, extranr)
{
   var elem=jQuery('#zeile_25').clone();
   elem.show();
   ItemsSetIDLine(elem,'','_'+zeilennr+'_'+extranr);

   elem.find('#einaus_'+zeilennr+'_'+extranr).val(jQuery('#einaus'+zeilennr).val());
   elem.find('#nettobrutto_'+zeilennr+'_'+extranr).val(jQuery('#nettobrutto'+zeilennr).val());
   elem.find('#mwst_'+zeilennr+'_'+extranr).val(jQuery('#mwst'+zeilennr).val());

   elem.find('a.belegzeile').each(function(index, value) {
     jQuery(this).attr('onclick','javascript:AddBelegZeile('+zeilennr+','+(extranr+1)+');return false;');
   });

   if (extranr==1)
      jQuery('#extralink_'+zeilennr).hide();
   else
      jQuery('#extralink_'+zeilennr+'_'+(extranr-1)).hide();

   var nxt=jQuery('#zeile_'+(zeilennr+1));
   elem.insertBefore(nxt);

   KontoPickerEnable('konto_'+zeilennr+'_'+extranr,'');
}

function OpenRegister(selectedTab, name)
{
   jQuery('#openedpage').val(selectedTab);
   if (name!='') name='#'+name+' ';

   jQuery(name+'.tabdialog').hide();
   jQuery(name+'.tabX').removeClass('active');
   jQuery(name+'.tabB').removeClass('tabselected');
   jQuery(name+'.tabB').addClass('tabunselected');

   jQuery(name+'.item'+selectedTab).show();
   jQuery(name+'.tabX'+selectedTab).addClass('active');
   jQuery(name+'.tabB'+selectedTab).addClass('tabselected');
   jQuery(name+'.tabB'+selectedTab).removeClass('tabunselected');

   //if (typeof PadResizeCanvas2 === "function") PadResizeCanvas2();
}

function SyncUnter(kontofield, konten1, konten2)
{
   var konto=jQuery('#'+kontofield).val();
   var sel=3;
   if (konten1.indexOf(','+konto+',')>=0) sel=1;
   else if (konten2.indexOf(','+konto+',')>=0) sel=2;
   if (sel==1) jQuery('#div_unter'+kontofield+'_1').show(); else jQuery('#div_unter'+kontofield+'_1').hide();
   if (sel==2) jQuery('#div_unter'+kontofield+'_2').show(); else jQuery('#div_unter'+kontofield+'_2').hide();
   if (sel==3) jQuery('#div_unter'+kontofield+'_3').show(); else jQuery('#div_unter'+kontofield+'_3').hide();
   jQuery('#unter'+kontofield).val(sel);
}

function OpenBox(boxnr)
{
   var el=document.getElementById('box'+boxnr);
   if (el.style.display=='none') el.style.display=''; else el.style.display='none';
}

function resizetable(id)
{
   jQuery(document).ready(function() {
      //jQuery('#'+id).css('display','block').css('scrollable','yes').css('overflow-y','auto').css('overflow-x','hidden').css('height','400');
      //jQuery('#'+id).prev().css('display','block').css('position','relative');
      //jQuery('#'+id+' > tr').css('display','block').css('height','30px');
      var h = jQuery(window).height()-jQuery('#'+id).offset().top-30+jQuery(window).scrollTop();
      jQuery('#'+id).height(h); 
   });
   jQuery(window).resize(function()  { var h = jQuery(window).height()-jQuery('#'+id).offset().top-30+jQuery(window).scrollTop(); jQuery('#'+id).height(h); });
   //jQuery(window).scroll(function()  { var h = jQuery(window).height()-jQuery('#'+id).offset().top-30+jQuery(window).scrollTop(); jQuery('#'+id).height(h); });
}

function pruefPasswortStaerke(password, minlaenge, komplexitaet, txtKurz, txtNA, txtA, txtVorgabe, txtKriterien, txtPwdSec, txtSchwach, txtGut, txtStark, txtSehrStark)
{
   var staerke=0;
   if (password.length<minlaenge) return ['#ff0000',txtKurz];

   var gr=password.match(/([A-ZAeOeUe])/);
   var kl=password.match(/([a-zaeoeue])/);
   var zi=password.match(/([0-9])/);
   var so=false; for(var i=0; i<password.length; i++) { var z=password[i]; so=so || !(z.match(/([A-ZAeOeUe])/) || z.match(/([a-zaeoeue])/) || z.match(/([0-9])/)); }
   var kom=(gr?1:0)+(kl?1:0)+(zi?1:0)+(so?1:0);
   var erg=kom<komplexitaet?txtNA:txtA;

   //if (password.length>7) staerke+=1;
   if (gr) staerke+=1;
   if (kl) staerke+=1;
   if (zi) staerke+=1;
   if (so) staerke+=1;
   //if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) staerke+=1;

   var farbe=kom<komplexitaet?'#ff0000':'#007f00';

   if (staerke<2) return [farbe, txtVorgabe+' '+erg+' ('+kom+'/4 '+txtKriterien+'), '+txtPwdSec+' '+txtSchwach];
   if (staerke<3) return [farbe, txtVorgabe+' '+erg+' ('+kom+'/4 '+txtKriterien+'), '+txtPwdSec+' '+txtGut];
   if (staerke<4) return [farbe, txtVorgabe+' '+erg+' ('+kom+'/4 '+txtKriterien+'), '+txtPwdSec+' '+txtStark];
   return [farbe, txtVorgabe+' '+erg+' ('+kom+'/4 '+txtKriterien+'), '+txtPwdSec+' '+txtSehrStark];
}

function FormatEuro(w,curr)
{
   var s=''+w; if (s.indexOf('.')>=0) { ss=s+'00'; s=Trenner(ss.substr(0,ss.indexOf('.')))+','+ss.substr(ss.indexOf('.')+1,2); } else s=Trenner(s)+',00';
   return s+' '+curr;
}

function Trenner(number)
{
   number = '' + number;
   if (number.length > 3)
   {
      var mod = number.length % 3;
      var output = (mod > 0 ? (number.substring(0,mod)) : '');
      for (i=0 ; i < Math.floor(number.length / 3); i++)
      {
         if ((mod == 0) && (i == 0))
            output += number.substring(mod+ 3 * i, mod + 3 * i + 3);
         else
            output+= '.' + number.substring(mod + 3 * i, mod + 3 * i + 3);
      }
      return output;
   }
   return number;
}

function GetKommaZahl(feld)
{
   var wrt=jQuery('#'+feld).val();
   return GetKommaZahlWert(wrt);
}

function GetKommaZahlWert(wrt)
{
   if (wrt.indexOf('.')>=0 && wrt.indexOf(',')>=0) wrt=wrt.replace('.','');
   wrt=wrt.replace(',','.');
   if (wrt=='') return 0;
   return parseFloat(wrt);
}

function SpeichernKreditor()
{
   if (jQuery("input[name='auswahl']:checked").val()==1) if (jQuery('#konto1').val()==0) alert('Bitte Kontakt auswaehlen'); else SetzeKreditor('#'+jQuery('#konto1').val(), jQuery('#peoplepickerkonto1').val());
   if (jQuery("input[name='auswahl']:checked").val()==2) if (jQuery('#konto2').val()=='') alert('Bitte Kreditor auswaehlen'); else SetzeKreditor(jQuery('#konto2').val(), jQuery('#konto2').val());
   if (jQuery("input[name='auswahl']:checked").val()==3) if (jQuery('#konto3').val()=='') alert('Bitte Kreditor eingeben'); else SetzeKreditor(jQuery('#konto3').val(), jQuery('#konto3').val());
   if (jQuery("input[name='auswahl']:checked").val()==4) SetzeKreditor('','');
}

function SetzeDatum2(el, feld)
{
   var data=el.value.split('.');
   if (data.length>=3) jQuery('#'+feld).val('31.12.'+data[2]);
}

function Verbandsauswahl(mandant, selectfeld)
{
   jQuery('#'+selectfeld).empty();
   jQuery.ajax({ type: 'GET', url: './?webservicejson&function=GetMembers&filter=mandant%3D'+mandant, success: function(result) 
    {
      jQuery("<option/>").val("").text("").appendTo('#'+selectfeld);
      for(var i=0; i<result.length; i++) jQuery("<option/>").val(result[i].id).text(result[i].name).appendTo('#'+selectfeld);
    }
   });
}

function CheckSize(size, confirmalle=false)
{
   if (confirmalle) if (jQuery('#alle').prop('checked') || jQuery('#vms').prop('checked') || jQuery('#othr').prop('checked')) { if (!confirm("Wirklich an 'alle' senden (ggf. gemaess Filter)?")) return false; }
   if (jQuery('#subject').length>0 && jQuery('#subject').val()=='') { alert('Betreff muss ausgefuellt sein'); return false; }
   if (jQuery('#attachmentsaslink').prop("checked")) return true;

   var ist=0;
   jQuery.each( jQuery("input[type='file']"), function(key, value) { if (value.files!=undefined) if (value.files.length>0) for(var i=0; i<value.files.length; i++) ist=ist+value.files[i].size; });
   if (Dropzone.isBrowserSupported())
   { 
      var dropzone = Dropzone.forElement('#dropareaattachments');
      if (dropzone!=null) { var files = dropzone.getQueuedFiles(); if (files.length!=undefined) for(var i=0; i<files.length; i++) ist+=files[i].size; }
   }
   if (ist>size*1024*1024) { alert('Die Dateien sind mit '+(Math.round(ist/1024/1024*10)/10)+' MBytes groesser als die erlaubten '+size+' MBytes'); return false; }

   return true;
}

function CascadeAuswahl(feld, value, data)
{
   jQuery('#'+feld).empty();
   if (value=='') jQuery("<option/>").val('').text('').appendTo('#'+feld);
   for(var i=0; i<data.length; i++) if (data[i][0]==value) jQuery("<option/>").val(data[i][1]).text(data[i][2]).appendTo('#'+feld);
   if (value=='') SetAndTriggerChange(feld,''); else for(var i=0; i<data.length; i++) if (value=='' || data[i][0]==value) { SetAndTriggerChange(feld,data[i][1]); break; }
}

function SetAndTriggerChange(feld, wert)
{
   jQuery('#'+feld).val(wert);
   jQuery('#'+feld).trigger('change');
}

function ShowEinreichungAnzahl(id, details, hinweise)
{
   jQuery('#hinweistext').html('');
   for(var i=0; i<hinweise.length; i++) if (hinweise[i][0]==id) jQuery('#hinweistext').html(hinweise[i][1]);

   jQuery('[class*="rowkey_detail_"]').hide(); 
   jQuery('[class*="rowkey_detail_"] input').prop('disabled',true); 
   for(var i=0; i<details.length; i++)
      if (details[i][0]==id)
         for(var k=1; k<details[i].length; k++)
         {
            jQuery('.rowkey_detail_'+details[i][k]).show();
            jQuery('.rowkey_detail_'+details[i][k]+' input').prop('disabled',false); 
            jQuery('#key_detail_'+details[i][k]).prop('disabled',false);
         }
}

function DeleteAllFinal()
{
   if (confirm('Wirklich endgueltig loeschen?')) { SetForm1Value('action','members_deleteallfinal'); Form1Submit(); }
}

function ReaktiviereAll()
{
   if (confirm('Wirklich reaktivieren?')) { SetForm1Value('action','members_list'); SetForm1Value('cmd','saveactivate'); Form1Submit(); }
}

function AnonymisierenAll()
{
   if (confirm('Wirklich anonymisieren?')) { SetForm1Value('action','members_anonymisierenall'); Form1Submit(); }
}

function DeleteAll()
{
  if (confirm('Wirklich loeschen?')) { SetForm1Value('action','members_deleteall'); Form1Submit(); }
}

function LockAll()
{
   if (confirm('Wirklich sperren?')) { SetForm1Value('action','members_lockall'); Form1Submit(); }
}

function ShowOnMap()
{
   SetForm1Value('action','members_map'); OpenNewWindow(0,0);
}

function CopyAdresse(src, dst)
{
   jQuery('#'+dst+'_strasse').val(jQuery('#'+src+'_strasse').val());
   jQuery('#'+dst+'_plz').val(jQuery('#'+src+'_plz').val());
   jQuery('#'+dst+'_ort').val(jQuery('#'+src+'_ort').val());
   jQuery('#'+dst+'_land').val(jQuery('#'+src+'_land').val());
   if (dst=='r') jQuery('#'+dst+'_firma').val(jQuery('#firma').val());
   if (dst=='r') jQuery('#'+dst+'_co').val(jQuery('#'+src+'_co').val());
}

function SortiereListe(liste)
{
   var selElem=document.getElementById(liste);
   var tmpAry = new Array();
   for (var i=0;i<selElem.options.length;i++) {
       tmpAry[i] = new Array();
       tmpAry[i][0] = selElem.options[i].text;
       tmpAry[i][1] = selElem.options[i].value;
   }
   tmpAry.sort();
   while (selElem.options.length > 0) {
       selElem.options[0] = null;
   }
   for (var i=0;i<tmpAry.length;i++) {
       var op = new Option(tmpAry[i][0], tmpAry[i][1]);
       selElem.options[i] = op;
   }
}

function MoveFile(id, folder, file, targetfolder, link)
{
   //alert('./?action=data_raum&id='+id+'&folder='+encodeURIComponent(folder)+'&raumtarget='+id+'&foldertarget='+encodeURIComponent(targetfolder)+'&movefile='+encodeURIComponent(file)+'&mode=&dialog=4'); return;
   jQuery.ajax({ type: 'GET', url: './?action=data_raum&utf8=1&id='+id+'&folder='+encodeURIComponent(folder)+'&raumtarget='+id+'&foldertarget='+encodeURIComponent(targetfolder)+'&movefile='+encodeURIComponent(file)+'&mode=&dialog=4', success: function(result) 
   {
      location.href=link;
   } });
}

function KontoPickerEnable(field,filterart)
{
   jQuery('#kontopicker'+field).autocomplete({
    source:
     function(request, response)
     {
       //jQuery('#'+field).val('');
       //jQuery('#kontopicker'+field).val('');
       jQuery.ajax({ url: './?webservice=kontopicker', dataType: 'json', data: { query:encode_utf8(request.term), filterart:filterart }, success: function( data )
       {
          if (data.length==1)
          {
             jQuery('#'+field).val(data[0].value);
             jQuery('#kontopicker'+field).val(data[0].label);
             jQuery('#kontopicker'+field).autocomplete('close');
             jQuery('#kontopicker'+field).trigger('change');
             KontoPickerAktiv(field,false);
          }
          else
             response( data ); 
       } });
     },
    select: function(event, ui)
     {
       KontoPickerAktiv(field,false); 
       jQuery('#'+field).val(ui.item.value);
       jQuery('#kontopicker'+field).val(ui.item.label);
       jQuery('#kontopicker'+field).autocomplete('close');
       jQuery('#kontopicker'+field).trigger('change');
       event.preventDefault(); 
     }
   });
}
function KontoPickerExit(field)
{
   if (jQuery('#'+field).val()=='') jQuery('#kontopicker'+field).val('');
}

function VAPickerEnable(field, onlyPictures)
{
   jQuery('#vapicker'+jQuery.escapeSelector(field)).autocomplete({
    source:
     function(request, response)
     {
       //jQuery('#'+field).val('');
       //jQuery('#vapicker'+field).val('');
       jQuery.ajax({ url: './?webservice=vapicker&onlyPictures='+onlyPictures, dataType: 'json', data: { query:encode_utf8(request.term) }, success: function( data )
       {
          if (data.length==1)
          {
             jQuery('#'+jQuery.escapeSelector(field)).val(data[0].value);
             jQuery('#vapicker'+jQuery.escapeSelector(field)).val(data[0].label);
             jQuery('#vapicker'+jQuery.escapeSelector(field)).autocomplete('close');
             jQuery('#vapicker'+jQuery.escapeSelector(field)).trigger('change');
             VAPickerAktiv(field,false);
          }
          else
             response( data ); 
       } });
     },
    select: function(event, ui)
     {
       VAPickerAktiv(field,false); 
       jQuery('#'+jQuery.escapeSelector(field)).val(ui.item.value);
       jQuery('#vapicker'+jQuery.escapeSelector(field)).val(ui.item.label);
       jQuery('#vapicker'+jQuery.escapeSelector(field)).autocomplete('close');
       jQuery('#vapicker'+jQuery.escapeSelector(field)).trigger('change');
       event.preventDefault(); 
     }
   });
}
function VAPickerExit(field)
{
   if (jQuery('#'+jQuery.escapeSelector(field)).val()=='') jQuery('#vapicker'+jQuery.escapeSelector(field)).val('');
}
function VAPickerAktiv(field,aktiv)
{
   jQuery('#vapicker'+jQuery.escapeSelector(field)).prop('disabled',!aktiv);
   jQuery('#vapicker'+jQuery.escapeSelector(field)).trigger('change');
}
function VAPickerLoeschen(field)
{
   jQuery('#'+jQuery.escapeSelector(field)).val('');
   jQuery('#vapicker'+jQuery.escapeSelector(field)).val('');
   VAPickerAktiv(field, true);
}

function encode_utf8(rohtext)
{
   rohtext = rohtext.replace(/\r\n/g,"\n");
   var utftext = "";
   for(var n=0; n<rohtext.length; n++)
   {
      var c=rohtext.charCodeAt(n);
      if (c<128)
         utftext += String.fromCharCode(c);
      else if((c>127) && (c<2048))
      {
         utftext += String.fromCharCode((c>>6)|192);
         utftext += String.fromCharCode((c&63)|128);
      }
      else 
      {
         utftext += String.fromCharCode((c>>12)|224);
         utftext += String.fromCharCode(((c>>6)&63)|128);
         utftext += String.fromCharCode((c&63)|128);
     }
  }
  return utftext;
}

function PeoplePickerAktiv(field,aktiv)
{
   jQuery('#peoplepicker'+field).prop('disabled',!aktiv);
}

function PeoplePickerEnable(field,typ,m,rech,usercode)
{
   jQuery('#peoplepicker'+field).autocomplete({
    source:
     function( request, response )
     {
       jQuery.ajax({ url: './?webservice=memberpicker', dataType: 'json', data: { query:encode_utf8(request.term), typ:typ, m:m, rech:rech, usercode:encodeURIComponent(usercode) }, success: function(data)
       {
          if (data.length==1)
          {
             PeoplePickerAktiv(field,false);
             PeopleAddUser(field,data[0].value,data[0].label);
             jQuery('#peoplepicker'+field).autocomplete('close');
          }
          else
          {
             response(data);
          }
       } });
     },
    select: function( event, ui ) 
     {
       PeoplePickerAktiv(field,false); 
       PeopleAddUser(field,ui.item.value,ui.item.label);
       jQuery('#peoplepicker'+field).autocomplete('close');
       event.preventDefault(); 
     }
   });
}
function PeoplePickerAddUsers(field, target)
{
   var peoples=document.getElementById('result');
   var s=-1; for(var i=0; i<peoples.options.length; i++) if (peoples.options[i].selected) s=peoples.options[i].value;
   if (s==-1) { alert('Bitte einen Eintrag auswaehlen'); return false; }
   for(var i=0; i<peoples.options.length; i++)
      if (peoples.options[i].selected)
         target.PeopleAddUser(field, peoples.options[i].value, peoples.options[i].text);
   return true;
}
function PeopleAddUser(field,id,name)
{
   if (field=='profile')
   {
      jQuery.ajax({ type: 'POST', url: './?webservice=memberdata&id='+id, success: function(result) 
      {
         eval('werte='+result);
         var lst=['firma','g_co','g_strasse','g_plz','g_ort','g_land','g_postfach','g_plz_postfach','g_ort_postfach','g_land_postfach','g_telefon','g_fax','g_mobil','g_email','g_homepage'];
         for(itm in lst) jQuery('#'+lst[itm]).val(werte[lst[itm]]);
      } });
   }
   else
   {
      jQuery('#personloeschen'+field).show();
      jQuery('#personoeffnen'+field).show();
      jQuery('#peoplepickerinput'+field).css("width","calc(100% - 61px)");
      jQuery('#peoplepicker'+field).val(name);
      jQuery('#'+field).val(id);
      jQuery('#'+field).trigger('change');
   }
}
function PeopleDeleteUser(field, all)
{
   if (all) jQuery('#peoplepicker'+field).val('');
   jQuery('#'+field).val('0');
   jQuery('#'+field).trigger('change');
   jQuery('#personloeschen'+field).hide();
   jQuery('#personoeffnen'+field).hide();
   jQuery('#peoplepickerinput'+field).css("width","calc(100% - 26px)");
}
function PeoplePickerAddUsersMultiple(field, target)
{
   var peoples=document.getElementById('result');
   var s=0; for(var i=0; i<peoples.options.length; i++) if (peoples.options[i].selected) s++;
   if (s==0) { alert('Bitte einen Eintrag auswaehlen'); return false; }
   for(var i=0; i<peoples.options.length; i++)
      if (peoples.options[i].selected)
         PeoplePickerAddUserToList(field, peoples.options[i].value, peoples.options[i].text, target);
   PeoplePickerSetPeopleValues(target.document, field);
   return true;
}
function PeoplePickerSetPeopleValues(doc, field)
{
   var result='';
   var peoplepicker=doc.getElementById('peoplepicker'+field);
   for(var i=0; i<peoplepicker.options.length; i++) result+=','+peoplepicker.options[i].value;
   if (result.length>0) result=result.substring(1);
   doc.getElementById(field).value=result;
   jQuery(doc).find('#'+field).trigger('change');
}
function PeoplePickerAddUserToList(field, id, name, target)
{
   var peopleslist=target.document.getElementById('peoplepicker'+field);
   for(var i=0; i<peopleslist.options.length; i++) if (peopleslist.options[i].value==id) return;
   target.PeoplePickerAddUser(field,name,id);
}
function PeoplePickerDeleteUser(field)
{
   var peoplepicker=document.getElementById('peoplepicker'+field);
   if (peoplepicker.selectedIndex<0) { alert('Bitte zuerst Person markieren'); return; }
   peoplepicker.options[peoplepicker.selectedIndex]=null;
   PeoplePickerSetPeopleValues(document, field);
}
function PeoplePickerDeleteUserAll(field)
{
   var peoplepicker=document.getElementById('peoplepicker'+field);
   peoplepicker.length = 0;
   PeoplePickerSetPeopleValues(document, field);
}
function PeoplePickerAddUser(field, name, id)
{
   var peoplepicker=document.getElementById('peoplepicker'+field);
   peoplepicker.add(new Option(name,id));
   jQuery('#'+field).trigger('change');
}
function PeoplePickerEdit(field)
{
   if (jQuery('#'+field).val()=='0' || jQuery('#'+field).val()=='') jQuery('#peoplepicker'+field).val('');
}

function PeoplePickerAttachFromPicker(field)
{
   if (jQuery('#personadd'+field).val()!=0)
   {
      var peoplepicker=document.getElementById('peoplepicker'+field);
      peoplepicker.add(new Option(jQuery('#peoplepickerpersonadd'+field).val(),jQuery('#personadd'+field).val()));
      PeoplePickerSetPeopleValues(document, field);
      PeopleDeleteUser('personadd'+field, true);
      PeoplePickerAktiv('personadd'+field, true); 
   }
}

function PeoplePickerAttach(field,userid,username)
{
   var peoplepicker=document.getElementById('peoplepicker'+field);
   peoplepicker.add(new Option(username, userid));
   PeoplePickerSetPeopleValues(document, field);
   PeopleDeleteUser('personadd'+field, true);
   PeoplePickerAktiv('personadd'+field, true); 
}

function VersPickerEnable(field, auswahl)
{
   jQuery('#verspicker'+field).autocomplete({
    source:
     function(request, response)
     {
       jQuery.ajax({ url: './?webservice=verspicker', dataType: 'json', data: { query:encode_utf8(request.term), auswahl:auswahl}, success: function( data )
       {
          if (data.length==1)
          {
             jQuery('#'+field).val(data[0].value);
             jQuery('#verspicker'+field).val(data[0].label);
             jQuery('#verspicker'+field).autocomplete('close');
             jQuery('#'+field).trigger('change');
          }
          else
             response( data ); 
       } });
     },
    select: function(event, ui)
     {
       jQuery('#'+field).val(ui.item.value);
       jQuery('#verspicker'+field).val(ui.item.label);
       jQuery('#verspicker'+field).autocomplete('close');
       jQuery('#'+field).trigger('change');
       event.preventDefault(); 
     }
   });
}
function VersPickerSetzeName(field,wert,name)
{
   jQuery('#'+field).val(wert);
   jQuery('#key_versicherungstarif').val('');
   jQuery('#'+field).trigger('change');
   jQuery('#verspicker'+field).val(name);
}

function ArtikelPickerEnable(field, pos, typ, angebot, userfield, lagerortid)
{
   jQuery('#'+field).autocomplete({
     source:
       function( request, response )
       {
         jQuery.ajax({ url: './?webservice=artikelpicker&typ='+typ+'&lagerortid='+lagerortid, dataType: 'json', data: { q:request.term }, success: function( data ) { response( data ); } });
       },
     select: 
       function( event, ui ) 
       {
         var hidetext=jQuery('#keintextlang').prop('checked');
         jQuery.ajax({ type: 'POST', url: './?webservice=artikel&id='+ui.item.value+'&a='+angebot+'&userid='+jQuery('#'+userfield).val()+'&pos='+pos+'&nb='+jQuery('#nettobrutto').val()+'&hidetext='+hidetext, success: function(result) 
         {
            eval('werte='+result);
            AngebotsPositionAuswahl(window, pos, werte['bezeichnung'], werte['beschreibung'].replace(/~~~/g,'\r\n'), werte['betrag'], werte['mwst'], werte['nettobrutto'], werte['konto'], werte['artikelid'], werte['preiseB'], werte['preiseN'], werte['kontoname'], werte['veranstaltungid'], werte['lager'], werte['eknetto'], werte['ekbrutto'], werte['rechnungsnummer']);
         } });
         jQuery('#'+field).autocomplete('close'); 
         event.preventDefault();
      }
   });
}

function SwitchPreisBruttoNetto(bruttonetto)
{
   var pos, isGefuellt=false;
   for(pos=0; jQuery('#preiseB'+pos).length>0; pos++) if (jQuery('#betrag'+pos).val()!='') isGefuellt=true;
   if (isGefuellt) alert('Hinweis: Durch nachtraegliches Aendern der brutto/netto-Einstellung muessen bereits eingegebene Preise ggf. manuell korrigiert werden.');

   for(pos=0; jQuery('#preiseB'+pos).length>0; pos++)
   {
      if (bruttonetto==0)
      {
         jQuery('#preiseB'+pos).show();
         jQuery('#preiseN'+pos).hide();
      }
      else
      {
         jQuery('#preiseB'+pos).hide();
         jQuery('#preiseN'+pos).show();
      }
   }
}

function EventKontaktChanged()
{
   var userid=jQuery('#userid').val();
   var grpid=jQuery('#akid').val();
   if ((grpid==0 || grpid=='') && (userid==0 || userid==''))
      EventKontaktChangedAddUser('','','','','','');
   else
      jQuery.ajax({ type: 'POST', url: './?webservice=member&art=6', data: 'wert='+userid+'&grpid='+grpid, success: function(result)
       {
         eval('werte='+result);
         EventKontaktChangedAddUser(werte['Name'],werte['Email'],werte['Telefon'],werte['Fax'],werte['Strasse'],werte['Ort']);
       }
      });
}

function EventKontaktChangedAddUser(name,email,telefon,fax,strasse,ort)
{
   jQuery('#kontakt').val(name);
   jQuery('#kontaktemail').val(email);
   jQuery('#kontakttelefon').val(telefon);
   jQuery('#kontaktfax').val(fax);
   jQuery('#kontaktstrasse').val(strasse);
   jQuery('#kontaktort').val(ort);
   jQuery('#anmeldemail').prop('checked',name!='');
}

function EventSwitchPreis(userid)
{
   var a='e';
   jQuery('.letzterpreisB').html('');
   jQuery('.letzterpreisN').html('');
   if (userid!=0 && userid!='')
      jQuery.ajax({ type: 'POST', url: './?webservice=member&art=2', data: 'wert='+userid, success: function(result)
       {
         eval('werte='+result);
         if (werte['Typ']!=1) a='i';
         jQuery('#preisauswahl').val(a);
         jQuery('#rechnunggp').val(werte['RechnungGP']);
         for(w in werte)
         {
            if (w.substring(0,13)=='letzterpreisB') jQuery('#letzterB'+w.substring(13)).html(werte[w]);
            else if (w.substring(0,13)=='letzterpreisN') jQuery('#letzterN'+w.substring(13)).html(werte[w]);
            else if (w.substring(0,10)=='preisnetto') jQuery('#mg'+w).val(werte[w]);
            else if (w.substring(0,5)=='preis') jQuery('#mg'+w).val(werte[w]);
         }
         SwitchPreis(a);
       }
      });
   else
   {
      //jQuery('#preisauswahl').val(a);
      //SwitchPreis(a);
   }
}


function GetCurrency(txt,st=100)
{
   if (txt=='') return 0;
   if (txt.indexOf(':')>=0) { var z=txt.split(':'); return GetCurrency(z[0])+GetCurrency(z[1])/60; }
   if (txt.indexOf('.')>=0 && txt.indexOf(',')>=0) txt=txt.replace('.','');
   if (txt.indexOf(',')>=0) txt=txt.replace(',','.');
   var w=parseFloat(txt);
   w=Math.round(w*st)/st;
   return w;
}

function SetzeInBezahlung(form, cmd)
{
   if (confirm('Markierte Eintraege jetzt wirklich auf in Bezahlung setzen?'))
   {
      SetFormValue(form, 'action', 'kasse_buchung');
      SetFormValue(form, 'cmd', cmd);
      FormSubmit(form); 
   }
}

// zweck und renr enthalten keine "-"/Leerzeichen-Zeichen und sind kleingeschrieben
function ScharferReCheck(zweck, renr)
{
   if (renr=='') return false;
   return zweck.toLowerCase().indexOf(renr.toLowerCase())>=0;
}
function UnscharferReCheck(zweck, renr)
{
   while (renr.length>0) if (renr.substring(0,1)<'0' || renr.substring(0,1)>'9') renr=renr.substring(1); else break;
   return ScharferReCheck(zweck, renr);
}

function EnableProgrammpunkte(wert, liste)
{
   jQuery('.programmpunkt').hide();
   for(var n=0; n<liste.length; n++) if (liste[n][0]==wert) if (liste[n][1].length==0) jQuery('.programmpunkt').show(); else for(var k=0; k<liste[n][1].length; k++) jQuery('.pp'+liste[n][1][k]).show();
   jQuery('.programmpunkt input:checkbox:hidden').prop('checked',false);
}

function SetzeAnwesend(id,nr,activ,del)
{
   jQuery.ajax({ type: 'GET', url: './?action=events_anwesend&id='+id+'&nr='+nr+'&ret=no', success: function(result) { } });
   if (del) { jQuery('#row'+id).remove(); return; }
   var txt=activ?'<B>anwesend</B>&nbsp;':'';
   txt=txt+'<A HREF="#" onclick="javascript:SetzeAnwesend('+id+','+nr+','+(!activ?'true':'false')+','+(del?'true':'false')+');return false;">'+(activ?'[nicht&nbsp;anwesend]':'[Anwesend]')+'</A>';
   jQuery('#anwesend'+id+'-'+nr).html(txt);
}

function SetzeBezahlt(anmeldeid, rechnungid, renr)
{
   if (confirm('Die Rechnung '+renr+' auf Bar-bezahlt setzen?'))
   {
      jQuery.ajax({ type: 'GET', url: './?action=events_barzahlung&id='+rechnungid+'&aid='+anmeldeid, success: function(result) { if (result=='1') jQuery('.row'+anmeldeid).addClass('bezahlt'); } });
      jQuery('#rechnungstatus'+rechnungid).html('<b>bezahlt</b>');
      jQuery('#rechnungart'+rechnungid).html('Bar');
      jQuery('#rechnunglink'+rechnungid).hide();
   }
}

function Platzbelegung(div, userid, platzid, beginn, ende, intervall, buchungsart, usercode)
{
   var status=jQuery(div).hasClass('platzbuchungstatusfrei')?1:0;
   if (intervall=='*' && status==1) { var tage=prompt('Anzahl Tage'); if (tage=='' || tage+''=='null') return; ende=ende+(tage-1)*24*3600; }
   if (status==0) if (!confirm('Moechte Sie die Buchung wirklich stornieren?')) return;
   if (status==1) if (!confirm('Wirklich buchen?')) return;
   ShowLightBox();
   jQuery.ajax({ type: 'GET', url: './?webservice=platz&platz='+status+','+userid+','+platzid+','+beginn+','+ende+'&usercode='+usercode, success: function(result) 
   {
      CloseLightBox();
      if (result.substring(0,6)=='error:') { alert(result.substring(6)); }
      else if (result=='frei') { alert("Die Buchung wurde storniert."); jQuery(div).removeClass('platzbuchungstatusmein'); jQuery(div).removeClass('platzbuchungstatusbelegt'); jQuery(div).addClass('platzbuchungstatusfrei'); jQuery(div).html(''); }
      else if (result.substring(0,5)=='mein:') { if (intervall=='*') window.reloadMain(); else { jQuery(div).removeClass('platzbuchungstatusfrei'); jQuery(div).addClass('platzbuchungstatusmein'); jQuery(div).html(result.substring(5)); } }
      else if (result.substring(0,7)=='belegt:') { alert(result.substring(7)); }
      else alert(result+"..."+result.substring(0,3));

      if (buchungsart!='') window.location.reload();
      if (intervall=='woche:sa1400sa1000') window.location.reload();
   } });
}

var DropZoneFiles;
var DropZoneSubmitFunction;

function DropZoneInit(feldname, message)
{
   if (Dropzone.isBrowserSupported())
   {
      //var myDropzone = new Dropzone('div#droparea'+feldname, {
      jQuery('div#droparea'+feldname).dropzone(
      {
         url: "./?webservice=upload",
         dictDefaultMessage: message,
         autoProcessQueue: false,
         parallelUploads: 100,
         uploadMultiple: true,
         addRemoveLinks: true,
         dictRemoveFile: 'Datei loeschen',
         getFallbackForm: function() { return null; }
      });
      Dropzone.forElement('div#droparea'+feldname).on("success", function(file, serverFileName) { DropZoneFiles = DropZoneFiles + (DropZoneFiles==''?'':'|') + file.name + "=" + serverFileName.replace('\n',''); });
      Dropzone.forElement('div#droparea'+feldname).on("removedfile", function(file) { DropZoneFiles=RemoveDropZoneFile(DropZoneFiles,file.name); });
      Dropzone.forElement('div#droparea'+feldname).on("queuecomplete", function() { jQuery('#dropfiles'+feldname).val(DropZoneFiles); DropZoneSubmitFunction(); });
   }
   else
      jQuery('div#droparea'+feldname).hide();
   DropZoneFiles = '';
}

function RemoveDropZoneFile(files, filename)
{
   var p;
   p=files.indexOf('|'+filename+'=');
   if (p>=0) { var p2=files.indexOf('|',p+1); if (p2<0) return files.substr(0,p); else return files.substr(0,p)+files.substr(p2); }
   p=files.indexOf(filename+'=');
   if (p==0) { var p3=files.indexOf('|'); if (p3<0) return ''; else return files.substr(p3+1); }
   return files;
}

function DropZoneSubmit(feldname, submitfkt)
{
   DropZoneSubmitFunction = submitfkt;
   jQuery('#dropfiles'+feldname).val(DropZoneFiles); 

   if (!Dropzone.isBrowserSupported()) { DropZoneSubmitFunction(); return; }

   var dropzone = Dropzone.forElement('#droparea'+feldname);
   if (dropzone==null) { DropZoneSubmitFunction(); return; }

   var files = dropzone.getQueuedFiles();
   if (files.length == undefined) { DropZoneSubmitFunction(); return; }
   if (files.length == 0) { DropZoneSubmitFunction(); return; }
   dropzone.processQueue();
}

var FileSelectCount=100;
function FileSelectAdd(field, target)
{
   var frm1=document.getElementById('form1');
   for(i=0; i<frm1.elements.length; i++)
   {
      if (frm1.elements[i].name.substring(0,5)=="file_" && frm1.elements[i].checked)
      {
         var val=frm1.elements[i].value;
         if (val.indexOf('|')>=0)
         {
            var data=val.split('|');
            target.FileSelectAddFile(field, data[0], data[1], data[2], data[3], data[3]);
         }
         else
            target.FileSelectAddFile(field, GetForm1Element('grpname').value, GetForm1Element('id').value, GetForm1Element('folder').value, frm1.elements[i].name.substring(5), val);
      }
   }
}
function FileSelectAddFile(field,grpname,id,folder,file,name)
{
   //alert(field+' / '+grpname+' / '+id+' / '+folder+' / '+file+' / '+name);
   jQuery('#datenablage'+field).show();
   FileSelectCount++;
   //jQuery('#datenablage'+field).html(jQuery('#datenablage'+field).html()+'<div>aus Datenablage: '+name+' <A HREF="#" onclick="javascript:jQuery(this).parent().remove();return false;">[entfernen]</A><INPUT type="hidden" name="datenablage'+field+'_'+FileSelectCount+'" value="'+id+'|'+folder+'|'+file+'"></div>');
   var inputid='datenablage'+field+FileSelectCount;
   var spalte1=(grpname==''?'Basiskonfiguration: ':'Datenablage: '+grpname+', ')+folder+(folder==''?'':'/')+'<A HREF="?action=data_raum&id='+id+'&folder='+encodeURIComponent(folder)+'&download='+encodeURIComponent(name)+'">'+name+'</A>';
   var ch="'";
   var spalte2='<A HREF="#" onclick="javascript:jQuery('+ch+'#'+inputid+ch+').val('+ch+ch+');jQuery('+ch+'#datenablagerownew'+FileSelectCount+ch+').hide();return false;"><i class="bi bi-x-circle" title="Entfernen"></i></A>';
   var input='<INPUT type="hidden" id="'+inputid+'" name="'+inputid+'" value="'+id+'|'+folder+'|'+file+'">';
   jQuery('#datenablage'+field+'link').html(jQuery('#datenablage'+field+'link').html()+'<tr id="datenablagerownew'+FileSelectCount+'"><td>'+spalte1+'</td><td>'+spalte2+input+'</td></tr>');
}

function FileSelectSet(field, target, value)
{
   target.FileSelectSetFile(field, value);
}
function FileSelectSetFile(field, value)
{
   var el=document.getElementById(field);
   if (el) el.value=value;
   jQuery('#'+field).val(value);
}

function SwitchSprache(feld, sprache, tiny)
{
   var spzuvor=jQuery('#'+feld+'_sprache').val();
   if (spzuvor==sprache) return;
   if (tiny!=false)
   {
      jQuery('#'+feld+'_'+spzuvor).val(tiny.getContent());
      tiny.setContent(jQuery('#'+feld+'_'+sprache).val());
   }
   else
   {
      jQuery('#'+feld+'_'+spzuvor).val(jQuery('#'+feld).val());
      jQuery('#'+feld).val(jQuery('#'+feld+'_'+sprache).val());
   }
   jQuery('#'+feld+'_sprache').val(sprache);
   jQuery('#'+feld+'_sprachelink'+sprache).css('height',20);
   jQuery('#'+feld+'_sprachelink'+spzuvor).css('height',14);
}

function SwitchTextHtml(f, feld)
{
   if (jQuery(f).prop('checked'))
     SetEditorContent('tiny'+feld, jQuery('#'+feld+'_text').val());
   else
     jQuery('#'+feld+'_text').val(GetEditorContent('tiny'+feld));
   ShowHide('#'+feld+'_div1', !jQuery(f).prop('checked'));
   ShowHide('#'+feld+'_div2', jQuery(f).prop('checked'));
}

function ProgrammPunkteDisable(vaids,grp)
{
   for(var i=0; i<vaids.length; i++)
   {
      jQuery('#programmpunkt'+vaids[i]+grp).prop('checked',false);
      jQuery('#anmeldeoptionenprogrammpunkt'+vaids[i]+grp).hide();
   }
}

function ProgrammpunkteDisableAbmeldung(wrt)
{
   jQuery('input.programmpunkt').prop('disabled',wrt==1);
   if (wrt==1) jQuery('input.programmpunkt').prop('checked',false);

   jQuery.each( jQuery("input,select"), function(key, value)
   {
      if (jQuery(this).attr('name').indexOf('key_')>=0) { jQuery(this).prop('disabled',wrt==1); if (wrt==1) jQuery(this).val(''); }
   });
}

function ProgrammPunkteShowOptionen(enabled,ppid)
{
   if (enabled)
      jQuery('#anmeldeoptionen'+ppid).show();
   else
      jQuery('#anmeldeoptionen'+ppid).hide();
}

function ProgrammPunkteMaxCheck(enabled,ppid,vaids,grp,maxpps)
{
   if (enabled)
   {
      var cnt=0;
      for(var i=0; i<vaids.length; i++) if (jQuery('#programmpunkt'+vaids[i]+grp).prop('checked')) cnt++;
      if (cnt>maxpps) { alert('Es duerfen maximal '+maxpps+' Programmpunkte gewaehlt werden!'); jQuery('#'+ppid).prop('checked',false); }
   }
}

function ProgrammPunkteAlle(cls)
{
   jQuery(cls).each(function() { jQuery(this).prop('checked',true); jQuery(this).trigger('change'); });
}

function ProgrammPunkteKeiner(cls)
{
   jQuery(cls).prop('checked',false)
}

function FilterLuftRoute()
{
   var l=jQuery('#filterluft').val();
   var r=jQuery('#filterroute').val();
   for (var i=0; i<entfernung.length; i++)
   {
      var sh=(l!='' && entfernung[i][1]<=parseInt(l)) || (r!='' && entfernung[i][2]<=parseInt(r)) || (l=='' && r=='');
      if (!sh) jQuery('#user'+entfernung[i][0]).prop('checked', false);
      if (sh) jQuery('#spanuser'+entfernung[i][0]).show(); else jQuery('#spanuser'+entfernung[i][0]).hide();
   }
}

function AngebotsPositionAuswahl(wnd, pos, txt, txtlang, betrag, mwst, nettobrutto, konto, artikelid, preiseB, preiseN, kontoname, veranstaltungid, lager, eknetto, ekbrutto, rechnungsnummer)
{
   var el;

   betrag=GetKommaZahlWert(betrag);
   el=wnd.document.getElementById('nettobrutto');
   if (el!=null && el!='undefined') if (el.value=='n' && nettobrutto=='b' && mwst>0) betrag=Math.round(100*betrag*100/(100+parseFloat(mwst)))/100;
   if (el!=null && el!='undefined') if (el.value=='b' && nettobrutto=='n' && mwst>0) betrag=Math.round(100*betrag*(100+parseFloat(mwst))/100)/100;

   var hidetext=jQuery('#keintextlang').prop('checked');
   el=wnd.document.getElementById('text'+pos); if (el!=null && el!='undefined') el.value=txt;
   if (!hidetext) { el=wnd.document.getElementById('textlang'+pos); if (el!=null && el!='undefined') el.value=txtlang; }
   el=wnd.document.getElementById('betrag'+pos); if (el!=null && el!='undefined') el.value=betrag;
   el=wnd.document.getElementById('mwst'+pos); if (el!=null && el!='undefined') el.value=mwst;
   el=wnd.document.getElementById('nettobrutto'+pos); if (el!=null && el!='undefined') el.value=nettobrutto;
   el=wnd.document.getElementById('konto'+pos); if (el!=null && el!='undefined') el.value=konto;
   el=wnd.document.getElementById('kontopickerkonto'+pos); if (el!=null && el!='undefined') el.value=kontoname;
   el=wnd.document.getElementById('kontodetailskonto'+pos); if (el!=null && el!='undefined') el.value=konto;
   if (!hidetext) { el=wnd.document.getElementById('spantext'+pos); if (el!=null && el!='undefined') if (txtlang.length>0) el.style.display=''; }
   el=wnd.document.getElementById('artikelid'+pos); if (el!=null && el!='undefined') el.value=artikelid;
   el=wnd.document.getElementById('veranstaltungid'+pos); if (el!=null && el!='undefined') el.value=veranstaltungid;
   if (nettobrutto=='n') { jQuery('#preiseB'+pos).hide(); jQuery('#preiseN'+pos).show(); } else { jQuery('#preiseB'+pos).show(); jQuery('#preiseN'+pos).hide(); } 
   jQuery('#preiseB'+pos).html(preiseB);
   jQuery('#preiseN'+pos).html(preiseN);
   jQuery('#lager'+pos).html(lager);
   jQuery('#preise'+pos).html(betrag);
   jQuery('#betrag'+pos).trigger('change');
   jQuery('#ekbrutto'+pos).val(ekbrutto);
   jQuery('#eknetto'+pos).val(eknetto);
   if (rechnungsnummer!='' && rechnungsnummer!=undefined) jQuery('#rechnungsnummer').val(rechnungsnummer);

   el=wnd.document.getElementById('betrag'+pos);
   jQuery(el).trigger('change');
}

function StdAktionAuswahl(wnd, feldname, txt, trigger)
{
   var el=wnd.document.getElementById(feldname);
   if (el!=null && el!='undefined') { if (txt!='') el.value=el.value+(el.value==''?'':'\n')+txt; if (trigger) { jQuery(el).trigger('change'); wnd.SetDirtyDirect(); } }
}

function UpdateColors(layoutAlt, layoutNeu)
{
   if (layoutAlt==layoutNeu) return;

   var primaer=jQuery('#templatePrimaer').val();
   var color=jQuery('#templatePrimaerCol').val();
   var sekundaer=jQuery('#templateSekundaer').val();
   var colorSekundaer=jQuery('#templateSekundaerCol').val();

   ColorsClear();
   SetPriColor(window, layoutNeu, primaer, color, sekundaer, colorSekundaer);
}

function SetPriColor(wnd, layout, primaer, color, sekundaer, colorSekundaer)
{
   if (primaer!='') jQuery(wnd.document.getElementById('primaer')).css('background-color', primaer).css('color', color);
   if (primaer!='') jQuery(wnd.document.getElementById('templatePrimaer')).val(primaer);
   if (primaer!='') jQuery(wnd.document.getElementById('templatePrimaerCol')).val(color);
   jQuery(wnd.document.getElementById('sekundaer')).css('background-color', sekundaer).css('color', colorSekundaer);
   jQuery(wnd.document.getElementById('templateSekundaer')).val(sekundaer);
   jQuery(wnd.document.getElementById('templateSekundaerCol')).val(colorSekundaer);
   if (layout=='ResponsiveV3') return;

   SetLayoutColor(wnd, 'TopColFarbe', primaer);
   SetLayoutColor(wnd, 'NavColFarbe', primaer); SetLayoutColor(wnd, 'NavBackFarbe', color);
   SetLayoutColor(wnd, 'NavActBackFarbe', primaer); SetLayoutColor(wnd, 'NavActColFarbe', color);
   SetLayoutColor(wnd, 'NavHovBackFarbe', sekundaer); SetLayoutColor(wnd, 'NavHovColFarbe', colorSekundaer);
   SetLayoutColor(wnd, 'BtnHovBackFarbe', sekundaer); SetLayoutColor(wnd, 'BtnHovColFarbe', colorSekundaer);
   SetLayoutColor(wnd, 'BtnBackFarbe', primaer); SetLayoutColor(wnd, 'BtnColFarbe', color);
   SetLayoutColor(wnd, 'H1ColFarbe', primaer);
   SetLayoutColor(wnd, 'H2ColFarbe', primaer);
   SetLayoutColor(wnd, 'LinkColFarbe', primaer);
   SetLayoutColor(wnd, 'LinkHovColFarbe', sekundaer);
   SetLayoutColor(wnd, 'THBackFarbe', primaer); SetLayoutColor(wnd, 'THColFarbe', color);
   SetLayoutColor(wnd, 'FootColFarbe', primaer);

   if (layout=='ResponsiveV5')
   {
      SetLayoutColor(wnd, 'Nav1ColFarbe', primaer);
      SetLayoutColor(wnd, 'Nav1ActColFarbe', sekundaer);
      SetLayoutColor(wnd, 'Nav1HovColFarbe', sekundaer);
      SetLayoutColor(wnd, 'Nav2BackFarbe', sekundaer); SetLayoutColor(wnd, 'Nav2ColFarbe', primaer);
      SetLayoutColor(wnd, 'Nav2ActBackFarbe', primaer); SetLayoutColor(wnd, 'Nav2ActColFarbe', sekundaer);
      SetLayoutColor(wnd, 'Nav2HovBackFarbe', primaer); SetLayoutColor(wnd, 'Nav2HovColFarbe', sekundaer);
   }
   else
   {
      SetLayoutColor(wnd, 'Nav1ActBackFarbe', sekundaer); SetLayoutColor(wnd, 'Nav1ActColFarbe', colorSekundaer);
      SetLayoutColor(wnd, 'Nav1HovBackFarbe', sekundaer);SetLayoutColor(wnd, 'Nav1HovColFarbe', colorSekundaer);
      SetLayoutColor(wnd, 'Nav2ColFarbe', primaer);
      SetLayoutColor(wnd, 'Nav2ActBackFarbe', sekundaer);
      SetLayoutColor(wnd, 'Nav2HovColFarbe', sekundaer);
   }
}

function SetLayoutColor(wnd, feld, col)
{
   if (col=='') return;
   jQuery(wnd.document.getElementById('template'+feld)).css('background-color', col).val(col);
   jQuery(wnd.document.getElementById('template'+feld)).next().find('.Icon .Color').css('background-color', col);
}

function ColorsClear()
{
   jQuery("input[name^='template'].colorPicker").val('').css('background-color','#ffffff').next().find('.Icon .Color').css('background-color', '#ffffff');
   jQuery('#primaer').css('background-color','#ffffff').css('color','#000000');
   jQuery('#sekundaer').css('background-color','#ffffff').css('color','#000000');
}

function StdAktionImage(wnd, feldname, file)
{
   var el=wnd.document.getElementById(feldname);
   if (el!=null && el!='undefined') jQuery(el).html('<IMG src="" style="height:200px;max-width:100%;">');
   if (el!=null && el!='undefined') jQuery(el).html('<IMG src="'+file+'" style="height:200px;max-width:100%;">');
}

function SaveHierarchie(gruppenid)
{
   var result='';
   jQuery('.minus:visible').each(function() { result=result+jQuery(this).attr('name')+'~~~'; });
   if (result=='') result='-';
   jQuery.ajax({ type: 'GET', url: './?webservice=hierarchie&gruppenid='+gruppenid+'&status='+encodeURIComponent(result) });
}

function FileSelectorFindInput(elem)
{
   while (elem!=undefined && elem.tagName.toLowerCase()!='input') elem=elem.children[0];
   return elem;
}

function FileSelectorFindDiv(elem, start)
{
   while (elem!=undefined && elem.parentNode!=undefined && !(elem.tagName.toLowerCase()=='div' && elem.id.substring(0,start.length)==start)) elem=elem.parentNode;
   return elem.id.substring(start.length); 
}

function SendLogin(form)
{
   if (form=='') form='formlogin';
   var frm1=document.getElementById(form);
   var el=frm1.elements['newtoken'];
   if (el) 
   {
      SetFormValue(form,'newtoken',md5(GetFormValue(form,'newpassword')));
      SetFormValue(form,'newpassword','');
   }
   DirectFormSubmit(form);
}

function CheckAndSendLogin(form)
{
   if (form=='') form='formlogin';
   var frm1=document.getElementById(form);
   var elUsr=frm1.elements['newuser'];
   var data='newuser='+encodeURIComponent(elUsr.value);
   var pwd=GetFormValue(form,'newpassword');
   var el=frm1.elements['newtoken'];
   if (el) 
   {
      var hash=md5(pwd);
      data=data+'&newtoken='+hash;
      SetFormValue(form,'newtoken',hash);
      SetFormValue(form,'newpassword','');
   }
   else
      data=data+'&newpassword='+encodeURIComponent(pwd);
   jQuery('#loginerror').hide();
   jQuery.ajax({ type: 'POST', url: './?webservice=checklogin', data: data, success: function(result)
     {
        if (result=='ok') DirectFormSubmit(form); else { jQuery('#loginerror').html(result); jQuery('#loginerror').show(); }
     }
   });
}

function AuswahlPDFSektion(sektion)
{
   jQuery('.adminpdflink').removeClass('adminpdfauswahl');
   jQuery('.adminpdflink').addClass('adminpdf');
   jQuery('#lnk'+sektion).removeClass('adminpdf');
   jQuery('#lnk'+sektion).addClass('adminpdfauswahl');

   var alt=jQuery('#current').val();
   if (alt!='-') jQuery('#sekname'+alt).val(jQuery('#sekname').val());
   if (alt!='-') jQuery('#toolbox'+alt).html(jQuery('#sekname').val());
   var inhalt=jQuery('#pdf').val();
   if (alt!='-') jQuery('#sek'+alt).val(inhalt);
   if (alt!='-') jQuery('#lnk'+alt+' A').css('font-weight', inhalt==''?'normal':'bold');
   if (alt!='-' && inhalt=='') jQuery('#lnk'+sektion).addClass('ohne');
   if (alt!='-' && inhalt!='') jQuery('#lnk'+sektion).removeClass('ohne');
   
   jQuery('#sekname').val(jQuery('#sekname'+sektion).val());
   jQuery('#pdf').val(jQuery('#sek'+sektion).val());

   jQuery('#current').val(sektion);
}

function SpeichernPDFSektion()
{
   var alt=jQuery('#current').val();
   if (alt!='-') jQuery('#sekname'+alt).val(jQuery('#sekname').val());
   if (alt!='-') jQuery('#sek'+alt).val(jQuery('#pdf').val());
}

function ErsetzeBeitraege(id)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=ersetzebeitraege&id='+id, success: function(result) 
   {
      jQuery('#userbeitraege').html(result);
   } });
}

function ErsetzeMitgliedInListe(id)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=ersetzemitgliedinliste&id='+id, success: function(result) 
   {
      jQuery('#row'+id).html(result);
   } });
}

function ErsetzeGruppeInListe(id,offsetisgrp)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=gruppeninfo&id='+id, success: function(result) 
   {
      var data=result.split('\n');
      jQuery('#row'+id+' TD:nth-child(1)').html(data[0]);
      if (offsetisgrp==1) jQuery('#row'+id+' TD:nth-child(2)').html(data[4]);
      jQuery('#row'+id+' TD:nth-child('+(2+offsetisgrp)+')').html(data[1]);
      jQuery('#row'+id+' TD:nth-child('+(3+offsetisgrp)+') A').html(data[2]);
      jQuery('#row'+id+' TD:nth-child('+(4+offsetisgrp)+')').html(data[3]);
   } });
}

function ErsetzeVARaeume(vids,id)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=ersetzevaraeume&vids='+vids+(id==0?'':'&id='+id), success: function(result) 
   {
      jQuery('#veranstaltungraeume').html(result);
   } });
}

function CheckMaxDetails(cls,max)
{
   var cnt=jQuery('.row_'+cls).length;
   if (cnt>max) { alert('Die maximale Positionenzahl von '+max+' ist bereits erreicht'); return false; }
   return true;
}

// divKEY, KEY0
function ItemsAddLine(key)
{
   var elem=jQuery('#'+key+'0').clone();
   var cnt=1; while (jQuery('#'+key+cnt).length>0) cnt++;
   elem.show();
   ItemsSetIDLine(elem,key,cnt);
   elem.appendTo('#div'+key);
   return cnt;
}
function ItemsRemoveLine(key,nr)
{
   var elem=jQuery('#'+key+nr);
   elem.hide();
   ItemsSetIDLine(elem,key,nr);
}
function ItemsSetIDLine(elem,key,nr)
{
   elem.attr('id',key+nr);
   elem.find('input:not([type]), input[type=text], input[type=hidden], textarea, select').each(function(index, value) {
     var name=jQuery(this).attr('name');
     name=name.substr(0,name.length-1)+nr;
     jQuery(this).attr('name',name);
     jQuery(this).attr('id',name);
     jQuery(this).val('');
     if (jQuery(this).attr('onclick')) jQuery(this).attr('onclick',jQuery(this).attr('onclick').replace('konto0','konto'+nr).replace('konto0','konto'+nr));
     if (jQuery(this).attr('onchange')) jQuery(this).attr('onchange',jQuery(this).attr('onchange').replace('konto0','konto'+nr).replace('konto0','konto'+nr));
   });
   elem.find('input[type=checkbox]').each(function(index, value) {
     var name=jQuery(this).attr('name');
     name=name.substr(0,name.length-1)+nr;
     jQuery(this).attr('name',name);
   });
   elem.find('span.spantext, span.preise').each(function(index, value) {
     var id=jQuery(this).attr('id');
     id=id.substr(0,id.length-1)+nr;
     jQuery(this).attr('id',id);
   });
   elem.find('.weblink').each(function(index, value) {
     jQuery(this).attr('onclick',"javascript:ItemsRemoveLine('"+key+"','"+nr+"');return false;");
   });
   elem.find('a.toggle').each(function(index, value) {
     jQuery(this).attr('onclick',"javascript:Toggle('spantext"+nr+"');return false;");
   });
   elem.find('a.angebotspos').each(function(index, value) {
     jQuery(this).attr('onclick',jQuery(this).attr('onclick').replace('&pos=0','&pos='+nr));
     jQuery(this).attr('href',jQuery(this).attr('href').replace('&pos=0','&pos='+nr));
   });
   elem.find('a.kontopicker').each(function(index, value) {
     jQuery(this).attr('onclick',jQuery(this).attr('onclick').replace('konto0','konto'+nr).replace('konto0','konto'+nr));
     jQuery(this).attr('href',jQuery(this).attr('href').replace('konto0','konto'+nr).replace('konto0','konto'+nr));
   });
   elem.find('select.kontopicker').each(function(index, value) {
     jQuery(this).attr('onchange',jQuery(this).attr('onchange').replace('konto0','konto'+nr).replace('konto0','konto'+nr));
   });
}

function ZuordnenReset()
{
    jQuery('.sammelcheckbox').prop('checked',false);
    jQuery('.ruecklastcheck').prop('checked',false);
}

function ShowPassendeBuchungen(betrag, zweck, checkmnr)
{
   var cls='betrag'+(betrag>=0?'P':'N')+round2(betrag>=0?betrag*100:-betrag*100);
   var ok=false;
   jQuery('.offenebuchung').hide();
   if (zweck.length>0) jQuery('.offenebuchung').each( function() { if (jQuery(this).attr('renr')!='') if (ScharferReCheck(zweck, jQuery(this).attr('renr'))) { jQuery(this).show(); ok=true; } });
   if (ok==false && zweck.length>0) jQuery('.offenebuchung').each( function() { if (jQuery(this).attr('renr')!='') if (UnscharferReCheck(zweck, jQuery(this).attr('renr'))) { jQuery(this).show(); ok=true; } });
   if (checkmnr && ok==false && zweck.length>0) jQuery('.offenebuchung').each( function() { if (jQuery(this).attr('minr')!='') if (ScharferReCheck(zweck, jQuery(this).attr('minr'))) { jQuery(this).show(); ok=true; } });
   //if (ok==false && zweck.length>0) jQuery('.offenebuchung').each( function() { if (jQuery(this).attr('minr')!='') if (UnscharferReCheck(zweck, jQuery(this).attr('minr'))) { jQuery(this).show(); ok=true; } });
   if (ok==false) jQuery('.'+cls).show();
}

function IsEnter(evn)
{
   if (window.event && window.event.keyCode == 13) return true; // IE
   if (evn && evn.keyCode == 13) return true; // FireFox
   return false;
}

function enterPressed(evn)
{
   if (IsEnter(evn)) form1.submit();
}
function enterPressed2(evn)
{
   if (IsEnter(evn)) form2.submit();
}
function enterPressedForm(evn,form)
{
   if (IsEnter(evn)) document.getElementById(form).submit();
}
function enterPressedFormDirty(evn,form)
{
   if (IsEnter(evn)) { if (DirtyMessage()) document.getElementById(form).submit(); evn.preventDefault(); }
}
function enterAvoid(evn)
{
   if (IsEnter(evn)) evn.preventDefault();
}

function CheckBegleiter(check)
{
   var fehler=0;
   jQuery.each( jQuery("input[name^='nachname']:visible"), function(key, value) { if (jQuery(this).attr('name')!='nachname') { var leer=jQuery(this).val().trim()==''; if (check) jQuery(this).css('background-color',leer?'#FFA0A0':''); else if (leer) jQuery(this).val('-'); if (leer) fehler++; } });
   jQuery.each( jQuery("input[name^='vorname']:visible"), function(key, value) { if (jQuery(this).attr('name')!='vorname') { var leer=jQuery(this).val().trim()==''; if (check) jQuery(this).css('background-color',leer?'#FFA0A0':''); else if (leer) jQuery(this).val('-'); if (leer) fehler++; } });
   if (!check) return true;
   if (fehler>0) alert('Bitte Vorname und Nachname der Begleiter fuellen');
   return fehler==0;
}

var ddstartindex;
function BoxDragStart(event,ui)
{
   ddstartindex=ui.item.index();
}

function BoxDragStop(event,ui)
{
   if (jQuery(this).attr('id')==ui.item.parent().attr('id'))
   {
      // gleiche Spalte
      BoxDragMove(ui.item.attr('id'), jQuery(this).attr('id'), ui.item.index(), ddstartindex+1);
   }
}

function BoxDragReceive(event,ui)
{
   // wechsel Spalte
   BoxDragMove(ui.item.attr('id'), jQuery(this).attr('id'), ui.item.index(), 0);
}

function BoxDragMove(id, block, pos, vorpos)
{
   //alert('ID '+id+', Block '+block+', Pos '+pos+', Vor '+vorpos);
   jQuery.ajax({ type: 'GET', dataType: 'json', url: './?webservice=movewebpart&id='+id.substring(2)+'&block='+block.substring(7)+'&pos='+pos+'&vor='+vorpos});
}

function BoxDragDrop()
{
   var d='';
   jQuery.each( jQuery('.webpartbox'), 
      function(key, value) 
      {
         d=d+value.id+': ';
         jQuery.each( jQuery(this).children('div'), 
            function(key2, value2) 
            {
               d=d+', '+value2.id;
            }
         );
         d=d+'\n';
      }
   );
   alert(d);
}

function KasseNeuePosition(mwst, konto)
{
   var p=ItemsAddLine('position');
   jQuery('#nettobrutto'+p).val("b");
   jQuery('#mwst'+p).val(mwst);
   jQuery('#position'+p+' td:first').html(p+1);
   KontoPickerSetze('konto'+p,konto);
   ArtikelPickerEnable('text'+p,p,'*','','mitglied',0);
   KontoPickerEnable('konto'+p,'');
}

function KontenNeuePosition()
{
   var p=ItemsAddLine('zeile');
   KontoPickerEnable('konto'+p,'');
   jQuery('#zeile'+p+' td:nth-child(3)').html('');
   jQuery('#zeile'+p+' td:nth-child(4)').html('');
}

function CalcBruttoNetto(feldbetrag, feldmwst)
{
   var mwst=GetKommaZahl(feldmwst); if (mwst==0) return;
   var betrag=GetKommaZahl(feldbetrag); 
   var brutto=jQuery('#checkbetragbrutto').prop('checked'); 
   if (brutto) betrag=betrag*(100+mwst)/100; else betrag=betrag*100/(100+mwst);
   jQuery('#'+feldbetrag).val(betrag); 
}

function TaskAddLink(quelle, ziel, el)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=task&quelle='+quelle+'-'+ziel, success: function(result) 
   {
      if (result[0]=='#') alert(result.substring(1)); else el.html(result);
   } });
}

function ErgaenzeFelder(listenid, id, nr)
{
   jQuery.ajax({ type: 'GET', dataType: 'json', url: './?webservice=listendaten&listenid='+listenid+'&id='+id+'&nr='+nr, success: function(result) 
   {
      jQuery('#firma').val(result.name);
      if (result.strasse==undefined) jQuery('#g_strasse').val(''); else jQuery('#g_strasse').val(result.strasse+' '+result.hausnummer);
      jQuery('#g_plz').val(result.plz);
      jQuery('#g_ort').val(result.gemeinde);
      jQuery('#g_telefon').val(result.telefon);
      if (id!=0) jQuery('#key_DstNr').val(result.nr);
      if (id==0) jQuery('#key_DstSchl').val(result.id);
   } });
}

function EntferneDatenablageFile(key,nr)
{
   jQuery('#datenfile'+key+'_'+nr).hide();
   jQuery('#datenablage'+key+'_000'+nr).val('');
}

var extrafilecontrolnr = {};
function AddExtraFile(name)
{
   if (extrafilecontrolnr[name]==undefined) extrafilecontrolnr[name]=1; else extrafilecontrolnr[name]=extrafilecontrolnr[name]+1;
   var elem = document.getElementById('div'+name+'0').cloneNode(true);
   ClearExtraFile(name,elem,extrafilecontrolnr[name],'block');
   document.getElementById('div'+name+'root').appendChild(elem);
}
function RemoveExtraFile(name,nr)
{
   var elem = document.getElementById('div'+name+nr);
   ClearExtraFile(name,elem,nr,'none');
}
function ClearExtraFile(name,elem,nr,display)
{
   elem.id='div'+name+nr;
   elem.style.display=display;
   var elem1=FileSelectorFindInput(elem);
   elem1.name=name+'_'+nr;
   elem1.id=elem1.name;
   if (display=='none') jQuery(elem).html('');
}

function EventLoadExtrafields(userid, rechnunggp)
{
   if (userid==0) { jQuery('#firma').val(''); jQuery('#strasse').val(''); jQuery('#ort_plz').val(''); jQuery('#ort_ort').val(''); jQuery('#ort_land').val(''); jQuery('#telefonnummer').val(''); jQuery('#email').val(''); return; }
   jQuery("input[type='radio']").css('padding','100px');
   jQuery.ajax({ url: './?webservice=eventanmelden', dataType: 'json', data: { id:userid, rechnunggp:rechnunggp }, success: function( data )
   {
      for(var n=0; n<data.length; n++)
      {
         if (data[n].key.substr(0,4)=='key_')
         {
            jQuery("input[name='"+data[n].key+"'][type='radio'][value='"+data[n].value+"']").prop('checked',true);
            jQuery("input[name='"+data[n].key+"'][type='checkbox'][value='"+data[n].value+"']").prop('checked',true);
            jQuery("input[name='"+data[n].key+"'][type='text']").val(data[n].value);
            jQuery("input[name='"+data[n].key+"']:not([type])").val(data[n].value);
            jQuery("select[name='"+data[n].key+"']").val(data[n].value);
         }
         else
         {
            var feld=data[n].key;
            if (feld=='telefon') feld='telefonnummer';
            if (feld=='plz' || feld=='ort' || feld=='land') feld='ort_'+feld;
            jQuery('#'+feld).val(data[n].value);
         }
      }
   } });
}

function AddGppAuswahl(id, name)
{
   jQuery("<option/>").val(id).text(name).appendTo('#adressauswahl');
   jQuery('#adressauswahl').val(id);
   jQuery('#adressauswahl').trigger('change');

   jQuery("<option/>").val(id).text(name).appendTo('#adressauswahlliefer');
}

function TriggerChange()
{
   jQuery('#mitglied').trigger('change');
}

function CheckEinwilligung(txt, id)
{
   if (jQuery('#'+id).prop('checked')) return true;
   alert(txt);
   return false;
}

function checkCookie_eu()
{
   var consent = getCookie_eu("cookies_consent");
   if (consent == null || consent == "" || consent == undefined) jQuery('#cookie_directive_container').show();
}

function setCookie_eu(c_name,value,exdays)
{
   setCookie(c_name,value,exdays);
   jQuery('#cookie_directive_container').hide('slow');
}

function setCookie(c_name,value,exdays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = encodeURIComponent(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie = c_name + "=" + c_value+"; path=/";
    //alert(c_name + "=" + c_value+"; path=/");
}

function getCookie_eu(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name) return unescape(y);
    }
}

function WeiteresElementHinzufuegen(id, pos, elementnr, dialog)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=htmlelement&id='+id+'&pos='+pos+'&elementnr='+elementnr+'&dialog='+dialog, success: function(result) 
   {
      var parent=jQuery('#elementneu'+id+'-'+elementnr).parent();
      jQuery('#elementneu'+id+'-'+elementnr).hide();
      parent.append(result);
   } });
}

function SpaltenAusblenden(liste,etcbeginn)
{
   for(i=0; i<liste.length; i++) jQuery('table.table.responsivetable td:nth-child('+(liste[i]+etcbeginn)+')').hide();   // :not(:last-child)
}
function SpalteAusblenden(col,tag,etcbeginn)
{
   var c=col-etcbeginn;
   jQuery('table.table.responsivetable td:nth-child('+col+')').hide();
   jQuery.ajax({ type: 'GET', url: './?webservice=setcookie&col='+c+'&tag='+tag });
}
function SpaltenEinblenden(tag)
{
   jQuery('table.table.responsivetable td').show();
   jQuery.ajax({ type: 'GET', url: './?webservice=setcookie&col=-&tag='+tag });
}

function ShowSammel(zt)
{
   OpenRegister(3,'');
   jQuery('#sammel_'+zt).prop('checked',true);
   Recalc();
}

function ShowOffeneRe(ids)
{
   OpenRegister(1,'');
   var id=ids[0];
   jQuery('#offenerechnungen .offenebuchung').hide();
   jQuery('#offenerechnungen .offrecheckbox').prop('checked',false);
   jQuery('#row'+id).show();
   jQuery('#row'+id+' .offrecheckbox').prop('checked',true);
}

function ShowRuecklast(liste)
{
   OpenRegister(4,'');
   for(i=0; i<liste.length; i++) jQuery('#rueck'+liste[i]).prop('checked',true).trigger('click');
   jQuery('.ruecklistrow').hide();
   for(i=0; i<liste.length; i++) jQuery('.ruecklistrow'+liste[i]).show();
   jQuery('#ruecklastalle').show();
}

function BerechneRuecklast(ibanre,ibanprofil)
{
   var su=0;
   jQuery.each( jQuery(".ruecklastcheck:checked"), function(key, value) { su+=parseFloat(jQuery(this).val()); });
   jQuery('#rueckbetraggebuehr').html((parseFloat(jQuery('#rueckbetrag').html())-su).toFixed(2))
   if (ibanre==ibanprofil)
   {
      jQuery('#rueckzahlart1').val('1');
      jQuery('#rueckzahlart2').val('1');
      jQuery('.rueckibans').html((ibanre==''?'':'<FONT color="red">'+ibanre+' = IBAN Originalrechnung = IBAN aktuelles Mitgliederprofil</FONT>'));
   }
   else
   {
      jQuery('#rueckzahlart1').val('3');
      jQuery('#rueckzahlart2').val('3');
      jQuery('.rueckibans').html((ibanre==''?'':'<FONT color="red">'+ibanre+' = IBAN Originalrechnung</FONT><BR>')+(ibanprofil==''?'':'<FONT color="green">'+ibanprofil+' = IBAN aktuelles Mitgliederprofil</FONT>'));
   }
}

function ShowRuecklastAlle()
{
   jQuery('.ruecklistrow').show();
   jQuery('#ruecklastalle').hide();
}

function ResetRuecklast()
{
   OpenRegister(1,'');
   jQuery('.ruecklistrow').show();
   jQuery('#ruecklastalle').hide();
}

function Kollisionswarner(el)
{
   if (el.value!='') jQuery.ajax({ type: 'GET', url: './?webservice=kollisionswarner&datum='+el.value, success: function(result) { jQuery('#kollisionswarner').html(result); } });
}

function GetGuiUpdate(data, selector, fkt)
{
   jQuery(selector).html('<IMG SRC="https://www.vereinonline.org/admin/img/ajax.gif">');
   jQuery.ajax({ type: 'GET', url: './?webservice=gui&act='+data, success: function(result) { if (result=='##') return; jQuery(selector).html(result); if (fkt) fkt(); } });
}

function InfoHide()
{
   jQuery('#infoxxx').hide();
}

function SetTreeSelection(id, element)
{
   jQuery('#'+id+' A').css('background-color','');
   jQuery(element).css('background-color','#e0e0e0');
}

function SetzePostfachStatus(id, status, art, postfachid)
{
   if (status==0) SetMbxCommand('ungelesen',postfachid,art,id);
   if (status==1) SetMbxCommand('gelesen',postfachid,art,id);
   if (status==2) SetMbxCommand('delete',postfachid,art,id);
}

function ShowGelesen(postfach,uid,open)
{
   if (jQuery('.row'+uid).hasClass('ungelesengruen')) ShowPostfachPostfachMark(postfach,-1);
   if (open) { jQuery('#mainlistbody TR').removeClass('mailopen'); jQuery('.row'+uid).addClass('mailopen'); }
   jQuery('.row'+uid).removeClass('ungelesengruen');
}

function ShowUngelesen(postfach,uid)
{
   if (!jQuery('.row'+uid).hasClass('ungelesengruen')) ShowPostfachPostfachMark(postfach,1);
   jQuery('.row'+uid).removeClass('mailopen');
   jQuery('.row'+uid).addClass('ungelesengruen');
}

function SetMbxCommand(cmd,postfach,art,uid)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=mbxcommand&cmd='+cmd+'&postfach='+postfach+'&art='+art+'&id='+uid });
   if (cmd=='gelesen') { ShowGelesen(postfach,uid,false); }
   if (cmd=='ungelesen') { ShowUngelesen(postfach,uid); }
   if (cmd=='delete') { jQuery('.row'+uid).remove(); jQuery('#postfachmail').html(''); }
   if (cmd=='moveinbox') { jQuery('.row'+uid).remove(); jQuery('#postfachmail').html(''); }
}

function SetzePostfachStatusList(ids, status, art, postfachid)
{
   for(i=0; i<ids.length; i++) SetzePostfachStatus(ids[i], status, art, postfachid);
}

function SetzePostfachStatusISZ(id, status, folderid, postfachid)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=postfachstatus&id='+id+'&status='+status+'&folderid='+folderid+'&postfachid='+postfachid, success: function(result) { ShowPostfachFolderMark(folderid, result); } });
   if (status==0) jQuery('.row'+id).removeClass('mailopen').addClass('ungelesengruen');
   if (status==1) jQuery('.row'+id).removeClass('mailopen').removeClass('ungelesengruen');
   if (status==2) jQuery('.row'+id).remove();
   if (status==3) jQuery('.row'+id).remove();
}

function SetzePostfachStatusListISZ(ids, status, folderid, postfachid)
{
   for(i=0; i<ids.length; i++) SetzePostfachStatusISZ(ids[i], status, folderid, postfachid);
}

function UpdatePostfachFolderMark(folderid, postfachid)
{
   var list=jQuery('#postfach_postfach'+postfachid+'-'+folderid);
   jQuery.ajax({ type: 'GET', url: './?webservice=postfachstatus&id=0&folderid='+folderid+'&postfachid='+postfachid+(list.length>0?'&cmd=html':''), success: function(result)
   {
      if (list.length>0)
      {
         var html=result.substr(result.indexOf(',')+1);
         result=result.substr(0, result.indexOf(','));
         if (html!='')
         {
            var selector='#postfach_postfach'+postfachid+'-'+folderid+' tbody';
            if (jQuery(selector+' tr').length>0)
               jQuery(html).insertBefore(selector+' tr:nth-child(1)');
            else
               jQuery(html).appendTo(selector);
            ActivateDragDrop();
         }
      }
      ShowPostfachFolderMark(folderid, result); 
   } });
}

function ShowPostfachFolderMark(folderid, cnt)
{
   jQuery('#marker'+folderid).html(cnt); if (cnt==0) jQuery('#marker'+folderid).hide(); else jQuery('#marker'+folderid).show();
}

function ShowPostfachPostfachMark(postfachid, delta)
{
   var cnt=parseInt(jQuery('.markerpostfach'+postfachid).html())+delta;
   jQuery('.markerpostfach'+postfachid).html(cnt); if (cnt<=0) jQuery('.markerpostfach'+postfachid).hide(); else jQuery('.markerpostfach'+postfachid).show();
}

function SendKontaktMailWeb(webpartid)
{
   jQuery.ajax({ type: 'POST', url: './?webservice=sendkontaktmail', data:jQuery('#formkontakt'+webpartid).serialize(), success: function(result)
   {
      jQuery('#mailresult'+webpartid).html(result); if (result.indexOf('errorbox')<0) jQuery('#mailformular'+webpartid).hide();
   } });
}

function SaveMailZuordnung()
{
   jQuery.ajax({ type: 'POST', url: './', data:jQuery('#formmail').serialize() });
}

function LoadmitglieddataSignatur(itm)
{
   var signatur='';
   if (itm!=0)
   {
      jQuery.ajax({ type: 'POST', url: './?webservice=member&art=1', data: 'wert='+itm, success: function(result)
      {
         eval('werte='+result);
         signatur=werte['signatur'];
         signatur=signatur.replace(/~~~/g, "<br>\r\n");
         if (signatur=='') signatur=jQuery('#signaturstandard').val();
         tinyMCE.get('edt2').setContent(signatur);
      } });
   }
   else
   {
      signatur=jQuery('#signaturstandard').val();
      tinyMCE.get('edt2').setContent(signatur);
   }
}

function ShowNachRechtsLink(cls)
{
   //alert(cls + ', ' + jQuery(cls).width()+' < '+jQuery('#mainlist').width());
   ShowHide('#nachrechts', jQuery(cls).width()<jQuery('#mainlist').width());
}
function ScrollRechts(element)
{
   var l=jQuery(element).scrollLeft();
   jQuery(element).animate({ scrollLeft: l+400 }, 'fast');
}

function TanAbsenden()
{
   var tan=jQuery('#tan').val();
   jQuery.ajax({ type: 'GET', url: './?webservice=tanabsenden&tan='+tan+'&ts='+jQuery('#ts').val() });
   jQuery('#data').html('TAN '+tan+' gespeichert<br><br>');
   jQuery('#eingabe').hide();
   ResetDirty();
}

function TestFkt()
{
   jQuery.ajax({ type: 'GET', url: './?webservice=testfkt', success: function(result) { alert(result); } });
}

function ForumNotify(enable, id, ext)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=forumnotify&cmd='+(enable?'add':'remove')+'&id='+id+'&ext='+ext });
}

function SaveMitgliedBemerkung(id)
{
   var bem=jQuery('#bemerkung').val();
   jQuery.ajax({ type: 'POST', url: './?webservice=savemitgliedbemerkung&id='+id, data:jQuery('#bem').serialize(), success: function(result) { alert('Bemerkung wurde gespeichert'); } });
}

var expertenanzahl=0;
function Expertensuche(nr,chiro)
{
   jQuery('#expertensuche').show();
   jQuery('#expertebutton1').hide();
   jQuery('#expertebutton2').show();
   if (expertenanzahl<nr) expertenanzahl=nr;
   expertenanzahl++;
   var elem=jQuery('#experte_0').clone();
   elem.show();
   ItemsSetIDLine(elem,'experte_',expertenanzahl);
   elem.appendTo('#expertensuche');
   if (chiro) jQuery('#expertefeld'+expertenanzahl).val('mitgliedsnummer');
   jQuery('#expertefkt'+expertenanzahl).val('=');
   jQuery('#expertewert'+expertenanzahl).focus();
}

function ExperteDelete(element)
{
   var id=element.parent().parent().parent().attr('id');
   if (id.indexOf('_')>0) id=id.substr(id.indexOf('_')+1, 99);
   jQuery('#expertefeld'+id).val('');
   element.parent().parent().parent().hide();
}


function KopiereRabatt(currency)
{
   var row;
   var std=jQuery('#stdrabatt').val();
   for(row=0; row<=1000; row++) if (jQuery('#anz'+row).length>0) jQuery('#rabatt'+row).val(std);
   Rechnungssumme(currency);
}

function Rechnungssumme(currency)
{
   var su=0, row, rab, gewinn=0;
   for(row=0; row<=1000; row++)
      if (jQuery('#anz'+row).length>0)
      {
         var wrt=jQuery('#anz'+row).val();
         var z=GetKommaZahlWert(wrt);
         var vk=GetKommaZahl('betrag'+row);
         if (vk!=0 && wrt=='') { z=1; jQuery('#anz'+row).val('1'); }
         if (z!=0)
         {
            var r=jQuery('#rabatt'+row).val();
            if (r.length>0)
            { 
               if (r.substring(r.length-1)=='%') rab=vk*GetKommaZahlWert(r.substring(0,r.length-1))/100; else rab=GetKommaZahl('rabatt'+row)/z;
               vk-=rab;
               jQuery('#rabattbetrag'+row).html(rab==0?'':'-'+FormatEuro(rab,currency)+' / Stk.<BR>='+FormatEuro(vk,currency)+' / Stk');
            }
            var nb=jQuery('#nettobrutto').val();
            var ek=nb=='n'?jQuery('#eknetto'+row).val():jQuery('#ekbrutto'+row).val();
            if (ek>0 && ek>vk)
               jQuery('#gewinnwarnung'+row).html('<DIV style="background-color:red;color:white;padding:3px;margin-right:7px;">Achtung: Verlust von '+FormatEuro(ek-vk,currency)+' pro Stueck</DIV>');
            else
               jQuery('#gewinnwarnung'+row).html('');
            su=su+round2(z*vk);
            if (ek>0) gewinn=gewinn+z*(vk-ek);
         }
      }
   jQuery('#summe').html(su==0?'':'Summe: '+FormatEuro(su,currency));
   jQuery('#gewinnwarnung').html();
   if (gewinn<0)
      jQuery('#gewinnwarnung').html('<SPAN style="background-color:red;color:white;padding:3px;margin-left:20px;">Gesamt-Verlust: '+FormatEuro(-gewinn,currency)+'</SPAN>');
   else if (gewinn>0)
      jQuery('#gewinnwarnung').html('<SPAN style="background-color:lightgreen;padding:3px;margin-left:20px;">Gesamt-Gewinn: '+FormatEuro(gewinn,currency)+'</SPAN>');
   else
      jQuery('#gewinnwarnung').html('');
}

function Aufgabensumme(stundensatz, kmsatz, currency, rows)
{
   var summestd=0, summeeuro=0, summekm=0, summekmeuro=0, row;
   for(row=1; row<=rows; row++)
   {
      if (jQuery('#stunden'+row).length>0)
      {
         var z=GetKommaZahl('stunden'+row);
         if (z!=0) { summestd+=z, summeeuro+=z*stundensatz; }
      }
      if (jQuery('#km'+row).length>0)
      {
         var z=GetKommaZahl('km'+row);
         if (z!=0) { summekm+=z, summekmeuro+=z*kmsatz; }
      }
   }
   jQuery('#summestd').html(summestd==0?'':summestd+' Std.');
   jQuery('#summeeuro').html(summeeuro==0?'':summeeuro+' '+currency);
   jQuery('#summekm').html(summekm==0?'':summekm+' km');
   jQuery('#summekmeuro').html(summekmeuro==0?'':summekmeuro+' '+currency);
}

function OpenFancybox(id)
{
  jQuery(document).fancybox({
     'autoScale': true,
     'transitionIn': 'elastic',
     'transitionOut': 'elastic',
     'speedIn': 500,
     'speedOut': 300,
     'autoDimensions': true,
     'centerOnScroll': true,
     'href' : id+' [data-fancybox]'
  });
}

function ReloadKalender(url, sekunden, ajax)
{
   if (ajax) jQuery.ajax({ type: 'GET', url: url, success: function(result) { jQuery('#divkalender').html(jQuery(result).find('#divkalender').html()); } });
   window.setTimeout(function() { ReloadKalender(url, sekunden, true); }, sekunden*1000);
}

function SetzeRechte(alle)
{
   jQuery('select').each(function(index, value)
   {
      if (jQuery(this).attr('id').indexOf('kosten')>0 || jQuery(this).attr('id').indexOf('visible')>0) return;
      if (alle) { var l=jQuery(this).find('option').length; if (jQuery(this).attr('id').indexOf('membersGeb')>0) l=2; var p=jQuery(this).find('option:nth-child('+l+')').val(); jQuery(this).val(p); } else jQuery(this).val('');
   });
}

function EnableIsDirty()
{
   jQuery('input').on('keypress', function() { SetDirty(jQuery(this).attr('name')); });
   jQuery('input').on('change', function() { SetDirty(jQuery(this).attr('name')); });
   jQuery('textarea').on('keypress', function() { isDirty=true; });
   jQuery('textarea').on('change', function() { isDirty=true; });
   jQuery('select').on('change', function() { SetDirty(jQuery(this).attr('name')); });
   //echo "  jQuery(window).on('beforeunload', function() { if (isDirty) return 'Achtung, Daten nicht gespeichert!'; });\n";
}
function SetDirty(name)
{
   if (name==undefined) return;
   if (name.substr(0,4)!='fake' && name!='suche' && name!='strukt1' && name!='strukt2' && name!='strukt3') { isDirty=true; }
}
function SetDirtyDirect()
{
   isDirty=true;
}
function ResetDirty()
{
   isDirty=false;
}
function DirtyMessage()
{
   if (isDirty) return confirm('Wirklich ohne speichern schliessen ?');
   return true;
}

function RolleMarkieren(feld)
{
//alert('o');
//   jQuery(feld).css('padding','10px');
   jQuery(feld).css('background-color','#c0ffc0');
}

function EventSetBegeiter(w)
{
   ShowHide('.rowmaxbegleiter',w!=4 && w!=7 && w!=8 && w!=3 && w!=10 && w!=13 && w!=14);
}

function FeldJBHLE(id)
{
   if (id==0 || id=='') return;
   jQuery.ajax({ type: 'POST', url: './?webservice=memberdata&id='+id, success: function(result) 
   {
      eval('werte='+result);
      if (jQuery('#key_organisation').val()=='') jQuery('#key_organisation').val(werte['firma']);
      if (jQuery('#key_anrede').val()=='') jQuery('#key_anrede').val(werte['anrede']);
      if (jQuery('#key_vorname').val()=='') jQuery('#key_vorname').val(werte['vorname']);
      if (jQuery('#key_nachname').val()=='') jQuery('#key_nachname').val(werte['nachname']);
      if (jQuery('#key_strasse').val()=='') jQuery('#key_strasse').val(werte['g_strasse']);
      if (jQuery('#key_plz').val()=='') jQuery('#key_plz').val(werte['g_plz']);
      if (jQuery('#key_ort').val()=='') jQuery('#key_ort').val(werte['g_ort']);
      if (jQuery('#key_telefon').val()=='') jQuery('#key_telefon').val(werte['g_telefon']);
      if (jQuery('#key_mobil').val()=='') jQuery('#key_mobil').val(werte['g_mobil']);
      if (jQuery('#key_geburtsdatum').val()=='') jQuery('#key_geburtsdatum').val(werte['geburtstag']);
      if (jQuery('#key_email').val()=='') jQuery('#key_email').val(werte['g_email']);
   } });
}

function SucheFLAnsicht(id, code, sort)
{
   var suche=encodeURIComponent(jQuery('#suche'+id).val());
   jQuery('#flexansicht'+id).html('<I>Suche laeuft...</I><BR><BR><IMG SRC="/admin/img/ajax.gif">');
   jQuery.ajax({ type: 'GET', url: './?webservice=sucheflansicht&id='+id+'&code='+code+'&suche'+id+'='+suche+'&sort='+sort, success: function(result) { jQuery('#flexansicht'+id).html(result); } });
}

function KeyCheck(e)
{
   var keycode;
   if (window.event) keycode = window.event.keyCode; else if (e) keycode = e.which; else return true;
   if (47 < keycode && keycode < 58) return true; // Zahlen
   var kcok = new Array(8, 10, 13, 46, 58, 0); // Steuerzeichen
   while (kcok.length > 0) { if (keycode == kcok.pop()) return true; }
   return false;
}

function TableSuche(tableid, suche, headerzeilen)
{
   if (suche=='') { jQuery('#'+tableid+' .suchenach').val(''); jQuery('#'+tableid+' .suchealles').hide(); jQuery('#'+tableid+' tr').show(); return; }
   jQuery('#'+tableid+' .suchealles').show();
   jQuery('#'+tableid+' tr').each(function(index, value)
   {
      if (index>=headerzeilen) if (jQuery(this).html().toLowerCase().indexOf(suche.toLowerCase())>=0) jQuery(this).show(); else jQuery(this).hide();
   });
}

function NewsSuche(webpart, suche)
{
   if (suche=='') { webpart.find('.messages .message').show(); return; }
   webpart.find('.messages .message').show();
   webpart.find('.messages .message').each(function(index, value)
   {
      if (jQuery(this).html().toLowerCase().indexOf(suche.toLowerCase())>=0) jQuery(this).show(); else jQuery(this).hide();
   });
}

function AddBegleiter(maxbegleiter, maxfrei, anrededefault, setzefirma, firma, namehidden, adminpath)
{
   controlnr++;
   if (maxbegleiter!='') if (anzahl>=maxbegleiter) { alert('Maximal '+maxbegleiter+' Begleiter zugelassen'); return; }
   if (maxfrei!='') if (anzahl>=maxfrei) { if (!confirm('Nur noch fuer maximal '+maxfrei+' Begleiter Platz. Eine weiterer Begleiter fuehrt zum Setzen auf die Warteliste. Sie verlassen auch die Warteliste erst, wenn Sie und alle Begleiter einen Platz bekommen. Weiteren Begleiter hinzufuegen?')) return; }
   var elem = jQuery('#begleiter0').clone();
   SetBegleiter(elem, '0', controlnr, true, anrededefault, setzefirma, firma, adminpath);
   elem.insertBefore(jQuery('#b1'));
   InitDatepickerField('#geburtstag'+controlnr, adminpath, false);
   if (namehidden==1) jQuery('#nachname'+controlnr).val('Begleiter');
   anzahl++;
   PrintActivateFields('#'+controlnr);
   return elem;
}

function RemoveBegleiter(nr)
{
   var elem = jQuery('#begleiter'+nr);
   SetBegleiter(elem,nr,nr,false,'',1,'','');
   anzahl--;
}

function AddBegleiterIntern()
{
   jQuery('#divsendemailbegleiterintern').show();

   controlnrIntern++;
   var elem = jQuery('#begleiter1000').clone();
   SetBegleiterIntern(elem,controlnrIntern);

   var nralt='1000', nr=controlnrIntern;
   elem.find('input').each(function(index)
   {
     if (jQuery(this).attr('name')!=null)
     {
       var na=jQuery(this).attr('name');
       var idalt=jQuery(this).attr('id');
       if (na.substring(0,4)=='key_' || na.substring(0,10)=='check_key_' || na.substring(0,15)=='fileselect_key_')
       {
         if (na.substring(na.length-2)!='[]')
         {
            na=na.replace('#'+nralt,'#'+nr);
            idneu=idalt.replace('#'+nralt,'#'+nr);
            if (typeof SetExtrafeldTrigger == 'function') { SetExtrafeldTrigger(elem, na.substring(0,na.length-5), nr); }
         }
       }
     }
   });
   elem.find('select').each(function(index)
   {
     if (jQuery(this).attr('name')!=null)
       if (jQuery(this).attr('name').substring(0,4)=='key_')
       {
         var na=jQuery(this).attr('name'); na=na.substring(0,na.length-5)+'#'+nr;
         if (typeof SetExtrafeldTrigger == 'function') { SetExtrafeldTrigger(elem, na.substring(0,na.length-5), nr); }
       }
   });

   elem.insertBefore(jQuery('#bintern1'));
   anzahlIntern++;
}

function RemoveBegleiterIntern(nr)
{
   var elem = jQuery('#begleiter'+nr);
   elem.find('input,select').each(function(index, value) { jQuery(this).val(''); });
   elem.hide();
   anzahlIntern--;
}

function SetBegleiterIntern(elem,nr)
{
   elem.attr('id', 'begleiter'+nr);
   elem.show();
   var h=elem.html()
   while (h.indexOf('1000"')>0) h=h.replace('1000"',nr+'"');
   while (h.indexOf('1000\'')>0) h=h.replace('1000\'',nr+'\'');
   while (h.indexOf('1000&')>0) h=h.replace('1000&',nr+'&');
   while (h.indexOf('1000[]')>0) h=h.replace('1000[]',nr+'[]');
   elem.html(h);
}

function SetBegleiter(elem, nralt, nr, display, anrededefault, setzefirma, firma, adminpath)
{
   elem.attr('id', 'begleiter'+nr);
   if (display) elem.show(); else elem.hide();
   elem.find('input:not([type=checkbox]):not([type=hidden]):not([type=submit]):not([type=radio]):not([type=button]),select,textarea').val('');
   elem.find('#anrede'+nralt).attr('id','anrede'+nr).attr('name','anrede'+nr).val(anrededefault);
   elem.find('#titel'+nralt).attr('id','titel'+nr).attr('name','titel'+nr);
   elem.find('#vorname'+nralt).attr('id','vorname'+nr).attr('name','vorname'+nr);
   elem.find('#nachname'+nralt).attr('id','nachname'+nr).attr('name','nachname'+nr);
   elem.find('#firma'+nralt).attr('id','firma'+nr).attr('name','firma'+nr).val(setzefirma==1?'':(setzefirma==2?jQuery('#firma').val():firma));
   elem.find('#datepickergeburtstag'+nralt).attr('id','datepickergeburtstag'+nr);
   elem.find('#geburtstag'+nralt).attr('id','geburtstag'+nr).attr('name','geburtstag'+nr);
   elem.find('#begleitungals'+nralt).attr('id','begleitungals'+nr).attr('name','begleitungals'+nr);
   elem.find('#begleiterloeschen'+nralt).attr('id','begleiterloeschen'+nr).attr('onclick','javascript:RemoveBegleiter('+nr+');return false;');
   elem.find('div.fieldgroup').each(function(index) { jQuery(this).attr('class',jQuery(this).attr('class').replace('_nr'+nralt,'_nr'+nr)); });
   elem.find('#linkalle'+nralt).attr('id','linkalle'+nr).attr('onclick','javascript:ProgrammPunkteAlle(\'.programmpunkt_'+nr+'\');return false;');
   elem.find('#linkkeiner'+nralt).attr('id','linkkeiner'+nr).attr('onclick','javascript:ProgrammPunkteKeiner(\'.programmpunkt_'+nr+'\');return false;');

   elem.find('#geburtstag'+nr).removeClass("hasDatepicker");
   elem.find('#datepickergeburtstag'+nr+' img').remove();

   //elem.find('#anmeldeoptionenprogrammpunkt57858_'+nralt).attr('id','anmeldeoptionenprogrammpunkt57858_'+nr);
   //elem.find('#anmeldeoptionenserienva57858_'+nralt).attr('id','anmeldeoptionenserienva57858_'+nr);
   elem.find('tr').each(function(index)
   {
      var id=jQuery(this).attr('id'); if (id=='' || id==undefined) return;
      if (id.substr(0,28)=='anmeldeoptionenprogrammpunkt') if (id.substr(id.length-1-nralt.length)=='_'+nralt) jQuery(this).attr('id',id.substr(0,id.length-nralt.length)+nr);
      if (id.substr(0,23)=='anmeldeoptionenserienva') if (id.substr(id.length-1-nralt.length)=='_'+nralt) jQuery(this).attr('id',id.substr(0,id.length-nralt.length)+nr);
      if (id.substr(0,17)=='row_programmpunkt') if (id.substr(id.length-1-nralt.length)=='_'+nralt) jQuery(this).attr('id',id.substr(0,id.length-nralt.length)+nr);
   });

   elem.find('input').each(function(index)
   {
     if (jQuery(this).attr('name')!=null)
     {
       var na=jQuery(this).attr('name');
       //var typ=jQuery(this).attr('type'); alert(typ); if (typ=='button') return;
       var idalt=jQuery(this).attr('id');
       if (na.substring(0,4)=='key_' || na.substring(0,10)=='check_key_' || na.substring(0,15)=='fileselect_key_' || na.substring(0,2)=='pp')
       {
         if (na.substring(na.length-2)=='[]')
         {
            na=na.substring(0,na.length-4)+'#'+nr+'[]';
            jQuery(this).attr('name',na);
         }
         else
         {
            //na=na.substring(0,na.length-2)+'#'+nr;
            na=na.replace('#'+nralt,'#'+nr);
            idneu=idalt.replace('_nr'+nralt,'_nr'+nr);
            jQuery(this).attr('name',na);
            jQuery(this).attr('id',idneu);
            if (typeof SetExtrafeldTrigger == 'function') { SetExtrafeldTrigger(elem, na.substring(0,na.length-2), nr); }
         }
       }
       if (na.substring(0,13)=='programmpunkt' || na.substring(0,8)=='serienva')
       {
         na=na.substring(0,na.length-2)+'_'+nr;
         jQuery(this).attr('name',na);
         jQuery(this).attr('id',na);
         jQuery(this).attr('grp','_'+nr);
         jQuery(this).attr('class','programmpunkt_'+nr);
         jQuery(this).attr('onchange',jQuery(this).attr('onchange').replace('_'+nralt,'_'+nr));
       }
     }
   });
   elem.find('select').each(function(index)
   {
     if (jQuery(this).attr('name')!=null)
       if (jQuery(this).attr('name').substring(0,4)=='key_' || jQuery(this).attr('name').substring(0,2)=='pp')
       {
         var na=jQuery(this).attr('name'); na=na.substring(0,na.length-2)+'#'+nr;
         jQuery(this).attr('name',na);
         jQuery(this).attr('id',na);
         var onchange=jQuery(this).attr('onchange');
         if (onchange!==undefined && onchange!==false) jQuery(this).attr('onchange',onchange.replace("TischBegleiter('key_kosten_ticketauswahl#0'","TischBegleiter('key_kosten_ticketauswahl#"+nr+"'"));
         if (typeof SetExtrafeldTrigger == 'function') { SetExtrafeldTrigger(elem, na.substring(0,na.length-2), nr); }
         this.selectedIndex=-1;
       }
   });
   elem.find('.register').attr('id','registerkey'+nr);
   elem.find('.tabX a, #begleiter'+nralt+' .tabB a').each(function(index)
   {
      jQuery(this).attr('onclick',"OpenRegister("+(index+1)+",'registerkey"+nr+"');jQuery(window).trigger('resize');return false;");
   });
   elem.find('.buttonitem a').each(function(index)
   {
      jQuery(this).attr('href',jQuery(this).attr('href').replace('#'+nralt,'#'+nr));
   });
   elem.find('.dateien a').each(function(index)
   {
      jQuery(this).attr('onclick',jQuery(this).attr('onclick').replace('#'+nralt,'#'+nr).replace('#'+nralt,'#'+nr));
   });
   elem.find('div.dateien').each(function(index)
   {
      jQuery(this).attr('id',jQuery(this).attr('id').replace('#'+nralt,'#'+nr));
   });
   elem.find('div.dateienliste').each(function(index)
   {
      jQuery(this).attr('id',jQuery(this).attr('id').replace('#'+nralt,'#'+nr));
   });
   elem.find('input[type=button]').each(function(index)
   {
      jQuery(this).attr('onclick',jQuery(this).attr('onclick').replace('#'+nralt,'#'+nr).replace('#'+nralt,'#'+nr));
   });
}

function AddAbstimmung()
{
   var nr=1; jQuery('#alternativen tbody tr').each(function(index, value) { var id=jQuery(this).attr("id"); id=parseFloat(id.substr(2,99)); if (id>=nr) nr=id+1; });
   var elem=jQuery('#tr0').clone(true);
   elem.show();
   ItemsSetIDLine(elem,'tr',nr);
   elem.find('select').each(function(index, value) { if (jQuery(this).attr('onchange')) jQuery(this).attr('onchange',jQuery(this).attr('onchange').replace('details0','details'+nr)); });
   elem.find('a').each(function(index, value) { if (jQuery(this).attr('onclick')) jQuery(this).attr('onclick',jQuery(this).attr('onclick').replace("'0'", "'"+nr+"'")); });
   elem.find('div').each(function(index, value) { jQuery(this).attr('id', 'divdetails'+nr); });
   elem.insertBefore(jQuery('#tr0'));
   jQuery('#art'+nr).val(jQuery('#art'+(nr-1)).val());
   ShowHide('#divdetails'+nr, jQuery('#art'+(nr-1)).val()=='');
   if (jQuery('#art'+(nr-1)).val()=='') jQuery('#details'+nr).val(jQuery('#details'+(nr-1)).val());
}

function StarClick(feld, star)
{
   for(var i=1; i<=5; i++) { ShowHide('#star0'+i+feld, i>star); ShowHide('#star1'+i+feld, i<=star); }
   jQuery('#'+feld).val(star);
}

function BSStarClick(feld, star)
{
   for(var i=1; i<=10; i++) if (i<=star) jQuery('#'+feld+'-star'+i).addClass('star-selected'); else jQuery('#'+feld+'-star'+i).removeClass('star-selected');
   jQuery('#'+feld).val(star);
}

function AbstimmungLoeschen(nr)
{
   if (!confirm('Wirklich loeschen?')) return;
   jQuery('#tr'+nr).remove();
}

//function(){return isctrl;}
function WPDragDropInit(bs)
{
   // aus Toolbox
   jQuery('.wpdrag').draggable({ revert: false, helper: 'clone', zIndex: 1000, cursorAt: { top: 0, left: 0 } });
   jQuery('.wpdrag').on('dragstart', function(event, ui) { AddDroppable(bs); });

   // aus Dokument
   //, start: function(event, ui) { jQuery(this).draggable('option', 'cursorAt', { left: 0, top: 0 }); }
   jQuery('.wpitem').draggable({ revert: "invalid", helper: 'clone', zIndex: 1000, cursorAt: { top: 0, left: 0 } });
   jQuery('.wpitem').on('dragstart', function(event, ui) { AddDroppable(bs); });

   jQuery('.wpitemchild').on('click', function() { StaticHtmlClickChild(jQuery(this)); });
   jQuery('.wpitemchild .wpitem').each(function() { jQuery(this).parent().parent().off('click'); });
}

function AddDroppable(bs)
{
   // Drop auf Zwischenraeume
   jQuery(".droparea").droppable(
   {
      accept: ".wpdrag, .wpitem",
      tolerance: "pointer",
      classes: { "ui-droppable-active": "droparea-active", "ui-droppable-hover": "droparea-hover" },
      //over: function(event, ui) { jQuery(this).css('height',ui.draggable.height()+'px'); },
      //out: function(event, ui) { jQuery(this).css('height','22px'); },
      drop: function(event, ui)
      {
         jQuery(this).css('height','22px');
         if (!ui.draggable.hasClass('wpsection'))
            AddDroppableItem(ui.draggable, jQuery(this).parent(), bs);
         else
            AddDroppableMain(ui.draggable.attr('type'), jQuery(this).parent(), '', bs);
      }
   });

   // Drop in Mehrfachelement
   jQuery(".wpitemchild").droppable(
   {
      accept: ".wpdragchild, .wpitem",
      tolerance: "pointer",
      classes: { "ui-droppable-active": "droparea-active", "ui-droppable-hover": "droparea-hover" },
      drop: function(event, ui)
      {
         if (!ui.draggable.hasClass('wpsection'))
         {
            var el=ui.draggable.clone(true);
            el.find('.editarea').remove();
            AddDroppableChild(ui.draggable.attr('type'), jQuery(this), el.html());
            if (!isctrl) StaticHtmlRemove(ui.draggable,false);
         }
         else
            AddDroppableChild(ui.draggable.attr('type'), jQuery(this), '', false);
      }
   }); 
}

function AddDroppableMain(type, eleminsert, html, bs)
{
   if (html=='') html=jQuery('#template'+type).html();
   var edit=jQuery('#edit'+type).html();
   var item=1, i; jQuery('.webpartlist .dropitem').each(function(index, value) { i=jQuery(this).attr("id"); i=parseFloat(i.substr(4,99)); if (i>=item) item=i+1; });
   jQuery("<li class='dropitem' id='item"+item+"'><div class='droparea' onclick='javascript:StaticHtmlClick("+item+","+(bs?'true':'false')+");return false;'>Bitte per Klick oder Drag-and-Drop neue Elemente einfuegen</div><div class='wpitem' type='"+type+"'><div class='editarea'>"+edit+"</div>\n"+html+"\n</div></li>").insertBefore(eleminsert);
   jQuery('#item'+item+' .wpitem').draggable({ revert: "invalid", helper: 'clone', zIndex: 1000, cursorAt: { top: 0, left: 0 } });
   jQuery('.wpitemchild').on('click', function() { StaticHtmlClickChild(jQuery(this)); });
}

function AddDroppableItem(newitem, eleminsert, bs)
{
   var type=newitem.attr('type')
   var edit=jQuery('#edit'+type).html();
   var item=1, i; jQuery('.webpartlist .dropitem').each(function(index, value) { i=jQuery(this).attr("id"); i=parseFloat(i.substr(4,99)); if (i>=item) item=i+1; });
   jQuery("<li class='dropitem' id='item"+item+"'><div class='droparea'>Bitte per Klick oder Drag-and-Drop neue Elemente einfuegen</div><div class='wpitem' type='"+type+"'><div class='editarea'>"+edit+"</div>\n"+newitem.html()+"\n</div></li>").insertBefore(eleminsert);
   if (!isctrl) StaticHtmlRemove(newitem,false);
   jQuery('#item'+item+' .wpitem').draggable({ revert: "invalid", helper: 'clone', zIndex: 1000, cursorAt: { top: 0, left: 0 } });
   jQuery('#item'+item).on('click', function() { StaticHtmlClickChild(jQuery(this)); });
}

function AddDroppableChild(type, eleminsert, html)
{
   if (html=='') html=jQuery('#template'+type).html();
   var edit=jQuery('#edit'+type).html();
   var item=1, i; jQuery('.webpartlist .dropitem').each(function(index, value) { i=jQuery(this).attr("id"); i=parseFloat(i.substr(4,99)); if (i>=item) item=i+1; });
   eleminsert.html("<!--WPCHILD--><div class='dropitem' id='item"+item+"'><div class='wpitem' type='"+type+"'>\n<div class='editarea'>"+edit+"</div>"+html+"</div>\n</div><!--/WPCHILD-->");
   //eleminsert.droppable("disable"); // raus, weil sonst text in Col3 einfuegen nicht klappt; // rein, weil sonst 2Zeilen in 3Spalten und dann ELement in Zeilen einfuegen nicht klappt
   eleminsert.removeClass('wpitemchild');
   eleminsert.removeClass('ui-droppable');
   eleminsert.removeClass('ui-droppable-active');
   eleminsert.removeClass('droparea-active');
   eleminsert.off('click');
   jQuery('#item'+item+' .wpitem').draggable({ revert: "invalid", helper: 'clone', zIndex: 1000, cursorAt: { top: 0, left: 0 } });
   AddDroppable(true);
}

function SetForm1Top()
{
   GetForm1().target='_top';
}

function StaticHtmlSave(cmd,dialog)
{
   SetForm1Value('cmd',cmd);
   GetForm1().target='';
   SetForm1Value('dialog',dialog);
   //jQuery('.webpartlist').hide();
   jQuery('.webpartlist .droparea').remove();
   jQuery('.webpartlist .contentdisplay').remove();
   jQuery('.webpartlist .content').removeClass('hidden');
   jQuery('.webpartlist .content').attr('contenteditable','');
   jQuery('.webpartlist .droparea-active').removeClass('droparea-active');
   jQuery('.webpartlist .editarea').remove();
   jQuery('.wpitem').removeClass('ui-draggable').removeClass('ui-draggable-handle');
   var html=''; jQuery.each( jQuery(".webpartlist > li"), function(key, value) { html=html+jQuery(this).html(); });
   jQuery('#inhalt1_html').val(html);
}

function StaticHtmlSize(jq, anz, cls1, cls2)
{
   jq.parent().parent().find(cls1).each(function() { StaticHtmlSizeElement(jQuery(this), -anz); });
   jq.parent().parent().find(cls2).each(function() { StaticHtmlSizeElement(jQuery(this), anz); });
}

function StaticHtmlSizeElement(el, anz)
{
   var w=el.css('width');
   var v=parseInt(w);
   if (w.substr(0,w.length-1)=='%') el.css('width',parseInt((v+anz)/10)+'%'); else el.css('width',(v+anz)+'px');
}

function StaticHtmlSetImg(item, file, parent)
{
   var html='<img src="'+(file.substr(0,5)=='files'?file:'?downloadprojectfile='+file.substr(9))+'" style="max-width:100%">';
   parent.jQuery('.webpartlist #'+item+' .content').html(html);
   parent.jQuery('.webpartlist #file'+item).val(file);
}

function StaticHtmlSetImgNew(item, file, bs)
{
   var html='<div class="content"><img src="files/'+file+'" style="max-width:100%"></div>';
   if (item.substr(0,4)=="item")
      AddDroppableMain('img', jQuery('.webpartlist #'+item), html, bs);
   else
      AddDroppableChild('img', jQuery('.webpartlist #'+item), html);
}

function StaticHtmlClick(nr,bs)
{
   SetForm1Value('cmd','addwpitem'+nr);
   if (!bs)
      OpenNewWindow(-1,-1);
   else
      OpenPopupBS('./?action='+GetForm1Value('action')+'&cmd='+GetForm1Value('cmd')+'&id='+GetForm1Value('id')+'&dialog=2',0,0,120);
}

function StaticHtmlClickChild(elem)
{
   var d = new Date(); var ts=d.getTime();
   elem.attr('id', ts);
   SetForm1Value('cmd','addwp'+ts);
   OpenNewWindow(-1,-1);
}

function StaticHtmlRemove(elem,cf)
{
   if (cf) if (!confirm('Wirklich loeschen?')) return;
   var p=elem.parent();
   if (p.parent().hasClass('webpartlist'))
   {
      p.remove();
   }
   else
   {
      p=p.parent();
      p.html("Bitte per Klick oder Drag-and-Drop neue Elemente einfuegen");
      p.addClass('wpitemchild');
      p.addClass('ui-droppable');
      p.droppable("enable");
   }
}

function PlatzPruefen(id)
{
   var par='id='+id+'&datum='+jQuery('#datum').val()+'&anzahltage='+jQuery('#anzahltage').val()+'&datum_anzahl='+jQuery('#datum_anzahl').val()+'&datum_ende='+jQuery('#datum_ende').val()+'&datum_tage='+jQuery('#datum_tage').val()+'&datum_monate='+jQuery('#datum_monate').val()+'&datum_jederxtag='+jQuery('#datum_jederxtag').val()+'&datum_jederwotag='+jQuery('#datum_jederwotag').val()+'&datum_datumswerte='+jQuery('#datum_datumswerte').val();
   par=par+'&raum='+encodeURIComponent(jQuery('#raum').val())+'&raumab='+jQuery('#raumab').val()+'&raumbis='+jQuery('#raumbis').val()+jQuery('#raumbucher').val();
   par=par+'&akid='+jQuery('#akid').val();
   jQuery.ajax({ type: 'GET', url: './?webservice=platzcheck&'+par, success: function(result) { jQuery('#raumbucherverfuegbar').html(result); } });
}

function SetzeAnrede(vorname, anredefeld)
{
   if (jQuery('#'+anredefeld).val()!='') return;
   jQuery.ajax({ type: 'GET', url: './?webservice=vorname&vorname='+encodeURIComponent(vorname), success: function(result) 
   {
      if (result!='') jQuery('#'+anredefeld).val(result);
   } });
}

function PytisStueckliste(isMaterial)
{
   var artikelliste=[];
   jQuery.each( jQuery(".stueckanzahl"), function(key, value)
   {
      var stueckartid=jQuery(this).attr('id').substr(6);
      var stueckanzahl=jQuery(this).val();
      var artikel=eval(jQuery(this).attr('data'));
      for(var i=0; i<artikel.length; i++) { var a=artikel[i][1]; artikelliste[a]=(artikelliste[a]==undefined?0:artikelliste[a])+stueckanzahl*artikel[i][0]; }
   });
   var fehlen=0;
   for(var artid in artikelliste)
   {
      var z=artikelliste[artid];
      jQuery.each( jQuery(".art"+artid), function(key, value)
      {
         if (true)
         {
            var artlager=jQuery(this).attr('id').substr(3);
            var verfuegbar=jQuery('#spanzstck'+artlager).attr('verfuegbar');
            var dieseslager=z>verfuegbar?verfuegbar:z;
            z=z-dieseslager;
            jQuery('#zstck'+artlager).val(dieseslager);
            jQuery('#spanzstck'+artlager).html(dieseslager==0?'':'<br>+ '+dieseslager+' fuer Stuecklisten');
         }
      });
      if (z>0) fehlen+=z;
   }
   if (fehlen>0) alert('nicht genuegend '+(isMaterial?'Material':'Equipment')+' vorhanden ('+fehlen+' fehlen)');
}

function OnceForm1Submit(el)
{
   ShowLightBox();
   jQuery(el).attr('onclick',"javascript:alert('bereits ausgefuehrt');return false;");
   DirectForm1Submit();
}

function Grossbuchstaben(feld)
{
   var wrt=jQuery('#'+feld).val(); if (wrt=='' || wrt.indexOf(' ')>0) return;
   jQuery('#'+feld).val(wrt.substr(0,1).toUpperCase()+wrt.substr(1));
}

function ShowVideo(nr)
{
   jQuery('.videos').hide();
   jQuery('#video'+nr).show();
   jQuery('#videoplay'+nr).show();
   jQuery('.videoplay').each(function(index, value) { jQuery(this)[0].pause(); });
   jQuery('#videoplay'+nr)[0].play();
}

function SetzeRaumZeit(wrt)
{
   var i=wrt.indexOf('-');
   jQuery('#raumab').val((i>=0?wrt.substr(0,i):wrt).trim());
   if (i>=0) jQuery('#raumbis').val(wrt.substr(i+1).trim());
}

function Speisekarte(id,wrt)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=speisekarte&id='+id+'&wrt='+wrt });
}

function CheckGruppenMail()
{
   var msg='';
   if (!jQuery('#empf1').prop('checked') && !jQuery('#empf2').prop('checked') && !jQuery('#empf3').prop('checked') && !jQuery('#empf4').prop('checked') && !jQuery('#empf5').prop('checked')) msg+='Bitte Versandart waehlen.\n'
   if (jQuery('#betreff').val()=='') msg+='Bitte Betreff eingeben.\n'
   if (msg!='') alert(msg);
   return msg=='';
}

function NettoToBrutto(feld,mwstfaktor)
{
   var brutto=GetKommaZahl(feld)*mwstfaktor;
   jQuery('#'+feld+'brutto').val(round2(brutto));
}

function BruttoToNetto(feld,mwstfaktor)
{
   var netto=GetKommaZahl(feld+'brutto')/mwstfaktor;
   jQuery('#'+feld).val(round2(netto));
}

function RenameFile(caption, field)
{
   var txt=jQuery('#newfilename_'+field).val();
   var pre='';
   if (txt.substr(0,2)=='20' && txt.substr(14,1)=="_") { pre=txt.substr(0,15); txt=txt.substr(15); }
   var f=prompt(caption, txt);
   if (f!=null && f!='') jQuery('#newfilename_'+field).val(pre+f);
   if (f!=null && f!='') jQuery('#attlink_'+field).html(f);
}


function FindeRechnung(renr)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=sucherenr&renr='+encodeURIComponent(renr), success: function(result) 
   {
      jQuery('#resuche').html(result);
   } });
}

function ActivateDragDrop()
{
  jQuery('.draggable').draggable({ revert: true, });
  jQuery('.droppable').droppable({ hoverClass: 'draghover', drop: function( event, ui ) { ui.draggable.draggable({revert: false}); MoveMail(ui.draggable, jQuery(this).attr('name')); } });
  JsResponsivetable();
}

function MoveMail(mailelement, zielfolderid)
{
   var par=mailelement.attr('name').split("-");
   jQuery.ajax({ type: 'GET', url: './?webservice=movemail&mailid='+par[0]+'&folderid='+zielfolderid+'&foldersrc='+par[1]+'&postfachid='+par[2], success: function(result)
   {
      if (result.substring(0,6)=="ERROR:") { alert(result.substring(6,999)); return; }
      mailelement.parent().parent().remove();
      var cnt=result.split(',');
      ShowPostfachFolderMark(par[1], cnt[0]);
      ShowPostfachFolderMark(zielfolderid, cnt[1]);
   } });
}

function JsResponsivetable()
{
   jQuery.each(jQuery('.responsivetable'), function(index)
   {
      var tb=jQuery(this);
      jQuery(tb).find('thead td').each(function(index, value)
      {
         jQuery(tb).find('tbody td:nth-of-type('+(index+1)+')').attr('data-title',jQuery(this).text()+(jQuery(this).text().trim()==''?'':':'));
      })
   });
}

var tagesordnungspunkte=0;
function SetzeTop(id, status)
{
   tagesordnungspunkte=3;
   jQuery('.top').css('background-color','');
   jQuery('#top'+id).css('background-color','#80ff80');
   if (status==2) if (jQuery('#abstimmung'+id).html()=='Abstimmung aktivieren') { jQuery('#abstimmung'+id).html('Abstimmung deaktivieren'); } else { jQuery('#abstimmung'+id).html('Abstimmung aktivieren'); status=1; }
   var b=''; jQuery(document).find('.blockbodystart').each(function(index, value) { if (jQuery(this).css('display')!='none') b=b+(b==''?'':',')+jQuery(this).attr('id'); });
   jQuery.ajax({ type: 'GET', url: './?webservice=setzetop&id='+id+'&status='+status+'&b='+b, success: function(result) 
   {
      jQuery('.versammlung').html(result);
   } });
}

function UpdateTop(vid)
{
   if (tagesordnungspunkte>0) { tagesordnungspunkte--; return; }
   var b=''; jQuery(document).find('.blockbodystart').each(function(index, value) { if (jQuery(this).css('display')!='none') b=b+(b==''?'':',')+jQuery(this).attr('id'); });
   jQuery.ajax({ type: 'GET', url: './?webservice=updatetop&id='+vid+'&b='+b, success: function(result) 
   {
      if (tagesordnungspunkte>0) return;
      jQuery('.versammlung').html(result);
   } });
}

function VoteTop(id, vote)
{
   jQuery.ajax({ type: 'GET', url: './?webservice=votetop&id='+id+'&vote='+vote, success: function(result) 
   {
      alert(result);
   } });
}

function TopDropped()
{
   var sort='';
   jQuery.each( jQuery(".tops .maintop"), function(key, value) { sort=sort+(sort==''?'':',')+jQuery(this).attr('id').substring(3); });
   jQuery.ajax({ type: 'GET', url: './?webservice=reordertop&sort='+sort, success: function(result) 
   {
      jQuery('.versammlung').html(result);
      jQuery(".topdrag").sortable({ items: '.maintop', revert: true, stop: function( event, ui ) { TopDropped(); } });
   } });
}

function AddExternalUser(str)
{
   var externals=document.getElementById('externals');
   externals.value=externals.value+(externals.value==''?'':'\\n')+str;
}

function CheckSerientermine()
{
   var alle=jQuery('.serienva').length;
   if (alle<=1) return true;
   var sel=jQuery('.serienva:checked').length;
   if (sel==0) { alert('Sie haben 0 von '+alle+' Serienterminen gewaehlt.\n\nBitte waehlen Sie mindestens einen Termin.'); return false; }
   return confirm('Sie haben '+sel+' von '+alle+' Serienterminen gewaehlt.\n\nAnmeldung speichern?');
}

function MailArchivCheckbox(id, state)
{
   jQuery('.mailarchivextra.block'+id+' input:visible').prop('checked',state);
}

function SetzeAnzeigeRV(el,id,wert)
{
   jQuery.ajax({ type: 'POST', url: './?webservice=setzeanzeigerv&id='+id+'&w='+wert });
   jQuery.each( jQuery(el).parent().parent().find('a'), function(key, value) { if (jQuery(this).html().substring(0,1)=='*') jQuery(this).html(jQuery(this).html().substring(2,99)); } );
   jQuery(el).html('* '+jQuery(el).html());
}

function DeleteMail(id)
{
   jQuery.ajax({ type: 'POST', url: './?webservice=maildelete&id='+id });
   jQuery('tr#row'+id).remove();
}

function SetzeRaum(plaetze, enable)
{
   for(i=0; i<plaetze.length; i++) jQuery('#platzauswahl'+plaetze[i]).prop('checked',enable);
}

function Restbudget(grpid)
{
   if (grpid==0) jQuery('#restbudget').html("");
   else jQuery.ajax({ type: 'POST', url: './?webservice=restbudget&id='+grpid, success: function(result) { jQuery('#restbudget').html(result); } });
}

function SyncExtrafelder(ab,id)
{
   jQuery.ajax({ type: 'POST', url: './?webservice=syncextrafelder&ab='+ab+'&id='+id, success: function(result) { alert(result); } });
}

function CheckReRequired(felder,oKst)
{
   if (felder=='') return true;
   var lst=felder.split(',');
   var msg='';
   for(i=0; i<lst.length; i++) if (!CheckReRequiredField(lst[i],oKst)) msg+='\n- '+lst[i].substring(0,1).toUpperCase()+lst[i].substring(1);
   if (msg!='') alert('Bitte vor dem Speichern folgende Felder ausfuellen:'+msg);
   return msg=='';
}

function CheckReRequiredField(feld,oKst)
{
   if (feld!='kostenstelle') return GetForm1Value(feld)!="";

   // Kostenstelle
   if (oKst=='') return true;
   if (oKst=='ja' || oKst=='gruppen') return GetForm1Value('kategorie')!="";
   if (oKst=='multi') { alert('Pflichtfelder bei Kostenstellen=Mehrfachzuordnung nicht unterstuetzt'); return false; }
   var ok=true;
   jQuery.each( jQuery("select[name^='kategorie']"), function(key, value) { if (jQuery('#anz'+jQuery(this).attr('id').substr(9)).val()!="") ok=ok && jQuery(this).val().trim()!=''; } );
   return ok;
}

function ErstelleRechnung(jahr,pflicht,oKst,action)
{
   if (!BuchungDatumOk(jahr)) return;
   if (!CheckReRequired(pflicht,oKst)) return;
   var renr=jQuery('#rechnungsnummer').val().trim();
   if (renr=='') { alert("Bitte Rechnungsnummer angeben"); return; }
   jQuery.ajax({ url: './?webservice=checkrenr&renr='+encodeURIComponent(renr), success: function(result)
   {
      if (result!='') { alert(result); return; }
      SetForm1Value('action','kasse_'+action);
      Form1Submit();
   } });
}

function PopupLogin()
{
   var myModal = new bootstrap.Modal(document.getElementById('logindialog'), { keyboard: false });
   myModal.show()
}

function FormatZeit(z)
{
   var hh=parseInt(z);
   var mm=parseInt((z-hh)*60);
   return hh+':'+(mm<10?'0':'')+mm;
}

function SaveTerminPlanung(uid,vaid)
{
   jQuery.ajax({ type: 'POST', url: './?webservice=terminplanung', data: 'uid='+uid+'&vaid='+vaid+'&status='+jQuery('#va'+vaid).val()+'&txt='+encodeURIComponent(jQuery('#txt'+vaid).val()), success: function(result) { if (result!='') alert(result); } });
}

function SaveTerminPlanungKommentar(uid,aid)
{
   jQuery.ajax({ type: 'POST', url: './?webservice=terminplanungkommentar', data: 'uid='+uid+'&aid='+aid+'&txt='+encodeURIComponent(jQuery('#anmerkungen').val()), success: function(result) { if (result!='') alert(result); } });
}

function BuchungDatumOk(jahr)
{
   var datum=jQuery('#datum').val();
   var data=datum.split('.'); var d=parseInt(data[0]), m=parseInt(data[1]), y=parseInt(data[2]);
   if (y<=jahr) { alert('Buchfuehrung bis zum Jahr '+jahr+' gesperrt'); return false; }
   if (d<1 || d>31 || m<1 || m>12) { alert('ungueltiges Datum'); return false; }
   return true;
}

function FelderMoveSelected(src, dst)
{
   var s=document.getElementById(src);
   var d=document.getElementById(dst);
   for(var i=0; i<s.options.length; i++) if (s.options[i].selected) d.add(new Option(s.options[i].text,s.options[i].value));
   for(var i=s.options.length-1; i>=0; i--) if (s.options[i].selected) s.options[i]=null;
   SelectAll();
}
function FelderMoveAll(src, dst)
{
   var s=document.getElementById(src);
   var d=document.getElementById(dst);
   for(var i=0; i<s.options.length; i++) d.add(new Option(s.options[i].text,s.options[i].value));
   for(var i=s.options.length-1; i>=0; i--) s.options[i]=null;
   SelectAll();
}
function SelectAll()
{
   var d=document.getElementById('selection');
   for(var i=d.options.length-1; i>=0; i--) d.options[i].selected=true;
}
function FelderMoveSelectedUpDown(lst,dir)
{
   var l=document.getElementById(lst);
   var p=l.selectedIndex;
   if (p<0 || p+dir<0 || p+dir>=l.length) return;
   var o1=new Option(l.options[p].text, l.options[p].value);
   var o2=new Option(l.options[p+dir].text, l.options[p+dir].value);
   l.options[p+dir]=o1;
   l.options[p]=o2;
   l.selectedIndex=p+dir;
   //SelectAll();
}

function Rv6Toggle()
{
   if (jQuery('#sidebar').is(":visible"))
   {
      jQuery('#sidebar').removeClass('d-md-block').removeClass('collapse').addClass('d-none');
      jQuery('.maincontent').removeClass('col-fluid')
      document.cookie = 'sidebar=no; path=/';
   }
   else
   {
      jQuery('#sidebar').addClass('d-md-block').addClass('collapse').removeClass('d-none');
      jQuery('.maincontent').addClass('col-fluid')
      document.cookie = 'sidebar=; path=/';
   }
}

function Rv6Show()
{
   if (jQuery('#sidebar').hasClass('d-none'))
   {
      jQuery('#sidebar').addClass('d-md-block').addClass('collapse').removeClass('d-none');
      jQuery('.maincontent').addClass('col-fluid')
   }
}

function ReAusblenden(id, nuraktive)
{
   if (nuraktive==1) jQuery('#rechnung'+id).hide();
   jQuery.ajax({ url: './?webservice=reausblenden&id='+id, success: function(result) { jQuery('#link'+id).html(result); } });
}

function CheckRaumbelegung(ids)
{
   var par='';
   var frm1=document.getElementById('form1');
   for(i=0; i<frm1.elements.length; i++) { if (frm1.elements[i].name.substring(0,5)=="platz" || frm1.elements[i].name.substring(0,6)=="beginn" || frm1.elements[i].name.substring(0,4)=="ende") par=par+'&'+frm1.elements[i].name+'='+encodeURIComponent(frm1.elements[i].value); }
   jQuery.ajax({ url: './?webservice=checkraumbelegung&ids='+ids+par, success:
      function(result)
      {
         if (result=='') { Form1Submit(); return; }
         eval('werte='+result);
         for(i=0; i<werte.length; i++) jQuery('#info'+werte[i][0]).html(werte[i][1]);
      }
   });
}

function SetzeBildersichtbarkeit(opt)
{
   jQuery("select[name^='public']").val(opt);
}

function ChangePositionen(pos)
{
   var max=jQuery('.selectpos').length;
   var wert=parseInt(jQuery('#position'+pos).val());
   var prewert=parseInt(jQuery('#preposition'+pos).val());
   for(var p=1; p<=max; p++)
   {
      if (p!=pos)
      {
         var w=parseInt(jQuery('#position'+p).val()); 
         if (wert>prewert && w>prewert && w<=wert) { jQuery('#position'+p).val(w-1); jQuery('#preposition'+p).val(w-1); }
         if (wert<prewert && w<prewert && w>=wert) { jQuery('#position'+p).val(w+1); jQuery('#preposition'+p).val(w+1); }
      }
   }
   jQuery('#preposition'+pos).val(wert);
}

function FlexTypShowDetail(nr)
{
   var detailtypen=["multiselect","select","selectradio","checkbox","label","workflow","autowert","wert","currency","currencylist","formel"];
   var typ=jQuery('#datatyp'+nr).val();
   ShowHide('#datatypdetails'+nr, detailtypen.includes(typ));
}

function FlexListTypAdd()
{
   flexlistenpos++;

   jQuery('.selectpos').each(function(index, value)
   {
      jQuery(this).find("option[value='x']").remove();
      jQuery(this).append("<option value='"+flexlistenpos+"'>"+flexlistenpos+"</option>");
      jQuery(this).append("<option value='x'>loeschen</option>");
   });

   var elem=jQuery('.listtable tbody tr:first').clone();
   elem.find('input,select,textarea').each(function(index, value)
   {
     var name=jQuery(this).attr('name');
     name=name.substr(0,name.length-1)+flexlistenpos;
     jQuery(this).attr('name',name);
     jQuery(this).attr('id',name);
     if (jQuery(this).attr('onchange'))
     {
        var r=jQuery(this).attr('onchange').replace('ext1','ext0').replace('ext1','ext0').replace('ext1','ext0');
        r=r.replace('ext0','ext'+flexlistenpos).replace('ext0','ext'+flexlistenpos).replace('ext0','ext'+flexlistenpos);
        r=r.replace('datakey1','datakey'+flexlistenpos);
        jQuery(this).attr('onchange',r);
     }
     jQuery(this).val('');
   });
   elem.find('textarea').hide();
   elem.find('.selectpos').val(flexlistenpos);
   elem.find('#preposition'+flexlistenpos).val(flexlistenpos);
   elem.find('.selectpos').attr('onchange','javascript:ChangePositionen('+flexlistenpos+')');
   elem.find('#datatyp'+flexlistenpos).attr('onchange','javascript:FlexTypShowDetail('+flexlistenpos+')');
   elem.find('a').attr('onclick','javascript:jQuery("#divsichtbar'+flexlistenpos+'").toggle();');
   elem.find('.linkcondition').attr('onclick','javascript:jQuery("#divsichtbar'+flexlistenpos+'").toggle();');
   elem.find('.ergext').attr('id','ergext'+flexlistenpos).html('');
   elem.find('.divsichtbar').attr('id','divsichtbar'+flexlistenpos);

   elem.appendTo('.listtable tbody');
}

function KostenAusnahmenAdd(adminpath, showWeek)
{
   kostentabellenr++;
   jQuery('.kostentabellehead').show();

   var elem=jQuery('#kostentabelle tbody tr:first').clone();
   elem.find('input,select,textarea').each(function(index, value)
   {
     var name=jQuery(this).attr('name'); if (name.substr(0,3)=='btn') return;
     name=name.substr(0,name.length-1)+kostentabellenr;
     jQuery(this).attr('name',name);
     jQuery(this).attr('id',name);
     jQuery(this).val('');
     jQuery(this).removeClass("hasDatepicker");
   });
   elem.find('div').each(function(index, value)
   {
     var id=jQuery(this).attr('id');
     jQuery(this).attr('id',id.substr(0,id.length-1)+kostentabellenr);
   });
   elem.find('img').each(function(index, value)
   {
     jQuery(this).remove();
   });
   elem.show();
   elem.appendTo('#kostentabelle tbody');

   InitDatepickerField('#kostentabelle tbody #kostenab'+kostentabellenr, adminpath, showWeek);
   InitDatepickerField('#kostentabelle tbody #kostenbis'+kostentabellenr, adminpath, showWeek);
}

function KostenAusnahmenRemove(elem)
{
   var cnt=elem.parentNode.parentNode.parentNode.children.length;
   elem.parentNode.parentNode.remove();
   if (cnt<3) jQuery('.kostentabellehead').hide();
}

function MailAttachUser(id,user,notiz)
{
   jQuery.ajax({ url: './?webservice=mailattachuser&id='+id+'&user='+user+'&notiz='+encodeURIComponent(notiz), success: function(result) { if (result=='N') alert('Fehler beim Speichern'); else alert('Wurde gespeichert'); } });
}

function MailPush(art,gid)
{
   if (art=='mail' && jQuery('#mail'+gid).prop('checked')==false) jQuery('#push'+gid).prop('checked',true);
   if (art=='push' && jQuery('#push'+gid).prop('checked')==false) jQuery('#mail'+gid).prop('checked',true);
}

function Schulschach(kind,cls)
{
   jQuery('.schachlehrer'+kind+':not('+cls+') input').prop('checked',false);
}
function Schachkurs(vaid,uid,chk,stufe,iduser,idva)
{
   jQuery.ajax({ url: './?webservice=schachkurs&vaid='+vaid+'&uid='+uid+'&typ='+(chk?'3':'1') });
   var u=jQuery('#user'+stufe+uid).html(); if (u=='') u=0;
   var su=jQuery('.su'+stufe+vaid).first().html(); if (su=='') su=0;
   if (chk) { u++; su++; } else { u--; su--; }
   jQuery('#user'+stufe+uid).html(u==0?'':u);
   jQuery('#user'+stufe+uid).css('background-color',u>1?'red':'');
   jQuery('#user'+stufe+uid).css('color',u>1?'white':'');
   jQuery('#user'+stufe+uid).css('padding',u>1?'3px':'');
   jQuery('.su'+stufe+vaid).html(su==0?'':su);
}

function SucheInTags(field, service)
{
   jQuery.ajax({ url: './?webservice=filetags'+service+'&field='+field+'&tags='+encodeURIComponent(jQuery('#tags').val()), success: function(result) { jQuery('#result').html(result); } });
}

function CheckUserCode(field)
{
   var mailtext=GetEditorContent(field);
   var i=mailtext.indexOf('usercode=');
   if (i>=0)
   {
      var weiter=parseInt(mailtext.substr(i+9)); if (isNaN(weiter)) weiter=0;
      if (weiter!=0) { alert('Der Text darf keinen individuelle Zugriffcode enthalten! (usercode='+weiter+'...)'); return false; }
   }
   return true;
}

function AuswahlTag(tag)
{
   var v=" "+jQuery('#tags').val()+" ";
   var p=v.indexOf(" "+tag+" ");

   var w;
   if (p<0) w=(v+tag).trim();
   else if (p==0) w=v.substr(tag.length+2).trim();
   else w=v.substr(0,p).trim()+' '+v.substr(p+tag.length+2).trim();

   //jQuery('#tag'+tag).css('background-color', p>=0?'#e0e0e0':'#a0a0a0');

   jQuery('#tags').val(w);
   jQuery('#tags').trigger('keyup');
}

function FieldInfo(art,field)
{
   jQuery.ajax({ url: './?webservice=fieldinfo&art='+art+'&field='+field, success: function(result) { alert(result); } });
}

function LoadJournalZuordnungen(id, print)
{
   if (jQuery('#aufklappen'+id+'body').html()!="") return;
   jQuery.ajax({ url: './?webservice=getzuordnungen&id='+id+(print==''?'':'&print='+print), success: function(result) { jQuery('#aufklappen'+id+'body').html(result); } });
}

function ICVAnmeldeAdresse(val, postcount, pstrasse='', pland='', pplz='', port='', pemail='', firma='', gco='', gstrasse='', gland='', gplz='', gort='', gemail='')
{
   ShowHide('#icvanmeldeadresse', val!='');
   if (val=='') { jQuery('#icvanmeldeadresse').html(''); return; }

   var par='';
   if (val=='privat') par+='&p_strasse='+encodeURIComponent(pstrasse)+'&p_land='+encodeURIComponent(pland)+'&p_plz='+encodeURIComponent(pplz)+'&p_ort='+encodeURIComponent(port)+'&p_email='+encodeURIComponent(pemail);
   else par+='&firma='+encodeURIComponent(firma)+'&g_co='+encodeURIComponent(gco)+'&g_strasse='+encodeURIComponent(gstrasse)+'&g_land='+encodeURIComponent(gland)+'&g_plz='+encodeURIComponent(gplz)+'&g_ort='+encodeURIComponent(gort)+'&g_email='+encodeURIComponent(gemail);

   jQuery.ajax({ url: './?webservice=icvanmeldeadresse&art='+val+'&postcount='+postcount+par, success: function(result) { jQuery('#icvanmeldeadresse').html(result); } });
}

function UpdatedGeburtstag(datatyp, datakey, datum, vaid, wert)
{
   var el=document.getElementById('key_kosten');
   if (el==null || el=='undefined') return;
   if (datakey=='') return;
   jQuery.ajax({ url: './?webservice=updatedgeburtstag&datum='+encodeURIComponent(datum)+'&datatyp='+datatyp+'&datakey='+datakey+'&vaid='+vaid+'&wert='+wert, success: function(result) { jQuery(el).parent().html(result); } });
}

function CheckFieldDubletten()
{
   var frm1=document.getElementById('form1');
   var lst=[];
   for(i=0; i<frm1.elements.length; i++)
      if (frm1.elements[i].name.substring(0,7)=="datakey" && frm1.elements[i].value!='')
      {
         var extname='#ext'+frm1.elements[i].name.substring(7);
         var ext=jQuery(extname).length==0?'':jQuery(extname).val();
//         if (ext=='undefined') ext='';
         var val=frm1.elements[i].value.trim()+ext; 
         if (lst.indexOf(val)>=0) { alert('Gleichnamige Felder sind nicht zulaessig: '+val); return true; }
         lst.push(val);
      }
   return false;
}

function BlogDelete(id)
{
   jQuery('#blogdiv'+id).hide();
   jQuery.ajax({ url: './?webservice=blogdelete&id='+id });
}

function SaveGruppenNotify(gruppenid)
{
   jQuery.ajax({ url: './?webservice=gruppennotify&id='+gruppenid+'&wert='+jQuery('#abo').val() });
}

function scrollToAnchor(aid, diff)
{
   var aTag = jQuery("a[name='"+ aid +"']");
   jQuery('html,body').animate({scrollTop: aTag.offset().top-diff},'slow');
}

function SetzeKontoVA(field,vaid)
{
   jQuery.ajax({ url: './?webservice=setzekontova&id='+vaid, success: function(result) { KontoPickerSetze(field,result); } });
}

function CopyToClipboard(id, info)
{
   var content = document.getElementById(id);
   ShowHide('#'+id,true);
   content.select();
   document.execCommand('copy');
   ShowHide('#'+id,false);
   alert(info+":\n\n"+content.value);
}

function CopyFieldToClipboard(id)
{
   var content = document.getElementById(id);
   content.select();
   document.execCommand('copy');
}

function CopyFieldToClipboardTiny(id)
{
   var tiny=GetEditor('tiny'+id);
   navigator.clipboard.writeText(tiny.getContent());
}

function ExpertensucheAuswahlfelder(id, feld) //, adminpath, showWeek)
{
   //if (feld=='aufnahmemitglied') { alert(id+','+feld); jQuery('#experte_'+id+' .expertinput').hide(); jQuery('#experte_'+id+' .expertdatum').show(); InitDatepickerField('#experte_'+id+' .expertdatum', adminpath, showWeek); }
   if (feld=='userpwd')
   {
      jQuery('#expertefkt'+id+' option').prop('disabled',true);
      jQuery('#expertefkt'+id+' option:contains("leer")').prop('disabled',false);
   }
   else if (feld=='alter')
   {
      jQuery('#expertefkt'+id+' option').prop('disabled',true);
      jQuery('#expertefkt'+id+' option:contains("ist")').prop('disabled',false);
      jQuery('#expertefkt'+id+' option:contains("leer")').prop('disabled',true);
   }
   else if (feld=='beitraege')
   {
      jQuery('#expertefkt'+id+' option').prop('disabled',true);
      jQuery('#expertefkt'+id+' option:contains("leer")').prop('disabled',false);
      jQuery('#expertefkt'+id+' option:contains("enthaelt")').prop('disabled',false);
      jQuery('#expertefkt'+id+' option:contains("ist nicht gleich")').prop('disabled',false);
      jQuery('#expertefkt'+id+' option:contains("ist gleich")').prop('disabled',false);
   }
   else if (feld=='beitragszahlerfuer')
   {
      jQuery('#expertefkt'+id+' option').prop('disabled',true);
      jQuery('#expertefkt'+id+' option:contains("leer")').prop('disabled',false);
   }
   else 
      jQuery('#expertefkt'+id+' option').prop('disabled',false);

   var sel=jQuery('#expertefkt'+id).prop('selectedIndex');
   if (sel>=0 && jQuery('#expertefkt'+id+' option:eq('+sel+')').prop('disabled'))
   {
      var cnt=jQuery('#expertefkt'+id+' option').length;
      for(i=0; i<cnt; i++) if (!jQuery('#expertefkt'+id+' option:eq('+i+')').prop('disabled')) { jQuery('#expertefkt'+id).prop("selectedIndex",i); break; }
   }

   if (feld=='')
      jQuery('#experte_'+id+' .experteinfo').html('');
   else
      jQuery.ajax({ url: './?webservice=fieldinfo&id='+id+'&art=m&komma=1&field='+feld, success: function(result) { jQuery('#experte_'+id+' .experteinfo').html(result); } });
}

function ShopLieferadresse(wrt)
{
   ShowHide('.rowlieferadresse',wrt=='');
   ShowHide('.rowlieferswitch',wrt=='');
   ShowHide('.rowlieferfirma',wrt=='');
   ShowHide('.rowliefervollername',wrt=='');
   ShowHide('.rowlieferstrasse',wrt=='');
   ShowHide('.rowlieferadresse',wrt=='');
   ShowHide('.rowlieferemail',wrt=='');
}

function RefreshICAL()
{
   jQuery.ajax({ url: './?webservice=refreshical' });
}

function addattachmentsFile()
{
   AddExtraFile('attachments');
}

function GetEditor(field)
{
   if (tinyMCE.editors==undefined)
   {
      return tinyMCE.get(field);
   }
   return tinyMCE.editors[field];
}

function GetEditorContent(field)
{
   var edt=GetEditor(field); if (edt==false) return '';
   return edt.getContent();
}

function SetEditorContent(field,txt)
{
   var edt=GetEditor(field); if (edt==false) return '';
   edt.setContent(txt, {format : 'raw'});
}

function VAControllingAbgeschlossen(vaid,status,abgeschlossen)
{
   jQuery.ajax({ url: './?webservice=vacontrollingabgeschlossen&vaid='+vaid+'&status='+(status?'1':'') });
   if (abgeschlossen!='') jQuery('.va'+vaid).remove();
   if (abgeschlossen!='') jQuery('.vasumme').remove();
}

function VAControllingAbgeschlossen2(vaid,status)
{
   jQuery.ajax({ url: './?webservice=vacontrollingabgeschlossen2&vaid='+vaid+'&status='+(status?'1':'') });
}

function BeitragFilter()
{
   jQuery('#filter').toggle();
}

function RefreshAufgabenListe()
{
   jQuery.ajax({ url: './?webservice=topaufgabenliste', success: function(result) { jQuery('#aufgabenid').html(result); } });
}

function TischBegleiter(key,wrt,adminpath)
{
   var clickid=key == "key_kosten_ticketauswahl" ? 0 : parseInt(key.substr(18));
   jQuery.ajax({ url: './?webservice=tischreservierung&id='+wrt, success: function(result)
   {
      if (result=='') return;
      var list=[]; if (jQuery('#key_kosten_ticketauswahl').val()==wrt) list.push(jQuery('#key_kosten_ticketauswahl'));
      jQuery("div[id^='begleiter']:visible").each(function(index, value)
      {
         var nr=jQuery(this).attr('id').substr(9); if (nr=='0') return;
         var select=jQuery(this).find("select[id^='key_kosten_ticketauswahl']");
         var keyid=select.attr('id') == "key_ticketauswahl" ? 0 : parseInt(select.attr('id').substr(25));
         if (select.val()==wrt) list.push(select); else if (keyid > clickid) jQuery(this).remove();
      });
      var cnt=(parseInt((list.length-1)/result)+1)*parseInt(result)-list.length;
      for(i=1; i<=cnt; i++) { var elem=AddBegleiter('','','','0','',0,adminpath); elem.find("select[id^='key_kosten_ticketauswahl']").val(wrt); }
   } });
}

function toHex(zahl)
{
   var hex=zahl.toString(16); if (hex.length==1) hex='0'+hex; return hex;
}

function toBase64(data)
{
   var view=new Uint8Array(data);
   var result=''; for(var i=0; i<view.length; i++) result+=String.fromCharCode(view[i])
   return btoa(result);
}

function PasskeyCreate(challengedata, challengebase64, passkeysServer, userlogin, username)
{
   const publicKeyCredentialCreationOptions = {
      challenge: challengedata,
      rp: { name: "VereinOnline.org", id: passkeysServer },
      user: { id: new Uint8Array([1,2,3]), name: userlogin, displayName: username },
      pubKeyCredParams: [{alg: -7, type: "public-key"}],
      authenticatorSelection: { authenticatorAttachment: "cross-platform" },
      timeout: 60000,
      attestation: "direct"
   };
   navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions }).then((credential) =>
   {
      //console.log(credential);
      const response = credential.response;
      const decodedAttestationObject = cbor.decode(credential.response.attestationObject);
      //console.log(decodedAttestationObject);

      const utf8Decoder = new TextDecoder('utf-8');
      const decodedClientData = utf8Decoder.decode(credential.response.clientDataJSON);
      const clientDataObj = JSON.parse(decodedClientData);
      //console.log(clientDataObj);
      if (clientDataObj.type!='webauthn.create') { alert('wrong type:'+clientDataObj.type+'.'); return; }
      if (clientDataObj.origin!='https://'+passkeysServer) { alert('wrong server'); return; }
      if (clientDataObj.challenge!=challengebase64) { alert('wrong challenge:\n'+clientDataObj.challenge+'\n'+challengebase64); }

      const authData = decodedAttestationObject.authData;
      const dataView = new DataView(new ArrayBuffer(2));
      const idLenBytes = authData.slice(53, 55); idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
      const credentialIdLength = dataView.getUint16();
      const credentialId = authData.slice(55, 55 + credentialIdLength);
      //console.log(credentialId);

      const publicKeyBytes = authData.slice(55 + credentialIdLength);
      const publicKeyObject = cbor.decode(publicKeyBytes.buffer);
      //console.log(publicKeyBytes);
      //console.log(publicKeyObject);

      var result='';
      for(var i=0; i<credentialId.length; i++) result+=toHex(credentialId[i]);
      //console.log('hex='+result);
      var cdata=toBase64(credential.response.clientDataJSON);
      var attest=toBase64(credential.response.attestationObject);
      //console.log(attest);
      jQuery.ajax({ url: './?webservice=passkeycreate&credential='+encodeURIComponent(result)+'&cdata='+encodeURIComponent(cdata)+'&attest='+encodeURIComponent(attest)+'&id='+encodeURIComponent(credential.id),
               success: function(result) { jQuery('#info').html(result); if (result.substr(0,6)=='Fehler') jQuery('#info').css({'background-color':'red', 'color':'white'}); }
      });
   });
}

function PasskeyGet(credentials, challengedata, challengebase64, userlogin)
{
   const publicKeyCredentialRequestOptions = {
      challenge: challengedata,
      allowCredentials: credentials,     // , transports: ['usb', 'ble', 'nfc']
      timeout: 60000
   }
   navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions }).then((credential) => 
   {
      //console.log(credential);
      const response = credential.response;

      var authdata=toBase64(credential.response.authenticatorData);
      var cdata=toBase64(credential.response.clientDataJSON);
      var sig=toBase64(credential.response.signature);
      //console.log(authdata); console.log(cdata); console.log(sig);

      const utf8Decoder = new TextDecoder('utf-8');
      const decodedClientData = utf8Decoder.decode(credential.response.clientDataJSON);
      const clientDataObj = JSON.parse(decodedClientData);
      //console.log(clientDataObj);
      if (clientDataObj.challenge!=challengebase64) { alert('wrong challenge:\n'+clientDataObj.challenge+'\n'+challengebase64); }

      jQuery.ajax({ url: './?webservice=passkeyget&authdata='+encodeURIComponent(authdata)+'&cdata='+encodeURIComponent(cdata)+'&sig='+encodeURIComponent(sig)+'&id='+encodeURIComponent(credential.id)+'&userlogin='+encodeURIComponent(userlogin),
               success: function(result) { jQuery('#info').html(result); if (result.substr(0,6)=='Fehler') jQuery('#info').css({'background-color':'red', 'color':'white'}); } 
      });
   });
}

function contextMenuOpen(event, contextmenuaction) 
{
   if (jQuery("#contextmenu").length==0) return;
   if (!event) event = window.event;
   event.preventDefault();
   event.stopImmediatePropagation();
   jQuery.each(jQuery("#contextmenu div, #contextmenu hr"), function(key, value) { var cls=jQuery(this).attr('class'); if (cls=='' || contextmenuaction.indexOf(cls.substr(11))>=0) jQuery(this).show(); else jQuery(this).hide(); });
   jQuery("#contextmenu").show(); 
   var posx=0, posy=0;
   if (event.pageX || event.pageY) { posx = event.pageX; posy = event.pageY; } else if (event.clientX || event.clientY) { posx = event.clientX + document.body.scrollLeft +  document.documentElement.scrollLeft; posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; }
   var menu = document.getElementById("contextmenu");
   if (window.innerWidth - posx < menu.offsetWidth) menu.style.left = (posx - menu.offsetWidth) + "px"; else menu.style.left = posx + "px";
   if (window.innerHeight - posy < menu.offsetHeight) menu.style.top = (posy - menu.offsetHeight) + "px"; else menu.style.top = posy + "px";
}
jQuery(document).on('click', function (e) { if ((e.which || e.button) === 1) jQuery("#contextmenu").hide(); });
jQuery(window).on('keyup', function (e) { if (e.keyCode === 27) jQuery("#contextmenu").hide(); });

function SaalplanSelect(vaid,nr,anzahl)
{
   //alert(vaid+','+nr+','+anzahl);
   var saalplaetze=jQuery('#saalplaetze').val();
   var plaetze=saalplaetze.length==0 ? [] : jQuery('#saalplaetze').val().split(',');
   var ist=plaetze.length;
   var ok=false; for(var i in plaetze) if (plaetze[i]==nr) ok=true;
   if (ok)
   {
      SaalplanUnset(vaid,nr);
      var neu=''; for(var i in plaetze) if (plaetze[i]!=nr) neu=neu+(neu==''?'':',')+plaetze[i];
      jQuery('#saalplaetze').val(neu);
   }
   else
   {
      if (anzahl>0) for(var i=0; i<=ist-anzahl; i++) SaalplanUnset(vaid,plaetze[i]);
      var neu=''; for(var i in plaetze) if (ist<anzahl || i>ist-anzahl || anzahl<0) neu=neu+(neu==''?'':',')+plaetze[i];
      neu=neu+(neu==''?'':',')+nr;
      jQuery('#saalplaetze').val(neu);

      jQuery('#elementplatz'+nr).css('background-color','blue').css('color','white');
      jQuery.ajax({ type: 'GET', url: './?webservice=saalplanset&vaid='+vaid+'&nr='+nr, success: function(result)
      {
         if (result=='lock')
         {
            jQuery('#elementplatz'+nr).css('background-color','#f0f0f0').css('color','black').css('cursor','default');
            var neu=''; for(var i in plaetze) if (plaetze[i]!=nr) neu=neu+(neu==''?'':',')+plaetze[i];
            jQuery('#saalplaetze').val(neu);
            alert('dieser Platz '+nr+' wurde inzwischen reserviert');
         }
      } });
   }
}

function SaalplanUnset(vaid,nr)
{
   jQuery('#elementplatz'+nr).css('background-color','lightgreen').css('color','black');
   jQuery.ajax({ type: 'GET', url: './?webservice=saalplanunset&vaid='+vaid+'&nr='+nr });
}

function CheckSaalPersonen(anzahl)
{
   var saalplaetze=jQuery('#saalplaetze').val();
   var plaetze=saalplaetze.length==0 ? [] : jQuery('#saalplaetze').val().split(',');
   return anzahl==plaetze.length;
}

function SaalplanUpdate(vaid)
{
   var saalplaetze=jQuery('#saalplaetze').val();
   var plaetze=saalplaetze.length==0 ? [] : jQuery('#saalplaetze').val().split(',');

   jQuery.ajax({ type: 'GET', url: './?webservice=saalplan&vaid='+vaid+'&plaetze='+saalplaetze, success: function(result)
   {
      var vor=jQuery('#saalreserviert').val();
      jQuery('#saalreserviert').val(result);

      var ist=vor=='' ? [] : vor.split(',');
      var soll=result=='' ? [] : result.split(',');

      for(var i in ist) if (soll.indexOf(ist[i])==-1) jQuery('#elementplatz'+ist[i]).css('background-color','lightgreen').css('cursor','pointer');
      for(var i in soll) if (ist.indexOf(soll[i])==-1 && plaetze.indexOf(soll[i])==-1) jQuery('#elementplatz'+soll[i]).css('background-color','#f0f0f0').css('cursor','default');

   } });
}

var saalplaetzepos;
function SaalPlaetzeInit(isAdmin)
{
   if (isAdmin)
      jQuery("#canvas").on("click", function(event)
      {
          var dx=8, dy=8;
          var x = event.pageX - jQuery('#canvas').offset().left;
          var y = event.pageY - jQuery('#canvas').offset().top;
          for(var i in saalplaetzepos)
          {
             var itm=saalplaetzepos[i];
             if (itm[0]-dx/2<=x && itm[0]+dx/2>=x && itm[1]-dy/2<=y && itm[1]+dy/2>=y)
             {
                if (itm[2]!=1) { saalplaetzepos[i][2]=2-saalplaetzepos[i][2]; SaalPlaetzeAnzeigen(); }
                return;
             }
          }
          jQuery('#command').val(jQuery('#command').val()+'tisch[]=['+Math.round(x)+', '+Math.round(y)+'];\n');
          saalplaetzepos[saalplaetzepos.length]=[x,y,0];
          SaalPlaetzeAnzeigen();
      });
   SaalPlaetzeAnzeigen();
}

function SaalPlaetzeAnzeigen()
{
   var dx=8, dy=8;
   jg.clear();
   jg.setFont("Arial", "8", "");
   for(var i in saalplaetzepos)
   {
      var itm=saalplaetzepos[i];
      if (itm[2]==0) jg.setColor("#00ff00"); else if (itm[2]==1) jg.setColor("#ff0000"); else jg.setColor("#0000ff");
      jg.fillRect(itm[0]-dx/2, itm[1]-dy/2, dy, dy);
      jg.setColor("#000000");
      jg.drawString(i, itm[0]-dx/2+2, itm[1]-dy/2);
   }
   jg.paint();
}

function DeleteBelegAttachment(id)
{
   jQuery('#divatt'+id).hide();
   jQuery('#attachments'+id).val('#'+jQuery('#attachments'+id).val());
}

function ListTypenlisteReNumber()
{
   var nr=0;
   jQuery.each( jQuery(".selectpos"), function(key, value) { nr++; jQuery(this).val(nr); });
}

function JBHSubmit(workflow)
{
   var ok=true, msg='';
   if (!jQuery('#agb').prop('checked')) { ok=false; msg+='Bitte der AGB zustimmen\n'; }
   if (!jQuery('#hausordnung').prop('checked')) { ok=false; msg+='Bitte der Hausordnung zustimmen\n'; }
   if (!jQuery('#preisestorno').prop('checked')) { ok=false; msg+='Bitte der Preis- und Stornobedingungen zustimmen\n'; }
   if (!jQuery('#haftpflicht').prop('checked')) { ok=false; msg+='Bitte der Haftpflicht-Bedingung zustimmen\n'; }
   if (!jQuery('#datenschutz').prop('checked')) { ok=false; msg+='Bitte dem Datenschutz zustimmen\n'; }
   if (ok) { SetForm1Value('cmd',workflow); DirectForm1Submit(); } else alert(msg);
   return ok;
}

function GetAllOptions(id)
{
   var select='';
   jQuery('#'+id+' option:selected').each(function() { select+=(select==''?'':',')+jQuery(this).val(); });
   return select;
}

// individuduell vereinonline

jQuery(document).ready(function()
{
    if (typeof(vereinonlineurl) !== 'undefined') GetEventsFilter(vereinonlineurl, vereinonlinerequest);
});

function WPFormSubmit(requestid, form)
{
   var ajaxUrl=jQuery('#'+requestid).attr('url');
   if (ajaxUrl=='') alert('Url ist nicht festgelegt');
   var data=new FormData();
   var werte=[]; 
   jQuery.each(jQuery('#'+form+' input, #'+form+' select, #'+form+' textarea'), function(key,value) 
   {
      if (value.name.substr(value.name.length-2)=='[]') { if (value.checked) { var k=value.name.substr(0,value.name.length-2); if (werte[k]!=undefined) werte[k]=werte[k]+'|'+value.value; else werte[k]=value.value; } }
      else if (value.type=='radio') { if (jQuery(this).prop('checked')) data.append(value.name, value.value); }
      else if (value.type=='checkbox') { if (jQuery(this).prop('checked')) data.append(value.name, value.value); }
      else if (value.type!='file') data.append(value.name, value.value); 
      else if (value.files.length>0) data.append(value.name, value.files[0]);
   });
   for(var k in werte) data.append(k, werte[k]);
   jQuery.ajax(
   { type: 'POST', url: ajaxUrl, data: data, cache: false, xhrFields: { withCredentials: true }, processData: false, contentType: false, crossDomain : true,
     error: function(r,e,txt) { ShowResult('FEHLER: '+r.status+': '+txt, requestid); }, 
     success: function(result)
     {
        ShowResult(result, requestid); 
     }
   });
}

function WPSetFormValue(requestid, form, key, value)
{
   jQuery('#'+requestid+' #'+form+' #'+key).val(value);
}

function WPGetFormValue(requestid, form, key)
{
   return jQuery('#'+requestid+' #'+form+' #'+key).val();
}

function WPSendLogin(requestid, form)
{
   if (form=='') form='formlogin';
   var frm1=document.getElementById(form);
   //var el=frm1.elements['newtoken'];
   //if (el) 
   //{
   //  WPSetFormValue(requestid, form, 'newtoken',md5(WPGetFormValue(requestid, form, 'newpassword')));
   //   WPSetFormValue(requestid, form, 'newpassword', '');
   //}
   WPFormSubmit(requestid, form);
}

function GetRequest(par, requestid)
{
   jQuery('#'+requestid).trigger('beforeFormLoad');
   var ajaxUrl=jQuery('#'+requestid).attr('url');
   jQuery.ajax(
   { type: 'GET', url: ajaxUrl+par, cache: false, xhrFields: { withCredentials: true }, crossDomain: true,
     error: function(r,e,txt)
     {
        if (r.status==0) txt='Es konnte keine Verbindung zum Verwaltungssystem hergestellt werden. Moeglicherweise verhindert Ihr Ad-Blocker eine Verbindung. Bitte deaktivieren Sie diesen und versuchen Sie es erneut.'; else txt='FEHLER: '+r.status+': '+txt;
        ShowResult(txt, requestid);
     },
     success: function(result)
     {
        ShowResult(result, requestid);
     }
   });
}

function ShowResult(result, requestid='vereinonlinesubmit')
{
   var url=jQuery('#'+requestid).attr('url');
   result=result.replace(/OpenPopup\(\'\.\//gi, 'OpenPopup(\''+url);
   result=result.replace(/src="fotos/gi, 'src="'+url+'fotos');
   result=result.replace(/src="admin/gi, 'src="'+url+'admin');
   result=result.replace(/\$\(/gi, 'jQuery(');
   result=result.replace(/\$\./gi, 'jQuery.');
   result=result.replace(/FormSubmit\(/gi, 'WPFormSubmit(\''+requestid+'\',');
   result=result.replace(/Form1Submit\(/gi, 'WPFormSubmit(\''+requestid+'\',\'form1\'');
   result=result.replace(/SetFormValue\(/gi, 'WPSetFormValue(\''+requestid+'\',');
   result=result.replace(/SetForm1Value\(/gi, 'WPSetFormValue(\''+requestid+'\',\'form1\',');
   result=result.replace(/SendLogin\(/gi, 'WPSendLogin(\''+requestid+'\',');
   //result=result.replace(/form1/gi, requestid+'form1');
   result=result.replace(/formlogin1/gi, requestid+'formlogin1');

   jQuery('#'+requestid).html(result);
   jQuery('#'+requestid).trigger('afterFormLoad');
}

function GotoUrl(url, requestid='vereinonlinesubmit')
{
  jQuery.ajax(
  {
    type: 'GET',
    crossDomain: true, 
    xhrFields: { withCredentials: true },
    url: jQuery('#'+requestid).attr('url') + url + '&dialog=4',
    success: function(result) { ShowResult(result, requestid); },
    error: function(r,e,txt) { ShowResult('FEHLER: '+txt, requestid); } 
  });
}

function GetPlugin(element)
{
   return jQuery(element).closest(".vereinonlineplugin").attr('id');
}

function GetEventsFilter(url, request)
{
  jQuery.ajax(
  {
    type: 'GET',
    crossDomain: true, 
    url: url+'?action=events_filter'+request,
    success: function(result) { jQuery('#vereinonlineterminefilter').html(result); },
    error: function(r,e,txt) { jQuery('#vereinonlineterminefilter').html(txt); } 
  });
}

function GoMonat(url,urlwebtermine,m,y,typ,token,gruppenid='')
{
  jQuery.ajax(
  {
    type: 'GET',
    crossDomain: true, 
    url: url+'?json&function=GetCalendar&typ='+typ+'&gruppenid='+gruppenid+'&token='+token+'&m='+m+'&y='+y,
    success: function(result) { ShowTable(url,urlwebtermine,m,y,result,typ,token,gruppenid); },
    error: function(r,e,txt) { jQuery('#vereinonlinekalender').html('FEHLER: '+txt); } 
  });
}

function ShowTable(url,urlwebtermine,m,y,kalender,typ,token,gruppenid='')
{
  var html='';
  var m1=m-1, y1=y, m2=m+1, y2=y; if (m1==0) { m1=12; y1--; } if (m2==13) { m2=1; y2++; }
  html+='<table width="100%">';
  html+='<tr>';
  html+='<td align=center><A HREF="javascript:GoMonat(\x27'+url+'\x27,\x27'+urlwebtermine+'\x27,'+m1+','+y1+',\x27'+typ+'\x27,\x27'+token+'\x27,\x27'+gruppenid+'\x27);">&lt;&lt;</A></td>';
  html+='<td colspan=5 align=center class="vereinonlinekalenderheader">'+kalender.text+'</td>';
  html+='<td align=center><A HREF="javascript:GoMonat(\x27'+url+'\x27,\x27'+urlwebtermine+'\x27,'+m2+','+y2+',\x27'+typ+'\x27,\x27'+token+'\x27);">&gt;&gt;</A></td>';
  html+='</tr>';
  var t=-kalender.offset;
  while (t<kalender.tage)
  {
     html+='<tr>';
     for(var w=1; w<=7; w++)
     {
        t++; var urlpopup='', classes='', vayear=y, titel='';
        for(var k=0; k<kalender.tag.length; k++) if (kalender.tag[k]==t) { urlpopup=kalender.id[k]; classes+=' vereinonlinekalenderdayformat'+kalender.format[k]; vayear=kalender.datum[k].substring(0,4); titel=kalender.titel[k]; }
        if (t<1 || t>kalender.tage)
           html+='<td></td>'; 
        else if (urlpopup=='') 
           html+='<td align=center class="vereinonlinekalenderday">'+t+'</td>'; 
        else if (classes==' vereinonlinekalenderdayformat4')
           html+='<td align=center class="vereinonlinekalenderday '+classes+'"><a href="mailto:kontakt@tresorvinum.de" title="'+titel+'">'+t+'</a></td>';
        else 
           html+='<td align=center class="vereinonlinekalenderday '+classes+'"><a href="'+urlwebtermine.replace(/%year%/g,vayear)+urlpopup+'" title="'+titel+'">'+t+'</a></td>';
     }
     html+='</tr>';
  }
  html+='</table>';
  jQuery('#vereinonlinekalender').html(html);
}

function WPInWarenkorb(id, check)
{
   if (GetFormValue('form2','artikel'+id)=='') SetFormValue('form2','artikel'+id,'1'); 
   var msg;
   if (check) msg=CheckAnzahl(0,id); else msg='';
   if (msg!='')
      alert(msg.substr(1)); 
   else
      { FormSubmit('form2'); alert('In den Warenkorb gelegt.'); } 
}
