<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace SARE\SAREhub\Observer;

use Magento\Framework\Event\ObserverInterface;

class CartUpdateItemsAfter implements ObserverInterface
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
        $items = $observer->getCart()->getQuote()->getItems();
        $info = $observer->getInfo()->getData();

        foreach ($items as $item) {
            if(isset($info[$item->getId()])) {
                $qtyChange = $info[$item->getId()]['qty'] - $item->getQty();
                $this->_eventsStorage->addEventToStorage($item->getSku(), $qtyChange);
            }
        }
    }
}
