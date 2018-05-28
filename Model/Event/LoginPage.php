<?php

namespace SARE\SAREhub\Model\Event;

class LoginPage extends Event implements EventInterface
{
    public $_id = '_loginpage';

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
