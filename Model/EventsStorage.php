<?php

namespace SARE\SAREhub\Model;

use \Magento\Framework\Session\SessionManagerInterface as CoreSession;

class EventsStorage
{
    private $_events = [];
    protected $_productHelper;
    protected $_coreSession;
    protected $_requestInterface;

    public function __construct(
        CoreSession $coreSession,
        \Magento\Framework\App\RequestInterface $requestInterface,
        \SARE\SAREhub\Helper\Product $productHelper
    )
    {
        $this->_productHelper = $productHelper;
        $this->_coreSession = $coreSession;
        $this->_requestInterface = $requestInterface;
    }

    public function addEventToStorage($sku, $qtyChange){
        if($this->_requestInterface->isAjax()){
            return $this;
        }
        if($qtyChange != 0) {
            $eventData = $this->processEvent($sku, $qtyChange);
            $this->_events[$eventData['action']] = $eventData['productData'];
            $this->_coreSession->setSarehubEvents($this->_events);
        }
    }

    public function getEvents(){
        return $this->_events;
    }

    public function processEvent($sku, $qtyChange){
        $productData = $this->_productHelper->populateProductData($sku);
        $productData['quantity'] = abs($qtyChange);

        return [
            'action' => $qtyChange > 0 ? '_cartAdd' : '_cartDel',
            'qty' => abs($qtyChange),
            'productData' => $productData
        ];
    }
}
