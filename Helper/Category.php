<?php

namespace  SARE\SAREhub\Helper;

use Magento\Framework\App\Helper\Context;

class Category extends \Magento\Framework\App\Helper\AbstractHelper
{
    protected $_collecionFactory;

    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory $collecionFactory
    )
    {
        $this->_collecionFactory = $collecionFactory;
        parent::__construct($context);
    }

    public function resolveCategoryNames(array $ids){
        $categoryNames = [];
        try {
            $collection = $this->_collecionFactory
                ->create()
                ->addAttributeToSelect('name')
                ->addAttributeToFilter('entity_id', ['in' => $ids]);

            foreach ($collection as $item) {
                $categoryNames[] = ['id' =>$item->getData('name')];
            }
        } catch(\Magento\Framework\Exception\LocalizedException $e){
            $categoryNames = [];
        }

        return $categoryNames;
    }
}
