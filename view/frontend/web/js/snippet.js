define(['jquery', 'uiComponent', 'ko'], function ($, Component, ko) {
        'use strict';
        return Component.extend({
            defaults: {
                template: 'SARE_SAREhub/test'
            },
            initialize: function () {
                this._super();

                console.log('SAREHUB INIT');
                (function (p){window['sareX_params']=p;var s=document.createElement('script');
                    s.src='//x.sare25.com/libs/sarex4.min.js';
                    s.async=false;var t=document.getElementsByTagName('script')[0];
                    t.parentNode.insertBefore(s,t);
                })({
                    domain : 'aKarnowka',
                    ping : {'period0' : 30, 'period1' : 60},
                    execute : true,
                    sareX_ip : false,
                    inisTrack : {t:'p', c:'<kampania>',s:'<strona>'}
                });

                alert('x2');
            }
        });
    }
);