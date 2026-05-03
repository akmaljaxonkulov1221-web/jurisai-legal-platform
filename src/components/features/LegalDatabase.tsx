'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { api } from '@/services/api';

interface LegalArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  document_type: string;
  article_number: string;
  chapter: string;
  section?: string;
  keywords: string[];
  cross_references: string[];
  last_updated: string;
  relevance_score: number;
  view_count: number;
}

interface SearchResult {
  articles: LegalArticle[];
  total: number;
  query: string;
  search_time: number;
  suggestions: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  document_count: number;
  document_type: string;
}

export default function LegalDatabase() {
  const [activeTab, setActiveTab] = useState<'search' | 'categories' | 'popular' | 'bookmarks'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularDocuments, setPopularDocuments] = useState<LegalArticle[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<LegalArticle | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    loadPopularDocuments();
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadPopularDocuments();
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      console.log('Loading legal categories...');
      // Mock categories data
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Fuqarolik huquqi',
          description: 'Fuqarolik kodeksi va tegishli hujjatlar',
          document_count: 1250,
          document_type: 'Civil Code'
        },
        {
          id: '2',
          name: 'Jinoyat huquqi',
          description: 'Jinoyat kodeksi va protsessual qonunlar',
          document_count: 890,
          document_type: 'Criminal Code'
        },
        {
          id: '3',
          name: 'Mehnat huquqi',
          description: 'Mehnat kodeksi va ish huquqi',
          document_count: 450,
          document_type: 'Labor Code'
        },
        {
          id: '4',
          name: 'Oila huquqi',
          description: 'Oilaviy munosabatlar va nikoh',
          document_count: 320,
          document_type: 'Family Code'
        },
        {
          id: '5',
          name: 'Yer huquqi',
          description: 'Yer munosabatlari va mulkchilik',
          document_count: 280,
          document_type: 'Land Code'
        }
      ];
      setCategories(mockCategories);
      console.log('Mock legal categories loaded successfully');
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadPopularDocuments = async () => {
    try {
      console.log('Loading popular documents...');
      // Mock popular documents
      const mockPopularDocuments: LegalArticle[] = [
        {
          id: 'art_1',
          title: 'FK 1-modda - Fuqarolik huquqining asoslari',
          content: 'O\'zbekiston Respublikasida fuqarolik huquqiy qoidalar...',
          category: 'Fuqarolik huquqi',
          document_type: 'Civil Code',
          article_number: '1',
          chapter: '1-bob',
          keywords: ['fuqarolik huquqi', 'asoslar', 'munosabatlar'],
          cross_references: ['FK 2-modda', 'FK 3-modda'],
          last_updated: '2024-01-15',
          relevance_score: 95,
          view_count: 1250
        },
        {
          id: 'art_2',
          title: 'JK 27-modda - Jinoyat tarkibi',
          content: 'Jinoyatni tashkil etuvchi obyektiv va subyektiv belgilar...',
          category: 'Jinoyat huquqi',
          document_type: 'Criminal Code',
          article_number: '27',
          chapter: '3-bob',
          keywords: ['jinoyat tarkibi', 'belgilar', 'mas\'uliyat'],
          cross_references: ['JK 28-modda', 'JK 29-modda'],
          last_updated: '2024-01-10',
          relevance_score: 92,
          view_count: 980
        },
        {
          id: 'art_3',
          title: 'MK 161-modda - Ishdan bo\'shatish asoslari',
          content: 'Ishchi va xodimlarni ishdan bo\'shatishning asoslari...',
          category: 'Mehnat huquqi',
          document_type: 'Labor Code',
          article_number: '161',
          chapter: '9-bob',
          keywords: ['ishdan bo\'shatish', 'asoslar', 'mehnat'],
          cross_references: ['MK 162-modda', 'MK 242-modda'],
          last_updated: '2024-01-12',
          relevance_score: 88,
          view_count: 750
        }
      ];
      setPopularDocuments(mockPopularDocuments);
      console.log('Mock popular documents loaded successfully');
    } catch (error) {
      console.error('Error loading popular documents:', error);
    }
  };

  const loadBookmarks = async () => {
    try {
      console.log('Loading bookmarks...');
      // Mock bookmarks
      const mockBookmarks = [
        {
          id: 'bm_1',
          article_id: 'art_1',
          title: 'FK 1-modda - Fuqarolik huquqining asoslari',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 'bm_2',
          article_id: 'art_2',
          title: 'JK 27-modda - Jinoyat tarkibi',
          created_at: '2024-01-14T14:20:00Z'
        }
      ];
      setBookmarks(mockBookmarks);
      console.log('Mock bookmarks loaded successfully');
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      console.log('Searching legal database for:', searchQuery);
      // Mock search results
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const mockSearchResult: SearchResult = {
        articles: [
          {
            id: 'search_1',
            title: `Qidiruv natijasi: ${searchQuery}`,
            content: `Sizning "${searchQuery}" so'rovingiz bo'yicha topilgan ma'lumotlar...`,
            category: selectedCategory || 'Barchasi',
            document_type: selectedDocumentType || 'Various',
            article_number: '1',
            chapter: '1-bob',
            keywords: [searchQuery, 'huquq', 'qonun'],
            cross_references: ['FK 2-modda', 'JK 3-modda'],
            last_updated: '2024-01-15',
            relevance_score: 95,
            view_count: Math.floor(Math.random() * 1000) + 100
          },
          {
            id: 'search_2',
            title: `Qo\'shimcha natija: ${searchQuery}`,
            content: `Qo\'shimcha ma'lumotlar "${searchQuery}" haqida...`,
            category: selectedCategory || 'Barchasi',
            document_type: selectedDocumentType || 'Various',
            article_number: '2',
            chapter: '2-bob',
            keywords: [searchQuery, 'qoida', 'tartib'],
            cross_references: ['FK 5-modda', 'MK 7-modda'],
            last_updated: '2024-01-14',
            relevance_score: 88,
            view_count: Math.floor(Math.random() * 800) + 50
          }
        ],
        total: 2,
        query: searchQuery,
        search_time: 0.5,
        suggestions: [`${searchQuery} haqida ko'proq`, `${searchQuery} tahlili`, `${searchQuery} qo'llanma`]
      };
      
      setSearchResults(mockSearchResult);
      console.log('Mock search results loaded successfully');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = async (article: LegalArticle) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const handleBookmark = async (articleId: string) => {
    try {
      console.log('Bookmarking article:', articleId);
      // Mock bookmark action
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBookmark = {
        id: 'bm_' + Date.now(),
        article_id: articleId,
        title: 'Yangi bookmark',
        created_at: new Date().toISOString()
      };
      
      setBookmarks(prev => [...prev, newBookmark]);
      console.log('Mock bookmark added successfully');
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const handleRemoveBookmark = async (documentId: string) => {
    try {
      console.log('Removing bookmark:', documentId);
      // Mock remove bookmark action
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBookmarks(prev => prev.filter(bm => bm.id !== documentId));
      console.log('Mock bookmark removed successfully');
    } catch (error) {
      console.error('Remove bookmark error:', error);
    }
  };

  const renderSearchTab = () => (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-900">Qonunlarda Qidiruv</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Qidiruv so'zini kiriting..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Qidirilmoqda...' : 'Qidirish'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriyani tanlang
              </label>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: '', label: 'Barcha kategoriyalar' },
                  ...categories.map(cat => ({ value: cat.id, label: cat.name }))
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hujjat turini tanlang
              </label>
              <Select
                value={selectedDocumentType}
                onChange={(e) => setSelectedDocumentType(e.target.value)}
                options={[
                  { value: '', label: 'Barcha turlar' },
                  { value: 'code', label: 'Kodeks' },
                  { value: 'law', label: 'Qonun' },
                  { value: 'decree', label: 'Farmon' },
                  { value: 'constitution', label: 'Konstitutsiya' }
                ]}
              />
            </div>
          </div>

          {/* Search Suggestions */}
          {searchResults?.suggestions && searchResults.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Takliflar:</span>
              {searchResults.suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    handleSearch();
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-blue-900">
              Qidiruv Natijalari ({searchResults.total} ta)
            </CardTitle>
            <p className="text-sm text-gray-600">
              Qidiruv vaqti: {searchResults.search_time.toFixed(2)} soniya
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.articles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-all cursor-pointer"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-blue-900">{article.title}</h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {article.article_number}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {article.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        {article.category}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800">
                        {article.document_type}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-500">
                        {article.view_count} marta ko'rilgan
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(article.id);
                        }}
                      >
                        📚
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-900">Qonun Kategoriyalari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setActiveTab('popular');
                }}
              >
                <h3 className="font-semibold text-blue-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-100 text-green-800">
                    {category.document_count} hujjat
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800">
                    {category.document_type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPopularTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Mashhur Qonun Hujjatlari
            {selectedCategory && ` - ${categories.find(c => c.id === selectedCategory)?.name}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularDocuments.map((article, index) => (
              <div
                key={article.id}
                className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200 hover:border-orange-400 transition-all cursor-pointer"
                onClick={() => handleArticleClick(article)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800">
                      #{index + 1}
                    </Badge>
                    <h3 className="font-semibold text-blue-900">{article.title}</h3>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {article.article_number}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {article.content}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      {article.category}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      {article.document_type}
                    </Badge>
                  </div>
                  <span className="text-sm text-orange-600 font-medium">
                    {article.view_count} marta ko'rilgan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBookmarksTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-900">Bookmarklar ({bookmarks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Bookmarklar mavjud emas</p>
              <Button
                onClick={() => setActiveTab('search')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Qidiruvga o'tish
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-400 transition-all cursor-pointer"
                  onClick={() => {
                    // Load and show the bookmarked document
                    handleSearch();
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Hujjat ID: {bookmark.document_id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(bookmark.created_at).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBookmark(bookmark.document_id);
                      }}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderArticleModal = () => {
    if (!selectedArticle || !showArticleModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  {selectedArticle.title}
                </h2>
                <div className="flex gap-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedArticle.article_number}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {selectedArticle.category}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800">
                    {selectedArticle.document_type}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowArticleModal(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bob:</h3>
                <p className="text-gray-700">{selectedArticle.chapter}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mazmun:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedArticle.content}
                  </p>
                </div>
              </div>

              {selectedArticle.keywords.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Kalit so'zlar:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.keywords.map((keyword, index) => (
                      <Badge key={index} className="bg-gray-100 text-gray-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Oxirgi yangilanish: {new Date(selectedArticle.last_updated).toLocaleDateString('uz-UZ')}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBookmark(selectedArticle.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    📚 Bookmark qilish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Legal Database</h1>
          <p className="text-blue-700">O'zbekiston qonunchilik ma'lumotlar bazasi</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-1">
          {[
            { id: 'search', label: '🔍 Qidiruv', icon: '🔍' },
            { id: 'categories', label: '📚 Kategoriyalar', icon: '📚' },
            { id: 'popular', label: '⭐ Mashhur', icon: '⭐' },
            { id: 'bookmarks', label: '🔖 Bookmarklar', icon: '🔖' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'search' && renderSearchTab()}
        {activeTab === 'categories' && renderCategoriesTab()}
        {activeTab === 'popular' && renderPopularTab()}
        {activeTab === 'bookmarks' && renderBookmarksTab()}

        {/* Article Modal */}
        {renderArticleModal()}
      </div>
    </div>
  );
}
