<?php
namespace SARE\SAREhub\Model\Event;

class SuccessPage extends Event implements EventInterface
{
    public $_id = '_cartpurchased';

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
