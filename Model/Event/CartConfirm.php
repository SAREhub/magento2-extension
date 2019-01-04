<?php
namespace SARE\SAREhub\Model\Event;

class CartConfirm extends Event implements EventInterface
{
    public $_id = '_cartconfirm';

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
