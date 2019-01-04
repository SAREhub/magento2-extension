<?php
namespace SARE\SAREhub\Model\Event;

use SARE\SAREhub\Model\Event as EventType;

class SuccessPage extends Event implements EventInterface
{
    public $_id = EventType::CART_PURCHASED;

    public function getCode(){
        $this->setData('id', 10);
        $this->setData('params', $this->populateCheckoutPageData());

        return $this->getEventData();
    }

    private function populateCheckoutPageData(){
        $data = $this->getCustomerData();
        $data[$this->_id] = [];

        return $data;
    }
}
