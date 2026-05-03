// Real Legal RAG System with OpenAI Integration
import { openaiClient } from '@/lib/openai';

// Legal documents database (mock data - replace with actual Lex.uz data)
const legalDocuments = [
  {
    title: "O'zbekiston Respublikasi Fuqarolik kodeksi",
    content: "O'zbekiston Respublikasi Fuqarolik kodeksi fuqarolik huquqiy munosabatlarini tartibga soladi. U 1-iyul 1996-yildan kuchga kirgan. Kodeks fuqarolarning huquq va majburiyatlarini, shartnomalar, mulk huquqi, meros huquqi kabi masalalarni tartibga soladi. 1-modda: Fuqarolik qonunchiligining asosiy tamoyillari. 2-modda: Fuqarolik huquqiy munosabatlarining asoslari. 7-modda: Fuqarolarning huquq va majburiyatlari tengligi. 350-modda: Shartnomaning bajarilishi. 367-modda: Majburiyatni noto'g'ri bajarish oqibatida yetkazilgan zararning qoplanishi.",
    article: "1-modda. Fuqarolik qonunchiligining asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1492387"
  },
  {
    title: "O'zbekiston Respublikasi Mehnat kodeksi",
    content: "Mehnat kodeksi mehnat munosabatlarini tartibga soladi. U ish haqi, ish vaqti, dam olish, mehnat xavfsizligi kabi masalalarni tartibga soladi. Kodeks ish beruvchi va xodim o'rtasidagi huquqiy munosabatlarni belgilaydi. 5-modda: Mehnat qonunchiligining asosiy tamoyillari. 79-modda: Mehnat shartnomasi. 84-modda: Ish haqini to'lash. 237-modda: Ish haqini to'lash muddatining buzilishi. 238-modda: Kechikma uchun to'lanadigan kompensatsiya.",
    article: "5-modda. Mehnat qonunchiligining asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1493359"
  },
  {
    title: "O'zbekiston Respublikasi Oilaviy kodeksi",
    content: "Oilaviy kodeksi oila munosabatlarini tartibga soladi. U nikoh, ajralish, ota-onalik va bolalik huquqlari, aliment kabi masalalarni tartibga soladi. Kodeks oila a'zolarining huquq va majburiyatlarini belgilaydi. 1-modda: Oilaviy qonunchilikning asosiy tamoyillari. 55-modda: Ajralish to'g'risida da'vo qo'yish. 58-modda: Ajralishda bolalar manfaati. 62-modda: Mulkni taqsimlash.",
    article: "1-modda. Oilaviy qonunchilikning asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1492386"
  },
  {
    title: "O'zbekiston Respublikasi Jinoyat kodeksi",
    content: "Jinoyat kodeksi jinoyatlar va ular uchun jazolarni belgilaydi. U jinoyat tarkibi, javobgarlik, jazo turlari kabi masalalarni tartibga soladi. Kodeks jamiyat uchun xavfli deb topilgan harakatlarni jinoyat deb hisoblaydi. 3-modda: Jinoyat qonunchiligining asosiy tamoyillari. 15-modda: Aybsizlik prezumpsiyasi. 27-modda: Jazo turlari.",
    article: "3-modda. Jinoyat qonunchiligining asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1492384"
  },
  {
    title: "O'zbekiston Respublikasi Yer kodeksi",
    content: "Yer kodeksi yer munosabatlarini tartibga soladi. U yer mulki, yer foydalanish, yer ijarasi kabi masalalarni tartibga soladi. Kodeks yerning davlat mulki ekanligini va xususiy mulk bo'lishi mumkinligini belgilaydi. 1-modda: Yer qonunchiligining asosiy tamoyillari. 7-modda: Yer mulki. 36-modda: Yer ijarasi shartnomasi.",
    article: "1-modda. Yer qonunchiligining asosiy tamoyillari",
    url: "https://lex.uz/acts/-/text/1492388"
  }
];

export class LegalRAG {
  constructor() {
    // Real OpenAI integration
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
      // Find relevant documents based on keywords
      const relevantDocs = this.findRelevantDocuments(question);
      
      // Create context from relevant documents
      const context = relevantDocs.map(doc => 
        `${doc.title}: ${doc.content.substring(0, 500)}...`
      ).join('\n\n');

      // Create prompt with context
      const prompt = `
Siz O'zbekiston qonunchilik bo'yicha mutaxassis AI yordamchisidir. Quyidagi kontekstga asoslanib, foydalanuvchining savoliga javob bering:

Kontekst:
${context}

Savol: ${question}

Javob berishda quyidagilarga e'tibor bering:
1. Javob aniq, tushunarli va qisqa bo'lsin
2. Kontekstdagi ma'lumotlarga asoslaning
3. Agar javob berish uchun yetarli ma'lumot bo'lmasa, buni ayting
4. Javob oxirida qaysi qonun hujjatiga asoslanganini ko'rsating
5. O'zbek tilida javob bering
6. Amaliy maslahatlar bering

Javob:
      `;

      // Get response from OpenAI
      const answer = await openaiClient.generateText(prompt);

      return {
        answer,
        sources: relevantDocs.map(doc => ({
          title: doc.title,
          article: doc.article,
          url: doc.url,
        }))
      };
    } catch (error) {
      console.error('RAG query error:', error);
      throw new Error('Savolni qayta ishlashda xatolik yuz berdi');
    }
  }

  private findRelevantDocuments(question: string) {
    const lowerQuestion = question.toLowerCase();
    const relevantDocs = [];

    // Keyword matching for relevant documents
    if (lowerQuestion.includes('fuqaro') || lowerQuestion.includes('shartnoma') || lowerQuestion.includes('mulk') || lowerQuestion.includes('meros')) {
      relevantDocs.push(legalDocuments[0]);
    }
    if (lowerQuestion.includes('ish') || lowerQuestion.includes('mehnat') || lowerQuestion.includes('ish haqi') || lowerQuestion.includes('ish beruvchi')) {
      relevantDocs.push(legalDocuments[1]);
    }
    if (lowerQuestion.includes('nikoh') || lowerQuestion.includes('ajrash') || lowerQuestion.includes('oila') || lowerQuestion.includes('bolalar')) {
      relevantDocs.push(legalDocuments[2]);
    }
    if (lowerQuestion.includes('jinoyat') || lowerQuestion.includes('jazo') || lowerQuestion.includes('javobgarlik') || lowerQuestion.includes('sud')) {
      relevantDocs.push(legalDocuments[3]);
    }
    if (lowerQuestion.includes('yer') || lowerQuestion.includes('mulkiy') || lowerQuestion.includes('ijara') || lowerQuestion.includes('yer mulki')) {
      relevantDocs.push(legalDocuments[4]);
    }

    // If no specific keywords found, return first document as default
    if (relevantDocs.length === 0) {
      relevantDocs.push(legalDocuments[0]);
    }

    return relevantDocs;
  }

  async addDocument(document: {
    title: string;
    content: string;
    article: string;
    url: string;
  }) {
    // Add to documents array
    legalDocuments.push(document);
  }

  async searchDocuments(query: string): Promise<Array<{
    title: string;
    article: string;
    url: string;
    content: string;
    score: number;
  }>> {
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
