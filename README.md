# @pmwdigital/tr

Türkiye'ye özgü işlerde her projede yeniden yazılan yardımcılar. Para, kimlik
numarası, IBAN, telefon ve Türkçe metin.

Bağımlılığı yoktur. TypeScript ile yazılmıştır, ESM olarak dağıtılır.

## Neden

Bu beş konu Türkiye'de yazılan hemen her üründe çıkıyor ve her seferinde aynı
hatalarla yeniden yazılıyor:

- `"istanbul".toUpperCase()` **ISTANBUL** verir, İSTANBUL değil
- Kuruş hesabını kayan noktayla yapınca gün sonunda hesap tutmaz
- Hesabı üçe bölünce toplam bir kuruş eksik veya fazla çıkar
- `"1.234"` bin iki yüz otuz dört müdür, bir tam iki yüz otuz dört mü
- TCKN kontrol hanesi doğrulanmadan kabul edilir

## Kurulum

```bash
npm install github:pmwdigital/pmw-tr
```

## Para

Bütün tutarlar **tam sayı kuruş** olarak tutulur. Kayan nokta hiç kullanılmaz.

```ts
import { para } from "@pmwdigital/tr";

para.parseKurus("1.234,56");   // 123456
para.parseKurus("1.234");      // 123400, nokta binlik ayracı
para.parseKurus("1234.56");    // 123456, nokta ondalık
para.format(123456);           // "₺1.234,56"

para.addVat(10000, 0.2);       // { net: 10000, vat: 2000, gross: 12000 }
para.extractVat(12000, 0.2);   // { net: 10000, vat: 2000, gross: 12000 }
```

Hesap bölmede toplam korunur, artık kuruş kaybolmaz:

```ts
para.splitEvenly(10000, 3);         // [3334, 3333, 3333], toplam 10000
para.splitByShares(171050, [2,3,5]); // toplamı yine 171050
```

`extractVat` yuvarlama artığını brütte bırakır, yani `net + vat` her zaman
`gross` değerine eşittir. Bu, mali fişin kendi içinde tutarlı kalması için önemlidir.

## Metin

```ts
import { metin } from "@pmwdigital/tr";

metin.trUpper("istanbul");     // "İSTANBUL"
metin.trLower("ISPARTA");      // "ısparta"
metin.slug("Adı Şanlı İşkembe"); // "adi-sanli-iskembe"
metin.searchKey("ŞALGAM") === metin.searchKey("salgam"); // true
```

Büyük küçük harf dönüşümü ICU'ya bağlı değildir, i ve ı eşlemesi elle yapılır,
her ortamda aynı sonucu verir.

Sıralama `Intl.Collator("tr")` kullanır, yani c ile ç, s ile ş ve i ile ı doğru
sırada gelir:

```ts
["zeytin", "çorba", "cacık", "şalgam", "salata"].sort(metin.compare);
metin.sort(urunler, (u) => u.ad);
```

## Kimlik

```ts
import { kimlik } from "@pmwdigital/tr";

kimlik.isValidTckn("10000000146"); // true
kimlik.isValidVkn("1234567890");   // true
kimlik.isValidTaxId(deger);        // uzunluğa göre TCKN veya VKN
kimlik.maskTckn("10000000146");    // "100*****146"
```

**Bilinmesi gerekenler.** TCKN doğrulaması kontrol hanesi algoritmasıdır, numaranın
gerçekten birine ait olup olmadığını söylemez. `11111111110` gibi tekrarlı diziler
checksum'dan geçer, gerçek kayıt kontrolü için NVİ servisi gerekir. VKN doğrulaması
yayımlanan GİB algoritmasını uygular ve kendi içinde tutarlıdır; bir kaydı
**reddetmek** için kullanmadan önce elinizdeki gerçek veriyle teyit edin.

## IBAN

```ts
import { iban } from "@pmwdigital/tr";

iban.isValidIban("TR33 0006 1005 1978 6457 8413 26"); // true
iban.isValidTrIban(deger);   // yalnızca 26 haneli TR
iban.formatIban(deger);      // dörtlü gruplar
iban.ibanBankCode(deger);    // "00061"
```

Doğrulama ISO 13616 mod 97 kuralıdır, boşluk ve küçük harf tolere edilir.

## Telefon

```ts
import { telefon } from "@pmwdigital/tr";

telefon.normalize("0532 123 45 67");  // "+905321234567"
telefon.normalize("(0532) 123-45-67"); // "+905321234567"
telefon.isValidMobile("0212 123 45 67"); // false
telefon.format("+905321234567");       // "0532 123 45 67"
```

## Geliştirme

```bash
npm install
npm test
npm run typecheck
npm run build
```

Kapsam 39 testtir. Test vektörleri uydurulmamıştır: TCKN `10000000146` ve IBAN
`TR330006100519786457841326` yayımlanmış örneklerdir, mod 97 sonucu bağımsız olarak
hesaplanarak doğrulanmıştır.

## Lisans

MIT
