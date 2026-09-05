export interface Article {
  id: string;
  title: string;
  slug?: string;
  category: string;
  categorySlug?: string;
  author?: string;
  authorRole?: string;
  authorImage?: string;
  time: string;
  date?: string;
  source?: string;
  image?: string;
  caption?: string;
  summary?: string;
  content?: string;
  views?: string;
  commentsCount?: number;
  location?: string;
}

export interface StockItem {
  name: string;
  symbol: string;
  price: string;
  changePercent: string;
  changePoint: string;
  isUp: boolean;
}

export interface Opinion {
  id: string;
  title: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  source: string;
  summary: string;
}

export interface VideoNews {
  id: string;
  title: string;
  duration: string;
  views: string;
  source: string;
  thumbnail: string;
}

export interface StoryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  author: string;
  authorAvatar?: string;
  views?: string;
  duration?: string;
  articleId?: string;
}

export interface PollOption {
  id: string;
  label: string;
  count: number;
  percent: number;
}

export interface PollData {
  id: string;
  question: string;
  totalVotes: number;
  options: PollOption[];
}

export const SUNSTAR_DATA = {
  sourceInfo: {
    name: "सनस्टार न्युज",
    englishName: "Sunstar News",
    url: "https://sunstarnews.com/",
    tagline: "पोखराबाट सञ्चालित सत्य, तथ्य र निष्पक्ष डिजिटल समाचार प्लेटफर्म",
  },

  trendingStocks: [
    {
      name: "Bhagawati Hydro...",
      symbol: "BGWT",
      price: "477.00",
      changePercent: "-1.65%",
      changePoint: "-8.00",
      isUp: false,
    },
    {
      name: "Manakamana En...",
      symbol: "MEHL",
      price: "227.00",
      changePercent: "-1.30%",
      changePoint: "-3.00",
      isUp: false,
    },
    {
      name: "Kutheli Bukhari S...",
      symbol: "KBSH",
      price: "802.00",
      changePercent: "+1.39%",
      changePoint: "+11.00",
      isUp: true,
    },
    {
      name: "Sanima Middle T...",
      symbol: "TAMOR",
      price: "503.00",
      changePercent: "-0.20%",
      changePoint: "-1.00",
      isUp: false,
    },
    {
      name: "Super Madi Hydr...",
      symbol: "SMHL",
      price: "527.00",
      changePercent: "-2.04%",
      changePoint: "-11.00",
      isUp: false,
    },
  ] as StockItem[],

  breakingNews: [
    "भासिएको ७ दिनपछि कृष्णभीरमा खुल्यो डाइभर्सन ट्र्याक, ग्राभेल गरेर सवारीसाधन चलाइने [सनस्टार न्युज]",
    "भोटेकोशी विपत्तिको एघारौं दिन: बेत्रावती र त्रिशूली-३ 'ए' सुरुङबाट दुई जनाको जीवितै उद्धार [सनस्टार न्युज]",
    "पोखराबाट ‘सनस्टार न्युज’को औपचारिक शुभारम्भ, विष्णुहरि भुगाई र विष्णु पुनद्वारा डिजिटल पत्रकारितामा नयाँ पहल [सनस्टार न्युज]",
    "स्वच्छ ऊर्जाका नाममा मूल्य चुकाउँदै अरुण उपत्यकाका आदिवासीहरू [सनस्टार न्युज]",
    "मिस वर्ल्ड २०२६: भियतनाममा नेपालको प्रतिनिधित्व गर्दै लुना लुइँटेल उत्कृष्ट प्रस्तुतिका साथ अघि बढ्दै [सनस्टार न्युज]",
    "नेप्से परिसूचक २५९४ अंकमा, निर्जीवन बीमा र जलविद्युत् क्षेत्रमा लगानीकर्ताको उच्च चासो [सनस्टार न्युज]",
  ],

  nepseTicker: {
    index: "2,594.18",
    change: "+14.32",
    percent: "+0.56%",
    turnover: "रु ४.६५ अर्ब",
    goldPrice: "रु १,५४,२०० / तोला",
    forexUSD: "रु १३५.१०",
  },

  weather: {
    city: "पोखरा / काठमाडौँ",
    temp: "२४.१२°C",
    condition: "सफा / सुहाउँदो मौसम",
    aqi: "५२ (मध्यम)",
  },

  rashifalDate: "१५ भाद्र २०८३ (आजको दैनिक राशिफल)",
  rashifal: [
    {
      id: "mesh",
      sign: "मेष",
      latinName: "Aries",
      symbol: "♈",
      dateRange: "चैत १५ - वैशाख १५",
      luckyColor: "रातो",
      luckyNumber: "९",
      prediction: "आज आम्दानीका नयाँ स्रोतहरू पहिल्याउन सकिनेछ। व्यापार व्यवसायमा लगानी बढाउने अनुकूल समय छ। प्रतिस्पर्धीहरूलाई पछि पार्दै सफलता हात पार्नुहुनेछ।"
    },
    {
      id: "vrish",
      sign: "वृष",
      latinName: "Taurus",
      symbol: "♉",
      dateRange: "वैशाख १६ - जेठ १५",
      luckyColor: "सेतो",
      luckyNumber: "६",
      prediction: "सामाजिक कार्यमा सक्रिय सहभागी भइनेछ। रोकिएका पुराना कामहरू पुन: सुरु हुनेछन्। परिवार तथा इष्टमित्रबाट पूर्ण सहयोग र सद्भाव प्राप्त हुनेछ।"
    },
    {
      id: "mithun",
      sign: "मिथुन",
      latinName: "Gemini",
      symbol: "♊",
      dateRange: "जेठ १६ - असार १५",
      luckyColor: "हरियो",
      luckyNumber: "५",
      prediction: "बौद्धिक क्षमता र कार्यकुशलताको चौतर्फी प्रशंसा हुनेछ। अध्ययन तथा रचनात्मक काममा प्रगति हुनेछ। आर्थिक स्थिति सबल बन्दै जानेछ।"
    },
    {
      id: "karkat",
      sign: "कर्कट",
      latinName: "Cancer",
      symbol: "♋",
      dateRange: "असार १६ - साउन १५",
      luckyColor: "गुलाबी",
      luckyNumber: "२",
      prediction: "पारिवारिक सम्बन्धमा मधुरता छाउनेछ। मनोरञ्जनात्मक यात्राको योग छ। नयाँ योजनाहरू कार्यान्वयन गर्न अग्रसर हुनु सकारात्मक रहनेछ।"
    },
    {
      id: "simha",
      sign: "सिंह",
      latinName: "Leo",
      symbol: "♌",
      dateRange: "साउन १६ - भदौ १५",
      luckyColor: "पहेंलो",
      luckyNumber: "१",
      prediction: "कार्यक्षेत्रमा नेतृत्वदायी भूमिका पाइनेछ। आत्मबल र पराक्रममा वृद्धि हुनेछ। उच्च पदस्थ व्यक्तित्वहरूसँग फलदायी भेटघाट हुनेछ।"
    },
    {
      id: "kanya",
      sign: "कन्या",
      latinName: "Virgo",
      symbol: "♍",
      dateRange: "भदौ १६ - असोज १५",
      luckyColor: "हरियो",
      luckyNumber: "५",
      prediction: "लगनशीलताका साथ गरिएको मिहिनेतले फल दिनेछ। काममा ध्यान केन्द्रित हुनाले सोचेभन्दा राम्रो परिणाम आउनेछ। स्वास्थ अनुकूल रहनेछ।"
    },
    {
      id: "tula",
      sign: "तुला",
      latinName: "Libra",
      symbol: "♎",
      dateRange: "असोज १६ - कात्तिक १५",
      luckyColor: "सेतो",
      luckyNumber: "६",
      prediction: "कला, साहित्य र मनोरञ्जन क्षेत्रमा चासो बढ्नेछ। शुभचिन्तकहरूको सहयोगले अड्किएका काम बन्नेछन्। वित्तीय क्षेत्रमा लाभ मिल्नेछ।"
    },
    {
      id: "vrischik",
      sign: "वृश्चिक",
      latinName: "Scorpio",
      symbol: "♏",
      dateRange: "कात्तिक १६ - मंसीर १५",
      luckyColor: "रातो",
      luckyNumber: "९",
      prediction: "आँट र साहसका साथ अघि बढ्दा लक्ष्य हासिल हुनेछ। कार्यस्थलमा नयाँ जिम्मेवारी प्राप्त हुन सक्छ। आर्थिक कारोबारमा सफलता।"
    },
    {
      id: "dhanu",
      sign: "धनु",
      latinName: "Sagittarius",
      symbol: "♐",
      dateRange: "मंसीर १६ - पुस १५",
      luckyColor: "पहेंलो",
      luckyNumber: "३",
      prediction: "अध्ययन तथा अनुसन्धानमा रुचि बढ्नेछ। धार्मिक र सांस्कृतिक कार्यक्रममा सहभागी हुने अवसर। दूरदराजका मित्रहरूसँग कुराकानी।"
    },
    {
      id: "makar",
      sign: "मकर",
      latinName: "Capricorn",
      symbol: "♑",
      dateRange: "पुस १६ - माघ १५",
      luckyColor: "नीलो",
      luckyNumber: "८",
      prediction: "धैर्यता र संयमतापूर्वक कार्य गर्दा फाइदा हुनेछ। रोकिएका पुराना कामहरू सुचारु हुनेछन्। व्यवसायमा नयाँ ग्राहक थपिनेछन्।"
    },
    {
      id: "kumbha",
      sign: "कुम्भ",
      latinName: "Aquarius",
      symbol: "♒",
      dateRange: "माघ १६ - फागुन १५",
      luckyColor: "नीलो",
      luckyNumber: "८",
      prediction: "साथीभाइ र सहकर्मीहरूको पूर्ण सहयोग मिल्नेछ। नयाँ व्यावसायिक साझेदारीका लागि राम्रो समय छ। पारिवारिक वातावरण रमाइलो रहनेछ।"
    },
    {
      id: "meen",
      sign: "मीन",
      latinName: "Pisces",
      symbol: "♓",
      dateRange: "फागुन १६ - चैत १४",
      luckyColor: "पहेंलो",
      luckyNumber: "३",
      prediction: "अध्यात्म र परोपकारमा मन जानेछ। इष्टमित्र तथा आफन्तबाट शुभ समाचार सुन्न पाइनेछ। आकस्मिक लाभको योग रहेको छ।"
    }
  ],

  poll: {
    id: "poll-ok-2083-05-20",
    question:
      "विपत्तिको दसौं दिन त्रिशूली ३-ए को सुरूङभित्र फसेका नागरिकको उद्धार सफल भयो। यो खबरमा तपाईंको मत के छ?",
    totalVotes: 24890,
    options: [
      {
        id: "miracle",
        label: "चमत्कारभन्दा हुन्छ",
        count: 5100,
        percent: 21,
      },
      {
        id: "gov-effort",
        label: "सरकारी प्रयास र सुरक्षा निकायको परिणाम",
        count: 8560,
        percent: 34,
      },
      {
        id: "more-rescue",
        label: "थप अरूको पनि शीघ्र उद्धार होस्",
        count: 10830,
        percent: 44,
      },
      {
        id: "neutral",
        label: "केही भन्न चाहन्नँ",
        count: 400,
        percent: 1,
      },
    ],
  } as PollData,

  featuredLead: {
    id: "lead-krishnabhir-track",
    title:
      "भासिएको ७ दिनपछि कृष्णभीरमा खुल्यो डाइभर्सन ट्र्याक, ग्राभेल गरेर सवारीसाधन चलाइने",
    slug: "krishnabhir-landslide-diversion-track-opens",
    category: "अर्थ / राजमार्ग",
    categorySlug: "business",
    author: "सनस्टार समाचार डेस्क",
    authorRole: "धादिङ/काठमाडौँ ब्यूरो (Sunstar News)",
    authorImage: "/assets/sunstar-logo.jpg",
    time: "भर्खरै (३ मिनेट पाठ)",
    date: "२० भाद्र २०८३",
    source: "SunstarNews.com",
    image:
      "https://assets-cdn.ekantipur.com/uploads/source/news/kantipur/2026/miscellaneous/krishna-bhir-0592026123446-1000x0.jpg",
    caption:
      "कृष्णभीरमा भित्तो काटेर बनाइएको वैकल्पिक डाइभर्सन ट्र्याक। तस्बिर: सनस्टार न्युज",
    summary:
      "भासिएको सडकभन्दा करिब १५ मिटर माथि भित्तो काटेर वैकल्पिक ट्र्याक निर्माण गरिएको छ। ग्राभेल गरेर साना तथा अत्यावश्यक सवारीसाधन सञ्चालनमा ल्याइने सडक विभागले जनाएको छ।",
    content: `
      <p><strong>धादिङ (सनस्टार न्युज) —</strong> पृथ्वी राजमार्गअन्तर्गत धादिङको कृष्णभीरमा सडक भासिएको सात दिनपछि वैकल्पिक डाइभर्सन ट्र्याक निर्माण सम्पन्न भई सञ्चालनको तयारी गरिएको छ।</p>
      
      <p>सडक विभागका इन्जिनियरहरूका अनुसार मुख्य सडकभन्दा करिब १५ मिटर माथि पहाडको भित्तो काटेर नयाँ ट्र्याक तयार पारिएको हो। निरन्तरको वर्षा र पहिरोका कारण अवरुद्ध बनेको राजमार्गमा ट्र्याक खुलेसँगै काठमाडौँ उपत्यका जोड्ने अत्यावश्यक आपूर्ति व्यवस्था सहज हुने अपेक्षा गरिएको छ।</p>

      <blockquote style="border-left: 4px solid var(--brand-orange); padding-left: 16px; margin: 20px 0; font-style: italic; color: var(--brand-blue); font-weight: 600;">
        "कृष्णभीरमा वैकल्पिक ट्र्याकमा ग्राभेल गरी एकतर्फी सवारी सञ्चालन गराउने काम तीव्र पारिएको छ। सुरक्षा संवेदनशीलतालाई ध्यानमा राख्दै ठूला मालवाहक गाडीलाई भने आलोपालो छाडिनेछ।" — सडक विभाग
      </blockquote>

      <p>कृष्णभीर पहिरोका कारण काठमाडौँमा खानाका पकाउने एलपी ग्यास र खाद्यान्न आपूर्तिमा परेको प्रभावलाई ध्यानमा राख्दै सुरक्षा निकाय र निर्माण टोलीले २४ सै घण्टा खटिएर काम पूरा गरेका हुन्।</p>
    `,
    views: "२,१८,५००",
    commentsCount: 142,
  } as Article,

  topSecondaryLeads: [
    {
      id: "lead-bhotekoshi-rescue",
      title:
        "भोटेकोशी विपत्तिको एघारौं दिन: बेत्रावती र त्रिशूली-३ 'ए' सुरुङबाट दुई जनाको जीवितै उद्धार",
      category: "मुख्य समाचार / विपद्",
      categorySlug: "news",
      time: "१० मिनेट अघि",
      source: "SunstarNews.com",
      image:
        "https://assets-cdn.ekantipur.com/uploads/source/news/kantipur/2026/third-party/790317778101646252357973988083052071006119614n-0592026113316-1000x0.jpg",
      summary:
        "भोटेकोशी विपत्तिको ११ औँ दिनमा पनि बेत्रावतीबाट एक महिला र त्रिशूली-३ 'ए' को सुरुङभित्र फसेका १ जनाको जीवितै उद्धार। सैनिक अस्पताल छाउनीमा उपचार जारी।",
      content: `<p>भोटेकोशी बाढी र पहिरोको ११ औँ दिनमा बेत्रावती क्षेत्रबाट उद्धार गरिएकी महिलाको नेपाली सेनाको छाउनी अस्पतालमा उपचार भइरहेको छ। उद्धार टोलीले त्रिशूली ३-ए आयोजनाको सुरुङबाट समेत १ जनालाई जीवितै बाहिर निकालेको छ।</p>`,
    },
    {
      id: "lead-arun-indigenous",
      title:
        "स्वच्छ ऊर्जाका नाममा मूल्य चुकाउँदै अरुण उपत्यकाका आदिवासीहरू",
      category: "पर्यावरण / फिचर",
      categorySlug: "feature",
      time: "३२ मिनेट अघि",
      source: "SunstarNews.com",
      image:
        "https://assets-cdn.ekantipur.com/uploads/source/news/kantipur/2026/miscellaneous/uchhenthe-prayer4-0192026123954-1000x0.jpg",
      summary:
        "जलविद्युत्का लागि अर्बौं डलरको लगानी खन्याइँदै छ। तर स्थानीय बासिन्दा भन्छन्, उनीहरूकै भूमिमा बनाउने भनिएको परियोजनाबारे वास्तविक रूपमा उनीहरूलाई कहिल्यै सोधिएकै छैन।",
      content: `<p>अरुण उपत्यकामा ठूला जलविद्युत् आयोजना निर्माण भइरहँदा स्थानीय भोटे र राई समुदायका आदिवासीहरूले आफ्नो पुर्ख्यौली भूमिसँगको सम्बन्ध र वातावरणीय असरबारे चिन्ता व्यक्त गरेका छन्।</p>`,
    },
    {
      id: "lead-ai-flood-portal",
      title:
        "बाढीमा हराएको सूचना खोजिरहेका निरज: एआई प्रविधिको प्रयोग गरी एकीकृत विपद् पोर्टल",
      category: "विज्ञान र प्रविधि",
      categorySlug: "technology",
      time: "३५ मिनेट अघि",
      source: "SunstarNews.com",
      image:
        "https://assets-cdn.ekantipur.com/uploads/source/news/kantipur/2026/science-technology/telecom-1-0392026020428-1000x0.jpg",
      summary:
        "निरज भुसालले रातभर खटेर क्षतिको तथ्याङ्क, बेपत्ताको सूची र सरकारी राहतसम्बन्धी एकीकृत सूचना दिने एआई पोर्टल निर्माण गरेका छन्।",
      content: `<p>अर्थ मन्त्रालयमा कार्यरत युवा प्रविधि अध्येता निरज भुसालले एआई र गिटहब प्रविधिको सहायताले विपद् प्रभावित परिवारका लागि एकीकृत सूचना पोर्टल विकास गरेका हुन्।</p>`,
    },
  ] as Article[],

  latestTimeline: [
    {
      id: "t-dahal-confused",
      title:
        "राजनीति, कर्मचारीतन्त्र र राज्यका निकाय अन्योलपूर्ण अवस्थामा छन् : दाहाल",
      time: "८ मिनेट अघि",
      category: "राजनीति",
      source: "सनस्टार न्युज",
    },
    {
      id: "t-iran-trump",
      title: "इरान सामान्य विषय हो : अमेरिकी पूर्वराष्ट्रपति ट्रम्प",
      time: "३३ मिनेट अघि",
      category: "विश्व",
      source: "सनस्टार न्युज",
    },
    {
      id: "t-chandika-rescued",
      title:
        "परिवारले काजकिरिया थालिसकेको थियो, चण्डिका श्रेष्ठको जीवितै उद्धार भयो",
      time: "४३ मिनेट अघि",
      category: "समाचार",
      source: "सनस्टार न्युज",
    },
    {
      id: "lead-krishnabhir-track",
      title:
        "भासिएको ७ दिनपछि कृष्णभीरमा खुल्यो डाइभर्सन ट्र्याक, ग्राभेल गरेर सवारीसाधन चलाइने",
      time: "१ घण्टा अघि",
      category: "राजमार्ग",
      source: "सनस्टार न्युज",
    },
    {
      id: "lead-sunstar-launch",
      title:
        "पोखराबाट ‘सनस्टार न्युज’को शुभारम्भ, विष्णुहरि भुगाई र विष्णु पुनद्वारा डिजिटल पत्रकारितामा नयाँ पहल",
      time: "२ घण्टा अघि",
      category: "मुख्य",
      source: "सनस्टार न्युज",
    },
  ],

  exclusiveNews: [
    {
      id: "excl-sunstar-1",
      title: "👑 सनस्टार एक्सक्लुसिभ: गण्डकी प्रदेशमा १० अर्बको पोखरा पर्यटन गुरुयोजना घोषणा",
      category: "विशेष समाचार",
      time: "भर्खरै",
      source: "Sunstar Exclusive",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
      summary: "गण्डकी प्रदेश सरकार र निजी क्षेत्रको सहकार्यमा पोखरा-फेवाताल संरक्षण तथा अन्तर्राष्ट्रिय साहसिक पर्यटन प्रवर्द्धनसम्बन्धी १० अर्बको गुरुयोजना सार्वजनिक।",
      content: "<p>गण्डकी प्रदेश सरकार र निजी क्षेत्रको सहकार्यमा पोखरा-फेवाताल संरक्षण तथा अन्तर्राष्ट्रिय साहसिक पर्यटन प्रवर्द्धनसम्बन्धी १० अर्बको गुरुयोजना सार्वजनिक गरिएको छ।</p>"
    },
    {
      id: "excl-sunstar-2",
      title: "👑 कृष्णभीर पहिरो पछाडिको भौगर्भिक अध्ययन रिपोर्ट: दीर्घकालीन सुरुङमार्ग बनाउन सिफारिस",
      category: "विशेष खोज",
      time: "४० मिनेट अघि",
      source: "Sunstar Exclusive",
      image: "https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=80",
      summary: "सडक विभागका भौगर्भिक इन्जिनियरहरूको टोलीले कृष्णभीरको कमजोर धरातलका कारण दीर्घकालीन समाधानका लागि १.५ किमी सुरुङमार्ग निर्माण गर्न सिफारिस गरेको छ।",
      content: "<p>सडक विभागका भौगर्भिक इन्जिनियरहरूको टोलीले कृष्णभीरको कमजोर धरातलका कारण दीर्घकालीन समाधानका लागि सुरुङमार्ग निर्माण गर्न सिफारिस गरेको छ।</p>"
    },
    {
      id: "excl-sunstar-3",
      title: "👑 सनस्टार खोज: जलविद्युत् रोयल्टीबाट उठ्ने अर्बौं बजेट कहाँ खर्च भइरहेको छ?",
      category: "विशेष खोज",
      time: "१ घण्टा अघि",
      source: "Sunstar Exclusive",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80",
      summary: "प्रदेश र स्थानीय तहले पाउने जलविद्युत् रोयल्टीको वास्तविक सदुपयोग र स्थानीय समुदायमा परेको सकारात्मक असरबारे विस्तृत अध्ययन।",
      content: "<p>प्रदेश र स्थानीय तहले पाउने जलविद्युत् रोयल्टीको प्रयोगबारे सनस्टार एक्सक्लुसिभ रिपोर्ट।</p>"
    },
    {
      id: "excl-sunstar-4",
      title: "👑 डिजिटल नेपाल: नेपालका १० सफल टेक स्टार्टअपको अनौठो व्यावसायिक यात्रा",
      category: "विशेष रिपोर्ट",
      time: "२ घण्टा अघि",
      source: "Sunstar Exclusive",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80",
      summary: "काठमाडौँ र पोखराका युवा उद्यमीहरूले विश्वव्यापी प्रविधि बजारमा नेपाललाई चिनाउँदै कसरी करोडौँको व्यवसाय खडा गरे?",
      content: "<p>नेपालका प्रमुख १० टेक स्टार्टअपहरूको व्यावसायिक उपलब्धि र सङ्घर्षको कथा।</p>"
    }
  ] as Article[],

  interviewNews: [
    {
      id: "intv-bhugai",
      title: "🎙️ 'डिजिटल समाचारमा सत्यता र निष्पक्षता नै हाम्रो मूल प्रतिबद्धता हो' : विष्णुहरि भुगाई",
      category: "अन्तर्वार्ता",
      time: "१ घण्टा अघि",
      source: "Sunstar Interview",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
      summary: "सनस्टार न्युजका संस्थापक विष्णुहरि भुगाईसँग पोखराबाट सञ्चालित मिडियाको भविष्य, प्रविधि र निष्पक्ष पत्रकारिताबारे गरिएको विशेष कुराकानी।",
      content: "<p>सनस्टार न्युजका संस्थापक विष्णुहरि भुगाईसँग पोखराबाट सञ्चालित मिडियाको भविष्य, प्रविधि र निष्पक्ष पत्रकारिताबारे गरिएको विशेष कुराकानी।</p>"
    },
    {
      id: "intv-pun",
      title: "🎙️ 'पोखरा र गण्डकीको आवाजलाई राष्ट्रिय तथा अन्तर्राष्ट्रिय मञ्चमा पुर्‍याउँदै छौँ' : विष्णु पुन",
      category: "अन्तर्वार्ता",
      time: "२ घण्टा अघि",
      source: "Sunstar Interview",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
      summary: "नेपालको अनलाइन पत्रकारितामा पोखराको भूमिका र युवा पुस्तालाई सूचना प्रवाह गर्ने नयाँ रणनीतिक योजनाबारे विष्णु पुनसँगको संवाद।",
      content: "<p>नेपालको अनलाइन पत्रकारितामा पोखराको भूमिका र युवा पुस्तालाई सूचना प्रवाह गर्ने नयाँ रणनीतिक योजनाबारे विष्णु पुनसँगको संवाद।</p>"
    },
    {
      id: "intv-econ-expert",
      title: "🎙️ 'मूल्यवृद्धि नियन्त्रण र रोजगारी सिर्जनामा आन्तरिक उत्पादन बढाउनुपर्छ' : अर्थविद्",
      category: "अन्तर्वार्ता",
      time: "३ घण्टा अघि",
      source: "Sunstar Interview",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      summary: "नेपालको आर्थिक सुधारका उपायहरू, वैदेशिक लगानी र राजस्व संकलनमा देखिएका चुनौतीबारे अर्थविद्हरूसँगको गहन कुराकानी।",
      content: "<p>नेपालको आर्थिक सुधारका उपायहरूबारे वरिष्ठ अर्थविद्हरूसँग गरिएको विस्तृत कुराकानी।</p>"
    },
    {
      id: "intv-tech-lead",
      title: "🎙️ 'नेपालमा एआई र डेटा साइन्सको भविष्य अत्यन्त उज्ज्वल छ' : प्रविधि विज्ञ",
      category: "अन्तर्वार्ता",
      time: "४ घण्टा अघि",
      source: "Sunstar Interview",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
      summary: "कृत्रिम बौद्धिकता (AI) को प्रयोगले शिक्षा, स्वास्थ्य र कृषि क्षेत्रमा ल्याउन सक्ने अभूतपूर्व परिवर्तनबारे प्रविधिविज्ञसँगको कुराकानी।",
      content: "<p>कृत्रिम बौद्धिकता (AI) को प्रयोगले ल्याउने रूपान्तरणबारे प्रविधिविज्ञसँगको संवाद।</p>"
    }
  ] as Article[],

  featureNews: [
    {
      id: "feat-arun-valley",
      title: "📰 स्वच्छ ऊर्जाका नाममा मूल्य चुकाउँदै अरुण उपत्यकाका आदिवासीहरू",
      category: "फिचर / वातावरण",
      categorySlug: "feature",
      time: "३५ मिनेट अघि",
      source: "Sunstar Feature",
      image: "https://assets-cdn.ekantipur.com/uploads/source/news/kantipur/2026/miscellaneous/uchhenthe-prayer4-0192026123954-1000x0.jpg",
      summary: "जलविद्युत्का लागि अर्बौं डलरको लगानी खन्याइँदै छ। तर स्थानीय बासिन्दा भन्छन्, उनीहरूकै भूमिमा बनाउने भनिएको परियोजनाबारे वास्तविक रूपमा उनीहरूलाई कहिल्यै सोधिएकै छैन।",
      content: "<p>जलविद्युत्का लागि अर्बौं डलरको लगानी खन्याइँदै छ। तर स्थानीय बासिन्दा भन्छन्, उनीहरूकै भूमिमा बनाउने भनिएको परियोजनाबारे वास्तविक रूपमा उनीहरूलाई कहिल्यै सोधिएकै छैन।</p>"
    },
    {
      id: "feat-pokhara-lakes",
      title: "📰 फेवा र बेगनास तालको जैविक विविधता संरक्षणमा जैविक प्रविधिको प्रयोग",
      category: "फिचर / वातावरण",
      categorySlug: "feature",
      time: "२ घण्टा अघि",
      source: "Sunstar Feature",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
      summary: "पोखराका जलाधार क्षेत्र र सीमसार जमिनको अतिक्रमण रोक्न स्थानीय संरक्षणवादीहरूले आधुनिक ड्रोन र जैविक प्रविधि मार्फत जलकुम्भी नियन्त्रण अभियान चलाएका छन्।",
      content: "<p>पोखराका जलाधार क्षेत्र र सीमसार जमिनको अतिक्रमण रोक्न स्थानीय संरक्षणवादीहरूले आधुनिक प्रविधि अपनाएका छन्।</p>"
    },
    {
      id: "feat-mustang-apples",
      title: "📰 मुस्ताङका स्याउ बगैँचामा अर्गानिक खेती: स्थानीय किसानको आत्मनिर्भरता र बजार पहुँच",
      category: "फिचर / कृषि",
      categorySlug: "feature",
      time: "४ घण्टा अघि",
      source: "Sunstar Feature",
      image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=600&auto=format&fit=crop&q=80",
      summary: "मार्फा र जोमसोमका किसानहरूले कोल्ड स्टोर र प्रत्यक्ष अनलाइन बिक्री सञ्जालमार्फत काठमाडौँ र पोखराका उपभोक्तासम्म ताजा स्याउ पुर्‍याइरहेका छन्।",
      content: "<p>मार्फा र जोमसोमका किसानहरूले आधुनिक कोल्ड स्टोर र अनलाइन बिक्री सञ्जालमार्फत अर्गानिक स्याउ बिक्री गरिरहेका छन्।</p>"
    },
    {
      id: "feat-tilicho-trek",
      title: "📰 संसारकै उच्च स्थानको तिलिचो ताल: नयाँ पदमार्ग र साहसिक पर्यटकको ओइरो",
      category: "फिचर / पर्यटन",
      categorySlug: "feature",
      time: "५ घण्टा अघि",
      source: "Sunstar Feature",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
      summary: "मनाङको तिलिचो क्षेत्रमा सडक सुविधा र आधुनिक टि-हाउस बनेपछि आन्तरिक तथा बाह्य पर्यटकहरूको उपस्थिति तीव्र बढेको छ।",
      content: "<p>मनाङको तिलिचो क्षेत्रमा आधुनिक सेवा सुविधा विस्तार भएसँगै पर्यटन आगमनमा उल्लेख्य सुधार आएको छ।</p>"
    }
  ] as Article[],

  politicsNews: [
    {
      id: "pol-dahal",
      title:
        "कर्मचारीतन्त्र र राज्यका निकाय अन्योलपूर्ण अवस्थामा छन् : पुष्पकमल दाहाल",
      category: "राजनीति",
      categorySlug: "politics",
      time: "८ मिनेट अघि",
      source: "Sunstar News",
      image:
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80",
      summary:
        "पूर्वप्रधानमन्त्री दाहालले मुलुकको वर्तमान राजनीतिक सुशासन र निजामती प्रशासनमा अन्योल देखिएको भन्दै उच्चस्तरीय संवादको आवश्यकता औँल्याएका छन्।",
      content: `<p>पूर्वप्रधानमन्त्री पुष्पकमल दाहालले मुलुकको वर्तमान राजनीतिक सुशासन र निजामती प्रशासनमा अन्योल देखिएको भन्दै सर्वदलीय राजनीतिक संवादको आवश्यकता औँल्याएका छन्।</p>`,
    },
    {
      id: "pol-1",
      title:
        "संसद्को बजेट अधिवेशन र विचाराधीन विधेयकबारे दलहरूबीच उच्चस्तरीय सहमति",
      category: "राजनीति",
      categorySlug: "politics",
      time: "१ घण्टा अघि",
      source: "Sunstar News",
      image:
        "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&auto=format&fit=crop&q=80",
      summary:
        "सभामुखको अध्यक्षतामा बसेको कार्यव्यवस्था परामर्श समितिको बैठकमा वित्तीय सुशासन र निजामती ऐन छिटो पारित गर्ने सहमति।",
      content: `<p>सभामुखको अध्यक्षतामा बसेको कार्यव्यवस्था परामर्श समितिको बैठकमा वित्तीय सुशासन र निजामती ऐन छिटो पारित गर्ने सहमति भएको छ।</p>`,
    },
    {
      id: "pol-3",
      title: "स्थानीय तहको वित्तीय उत्तरदायित्व र बजेट पारदर्शिता सम्बन्धी राष्ट्रिय सम्मेलन",
      category: "राजनीति / सुशासन",
      categorySlug: "politics",
      time: "४ घण्टा अघि",
      source: "Sunstar News",
      image:
        "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80",
      summary:
        "देशभरका ७५३ वटै स्थानीय तहका प्रमुखहरू सहभागी सम्मेलनमा वित्तीय अनुशासन र बजेट पारदर्शी प्रयोगबारे छलफल।",
      content: `<p>देशभरका ७५३ वटै स्थानीय तहका प्रमुखहरू सहभागी सम्मेलनमा वित्तीय अनुशासन र बजेट पारदर्शी प्रयोगबारे छलफल भइरहेको छ।</p>`,
    },
    {
      id: "pol-4",
      title: "संविधान संशोधन तथा संघीयता सुदृढीकरणका लागि उच्चस्तरीय सुझाव आयोग गठन",
      category: "राजनीति",
      categorySlug: "politics",
      time: "६ घण्टा अघि",
      source: "Sunstar News",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
      summary: "संघीय प्रणालीलाई अझ सशक्त र जनउत्तरदायी बनाउन पूर्वप्रधानन्यायाधीशको अध्यक्षतामा विज्ञ टोली गठन गरिएको छ।",
      content: "<p>संघीय प्रणालीलाई अझ सशक्त र जनउत्तरदायी बनाउन पूर्वप्रधानन्यायाधीशको अध्यक्षतामा विज्ञ टोली गठन गरिएको छ।</p>"
    }
  ] as Article[],

  technologyNews: [
    {
      id: "tech-ai-flood-portal",
      title: "🔬 विपद् उद्धारमा एआई क्रान्ति: नेपालमै बनेको एकीकृत सूचना पोर्टलले बचायो दर्जनौँ ज्यान",
      category: "प्रविधि",
      categorySlug: "technology",
      time: "२० मिनेट अघि",
      source: "Sunstar Tech",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      summary: "रातभर खटेर क्षति तथ्याङ्क र बेपत्ताको एकीकृत सूची दिने एआई पोर्टल सञ्चालनमा ल्याएपछि राहत वितरण छिटो र प्रभावकारी बनेको छ।",
      content: "<p>रातभर खटेर क्षति तथ्याङ्क र बेपत्ताको एकीकृत सूची दिने एआई पोर्टल सञ्चालनमा ल्याएपछि राहत वितरण छिटो र प्रभावकारी बनेको छ।</p>"
    },
    {
      id: "tech-nepal-5g",
      title: "🔬 पोखरा र काठमाडौँमा ५जी परीक्षण अन्तिम चरणमा, मोबाइल इन्टरनेटको गति १० गुणा बढ्ने",
      category: "प्रविधि",
      categorySlug: "technology",
      time: "५ घण्टा अघि",
      source: "Sunstar Tech",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80",
      summary: "नेपाल टेलिकम र निजी सेवा प्रदायकहरूले व्यावसायिक ५जी सेवा सुरु गर्न नयाँ बीटीएस टावरहरू परीक्षण गरिरहेका छन्।",
      content: "<p>नेपाल टेलिकम र निजी सेवा प्रदायकहरूले व्यावसायिक ५जी सेवा सुरु गर्न नयाँ बीटीएस टावरहरू परीक्षण गरिरहेका छन्।</p>"
    },
    {
      id: "tech-cyber-security",
      title: "🔬 नेपालमा राष्ट्रिय साइबर सुरक्षा केन्द्र स्थापना, डिजिटल बैंकिङ र तथ्यांक सुरक्षामा कडाइ",
      category: "प्रविधि",
      categorySlug: "technology",
      time: "७ घण्टा अघि",
      source: "Sunstar Tech",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
      summary: "बढ्दो अनलाइन ठगी र साइबर हमला नियन्त्रण गर्न २४ सै घण्टा अनुगमन गर्ने सेक्युरिटी अपरेसन सेन्टर (SOC) सञ्चालनमा।",
      content: "<p>बढ्दो अनलाइन ठगी र साइबर हमला नियन्त्रण गर्न २४ सै घण्टा अनुगमन गर्ने सेक्युरिटी अपरेसन सेन्टर सञ्चालनमा ल्याइएको छ।</p>"
    },
    {
      id: "tech-it-export",
      title: "🔬 आईटी सेवा निर्यातबाट नेपालमा वार्षिक १ खर्ब भित्र्याउने लक्ष्य: पोखरा प्रविधि पार्क प्रस्ताव",
      category: "प्रविधि",
      categorySlug: "technology",
      time: "९ घण्टा अघि",
      source: "Sunstar Tech",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80",
      summary: "सफ्टवेयर विकास र एआई प्रविधिमा नेपाली युवाहरूको क्षमता अभिवृद्धि गर्दै पोखरामा हरित सूचना प्रविधि पार्क बनाइने।",
      content: "<p>सफ्टवेयर विकास र एआई प्रविधिमा नेपाली युवाहरूको क्षमता अभिवृद्धि गर्दै पोखरामा हरित सूचना प्रविधि पार्क बनाइनेछ।</p>"
    }
  ] as Article[],

  businessNews: [
    {
      id: "biz-gas-krishnabhir",
      title:
        "कृष्णभीर पहिरोले काठमाडौंमा ग्यास आपूर्ति प्रभावित, व्यावसायिक प्रयोगकर्ताले आफैँ सिलिन्डर भर्नुपर्ने",
      category: "अर्थ / वाणिज्य",
      categorySlug: "business",
      time: "१५ मिनेट अघि",
      source: "Sunstar News",
      image:
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
      summary:
        "पृथ्वी राजमार्ग अवरुद्ध हुँदा भारतबाट आयातित एलपी ग्यास बुलेट धादिङमै रोकिएपछि उपत्यकाका होटल तथा रेस्टुरेन्टमा ग्यास अभाव देखिएको हो।",
      content: `<p>पृथ्वी राजमार्गअन्तर्गत कृष्णभीरमा सडक भासिएपछि ग्यास बुलेटहरू रोकिएका कारण काठमाडौँ उपत्यकामा व्यावसायिक ग्यास आपूर्ति प्रभावित भएको एलपी ग्यास उद्योग संघले जनाएको छ।</p>`,
    },
    {
      id: "biz-1",
      title:
        "नेपालको वैदेशिक व्यापार: गलैँचा, चिया र हस्तकला सामग्रीको निर्यातमा १५% को उत्साहजनक वृद्धि",
      category: "अर्थ / वाणिज्य",
      categorySlug: "business",
      time: "१ घण्टा अघि",
      source: "Sunstar News",
      image:
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80",
      summary:
        "युरोप र अमेरिकी बजारमा अर्गानिक अर्थोडक्स चिया र नेपाली हाते गलैँचाको माग उल्लेख्य बढेको भन्सार विभागको भनाइ।",
      content: `<p>युरोप र अमेरिकी बजारमा अर्गानिक अर्थोडक्स चिया र नेपाली हाते गलैँचाको माग उल्लेख्य बढेको छ।</p>`,
    },
    {
      id: "biz-3",
      title:
        "शरद् ऋतुको पर्यटन आगमन: पोखरा, चितवन र अन्नपूर्ण क्षेत्रका होटलमा ८०% बुकिङ",
      category: "पर्यटन / उड्डयन",
      categorySlug: "business",
      time: "४ घण्टा अघि",
      source: "Sunstar News",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
      summary:
        "अन्तर्राष्ट्रिय उडान संख्या वृद्धि र मौसम सुधारसँगै नेपाल भ्रमणमा आउने विदेशी पर्यटकहरूको संख्या बढेको छ।",
      content: `<p>अन्तर्राष्ट्रिय उडान संख्या वृद्धि र मौसम सुधारसँगै नेपाल भ्रमणमा आउने विदेशी पर्यटकहरूको संख्या बढेको छ।</p>`,
    },
    {
      id: "biz-4",
      title: "नेपाल राष्ट्र बैंकद्वारा मौद्रिक नीतिको पहिलो त्रैमासिक समीक्षा: ब्याजदर घट्ने संकेत",
      category: "अर्थ / बैंक",
      categorySlug: "business",
      time: "६ घण्टा अघि",
      source: "Sunstar News",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80",
      summary: "बैंक तथा वित्तीय संस्थाको निक्षेप र कर्जा प्रवाह सन्तुलनमा ल्याउन नीतिगत दर ०.५ प्रतिशतले घटाइएको छ।",
      content: "<p>बैंक तथा वित्तीय संस्थाको निक्षेप र कर्जा प्रवाह सन्तुलनमा ल्याउन नीतिगत दर घटाइएको छ।</p>"
    }
  ] as Article[],

  opinions: [
    {
      id: "op-krishna-bahab",
      title:
        "भोटेकोशीको क्षति: नेपालले विश्वसँग सहयोग मागेको हो कि जलवायु न्याय?",
      author: "कृष्ण बहाब",
      role: "जलवायु राजनीति विज्ञ (सनस्टार विचार)",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      time: "६ मिनेट पाठ",
      source: "Sunstar News Column",
      summary:
        "हिमाली क्षेत्रमा अतिवृष्टि र गेग्रान बाढी नेपालको गल्ती होइन। अन्तर्राष्ट्रिय मञ्चमा नेपालले याचना होइन, अधिकारका रूपमा जलवायु क्षतिपूर्ति (Loss and Damage Fund) माग्नुपर्छ।",
    },
    {
      id: "op-ritesh-panthi",
      title: "विपद्मा नागरिकको अधिकार संरक्षण र राज्यको दायित्व",
      author: "रितेश पन्थी",
      role: "मानवाधिकार एवं कानुन अध्येता",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      time: "१० मिनेट पाठ",
      source: "Sunstar News Column",
      summary:
        "विपद्को घडीमा गास, बास, कपास र स्वास्थ्योपचार नागरिकको मौलिक अधिकार हो। राहत वितरणमा पारदर्शिता र समन्यायिक पहुँच सुनिस्चित गर्नु राज्यको कर्तव्य हो।",
    },
    {
      id: "op-editorial",
      title: "कृष्णभीरमा अवरोध : विकल्प पनि बलियो बनाऊ",
      author: "सम्पादकीय",
      role: "सनस्टार सम्पादकीय मण्डल",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      time: "६ मिनेट पाठ",
      source: "Sunstar Editorial",
      summary:
        "हरेक वर्षातमा पृथ्वी राजमार्ग ठप्प हुने नियति अन्त्य गर्न अब सामान्य डाइभर्सन होइन, सुरुङमार्ग र समानान्तर वैकल्पिक मार्ग निर्माणमा ढिलाइ गरिनुहुन्न।",
    },
    {
      id: "op-manish-raj-pande",
      title: "अन्तर्राष्ट्रिय क्रिकेटमा नेपालको तीन दशक: चुनौती र सम्भावना",
      author: "मनीषराज पाण्डे",
      role: "पूर्वराष्ट्रिय क्रिकेट कप्तान",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      time: "१२ मिनेट पाठ",
      source: "Sunstar Sports Column",
      summary: "आईसीसी टी-२० विश्वकपमा ऐतिहासिक सहभागितापछि नेपाली क्रिकेटको पूर्वाधार विकास र तृणमूल तहबाट नयाँ खेलाडी उत्पादनमा रणनीतिक सुधार आवश्यक छ।",
    },
    {
      id: "op-pokhara-future",
      title: "पोखराको समृद्धि र दिगो पर्यटन विकासको नयाँ खाका",
      author: "डा. सुजन रेग्मी",
      role: "अर्थशास्त्री एवं पर्यटन अनुसन्धाता",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      time: "८ मिनेट पाठ",
      source: "Sunstar News Column",
      summary: "पोखरा अन्तर्राष्ट्रिय विमानस्थलको पूर्ण क्षमता उपयोग र साहसिक खेल प्रवर्द्धनले गण्डकी प्रदेशको जीडीपीलाई २० प्रतिशतले बढाउन सक्छ।",
    }
  ] as Opinion[],

  stories: [
    {
      id: "story-bhotekoshi-disaster",
      title: "भोटेकोशी बाढी अपडेट: क्षति, उद्धार र विस्थापितको स्थलगत दृश्य कथा",
      category: "🇳🇵 बाढी विपद्",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      author: "सनस्टार संवाददाता",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      views: "४.८k दृश्य",
      duration: "१ मिनेट",
      articleId: "lead-bhotekoshi-rescue"
    },
    {
      id: "story-pokhara-fewatal",
      title: "पोखरा फेवाताल र अन्नपूर्ण हिमश्रृंखलाको मनमोहक पर्यटकीय झलक",
      category: "🏔️ पोखरा विशेष",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      author: "विष्णु पुन",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      views: "६.२k दृश्य",
      duration: "४५ सेकेन्ड",
      articleId: "p-g-fewatal-car"
    },
    {
      id: "story-nepal-cricket",
      title: "नेपाली क्रिकेट टोलीको त्रिकोणात्मक टी-२० शृङ्खलाको तयारी र उत्साह",
      category: "⚽ खेलकुद कथा",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
      author: "मनीषराज पाण्डे",
      authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      views: "१२.५k दृश्य",
      duration: "२ मिनेट",
      articleId: "sp-cricket-uae"
    },
    {
      id: "story-climate-justice",
      title: "हिमाली क्षेत्रमा जलवायु परिवर्तनको असर: क्षतिपूर्ति र क्षति कोष",
      category: "🌱 जलवायु बहस",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      author: "कृष्ण बहाब",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      views: "५.३k दृश्य",
      duration: "१.५ मिनेट",
      articleId: "op-krishna-bahab"
    },
    {
      id: "story-tech-ai-nepal",
      title: "नेपालमा AI र डिजिटल मिडियाको भविष्य: सनस्टार डिजिटल प्रयास",
      category: "🔬 प्रविधि स्टोरी",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      author: "सनस्टार टेक",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      views: "३.९k दृश्य",
      duration: "५० सेकेन्ड",
      articleId: "lead-arun-indigenous"
    }
  ] as StoryItem[],

  pradeshNews: {
    gandaki: [
      {
        id: "p-g-super-seti",
        title: "सुपर सेती हाइड्रोपावरको बाटो खन्ने क्रममा पहिरो खस्दा दुई जनाको मृत्यु",
        time: "भर्खरै",
        location: "माछापुच्छ्रे, कास्की",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-g-trishuli-bridge",
        title: "त्रिशूलीको क्षतिग्रस्त झोलुङ्गे पुलमा जोखिम मोलेर इन्टरनेट लाइन विस्तार",
        time: "३० मिनेट अघि",
        location: "धादिङ / बेनीघाट",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-g-fewa-car",
        title: "फेवातालमा कार खस्यो, दुई जनाको दुःखद निधन",
        time: "१ घण्टा अघि",
        location: "लेकसाइड, पोखरा",
        source: "सनस्टार न्युज",
      },
      {
        id: "lead-sunstar-launch",
        title: "पोखराबाट ‘सनस्टार न्युज’को शुभारम्भ, विष्णुहरि भुगाई र विष्णु पुनद्वारा डिजिटल पत्रकारितामा नयाँ पहल",
        time: "२ घण्टा अघि",
        location: "पोखरा, कास्की",
        source: "सनस्टार न्युज",
      },
    ],
    koshi: [
      {
        id: "p-k-deepak-missing",
        title: "भोटेकोशी विपत्ति : १० दिनदेखि सम्पर्कविहीन दीपकको प्रतीक्षामा परिवार",
        time: "२० मिनेट अघि",
        location: "संखुवासभा",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-k-dhankuta-lakhe",
        title: "धनकुटामा लाखे नाच प्रदर्शन गर्दै भोटेकोशी बाढीपीडितका लागि ७१ हजार रुपैयाँ संकलन",
        time: "४५ मिनेट अघि",
        location: "धनकुटा",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-k-teacher-murder",
        title: "शिक्षक हत्या आरोपमा भरुवा बन्दुकसहित एक जना पक्राउ",
        time: "१ घण्टा अघि",
        location: "मकालु, संखुवासभा",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-k-turmeric",
        title: "धनकुटा नगरपालिकाले सडक किनारका खाली जग्गामा विस्तार गर्‍यो बेसार खेती",
        time: "३ घण्टा अघि",
        location: "धनकुटा",
        source: "सनस्टार न्युज",
      },
    ],
    madhesh: [
      {
        id: "p-m-rasuwa-missing-names",
        title: "रसुवा बाढीपछि सम्पर्कविहीन पर्सा, बारा, सर्लाही र भारतका ३९ जनाको नाम सार्वजनिक",
        time: "१५ मिनेट अघि",
        location: "वीरगन्ज, पर्सा",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-m-mirchaiya-relief",
        title: "प्रधानमन्त्री राहत कोषमा मिर्चैया नगरपालिकाद्वारा साढे २५ लाख सहयोग",
        time: "४० मिनेट अघि",
        location: "सिरहा",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-m-motidan-help",
        title: "मोतिदान कन्स्ट्रक्सनद्वारा भोटेकोशी बाढीपीडितका लागि २० लाख १ हजार सहयोग",
        time: "१ घण्टा अघि",
        location: "जनकपुरधाम",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-m-birgunj-metro",
        title: "भोटेकोशी बाढीपीडितलाई वीरगन्ज महानगरको १ करोड ११ लाख सहयोग",
        time: "२ घण्टा अघि",
        location: "वीरगन्ज",
        source: "सनस्टार न्युज",
      },
    ],
    bagmati: [
      {
        id: "p-b-orphan-students",
        title: "बाढीमा अभिभावक गुमाएका बालबालिकालाई आवाससहित १२ कक्षासम्म पढाउने बागमती सरकारको निर्णय",
        time: "२५ मिनेट अघि",
        location: "हेटौँडा / काठमाडौँ",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-b-alt-roads",
        title: "बाढीपछि चार वैकल्पिक सडकबाट यातायात सञ्चालन",
        time: "५० मिनेट अघि",
        location: "नुवाकोट / रसुवा",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-b-police-school",
        title: "नेपाल पुलिस स्कुलका विद्यार्थीले गरे खाजा खर्च राहत कोषमा जम्मा",
        time: "१ घण्टा अघि",
        location: "काभ्रेपलाञ्चोक",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-b-chautara-help",
        title: "चौतारा साँगाचोकगढी नगरपालिकाले विपद् कोषमा ३५ लाख सहयोग गर्ने",
        time: "३ घण्टा अघि",
        location: "सिन्धुपाल्चोक",
        source: "सनस्टार न्युज",
      },
    ],
    lumbini: [
      {
        id: "p-l-tansen-bhagwati",
        title: "मध्यरातमा पाल्पाको तानसेनमा भगवतीको जयजयकार, ऐतिहासिक जात्रा सम्पन्न",
        time: "३० मिनेट अघि",
        location: "तानसेन, पाल्पा",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-l-barbardiya-missing",
        title: "भोटेकोशी बाढीपछि बारबर्दिया-१ का एक दम्पतीसहित ९ सम्पर्कविहीन",
        time: "१ घण्टा अघि",
        location: "बर्दिया",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-l-satyawati-school",
        title: "गुल्मीको सत्यवती माविका विद्यार्थीले गरे बाढीपीडितलाई ३२ हजार ५० रुपैयाँ सहयोग",
        time: "२ घण्टा अघि",
        location: "गुल्मी",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-l-rainadevi-fund",
        title: "पाल्पाको रैनादेवी छहराले ३५ लाख र माथागढीले ३४ लाख उद्धार कोषमा पठाउने",
        time: "४ घण्टा अघि",
        location: "पाल्पा",
        source: "सनस्टार न्युज",
      },
    ],
    karnali: [
      {
        id: "p-kr-salyan-fever",
        title: "सल्यानमा भाइरल ज्वरो र डेंगुका बिरामी बढे, अस्पतालमा शय्या अभाव",
        time: "३५ मिनेट अघि",
        location: "सल्यान",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-kr-kalimati-pests",
        title: "कालीमाटीको धानबालीमा 'ब्राउनहोपर' र 'लिपमाइनर' किराको प्रकोप",
        time: "१ घण्टा अघि",
        location: "कालीमाटी, सल्यान",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-kr-risang-flood",
        title: "रिसाङका पहिरोपीडितको चिन्ता- ‘सरकारले अब हामीलाई हेर्छ कि हेर्दैन?’",
        time: "२ घण्टा अघि",
        location: "जाजरकोट",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-kr-salma-bridge",
        title: "चार वर्षदेखि साल्मा खोलाको पुल अलपत्र, जोखिम मोलेर खोला तर्नुपर्ने बाध्यता",
        time: "५ घण्टा अघि",
        location: "छेडागाड, जाजरकोट",
        source: "सनस्टार न्युज",
      },
    ],
    sudurpaschim: [
      {
        id: "p-s-baitadi-doorstep",
        title: "बैतडीमा अशक्त नागरिकलाई घरमै पुगेर नागरिकता वितरण",
        time: "२० मिनेट अघि",
        location: "बैतडी",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-s-gaumul-landslide",
        title: "गौमुलमा पहिरोले एक घर पूर्ण क्षति, गाउँनै जोखिममा",
        time: "५० मिनेट अघि",
        location: "बाजुरा",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-s-gaura-festival",
        title: "गौरा पर्वको तेस्रो दिन : गौरा भित्र्याउँदै सप्तमीको व्रत र गौरा–महेश्वरको पूजाआजा",
        time: "२ घण्टा अघि",
        location: "धनगढी / अछाम",
        source: "सनस्टार न्युज",
      },
      {
        id: "p-s-mahakali-flow",
        title: "महाकाली नदीको बहाव यो वर्षकै उच्च, तटीय क्षेत्रमा उच्च सतर्कता अपनाउन आग्रह",
        time: "४ घण्टा अघि",
        location: "कञ्चनपुर",
        source: "सनस्टार न्युज",
      },
    ],
  } as Record<
    string,
    { id: string; title: string; time: string; location: string; source: string }[]
  >,

  sportsNews: [
    {
      id: "sp-1",
      title:
        "नेपाल र युएई बीचको त्रिकोणात्मक टी-२० शृङ्खला भोलिदेखि कीर्तिपुरमा: कप्तान रोहित पौडेल उत्साहित",
      category: "खेलकुद (Cricket)",
      categorySlug: "sports",
      time: "४० मिनेट अघि",
      source: "Sunstar News Sports",
      image:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80",
      summary:
        "नेपाली राष्ट्रिय क्रिकेट टोलीले त्रिवि क्रिकेट मैदान कीर्तिपुरमा युएई र मलेसिया सम्मिलित अन्तर्राष्ट्रिय टी-२० शृङ्खलाको उद्घाटन खेल खेल्दैछ।",
      content: `<p>नेपाली राष्ट्रिय क्रिकेट टोलीले त्रिवि क्रिकेट मैदान कीर्तिपुरमा युएई र मलेसिया सम्मिलित अन्तर्राष्ट्रिय टी-२० शृङ्खलाको उद्घाटन खेल खेल्दैछ।</p>`,
    },
    {
      id: "sp-2",
      title:
        "साफ महिला च्याम्पियनसिप: दशरथ रंगशालामा नेपाली टोलीको विशेष प्रशिक्षण जारी",
      category: "खेलकुद (Football)",
      categorySlug: "sports",
      time: "२ घण्टा अघि",
      source: "Sunstar News Sports",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      summary:
        "मुख्य प्रशिक्षकको रेखदेखमा प्रारम्भिक ३० खेलाडी सम्मिलित बन्द प्रशिक्षणमा फिटनेस र रणनीतिमा जोड दिइएको छ।",
      content: `<p>मुख्य प्रशिक्षकको रेखदेखमा प्रारम्भिक ३० खेलाडी सम्मिलित बन्द प्रशिक्षणमा फिटनेस र रणनीतिमा जोड दिइएको छ।</p>`,
    },
    {
      id: "sp-3",
      title: "पोखरा अन्तर्राष्ट्रिय म्याराथन: ३० देशका ५ हजार बढी धावकहरू भाग लिँदै",
      category: "खेलकुद (Marathon)",
      categorySlug: "sports",
      time: "४ घण्टा अघि",
      source: "Sunstar News Sports",
      image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&auto=format&fit=crop&q=80",
      summary: "भूतपूर्व खेलाडी मञ्च पोखराको आयोजनामा हुने १९ औँ पोखरा अन्तर्राष्ट्रिय म्याराथनको तयारी पूरा भएको छ।",
      content: "<p>भूतपूर्व खेलाडी मञ्च पोखराको आयोजनामा हुने १९ औँ पोखरा अन्तर्राष्ट्रिय म्याराथनको तयारी पूरा भएको छ।</p>"
    },
    {
      id: "sp-4",
      title: "नेपाल प्रिमियर लिग (NPL): आठ वटै टोलीको जर्सी र मार्की खेलाडी सार्वजनिक",
      category: "खेलकुद (Cricket)",
      categorySlug: "sports",
      time: "६ घण्टा अघि",
      source: "Sunstar News Sports",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80",
      summary: "नेपाल क्रिकेट संघ (क्यान) को आयोजनामा हुन लागेको व्यावसायिक टी-२० लिगको खेल तालिका र मुख्य प्रायोजक घोषणा।",
      content: "<p>नेपाल क्रिकेट संघ (क्यान) को आयोजनामा हुन लागेको व्यावसायिक टी-२० लिगको खेल तालिका सार्वजनिक।</p>"
    }
  ] as Article[],

  entertainmentNews: [
    {
      id: "ent-1",
      title:
        "अन्तर्राष्ट्रिय युरोपेली चलचित्र महोत्सवमा नेपाली वृत्तचित्र 'हिमालका सन्तान' लाई उत्कृष्ट जुरी अवार्ड",
      category: "मनोरञ्जन / चलचित्र",
      categorySlug: "entertainment",
      time: "१ घण्टा अघि",
      source: "Sunstar News Entertainment",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      summary:
        "हिमाली जनजीवन, संस्कृति र जलवायु परिवर्तनको कथा समेटिएको वृत्तचित्रले प्रतिष्ठित युरोपेली मञ्चमा नेपालको नाम चम्काएको छ।",
      content: `<p>हिमाली जनजीवन, संस्कृति र जलवायु परिवर्तनको कथा समेटिएको वृत्तचित्रले प्रतिष्ठित युरोपेली मञ्चमा नेपालको नाम चम्काएको छ।</p>`,
    },
    {
      id: "ent-2",
      title: "मिस वर्ल्ड २०२६: भियतनाममा नेपालको प्रतिनिधित्व गर्दै लुना लुइँटेल उत्कृष्ट प्रस्तुतिका साथ अघि बढ्दै",
      category: "मनोरञ्जन / फेसन",
      categorySlug: "entertainment",
      time: "२ घण्टा अघि",
      source: "Sunstar News Entertainment",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      summary: "भियतनाममा सञ्चालन भइरहेको ७१ औँ मिस वर्ल्ड प्रतियोगितामा नेपाली सुन्दरी लुना लुइँटेलको ब्युटी विथ अ पर्पस प्रोजेक्ट चर्चित।",
      content: "<p>भियतनाममा सञ्चालन भइरहेको ७१ औँ मिस वर्ल्ड प्रतियोगितामा नेपालको प्रस्तुति प्रभावकारी बनेको छ।</p>"
    },
    {
      id: "ent-3",
      title: "काठमाडौँ अन्तर्राष्ट्रिय पर्वतीय चलचित्र महोत्सव (KIMFF): ३५ देशका ६० वृत्तचित्र प्रदर्शन हुने",
      category: "मनोरञ्जन / चलचित्र",
      categorySlug: "entertainment",
      time: "४ घण्टा अघि",
      source: "Sunstar News Entertainment",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop&q=80",
      summary: "राष्ट्रिय सभागृह र नेपाल पर्यटन बोर्डको हलमा पाँच दिनसम्म सञ्चालन हुने महोत्सवको तयारी पूरा।",
      content: "<p>काठमाडौँ अन्तर्राष्ट्रिय पर्वतीय चलचित्र महोत्सव (KIMFF) को तयारी अन्तिम चरणमा पुगेको छ।</p>"
    },
    {
      id: "ent-4",
      title: "पोखरा म्युजिक फेस्टिभल: फेवा लेकसाइडमा लोक तथा फ्युजन संगीतको घन्क",
      category: "मनोरञ्जन / संगीत",
      categorySlug: "entertainment",
      time: "५ घण्टा अघि",
      source: "Sunstar News Entertainment",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
      summary: "नेपाली चर्चित सांगीतिक ब्यान्डहरू नेपथ्य, १३ र कुटुम्बको सहभागितामा पोखरामा भव्य सांगीतिक साँझ।",
      content: "<p>पोखरा लेकसाइडमा नेपाली लोक तथा फ्युजन संगीतको भव्य प्रस्तुति सम्पन्न।</p>"
    }
  ] as Article[],

  worldNews: [
    {
      id: "w-trump-iran",
      title: "इरान सामान्य विषय हो : ट्रम्प",
      category: "विश्व (World)",
      categorySlug: "world",
      time: "३३ मिनेट अघि",
      source: "Sunstar News World",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
      summary:
        "अमेरिकी पूर्वराष्ट्रपति डोनाल्ड ट्रम्पले मध्यपूर्वी तनाव र इरानसँगको सम्बन्धबारे टिप्पणी गर्दै कूटनीतिक नीति स्पष्ट पारेका छन्।",
      content: `<p>अमेरिकी पूर्वराष्ट्रपति डोनाल्ड ट्रम्पले मध्यपूर्वी तनाव र इरानसँगको सम्बन्धबारे टिप्पणी गर्दै अन्तर्राष्ट्रिय सञ्चारमाध्यमसँग कुराकानी गरेका हुन्।</p>`,
    },
    {
      id: "w-1",
      title:
        "जलवायु परिवर्तनसम्बन्धी राष्ट्रसंघीय शिखर सम्मेलन (COP): साना देशलाई अनुदान दिने सहमति नजिक",
      category: "विश्व (World)",
      categorySlug: "world",
      time: "१ घण्टा अघि",
      source: "Sunstar News World",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      summary:
        "विश्वका १९० भन्दा बढी देशका प्रतिनिधिहरू हरितगृह ग्याँस उत्सर्जन कटौती र क्षतिपूर्ति कोष सञ्चालनबारे सहमति जुटाउन छलफलमा।",
      content: `<p>विश्वका १९० भन्दा बढी देशका प्रतिनिधिहरू हरितगृह ग्याँस उत्सर्जन कटौती र क्षतिपूर्ति कोष सञ्चालनबारे सहमति जुटाउन छलफलमा।</p>`,
    },
    {
      id: "w-3",
      title: "विश्व अर्थतन्त्रमा सुधारको संकेत: एसियाली सेयर बजार र कच्चा तेलको मूल्य स्थिर",
      category: "विश्व (World)",
      categorySlug: "world",
      time: "३ घण्टा अघि",
      source: "Sunstar News World",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80",
      summary: "अन्तर्राष्ट्रिय मुद्रा कोष (IMF) ले एसियाली उदीयमान अर्थतन्त्रहरूमा यस वर्ष ५.२ प्रतिशतको वृद्धि हुने प्रक्षेपण गरेको छ।",
      content: "<p>अन्तर्राष्ट्रिय मुद्रा कोष (IMF) ले एसियाली उदीयमान अर्थतन्त्रहरूमा सुधार आउने प्रक्षेपण गरेको छ।</p>"
    },
    {
      id: "w-4",
      title: "अन्तरिक्ष अध्ययनमा ऐतिहासिक सफलता: नासा र इस्रोको संयुक्त भू-उपग्रह प्रक्षेपण",
      category: "विश्व / विज्ञान",
      categorySlug: "world",
      time: "५ घण्टा अघि",
      source: "Sunstar News World",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80",
      summary: "पृथ्वीको जलवायु, भूकम्पीय कम्पन र हिमतालको अनुगमन गर्ने आधुनिक NISAR भू-उपग्रह सफलतापूर्वक कक्षमा स्थापित।",
      content: "<p>नासा र इस्रोको संयुक्त NISAR भू-उपग्रह सफलतापूर्वक कक्षमा स्थापित गरिएको छ।</p>"
    }
  ] as Article[],

  videoNews: [
    {
      id: "vid-1",
      title:
        "भोटेकोशी र रसुवा उद्धार कार्यको एक्सक्लुसिभ भिडियो रिपोर्ट: नेपाली सेनाको हेलिकप्टरबाट सामाग्री वितरण",
      duration: "०४:४५",
      views: "१२० के",
      source: "Sunstar News Video",
      thumbnail:
        "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "vid-2",
      title:
        "विशेष अन्तरवार्ता: मिस वर्ल्ड २०२६ मा नेपालको प्रस्तुतिबारे भियतनामबाट लुना लुइँटेलसँग प्रत्यक्ष कुराकानी",
      duration: "१०:३०",
      views: "९५ के",
      source: "Sunstar News Video",
      thumbnail:
        "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "vid-3",
      title:
        "कीर्तिपुर टी-२० शृङ्खलाको पूर्वसन्ध्या: नेपाल र युएई टोलीको अभ्यास तथा कप्तान रोहितको पत्रकार सम्मेलन",
      duration: "०६:५०",
      views: "७८ के",
      source: "Sunstar News Video",
      thumbnail:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80",
    },
  ] as VideoNews[],
};

export function getAllArticles(): Article[] {
  const list: Article[] = [
    SUNSTAR_DATA.featuredLead,
    ...SUNSTAR_DATA.topSecondaryLeads,
    ...(SUNSTAR_DATA.exclusiveNews || []),
    ...SUNSTAR_DATA.politicsNews,
    ...SUNSTAR_DATA.businessNews,
    ...(SUNSTAR_DATA.interviewNews || []),
    ...(SUNSTAR_DATA.featureNews || []),
    ...(SUNSTAR_DATA.technologyNews || []),
    ...SUNSTAR_DATA.sportsNews,
    ...SUNSTAR_DATA.entertainmentNews,
    ...SUNSTAR_DATA.worldNews,
  ];

  SUNSTAR_DATA.opinions.forEach((op) => {
    if (!list.some((a) => a.id === op.id)) {
      list.push({
        id: op.id,
        title: op.title,
        category: " विचार / विश्लेषण",
        categorySlug: "opinion",
        author: op.author,
        authorRole: op.role,
        authorImage: op.avatar,
        time: op.time,
        source: op.source,
        summary: op.summary,
        image: op.avatar,
        content: `<p><strong>${op.author} (${op.role})</strong> — ${op.summary}</p>`,
      });
    }
  });

  Object.values(SUNSTAR_DATA.pradeshNews).forEach((provList) => {
    provList.forEach((item: any) => {
      if (!list.some((a) => a.id === item.id)) {
        list.push({
          id: item.id,
          title: item.title,
          category: `प्रदेश (${item.location || 'नेपाल'})`,
          categorySlug: "pradesh",
          time: item.time,
          source: item.source || "सनस्टार न्युज",
          image: item.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
          summary: item.summary || item.title,
          content: `<p>${item.title}</p>`,
        });
      }
    });
  });

  SUNSTAR_DATA.latestTimeline.forEach((t) => {
    if (!list.some((a) => a.id === t.id)) {
      list.push({
        id: t.id,
        title: t.title,
        category: t.category,
        time: t.time,
        source: t.source,
        summary: t.title,
        content: `<p>${t.title}</p>`,
      });
    }
  });

  return list;
}

export function getArticleById(id: string): Article | undefined {
  const articles = getAllArticles();
  return articles.find((a) => a.id === id);
}

export default SUNSTAR_DATA;
