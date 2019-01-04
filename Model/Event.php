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
    CONST LOGIN_PAGE = "_loginpage";
    CONST CATEGORY = "_category";
    CONST PRODUCT = "_product";
    CONST CART_ADD = "_cartadd";
    CONST CART_DEL = "_cartdel";
    CONST CART_REGISTRATION = "_cartregistration";
    CONST CART_PURCHASED = "_cartpurchased";
    CONST CART_CONFIRM = "_cartconfirm";
    CONST CART_PAYMENT = "_cartpayment";

    public static $events = [
        self::LOGIN_PAGE => 'Login page visit',
        self::CATEGORY => 'Category page visit',
        self::PRODUCT => 'Product page visit',
        self::CART_ADD => 'Adding product to cart',
        self::CART_DEL => 'Removing product from cart',
        self::CART_REGISTRATION => 'Checkout page visit',
        self::CART_PURCHASED => 'Order success page visit',
        self::CART_CONFIRM => 'Page before order is placed',
    ];

    /**
     * Options getter
     *
     * @return array
     */
    public function toOptionArray()
    {
        $optionArray = [];
        foreach(static::$events as $value => $label){
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
        foreach(static::$events as $value => $label){
            $returnArray[$value] = __($label);
        }

        return $returnArray;
    }
}
