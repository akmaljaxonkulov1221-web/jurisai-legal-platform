import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';

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
  private vectorStore!: MemoryVectorStore;
  private llm!: ChatOpenAI;
  private retrievalChain: any;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not configured, RAG system disabled');
      return;
    }
    this.initializeRAG();
  }

  private async initializeRAG() {
    // Initialize OpenAI model
    this.llm = new ChatOpenAI({
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    // Create embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create documents from legal database
    const documents = legalDocuments.map(doc => 
      new Document({
        pageContent: doc.content,
        metadata: {
          title: doc.title,
          article: doc.article,
          url: doc.url,
        },
      })
    );

    // Create vector store
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      embeddings
    );

    // Create retrieval chain
    const prompt = PromptTemplate.fromTemplate(`
      Siz O'zbekiston qonunchilik bo'yicha mutaxassis yuridik AI yordamchisidir. 
      Quyidagi kontekstga asoslanib, foydalanuvchining savoliga javob bering:

      Kontekst:
      {context}

      Savol: {question}

      Javob berishda quyidagilarga e'tibor bering:
      1. Javob aniq, tushunarli va qisqa bo'lsin
      2. Kontekstdagi ma'lumotlarga asoslaning
      3. Agar javob berish uchun yetarli ma'lumot bo'lmasa, buni ayting
      4. Javob oxirida qaysi qonun hujjatiga asoslanganini ko'rsating
      5. O'zbek tilida javob bering

      Javob:
    `);

    const documentChain = await createStuffDocumentsChain({
      llm: this.llm,
      prompt: prompt as any,
      outputParser: new StringOutputParser() as any,
    });

    this.retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain as any,
      retriever: this.vectorStore.asRetriever(),
    });
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
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }
      
      // Retrieve relevant documents and generate answer
      const response = await this.retrievalChain.invoke({
        question,
      });

      // Extract sources from context
      const sources = response.context?.map((doc: any) => ({
        title: doc.metadata.title,
        article: doc.metadata.article,
        url: doc.metadata.url,
      })) || [];

      return {
        answer: response.answer,
        sources,
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
    const doc = new Document({
      pageContent: document.content,
      metadata: {
        title: document.title,
        article: document.article,
        url: document.url,
      },
    });

    await this.vectorStore.addDocuments([doc]);
  }

  async searchDocuments(query: string): Promise<Array<{
    title: string;
    article: string;
    url: string;
    content: string;
    score: number;
  }>> {
    const results = await this.vectorStore.similaritySearchWithScore(query, 5);
    
    return results.map(([doc, score]: [any, number]) => ({
      title: doc.metadata.title,
      article: doc.metadata.article,
      url: doc.metadata.url,
      content: doc.pageContent,
      score,
    }));
  }
}

// Singleton instance
export const legalRAG = new LegalRAG();
