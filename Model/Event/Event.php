<?php

namespace SARE\SAREhub\Model\Event;

class Event {

    const PARAMS_KEY = 'sareX_params.';

    protected $_data = [];
    protected $_registry;
    protected $_storeManager;
    protected $_customerSession;
    protected $_categoryHelper;

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $_scopeConfig;

    public function __construct(
        \Magento\Framework\Registry $registry,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Customer\Model\Session $customerSession,
        \SARE\SAREhub\Helper\Category $categoryHelper
    )
    {
        $this->_registry = $registry;
        $this->_scopeConfig = $scopeConfig;
        $this->_storeManager = $storeManager;
        $this->_customerSession = $customerSession;
        $this->_categoryHelper = $categoryHelper;

        if($this->_customerSession->getCustomer()->getEmail() && $this->isOptedIn()) {
            $this->setData('_email', $this->_customerSession->getCustomer()->getEmail());
        }
    }

    public function getParam(){
        return $this->param;
    }

    public function getCustomerData(){
        if($this->_customerSession->getCustomer()->getEmail() && $this->isOptedIn()) {
            return ['_email' => $this->_customerSession->getCustomer()->getEmail()];
        }
    }

    public function isOptedIn(){
        return $this->_customerSession->getCustomer()->getData('agree_to_sarehub');
    }

    public function getCodePrefix(){
        return self::PARAMS_KEY.$this->getParam();
    }

    public function setParamsKey($key){
        $this->param = $key;
    }

    public function isAllowed(){
        $allowedEvents = explode(",", $this->_scopeConfig->getValue('sarehub/tracking/events'));
        return in_array($this->_id, $allowedEvents);
    }

    public function getParamsKey(){
        return $this->paramsKey;
    }

    public function getData(){
        return $this->_data;
    }

    public function setData($key, $value){
        $this->_data[$key] = $value;
    }

    public function addRegionData(&$data){
        $data['country'] = $this->_scopeConfig->getValue('general/country/default');
        $data['language'] = explode('_', $this->_scopeConfig->getValue('general/locale/code'))[0];
    }

    public function getEventData(){
        $jsCode = ''.$this->getCodePrefix().' = ';
        $jsCode .= json_encode($this->getData()).';';

        if($this->_id=='_product'){
            $jsCode .= $this->getContainedData('_cartadd', 'productDataAdd', '_product').';';
            $jsCode .= $this->getContainedData('_cartdel', 'productDataRemove', '_product').';';
        }

        return $jsCode;
    }

    public function getContainedData($eventId, $variableName, $replacedKey){
        $jsCode = 'var '.$variableName.' = ';
        $newData = $this->getData();
        $newData[$eventId] = $newData[$replacedKey];
        unset($newData[$replacedKey]);

        $jsCode .= json_encode($newData);
        return $jsCode;
    }
}