<?php

namespace SARE\SAREhub\Model\Event;

class DeliverySelection extends Event implements EventInterface
{
    public $_id = '_cartpayment';

    public function getCode(){


        return $this->getEventData();
    }

}
