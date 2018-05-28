var config = {
    "shim": {
        "sarewebLib": [],
    },
    "paths": {
        "sarewebLib": "https://x.sare25.com/libs/sarex4.min"
    }
};

require.config(config);

require([
    'sarewebLib'
], function($) {});
