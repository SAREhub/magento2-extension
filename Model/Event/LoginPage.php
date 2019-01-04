<?php

namespace SARE\SAREhub\Model\Event;

use SARE\SAREhub\Model\Event as EventType;;

class LoginPage extends Event implements EventInterface
{
    public $_id = EventType::LOGIN_PAGE;

    public function getCode(){
        $this->setData($this->_id, $this->populateLoginPageData());

        return $this->getEventData();
    }

    private function populateLoginPageData(){
        $data = [
            'pagetype' => 'Login page'
        ];

        $this->addRegionData($data);
        return $data;
    }
}
