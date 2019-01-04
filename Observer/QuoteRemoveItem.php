<?php

namespace SARE\SAREhub\Observer;

use Magento\Framework\Event\ObserverInterface;

class QuoteRemoveItem implements ObserverInterface
{
    protected $_request;
    protected $_coreSession;
    protected $_eventsStorage;

    public function __construct(
        \Magento\Framework\App\RequestInterface $request,
        \Magento\Framework\Session\SessionManagerInterface $coreSession,
        \SARE\SAREhub\Model\EventsStorage $eventsStorage
    ){
        $this->_request = $request;
        $this->_coreSession = $coreSession;
        $this->_eventsStorage = $eventsStorage;
    }

    public function execute(\Magento\Framework\Event\Observer $observer){
        $item = $observer->getEvent()->getData('quote_item');
        $this->_eventsStorage->addEventToStorage($item->getSku(), -1 * $item->getQty());
    }
}
