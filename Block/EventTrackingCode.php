<?php

namespace SARE\SAREhub\Block;

use SARE\SAREhub\Model\Event;

use SARE\SAREhub\Model\Event\CategoryPage;
use SARE\SAREhub\Model\Event\ProductPage;
use SARE\SAREhub\Model\Event\LoginPage;
use SARE\SAREhub\Model\Event\CheckoutPage;
use SARE\SAREhub\Model\Event\SuccessPage;
use SARE\SAREhub\Model\Event\DeliverySelection;
use SARE\SAREhub\Model\Event\CartConfirm;

class EventTrackingCode extends \Magento\Framework\View\Element\Template
{
    protected $_registry;
    protected $_scopeConfig;
    protected $_storeManager;
    protected $_customerSession;
    protected $_categoryHelper;

    protected $_classMapping = [
        Event::CATEGORY => CategoryPage::class,
        Event::PRODUCT => ProductPage::class,
        Event::LOGIN_PAGE => LoginPage::class,
        Event::CART_REGISTRATION => CheckoutPage::class,
        Event::CART_PURCHASED => SuccessPage::class,
        Event::CART_PAYMENT => DeliverySelection::class,
        EVENT::CART_CONFIRM => CartConfirm::class
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
        $className = isset($this->_classMapping[$this->getEvent()]) ? $this->_classMapping[$this->getEvent()] : 'Empty';

        $objectReflection = new \ReflectionClass($className);

        return $objectReflection->newInstanceArgs(
            [
                $this->_registry,
                $this->_scopeConfig,
                $this->_storeManager,
                $this->_customerSession,
                $this->_categoryHelper
            ]
        );
    }

}
