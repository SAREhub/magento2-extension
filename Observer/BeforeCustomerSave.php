<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace SARE\SAREhub\Observer;

use Magento\Framework\Event\ObserverInterface;

class BeforeCustomerSave implements ObserverInterface
{
    protected $_request;
    protected $_customerSession;

    public function __construct(
        \Magento\Framework\App\RequestInterface $request,
        \Magento\Customer\Model\Session $customerSession
    ){
        $this->_request = $request;
        $this->_customerSession = $customerSession;
    }

    public function execute(\Magento\Framework\Event\Observer $observer){
        $customer = $observer->getCustomer();
        $optin = (int)$this->_request->getPost('agree_to_sarehub');

        $customer->setData('agree_to_sarehub', $optin);
        $this->_customerSession->getCustomer()->setData('agree_to_sarehub', $optin);
    }
}