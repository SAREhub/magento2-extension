<?php

namespace SARE\SAREhub\Block;

use SARE\SAREhub\Helper;

class EventTrackingCode extends \Magento\Framework\View\Element\Template
{
    protected $_registry;
    protected $_scopeConfig;
    protected $_storeManager;
    protected $_customerSession;
    protected $_categoryHelper;

    protected $_classMapping = [
        '_category' => 'CategoryPage',
        '_product' => 'ProductPage',
        '_loginpage' => 'LoginPage',
        '_cartregistration' => 'CheckoutPage',
        '_cartpurchased' => 'SuccessPage',
        '_cartpayment' => 'DeliverySelection',
        '_cartconfirm' => 'CartConfirm'
    ];


    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Customer\Model\Session $customerSession,
        \SARE\SAREhub\Helper\Category $categoryHelper,
        array $data = []
    ){

        $this->_registry = $registry;
        $this->_scopeConfig = $context->getScopeConfig();
        $this->_storeManager = $context->getStoreManager();
        $this->_customerSession = $customerSession;
        $this->_categoryHelper = $categoryHelper;

        parent::__construct($context, $data);
    }
    /**
     * @inheritdoc
     */
    protected function _toHtml()
    {
        $codeProvider = $this->getCodeProvider();
        if(!$codeProvider->isAllowed()){
            return false;
        }
        $codeProvider->setParamsKey($this->getParam());
        return sprintf(
            '<script type="text/javascript">%s</script>',
            $codeProvider->getCode()
        );
    }

    /**
     * @return /SARE/SAREhub/Model/Event/EventInterface
     */
    private function getCodeProvider(){
        $className = '\SARE\SAREhub\Model\Event\\';
        $className .= isset($this->_classMapping[$this->getEvent()]) ? $this->_classMapping[$this->getEvent()] : 'Empty';

        $objectReflection = new \ReflectionClass($className);
        $instance = $objectReflection->newInstanceArgs(
            [
                $this->_registry,
                $this->_scopeConfig,
                $this->_storeManager,
                $this->_customerSession,
                $this->_categoryHelper
            ]
        );

        return $instance;
    }

}