<?php

namespace SARE\SAREhub\Model\Event;

interface EventInterface{


    public function getCode();
    public function isAllowed();
}
