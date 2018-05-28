/*! sareweb 2018-03-06 */
function sareX_siteInspector(a) {
    function b(a, b, c) {
        var e = sareX_core.getSPath(a)
            , g = "eventListener";
        return "observe" == b && (f({
            fingerprintTarget: c.fingerprintTarget,
            element: a
        }, !1),
            n ? g = "mutationObserver" : b = "DOMNodeInserted"),
            {
                element: a,
                event: b,
                bindOnWindow: c.bindOnWindow,
                attachedEvent: g,
                fingerprintTarget: c.fingerprintTarget,
                callback: function(g) {
                    try {
                        if ("DOMNodeInserted" == b)
                            return f({
                                fingerprintTarget: c.fingerprintTarget,
                                element: a
                            }, !0),
                                !0;
                        if (c.bindOnWindow) {
                            var h = d(g);
                            if (sareX_core.getSPath(h) !== e)
                                return !0;
                            p("Bound on window " + b + ": recognized target element.")
                        }
                        c.callback.call(null, a)
                    } catch (i) {
                        p(i)
                    }
                }
            }
    }
    function c(a) {
        switch (a.attachedEvent) {
            case "eventListener":
                sareX_core.eventListener(a.bindOnWindow ? window : a.element, a.event, a.callback, !1);
                break;
            case "mutationObserver":
                var b = new MutationObserver(function(b) {
                        b.forEach(function(b) {
                            b.addedNodes.length && f(a, !0)
                        })
                    }
                );
                b.observe(a.element, o),
                    m.push(b)
        }
        "eventListener" == a.attachedEvent && l.push(a)
    }
    function d(a) {
        return a || (a = window.event),
            a.target ? a.target : a.srcElement
    }
    function e(a, b, c) {
        var d = [];
        return d = "function" == typeof a ? a.call() : "undefined" != typeof c ? $(a, $(c)).toArray() : $(a).toArray(),
        b && (d = d.shift()),
            d
    }
    function f(a, b) {
        var c = e(a.fingerprintTarget, !0, a.element);
        c && c.className.search("sareweb-fingerprint") == -1 && (c.className = [c.className, "sareweb-fingerprint"].join(" "),
        b === !0 && j.bindEvents())
    }
    a = a || {};
    var g, h, i = a.ugauga || !1, j = {}, k = ["click", "mouseover", "mouseout", "observe", "blur", "focus"], l = [], m = [], n = "undefined" != typeof MutationObserver, o = {
        attributes: !1,
        childList: !0,
        characterData: !1,
        subtree: !0
    }, p = function(a) {
        i && console.log("siteInspector: " + a)
    };
    return p("mutationObserver" + (n ? "" : " not") + " supported"),
        j.init = function(b) {
            g = new b(a.domain),
                h = g.getConfig(),
            "object" == typeof h && h.constructor !== Array && (h = [h]);
            var c;
            for (c = 0; c < h.length; c++)
                "string" == typeof h[c].site && (h[c].site = [h[c].site]),
                "string" == typeof h[c].event && (h[c].event = [h[c].event])
        }
        ,
        j.bindEvents = function() {
            if ("function" != typeof g.getTypeOfSite)
                throw "siteInfoProvider::getTypeOfSite is not a function";
            var a = g.getTypeOfSite();
            if ("undefined" != typeof a) {
                if ("string" != typeof a)
                    throw "Got wrong site name: " + a;
                p("Bindings events for '" + a + "' site");
                var d, f, i, j;
                if (n) {
                    for (d = 0; d < m.length; d++)
                        m[d].disconnect();
                    m.splice(0, m.length)
                }
                for (d = 0; d < l.length; d++)
                    sareX_core.removeEventListener(l[d].bindOnWindow ? window : l[d].element, l[d].event, l[d].callback);
                for (l.splice(0, l.length),
                         d = 0; d < h.length; d++) {
                    var o = h[d].site;
                    for (i = 0; i < o.length; i++)
                        if (o[i] == a) {
                            var q = h[d].event;
                            for (j = 0; j < q.length; j++)
                                if (k.join(" ").search(q[j]) > -1) {
                                    var r = e(h[d].target);
                                    if (r.constructor !== Array)
                                        throw "Got wrong elements array";
                                    for (f = 0; f < r.length; f++) {
                                        if ("object" != typeof r[f]) {
                                            var s = "callback";
                                            throw "string" == typeof h[d].target && (s = "selector " + h[d].target),
                                            "Got wrong element from " + s
                                        }
                                        var t = b(r[f], q[j], h[d]);
                                        c(t)
                                    }
                                }
                        }
                }
            }
        }
        ,
        j.executeLoadEvents = function() {
            var a = g.getTypeOfSite();
            if ("undefined" != typeof a) {
                if ("string" != typeof a)
                    throw "Got wrong site name: " + a;
                var b, c, d;
                for (b = 0; b < h.length; b++) {
                    var e = h[b].site;
                    for (c = 0; c < e.length; c++)
                        if (e[c] == a) {
                            var f = h[b].event;
                            for (d = 0; d < f.length; d++)
                                "load" == f[d] && "function" == typeof h[b].callback && h[b].callback.call(null, [])
                        }
                }
            }
        }
        ,
        j
}
function sareX_ajaxTransport(a) {
    a = a || {},
        a.this_callback = a.this_callback || a.live_instance,
        a.on_response = a.on_response || function() {}
    ;
    var b = !0;
    return "undefined" == typeof a.live_instance && (b = !1),
        {
            send: function(b) {
                a.live_instance.debug && a.live_instance.log("ajaxTransport::send"),
                    sareX_core.ajaxRequestTimeout(a.url, {
                        data: JSON.stringify(b)
                    }, "POST", 2e3, function(b) {
                        "undefined" != typeof b && "string" == typeof b.responseText && a.on_response.call(a.this_callback, b.responseText)
                    }, !0)
            },
            working: function() {
                return b
            }
        }
}
function sareX_websocketTransport(a) {
    function b() {
        function b() {
            g = 0,
                f = !0,
                a.on_connected.call(c)
        }
        function h() {
            f = !1
        }
        function i() {
            f = !1
        }
        if ("undefined" == typeof WebSocket && "undefined" != typeof MozWebSocket && (window.WebSocket = MozWebSocket),
            "undefined" != typeof WebSocket && g < 2) {
            try {
                d = new WebSocket(e)
            } catch (j) {
                return !1
            }
            d.onopen = b,
                d.onerror = i,
                d.onclose = h,
                d.onmessage = function(b) {
                    a.on_response.call(a.this_callback, b)
                }
        }
    }
    var c = {};
    a = a || {},
        a.this_callback = a.this_callback || a.live_instance,
        a.on_response = a.on_response || function() {}
        ,
        a.on_connected = a.on_connected || function() {}
    ;
    var d, e = a.host, f = !1, g = 0;
    return c.send = function(a) {
        return d.send(JSON.stringify(a).sa_r()),
            !0
    }
        ,
        c.working = function() {
            return f
        }
        ,
        b(g),
        c
}
function sareX_framer(a) {
    function b(a, b) {
        return {
            start_at: a,
            session_at: b,
            frames: [{}, {}, {}, {}, {}],
            frames_times_list: [[], [], [], [], []]
        }
    }
    function c(a, b, c) {
        if ("undefined" == typeof b && (b = sareX_frameResolution[a]),
            "undefined" == typeof c && (c = (new Date).getTime()),
            c < e[d].start_at)
            var f = 0;
        else
            var f = c - e[d].start_at;
        return f -= f % b,
        c % b > 0 && (f += b),
        "undefined" == typeof e[d].frames[a][f] && (e[d].frames[a][f] = {},
            e[d].frames_times_list[a].push(f)),
            e[d].frames[a][f]
    }
    a = a || {};
    var d = 0
        , e = {}
        , f = (new Date).getTime()
        , g = 0
        , h = 0;
    return e[d] = b(f, f),
        {
            addEvent: function(a, b, d, e, f) {
                "undefined" == typeof f && (f = (new Date).getTime());
                for (var g = c(a, e, f), i = 0; i < d.length; i++)
                    g[d[i]] = b[d[i]];
                h = (new Date).getTime()
            },
            addAppendEvent: function(a, b, d, e, f) {
                "undefined" == typeof f && (f = (new Date).getTime());
                for (var g = c(a, e, f), i = 0; i < d.length; i++)
                    "undefined" == typeof g[d[i]] ? g[d[i]] = [b[d[i]]] : g[d[i]].push(b[d[i]]);
                h = (new Date).getTime()
            },
            removeEventsAfter: function(a, b) {
                "undefined" == typeof b && (b = (new Date).getTime());
                var c = b - e[d].start_at;
                if (e[d].frames_times_list[a].length)
                    for (var f = e[d].frames_times_list[a].length - 1; e[d].frames_times_list[a][f] > c; f--)
                        delete e[d].frames[a][e[d].frames_times_list[a][f]],
                            e[d].frames_times_list[a].pop()
            },
            addEventByObj: function(a, b, d, e, f) {
                "undefined" == typeof f && (f = (new Date).getTime());
                for (var g = c(a, e, f), i = 0; i < b.fields.length; i++)
                    g[b.fields[i]] = b.data[b.fields[i]];
                h = f
            },
            getPacket: function() {
                if (h < g)
                    return null;
                g = (new Date).getTime(),
                    e[d].closed_at = g,
                    e[d + 1] = b(g, f),
                    d++;
                for (var a, c = 0; c < e[d - 1].frames_times_list.length; c++)
                    for (var i = e[d - 1].frames_times_list[c].length - 1; i >= 0 && (a = e[d - 1].start_at + e[d - 1].frames_times_list[c][i],
                    a > e[d - 1].closed_at); i--)
                        e[d - 1].frames_times_list[c].pop(),
                            delete e[d - 1].frames[c][i];
                return "undefined" != typeof e[d - 1].frames_times_list && delete e[d - 1].frames_times_list,
                    e[d - 1]
            }
        }
}
function sareX_chunks(a, b) {
    a = a || {};
    var c = {
        INITIAL: 0,
        SENT_REQUEST: 1
    }
        , d = ["HTML", "AJAX"]
        , e = 2
        , f = {
        HTML: {},
        AJAX: {}
    }
        , g = {
        HTML: [],
        AJAX: []
    }
        , h = function(a) {
        var b = a;
        "object" == typeof a && (b = a.data);
        var d = parseInt(b.substring(2))
            , h = "H" == b.substring(1, 2) ? "HTML" : "AJAX"
            , k = "H" == b.substring(1, 2) ? "Html" : "Ajax";
        switch (b.substring(0, 1)) {
            case "Y":
                if ("undefined" != typeof f[h][d]) {
                    delete f[h][d];
                    for (var l = 0; l < g[h].length; l++)
                        g[h][l] == d && g[h].splice(l, 2)
                }
                break;
            case "N":
                if ("undefined" == typeof f[h][d])
                    return;
                for (var m = 0; m < i.length; m++)
                    if (i[m].working()) {
                        f[h][d].tried < e ? setTimeout(function() {
                            i[m].send({
                                action: "Save" + k,
                                id: d,
                                source: f[h][d].source,
                                d: sareX_core.sa_domain
                            }),
                                f[h][d].state = c.SENT_REQUEST,
                                f[h][d].tried++
                        }, 3e3 * f[h][d].tried) : j.remove_chunk(d, h);
                        break
                    }
        }
    }
        , i = [sareX_websocketTransport({
        host: "wss://" + sareX_core.host + ":9111/?lib=" + sareX_core.int_ver + "&c=" + sareX_core.x + "&d=" + b.domain.sa_r(),
        live_instance: a.live_instance,
        this_callback: j,
        on_response: h
    }), sareX_ajaxTransport({
        url: sareX_core.host + (window.location.protocol.search("https") > -1 ? ":9112" : ":9102") + "/?lib=" + sareX_core.int_ver + "&c=" + sareX_core.x + "&d=" + b.domain.sa_r(),
        live_instance: a.live_instance,
        this_callback: j,
        on_response: h
    })]
        , j = {
        add_chunk: function(a, b) {
            return g[b].length > 30 || ("undefined" == typeof a.state && (a.state = c.INITIAL),
            "undefined" == typeof a.tried && (a.tried = 0),
                f[b][a.id] = a,
                void g[b].push(a.id))
        },
        remove_chunk: function(a, b) {
            delete f[b][a];
            for (var c = 0; c < g[b].length; c++)
                if (g[b][c] == a) {
                    delete g[b][c];
                    break
                }
        },
        get_source_of_chunk: function(a, b) {
            return f[b][a].source
        },
        get_chunk: function(a, b) {
            return f[b][a]
        },
        set_chunk: function(a, b, c) {
            f[b][a] = c
        },
        synchronize: function() {
            var a;
            try {
                for (a in d)
                    for (var b = d[a], e = 0; e < g[b].length; e++)
                        if (!(f[b][g[b][e]].state > c.INITIAL))
                            for (var h = 0; h < i.length; h++)
                                if (i[h].working()) {
                                    var j = b.charAt(0).toUpperCase() + b.slice(1).toLowerCase();
                                    i[h].send({
                                        action: "Check" + j,
                                        id: f[b][g[b][e]].id,
                                        d: sareX_core.sa_domain
                                    }),
                                        f[b][g[b][e]].state = c.SENT_REQUEST;
                                    break
                                }
            } catch (k) {
                return !1
            }
        },
        calculate_new_chunks: function(a) {
            var b = [{
                id: murmurHash3.x86.hash32(a.outerHTML || a.innerHTML),
                source: a.outerHTML || a.innerHTML
            }];
            return b
        }
    };
    return j
}
function sareX_live(a) {
    function b() {
        return "innerHeight"in window ? window.innerHeight : document.documentElement.clientHeight
    }
    function c() {
        return "innerWidth"in window ? window.innerWidth : document.documentElement.clientWidth
    }
    function d(a, d) {
        if ("undefined" != typeof a.getBoundingClientRect) {
            var e = a.getBoundingClientRect()
                , f = b()
                , g = c();
            if ("undefined" != typeof d && d < 1) {
                var h = 0
                    , i = 0;
                if (e.top < 0 && (i -= e.top),
                    e.bottom > f && (i += e.bottom - f),
                    e.left < 0 && (h -= e.left),
                    e.right > g && (h += e.right - g),
                    i > 0 || h > 0) {
                    var j = e.bottom - e.top
                        , k = e.right - e.left;
                    return i / j <= d && h / k <= d
                }
            }
            return e.top >= 0 && e.bottom <= f && e.left >= 0 && e.right <= g
        }
        return !1
    }
    function f(a, b, c) {
        G[a] != b && (G[a] = b,
            c.data[a] = b,
            c.fields.push(a))
    }
    function g(a) {
        for (var b, c = ""; a && (b = a.parentNode || a.parent); ) {
            if ("string" == typeof a.id && a.id.length) {
                c = "#" + a.id + ">" + c;
                break
            }
            for (var d = b.childNodes, e = 0, f = 0; f < d.length; f++)
                if (1 === d[f].nodeType) {
                    if (d[f] == a) {
                        c = d[f].nodeName + "[" + (f - e) + "]>" + c;
                        break
                    }
                } else
                    e++;
            a = b
        }
        return c.substring(0, c.length - 1)
    }
    function h() {
        return {
            fields: [],
            data: {}
        }
    }
    function i(a, b) {
        return "undefined" != typeof F.mx && void K.addEvent(sareX_frameType.MOUSEMOVES_FRAMES, {
            mx: F.mx,
            my: F.my
        }, ["mx", "my"], b || sareX_frameResolution.MOUSEMOVES_FRAMES, a)
    }
    function j(a, d) {
        return "undefined" != typeof F.sy && (K.addEvent(sareX_frameType.SCROLLS_FRAMES, {
            sx: F.sx,
            sy: F.sy,
            spy: F.spy
        }, ["sx", "sy", "spy"], d || sareX_frameResolution.SCROLLS_FRAMES, a),
            void (F.max_sy < F.sy && (F.max_sy = F.sy,
                K.addEvent(sareX_frameType.EXTRA_FRAMES, {
                    vx: c(),
                    vy: b(),
                    msy: b() + F.sy,
                    mspy: F.spy
                }, ["vx", "vy", "msy", "mspy"], 1, a))))
    }
    function k() {
        try {
            F.movedMouse && (i(F.mts),
                F.movedMouse = !1,
                l()),
            F.scrolledWindow && (j(F.sts),
                F.scrolledWindow = !1,
                l())
        } catch (a) {}
    }
    function l() {
        for (var a = 0; a < O.length; a++)
            "undefined" != typeof O[a].min && (O[a].min = 1),
            null !== O[a].el && d(O[a].el, O[a].min) && (K.addAppendEvent(sareX_frameType.EXTRA_FRAMES, {
                se: O[a].id,
                st: g(O[a].el)
            }, ["se", "st"], 1, void 0),
                O.splice(a, 1))
    }
    function m(a) {
        try {
            for (var b = 0; b < O.length; b++)
                null === O[b].el && (O[b].el = document.getElementById(O[b].id)),
                "undefined" != typeof O[b].min && (O[b].min = 1),
                null !== O[b].el && d(O[b].el, O[b].min) && (K.addAppendEvent(sareX_frameType.EXTRA_FRAMES, {
                    se: O[b].id,
                    st: g(O[b].el)
                }, ["se", "st"], 1, void 0),
                    O.splice(b, 1))
        } catch (c) {}
    }
    function n(a) {
        var b = a;
        try {
            b || (b = window.event),
                F.mx = (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + b.clientX,
                F.my = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + b.clientY,
                F.mts = (new Date).getTime(),
                F.movedMouse = !0
        } catch (c) {}
    }
    function o(a) {
        var b = a;
        try {
            b || (b = window.event);
            var c = (new Date).getTime()
                , d = b.target ? b.target : b.srcElement
                , e = {
                ctarget: g(d),
                cx: (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + b.clientX,
                cy: (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + b.clientY
            }
                , f = ["ctarget", "cx", "cy"];
            "A" == d.nodeName && "undefined" != typeof d.href && (e.curl = d.href,
                f.push("curl")),
            "SELECT" == d.nodeName && (e.sv = d.value,
                e.svt = g(d),
                f.push("sv"),
                f.push("svt")),
                K.addEvent(sareX_frameType.CLICKS_FRAMES, e, f, 1, c),
                K.removeEventsAfter(sareX_frameType.MOUSEMOVES_FRAMES, c),
                K.removeEventsAfter(sareX_frameType.SCROLLS_FRAMES, c),
                i(c, 1),
                j(c, 1)
        } catch (h) {}
    }
    function p() {
        try {
            var a = h();
            f("innerWidth", window.innerWidth, a),
                f("innerHeight", window.innerHeight, a),
            a.fields.length && K.addEventByObj(a, 200)
        } catch (b) {}
    }
    function q(a) {
        var c = a;
        try {
            c || (c = window.event),
                F.sx = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft,
                F.sy = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop,
                F.spy = Math.round((F.sy + b()) / document.documentElement.scrollHeight * 100),
                F.sts = (new Date).getTime(),
                F.scrolledWindow = !0
        } catch (d) {}
    }
    function r(a) {
        var b = a;
        try {
            b || (b = window.event);
            var c = (new Date).getTime()
                , d = b.target ? b.target : b.srcElement;
            "undefined" == typeof d || "undefined" == typeof d.type || "password" == d.type || d.getAttribute("class") && d.getAttribute("class").search("sarex-exclude") > -1 || (K.addAppendEvent(sareX_frameType.KEYS_FRAMES, {
                kd: b.keyCode,
                kt: g(d)
            }, ["kd", "kt"], 1, c),
                K.removeEventsAfter(sareX_frameType.MOUSEMOVES_FRAMES, c),
                K.removeEventsAfter(sareX_frameType.SCROLLS_FRAMES, c)),
                i(c, 1),
                j(c, 1)
        } catch (e) {}
    }
    function s(a) {
        var b = a;
        try {
            b || (b = window.event);
            var c, d = (new Date).getTime(), e = b.target ? b.target : b.srcElement;
            if (!["INPUT", "TEXTAREA"].indexOf(e.nodeName))
                return;
            if ("undefined" == typeof e || "undefined" == typeof e.type || "password" == e.type || e.getAttribute("class") && e.getAttribute("class").search("sarex-exclude") > -1) {
                switch (e.nodeName) {
                    case "INPUT":
                    case "TEXTAREA":
                        c = e.value ? e.value.replace(/./g, "*") : null
                }
                K.addAppendEvent(sareX_frameType.KEYS_FRAMES, {
                    is: {
                        target: g(e),
                        value: c
                    }
                }, ["is"], 1, d)
            } else {
                switch (e.nodeName) {
                    case "INPUT":
                    case "TEXTAREA":
                        c = e.value ? e.value : null
                }
                K.addAppendEvent(sareX_frameType.KEYS_FRAMES, {
                    ku: b.keyCode,
                    kt: g(e)
                }, ["ku", "kt"], 1, d),
                    K.addAppendEvent(sareX_frameType.KEYS_FRAMES, {
                        is: {
                            target: g(e),
                            value: c
                        }
                    }, ["is"], 1, d),
                    K.removeEventsAfter(sareX_frameType.MOUSEMOVES_FRAMES, d),
                    K.removeEventsAfter(sareX_frameType.SCROLLS_FRAMES, d)
            }
            i(d, 1),
                j(d, 1)
        } catch (f) {}
    }
    function t(a) {
        var b = a;
        try {
            b || (b = window.event);
            var c, d = (new Date).getTime(), e = b.target ? b.target : b.srcElement;
            if (!["INPUT", "TEXTAREA"].indexOf(e.nodeName))
                return;
            if ("undefined" == typeof e || "undefined" == typeof e.type || "password" == e.type || e.getAttribute("class") && e.getAttribute("class").search("sarex-exclude") > -1) {
                switch (e.nodeName) {
                    case "INPUT":
                    case "TEXTAREA":
                        c = e.value ? e.value.replace(/./g, "*") : null
                }
                K.addAppendEvent(sareX_frameType.KEYS_FRAMES, {
                    is: {
                        target: g(e),
                        value: c
                    }
                }, ["is"], 1, d)
            } else {
                switch (e.nodeName) {
                    case "INPUT":
                    case "TEXTAREA":
                        c = b.clipboardData || b.originalEvent.clipboardData || window.clipboardData || "paste text"
                }
                K.addAppendEvent(sareX_frameType.KEYS_FRAMES, {
                    ku: b.keyCode,
                    kt: g(e)
                }, ["ku", "kt"], 1, d),
                    K.addAppendEvent(sareX_frameType.KEYS_FRAMES, {
                        is: {
                            target: g(e),
                            value: c
                        }
                    }, ["is"], 1, d),
                    K.removeEventsAfter(sareX_frameType.MOUSEMOVES_FRAMES, d),
                    K.removeEventsAfter(sareX_frameType.SCROLLS_FRAMES, d)
            }
            i(d, 1),
                j(d, 1)
        } catch (f) {}
    }
    function u(a) {
        try {
            var d = (new Date).getTime();
            if (i(d, 1),
                    j(d, 1),
                "exit" == a.state)
                K.addEvent(sareX_frameType.EXTRA_FRAMES, {
                    exit: 1
                }, ["exit"], 1, d);
            else if ("entry" == a.state) {
                var e = "undefined" != typeof MutationObserver ? 1 : 0
                    , f = L.calculate_new_chunks(document.documentElement);
                K.addEvent(sareX_frameType.EXTRA_FRAMES, {
                    entry: 1,
                    sync: e,
                    sch: f[0].id,
                    vx: c(),
                    vy: b()
                }, ["entry", "sync", "sch", "vx", "vy"], 1, d);
                for (var g = 0; g < f.length; g++)
                    L.add_chunk(f[g], "HTML");
                L.synchronize()
            }
        } catch (h) {}
    }
    function v(a) {
        try {
            a = "undefined" == typeof a ? {} : a;
            var b = (new Date).getTime();
            if (J + H < b) {
                if (E.length > I) {
                    var c = E.shift();
                    delete D[c]
                }
                u({
                    timeStamp: b,
                    state: a.state
                });
                var d = K.getPacket();
                "undefined" != typeof a && "undefined" != typeof a.state && "exit" != a.state && u({
                    timeStamp: b,
                    state: a.state
                }),
                null != d && (d.xtmp = sareX_core.xtmp,
                    d.x = sareX_core.x,
                    d.rnd_id = sareX_core.rnd_id,
                    d.id = b,
                    d.retry = 0,
                    d.action = "W",
                    d.d = sareX_core.sa_domain,
                    d.l = document.location.toString(),
                    d.lib = sareX_core.int_ver,
                "undefined" != typeof a && "undefined" != typeof a.state && "exit" == a.state && (d.exit = 1),
                    D[b] = d,
                    E.push(b))
            }
            for (var e = 0; e < E.length; e++)
                if ("undefined" != typeof D[E[e]])
                    if (D[E[e]].retry += 1,
                        D[E[e]].retry > 5)
                        y.deletePacket(E[e]);
                    else
                        for (var f = 0; f < M.length; f++)
                            if (M[f].working()) {
                                console.log(D[E[e]]),
                                    M[f].send(D[E[e]]);
                                break
                            }
        } catch (g) {}
    }
    function w() {
        var a = XMLHttpRequest.prototype.open
            , b = XMLHttpRequest.prototype.send;
        sareX_core.player_mode || (XMLHttpRequest.prototype.open = function() {
                try {
                    var b = arguments;
                    b[1].search(sareX_core.host) == -1 && sareX_core.eventListener(this, "load", function(a) {
                        var c = (new Date).getTime()
                            , d = "undefined" != typeof this.sarex_request_params && this.sarex_request_params.length > 0 ? this.sarex_request_params[0] : ""
                            , e = murmurHash3.x86.hash32(this.responseText);
                        e > 0 && (L.add_chunk({
                            id: e,
                            source: this.responseText
                        }, "AJAX"),
                            L.synchronize());
                        try {
                            K.addEvent(sareX_frameType.EXTRA_FRAMES, {
                                ar: JSON.stringify({
                                    ct: e,
                                    cx: "undefined" != this.responseXML ? 1 : 0,
                                    m: b[0],
                                    u: b[1],
                                    rh: this.getAllResponseHeaders(),
                                    re: this.responseType,
                                    rp: d
                                })
                            }, ["ar"], 1, c)
                        } catch (f) {}
                    })
                } catch (c) {}
                a.apply(this, arguments)
            }
                ,
                XMLHttpRequest.prototype.send = function() {
                    try {
                        this.sarex_request_params = arguments
                    } catch (a) {}
                    b.apply(this, arguments)
                }
        )
    }
    function x() {
        var a = window.confirm;
        sareX_core.player_mode || (window.confirm = function(b) {
                try {
                    var c = (new Date).getTime()
                        , d = a(b);
                    return K.addEvent(sareX_frameType.EXTRA_FRAMES, {
                        cm: JSON.stringify({
                            m: b,
                            r: 1 == d ? 1 : 0
                        })
                    }, ["cm"], 1, c),
                        d
                } catch (e) {
                    return a(b)
                }
            }
        )
    }
    if ("undefined" == typeof a || "undefined" == typeof sareX_core)
        return !1;
    var y = {
        debug: a.debug || !1
    };
    "undefined" != typeof a.live && "boolean" != typeof a.live || (a.live = {});
    var z = "undefined" == typeof console || "undefined" == typeof console.log ? function() {}
        : function(a) {
            y.debug === !0 && console.log(a)
        }
    ;
    y.log = function(a) {
        z(a)
    }
    ;
    for (var A, B, C = !1, D = {}, E = [], F = {
        max_sy: 0
    }, G = {}, H = 10, I = 100, J = 0, K = sareX_framer(), L = sareX_chunks({
        live_instance: y
    }, a), M = [], N = a.live.visibility || [], O = [], P = 0; P < N.length; P++)
        "undefined" != typeof N[P].id && (N[P].el = document.getElementById(N[P].id)),
            O.push(N[P]);
    return y.deletePacket = function(a) {
        for ("undefined" != typeof D[a] && delete D[a]; E.length > 0 && "undefined" == typeof D[E[0]]; )
            E.shift()
    }
        ,
        y.start = function() {
            if (!C) {
                "undefined" == typeof a.personalization_subject ? a.personalization_subject = ["notification"] : a.personalization_subject.push("notification");
                var b = "?lib=" + sareX_core.int_ver + "&c=" + sareX_core.x + "&d=" + a.domain.sa_r();
                "function" == typeof a.personalization_callback ? b += "&p_subjects=" + JSON.stringify(a.personalization_subject).sa_r() : "undefined" == typeof a.personalization_callback && (b += "&p_subjects=" + JSON.stringify(a.personalization_subject).sa_r());
                var c = {
                    host: "wss://" + sareX_core.host + ":9110/" + b,
                    live_instance: y,
                    on_response: function(a) {
                        try {
                            switch (a.data.substring(0, 1)) {
                                case "D":
                                    this.deletePacket(parseInt(a.data.substring(1)));
                                    break;
                                case "P":
                                    "undefined" != typeof JSON.parse && sareX_personalization.execute([JSON.parse(a.data.substring(1))])
                            }
                        } catch (b) {
                            z(a)
                        }
                    }
                }
                    , d = {
                    url: sareX_core.host + "/sw.js?lib=" + sareX_core.int_ver + "&c=" + sareX_core.x + "&ct=" + sareX_core.xtmp + "&d=" + a.domain.sa_r(),
                    live_instance: y,
                    on_response: function(a) {
                        y.deletePacket(parseInt(a))
                    }
                };
                M.push(sareX_websocketTransport(c)),
                    M.push(sareX_ajaxTransport(d)),
                    sareX_core.eventListener(document, "mousemove", n),
                    sareX_core.eventListener(document, "click", o),
                    sareX_core.eventListener(document, "resize", p),
                    sareX_core.eventListener(window, "scroll", q),
                    sareX_core.eventListener(document, "keydown", r),
                    sareX_core.eventListener(document, "keyup", s),
                    sareX_core.eventListener(window, "paste", t),
                    "undefined" != typeof MutationEvent ? (sareX_core.eventListener(window, "DOMSubtreeModified", m),
                        sareX_core.eventListener(window, "DOMNodeInserted", m),
                        sareX_core.eventListener(window, "DOMNodeRemoved", m)) : document.onpropertychange && (document.onpropertychange = m),
                    A = setInterval(v, 1e3 * H),
                    B = setInterval(k, 100),
                    C = !0,
                    u({
                        timeStamp: (new Date).getTime(),
                        state: "entry"
                    }),
                    w(),
                    x()
            }
        }
        ,
        y.stop = function() {
            try {
                clearInterval(A),
                    clearInterval(B),
                    v({
                        timeStamp: (new Date).getTime(),
                        state: "exit"
                    }),
                    C = !1
            } catch (a) {
                var b = new Image;
                b.src = ("https:" == document.location.protocol ? "https://" : "http://") + sareX_core.host + "/Error.php?stop=1&name=" + encodeURIComponent(e.name) + "&message=" + encodeURIComponent(e.message) + "&dl=" + document.location
            }
        }
        ,
        y
}
var sareX_ip = function() {
    function a(a) {
        for (var b = new Array, c = a ? a.target : this, d = 0; d < c.elements.length; d++)
            "undefined" != typeof c.elements[d].name && "undefined" != typeof c.elements[d].value && (b[c.elements[d].name.sa_r()] = c.elements[d].value.sa_r());
        var e = sareX_core.preparerequest(sareX_core.host + "/sc.js", {
            lib: sareX_core.int_ver,
            l: document.location.toString().sa_r(),
            d: sareX_core.sa_domain.sa_r(),
            r: "string" == typeof document.referrer ? document.referrer.sa_r() : "",
            t: "string" == typeof document.title ? document.title.sa_r() : "",
            c: sareX_core.x,
            ct: sareX_core.xtmp,
            rnd: sareX_core.rnd_id,
            evt: 5
        });
        try {
            sareX_core.ajaxRequestTimeout(e, b, "POST", 1e3, function() {
                HTMLFormElement.prototype.rs.apply(c)
            })
        } catch (a) {
            var f = new Image;
            f.src = ("https:" == document.location.protocol ? "https://" : "http://") + sareX_core.host + "/Error.php?sc=1&name=" + encodeURIComponent(a.name) + "&message=" + encodeURIComponent(a.message) + "&dl=" + document.location
        }
    }
    return "undefined" != typeof sareX_core && ("undefined" != typeof HTMLFormElement && (HTMLFormElement.prototype.rs = HTMLFormElement.prototype.submit,
        HTMLFormElement.prototype.submit = a,
        void sareX_core.eventListener(window, "submit", function(b) {
            var c = b;
            c || (c = window.event),
                c.cancelBubble = !0,
                c.returnValue = !1,
            c.stopPropagation && c.stopPropagation(),
            c.preventDefault && c.preventDefault(),
                a(c)
        }, !1)))
}
    , sareX_core = function(a) {
    var b, c, d, e, f = "undefined" == typeof a.host ? "x.sare25.com" : a.host, g = new Date, h = g.getTime(), i = Math.ceil(65535 * Math.random()) + 1, j = Math.ceil(89999999 * Math.random() + 1e7).toString() + h.toString().substring(4), k = 0, l = null, m = ("undefined" == typeof a.allowedEvents ? "undefined" : a.allowedEvents,
            function() {
                var a = 0
                    , b = -1
                    , c = [];
                return function(d) {
                    return void 0 !== d ? c[++b] = d : a > b ? void 0 : (d = c[a],
                        delete c[a],
                        a++,
                        d)
                }
            }
    );
    String.prototype.sa_r = function() {
        return this.replace(/[a-zA-Z]/g, function(a) {
            return String.fromCharCode((a <= "Z" ? 90 : 122) >= (a = a.charCodeAt(0) + 13) ? a : a - 26)
        })
    }
    ;
    var n = function() {
        var a = null;
        return window.XDomainRequest ? a = new XDomainRequest : window.XMLHttpRequest ? a = new XMLHttpRequest : window.ActiveXObject && (a = new ActiveXObject("MSXML2.XMLHTTP.3.0")),
            a
    }
        , o = null !== n()
        , p = function(a, b, c) {
        var d = new RegExp("(.?[^.]+.[^.]+)$").exec(document.location.host)
            , e = "";
        if ("undefined" != typeof c) {
            var f = new Date;
            f.setTime(c),
                e = ";expires=" + f.toGMTString()
        }
        document.cookie = a + "=" + b + ";domain=" + d[1] + ";path=/" + e
    }
        , q = function(a) {
        for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) {
            for (var e = c[d]; " " == e.charAt(0); )
                e = e.substring(1);
            if (0 == e.search(b))
                return e.substring(b.length, e.length)
        }
    }
        , r = function(a, b) {
        var c = "";
        if ("object" == typeof b)
            for (var d in b)
                c = c + d + "=" + encodeURIComponent(b[d]) + "&";
        return "" != c && (c = "?" + c.substr(0, c.length - 1)),
        ("https:" == document.location.protocol ? "https://" : "http://") + a + c
    }
        , s = function() {
        if ("serviceWorker"in navigator && "https:" == location.protocol) {
            var a = document.createElement("link");
            a.rel = "manifest",
                a.href = "/manifest.json",
                document.head.appendChild(a),
            "permissions"in navigator && navigator.permissions.query({
                name: "notifications"
            }).then(function(a) {
                a.onchange = function() {
                    if ("denied" === a.state) {
                        var b = {
                            lib: sareX_core.int_ver,
                            d: sareX_core.sa_domain.sa_r(),
                            ct: sareX_core.xtmp,
                            c: sareX_core.x
                        };
                        sareX_core.request(sareX_core.host + "/ser.js", b)
                    }
                }
            })["catch"](function(a) {}),
                navigator.serviceWorker.register("/sw.js"),
                navigator.serviceWorker.ready.then(function(a) {
                    a.pushManager.subscribe({
                        userVisibleOnly: !0
                    }).then(function(a) {
                        var b = sareX_core.getCookie("sare_ep");
                        if (void 0 == b || b != a.endpoint.sa_r()) {
                            var c = {
                                lib: sareX_core.int_ver,
                                d: sareX_core.sa_domain.sa_r(),
                                ct: sareX_core.xtmp,
                                c: sareX_core.x,
                                ep: a.endpoint.sa_r()
                            }
                                , d = new Date
                                , e = d.getTime();
                            sareX_core.request(sareX_core.host + "/se.js", c),
                                p("sare_ep", a.endpoint.sa_r(), e + 31536e6)
                        }
                    })["catch"](function(a) {})
                })
        }
    }
        , t = function(a) {
        var b = document.getElementsByTagName("html")[0];
        b.addEventListener("mouseleave", function(b) {
            if (b.y < 0) {
                var c = sareX_core.getCookie("sare_popup");
                if ("undefined" == typeof c)
                    if (document.cookie = "sare_popup=popup;domain=" + document.location.host + ";path=/",
                            console.log(typeof a),
                        "string" == typeof a) {
                        var d = document.getElementById(a);
                        if ("undefined" != typeof d) {
                            d.style.display = "block";
                            var e = d.getElementsByClassName("close")[0];
                            "undefined" != typeof e && (e.onclick = function() {
                                    d.style.display = "none"
                                }
                            )
                        }
                    } else
                        "function" == a && (window[a](),
                            console.log("function"))
            }
        })
    }
        , u = function(a, b) {
        var c = new Image;
        c.src = r(a, b)
    }
        , v = function(a, b, c) {
        "undefined" == typeof c && (c = !1);
        var d = document.createElement("script");
        d.type = "text/javascript",
            d.async = !0;
        var e = r(a, b);
        d.src = e;
        var f = document.getElementsByTagName("script")[0];
        f.parentNode.insertBefore(d, f)
    }
        , w = function(a, b) {
        var c = r(a, b)
            , d = n();
        try {
            d.open("GET", c),
                d.send()
        } catch (e) {
            try {
                d = new XDomainRequest,
                    d.open("GET", c),
                    d.send()
            } catch (e) {
                v(a, b)
            }
        }
    }
        , x = function(a, b, c, d, e, f) {
        if ("undefined" != typeof window.XDomainRequest && (b._xdomain = "true"),
            "POST" == c) {
            var g = r(a)
                , h = "";
            for (var i in b)
                h = f === !0 ? h + i + "=" + encodeURIComponent("string" == typeof b[i] ? b[i].sa_r() : b[i]) + "&" : h + i + "=" + encodeURIComponent(b[i]) + "&";
            "" != h && (h = h.substr(0, h.length - 1))
        } else
            var g = r(a, b);
        var j = n();
        try {
            j.open(c, g),
            "POST" == c && "undefined" == typeof window.XDomainRequest && "undefined" != typeof j.setRequestHeader && j.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
                "undefined" == typeof window.XDomainRequest ? j.onreadystatechange = function(a) {
                        try {
                            j.readyState >= 4 && e(j)
                        } catch (b) {}
                    }
                    : (j.onprogress = function() {}
                            ,
                            j.onload = function(a) {
                                try {
                                    e(j)
                                } catch (b) {}
                            }
                    ),
                "POST" == c ? j.send(h) : j.send();
            setTimeout(function() {
                try {
                    j.abort()
                } catch (a) {}
            }, d)
        } catch (k) {
            var l = new Image;
            l.src = ("https:" == document.location.protocol ? "https://" : "http://") + sareX_core.host + "/Error.php?sc=1&name=" + encodeURIComponent(k.name) + "&message=" + encodeURIComponent(k.message) + "&dl=" + document.location
        }
    }
        , y = function(a, b, c) {
        return (y = document.getElementsByClassName ? function(a, b, c) {
                    c = c || document;
                    for (var d, e = c.getElementsByClassName(a), f = b ? new RegExp("\\b" + b + "\\b","i") : null, g = [], h = 0, i = e.length; h < i; h += 1)
                        d = e[h],
                        f && !f.test(d.nodeName) || g.push(d);
                    return g
                }
                : document.evaluate ? function(a, b, c) {
                        b = b || "*",
                            c = c || document;
                        for (var d, e, f = a.split(" "), g = "", h = "http://www.w3.org/1999/xhtml", i = document.documentElement.namespaceURI === h ? h : null, j = [], k = 0, l = f.length; k < l; k += 1)
                            g += "[contains(concat(' ', @class, ' '), ' " + f[k] + " ')]";
                        try {
                            d = document.evaluate(".//" + b + g, c, i, 0, null)
                        } catch (m) {
                            d = document.evaluate(".//" + b + g, c, null, 0, null)
                        }
                        for (; e = d.iterateNext(); )
                            j.push(e);
                        return j
                    }
                    : function(a, b, c) {
                        b = b || "*",
                            c = c || document;
                        for (var d, e, f = a.split(" "), g = [], h = "*" === b && c.all ? c.all : c.getElementsByTagName(b), i = [], j = 0, k = f.length; j < k; j += 1)
                            g.push(new RegExp("(^|\\s)" + f[j] + "(\\s|$)"));
                        for (var l = 0, m = h.length; l < m; l += 1) {
                            d = h[l],
                                e = !1;
                            for (var n = 0, o = g.length; n < o && (e = g[n].test(d.className),
                                e); n += 1)
                                ;
                            e && i.push(d)
                        }
                        return i
                    }
        )(a, b, c)
    }
        , z = function() {
        var a = 0
            , b = this.length;
        if (0 === b)
            return a;
        for (var c = 0; c < b; ++c)
            char = this.charCodeAt(c),
                a = (a << 5) - a + char,
                a &= a;
        return a
    }
        , A = function(a) {
        for (var b, c = ""; a && (b = a.parentNode || a.parent); ) {
            if ("string" == typeof a.id && a.id.length) {
                c = "#" + a.id + ">" + c;
                break
            }
            for (var d = b.childNodes, e = 0, f = 0; f < d.length; f++)
                if (1 === d[f].nodeType) {
                    if (d[f] == a) {
                        c = d[f].nodeName + "[" + (f - e) + "]>" + c;
                        break
                    }
                } else
                    e++;
            a = b
        }
        return c.substring(0, c.length - 1)
    };
    return {
        version: "4.0.2",
        int_ver: "4002",
        host: f,
        sa_domain: a.domain,
        rnd_id: i,
        ping_nr: k,
        player_mode: "undefined" != typeof parent && "undefined" != typeof parent.sareXplayer,
        init: function() {
            sareX_sb.sareX_core = this,
                sareX_personalization.sareX_core = this,
                this.tag_q = new m,
                this.xtmp = this.fc("sare_xtmp"),
                this.sb = this.fc("sare_sb"),
            null != this.sb && (this.sb = this.sb[1]),
                this["new"] = !1,
                this.x = this.scX("sare_x", this.fc("sare_x"), j, h + 31536e6),
                this.xtmp = this.xtmp ? this.xtmp[1] : this.scX("sare_xtmp", null, j),
                b = this.scX("sare_xtmp_t", null, Math.round(h / 1e3))
        },
        checkAllowedEvents: function(a) {
            return "undefined" == typeof this.allowedEvents || this.allowedEvents.indexOf(a) != -1
        },
        execute: function(f, g) {
            if (!sareX_core.checkAllowedEvents(f))
                return !1;
            if ("undefined" == typeof parent || !parent.sareXplayer) {
                var j = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                    , k = this.tag_q();
                if (k = "string" == typeof k ? k : "",
                    "undefined" != typeof f) {
                    var l = j.indexOf(parseInt(f));
                    if (l > 0)
                        var m = f;
                    "undefined" != typeof g && "object" == typeof g && (a.tag = g,
                        k = JSON.stringify(g))
                }
                var n = {
                    lib: this.int_ver,
                    l: document.location.toString().sa_r(),
                    d: this.sa_domain.sa_r(),
                    r: "string" == typeof document.referrer ? document.referrer.sa_r() : "",
                    t: "string" == typeof document.title ? document.title.sa_r() : "",
                    c: this.x,
                    ts: h,
                    ct: this.xtmp,
                    ctt: b,
                    rnd: i,
                    e: "" != k && "undefined" != typeof k ? k.toString().sa_r() : "",
                    enc: "string" == typeof document.characterSet ? document.characterSet : "string" == typeof document.charset ? document.charset : "",
                    sb: this.sb,
                    evt: "undefined" != typeof m ? m : "",
                    n: this["new"]
                };
                "function" == typeof a.personalization_callback && (n.m = JSON.stringify(a.personalization_subject) || "*"),
                    this.request(this.host + "/sa.js", n, !1, !0),
                    c = function(a) {
                        sareX_core.request(sareX_core.host + "/sa.js", {
                            d: sareX_core.sa_domain.sa_r(),
                            c: sareX_core.x,
                            ct: sareX_core.xtmp,
                            rnd: i,
                            evt: 2
                        }, !0, !0),
                        "undefined" != typeof sareX_core.sareX_live && sareX_core.sareX_live.stop()
                    }
                    ,
                    d = function(a) {
                        sareX_core.irequest(sareX_core.host + "/sa.js", {
                            d: sareX_core.sa_domain.sa_r(),
                            c: sareX_core.x,
                            ct: sareX_core.xtmp,
                            rnd: i,
                            evt: 2
                        }, !0, !0),
                        "undefined" != typeof sareX_core.sareX_live && sareX_core.sareX_live.stop()
                    }
                    ,
                    e = function(a) {
                        sareX_core.ajaxRequestTimeout(sareX_core.host + "/sd.php", {
                            d: sareX_core.sa_domain.sa_r(),
                            c: sareX_core.x,
                            ct: sareX_core.xtmp,
                            l: a.sa_r(),
                            r: document.location.toString().sa_r(),
                            rnd: i,
                            evt: 7
                        }, "GET", 1e3, function() {
                            document.location = a
                        })
                    }
                ;
                for (var o = {
                    events: [{
                        name: "unload",
                        target: window,
                        callback: c
                    }]
                }, p = 0; p < o.events.length; p++)
                    switch (o.events[p].name) {
                        case "unload":
                            window.chrome ? this.eventListener(o.events[p].target, o.events[p].name, d) : "MozBoxSizing"in document.documentElement.style || !window.onbeforeunload && null !== window.onbeforeunload ? this.eventListener(o.events[p].target, o.events[p].name, o.events[p].callback) : this.eventListener(o.events[p].target, "beforeunload", o.events[p].callback);
                            break;
                        default:
                            this.eventListener(o.events[p].target, o.events[p].name, o.events[p].callback)
                    }
            }
        },
        fc: function(a) {
            return new RegExp("(?:^|.*;\\s*)" + a + "\\s*=\\s*((?:[^;](?!;))*[^;]?).*").exec(document.cookie)
        },
        scX: function(a, b, c, d) {
            return "sare_x" == a ? "undefined" != typeof b && null != b ? (b = b[1],
                this["new"] = !1) : (b = c,
                this["new"] = !0) : b = "undefined" != typeof b && null != b ? b[1] : c,
                p(a, b, d),
                b
        },
        tag: function(a) {
            var b = JSON.stringify(a);
            this.tag_q(b)
        },
        request: function(a, b, c, d) {
            return c && o ? w(a, b, d) : v(a, b, d)
        },
        eventListener: function(a, b, c, d) {
            a.addEventListener ? a.addEventListener(b, c, !!d) : a.attachEvent && a.attachEvent("on" + b, c)
        },
        removeEventListener: function(a, b, c) {
            a.removeEventListener ? a.removeEventListener(b, c) : a.detachEvent && a.detachEvent("on" + b, c)
        },
        ready: function(a) {
            if (!this.player_mode) {
                var b = function(b) {
                    (document.addEventListener || "load" === b.type || "complete" === document.readyState) && (c(),
                    "function" == typeof a && a())
                }
                    , c = function() {
                    document.addEventListener ? (document.removeEventListener("DOMContentLoaded", b, !1),
                        window.removeEventListener("load", b, !1)) : (document.detachEvent("onreadystatechange", b),
                        window.detachEvent("onload", b))
                };
                if ("complete" === document.readyState)
                    "function" == typeof a && setTimeout(function() {
                        a()
                    });
                else if (document.addEventListener)
                    document.addEventListener("DOMContentLoaded", b, !1),
                        window.addEventListener("load", b, !1);
                else {
                    document.attachEvent("onreadystatechange", b),
                        window.attachEvent("onload", b);
                    var d = !1;
                    try {
                        d = null == window.frameElement && document.documentElement
                    } catch (e) {}
                    d && d.doScroll && !function f() {
                        try {
                            d.doScroll("left")
                        } catch (b) {
                            return setTimeout(f, 50)
                        }
                        c(),
                        "function" == typeof a && a()
                    }()
                }
            }
        },
        ping: function() {
            var b, c = new Date, d = c.getTime() - h;
            this.sareX_core.ping_nr++;
            var e;
            e = a.tag._product || a.tag._category ? JSON.stringify(a.tag) : this.sareX_core.ping_nr;
            var f = {
                lib: this.sareX_core.int_ver,
                d: this.sareX_core.sa_domain.sa_r(),
                ct: this.sareX_core.xtmp,
                c: this.sareX_core.x,
                rnd: this.sareX_core.rnd_id,
                l: document.location.toString().sa_r(),
                ts: h,
                pt: d,
                nr: e
            };
            return !!sareX_core.checkAllowedEvents(2) && (this.sareX_core.irequest(this.sareX_core.host + "/sp.js", f),
                b = 0,
                void (d < 18e5 && (d > 6e4 ? "undefined" != typeof a.ping.period1 && 0 != a.ping.period1 && (b = 1e3 * a.ping.period1,
                b < 6e4 && (b = 6e4)) : 0 != a.ping.period0 && (b = 1e3 * a.ping.period0,
                b < 1e4 && (b = 1e4)),
                b && d + b < 18e5 && (l = setTimeout(sareX_core.ping, b)))))
        },
        inisTrack: function(b) {
            b.p = "sareweb",
                b.cid = this.x,
                b.d = a.domain,
                sareX_core.irequest("rt.inistrack.net/d/rt.php", b)
        },
        triggerEvent: function(a) {},
        irequest: u,
        preparerequest: r,
        ajaxRequestTimeout: x,
        sareX_ip: sareX_ip,
        sareX_siteInspector: void 0,
        sareX_live: void 0,
        get_elements_by_class_name: y,
        hash_code: z,
        getSPath: A,
        getCookie: q,
        webPush: s,
        webpush: s,
        popupOnExit: t
    }
}(sareX_params)
    , sareX_sb = function() {
    var a = new Date
        , b = (a.getTime(),
            function(a) {
                var b = 0;
                return "number" == typeof window.innerWidth ? b = "Width" == a ? window.innerWidth : window.innerHeight : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? b = "Width" == a ? document.documentElement.clientWidth : document.documentElement.clientHeight : document.body && (document.body.clientWidth || document.body.clientHeight) && (b = "Width" == a ? document.body.clientWidth : document.body.clientHeight),
                    b
            }
    );
    return {
        execute: function() {
            this.sareX_core.request(this.sareX_core.host + "/sb.js", {
                lib: this.sareX_core.int_ver,
                ct: this.sareX_core.xtmp,
                sw: "number" == typeof screen.width ? screen.width : "",
                sh: "number" == typeof screen.height ? screen.height : "",
                sAw: "number" == typeof screen.availWidth ? screen.availWidth : "",
                sAh: "number" == typeof screen.availHeight ? screen.availHeight : "",
                sCd: "number" == typeof screen.colorDepth ? screen.colorDepth : "",
                wdw: b("Width"),
                wdh: b("Height"),
                lang: "undefined" != typeof navigator.language ? navigator.language : "undefined" != typeof navigator.browserLanguage ? navigator.browserLanguage : "",
                tz: "function" == typeof a.getTimezoneOffset ? a.getTimezoneOffset() : "",
                d: this.sareX_core.sa_domain.sa_r()
            }),
                this.sareX_core.sb = this.sareX_core.scX("sare_sb", null, 1)
        },
        sareX_core: null
    }
}()
    , sareX_personalization = function() {
    var a = new Date;
    a.getTime();
    return {
        execute: function(a) {
            for (var b = 0; b < a.length; b++)
                switch (a[b].type) {
                    case "message":
                        "function" == typeof sareX_params.personalization_callback && sareX_params.personalization_callback(a[b])
                }
        },
        sareX_core: null
    }
}()
    , sareX_frameType = {
    CLICKS_FRAMES: 0,
    MOUSEMOVES_FRAMES: 1,
    SCROLLS_FRAMES: 2,
    KEYS_FRAMES: 3,
    EXTRA_FRAMES: 4
}
    , sareX_frameResolution = {
    CLICKS_FRAMES: 1,
    MOUSEMOVES_FRAMES: 50,
    SCROLLS_FRAMES: 50,
    KEYS_FRAMES: 1,
    EXTRA_FRAMES: 1
};
sareX_core.ready(function() {
    if ("undefined" == typeof parent || !parent.sareXplayer)
        try {
            sareX_params = "undefined" != typeof sareX_params ? sareX_params : {},
            "undefined" == typeof sareX_params.sareX_ip && (sareX_params.sareX_ip = !1),
            "undefined" == typeof sareX_params.execute && (sareX_params.execute = !1),
            "undefined" == typeof sareX_params.links && (sareX_params.links = !1),
            "undefined" == typeof sareX_params.tag && (sareX_params.tag = !1),
                sareX_core.init();
            try {
                "function" == typeof sareX_params.siteInfoProvider && (sareX_core.siteInspector = new sareX_siteInspector(sareX_params),
                    sareX_core.siteInspector.init(sareX_params.siteInfoProvider),
                    sareX_core.siteInspector.executeLoadEvents(),
                    sareX_core.siteInspector.bindEvents())
            } catch (a) {
                throw sareX_params.ugauga && console.log(a),
                    a
            }
            if (sareX_params.tag) {
                var b = sareX_params.tag;
                "undefined" != typeof b.id && "undefined" != typeof b.params && (b = b.params),
                    sareX_core.tag(b)
            }
            if (sareX_params.execute && sareX_core.execute(),
                sareX_params.sareX_ip && sareX_core.sareX_ip(),
                    sareX_params.links)
                for (var c = 0; c < sareX_params.links.length; c++) {
                    var d = new RegExp("(^| )sarexUrl( |$)");
                    if (d.test(sareX_params.links[c].attributes["class"].value)) {
                        var e = sareX_params.links[c].href;
                        sareX_params.links[c].href = "#",
                        "undefined" == typeof sareX_params.links[c].title && (sareX_params.links[c].title = e),
                            sareX_params.links[c].setAttribute("data-url", e),
                            sareX_core.eventListener(sareX_params.links[c], "click", function() {
                                otherDomainUrl(this.getAttribute("data-url"))
                            }, !0)
                    }
                }
            if ("undefined" != typeof sareX_params.ping) {
                var f = 0;
                "undefined" != typeof sareX_params.ping.period0 && sareX_params.ping.period0 > 0 ? (f = 1e3 * sareX_params.ping.period0,
                    f = f < 1e4 ? 1e4 : f > 6e4 ? 6e4 : f,
                    setTimeout(sareX_core.ping, f)) : "undefined" != typeof sareX_params.ping.period1 && sareX_params.ping.period1 > 0 && (f = 1e3 * sareX_params.ping.period1,
                    f = f < 6e4 ? 6e4 : f > 18e5 ? 18e5 : f,
                    setTimeout(sareX_core.ping, f))
            }
            "undefined" != typeof sareX_params.event && "undefined" != typeof sareX_params.event.id && sareX_core.execute(sareX_params.event.id, sareX_params.event.params),
            "undefined" != typeof sareX_params.inisTrack && sareX_core.inisTrack(sareX_params.inisTrack),
            "undefined" != typeof sareX_params.webPush && sareX_core.webPush(sareX_params.webPush),
            "undefined" != typeof sareX_params.popupOnExit && sareX_core.popupOnExit(sareX_params.popupOnExit),
            "undefined" != typeof sareX_params.live && (sareX_core.sareX_live = sareX_live(sareX_params),
                sareX_core.sareX_live.start())
        } catch (a) {
            sareX_params.ugauga && console.log(a);
            var g = new Image;
            g.src = "//" + sareX_core.host + "/Error.php?sb=1&name=" + encodeURIComponent(a.name) + "&message=" + encodeURIComponent(a.message) + "&dl=" + document.location
        }
}),
    function(a, b) {
        "use strict";
        function c(a, b) {
            return (65535 & a) * b + (((a >>> 16) * b & 65535) << 16)
        }
        function d(a, b) {
            return a << b | a >>> 32 - b
        }
        function e(a) {
            return a ^= a >>> 16,
                a = c(a, 2246822507),
                a ^= a >>> 13,
                a = c(a, 3266489909),
                a ^= a >>> 16
        }
        function f(a, b) {
            a = [a[0] >>> 16, 65535 & a[0], a[1] >>> 16, 65535 & a[1]],
                b = [b[0] >>> 16, 65535 & b[0], b[1] >>> 16, 65535 & b[1]];
            var c = [0, 0, 0, 0];
            return c[3] += a[3] + b[3],
                c[2] += c[3] >>> 16,
                c[3] &= 65535,
                c[2] += a[2] + b[2],
                c[1] += c[2] >>> 16,
                c[2] &= 65535,
                c[1] += a[1] + b[1],
                c[0] += c[1] >>> 16,
                c[1] &= 65535,
                c[0] += a[0] + b[0],
                c[0] &= 65535,
                [c[0] << 16 | c[1], c[2] << 16 | c[3]]
        }
        function g(a, b) {
            a = [a[0] >>> 16, 65535 & a[0], a[1] >>> 16, 65535 & a[1]],
                b = [b[0] >>> 16, 65535 & b[0], b[1] >>> 16, 65535 & b[1]];
            var c = [0, 0, 0, 0];
            return c[3] += a[3] * b[3],
                c[2] += c[3] >>> 16,
                c[3] &= 65535,
                c[2] += a[2] * b[3],
                c[1] += c[2] >>> 16,
                c[2] &= 65535,
                c[2] += a[3] * b[2],
                c[1] += c[2] >>> 16,
                c[2] &= 65535,
                c[1] += a[1] * b[3],
                c[0] += c[1] >>> 16,
                c[1] &= 65535,
                c[1] += a[2] * b[2],
                c[0] += c[1] >>> 16,
                c[1] &= 65535,
                c[1] += a[3] * b[1],
                c[0] += c[1] >>> 16,
                c[1] &= 65535,
                c[0] += a[0] * b[3] + a[1] * b[2] + a[2] * b[1] + a[3] * b[0],
                c[0] &= 65535,
                [c[0] << 16 | c[1], c[2] << 16 | c[3]]
        }
        function h(a, b) {
            return b %= 64,
                32 === b ? [a[1], a[0]] : b < 32 ? [a[0] << b | a[1] >>> 32 - b, a[1] << b | a[0] >>> 32 - b] : (b -= 32,
                    [a[1] << b | a[0] >>> 32 - b, a[0] << b | a[1] >>> 32 - b])
        }
        function i(a, b) {
            return b %= 64,
                0 === b ? a : b < 32 ? [a[0] << b | a[1] >>> 32 - b, a[1] << b] : [a[1] << b - 32, 0]
        }
        function j(a, b) {
            return [a[0] ^ b[0], a[1] ^ b[1]]
        }
        function k(a) {
            return a = j(a, [0, a[0] >>> 1]),
                a = g(a, [4283543511, 3981806797]),
                a = j(a, [0, a[0] >>> 1]),
                a = g(a, [3301882366, 444984403]),
                a = j(a, [0, a[0] >>> 1])
        }
        var l = {
            version: "3.0.1",
            x86: {},
            x64: {}
        };
        l.x86.hash32 = function(a, b) {
            a = a || "",
                b = b || 0;
            for (var f = a.length % 4, g = a.length - f, h = b, i = 0, j = 3432918353, k = 461845907, l = 0; l < g; l += 4)
                i = 255 & a.charCodeAt(l) | (255 & a.charCodeAt(l + 1)) << 8 | (255 & a.charCodeAt(l + 2)) << 16 | (255 & a.charCodeAt(l + 3)) << 24,
                    i = c(i, j),
                    i = d(i, 15),
                    i = c(i, k),
                    h ^= i,
                    h = d(h, 13),
                    h = c(h, 5) + 3864292196;
            switch (i = 0,
                f) {
                case 3:
                    i ^= (255 & a.charCodeAt(l + 2)) << 16;
                case 2:
                    i ^= (255 & a.charCodeAt(l + 1)) << 8;
                case 1:
                    i ^= 255 & a.charCodeAt(l),
                        i = c(i, j),
                        i = d(i, 15),
                        i = c(i, k),
                        h ^= i
            }
            return h ^= a.length,
                h = e(h),
            h >>> 0
        }
            ,
            l.x86.hash128 = function(a, b) {
                a = a || "",
                    b = b || 0;
                for (var f = a.length % 16, g = a.length - f, h = b, i = b, j = b, k = b, l = 0, m = 0, n = 0, o = 0, p = 597399067, q = 2869860233, r = 951274213, s = 2716044179, t = 0; t < g; t += 16)
                    l = 255 & a.charCodeAt(t) | (255 & a.charCodeAt(t + 1)) << 8 | (255 & a.charCodeAt(t + 2)) << 16 | (255 & a.charCodeAt(t + 3)) << 24,
                        m = 255 & a.charCodeAt(t + 4) | (255 & a.charCodeAt(t + 5)) << 8 | (255 & a.charCodeAt(t + 6)) << 16 | (255 & a.charCodeAt(t + 7)) << 24,
                        n = 255 & a.charCodeAt(t + 8) | (255 & a.charCodeAt(t + 9)) << 8 | (255 & a.charCodeAt(t + 10)) << 16 | (255 & a.charCodeAt(t + 11)) << 24,
                        o = 255 & a.charCodeAt(t + 12) | (255 & a.charCodeAt(t + 13)) << 8 | (255 & a.charCodeAt(t + 14)) << 16 | (255 & a.charCodeAt(t + 15)) << 24,
                        l = c(l, p),
                        l = d(l, 15),
                        l = c(l, q),
                        h ^= l,
                        h = d(h, 19),
                        h += i,
                        h = c(h, 5) + 1444728091,
                        m = c(m, q),
                        m = d(m, 16),
                        m = c(m, r),
                        i ^= m,
                        i = d(i, 17),
                        i += j,
                        i = c(i, 5) + 197830471,
                        n = c(n, r),
                        n = d(n, 17),
                        n = c(n, s),
                        j ^= n,
                        j = d(j, 15),
                        j += k,
                        j = c(j, 5) + 2530024501,
                        o = c(o, s),
                        o = d(o, 18),
                        o = c(o, p),
                        k ^= o,
                        k = d(k, 13),
                        k += h,
                        k = c(k, 5) + 850148119;
                switch (l = 0,
                    m = 0,
                    n = 0,
                    o = 0,
                    f) {
                    case 15:
                        o ^= a.charCodeAt(t + 14) << 16;
                    case 14:
                        o ^= a.charCodeAt(t + 13) << 8;
                    case 13:
                        o ^= a.charCodeAt(t + 12),
                            o = c(o, s),
                            o = d(o, 18),
                            o = c(o, p),
                            k ^= o;
                    case 12:
                        n ^= a.charCodeAt(t + 11) << 24;
                    case 11:
                        n ^= a.charCodeAt(t + 10) << 16;
                    case 10:
                        n ^= a.charCodeAt(t + 9) << 8;
                    case 9:
                        n ^= a.charCodeAt(t + 8),
                            n = c(n, r),
                            n = d(n, 17),
                            n = c(n, s),
                            j ^= n;
                    case 8:
                        m ^= a.charCodeAt(t + 7) << 24;
                    case 7:
                        m ^= a.charCodeAt(t + 6) << 16;
                    case 6:
                        m ^= a.charCodeAt(t + 5) << 8;
                    case 5:
                        m ^= a.charCodeAt(t + 4),
                            m = c(m, q),
                            m = d(m, 16),
                            m = c(m, r),
                            i ^= m;
                    case 4:
                        l ^= a.charCodeAt(t + 3) << 24;
                    case 3:
                        l ^= a.charCodeAt(t + 2) << 16;
                    case 2:
                        l ^= a.charCodeAt(t + 1) << 8;
                    case 1:
                        l ^= a.charCodeAt(t),
                            l = c(l, p),
                            l = d(l, 15),
                            l = c(l, q),
                            h ^= l
                }
                return h ^= a.length,
                    i ^= a.length,
                    j ^= a.length,
                    k ^= a.length,
                    h += i,
                    h += j,
                    h += k,
                    i += h,
                    j += h,
                    k += h,
                    h = e(h),
                    i = e(i),
                    j = e(j),
                    k = e(k),
                    h += i,
                    h += j,
                    h += k,
                    i += h,
                    j += h,
                    k += h,
                ("00000000" + (h >>> 0).toString(16)).slice(-8) + ("00000000" + (i >>> 0).toString(16)).slice(-8) + ("00000000" + (j >>> 0).toString(16)).slice(-8) + ("00000000" + (k >>> 0).toString(16)).slice(-8)
            }
            ,
            l.x64.hash128 = function(a, b) {
                a = a || "",
                    b = b || 0;
                for (var c = a.length % 16, d = a.length - c, e = [0, b], l = [0, b], m = [0, 0], n = [0, 0], o = [2277735313, 289559509], p = [1291169091, 658871167], q = 0; q < d; q += 16)
                    m = [255 & a.charCodeAt(q + 4) | (255 & a.charCodeAt(q + 5)) << 8 | (255 & a.charCodeAt(q + 6)) << 16 | (255 & a.charCodeAt(q + 7)) << 24, 255 & a.charCodeAt(q) | (255 & a.charCodeAt(q + 1)) << 8 | (255 & a.charCodeAt(q + 2)) << 16 | (255 & a.charCodeAt(q + 3)) << 24],
                        n = [255 & a.charCodeAt(q + 12) | (255 & a.charCodeAt(q + 13)) << 8 | (255 & a.charCodeAt(q + 14)) << 16 | (255 & a.charCodeAt(q + 15)) << 24, 255 & a.charCodeAt(q + 8) | (255 & a.charCodeAt(q + 9)) << 8 | (255 & a.charCodeAt(q + 10)) << 16 | (255 & a.charCodeAt(q + 11)) << 24],
                        m = g(m, o),
                        m = h(m, 31),
                        m = g(m, p),
                        e = j(e, m),
                        e = h(e, 27),
                        e = f(e, l),
                        e = f(g(e, [0, 5]), [0, 1390208809]),
                        n = g(n, p),
                        n = h(n, 33),
                        n = g(n, o),
                        l = j(l, n),
                        l = h(l, 31),
                        l = f(l, e),
                        l = f(g(l, [0, 5]), [0, 944331445]);
                switch (m = [0, 0],
                    n = [0, 0],
                    c) {
                    case 15:
                        n = j(n, i([0, a.charCodeAt(q + 14)], 48));
                    case 14:
                        n = j(n, i([0, a.charCodeAt(q + 13)], 40));
                    case 13:
                        n = j(n, i([0, a.charCodeAt(q + 12)], 32));
                    case 12:
                        n = j(n, i([0, a.charCodeAt(q + 11)], 24));
                    case 11:
                        n = j(n, i([0, a.charCodeAt(q + 10)], 16));
                    case 10:
                        n = j(n, i([0, a.charCodeAt(q + 9)], 8));
                    case 9:
                        n = j(n, [0, a.charCodeAt(q + 8)]),
                            n = g(n, p),
                            n = h(n, 33),
                            n = g(n, o),
                            l = j(l, n);
                    case 8:
                        m = j(m, i([0, a.charCodeAt(q + 7)], 56));
                    case 7:
                        m = j(m, i([0, a.charCodeAt(q + 6)], 48));
                    case 6:
                        m = j(m, i([0, a.charCodeAt(q + 5)], 40));
                    case 5:
                        m = j(m, i([0, a.charCodeAt(q + 4)], 32));
                    case 4:
                        m = j(m, i([0, a.charCodeAt(q + 3)], 24));
                    case 3:
                        m = j(m, i([0, a.charCodeAt(q + 2)], 16));
                    case 2:
                        m = j(m, i([0, a.charCodeAt(q + 1)], 8));
                    case 1:
                        m = j(m, [0, a.charCodeAt(q)]),
                            m = g(m, o),
                            m = h(m, 31),
                            m = g(m, p),
                            e = j(e, m)
                }
                return e = j(e, [0, a.length]),
                    l = j(l, [0, a.length]),
                    e = f(e, l),
                    l = f(l, e),
                    e = k(e),
                    l = k(l),
                    e = f(e, l),
                    l = f(l, e),
                ("00000000" + (e[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (e[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (l[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (l[1] >>> 0).toString(16)).slice(-8)
            }
            ,
            "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = l),
                exports.murmurHash3 = l) : "function" == typeof define && define.amd ? define([], function() {
                return l
            }) : (l._murmurHash3 = a.murmurHash3,
                l.noConflict = function() {
                    return a.murmurHash3 = l._murmurHash3,
                        l._murmurHash3 = b,
                        l.noConflict = b,
                        l
                }
                ,
                a.murmurHash3 = l)
    }(this),
"object" != typeof JSON && (JSON = {}),
    function() {
        "use strict";
        function f(a) {
            return a < 10 ? "0" + a : a
        }
        function this_value() {
            return this.valueOf()
        }
        function quote(a) {
            return rx_escapable.lastIndex = 0,
                rx_escapable.test(a) ? '"' + a.replace(rx_escapable, function(a) {
                    var b = meta[a];
                    return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + a + '"'
        }
        function str(a, b) {
            var c, d, e, f, g, h = gap, i = b[a];
            switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)),
            "function" == typeof rep && (i = rep.call(b, a, i)),
                typeof i) {
                case "string":
                    return quote(i);
                case "number":
                    return isFinite(i) ? String(i) : "null";
                case "boolean":
                case "null":
                    return String(i);
                case "object":
                    if (!i)
                        return "null";
                    if (gap += indent,
                            g = [],
                        "[object Array]" === Object.prototype.toString.apply(i)) {
                        for (f = i.length,
                                 c = 0; c < f; c += 1)
                            g[c] = str(c, i) || "null";
                        return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]",
                            gap = h,
                            e
                    }
                    if (rep && "object" == typeof rep)
                        for (f = rep.length,
                                 c = 0; c < f; c += 1)
                            "string" == typeof rep[c] && (d = rep[c],
                                e = str(d, i),
                            e && g.push(quote(d) + (gap ? ": " : ":") + e));
                    else
                        for (d in i)
                            Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i),
                            e && g.push(quote(d) + (gap ? ": " : ":") + e));
                    return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}",
                        gap = h,
                        e
            }
        }
        var rx_one = /^[\],:{}\s]*$/
            , rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g
            , rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
            , rx_four = /(?:^|:|,)(?:\s*\[)+/g
            , rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
            , rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }
            ,
            Boolean.prototype.toJSON = this_value,
            Number.prototype.toJSON = this_value,
            String.prototype.toJSON = this_value);
        var gap, indent, meta, rep;
        "function" != typeof JSON.stringify && (meta = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
                JSON.stringify = function(a, b, c) {
                    var d;
                    if (gap = "",
                            indent = "",
                        "number" == typeof c)
                        for (d = 0; d < c; d += 1)
                            indent += " ";
                    else
                        "string" == typeof c && (indent = c);
                    if (rep = b,
                        b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length))
                        throw new Error("JSON.stringify");
                    return str("", {
                        "": a
                    })
                }
        ),
        "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
                function walk(a, b) {
                    var c, d, e = a[b];
                    if (e && "object" == typeof e)
                        for (c in e)
                            Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c),
                                void 0 !== d ? e[c] = d : delete e[c]);
                    return reviver.call(a, b, e)
                }
                var j;
                if (text = String(text),
                        rx_dangerous.lastIndex = 0,
                    rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function(a) {
                        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    })),
                        rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, "")))
                    return j = eval("(" + text + ")"),
                        "function" == typeof reviver ? walk({
                            "": j
                        }, "") : j;
                throw new SyntaxError("JSON.parse")
            }
        )
    }();
