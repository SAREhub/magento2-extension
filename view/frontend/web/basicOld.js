window['sareX_params']={
        domain : '%DOMAIN%',
        ping : {'period0' : 30, 'period1' : 60},
        execute : true,
        sareX_ip : false,
        inisTrack : {t:'p', c:'<kampania>',s:'<strona>'}
    };


require([
    'sarewebLib',
    'jquery','domReady!'
], function($) {$(function() {
    // Your custom code here...
    alert('x');
    (function (p){window['sareX_params']=p;
	//var s=document.createElement('script');
        //s.src='//x.sare25.com/libs/sarex4.min.js';
        s.async=true;var t=document.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s,t);
    })({
        domain : '%DOMAIN%',
        ping : {'period0' : 30, 'period1' : 60},
        execute : true,
        sareX_ip : false,
        inisTrack : {t:'p', c:'<kampania>',s:'<strona>'}
    });

    window['sareX_params']={
        domain : '%DOMAIN%',
        ping : {'period0' : 30, 'period1' : 60},
        execute : true,
        sareX_ip : false,
        inisTrack : {t:'p', c:'<kampania>',s:'<strona>'}
    };

});});