<?php
namespace SARE\SAREhub\Model\Event;

use SARE\SAREhub\Model\Event as EventType;

class CartConfirm extends Event implements EventInterface
{
    public $_id = EventType::CART_CONFIRM;

    public function getCode(){
        $this->setData("params", $this->getConfirmData());

        return $this->getEventData();
    }

    private function getConfirmData(){
        $data = $this->getCustomerData();
        $data[$this->_id] = [];

        return $data;
    }
}
