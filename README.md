### Integracja

Wtyczka SAREhub dla Magento2 pozwala zintegrowac sklep z systemem SAREhub.
Zakres funkcjonalności:
 - automatyczne umieszczenie podstawowego kodu śledzącego
 - automatyczne umieszczenie kodów śledzących zachowania zakupowe 
 - dodanie zgody na przesyłanie adresu e-mail klienta

### Instalacja

Aby zainstalowac wtyczkę, należy z linii poleceń uruchomic komendy:

`require sare/sarehub dev-master`

`bin/magento module:enable SARE_SAREhub --clear-static-content`

`bin/magento setup:upgrade`

Po zakończeniu instalacji, rozszerzenie można włączyc i skonfigurowac w panelu administracyjnym.
`Stores / Configuration / Integracje SARE / SAREhub`