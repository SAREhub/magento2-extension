<?php
namespace SARE\SAREhub\Controller\Index;
use \Magento\Framework\Session\SessionManagerInterface as CoreSession;
class Index extends \Magento\Framework\App\Action\Action
{
    protected $_pageFactory;
    protected $_coreSession;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $pageFactory,
        CoreSession $coreSession
)
    {
        $this->_pageFactory = $pageFactory;
        $this->_coreSession = $coreSession;
        return parent::__construct($context);
    }

    public function execute()
    {
        $events = $this->_coreSession->getSarehubEvents();
        $this->_coreSession->unsSarehubEvents();
        if($events===null){
            $events = [];
        }
        echo json_encode($events);
        die();
        return $this->_pageFactory->create();
    }
}
