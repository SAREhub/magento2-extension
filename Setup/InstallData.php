<?php
namespace SARE\SAREhub\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

class InstallData implements InstallDataInterface
{
    private $customerSetupFactory;

    public function __construct(\Magento\Customer\Setup\CustomerSetupFactory $customerSetupFactory)
    {
        $this->customerSetupFactory = $customerSetupFactory;
    }

    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $customerSetup = $this->customerSetupFactory->create(['setup' => $setup]);
        $setup->startSetup();

        $attributeCode = "agree_to_sarehub";
        $customerSetup->removeAttribute(\Magento\Customer\Model\Customer::ENTITY, $attributeCode);
        $customerSetup->addAttribute('customer',
            $attributeCode, [
                'label' => 'Agree to SAREhub',
                'input' => 'select',
                'source' => 'Magento\Eav\Model\Entity\Attribute\Source\Boolean',
                'required' => false,
                'default' => '0',
                'sort_order' => 100,
                'system' => false,
                'position' => 100
            ]);

        $loyaltyAttribute = $customerSetup->getEavConfig()->getAttribute('customer', $attributeCode);
        $loyaltyAttribute->setData('used_in_forms',  ['customer_account_create', 'customer_account_edit', 'adminhtml_checkout','adminhtml_customer']);
        $loyaltyAttribute->save();

        $setup->endSetup();
    }
}