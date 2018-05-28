<?php

namespace SARE\SAREhub\Block;

class Optin extends \Magento\Framework\View\Element\Template
{
    protected $customerSession;

    /**
     * Construct
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Magento\Customer\Model\Session $customerSession
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Customer\Model\Session $customerSession,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->customerSession = $customerSession;
    }

    public function isOptedIn(){
        return $this->customerSession->getCustomer()->getData('agree_to_sarehub');
    }
}
