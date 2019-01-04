<?php

namespace  SARE\SAREhub\Helper;

use Magento\Framework\App\Helper\Context;

class Product extends \Magento\Framework\App\Helper\AbstractHelper
{
    protected $_collecionFactory;
    protected $_storeManager;
    protected $_categoryHelper;
    protected  $_productRepository;

    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $collecionFactory,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository,
        \SARE\SAREhub\Helper\Category $categoryHelper
    )
    {
        $this->_collecionFactory = $collecionFactory;
        $this->_storeManager = $storeManager;
        $this->_categoryHelper = $categoryHelper;
        $this->_productRepository = $productRepository;

        parent::__construct($context);
    }

    public function populateProductData($productSku){

        $product = $this->_productRepository->get($productSku);

        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'price' => $product->getFinalPrice(),
            'currency' => $this->_storeManager->getStore()->getCurrentCurrency()->getCode(),
            'url' => $this->_storeManager->getStore()->getCurrentUrl(false),
            'category' => $this->_categoryHelper->resolveCategoryNames($product->getCategoryIds())
        ];
    }
}
