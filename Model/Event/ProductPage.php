<?php

namespace SARE\SAREhub\Model\Event;

use SARE\SAREhub\Model\Event as EventType;

class ProductPage extends Event implements EventInterface
{
    public $_id = EventType::PRODUCT;

    public function getCode(){
        $this->setData($this->_id, $this->populateProductPageData());

        return $this->getEventData();
    }



    private function populateProductPageData(){

        $product =  $this->_registry->registry('current_product');

        $data = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'price' => $product->getFinalPrice(),
            'currency' => $this->_storeManager->getStore()->getCurrentCurrency()->getCode(),
            'url' => $this->_storeManager->getStore()->getCurrentUrl(false),
            'category' => $this->_categoryHelper->resolveCategoryNames($product->getCategoryIds())
        ];

        $this->addRegionData($data);
        return $data;
    }
}
