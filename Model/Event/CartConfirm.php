<?php
namespace SARE\SAREhub\Model\Event;

class CartConfirm extends Event implements EventInterface
{
    public $_id = '_cartconfirm';

    public function getCode(){
        $this->setData("params", $this->getConfirmData());

        $script = $this->getEventData();
        $script .= "jQuery(window).hashchange(function(e){
        console.log(e);
            alert('x');
        })";
        return $script;
    }

    private function getConfirmData(){
        $data = $this->getCustomerData();
        $data[$this->_id] = [];

        return $data;
    }
}
