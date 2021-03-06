<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Used in creating options for Yes|No config value selection
 *
 */
namespace SARE\SAREhub\Model\Event;

class CategoryPage extends Event implements EventInterface
{
    public $_id = '_category';

    public function getCode(){
        $this->setData($this->_id, $this->populateCategoryPageData());
        return $this->getEventData();
    }

    private function populateCategoryPageData(){
        $data = [
          'id' => $this->_registry->registry('current_category')->getName()
        ];

        $this->addRegionData($data);
        return $data;
    }
}
