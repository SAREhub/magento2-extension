<?php

namespace  SARE\SAREhub\Helper;

use Magento\Framework\App\Helper\Context;

class Config extends \Magento\Framework\App\Helper\AbstractHelper
{
    const CONFIG_PATH_ENABLED = 'sarehub/general/enabled';
    const CONFIG_PATH_BASIC_CODE = 'sarehub/general/basic_code';
    const CONFIG_PATH_DOMAIN = 'sarehub/general/domain';

    protected $_scopeConfig;

    public function __construct(
        Context $context)
    {
        $this->_scopeConfig = $context->getScopeConfig();
        parent::__construct($context);
    }

    public function isTrackingAllowed($key){
        $allowedEvents = explode(",", $this->_scopeConfig->getValue('sarehub/tracking/events'));
        return in_array($key, $allowedEvents);
    }
}