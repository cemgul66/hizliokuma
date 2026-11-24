import { DayCurriculum, ReadingPassage } from '../types/academy';
import { DAYS_4_TO_17 } from './days4to17';
import { DAYS_18_TO_30 } from './days18to30';

export const CHECKUP_DAY: DayCurriculum = {
  dayNumber: 0,
  weekNumber: 0,
  title: 'Başlangıç Seviye Tespiti (Check-Up)',
  subtitle: 'Mevcut okuma hızınızı ve anlama oranınızı ölçün',
  eyeDurationSec: 0,
  eyePattern: 'horizontal-vertical',
  schulteSize: 3,
  reading: {
    title: 'Beynin Okuma Ritmi ve Çevresel Görüş Gücü',
    category: 'Başlangıç Ölçümü',
    paragraphs: [
      'Okuma eylemi, çoğu insanın sandığı gibi gözlerin satır boyunca kesintisiz bir akışla kaymasıyla gerçekleşmez. Aksine, gözlerimiz metin üzerinde saniyenin çok küçük dilimlerinde duraklar yapar ve bir noktadan diğerine hızlı sıçramalarla ilerler. Bilimsel literatürde bu kısa duraklamalara sabitleme, sıçramalara ise sakkadik hareket adı verilir. Beynimiz yalnızca gözlerin durduğu o anlık pencerelerde kelimeleri fotoğraf gibi algılar ve anlama dönüştürür.',
      'Geleneksel okuma alışkanlığında okuyucular neredeyse her kelimeye tek tek odaklanır ve zihinlerinin içinde o kelimeleri sessizce telaffuz eder. İç seslendirme olarak bilinen bu alışkanlık, okuma hızımızı konuşma hızımızın sınırlarına hapseder. Ortalama bir insan dakikada yüz elli ile iki yüz kelime arasında konuşabildiği için, iç sesiyle okuyan bir kişi de zihinsel potansiyelinin çok altında bir tempoda kalır ve uzun metinlerde çabuk yorulur.',
      'Oysa insan beyni görsel bilgiyi sese kıyasla katbekat daha hızlı işleyebilecek bir yapıya sahiptir. Çevresel görüş alanımızı bilinçli egzersizlerle genişlettiğimizde, gözlerimiz tek bir sabitlemede bir kelime yerine üç ya da dört kelimelik anlamlı grupları aynı anda kavrayabilir. Bu yöntem yalnızca okuma süresini kısaltmakla kalmaz, aynı zamanda zihnin metinden kopmasını ve geri dönüş yapmasını engelleyerek odaklanmayı da belirgin biçimde güçlendirir.',
      'Otuz günlük bu akademide amacımız, acele ederek kelimeleri atlamak değil, göz kaslarını eğitip beynin doğal kavrama ritmini ortaya çıkarmaktır. İlk günlerde göz koordinasyonunu ve odak genişliğini artıran temel çalışmalarla başlayacağız. Düzenli pratikle birlikte hem bilgiye daha kısa sürede ulaşacak hem de okuduklarınızı eskisinden çok daha berrak ve kalıcı biçimde hatırlamaya başlayacaksınız. Her gün ayıracağınız birkaç dakikalık disiplinli çalışma, okuma deneyiminizi kökten dönüştürecektir.',
    ],
    questions: [
      {
        id: 'c-q1',
        prompt: 'Metne göre beynimiz kelimeleri tam olarak hangi anda algılar?',
        options: [
          'Gözler satır boyunca durmaksızın kayarken',
          'Gözlerin metin üzerinde yaptığı kısa duraklamalar sırasında',
          'Yalnızca sesli okuma yapıldığı anlarda',
          'Sayfanın en son satırına ulaşıldığında',
        ],
        correctIndex: 1,
      },
      {
        id: 'c-q2',
        prompt: 'İç seslendirme alışkanlığı okuma hızımızı neden sınırlar?',
        options: [
          'Göz kaslarının tamamen hareketsiz kalmasına yol açtığı için',
          'Kelime dağarcığını zamanla daralttığı için',
          'Okumayı konuşma hızının sınırlarına hapsettiği için',
          'Sadece teknik metinlerde uygulanabildiği için',
        ],
        correctIndex: 2,
      },
      {
        id: 'c-q3',
        prompt: 'Çevresel görüş alanının genişlemesi okumayı nasıl etkiler?',
        options: [
          'Tek duraklamada birden fazla kelimenin grup halinde kavranmasını sağlar',
          'Okuyucunun her kelimeyi yüksek sesle tekrar etmesini gerektirir',
          'Satırlar arasında daha sık geriye dönüş yapılmasına neden olur',
          'Anlama oranını düşürerek yalnızca yüzeysel tarama yaptırır',
        ],
        correctIndex: 0,
      },
      {
        id: 'c-q4',
        prompt: 'Metne göre ortalama bir insanın konuşma hızı dakikada kaç kelime aralığındadır?',
        options: [
          '50 ile 90 kelime arasında',
          '150 ile 200 kelime arasında',
          '350 ile 450 kelime arasında',
          '500 ile 600 kelime arasında',
        ],
        correctIndex: 1,
      },
      {
        id: 'c-q5',
        prompt: '30 günlük akademinin temel amacı aşağıdakilerden hangisidir?',
        options: [
          'Metinlerdeki zor kelimeleri atlayarak hızlıca sona ulaşmak',
          'Göz kaslarını eğiterek beynin doğal kavrama ritmini ortaya çıkarmak',
          'Sadece kısa haber başlıklarını ezberleme becerisi kazandırmak',
          'Okuma sırasında iç sesi mümkün olduğunca güçlendirmek',
        ],
        correctIndex: 1,
      },
    ],
  },
};

const BESPOKE_DAYS: DayCurriculum[] = [
  {
    dayNumber: 1,
    weekNumber: 1,
    title: 'Göz Kaslarını Isıtma ve İlk Adım',
    subtitle: 'Yatay-dikey odak kontrolü ve 3x3 Schulte başlangıcı',
    eyeDurationSec: 30,
    eyePattern: 'horizontal-vertical',
    schulteSize: 3,
    steps: ['eye', 'schulte'],
    reading: {
      title: 'Göz Kasları ve Bilinçli Sabitleme',
      category: '1. Hafta · Temel Kondisyon',
      paragraphs: [
        'Tıpkı koşuya çıkmadan önce bacak kaslarımızı esnetmemiz gibi, yoğun bir okuma seansından önce de gözlerimizi hareket ettiren altı küçük kası ısıtmamız gerekir. Gün boyunca telefon ve bilgisayar ekranlarına dar bir açıyla bakmak bu kasları tembelleştirir ve satır takibini zorlaştırır.',
        'Bir sayfayı okurken gözümüzün her kelimenin tam ortasına inmesi şart değildir. İki ya da üç kelimeyi kapsayan bir pencerenin merkezine odaklandığımızda, retinanın çevresel bölgesi sağdaki ve soldaki kelimeleri de net biçimde beyne iletir. Bu sayede bir satırı on iki duraklama yerine dört duraklamada bitirmek mümkündür.',
        'Bugünkü çalışmada hız rekoru kırmaya çalışmayın. Önemli olan gözlerinizin satır üzerinde gereksiz titremeler yapmadan, ileri doğru kararlı ve ritmik adımlarla ilerlemesini hissetmektir.',
      ],
      questions: [
        {
          id: 'd1-q1',
          prompt: 'Gün içinde ekranlara dar açıyla bakmak gözlerimizi nasıl etkiler?',
          options: [
            'Göz kaslarını tembelleştirip satır takibini zorlaştırır',
            'Çevresel görüş açısını kendiliğinden genişletir',
            'Okuma hızını kalıcı olarak iki katına çıkarır',
            'Sabitleme süresini sıfıra indirir',
          ],
          correctIndex: 0,
        },
        {
          id: 'd1-q2',
          prompt: 'Bir kelime grubunun merkezine odaklandığımızda yan kelimeleri nasıl algılarız?',
          options: [
            'Metni yüksek sesle okuyarak',
            'Retinanın çevresel bölgesi aracılığıyla',
            'Satırın başına geri dönerek',
            'Parmağımızla her harfi çizerek',
          ],
          correctIndex: 1,
        },
        {
          id: 'd1-q3',
          prompt: 'Birinci gün çalışmasının temel önceliği nedir?',
          options: [
            'Anlamadan en yüksek kelime sayısına ulaşmak',
            'Gözlerin ileri doğru kararlı ve ritmik ilerlemesini hissetmek',
            'Aynı paragrafı üç kez art arda okumak',
            'Her kelimede en az iki saniye beklemek',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    dayNumber: 2,
    weekNumber: 1,
    title: 'İç Sesi Susturma ve Odak Genişletme',
    subtitle: '4x4 Schulte · Genişleyen Kelime Piramidi · Blok Okuma',
    eyeDurationSec: 30,
    eyePattern: 'horizontal-vertical',
    schulteSize: 4,
    steps: ['schulte', 'pyramid', 'chunk-quiz'],
    speedMultiplier: 1.15,
    defaultChunkSize: 2,
    pyramidSets: [
      [
        'göz',
        'hızlı okuma',
        'odaklanma gücü',
        'beyin görsel algısı',
        'genişleyen aktif görüş alanı',
        'tek bakışta anlamlı bütünleri kavramak',
      ],
      [
        'odak',
        'sessiz zihin',
        'akıcı satır ritmi',
        'kelime grubu tarama',
        'ileri yönlü kararlı sıçramalar',
        'gereksiz geri dönüşleri tamamen bırakmak',
      ],
      [
        'algı',
        'görsel hız',
        'derin anlama gücü',
        'çevresel görüş penceresi',
        'blok halinde anlam yakalama',
        'okuma verimliliğini her gün yukarı taşımak',
      ],
    ],
    reading: {
      title: 'İç Seslendirme Alışkanlığını Azaltmak',
      category: '1. Hafta · Temel Kondisyon',
      paragraphs: [
        'Okumayı ilk öğrendiğimiz yıllarda öğretmenlerimiz bizden kelimeleri heceleyerek yüksek sesle söylememizi isterdi. Zamanla sesimizi kıstık ancak zihnimizin içindeki o görünmez konuşmacıyı susturmayı öğrenemedik. İşte bu yüzden pek çok yetişkin, kelimeleri görsel olarak tanıdığı halde zihninden seslendirmeyi beklediği için yavaş okur.',
        'Örneğin trafikte kırmızı ışığı ya da bir çıkış tabelasını gördüğümüzde bunu içimizden uzun cümlelerle seslendirmeyiz; anlamı görür görmez kavrarız. Kelimeler de beyin için aynı şekilde doğrudan anlam taşıyan görsel sembollerdir. Gözümüz sesten çok daha hızlı çalıştığı için, seslendirmeyi azalttığımız ölçüde kavrama hızımız yükselir.',
        'Okuma sırasında ritmi biraz artırdığınızda beyniniz iç seslendirmeye vakit bulamaz ve doğrudan görsel anlamlandırmaya geçer. Başlangıçta bu durum alışılmadık gelse de birkaç gün içinde zihninizin daha az yorulduğunu fark edeceksiniz.',
      ],
      questions: [
        {
          id: 'd2-q1',
          prompt: 'Yetişkinlerde iç seslendirme alışkanlığının kökeni neye dayanır?',
          options: [
            'İlkokulda okumayı yüksek sesle heceleyerek öğrenmemize',
            'Göz kaslarının doğuştan yavaş çalışmasına',
            'Kitap puntolarının gereğinden büyük basılmasına',
            'Kısa metinlerin yeterince ilgi çekici olmamasına',
          ],
          correctIndex: 0,
        },
        {
          id: 'd2-q2',
          prompt: 'Metindeki trafik ışığı örneği neyi açıklamak için verilmiştir?',
          options: [
            'Renklerin hafızayı nasıl zayıflattığını',
            'Görsel sembollerin iç ses olmadan doğrudan anlaşılabildiğini',
            'Sürücülerin hızlı okuma eğitimi alması gerektiğini',
            'Kısa kelimelerin uzun kelimelerden daha zor olduğunu',
          ],
          correctIndex: 1,
        },
        {
          id: 'd2-q3',
          prompt: 'Okuma ritmini biraz artırdığımızda beyinde ne gerçekleşir?',
          options: [
            'İç seslendirme tamamen güçlenir',
            'Beyin doğrudan görsel anlamlandırmaya geçer',
            'Gözler satır sonlarını göremez hale gelir',
            'Okuma süresi otomatik olarak uzar',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    dayNumber: 3,
    weekNumber: 1,
    title: 'Görüş Alanını Genişletme ve RSVP Akışı',
    subtitle: 'Çapraz/Dairesel Göz Takibi · RSVP · KPM Ölçüm Testi',
    eyeDurationSec: 30,
    eyePattern: 'diagonal-circular',
    schulteSize: 4,
    steps: ['eye', 'rsvp', 'reading-quiz'],
    speedMultiplier: 1.2,
    rsvpText:
      'Gözleriniz sayfanın merkezinde sabitlendiğinde zihin kelimeleri tek tek hecelemek zorunda kalmaz. Kırmızı odak harfine bakarak ilerlediğiniz her saniye görsel işlem hızınız artar. İç seslendirme yavaşladıkça beyniniz doğrudan kavramları algılar. Akış temposunu kaybetmeden ileri doğru devam edin. Her kelime zihninizde anlık bir imge gibi canlanır ve yorulmadan okumayı öğrenirsiniz.',
    reading: {
      title: 'Kelime Avcılığından Anlam Bloklarına Geçiş',
      category: '1. Hafta · Temel Kondisyon',
      paragraphs: [
        'Kelimeleri tek tek okumak, bir tabloya burnunuzu dayayıp sadece tek bir fırça darbesine bakmaya benzer. Resmi bütün olarak görmek için biraz geri çekilmek gerekir. Benzer biçimde, cümledeki anlam da tek bir sözcükte değil, bir araya gelen sözcük öbeklerinde saklıdır.',
        'Schulte tablosunda merkeze bakarken kenardaki sayıları fark etmeye çalışmak, tam olarak bu beceriyi geliştirir. Gözünüz sayfanın ortasına yakın bir alana baktığında bile sağda ve solda kalan kelimeleri seçebilmeye başlar. Böylece "sabah güneş doğarken" ifadesini üç ayrı duraklama yerine tek bir anlam karesi olarak alırsınız.',
        'Geri dönüşleri, yani okuduğunuz yeri tekrar kontrol etme isteğini de bırakmaya özen gösterin. Beyin, eksik kalan küçük bir detayı cümlenin devamından zaten tamamlar. İleri doğru akışı korumak, hem hızı hem de bütünlüğü canlı tutar.',
      ],
      questions: [
        {
          id: 'd3-q1',
          prompt: 'Metinde kelimeleri tek tek okumak neye benzetilmiştir?',
          options: [
            'Bir tabloya çok yaklaşıp yalnızca tek bir fırça darbesine bakmaya',
            'Karanlık bir odada el feneri aramaya',
            'Harita kullanmadan uzun bir yolculuğa çıkmaya',
            'Aynı şarkıyı düşük seste dinlemeye',
          ],
          correctIndex: 0,
        },
        {
          id: 'd3-q2',
          prompt: 'Schulte tablosu çalışması okuma becerimize doğrudan nasıl katkı sağlar?',
          options: [
            'Matematiksel işlem hızımızı artırır',
            'Merkeze bakarken kenardaki kelimeleri fark etme alanını genişletir',
            'Kelime kökenlerini daha kolay ezberlememizi sağlar',
            'Göz kırpma sayısını dakikada yüze çıkarır',
          ],
          correctIndex: 1,
        },
        {
          id: 'd3-q3',
          prompt: 'Okuma sırasında geriye dönüş yapmaktan neden kaçınmalıyız?',
          options: [
            'Sayfayı çevirmeyi geciktirdiği için',
            'Beyin eksik detayı cümlenin devamından zaten tamamlayabildiği için',
            'Gözlerin yalnızca yukarı doğru hareket etmesi gerektiği için',
            'Yazım hatalarını gizlediği için',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
];

interface PassageSeed {
  title: string;
  category: string;
  paragraphs: string[];
  questions: ReadingPassage['questions'];
}

const CURATED_PASSAGES: PassageSeed[] = [
  {
    title: 'Geri Dönüş Alışkanlığını Yenmek',
    category: '1. Hafta · Temel Kondisyon',
    paragraphs: [
      'Okuma hızını düşüren en sinsi etkenlerden biri regresyon, yani gözün istem dışı olarak önceki kelimelere geri dönmesidir. Araştırmalar, ortalama bir okuyucunun toplam okuma süresinin yaklaşık altıda birini geriye dönerek harcadığını göstermektedir. Çoğu zaman bu geri dönüşler kelimeleri gerçekten anlamadığımız için değil, yalnızca bir güvensizlik alışkanlığından kaynaklanır.',
      'Bir cümleyi okurken "Acaba o kelimeyi doğru mu gördüm?" şüphesi zihni duraksatır. Oysa cümlenin bağlamı, zihnin eksik gördüğü parçaları saniyeler içinde onarma gücüne sahiptir. İleriye doğru kararlı bir tempo tutturduğunuzda anlama oranınızın düşmediğini, aksine metnin ana fikrine daha kolay bağlandığınızı göreceksiniz.',
    ],
    questions: [
      {
        id: 'p1-q1',
        prompt: 'Metinde "regresyon" kavramı neyi ifade etmektedir?',
        options: [
          'Gözün istem dışı olarak önceki kelimelere geri dönmesini',
          'Satır sonlarında kısa süreli mola verilmesini',
          'Metnin yüksek sesle tekrar edilmesini',
          'Bilinmeyen kelimelerin sözlükten aranmasını',
        ],
        correctIndex: 0,
      },
      {
        id: 'p1-q2',
        prompt: 'Ortalama bir okuyucu süresinin yaklaşık ne kadarını geriye dönerek harcar?',
        options: ['Yarısını', 'Altıda birini', 'Yüzde birini', 'Dörtte üçünü'],
        correctIndex: 1,
      },
      {
        id: 'p1-q3',
        prompt: 'Geriye dönüş yapmadan ileri doğru tempo tutturmak ne sağlar?',
        options: [
          'Ana fikre daha kolay bağlanmayı',
          'Kelimeleri unutmayı',
          'Daha sık duraklama yapmayı',
          'Okuma süresini uzatmayı',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    title: 'Görsel Kılavuz Kullanımının Gücü',
    category: '1. Hafta · Temel Kondisyon',
    paragraphs: [
      'İnsan gözü doğası gereği hareket eden nesnelere kilitlenmek üzere evrimleşmiştir. Sabit bir sayfada harfler hareketsiz durduğu için göz, zaman zaman satırlar arasında kayabilir ya da aynı satırı iki kez okuyabilir. Satırın hemen altından akıcı biçimde geçirilen bir kalem ucu veya işaret parmağı, göze takip edeceği net bir hareketli kılavuz sunar.',
      'Bu basit fiziksel destek, gözün geriye sıçrama refleksini büyük ölçüde bastırır. Kılavuzun hızını konfor alanınızın biraz üzerine çıkardığınızda göz kaslarınız da bu yeni tempoya uyum sağlar. Birkaç haftalık pratikten sonra kılavuz olmadan da aynı keskin odaklanma çizgisini koruyabilirsiniz.',
    ],
    questions: [
      {
        id: 'p2-q1',
        prompt: 'Gözün sabit bir sayfada zaman zaman satır kaybetmesinin temel nedeni nedir?',
        options: [
          'Harflerin hareketsiz durması ve gözün hareketli nesnelere kilitlenmeye yatkın olması',
          'Kağıt dokusunun ışığı fazla yansıtması',
          'Paragrafların çok kısa olması',
          'Kelime aralarının gereğinden geniş bırakılması',
        ],
        correctIndex: 0,
      },
      {
        id: 'p2-q2',
        prompt: 'Satır altından geçirilen bir kalem ya da parmak ne işe yarar?',
        options: [
          'Yazıyı gölgeleyerek okuma hızını düşürür',
          'Göze hareketli bir kılavuz sunarak geri sıçramaları azaltır',
          'Kelimeleri tek tek hecelemeyi kolaylaştırır',
          'Sayfa düzenini değiştirir',
        ],
        correctIndex: 1,
      },
      {
        id: 'p2-q3',
        prompt: 'Kılavuzun hızını konfor alanının biraz üzerine çıkarmak neyi tetikler?',
        options: [
          'Göz kaslarının yeni tempoya uyum sağlamasını',
          'Göz kırpma refleksinin durmasını',
          'Metnin tamamen unutulmasını',
          'Okuyucunun geri dönmesini',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    title: 'Odaklanma ve Zihinsel Gürültüyü Azaltmak',
    category: '1. Hafta · Temel Kondisyon',
    paragraphs: [
      'Yavaş okumanın şaşırtıcı yanlarından biri, zihne başka düşünceler üretmesi için gereğinden fazla boş zaman bırakmasıdır. Dakikada yüz elli kelime okuyan bir beyin, kapasitesinin çok küçük bir kısmını kullandığı için geriye kalan enerjiyle gün içindeki işleri, yarım kalan sohbetleri ya da telefon bildirimlerini düşünmeye başlar.',
      'Okuma hızını bilinçli biçimde artırdığınızda beynin işlem kapasitesi metinle tamamen meşgul olur. Zihinsel gezinme alanı daraldığı için dikkatin dağılması zorlaşır. Yani hızlı okuma, sanılanın aksine dikkati dağıtmaz; tam tersine zihni metne kilitleyerek derin odaklanmayı mümkün kılar.',
    ],
    questions: [
      {
        id: 'p3-q1',
        prompt: 'Yavaş okuma sırasında zihnin kolayca dağılmasının nedeni nedir?',
        options: [
          'Beynin boş kalan kapasitesiyle başka düşüncelere yönelmesi',
          'Metinlerin gereğinden fazla bilgi içermesi',
          'Gözlerin çok hızlı hareket etmesi',
          'Okuma ortamının fazla sessiz olması',
        ],
        correctIndex: 0,
      },
      {
        id: 'p3-q2',
        prompt: 'Okuma hızı bilinçli olarak artırıldığında beyinde ne olur?',
        options: [
          'Dikkatin dağılması hızlanır',
          'İşlem kapasitesi metinle dolduğu için odaklanma güçlenir',
          'Zihinsel gezinme alanı genişler',
          'Okuma isteği azalır',
        ],
        correctIndex: 1,
      },
      {
        id: 'p3-q3',
        prompt: 'Metnin savunduğu temel görüş hangisidir?',
        options: [
          'Hızlı okuma, zihni metne kilitleyerek derin odaklanmayı destekler',
          'Yavaş okuma her zaman daha kalıcı öğrenme sağlar',
          'Dakikada yüz elli kelime tüm metinler için idealdir',
          'Bildirimler okuma hızını olumlu etkiler',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    title: 'Metin Yapısını Önceden Tarama (Ön İzleme)',
    category: '2. Hafta · Blok Okuma & Ritim',
    paragraphs: [
      'Bilmediğiniz bir şehre girmeden önce haritaya kısaca göz atmak, sokaklarda kaybolma ihtimalinizi azaltır. Uzun bir makale ya da kitap bölümüne başlamadan önce yapılan otuz saniyelik ön izleme de zihin için aynı harita görevini görür. Başlıkları, alt başlıkları ve ilk cümleleri taramak beyne bir iskelet sunar.',
      'Beyin metnin nereye varacağını önceden sezdiğinde, okuma sırasında karşılaştığı detayları bu zihinsel rafa çok daha hızlı yerleştirir. Ön izleme yapmak zaman kaybı değil, aksine asıl okuma süresini kısaltan ve hatırlama oranını yükselten stratejik bir yatırımdır.',
    ],
    questions: [
      {
        id: 'p4-q1',
        prompt: 'Okuma öncesi yapılan ön izleme metinde neye benzetilmiştir?',
        options: [
          'Bilmediğimiz bir şehre girmeden önce haritaya göz atmaya',
          'Uzun bir koşudan sonra dinlenmeye',
          'Yeni bir enstrümanı akort etmeye',
          'Karanlıkta yol tabelası okumaya',
        ],
        correctIndex: 0,
      },
      {
        id: 'p4-q2',
        prompt: 'Ön izleme sırasında öncelikle nelere bakılması önerilir?',
        options: [
          'Yalnızca sayfa numaralarına',
          'Başlıklara, alt başlıklara ve ilk cümlelere',
          'Metindeki tüm bağlaçlara',
          'Sadece en son paragrafa',
        ],
        correctIndex: 1,
      },
      {
        id: 'p4-q3',
        prompt: 'Ön izlemenin okuyucuya sağladığı temel fayda nedir?',
        options: [
          'Detayların zihinsel iskelete daha hızlı yerleşmesi ve hatırlamanın artması',
          'Metnin sonunu hiç okumadan tahmin etmeyi sağlaması',
          'Kelime sayısını yarıya indirmesi',
          'Göz egzersizlerine gerek bırakmaması',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    title: 'Anahtar Kelimeleri Yakalamak',
    category: '2. Hafta · Blok Okuma & Ritim',
    paragraphs: [
      'Her cümledeki tüm sözcükler aynı bilgi ağırlığına sahip değildir. İsimler, eylemler ve sayısal veriler cümlenin taşıyıcı kolonlarını oluştururken; bağlaçlar ve pekiştirme ifadeleri yalnızca bu kolonları birbirine bağlayan harç gibidir. Deneyimli bir okuyucu bu taşıyıcı kelimeleri anında ayırt eder.',
      'Gözünüzü cümledeki anlam yüklü kelimelere odakladığınızda, aradaki bağlayıcı sözcükleri çevresel görüşünüz zaten otomatik olarak tamamlar. Bu seçici dikkat yaklaşımı, özellikle yoğun iş raporları ve akademik makaleler okurken büyük bir zaman avantajı yaratır.',
    ],
    questions: [
      {
        id: 'p5-q1',
        prompt: 'Cümlenin "taşıyıcı kolonları" olarak tanımlanan kelimeler hangileridir?',
        options: [
          'Yalnızca bağlaçlar',
          'İsimler, eylemler ve sayısal veriler',
          'Noktalama işaretleri',
          'Ünlem ve soru ekleri',
        ],
        correctIndex: 1,
      },
      {
        id: 'p5-q2',
        prompt: 'Anlam yüklü kelimelere odaklanırken bağlayıcı sözcüklere ne olur?',
        options: [
          'Çevresel görüş tarafından otomatik olarak tamamlanır',
          'Tamamen görmezden gelinir ve cümle bozulur',
          'Yüksek sesle tekrar edilir',
          'Not defterine tek tek yazılır',
        ],
        correctIndex: 0,
      },
      {
        id: 'p5-q3',
        prompt: 'Bu yaklaşım özellikle hangi tür metinlerde zaman avantajı sağlar?',
        options: [
          'Kısa şiirlerde',
          'Yoğun iş raporları ve akademik makalelerde',
          'Yalnızca çizgi romanlarda',
          'Alışveriş listelerinde',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    title: 'Satır Başları ve Sonlarında Enerji Tasarrufu',
    category: '2. Hafta · Blok Okuma & Ritim',
    paragraphs: [
      'Okuyucuların büyük çoğunluğu satırın en ilk harfinden başlayıp en son noktasına kadar gözünü sürükler. Oysa satırın sol ve sağ kenarlarında zaten boşluklar vardır ve bu bölgelerde anlamın yarısı kadar bilgi bile bulunmaz. Gözü kenar boşluklarına kadar götürmek gereksiz mesafe katetmek demektir.',
      'Satırın yaklaşık bir santimetre içerisinden başlayıp bitişten bir santimetre önce bir sonraki satıra geçmek, gözün katettiği toplam yolu yüzde yirmiye kadar azaltır. Çevresel görüşünüz ilk ve son kelimeleri rahatlıkla yakalayacağı için tek bir anlam kaybı yaşamazsınız.',
    ],
    questions: [
      {
        id: 'p6-q1',
        prompt: 'Satırın en başından en sonuna kadar gitmek neden verimsizdir?',
        options: [
          'Kenar bölgelere kadar gereksiz göz mesafesi katettiği için',
          'Sayfa numaralarını karıştırdığı için',
          'Satırların ortasını okumayı engellediği için',
          'Yazı tipini küçülttüğü için',
        ],
        correctIndex: 0,
      },
      {
        id: 'p6-q2',
        prompt: 'İçeriden başlayıp erken bitirme tekniği gözün katettiği yolu yaklaşık ne kadar azaltır?',
        options: ['Yüzde 2', 'Yüzde 20', 'Yüzde 75', 'Yüzde 90'],
        correctIndex: 1,
      },
      {
        id: 'p6-q3',
        prompt: 'İlk ve son kelimeler bu teknikte nasıl algılanır?',
        options: [
          'Çevresel görüş yardımıyla rahatlıkla yakalanır',
          'Sonradan geri dönüp okunur',
          'Tahmin edilerek atlanır',
          'Parmakla işaretlenir',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    title: 'Esnek Okuma Hızı ve Metin Türleri',
    category: '3. Hafta · Odak & Hızlı Tarama',
    paragraphs: [
      'Hızlı okuma, her metni tek bir sabit viteste okumak demek değildir. Nasıl ki bir sürücü otobanda farklı, şehir içi virajlı yollarda farklı bir hız seçerse; usta bir okuyucu da metnin zorluğuna ve amacına göre hızını ayarlar. Bir gazete haberi ile hukuki bir sözleşme aynı tempoda okunmaz.',
      'Bilgi tazelemek veya genel fikir edinmek için yüksek vitese geçebilir, derin felsefi bir tartışmayı ya da teknik bir formülü incelerken hızınızı bilinçli olarak düşürebilirsiniz. Gerçek ustalık, ihtiyaç duyduğunuz her an hızlanıp yavaşlayabilme esnekliğine sahip olmaktır.',
    ],
    questions: [
      {
        id: 'p7-q1',
        prompt: 'Metinde usta bir okuyucu neye benzetilmiştir?',
        options: [
          'Yola göre hızını ayarlayan bir sürücüye',
          'Her zaman aynı notayı çalan bir piyaniste',
          'Sadece düz yolda koşan bir atlete',
          'Kısa mesafeye bakan bir fotoğrafçıya',
        ],
        correctIndex: 0,
      },
      {
        id: 'p7-q2',
        prompt: 'Hangi durumda okuma hızının bilinçli olarak düşürülmesi önerilir?',
        options: [
          'Genel bir haber taraması yaparken',
          'Derin felsefi bir tartışma veya teknik formül incelerken',
          'İçindekiler sayfasına göz atarken',
          'Bilinen bir konuyu tekrar ederken',
        ],
        correctIndex: 1,
      },
      {
        id: 'p7-q3',
        prompt: 'Yazarın "gerçek ustalık" olarak tanımladığı beceri nedir?',
        options: [
          'İhtiyaca göre hızlanıp yavaşlayabilme esnekliği',
          'Tüm kitapları aynı yüksek hızda bitirmek',
          'Sadece tek kelimelik başlıkları okumak',
          'Hiç duraklama yapmadan sayfa çevirmek',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    title: 'Dikey Tarama ve Sütun Disiplini',
    category: '3. Hafta · Odak & Hızlı Tarama',
    paragraphs: [
      'Gazetelerin ve dergilerin dar sütunlar halinde basılmasının önemli bir nedeni vardır: Dar sütunlarda göz sağa sola savrulmak yerine neredeyse dikey bir çizgi üzerinde aşağı doğru iner. Bu durum okuyucunun tek bir bakışta tüm satırı kavramasını ve çok daha yüksek hızlara çıkmasını kolaylaştırır.',
      'Geniş sayfalarda okurken de satırı hayali olarak iki dikey sütuna bölmek aynı konforu yaratır. Sol yarıya tek bir sabitleme, sağ yarıya tek bir sabitleme yaparak aşağı inmek, gözün yorucu zikzaklarını düzenli bir merdiven inişine dönüştürür.',
    ],
    questions: [
      {
        id: 'p8-q1',
        prompt: 'Gazetelerin dar sütunlar halinde basılması okumayı nasıl kolaylaştırır?',
        options: [
          'Gözün dikey bir çizgi üzerinde inmesini sağlayarak tek bakışta satırı kavratır',
          'Yazıların daha küçük görünmesini sağlar',
          'Okuyucuyu satır atlamaya zorlar',
          'Mürekkepten tasarruf edilmesini sağlar',
        ],
        correctIndex: 0,
      },
      {
        id: 'p8-q2',
        prompt: 'Geniş sayfalarda benzer bir konfor yakalamak için ne önerilmektedir?',
        options: [
          'Sayfayı katlayıp yalnızca yarısını okumak',
          'Satırı hayali olarak iki dikey sütuna bölüp iki sabitlemeyle inmek',
          'Sayfayı yan çevirerek okumak',
          'Her kelimede dikey çizgi çizmek',
        ],
        correctIndex: 1,
      },
      {
        id: 'p8-q3',
        prompt: 'İki sabitlemeli dikey iniş tekniği neyi değiştirir?',
        options: [
          'Yorucu zikzakları düzenli bir inişe dönüştürür',
          'Okuma süresini uzatır',
          'Kelime sayısını artırır',
          'İç seslendirmeyi mecburi kılar',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    title: 'Kavrama ve Hafıza Bağlantısı',
    category: '4. Hafta · Ustalık & Yüksek Anlama',
    paragraphs: [
      'Okuma hızı arttıkça anlamanın düşeceğine dair yaygın bir ön yargı vardır. Oysa bilişsel psikoloji deneyleri, belirli bir eşiğe kadar artan hızın anlamayı iyileştirdiğini kanıtlamaktadır. Çünkü beyin parçalı ve kopuk kelimeler yerine anlamlı bütünlerle beslendiğinde bağlantıları daha kolay kurar.',
      'Bir filmi saniyede bir kare hızıyla izlediğinizde hikayeyi anlamakta zorlanırsınız; ancak akıcı kare hızına ulaştığınızda sahneler canlanır. Kelime bloklarıyla hızlı okuma da zihindeki sahneyi kesintisiz bir akışa dönüştürerek bilginin uzun süreli belleğe geçişini kolaylaştırır.',
    ],
    questions: [
      {
        id: 'p9-q1',
        prompt: 'Bilişsel psikoloji deneyleri hız ve anlama ilişkisi hakkında ne göstermektedir?',
        options: [
          'Belirli bir eşiğe kadar artan hızın anlamayı iyileştirdiğini',
          'Hız arttıkça anlamanın her zaman sıfıra düştüğünü',
          'Yavaş okumanın uzun süreli belleği sildiğini',
          'Hız ile anlama arasında hiçbir ilişki olmadığını',
        ],
        correctIndex: 0,
      },
      {
        id: 'p9-q2',
        prompt: 'Metinde yavaş ve parçalı okuma neye benzetilmiştir?',
        options: [
          'Bir filmi saniyede bir kare hızıyla izlemeye',
          'Sessiz bir kütüphanede müzik dinlemeye',
          'Kalın bir sözlüğü baştan sona ezberlemeye',
          'Büyük harflerle mektup yazmaya',
        ],
        correctIndex: 0,
      },
      {
        id: 'p9-q3',
        prompt: 'Akıcı okuma uzun süreli belleği nasıl etkiler?',
        options: [
          'Anlamlı bütünler oluşturarak bilginin belleğe geçişini kolaylaştırır',
          'Yalnızca kısa süreli belleği yorar',
          'Sayısal verilerin unutulmasına neden olur',
          'Detayları tamamen yok eder',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    title: 'Sürdürülebilir Okuma Alışkanlığı',
    category: '4. Hafta · Ustalık & Yüksek Anlama',
    paragraphs: [
      'Otuz günlük bir programın kazandırdığı en değerli armağan, tek seferlik bir hız rekoru değil, yaşam boyu sürecek yeni bir okuma refleksidir. Doğru duruş, yeterli aydınlatma ve düzenli göz dinlendirme molaları bu refleksin kalıcı olmasını sağlayan temel yapı taşlarıdır.',
      'Her gün yalnızca on beş dakikanızı bilinçli blok okuma pratiğine ayırdığınızda, yılda onlarca ekstra kitabı aynı rahatlıkla bitirebilirsiniz. Bilgi çağında en kıymetli sermayemiz olan zamanı geri kazanmanın en zarif yolu, okuma verimliliğimizi sürekli canlı tutmaktır.',
    ],
    questions: [
      {
        id: 'p10-q1',
        prompt: 'Yazar otuz günlük programın en değerli armağanını ne olarak görüyor?',
        options: [
          'Yaşam boyu sürecek yeni bir okuma refleksi',
          'Sadece tek seferlik bir rekor puanı',
          'Gözlüksüz okuyabilme garantisi',
          'Ezbere kelime sayma becerisi',
        ],
        correctIndex: 0,
      },
      {
        id: 'p10-q2',
        prompt: 'Yeni okuma refleksinin kalıcı olması için hangi unsurlar vurgulanmıştır?',
        options: [
          'Doğru duruş, yeterli aydınlatma ve göz dinlendirme molaları',
          'Karanlık ortam ve kesintisiz üç saat okuma',
          'Yüksek sesle ve ayakta okuma',
          'Sadece dijital cihazlardan okuma',
        ],
        correctIndex: 0,
      },
      {
        id: 'p10-q3',
        prompt: 'Günde on beş dakikalık bilinçli pratik uzun vadede ne kazandırır?',
        options: [
          'Yılda onlarca ekstra kitabı rahatlıkla bitirebilmeyi',
          'Kitaplara olan ilginin azalmasını',
          'Yazma hızının yavaşlamasını',
          'Sadece kısa notlar almayı',
        ],
        correctIndex: 0,
      },
    ],
  },
];

const DAY_TITLES: Array<{ title: string; subtitle: string }> = [
  { title: 'Göz Kaslarını Isıtma ve İlk Adım', subtitle: 'Yatay-dikey odak kontrolü ve 3x3 Schulte başlangıcı' },
  { title: 'İç Sesi Susturma ve Odak Genişletme', subtitle: '4x4 Schulte tablosu ile çevresel algı hızlandırma' },
  { title: 'Görüş Alanını Genişletme ve Blok Okuma', subtitle: '4x4 Schulte merkez odaklı tarama ve akıcı kavrama' },
  { title: 'Geri Dönüş Refleksini Durdurma', subtitle: 'İleri yönlü kararlı göz sıçramaları' },
  { title: 'Görsel Kılavuz ile Ritim Tutma', subtitle: 'Akıcı satır takibi ve tempo dengesi' },
  { title: 'Zihinsel Gürültüyü Azaltma', subtitle: 'Yüksek odaklanma ve kesintisiz akış' },
  { title: '1. Hafta Değerlendirme ve Pekiştirme', subtitle: 'İlk haftanın tüm tekniklerini birleştirme' },
  { title: 'Metin Ön İzleme Stratejisi', subtitle: 'Başlık ve iskelet taramasıyla hızlı giriş' },
  { title: 'Anahtar Kelime Avcılığı', subtitle: 'Taşıyıcı kavramları anında seçme' },
  { title: 'Satır Kenarlarında Enerji Tasarrufu', subtitle: 'İçeriden başla, erken bitir tekniği' },
  { title: 'İkili Kelime Blokları', subtitle: 'Tek sabitlemede çift kelime kavrama' },
  { title: 'Üçlü Kelime Gruplarına Geçiş', subtitle: 'Geniş görüş penceresi antrenmanı' },
  { title: 'Noktalama İşaretleriyle Ritim', subtitle: 'Doğal durak noktalarını hızla okuma' },
  { title: '2. Hafta Hız ve Anlama Sentezi', subtitle: 'Blok okuma ile kavrama derinliğini koruma' },
  { title: 'Esnek Vites Değiştirme', subtitle: 'Metin zorluğuna göre tempo ayarlama' },
  { title: 'Dikey Sütun Tarama Tekniği', subtitle: 'Sağa-sola savrulmadan aşağı akış' },
  { title: 'İki Sabitlemeli Geniş Satır', subtitle: 'Sayfayı hayali iki sütunda okuma' },
  { title: 'Çevresel Algı Sınırlarını Zorlama', subtitle: 'Genişletilmiş 4x4 yüksek hız Schulte' },
  { title: '5x5 Schulte ile Periferik Ustalık', subtitle: 'Geniş matris üzerinde merkez odak' },
  { title: 'Sayısal ve Teknik Metin Okuma', subtitle: 'Veri yoğun paragraflarda net kavrama' },
  { title: '3. Hafta Yoğun Odak Testi', subtitle: 'Dikkat dağıtıcılar olmadan tam performans' },
  { title: 'Kavrama ve Uzun Süreli Bellek', subtitle: 'Hızlı okunan bilgiyi zihinde tutma' },
  { title: 'Paragraf Başını ve Sonunu Okuma', subtitle: 'Ana fikir çıkarımında yüksek hız' },
  { title: 'Zihinsel Görselleştirme Gücü', subtitle: 'Okunanları ses yerine imgeye dönüştürme' },
  { title: 'Uzun Metinlerde Dayanıklılık', subtitle: 'Göz yorgunluğu olmadan tempo koruma' },
  { title: 'Çapraz Göz Koordinasyonu', subtitle: 'Diyagonal ve çok yönlü takip pratiği' },
  { title: 'Seçici Tarama (Skimming & Scanning)', subtitle: 'Aranan bilgiyi saniyeler içinde bulma' },
  { title: 'Akıcı Okuma Refleksi', subtitle: 'Bilinçli çaba olmadan blok kavrama' },
  { title: 'Final Öncesi Yüksek Tempo Provası', subtitle: 'Maksimum hızda yüksek anlama dengesi' },
  { title: '30. Gün Mezuniyet ve Final Ölçümü', subtitle: 'Tüm akademi kazanımlarını taçlandırma' },
];

export const TRAINING_DAYS: DayCurriculum[] = Array.from({ length: 30 }, (_, index) => {
  const dayNumber = index + 1;
  const bespoke = BESPOKE_DAYS.find((d) => d.dayNumber === dayNumber);
  if (bespoke) {
    return bespoke;
  }

  const richDay =
    DAYS_4_TO_17.find((d) => d.dayNumber === dayNumber) ??
    DAYS_18_TO_30.find((d) => d.dayNumber === dayNumber);
  if (richDay) {
    return richDay;
  }

  const weekNumber = Math.ceil(dayNumber / 7);
  const clampedWeek = Math.min(4, weekNumber);
  const meta = DAY_TITLES[index];
  const passageSeed = CURATED_PASSAGES[(dayNumber - 4) % CURATED_PASSAGES.length];

  const eyePattern: DayCurriculum['eyePattern'] =
    dayNumber <= 10 ? 'horizontal-vertical' : dayNumber <= 20 ? 'diagonal' : 'figure-eight';

  const schulteSize: DayCurriculum['schulteSize'] =
    dayNumber === 1 ? 3 : dayNumber <= 18 ? 4 : 5;

  return {
    dayNumber,
    weekNumber: clampedWeek,
    title: meta.title,
    subtitle: meta.subtitle,
    eyeDurationSec: 30,
    eyePattern,
    schulteSize,
    reading: {
      title: passageSeed.title,
      category: `${clampedWeek}. Hafta · Günlük Okuma`,
      paragraphs: passageSeed.paragraphs,
      questions: passageSeed.questions.map((q, qIdx) => ({
        ...q,
        id: `d${dayNumber}-q${qIdx + 1}`,
      })),
    },
  };
});

export function getDayCurriculum(dayNumber: number): DayCurriculum {
  if (dayNumber === 0) return CHECKUP_DAY;
  return TRAINING_DAYS[dayNumber - 1] ?? TRAINING_DAYS[0];
}
