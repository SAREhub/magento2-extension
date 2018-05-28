<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Used in creating options for Yes|No config value selection
 *
 */
namespace SARE\SAREhub\Model;

class Event implements \Magento\Framework\Option\ArrayInterface
{
    public static $events = [
        '_loginpage' => 'Login page visit',
        '_category'=>'Category page visit',
        '_product' =>'Product page visit',
        '_cartadd' => 'Adding product to cart',
        '_cartdel' => 'Removing product from cart',
        '_cartregistration' => 'Checkout page visit',
        '_cartpurchased' => 'Order success page visit',
//        '_cartpayment' => 'Delivery selection page visit',
        '_cartconfirm' => 'Page before order is placed',
    ];

    /**
     * Options getter
     *
     * @return array
     */
    public function toOptionArray()
    {
        $optionArray = [];
        foreach(self::$events as $value => $label){
            $optionArray[] = ['value' => $value, 'label' => __($label)];
        }
        return $optionArray;
    }

    /**
     * Get options in "key-value" format
     *
     * @return array
     */
    public function toArray()
    {
        $returnArray = [];
        foreach(self::$events as $value => $label){
            $returnArray[$value] = __($label);
        }

        return $returnArray;
    }
}
