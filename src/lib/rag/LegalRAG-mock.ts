// Mock Legal RAG System - No external dependencies required

// Legal documents database (mock data - replace with actual Lex.uz data)
const legalDocuments = [
  {
    title: "O'zbekiston Respublikasi Fuqarolik kodeksi",
    content: "O'zbekiston Respublikasi Fuqarolik kodeksi fuqarolik huquqiy munosabatlarini tartibga soladi. U 1-iyul 1996-yildan kuchga kirgan. Kodeks fuqarolarning huquq va majburiyatlarini, shartnomalar, mulk huquqi, meros huquqi kabi masalalarni tartibga soladi.",
    article: "1-modda. Fuqarolik qonunchiligining asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1492387"
  },
  {
    title: "O'zbekiston Respublikasi Mehnat kodeksi",
    content: "Mehnat kodeksi mehnat munosabatlarini tartibga soladi. U ish haqi, ish vaqti, dam olish, mehnat xavfsizligi kabi masalalarni tartibga soladi. Kodeks ish beruvchi va xodim o'rtasidagi huquqiy munosabatlarni belgilaydi.",
    article: "5-modda. Mehnat qonunchiligining asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1492385"
  },
  {
    title: "O'zbekiston Respublikasi Oilaviy kodeksi",
    content: "Oilaviy kodeksi oila munosabatlarini tartibga soladi. U nikoh, ajralish, ota-onalik va bolalik huquqlari, aliment kabi masalalarni tartibga soladi. Kodeks oila a'zolarining huquq va majburiyatlarini belgilaydi.",
    article: "1-modda. Oilaviy qonunchilikning asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1492386"
  },
  {
    title: "O'zbekiston Respublikasi Jinoyat kodeksi",
    content: "Jinoyat kodeksi jinoyatlar va ular uchun jazolarni belgilaydi. U jinoyat tarkibi, javobgarlik, jazo turlari kabi masalalarni tartibga soladi. Kodeks jamiyat uchun xavfli deb topilgan harakatlarni jinoyat deb hisoblaydi.",
    article: "3-modda. Jinoyat qonunchiligining asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1492384"
  },
  {
    title: "O'zbekiston Respublikasi Yer kodeksi",
    content: "Yer kodeksi yer munosabatlarini tartibga soladi. U yer mulki, yer foydalanish, yer ijarasi kabi masalalarni tartibga soladi. Kodeks yerning davlat mulki ekanligini va xususiy mulk bo'lishi mumkinligini belgilaydi.",
    article: "1-modda. Yer qonunchiligining asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1492388"
  }
];

export class LegalRAG {
  constructor() {
    // Mock initialization - no external dependencies
  }

  async query(question: string): Promise<{
    answer: string;
    sources: Array<{
      title: string;
      article: string;
      url: string;
    }>;
  }> {
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple keyword matching for mock responses
      const lowerQuestion = question.toLowerCase();
      let selectedDoc = legalDocuments[0]; // Default to first document
      let answer = '';

      if (lowerQuestion.includes('fuqaro') || lowerQuestion.includes('shartnoma') || lowerQuestion.includes('mulk')) {
        selectedDoc = legalDocuments[0];
        answer = "Fuqarolik kodeksiga ko'ra, fuqarolarning huquq va majburiyatlar teng himoya qilinadi. Shartnoma shartlari qonunga zid bo'lmasligi kerak. Agar shartnoma shartlari buzilsa, jabrlanuvchi tomon sudga murojaat qilish huquqiga ega.";
      } else if (lowerQuestion.includes('ish') || lowerQuestion.includes('mehnat') || lowerQuestion.includes('ish haqi')) {
        selectedDoc = legalDocuments[1];
        answer = "Mehnat kodeksiga ko'ra, ish beruvchi ish haqini vaqtida va to'liq to'lashi majbur. Ish haqi kechiksa, har kechikgan kuni uchun 0.5% miqdorda kompensatsiya to'lanishi shart. Ishchi o'z huquqlarini himoya qilish uchun Mehnat inspektsiyasiga murojaat qilishi mumkin.";
      } else if (lowerQuestion.includes('nikoh') || lowerQuestion.includes('ajrash') || lowerQuestion.includes('oila')) {
        selectedDoc = legalDocuments[2];
        answer = "Oilaviy kodeksiga ko'ra, ajralish faqat sud orqali amalga oshirilishi mumkin. Ajralish paytida bolalar manfaati birinchi o'rinda qo'yiladi. Mulkni taqsimlash da'vosi 3 yil ichida qo'yilishi kerak.";
      } else if (lowerQuestion.includes('jinoyat') || lowerQuestion.includes('jazo') || lowerQuestion.includes('javobgarlik')) {
        selectedDoc = legalDocuments[3];
        answer = "Jinoyat kodeksiga ko'ra, jinoyat tarkibi bo'lmagan harakat uchun javobgarlik belgilanmaydi. Jazo faqat sud tomonidan qo'llanilishi mumkin. Aybsizlik prezumpsiyasi tamoyili qo'llaniladi - ya'ni ayblanuvchi sud tomonidan aybdor deb topilmaguncha aybsiz hisoblanadi.";
      } else if (lowerQuestion.includes('yer') || lowerQuestion.includes('mulkiy') || lowerQuestion.includes('ijara')) {
        selectedDoc = legalDocuments[4];
        answer = "Yer kodeksiga ko'ra, yer O'zbekiston Respublikasining xususiy mulki hisoblanadi. Yerdan foydalanish tartibi qonun bilan belgilanadi. Yer ijarasi shartnoma asosida amalga oshiriladi va u notarial tasdiqlashini talab qilishi mumkin.";
      } else {
        answer = "Sizning savolingiz O'zbekiston qonunchiligiga oid. To'liq javob berish uchun qo'shimcha ma'lumot kerak bo'lishi mumkin. Tavsiya etaman: masalangizning mohiyatini aniqroq bayon qiling va tegishli qonun hujjatini ko'rib chiqamiz.";
      }

      return {
        answer,
        sources: [selectedDoc]
      };
    } catch (error) {
      console.error('RAG query error:', error);
      throw new Error('Savolni qayta ishlashda xatolik yuz berdi');
    }
  }

  async addDocument(document: {
    title: string;
    content: string;
    article: string;
    url: string;
  }) {
    // Mock implementation - just add to array
    legalDocuments.push(document);
  }

  async searchDocuments(query: string): Promise<Array<{
    title: string;
    article: string;
    url: string;
    content: string;
    score: number;
  }>> {
    // Simple keyword matching for mock search
    const lowerQuery = query.toLowerCase();
    
    const results = legalDocuments.map(doc => {
      const contentMatch = doc.content.toLowerCase().includes(lowerQuery);
      const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
      const score = contentMatch ? 0.9 : titleMatch ? 0.7 : 0.3;
      
      return {
        title: doc.title,
        article: doc.article,
        url: doc.url,
        content: doc.content,
        score
      };
    }).sort((a, b) => b.score - a.score).slice(0, 5);
    
    return results;
  }
}

// Singleton instance
export const legalRAG = new LegalRAG();
