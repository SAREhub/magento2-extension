<?php

namespace SARE\SAREhub\Block;

use SARE\SAREhub\Helper;

class Listener extends \Magento\Framework\View\Element\Template
{

    protected $scopeConfig;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        array $data = []
    )
    {
        $this->scopeConfig = $context->getScopeConfig();
        parent::__construct($context, $data);
    }

    public function getBasicCode()
    {
        $rawCode = $this->scopeConfig->getValue(\SARE\SAREhub\Helper\Config::CONFIG_PATH_BASIC_CODE);
        $processedCode = $this->processCode($rawCode);

        return $processedCode;
    }

    private function processCode($rawCode)
    {
        foreach ($this->configValuesMapping as $placeholder => $value) {
            $rawCode = str_replace($placeholder, $this->getConfigValue($value), $rawCode);
        }

        return $rawCode;
    }

    private function getConfigValue($path)
    {
        return $this->scopeConfig->getValue($path);
    }
}