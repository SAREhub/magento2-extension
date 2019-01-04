<?php

namespace SARE\SAREhub\Model\Event;

use SARE\SAREhub\Model\Event as EventType;;

class DeliverySelection extends Event implements EventInterface
{
    public $_id = EventType::CART_PAYMENT;

    public function getCode(){

        return $this->getEventData();
    }

}
