var config = {
    "shim": {
        "sarewebLib": [],
    },
    "paths": {
        "sarewebLib": "SARE_SAREhub/sarewebLib"
    }
};

require.config(config);

require([
    'sarewebLib'
], function($) {


});

