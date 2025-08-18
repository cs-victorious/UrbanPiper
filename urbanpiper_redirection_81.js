// redirection custom script. code optimization is welcome
var run_redirect = true;

/**
 * This is a code that checks if a script element with the source URL "https://country-check.urbanpiper.workers.dev/script.js" 
 * exists in the HTML document. If it does not exist, it creates a new script element with that source URL and appends it to the HTML document's head element.
 */
if (document.querySelectorAll(`script[src="https://country-check.urbanpiper.workers.dev/script.js"]`).length <= 0) {
    var geodata_script = document.createElement('script');
    geodata_script.src = 'https://country-check.urbanpiper.workers.dev/script.js';
    document.head.appendChild(geodata_script);
}

/**
 * This is a code that performs a conditional redirect based on the values of certain variables.
 * This gets the source, country, and lang value from client's browser. 
 * These 3 values will help determine whether the user is using normal location or is using the language dropdown
 */
 
var url = new URL(window.location.href);
if(url.href.includes('utm_') || url.href.includes('urbanpipervscompetidores') || url.href.includes('urbanpiper-versus-otherpossystems') || url.href.includes('uk/free-trial')){
    //no redirection
}else if( url.href.includes('en-kw') || url.href.includes('en-qa') || url.href.includes('en-bh') || url.href.includes('en-eg') || url.href.includes('en-ae') || url.href.includes('en-sa') ||
          url.href.includes('ar-kw') || url.href.includes('ar-qa') || url.href.includes('ar-bh') || url.href.includes('ar-eg') || url.href.includes('ar-ae') || url.href.includes('ar-sa')){ //new added april 5, 2024 | set flag on kw, qa, bh and eg pages
        var lang = 'EN';
        if(url.href.includes('en-kw') || url.href.includes('ar-kw')){
            temploc = 'kw';
        }else if(url.href.includes('en-qa') || url.href.includes('ar-qa')){
            temploc = 'qa';
        }else if(url.href.includes('en-bh') || url.href.includes('ar-bh')){
            temploc = 'bh';
        } else if(url.href.includes('en-eg') || url.href.includes('ar-eg')){
            temploc = 'eg';
        } else if(url.href.includes('en-ae') || url.href.includes('ar-ae')){
            temploc = 'ae';
        } else if(url.href.includes('en-sa') || url.href.includes('ar-sa')){
            temploc = 'sa';
        }
        if($('.lpl-c-'+temploc).length > 0){
            var img_src = window.getComputedStyle($('.lpl-c-'+temploc)[0],':before').content;  
                img_src = img_src.match(/\"(.*?)\"/);
                $('.language-block').find('img').attr('src',img_src[1]);
                $('.language-block').find('.language-picker-title').text(lang.toUpperCase());
        }
        //no redirection
} 
else{
    if(run_redirect){
        var source = getWithExpiry("source") ? getWithExpiry('source') : '';
        var country = getWithExpiry('country') ? getWithExpiry('country') : '';
        var lang = getWithExpiry('lang') ? getWithExpiry('lang') : '';
        RedirectbyLoc(source, country, lang);
    }
}



/**
 * This is the main code block for redirection conditions
 * 
 * This code below is used all throughout inside RedirectbyLoc() code block. 
 * What this do is by checking if the current URL's path name matches a given URL.
 * If it doesn't match, the code will redirect the user to the given URL. 
 * If it does match, the code will update the browser history with the given URL.
 *
 *          if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ 
                window.location.href = toUrl; 
            }
            else{ if(replaced){ history.pushState(null, null, toUrl); } }
 *
 */
function RedirectbyLoc(source = '', country = '', lang = ''){

    var url = new URL(window.location.href);
    var backlink = ''; var replaced = false;
    
    if(source == 'drpdwn'){
        var loc = getLoc('', country, lang);

        console.log('drpdwn getLoc = ', loc);

        setWithExpiry('source','drpdwn',3600000);
        setWithExpiry('country',country,3600000);
        setWithExpiry('lang',lang,3600000);
    }
    else{

        var loc = getLoc(window.GEO_DATA.country);
        console.log('auto getLoc = ', loc);
        var temploc = loc;
        var lang = 'EN';

        if(loc == 'ar'){
            temploc = 'sa'; 
            lang = 'AR';
        }
        else if(loc == 'es' || loc == 'es-main' ){  //added 'loc == 'es-main' | sept 29, 2023
            lang = 'ES';
            temploc = 'es'; //added 'temploc = 'es'' | sept 29, 2023
        }
        else if(loc == 'in'){ 
            temploc = 'india'; 
            loc = 'main';
        }
        else if(loc == 'eg'){ 
            temploc = 'eq'; 
        }

        /**
         * This code is updating the image source and title text of a language picker element on the webpage 
         * based on the value of a CSS property of another element on the page.
         * Basically, updates the language flag and text in the dropdown on click.
         */

        if($('.lpl-c-'+temploc).length > 0){
            var img_src = window.getComputedStyle($('.lpl-c-'+temploc)[0],':before').content;  
                img_src = img_src.match(/\"(.*?)\"/);
                $('.language-block').find('img').attr('src',img_src[1]);
                $('.language-block').find('.language-picker-title').text(lang.toUpperCase());
        }
    }

    // If location is from India, US, Canada, Australia, or Spanish countries, show the PRIME-POS page.
    if(country == 'in' || country == 'us' || country == 'au' || loc == 'es'){ //|| country == 'ca' 
        document.querySelectorAll('.js-prime-element').forEach(e => e.style.display = 'block')
    }
  
    // clean up backlink from any forward slash at the end of the URL
    backlink = url.pathname.replace(/^\/|\/$/g, '');  

    // remove KSA landing page parent and its url.
    backlink = backlink.replace('manage-online-orders/en-sa', '');
    backlink = backlink.replace('manage-online-orders/ar-sa', '');

    // This code is using a regular expression to remove specific country codes from a given URL
    backlink = backlink.replace(/\b^uk(\/)?\b|\b^en-sa(\/)?\b|\b^ar-sa(\/)?\b|\b^ar-ae(\/)?\b|\b^en-ae(\/)?\b|\b^ae(\/)?\b|\b^us(\/)?\b|\b^es(\/)?\b|\b^ar-kw(\/)?\b|\b^ar-qa(\/)?\b|\b^ar-bh(\/)?\b|\b^ar-eg(\/)?\b|\b^ar(\/)?\b|\b^ca(\/)?\b|\b^au(\/)?\b|\b^en-kw(\/)?\b|\b^en-eg(\/)?\b|\b^en-bh(\/)?\b|\b^en-qa(\/)?\b|\b^fr(\/)?\b/g, '');
    var temp_replaced = backlink;
    backlink = backlink.replace(/(https?:\/\/)|(\/)+/g, "$1$2");
    if(temp_replaced != backlink){ replaced = true; }

    // remove starting slash
    backlink = backlink.replace(/^\/|\/$/g, '');

    // remove trailing slash at the end
    backlink = backlink.replace(/\/$/, "");       
    
    if(backlink == 'free-trial'){}
    else if(backlink == '404'){}
    else if(backlink == 'restaurant-qsr'){

        var toUrl = '/'+backlink;
        if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ 
            window.location.href = toUrl; 
        }
        else{ if(replaced){ history.pushState(null, null, toUrl); } }
    }
    else if(backlink == 'terms-of-service' || backlink == 'privacy-policy'){

        var toUrl = '/'+backlink;
        if(loc == 'uk' || loc == 'ae'){  toUrl = '/'+loc+'/'+backlink; }

        if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ 
            window.location.href = toUrl; 
        }
        else{ if(replaced){ history.pushState(null, null, toUrl); } }
    }
    else if(backlink == 'blog' || backlink.split('/')[0] == 'blog'){

        if(loc == 'uk' || loc == 'ae' || loc == 'fr'){
            var tmp_nav = document.querySelectorAll('nav[role="navigation"]');
            if(tmp_nav.length > 0){
                tmp_nav[0].querySelectorAll('.products')[0].remove();
                var tmp_foot_firstcol = document.querySelectorAll('.section-footer .footer-right .footer-item:first-child *');
                tmp_foot_firstcol.forEach(element => {
                    element.remove();
                });
            }
            var toUrl = backlink != '' ? '/'+backlink : '/';
            if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ window.location.href = toUrl; }
            else{ if(replaced){ history.pushState(null, null, toUrl); } }
        }
        else{
            if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2").split('/')[1] == 'uk' || 
            url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2").split('/')[1] == 'ae' ||
            url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2").split('/')[1] == 'es'){ 
                var toUrl = backlink != '' ? '/'+backlink : '/';
                if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ window.location.href = toUrl; }
                else{ if(replaced){ history.pushState(null, null, toUrl); } }
            }
        }
    }
    else if(backlink == 'integrations' || backlink.split('/')[0] == 'integrations'){
        if(loc == 'uk'){
            const strn = document.querySelector('.section-top-ribbon');  
            strn.classList.add("active");
            document.querySelectorAll('.nav-dd.products')[0].remove();
        }
        if(loc == 'ae' || loc == 'kw' || loc == 'qa' || loc == 'bh' || loc == 'eg' || loc == 'sa'){
            //document.querySelectorAll('.nav-dd.products')[0].remove();
        }
        var toUrl = backlink != '' ? '/'+backlink : '/';
        if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ window.location.href = toUrl; }
        else{ if(replaced){ history.pushState(null, null, toUrl); } }
    }
    else if(backlink == 'e-commerce' || backlink == 'punto-de-venta'){

        // ES spanish
        var toUrl = backlink != '' ? '/'+backlink : '/';
        if(loc == 'es'){
            toUrl = '/'+loc+(backlink != '' ? '/'+backlink : backlink); 
        }
        else if(loc == 'es-main'){//added sept 29, 2023
            if(backlink == 'e-commerce'){
                backlink = '';
            }
            toUrl = '/'+'es'+(backlink != '' ? '/'+backlink : backlink); 
        }//end added sept 29, 2023
        else if(loc == 'ar' || loc == 'uk' || loc == 'ae' || loc == 'fr'){
            toUrl = '/'+loc;
        }
        else if(loc == 'au' || loc == 'ca' || loc == 'main'){
            if(backlink == 'e-commerce'){
                backlink = 'meraki';
            }
            if(backlink == 'punto-de-venta'){
                backlink = 'prime-pos';
            }
            toUrl = (loc == 'main' ? '' : '/'+loc)+(backlink != '' ? '/'+backlink : backlink);
        }

        if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ 
            window.location.href = toUrl; 
        }
        else{ if(replaced){ history.pushState(null, null, toUrl); } }
    }
    else if(backlink == 'a-propos'){

        var toUrl = backlink != '' ? '/'+backlink : '/';

        if(loc == 'fr'){
            toUrl = '/'+loc+(backlink != '' ? '/'+backlink : backlink); 
        }
        else if(loc == 'ar' || loc == 'uk' || loc == 'ae' || loc == 'es'){
            backlink = 'about-us';
            toUrl = '/'+loc+(backlink != '' ? '/'+backlink : backlink); 
        }
        else if(loc == 'au' || loc == 'ca' || loc == 'main'){
            backlink = 'about-us';
            toUrl = (loc == 'main' ? '' : '/'+loc)+(backlink != '' ? '/'+backlink : backlink);
        }

        if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ 
            window.location.href = toUrl; 
        }
        else{ if(replaced){ history.pushState(null, null, toUrl); } }
    }
    else if(backlink == 'meraki' || backlink == 'hub'){

        var toUrl = backlink != '' ? '/'+backlink : '/';
        if(loc == 'es'){
            if(backlink == 'meraki'){
                backlink = 'e-commerce';
            }
            if(backlink == 'prime-pos'){
                backlink = 'punto-de-venta';
            }
            toUrl = '/'+loc+(backlink != '' ? '/'+backlink : backlink); 
        }
        else if(loc == 'au'){ 
            toUrl = '/'+loc+(backlink != '' ? '/'+backlink : backlink); 
        }
        else if(loc == 'ca'){
            toUrl = '/'+loc+(backlink != '' ? '/'+backlink : backlink); 
        }
        else if(loc == 'ar'){
            toUrl = '/ar'; 
        }
        else if(loc == 'uk'){
            toUrl = '/uk';
        }
        else if(loc == 'fr'){
            toUrl = '/fr';
        }
        else if(loc == 'us'){
            toUrl = '/'+loc+(backlink != '' ? '/'+backlink : backlink); 
        }
        else if(loc == 'ae'){
            toUrl = '/en-ae';
        }

        if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ 
            window.location.href = toUrl; 
        }
        else{ if(replaced){ history.pushState(null, null, toUrl); } }
    }
    else if(
        backlink == 'case-study' || backlink.split('/')[0] == 'case-study' ||
        (backlink.split('/')[0]+'/'+backlink.split('/')[1]) == 'uk/case-study' ||
        (backlink.split('/')[0]+'/'+backlink.split('/')[1]) == 'ae/case-study' ||
        (backlink.split('/')[0]+'/'+backlink.split('/')[1]) == 'es/case-study' ||
        (backlink.split('/')[0]+'/'+backlink.split('/')[1]) == 'ar/case-study' ||
        backlink == 'case-studies-categories' || backlink.split('/')[0] == 'case-studies-categories' ||
        (backlink.split('/')[0]+'/'+backlink.split('/')[1]) == 'uk/case-studies-categories' ||
        (backlink.split('/')[0]+'/'+backlink.split('/')[1]) == 'ae/case-studies-categories' ||
        (backlink.split('/')[0]+'/'+backlink.split('/')[1]) == 'es/case-studies-categories' ||
        (backlink.split('/')[0]+'/'+backlink.split('/')[1]) == 'ar/case-studies-categories'
    ){
        var toUrl = backlink != '' ? '/'+backlink : '/';
        if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ 
            window.location.href = toUrl; 
        }
        else{ if(replaced){ history.pushState(null, null, toUrl); } }
    }
    else if(backlink == 'customer-stories' && (loc == 'es' || loc == 'ar' || loc == 'ar-sa' || loc == 'fr')){
        var toUrl = backlink != '' ? '/'+backlink : '/';
        if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ window.location.href = toUrl; }
        else{ if(replaced){ history.pushState(null, null, toUrl); } }
        if(loc == 'fr'){
            document.querySelectorAll('.nav-dd.products')[0].remove();
            document.querySelector('.cc-navbar-single-hub-products').style.display = "flex";            
        }
    }
    else if(backlink.split('/')[0] == 'legal'){
       if(loc == 'es' || loc == 'uk' || loc == 'ae' || loc == 'ar'){ 
          var toUrl = backlink != '' ? '/'+backlink : '/';
           if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ window.location.href = toUrl; }
           else{ if(replaced){ history.pushState(null, null, toUrl); } }
       }
    }
    else{
        var toUrl = backlink != '' ? '/'+backlink : '/';
        if(loc == 'uk'){ 
            toUrl = '/uk'+(backlink != '' ? '/'+backlink : backlink); 
        }
        if(loc == 'fr'){ 
            toUrl = '/fr'+(backlink != '' ? '/'+backlink : backlink); 
        }
        if(loc == 'us'){
          if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
              toUrl = '/' + backlink;
          }
          else{
              toUrl = '/us'+(backlink != '' ? '/'+backlink : backlink); 
          }
        }
        // if(loc == 'us'){ 
        //     toUrl = '/us'+(backlink != '' ? '/'+backlink : backlink); 
        // }
        else if(loc == 'ae'){ 
           // document.querySelectorAll('.nav-dd.products')[0].remove();
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }
            else{
                toUrl = '/en-ae'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }
        else if(loc == 'ar-ae'){         
           // document.querySelectorAll('.nav-dd.products')[0].remove();    
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }
            else{
                toUrl = '/ar-ae'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }
        else if(loc == 'ar-sa'){ 
            //document.querySelectorAll('.nav-dd.products')[0].remove();
            if(backlink == 'about-us' || backlink == 'contact-us'){
                toUrl = '/ar/' + backlink;
            }
            else{
                toUrl = '/ar-sa'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }
        else if(loc == 'ar'){ 
           // document.querySelectorAll('.nav-dd.products')[0].remove();
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }
            else{
                toUrl = '/en-sa'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }        
        else if(loc == 'kw'){ 
          //  document.querySelectorAll('.nav-dd.products')[0].remove();
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }
            else{
                toUrl = '/en-kw'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }
        else if(loc == 'qa'){ 
          //  document.querySelectorAll('.nav-dd.products')[0].remove();
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }
            else{
                toUrl = '/en-qa'+(backlink != '' ? '/'+backlink : backlink);
            } 
        }
        else if(loc == 'bh'){     
           // document.querySelectorAll('.nav-dd.products')[0].remove();       
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }
            else{
                toUrl = '/en-bh'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }
        else if(loc == 'eg'){ 
           // document.querySelectorAll('.nav-dd.products')[0].remove();
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }
            else{
                toUrl = '/en-eg'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }
        else if(loc == 'ar-kw'){ 
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }
            else{
                toUrl = '/ar-kw'+(backlink != '' ? '/'+backlink : backlink);  
            }
        }
        else if(loc == 'ar-qa'){ 
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }else{
                toUrl = '/ar-qa'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }
        else if(loc == 'ar-bh'){ 
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }else{
                toUrl = '/ar-bh'+(backlink != '' ? '/'+backlink : backlink); 
            }            
        }
        else if(loc == 'ar-eg'){ 
            if(backlink == 'about-us' || backlink == 'contact-us' || backlink == 'customer-stories'){
                toUrl = '/' + backlink;
            }else{
                toUrl = '/ar-eg'+(backlink != '' ? '/'+backlink : backlink); 
            }    
        }
        else if(loc == 'es'){ 
            if(backlink == ''){
                toUrl = '/es/e-commerce';
            }
            else{
                toUrl = '/es'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }
        else if(loc == 'es-main'){ //triggered when user is on Spain | added sept 29, 2023
            if(backlink == ''){
                toUrl = '/es';
            }
            else{
                toUrl = '/es'+(backlink != '' ? '/'+backlink : backlink); 
            }
        }
        else if(loc == 'in' && backlink == ''){ 
            window.location.href = '';
        }
        else if(loc == 'ca' || loc == 'au'){ 
            if(backlink == 'hub' || backlink == 'meraki' || backlink == 'prime-pos' || backlink == 'e-commerce' || backlink == 'punto-de-venta'){
                if( loc == 'ca'){
                    if( backlink == 'meraki' ){                        
                        toUrl = '/'+loc+'/meraki';
                    }else{
                        toUrl = '/'+loc+'/hub';
                    }
                    
                }else{
                    toUrl = '/'+loc+(backlink != '' ? '/'+backlink : backlink); 
                }                
            }
            else if(backlink == ''){                
                if(loc == 'ca'){ // make hub page as a default page for US location (Feb 23, 2024)
                    toUrl = '/'+loc+'/hub'; 
                }else{
                    //toUrl = '/'+loc+'/e-commerce';
                    toUrl = '/'+loc+'/meraki';
                }
            }
        }
        if(url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){ window.location.href = toUrl; }
        else{  if(replaced){ history.pushState(null, null, toUrl); } }
    }
}

/**
 * This is a function that takes in a country code, and optional country and language parameters, and returns a string representing the location.
 * This function is used in conjunction with other code to redirect users based on their location.
 */
function getLoc(country_code, country = '', lang = ''){
    if(country_code == 'GBR' || country_code == 'EU' || country_code == 'GB' || country == 'uk'){ 
        return 'uk'; 
    }
    else if(
            country_code == 'ARE' || country_code == 'DZA' || country_code == 'BHR' ||
            country_code == 'AE' || country_code == 'DZ' || 
            country_code == 'IRN' || country_code == 'IRQ' || country_code == 'ISR' || country_code == 'JOR' ||
            country_code == 'IR' || country_code == 'IQ' || country_code == 'IL' || country_code == 'JO' ||
            country_code == 'LBN' || country_code == 'LBY' || country_code == 'MAR' ||
            country_code == 'LB' || country_code == 'LY' || country_code == 'MA' ||
            country_code == 'OMN' || country_code == 'QAT' || country_code == 'SYR' ||
            country_code == 'OM' || country_code == 'SY' || (country == 'ae' && lang == 'en') ||
            country_code == 'TUN' || country_code == 'YEM' || country_code == 'TU' || country_code == 'YE'){
            return 'ae';
    }
    else if(
            country_code == 'ARE' || country_code == 'DZA' || country_code == 'BHR' ||
            country_code == 'AE' || country_code == 'DZ' || 
            country_code == 'IRN' || country_code == 'IRQ' || country_code == 'ISR' || country_code == 'JOR' ||
            country_code == 'IR' || country_code == 'IQ' || country_code == 'IL' || country_code == 'JO' ||
            country_code == 'LBN' || country_code == 'LBY' || country_code == 'MAR' ||
            country_code == 'LB' || country_code == 'LY' || country_code == 'MA' ||
            country_code == 'OMN' || country_code == 'QAT' || country_code == 'SYR' ||
            country_code == 'OM' || country_code == 'SY' || (country == 'ae' && lang == 'ar') ||
            country_code == 'TUN' || country_code == 'YEM' || country_code == 'TU' || country_code == 'YE'){
            return 'ar-ae';
    }
    else if( country_code == 'USA' || country_code == 'US' || country == 'us' ){
        return 'us';
    }
    else if( country_code == 'AU' || country_code == 'AUS' || country == 'au' ){
        return 'au';
    }
    else if( country_code == 'CA' || country_code == 'CAN' || country == 'ca' ){
        return 'ca';
    }
    else if( country_code == 'IN'){
        return 'in';
    }
    else if( country_code == 'FR' || country == 'fr'){
        return 'fr';
    }
    else if( country_code == 'MX' || country_code == 'MEX' || country_code == 'CO' || country_code == 'COL' || 
        country_code == 'CL' || country_code == 'CHL' || country == 'mx'  
        || country == 'co' || country == 'cl' ){
        return 'es';
    }
    else if(country_code == 'ES' || (country == 'es' && lang == 'es')){ //if country is Spain return 'es-main' | sept 28,2023
        return 'es-main';
    }else if( country_code == 'SA' || country_code == 'SAU' || country_code == 'PK' || country_code == 'PAK' || (country == 'sa' && lang == 'ar')){
        return 'ar-sa';
    }else if( country_code == 'SA' || country_code == 'SAU' || country_code == 'PK' || country_code == 'PAK' || (country == 'sa' && lang == 'en')){
        return 'ar';
    }else if( country_code == 'KW' || (country == 'kw' && lang == 'en')){
        return 'kw';
    }else if( country_code == 'QA' || (country == 'qa' && lang == 'en')){
        return 'qa';
    }else if( country_code == 'BH' || (country == 'bh' && lang == 'en')){
        return 'bh';
    }else if( country_code == 'EG' || (country == 'eg' && lang == 'en')){
        return 'eg';
    }else if (country == 'kw' && lang == 'ar'){
        return 'ar-kw';
    }else if (country == 'qa' && lang == 'ar'){
        return 'ar-qa';
    }else if (country == 'bh' && lang == 'ar'){
        return 'ar-bh';
    }else if (country == 'eg' && lang == 'ar'){
        return 'ar-eg';
    }
    else{ return 'main'; }
}

/**
 * This code defines a function called setWithExpiry that can be used to store a key-value pair in the browser's localStorage with an expiration time.
 * The function takes three parameters:
 *      key: a string representing the key under which the value will be stored
 *      value: the value to be stored, which can be any JavaScript object that can be serialized to JSON
 *      ttl: the time-to-live in milliseconds, after which the stored value will be considered expired and automatically removed from the localStorage (1 hr)
 */
function setWithExpiry(key, value, ttl) {
    const now = new Date()
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
}

/**
 * This is a function that retrieves a value from the browser's localStorage with a given key. 
 * It also checks if the value has expired based on an expiry time set when the value was stored using the setWithExpiry() function.
 */
function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)

    if (!itemStr) {
        return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key)
        return null
    }
    return item.value
}

/**
 * This is a block of code that runs only when a link is clicked specially on blog page
 */
jQuery(document).ready(function($){
    if (document.querySelectorAll(`script[src="https://country-check.urbanpiper.workers.dev/script.js"]`).length <= 0) {
        var geodata_script = document.createElement('script');
        geodata_script.src = 'https://country-check.urbanpiper.workers.dev/script.js';
        document.head.appendChild(geodata_script);
    }
    var run_redirect = true;
    function getLoc(country_code, country = '', lang = ''){
        if(country_code == 'GBR' || country_code == 'EU' || country_code == 'GB' || country == 'uk'){ return 'uk'; }
        else if(
            country_code == 'ARE' || country_code == 'DZA' || country_code == 'BHR' ||
            country_code == 'AE' || country_code == 'DZ' || 
            country_code == 'IRN' || country_code == 'IRQ' || country_code == 'ISR' || country_code == 'JOR' ||
            country_code == 'IR' || country_code == 'IQ' || country_code == 'IL' || country_code == 'JO' ||
            country_code == 'LBN' || country_code == 'LBY' || country_code == 'MAR' ||
            country_code == 'LB' || country_code == 'LY' || country_code == 'MA' ||
            country_code == 'OMN' || country_code == 'QAT' || country_code == 'SYR' ||
            country_code == 'OM' || country_code == 'SY' || (country == 'ae' && lang == 'en') ||
            country_code == 'TUN' || country_code == 'YEM' || country_code == 'TU' || country_code == 'YE'){
            return 'en-ae';
        }
        else if(
            country_code == 'ARE' || country_code == 'DZA' || country_code == 'BHR' ||
            country_code == 'AE' || country_code == 'DZ' || 
            country_code == 'IRN' || country_code == 'IRQ' || country_code == 'ISR' || country_code == 'JOR' ||
            country_code == 'IR' || country_code == 'IQ' || country_code == 'IL' || country_code == 'JO' ||
            country_code == 'LBN' || country_code == 'LBY' || country_code == 'MAR' ||
            country_code == 'LB' || country_code == 'LY' || country_code == 'MA' ||
            country_code == 'OMN' || country_code == 'QAT' || country_code == 'SYR' ||
            country_code == 'OM' || country_code == 'SY' || (country == 'ae' && lang == 'ar') ||
            country_code == 'TUN' || country_code == 'YEM' || country_code == 'TU' || country_code == 'YE'){
            return 'ar-ae';
        }
        else if( country_code == 'USA' || country_code == 'US' || country == 'us' ){
            return 'us';
        }
        else if( country_code == 'AU' || country_code == 'AUS' || country == 'au' ){
            return 'au';
        }
        else if( country_code == 'CA' || country_code == 'CAN' || country == 'ca' ){
            return 'ca';
        }
        else if( country_code == 'IN'){
            return 'in';
        }
        else if( country_code == 'FR' || country == 'fr'){
            return 'fr';
        }
        else if( country_code == 'MX' || country_code == 'MEX' || country_code == 'CO' || country_code == 'COL' || 
            country_code == 'CL' || country_code == 'CHL' || (country == 'es' && lang == 'es') || country == 'mx'  
            || country == 'co' || country == 'cl' ){
            return 'es';
        }
        else if( country_code == 'SA' || country_code == 'SAU' || country_code == 'PK' || country_code == 'PAK' || (country == 'ae' && lang == 'ar') 
          || (country == 'sa' && lang == 'ar')){
              return 'ar';
        }
        else{ return 'main'; }
    }

    var url = new URL(window.location.href);
    if(url.href.includes('utm_') || url.href.includes('urbanpipervscompetidores')){
        //no redirection
    } else if(url.href.includes('en-kw') || url.href.includes('en-qa') || url.href.includes('en-bh') || url.href.includes('en-eg') || url.href.includes('en-ae') || url.href.includes('en-sa') ||
              url.href.includes('ar-kw') || url.href.includes('ar-qa') || url.href.includes('ar-bh') || url.href.includes('ar-eg') || url.href.includes('ar-ae') || url.href.includes('ar-sa')){ //new added april 5, 2024 | set flag on kw, qa, bh and eg pages
        var lang = 'EN';
        if(url.href.includes('en-kw') || url.href.includes('ar-kw')){
            temploc = 'kw';
        }else if(url.href.includes('en-qa') || url.href.includes('ar-qa')){
            temploc = 'qa';
        }else if(url.href.includes('en-bh') || url.href.includes('ar-bh')){
            temploc = 'bh';
        } else if(url.href.includes('en-eg') || url.href.includes('ar-eg')){
            temploc = 'eg';
        } else if(url.href.includes('en-ae') || url.href.includes('ar-ae')){
            temploc = 'ae';
        } else if(url.href.includes('en-sa') || url.href.includes('ar-sa')){
            temploc = 'sa';
        }
        if($('.lpl-c-'+temploc).length > 0){
            var img_src = window.getComputedStyle($('.lpl-c-'+temploc)[0],':before').content;  
                img_src = img_src.match(/\"(.*?)\"/);
                $('.language-block').find('img').attr('src',img_src[1]);
                $('.language-block').find('.language-picker-title').text(lang.toUpperCase());
        }
        //no redirection
    } else{
        if(run_redirect){
            var source = getWithExpiry("source") ? getWithExpiry('source') : '';
            var country = getWithExpiry('country') ? getWithExpiry('country') : '';
            var lang = getWithExpiry('lang') ? getWithExpiry('lang') : '';
    
            jQuery(document).on('click', 'a', function(e){
                e.preventDefault();
                var url_from = new URL(window.location.href);
                var url_to = ''; var backlink = '';
                if(new RegExp("[a-zA-Z0-9]+://([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(jQuery(this).attr('href'))) {
                    url_to = new URL(jQuery(this).attr('href'));
                    backlink = url_to.pathname.replace(/^\/|\/$/g, '');
                }
                else{
                    // Link doesn't have domain name, append origin and initialize as URL
                    url_to = new URL(window.location.origin+jQuery(this).attr('href'));
                    backlink = jQuery(this).attr('href').replace(/^\/|\/$/g, '');
                }
                // if current page is blog or a blog article, and the visitor clicked on link that redirects them to a non-blog  page
                if(url_from.pathname.split('/')[1] == 'blog' && url_to.pathname.split('/')[1] != 'blog'){
                    if (!link_is_external(jQuery(this)[0])){
    
                        if(source == 'drpdwn'){
                            var loc = getLoc('', country, lang);
                            
                            setWithExpiry('source','drpdwn',3600000);
                            setWithExpiry('country',country,3600000);
                            setWithExpiry('lang',lang,3600000);
                        }
                        else{
                            var loc = getLoc(window.GEO_DATA.country);
                            var temploc = loc;
                            var lang = 'EN';
                            if(loc == 'ar'){ 
                                temploc = 'sa'; 
                                lang = 'AR';
                            }
                            else if(loc == 'es'){  
                                lang = 'ES';
                            }
                            else if(loc == 'in'){ 
                                temploc = 'india'; 
                                loc = 'main';
                            }
    
                            if($('.lpl-c-'+temploc).length > 0){
                                var img_src = window.getComputedStyle($('.lpl-c-'+temploc)[0],':before').content;  
                                    img_src = img_src.match(/\"(.*?)\"/);
                                    $('.language-block').find('img').attr('src',img_src[1]);
                                    $('.language-block').find('.language-picker-title').text(lang.toUpperCase());
                            }
                        }
                    
                        var toUrl = backlink != '' ? '/'+backlink : '/';
                        if(loc == 'uk'){ 
                            toUrl = '/uk'+(backlink != '' ? '/'+backlink : backlink); 
                        }

                        else if(loc == 'fr'){ 
                            toUrl = '/fr'+(backlink != '' ? '/'+backlink : backlink); 
                        }

                        else if(loc == 'ae'){ 
                            toUrl = '/en-ae'+(backlink != '' ? '/'+backlink : backlink); 
                        }
                        
                        if(toUrl == '/#' || toUrl == '#'){}
                        else{
                            if(url_from.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") != toUrl){
                                window.location.href = toUrl;
                            }
                        }
                    }
                    else{
                      window.location.href = jQuery(this).attr('href'); 
                      }
                }
                else{
                    window.location.href = jQuery(this).attr('href');
                }
            });
        }
    }
    
    function setWithExpiry(key, value, ttl) {
        const now = new Date()
        const item = {
            value: value,
            expiry: now.getTime() + ttl,
        }
        localStorage.setItem(key, JSON.stringify(item))
    }
    
    function getWithExpiry(key) {
        const itemStr = localStorage.getItem(key)
    
        if (!itemStr) {
            return null
        }
    
        const item = JSON.parse(itemStr)
        const now = new Date()
    
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }
    function link_is_external(link_element) {
        return (link_element.host !== window.location.host);
    }
});


/**
 * This is a block of code in handling the language dropdown in header menu
 */
$(document).ready(function(){
    var tempsource = getWithExpiry("source") ? getWithExpiry('source') : '';
    var tempcountry = getWithExpiry('country') ? getWithExpiry('country') : '';
    var templang = getWithExpiry('lang') ? getWithExpiry('lang') : '';

    if(url.href.includes('en-kw') || url.href.includes('en-qa') || url.href.includes('en-bh') || url.href.includes('en-eg') || url.href.includes('en-sa')){ //new added april 5, 2024 | set flag on kw, qa, bh and eg pages
        //no redirection
    }else if(tempsource != '' && tempcountry != '' && templang != ''){
        var img_src = window.getComputedStyle($('.lpl-c-'+(tempcountry == 'in' ? 'india' : tempcountry))[0],':before').content;  
            img_src = img_src.match(/\"(.*?)\"/);
            $('.language-block').find('img').attr('src',img_src[1]);
            $('.language-block').find('.language-picker-title').text(templang.toUpperCase());
    }

    $(window).resize(function(){
        if(window.matchMedia( "(max-width: 992px)" ).matches){ $('.language-block-mobile').show(); $('.language-block:not(.language-block-mobile)').hide(); }
        else{ $('.language-block-mobile').hide(); $('.language-block:not(.language-block-mobile)').show(); }
    });

    if(window.matchMedia( "(max-width: 992px)" ).matches){ $('.language-block-mobile').show(); $('.language-block:not(.language-block-mobile)').hide(); }
    else{ $('.language-block-mobile').hide(); $('.language-block:not(.language-block-mobile)').show(); }
    

    /**
     * When the language button is clicked, it toggles the visibility of the dropdown
     */
	$("#lang-selection-desktop").on('click',function(){
		$(".language-picker-main.desktop").toggle();
	});
	$("#lang-selection-mobile").on('click',function(){
		$(".language-picker-main.mobile").toggle();
	});

    /**
     * Series of functions below about hiding/showing language dropdown by conditions
     */
	$(".language-picker-list li:not(#uae-lang-link):not(#spain-lang-link)").on('click',function(){
		if($(this).closest('.language-picker-main').find(".language-col-right").css('margin-right') >= 0){
			$(this).closest('.language-picker-main').find(".language-col-right").css({ 'border-left' : 'unset' });
			$(this).closest('.language-picker-main').find(".language-col-right").animate({"margin-right": '-=160'});
		}
	});
	$(".lpl-c-ae").on('click',function(){
		var mr = parseInt($(this).closest('.language-picker-main').find(".language-col-right").css('margin-right').replace(/[^0-9_-]/g,''));
		var lpt = $('.language-col-right .language-picker-title');
        lpt.css('margin-top','304px');
        if(mr < 0){
			$(this).closest('.language-picker-main').find(".language-col-right").css({ 'border-left' : '1px solid #3e495f' });
			$(this).closest('.language-picker-main').find(".language-col-right").animate({"margin-right": '+=160'});
		}
		$(this).closest('.language-picker-main').find('.language-picker-list-es').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-ae').show();
		$(this).closest('.language-picker-main').find('.language-picker-list-sa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-kw').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-qa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-bh').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-eg').hide();
	});
	$(".lpl-c-sa").on('click',function(){
		var mr = parseInt($(this).closest('.language-picker-main').find(".language-col-right").css('margin-right').replace(/[^0-9_-]/g,''));
        var lpt = $('.language-col-right .language-picker-title');
        lpt.css('margin-top','252px');
		if(mr < 0){
			$(this).closest('.language-picker-main').find(".language-col-right").css({ 'border-left' : '1px solid #3e495f' });
			$(this).closest('.language-picker-main').find(".language-col-right").animate({"margin-right": '+=160'});
		}
		$(this).closest('.language-picker-main').find('.language-picker-list-es').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-ae').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-sa').show();
        $(this).closest('.language-picker-main').find('.language-picker-list-kw').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-qa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-bh').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-eg').hide();
	});
	$(".lpl-c-kw").on('click',function(){
		var mr = parseInt($(this).closest('.language-picker-main').find(".language-col-right").css('margin-right').replace(/[^0-9_-]/g,''));
        var lpt = $('.language-col-right .language-picker-title');
        lpt.css('margin-top','380px');

		if(mr < 0){
			$(this).closest('.language-picker-main').find(".language-col-right").css({ 'border-left' : '1px solid #3e495f' });
			$(this).closest('.language-picker-main').find(".language-col-right").animate({"margin-right": '+=160'});
		}
		$(this).closest('.language-picker-main').find('.language-picker-list-es').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-ae').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-sa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-kw').show();
        $(this).closest('.language-picker-main').find('.language-picker-list-qa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-bh').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-eg').hide();
	});
    $(".lpl-c-qa").on('click',function(){
		var mr = parseInt($(this).closest('.language-picker-main').find(".language-col-right").css('margin-right').replace(/[^0-9_-]/g,''));
        var lpt = $('.language-col-right .language-picker-title');
        lpt.css('margin-top','380px');
		if(mr < 0){
			$(this).closest('.language-picker-main').find(".language-col-right").css({ 'border-left' : '1px solid #3e495f' });
			$(this).closest('.language-picker-main').find(".language-col-right").animate({"margin-right": '+=160'});
		}
		$(this).closest('.language-picker-main').find('.language-picker-list-es').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-ae').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-sa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-kw').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-qa').show();
        $(this).closest('.language-picker-main').find('.language-picker-list-bh').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-eg').hide();
	});
    $(".lpl-c-bh").on('click',function(){
		var mr = parseInt($(this).closest('.language-picker-main').find(".language-col-right").css('margin-right').replace(/[^0-9_-]/g,''));
        var lpt = $('.language-col-right .language-picker-title');
        lpt.css('margin-top','380px');
		if(mr < 0){
			$(this).closest('.language-picker-main').find(".language-col-right").css({ 'border-left' : '1px solid #3e495f' });
			$(this).closest('.language-picker-main').find(".language-col-right").animate({"margin-right": '+=160'});
		}
		$(this).closest('.language-picker-main').find('.language-picker-list-es').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-ae').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-sa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-kw').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-qa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-bh').show();
        $(this).closest('.language-picker-main').find('.language-picker-list-eg').hide();
	});
    $(".lpl-c-eg").on('click',function(){
		var mr = parseInt($(this).closest('.language-picker-main').find(".language-col-right").css('margin-right').replace(/[^0-9_-]/g,''));
        var lpt = $('.language-col-right .language-picker-title');
        lpt.css('margin-top','380px');
		if(mr < 0){
			$(this).closest('.language-picker-main').find(".language-col-right").css({ 'border-left' : '1px solid #3e495f' });
			$(this).closest('.language-picker-main').find(".language-col-right").animate({"margin-right": '+=160'});
		}
		$(this).closest('.language-picker-main').find('.language-picker-list-es').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-ae').hide();
		$(this).closest('.language-picker-main').find('.language-picker-list-sa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-kw').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-qa').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-bh').hide();
        $(this).closest('.language-picker-main').find('.language-picker-list-eg').show();
	});

    /**
     * Function that triggers redirection based on what country/language is chosen on the language dropdown
     */
	$('.language-picker-list li:not(.lpl-haschildren), .language-picker-list-ae li, .language-picker-list-sa li, .language-picker-list-es li, .language-picker-list-kw li, .language-picker-list-qa li, .language-picker-list-bh li, .language-picker-list-eg li').on('click', function(){
		var mr = parseInt($(this).closest('.language-picker-main').find(".language-col-right").css('margin-right').replace(/[^0-9_-]/g,''));
		if(mr >= 0){
			$(this).closest('.language-picker-main').find(".language-col-right").css({ 'border-left' : 'unset' });
			$(this).closest('.language-picker-main').find(".language-col-right").animate({"margin-right": '-=160px'});

			$this = $(this);
			setTimeout(function(){ 
                $this.closest('.language-picker-main').toggle(); 
                
                var fin_country = $this.attr('country');
                var fin_lang = $this.attr('lang');
                if($this.attr('country') == 'es'){
                    fin_country = $this.parent().attr('from');
                }

                var img_src = window.getComputedStyle($('.lpl-c-'+fin_country)[0],':before').content;
                
                img_src = img_src.match(/\"(.*?)\"/);
                $this.closest('.language-picker-main').toggle();
                $('.language-block').find('img').attr('src',img_src[1]);
                $('.language-block').find('.language-picker-title').text(fin_lang.toUpperCase());

                RedirectbyLoc('drpdwn', fin_country, fin_lang);
			},500);
		}
		else{
			$(this).closest('.language-picker-main').toggle();

            var fin_country = $(this).attr('country');
            var fin_lang = $(this).attr('lang');

			var img_src = window.getComputedStyle($(this)[0],':before').content;
			img_src = img_src.match(/\"(.*?)\"/);
			$('.language-block').find('img').attr('src',img_src[1]);
			$('.language-block').find('.language-picker-title').text(fin_lang.toUpperCase());

			RedirectbyLoc('drpdwn', fin_country, fin_lang);
		}
	});

    /**
     * Hide the language dropdown 
     */
    $(document).on('click', function(e){
        if($(e.target).closest('.language-picker-main.desktop').length == 0 && $(e.target).closest('#lang-selection-desktop').length == 0){
            $(".language-picker-main.desktop").hide();
        }
        if($(e.target).closest('.language-picker-main.mobile').length == 0 && $(e.target).closest('#lang-selection-mobile').length == 0){
            $(".language-picker-main.mobile").hide();
        }
	});

});
