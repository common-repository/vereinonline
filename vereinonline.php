<?php
/*
Plugin Name: VereinOnline.org
Plugin URI: http://www.vereinonline.org/
Description: Zeigt VereinOnline-Inhalte in WordPress an
Version: 2.8.1
Date: 13 Jul 2024
Author: GRITH AG
Author URI: http://www.grith-ag.de/
*/

if (!function_exists('vereinonline'))
{
   $requestnr=0;

   function VereinonlineVersion()
   {
      return "2.8.1";
   }

   function vereinonline($content)
   {
      global $requestnr;

      if (function_exists('get_option'))
      {
         $url=get_option('vereinonline_setting_url', '');
         $usr=get_option('vereinonline_setting_usr', '');
         $pwd=get_option('vereinonline_setting_pwd', ''); if ($pwd!="") $pwd=md5($pwd);
         $web=get_option('vereinonline_setting_web', ''); if ($web=="") $web=$url."?veranstaltung="; // nur fuer [vereinonline_kalender] und [vereinonline_gruppentermine(..)]
         if ($url=="") return $content;
      }

      $html = $content;
      $h="";
      while (VereinOnlineContains($html,"[vereinonline_kalender"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_kalender");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));
         $typ=trim(VereinOnlineParse($par,","));
         $gruppenid=trim(VereinOnlineParse($par,","));
         if (VereinOnlineContains($html,"[/vereinonline_kalender]"))
         {
            $hTemplate=VereinOnlineParse($html,"[/vereinonline_kalender]");
            $mo=$_REQUEST["monat"]; if ($mo=="") $mo=date("Ym"); $yy=substr($mo,0,4); $mm=intval(substr($mo,4)); if (substr($mm,0,1)=="-") $mm=substr($mm,1);
            $filter=array("monat"=>$mo); 
            if ($_REQUEST["gruppe"]!="") $filter["gruppenid"]=$_REQUEST["gruppe"]; else if ($gruppenid!="") $filter["gruppenid"]=$gruppenid;
            $daten=VereinOnlineRequest($url, "GetEvents", $filter, "A/$usr/$pwd");
            $leeretage=jddayofweek(cal_to_jd(CAL_GREGORIAN,$mm,1,intval($yy)),0); $frei=$leeretage==0?6:$leeretage-1;
            $spalte=0;
            $vmm=$mm==1?12:$mm-1; $vyy=$mm==1?$yy-1:$yy; 
            for($tag=1; $tag<=$frei; $tag++)
            {
                $template=VereinOnlineExecuteCondition($hTemplate, array(), array("keintag"=>true));
                $spalte++;
                $template=VereinOnlineReplace("tr7", $spalte%7==0?"</tr><tr>":"", $template);
                $rec=new stdclass; $rec->datum=$vyy."-".$vmm."-".(VereinOnlineTageMonat($vmm, $vyy)-$frei+$tag);
                $h.=VereinonlineVeranstaltung($rec, $template, $aktuell);
            }
            for($tag=1; $tag<=VereinOnlineTageMonat($mm,$yy); $tag++)
            {
                $dat=$yy."-".sprintf("%02d",$mm)."-".sprintf("%02d",$tag);
                $termine=array(); foreach($daten as $itm) if ($itm->datum==$dat) $termine[]=$itm;
                $template=VereinOnlineExecuteCondition($hTemplate, array(), array("keintermin"=>count($termine)==0, "eintermin"=>count($termine)==1));
                $spalte++;
                $template=VereinOnlineReplace("tr7", $spalte%7==0?"</tr><tr>":"", $template);
                if (count($termine)==0) { $data=new stdclass; $data->datum=sprintf("%04d-%02d-%02d",$yy,$mm,$tag); $h.=VereinonlineVeranstaltung($data, $template, $aktuell); } 
                elseif (count($termine)==1) $h.=VereinonlineVeranstaltung($termine[0], $template, $aktuell);
                else
                {
                   $hh=VereinOnlineParse($template,"[vereinonline_termine]"); $h2=VereinOnlineParse($template,"[/vereinonline_termine]");
                   foreach($termine as $t) $hh.=VereinonlineVeranstaltung($t, $h2, $aktuell);
                   $hh.=$template;
                   $h.=VereinonlineVeranstaltung($termine[0], $hh, $aktuell); // Ersetzung mit 1. Termin falls ohne Schleife
                }
            }
            $leeretage=jddayofweek(cal_to_jd(CAL_GREGORIAN,$mm,VereinOnlineTageMonat($mm,$yy),intval($yy)),0); $frei=$leeretage==0?0:7-$leeretage;
            $nmm=$mm==12?1:$mm+1; $nyy=$mm==12?$yy+1:$yy; 
            for($tag=1; $tag<=$frei; $tag++)
            {
                $template=VereinOnlineExecuteCondition($hTemplate, array(), array("keintag"=>true));
                $spalte++;
                $template=VereinOnlineReplace("tr7", $spalte%7==0?"</tr><tr>":"", $template);
                $rec=new stdclass; $rec->datum=$nyy."-".$nmm."-".$tag;
                $h.=VereinonlineVeranstaltung($rec, $template, $aktuell);
            }
         }
         else
         {
            $h.="<div id=\"vereinonlinekalender\" class=\"vereinonlinekalender vereinonlineplugin\" url=\"$url\"></div>\r\n";
            $h.="<script> jQuery(document ).ready(function() { var d=new Date(); GoMonat('".$url."','".$web."',d.getMonth()+1, d.getFullYear(), '$typ', 'A/$usr/$pwd', '$gruppenid'); }); </script>";
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_termin("))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_termin(");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));        
         $id=trim(VereinOnlineParse($par,",")); if ($id=="#id#") $id=$_REQUEST["id"];
         $hTemplate=VereinOnlineParse($html,"[/vereinonline_termin]");

         $aktuell="";
         $daten=VereinOnlineRequest($url, "GetEvent", array("id"=>$id), "A/$usr/$pwd");
         if (isset($daten->error) && $daten->error!="")
            $h.=$daten->error;
         else
         {
            $h.=VereinonlineVeranstaltung($daten, $hTemplate, $aktuell);
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_termine_filter"))
      {
         $request=""; foreach($_REQUEST as $k=>$v) $request.=(is_array($v)?"&${k}[]=".implode("&${k}[]=",$v):"&$k=".$v);
         $h.=VereinOnlineParse($html,"[vereinonline_termine_filter"); 
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));
         if ($par!="") $request.="&parameter=".urlencode($par);
         $h.="<DIV id='vereinonlineterminefilter'></DIV>\r\n";
         //$h.="<script> jQuery(document ).ready(function() { GetEventsFilter('".$url."', '$request'); }); </script>\r\n";
         $h.="<script>\r\nvar vereinonlineurl='".$url."', vereinonlinerequest='$request';\r\n</script>\r\n";
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_termine"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_termine");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));        

         $typ=trim(VereinOnlineParse($par,","));
         $filt=trim(VereinOnlineParse($par,","));
         $jahr=trim(VereinOnlineParse($par,","));
         $maxanz=trim(VereinOnlineParse($par,","));
         $gruppenid=trim(VereinOnlineParse($par,","));
         $hTemplate=VereinOnlineParse($html,"[/vereinonline_termine]");

         if ($typ=="_filter") continue;

         if (intval($filt)!=0)
         {
            $kategorien=VereinOnlineRequest($url, "GetList", array("id"=>$filt), "A/$usr/$pwd");
            if ($kategorien->error!="") $h.=$kategorien->error;
         }
         else
            $kategorien=array();

         $request=array(); foreach($_REQUEST as $k=>$v) if (substr($k,0,9)=="extrafeld") $request[$k]=$v;
         $filter=array();
         if ($typ!="") $filter["typ"]=$typ;
         if ($jahr!="") $filter["jahr"]=$jahr;
         if ($gruppenid!="") $filter["gruppenid"]=$gruppenid;
         if (count($request)>0) $filter["request"]=serialize($request);
         if ($filt!="" && intval($filt)==0) $filter["restriction"]=$filt;
         $daten=VereinOnlineRequest($url, "GetEvents", $filter, "A/$usr/$pwd");
         $aktuell="";
         if (isset($daten->error) && $daten->error!="")
            $h.=$daten->error;
         else if (!is_object($daten) && !is_array($daten))
            $h.="keine Daten";
         else
         {  
            foreach($daten as $rec)
            {
               $h.=VereinonlineVeranstaltung($rec, $hTemplate, $aktuell, $kategorien, $filt);
               if ($maxanz>0) { $maxanz--; if ($maxanz==0) break; }
            }
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_gruppentermine("))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_gruppentermine(");
         $id=VereinOnlineParse($html,")]");

         $daten=VereinOnlineRequest($url, "GetEvents", array(), "A/$usr/$pwd");
         if (isset($daten->error) && $daten->error!="")
            $h.=$daten->error;
         else
         {
            foreach($daten as $rec)
            {
               if ($rec->key_titel_kategorie==$id)
               {
                  $h.="<a href=\"".str_replace("%year%", substr($rec->datum,0,4), $web).$rec->id."\">".VereinOnlineFormatDate($rec->datum, $rec->anzahltage).": ".str_replace("\"","",$rec->titel)."</a>\r\n";
               }
            }
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_bildergalerien"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_bildergalerien");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));        
         if ($par!="" && $par!="!" && $par!="*") $maxanzahl=trim(VereinOnlineParse($par,",")); else $maxanzahl="";

         $hTemplate=VereinOnlineParse($html,"[/vereinonline_bildergalerien]");

         $daten=VereinOnlineRequest($url, "GetPictures", array(), "A/$usr/$pwd");
         if (isset($daten->error) && $daten->error!="")
            $h.=$daten->error;
         else
         {
            foreach($daten as $nr=>$bildergalerie)
            {
               if ($maxanzahl!="") if ($nr>=$maxanzahl) break;
               if (($par=="*" && $bildergalerie->titel=="") || ($par=="!" && $bildergalerie->titel!="")) continue;
               $template=$hTemplate;

               $template=VereinOnlineReplace("id", $bildergalerie->id, $template);
               $template=VereinOnlineReplace("datum", VereinOnlineFormatDate($bildergalerie->datum), $template);
               $template=VereinOnlineReplace("titel", $bildergalerie->titel, $template);
               $template=VereinOnlineReplace("nachlese", $bildergalerie->nachlese, $template);

               $template1=VereinOnlineParse($template,"[vereinonline_bilder]");
               $templateBild=VereinOnlineParse($template,"[/vereinonline_bilder]");
               for($bild=0; $bild<count($bildergalerie->bilder); $bild++)
               {
                  $t=$templateBild;
                  $t=VereinOnlineReplace("file", $url.$bildergalerie->bilder[$bild], $t);
                  $t=VereinOnlineReplace("fileklein", $url.$bildergalerie->bildersmall[$bild], $t);
                  $t=VereinOnlineReplace("text", $bildergalerie->text[$bild], $t);
                  $t=VereinOnlineReplace("nr", $bild+1, $t);
                  $template1.=$t;
               }
               $template=$template1.$template;

               $h.=$template;
             }
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_newsletter"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_newsletter");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));        
         //$p1=trim(VereinOnlineParse($par,","));
         $hTemplate=VereinOnlineParse($html,"[/vereinonline_newsletter]");
         $daten=VereinOnlineRequest($url, "GetNewsletter", array(), "A/$usr/$pwd");
         $aktuell="";
         if (isset($daten->error) && $daten->error!="")
            $h.=$daten->error;
         else
         {
            foreach($daten as $rec)
            {
               $t=$hTemplate;
               foreach($rec as $k=>$v) $t=VereinOnlineReplace($k, $v, $t);
               $h.=$t;
            }
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_news"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_news");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));        
         $anz=trim(VereinOnlineParse($par,","));
         $condition=trim(VereinOnlineParse($par,","));
         $hTemplate=VereinOnlineParse($html,"[/vereinonline_news]");

         $filter=array();
         if ($anz=="*") $filter["alle"]="*"; else if ($anz>0) $filter["maximal"]=$anz;
         if ($condition!="") $filter["condition"]=$condition;

         $daten=VereinOnlineRequest($url, "GetNews", $filter, "A/$usr/$pwd");
         $aktuell="";
         if (isset($daten->error) && $daten->error!="")
            $h.=$daten->error;
         else
         {
            $cnt=0;
            foreach($daten as $rec)
            {
               $template=$hTemplate;

               $attachments=str_replace("\r","",$rec->attachments); $foto=VereinOnlineParse($attachments, "\n");
               $template=VereinOnlineReplace("foto", $foto, $template);
               $template=VereinOnlineExecuteCondition($template, $rec, array("foto"=>$foto!=""));
               $template=VereinOnlineReplace("datum", VereinOnlineFormatDate($rec->datum), $template);
               foreach($rec as $k=>$v) $template=VereinOnlineReplace($k, $v, $template);

               $t="";
               while (VereinOnlineContains($template,"[vereinonline:")) 
               {
                  $t.=VereinOnlineParse($template,"[vereinonline:");
                  $tag=VereinOnlineParse($template,"]");
                  if ($tag=="veranstaltung")
                  {
                     $t1=VereinOnlineParse($template,"[/vereinonline:veranstaltung]");
                     if ($rec->veranstaltungid!=0) 
                     {
                        $t1=VereinOnlineReplace("veranstaltung:url", str_replace("%year%",substr($rec->veranstaltungdatum,0,4),$web).$rec->veranstaltungid, $t1);
                        $t1=VereinOnlineReplace("veranstaltung:titel", $rec->veranstaltungtitel, $t1);
                        $t1=VereinOnlineReplace("veranstaltung:datum", VereinOnlineFormatDate($rec->veranstaltungdatum,$rec->veranstaltunganztage), $t1);
                        $t.=$t1;
                     }
                  }
               }
               $template=$t.$template;

               $h.=$template;
            }
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_shop"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_shop");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));        
         $hTemplate=VereinOnlineParse($html,"[/vereinonline_shop]");

         $filter=array();
         $filter["parameter"]=$par;
         $daten=VereinOnlineRequest($url, "GetShop", $filter, "A/$usr/$pwd");
         $aktuell="";
         if (isset($daten->error) && $daten->error!="")
            $h.=$daten->error;
         else
         {
            $cnt=0;
            foreach($daten as $rec)
            {
               $template=$hTemplate;
               foreach($rec as $k=>$v) $template=VereinOnlineReplace($k, $v, $template);
               $h.=$template;
            }
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_mitglieder"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_mitglieder");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));        
         $rolle=trim(VereinOnlineParse($par,","));
         $sort=trim(VereinOnlineParse($par,","));
         $filterregel=trim(VereinOnlineParse($par,","));
         $hTemplate=VereinOnlineParse($html,"[/vereinonline_mitglieder]");

         $filter=array("felder"=>"vorname,nachname,foto,firma,funktion,g_strasse,g_plz,g_ort,g_telefon,g_email,g_homepage", "rolle"=>$rolle, "sort"=>$sort);
         if ($_REQUEST["suche"]!="") $filter["suche"]=$_REQUEST["suche"];
         if ($_REQUEST["id"]!="") $filter["id"]=$_REQUEST["id"];
         if ($filterregel!="") $filter["filter"]=$filterregel;
         $daten=VereinOnlineRequest($url, "GetMembers", $filter, "A/$usr/$pwd");
         $aktuell="";
         if (isset($daten->error) && $daten->error!="")
            $h.=$daten->error;
         else
         {
            $cnt=0;
            foreach($daten as $n=>$rec)
            {
               $template=$hTemplate;
               $template=VereinOnlineExecuteCondition($template, $rec, array());
               foreach($rec as $k=>$v) $template=VereinOnlineReplace($k, $v, $template);
               $h.=$template;
            }
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_request("))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_request(");
         $par=VereinOnlineParse($html,")]");
         $par=str_replace("&amp;","&",$par);
         $requestid="vereinonlinesubmit".($requestnr==0?"":$requestnr); $requestnr++;
         $h.="<DIV class=\"vereinonlineplugin\" id=\"$requestid\" url=\"$url\"></DIV>\r\n";
         $request=""; foreach($_REQUEST as $k=>$v) $request.=(is_array($v)?"&${k}[]=".implode("&${k}[]=",$v):"&$k=".urlencode(VereinOnlineDbDecode($v)));
         $h.="<script> jQuery(document ).ready(function() { GetRequest('$par$request&dialog=4', '$requestid'); }); </script>";
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_subscribe]"))
      {
         $requestid="vereinonlinesubmit".($requestnr==0?"":$requestnr); $requestnr++;
         $h.=VereinOnlineParse($html,"[vereinonline_subscribe]");
         $h.=VereinOnlineRequestForm($url, "?subscribe", $requestid);
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_spenden]"))
      {
         $requestid="vereinonlinesubmit".($requestnr==0?"":$requestnr); $requestnr++;
         $h.=VereinOnlineParse($html,"[vereinonline_spenden]");
         $h.=VereinOnlineRequestForm($url, "?spenden", $requestid);
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_gruppen"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_gruppen");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));        
         //$p1=trim(VereinOnlineParse($par,","));
         $hTemplate=VereinOnlineParse($html,"[/vereinonline_gruppen]");
         $daten=VereinOnlineRequest($url, "GetGroups", array(), "A/$usr/$pwd");
         $aktuell="";
         if (isset($daten->error) && $daten->error!="")
            $h.=$daten->error;
         else
         {
            foreach($daten as $rec)
            {
               $t=$hTemplate;
               $t=VereinOnlineReplace("name", $rec->name, $t);
               $t=VereinOnlineReplace("id", $rec->id, $t);
               $h.=$t;
            }
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_list"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_list");
         $par=trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]"))));
         $p1=trim(VereinOnlineParse($par,","));
         $p2=trim(VereinOnlineParse($par,","));
         $hTemplate=VereinOnlineParse($html,"[/vereinonline_list]");
         $daten=VereinOnlineRequest($url, "GetList", array("id"=>$p1, "filter"=>$p2), "A/$usr/$pwd");
         $aktuell="";
         if (isset($daten->error))
            $h.=$daten->error;
         else
         {
            foreach($daten as $rec)
            {
               $t=$hTemplate;
               $data=array(); foreach($rec as $v) { $k=VereinOnlineParse($v,"="); $t=VereinOnlineReplace($k, $v, $t); }
               $h.=$t;
            }
         }
      }
      $html=$h.$html;

      $h="";
      while (VereinOnlineContains($html,"[vereinonline_for"))
      {
         $h.=VereinOnlineParse($html,"[vereinonline_for");
         $par=explode("|",trim(str_replace("(","", str_replace(")","", VereinOnlineParse($html,"]")))));
         $hTemplate=VereinOnlineParse($html,"[/vereinonline_for]");
         foreach($par as $nr=>$item)
         {
            $t=$hTemplate;
            $t=VereinOnlineReplace("nr", $nr, $t);
            $t=VereinOnlineReplace("item", trim($item), $t);
            $t=VereinOnlineReplace("active", $nr>0?"":"active", $t);
            $h.=$t;
         }
      }
      $html=$h.$html;

      return $html;
   }

   if (function_exists('get_option'))
   {
      function vereinonline_settings_api_init()
      {
         add_settings_section('vereinonline_setting_section', 'VereinOnline-Einstellungen', 'vereinonline_setting_section_callback_function', 'general');
         add_settings_field('vereinonline_setting_url', 'VereinOnline-URL',      'vereinonline_setting_callback_url', 'general', 'vereinonline_setting_section');
         add_settings_field('vereinonline_setting_usr', 'VereinOnline-Benutzer', 'vereinonline_setting_callback_usr', 'general', 'vereinonline_setting_section');
         add_settings_field('vereinonline_setting_pwd', 'VereinOnline-Passwort', 'vereinonline_setting_callback_pwd', 'general', 'vereinonline_setting_section');
         add_settings_field('vereinonline_setting_web', 'Webseite Termine-URL',  'vereinonline_setting_callback_web', 'general', 'vereinonline_setting_section');
         add_settings_field('vereinonline_setting_ath', 'Login in WordPress mit VereinOnline-Login', 'vereinonline_setting_callback_ath', 'general', 'vereinonline_setting_section');
         add_settings_field('vereinonline_setting_scr', '.js/.css-Dateien', 'vereinonline_setting_callback_scr', 'general', 'vereinonline_setting_section');
         register_setting('general', 'vereinonline_setting_url');
         register_setting('general', 'vereinonline_setting_usr');
         register_setting('general', 'vereinonline_setting_pwd');
         register_setting('general', 'vereinonline_setting_web');
         register_setting('general', 'vereinonline_setting_ath');
         register_setting('general', 'vereinonline_setting_scr');
      }

      function vereinonline_setting_section_callback_function() { echo '<p>VereinOnline-Zugang</p>'; }
      function vereinonline_setting_callback_url() { $setting = esc_attr( get_option( 'vereinonline_setting_url' ) ); echo "<input type='text' name='vereinonline_setting_url' value='".($setting!=""?$setting:"https://vereinonline.org/..../")."' size='60' /><br>Ihr VereinOnline-System (/ am Ende nicht vergessen!)"; }
      function vereinonline_setting_callback_usr() { $setting = esc_attr( get_option( 'vereinonline_setting_usr' ) ); echo "<input type='text' name='vereinonline_setting_usr' value='$setting' size='20' />"; }
      function vereinonline_setting_callback_pwd() { $setting = esc_attr( get_option( 'vereinonline_setting_pwd' ) ); echo "<input type='text' name='vereinonline_setting_pwd' value='$setting' size='20' />"; }
      function vereinonline_setting_callback_web() { $setting = esc_attr( get_option( 'vereinonline_setting_web' ) ); echo "<input type='text' name='vereinonline_setting_web' value='$setting' size='60' /><br>".utf8_encode("Diese Einstellung wird nur benötigt, wenn Sie [vereinonline_kalender] verwenden und die Termine nicht per Link auf \"http://vereinonline.org/IHRVEREIN/?veranstaltung=....\" zeigen sollen, sondern stattdessen auf Ihre WordPress-Seite. Geben Sie hier die Url ein (z.B. \"https://ihrewebseite.de/termine/?id=\", das Plugin ergänzt diese pro Termin am Ende um die ID der Veranstaltung."); }
      function vereinonline_setting_callback_ath() { $setting = esc_attr( get_option( 'vereinonline_setting_ath' ) ); echo "<input type='text' name='vereinonline_setting_ath' value='$setting' size='60' /><br>siehe <A HREF=\"https://www.vereinonline.org/wordpressplugin\" TARGET=\"_new\">https://www.vereinonline.org/wordpressplugin</A>"; }
      function vereinonline_setting_callback_scr() { $setting = esc_attr( get_option( 'vereinonline_setting_scr' ) ); echo "<input type='checkbox' name='vereinonline_setting_scr' value='1'".($setting!=''?' checked':'')."/> aus dem WordPress-Plugin-Verzeichnis laden<br>100% Datenschutz-konform, aber evtl. bei Verwendung von [vereinonline_request(..)] nicht in jeder Hinsicht aktuell!<br>Standard: jeweils aktuellsten Stand (<A HREF=\"https://vereinonline.org/admin/webservices/vereinonline/vereinonline.js\" TARGET=\"_new\">.js</A>, <A HREF=\"https://vereinonline.org/admin/webservices/vereinonline/vereinonline.css\" TARGET=\"_new\">.css</A>) vom Server \"vereinonline.org\" laden."; }

      add_filter('the_content', 'vereinonline', 9);
      add_filter('widget_text', 'vereinonline', 9);
      add_filter('authenticate', 'vereinonline_login', 30, 3);
      add_action('admin_init', 'vereinonline_settings_api_init');
      add_action('wp_enqueue_scripts', 'vereinonline_style');
      add_action('wp_enqueue_scripts', 'vereinonline_script');
   }
   
   function vereinonline_style()
   {
      $scr=get_option('vereinonline_setting_scr', '');
      if ($scr=="")
         wp_enqueue_style('vereinonline', 'https://vereinonline.org/admin/webservices/vereinonline/vereinonline.css', false);
      else
         wp_enqueue_style('vereinonline', plugins_url('vereinonline/vereinonline.css', dirname(__FILE__)), false);
   }

   function vereinonline_script()
   {
      wp_enqueue_script('jquery');

      $scr=get_option('vereinonline_setting_scr', '');
      if ($scr=="")
         wp_enqueue_script('vereinonline-js', 'https://vereinonline.org/admin/webservices/vereinonline/vereinonline.js', false, array('jquery'));
      else
         wp_enqueue_script('vereinonline-js', plugins_url('vereinonline/vereinonline.js', dirname(__FILE__)), array('jquery'), false, true);
   }

   function VereinOnlineDbDecode($txt)
   {
      return str_replace("\\\\","\\",str_replace("\\\"","\"",str_replace("\\'","'",$txt)));
   }

   function VereinOnlineParse(&$a, $ch)
   {
      $pos=strpos($a, $ch);
      if ($pos===false) { $ret=$a; $a=""; } else { $ret=substr($a, 0, $pos); $a=substr($a, $pos+strlen($ch)); }
      return $ret;
   }

   function VereinOnlineContains($txt, $s)
   {
      if ($s=="") return false;
      return !(strpos($txt, $s)===false);
   }

   if (function_exists('get_option'))
   {
      function VereinOnlineRequest($url, $funktion, $daten, $token)
      {
         $url.="?json";
         $url.="&function=$funktion&version=".VereinonlineVersion();
         foreach($daten as $k=>$v) $url.="&$k=".urlencode($v);
         if ($token!="" && $token!="A//") $url.="&token=$token";

         $curl=curl_init();
         curl_setopt($curl, CURLOPT_URL, $url);
         curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
         if (array_key_exists("HTTP_ACCEPT_LANGUAGE", $_SERVER)) curl_setopt($curl, CURLOPT_HTTPHEADER, array("Accept-Language: ".$_SERVER["HTTP_ACCEPT_LANGUAGE"]));
         curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
         curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
         return json_decode(curl_exec($curl));
      }
   }

   function VereinOnlineRequestForm($url, $parameter, $requestid)
   {
      $curl = curl_init();
      curl_setopt($curl, CURLOPT_URL, "$url$parameter&dialog=4&version=".VereinonlineVersion());
      curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
      if (array_key_exists("HTTP_ACCEPT_LANGUAGE", $_SERVER)) curl_setopt($curl, CURLOPT_HTTPHEADER, array("Accept-Language: ".$_SERVER["HTTP_ACCEPT_LANGUAGE"]));
      //if ($usr!="") curl_setopt($curl, CURLOPT_COOKIE, "token=/$usr/$pwd");
      curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
      curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
      $result=utf8_encode(str_replace("\r","",str_replace("\n","",curl_exec($curl))));
      if (curl_error($curl)!="") $result.="$url$parameter&dialog=4,error:".utf8_encode(curl_error($curl));
      curl_close($curl);

      $result="<DIV class=\"vereinonlineplugin\" id=\"$requestid\" url=\"$url\">$result</DIV>";
      $result=vereinonline_replace($result, $url, $requestid);
      return $result;
   }

   function VereinOnlineFormatDate($datum, $tage=1)
   {
      if (strlen(trim($datum))==0) return "";
      if (!(strpos($datum,".")===false)) return $datum;
      if ($datum=="0000-00-00") return "";
      $w1=explode(" ",$datum);
      $w2=explode("-",$w1[0]);
      if (!array_key_exists(1, $w1) || $w1[1]=="00:00:00") $w1[1]="";
      if ($w2[0]=="1900") $w2[0]="";

      $weekdays = array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
      $wo=$weekdays[jddayofweek(cal_to_jd(CAL_GREGORIAN,intval($w2[1]),intval($w2[2]),intval($w2[0])),0)];

      $txt=substr($wo,0,2).", ".trim($w2[2].".".$w2[1].".".$w2[0]." ".$w1[1]);
      if ($tage>1) $txt.=" bis ".VereinOnlineFormatDate(VereinOnlineAddDays($w1[0], $tage-1));

      return $txt;
   }

   function VereinOnlineKategorie($kategorien, $id, $key)
   {
      if (is_array($kategorien))
         foreach($kategorien as $kategorie)
            if (in_array("#id=$id", $kategorie)) 
               foreach($kategorie as $k) if (substr($k,0,strlen($key)+1)==$key."=")
                  return substr($k,strlen($key)+1);
      return "-";
   }

   function VereinOnlineAddDays($dat, $tage=1, $monate=0)
   {
      if ($tage==0 && $monate==0) return $dat;
      $a=explode("-",$dat);
      $y=$a[0];
      $m=$a[1]+$monate;
      $d=$a[2]+$tage;
      while ($d<1) { $m--; if ($m<1) { $m+=12; $y--; } $d+=VereinOnlineTageMonat($m,$y); }
      while ($d>VereinOnlineTageMonat($m,$y)) { $d-=VereinOnlineTageMonat($m,$y); $m++; if ($m>12) { $m-=12; $y++; } }
      while ($m>12) { $m-=12; $y++; }
      return sprintf("%04d",$y)."-".sprintf("%02d",$m)."-".sprintf("%02d",$d);
   }

   function VereinOnlineTageMonat($m,$y)
   {
      $m=intval($m); $y=intval($y);
      if ($m==4 || $m==6 || $m==9 || $m==11) return 30;
      if ($m==1 || $m==3 || $m==5 || $m==7 || $m==8 || $m==10 || $m==12) return 31;
      if (intval($y/4)==$y/4) return 29; else return 28;
   }

   function VereinonlineVeranstaltung($rec, $hTemplate, &$aktuell, $kategorien=array(), $filt="")
   {
      global $useridentifier;
      if (!$rec) return $hTemplate;

      $template=$hTemplate;
      $rec->anker=""; $recdatum=$rec->datum;
      if ($aktuell=="") if ($rec->datum>=date("Y-m-d")) { $aktuell=$rec->id; $rec->anker="aktuell"; }

      $monat=array(1=>"Jan", 2=>"Feb", 3=>"Mar", 4=>"Apr", 5=>"Mai", 6=>"Jun", 7=>"Jul", 8=>"Aug", 9=>"Sep", 10=>"Okt", 11=>"Nov", 12=>"Dez");
      $rec->datum_d=date("d",strtotime($rec->datum));
      $rec->datum_M=$monat[date("n",strtotime($rec->datum))];
      $rec->anmeldeschluss=VereinOnlineFormatDate($rec->anmeldeschluss); if ($rec->anmeldeschluss=="") $rec->anmeldeschluss=VereinOnlineFormatDate($rec->datum);
      $datum=VereinOnlineFormatDate($rec->datum, $rec->anzahltage);
      if (intval($filt)!=0)
      {
         $rec->kategorie=VereinOnlineKategorie($kategorien, $rec->key_titel_kategorie, "name"); if ($rec->kategorie=="-") $rec->kategorie="";
         $beschreibung=VereinOnlineKategorie($kategorien, $rec->key_titel_kategorie, "beschreibung");
         if ($rec->kategorie==$rec->titel) { $rec->kategorie=""; $rec->beschreibung=$beschreibung; }
         $template=VereinOnlineReplace("key_titel_kategorie:name", $rec->kategorie, $template);
         $template=VereinOnlineReplace("key_titel_kategorie:beschreibung", $beschreibung, $template);
         $template=VereinOnlineReplace("activetab", $rec->kategorie!=""?2:1, $template);
      }

      $data=array();
      foreach($rec as $k=>$v) $data[$k]=$v;
      $data["foto"]=$rec->bild; if ($data["foto"]=="") { $attachments=str_replace("\r","",$rec->attachments); $data["foto"]=VereinOnlineParse($attachments, "\n"); }

      $template=VereinOnlineReplace("datum", $datum, $template);
      foreach($data as $k=>$v) if (!is_object($v) && !is_array($v)) $template=VereinOnlineReplace($k, $v, $template);
      foreach($data as $k=>$v) if (!is_object($v) && !is_array($v)) $template=VereinOnlineReplace("$k:ERSETZEUMLAUTE", VereinOnlineErsetzeUmlaute($v), $template);

      $css="";
      if ($recdatum<date("Y-m-d")) $css.=" terminvergangen";
      if ($recdatum==date("Y-m-d")) $css.=" heute";
      if (isset($useridentifier) && $useridentifier!=0) if ($rec->angemeldet=="0") $css.=" terminangemeldet";
      if ($rec->akid!=0) $css.=" termingruppe".$rec->akid;
      if ($rec->typ!=0) $css.=" termintyp".$rec->typ;
      $template=VereinOnlineReplace("css", trim($css), $template);

      $t="";
      while (VereinOnlineContains($template,"[vereinonline:")) 
      {
         $t.=VereinOnlineParse($template,"[vereinonline:");
         VereinOnlineParse($template,"]");
      }
      $template=$t.$template;

      $template=VereinOnlineExecuteCondition($template, $rec, array("anmeldungmoeglich"=>$recdatum>=date("Y-m-d") && $rec->oeffentlich!=2));
      return $template;
   }

   function VereinOnlineExecuteCondition($template, $rec, $conditions)
   {
      $t="";
      while (VereinOnlineContains($template,"[vereinonline_if("))
      {
         $t.=VereinOnlineParse($template,"[vereinonline_if(");
         $txt=VereinOnlineParse($template,"[vereinonline_endif]");

         while ($txt!="")
         {
            $cond=VereinOnlineParse($txt,")]");
            if (VereinOnlineContains($txt,"[vereinonline_elseif(")) { $txtif=VereinOnlineParse($txt,"[vereinonline_elseif("); $txtelseif=$txt; }
            else if (VereinOnlineContains($txt,"[vereinonline_else]")) { $txtif=VereinOnlineParse($txt,"[vereinonline_else]"); $txtelseif=""; }
            else { $txtif=$txt; $txtelseif=""; $txt=""; }

            if (array_key_exists($cond,$conditions)) $ok=$conditions[$cond]; else $ok=$rec->$cond!="" && $rec->$cond!="-";
            if ($ok) { $t.=$txtif; break; }
            if ($txtelseif=="") { $t.=$txt; break; }
         }
      }
      return $t.$template;
   }

   function VereinOnlineReplace($alt,$neu,$txt)
   {
      $txt=str_replace("[vereinonline:".$alt."]", $neu, $txt);
      $txt=str_replace("[vereinonline\$".str_replace(":","\$",$alt)."]", $neu, $txt);
      return $txt;
   }

   function VereinOnlineErsetzeUmlaute($txt)
   {
      $txt=utf8_decode($txt);
      $txt=str_replace("ä","ae",$txt);
      $txt=str_replace("ö","oe",$txt);
      $txt=str_replace("ü","ue",$txt);
      $txt=str_replace("Ä","Ae",$txt);
      $txt=str_replace("Ö","Oe",$txt);
      $txt=str_replace("Ü","Ue",$txt);
      $txt=str_replace("ß","ss",$txt);
      return utf8_encode($txt);
   }

   function vereinonline_login($user, $username, $password)
   {
      if ($username == '' || $password == '') return $user;
      if (!function_exists('get_option')) return $user;
      $ath=get_option('vereinonline_setting_ath', '');
      if ($ath=="") return $user;
      $url=get_option('vereinonline_setting_url', '');
      $usr=get_option('vereinonline_setting_usr', '');
      $pwd=get_option('vereinonline_setting_pwd', ''); if ($pwd!="") $pwd=md5($pwd);

      $auth=VereinOnlineRequest($url, "CheckLogin", array("user"=>$username, "password"=>$password, "auth"=>$ath), "A/$usr/$pwd");
      //if ($auth->error!="") return new WP_Error('denied', $auth->error);

      if ($auth->error=="")
      {
         $userobj = new WP_User();
         $user = $userobj->get_data_by( 'email', $auth->email ); // Does not return a WP_User object ??
         $user = new WP_User($user->ID); // Attempt to load up the user with that ID
         if ($user->ID==0)
         {
            //$user = new WP_Error( 'denied', __("ERROR: Not a valid user for this system") );
            $userdata = array( 'user_email' => $auth->email, 'user_login' => $auth->email, 'first_name' => $auth->vorname, 'last_name' => $auth->nachname);
            $new_user_id = wp_insert_user( $userdata ); // A new user has been created
            $user = new WP_User ($new_user_id);
         } 
         if ($auth->rolle!="") wp_update_user( array ('ID' => $user->ID, 'role' => $auth->rolle) ) ;
      }
      return $user;
   }

   function vereinonline_replace($result, $url, $requestid)
   {
      $result=str_replace("OpenPopup('./", "OpenPopup('$url", $result);
      $result=str_replace("src=\"temp", "src=\"${url}temp", $result);
      $result=str_replace("src=\"fotos", "src=\"${url}fotos", $result);
      $result=str_replace("src=\"admin", "src=\"${url}admin", $result);
      $result=str_replace("$"."(", "jQuery(", $result);
      $result=str_replace("$".".", "jQuery.", $result);
      $result=str_replace("FormSubmit(", "WPFormSubmit('".$requestid."',", $result);
      $result=str_replace("Form1Submit(", "WPFormSubmit('".$requestid."','form1'", $result);
      $result=str_replace("SetFormValue(", "WPSetFormValue('".$requestid."',", $result);
      $result=str_replace("SetForm1Value(", "WPSetFormValue('".$requestid."','form1',", $result);
      $result=str_replace("SendLogin(", "WPSendLogin('".$requestid."',", $result);
      $result=str_replace("formlogin1", $requestid."formlogin1", $result);
      return $result;
   }
}

?>