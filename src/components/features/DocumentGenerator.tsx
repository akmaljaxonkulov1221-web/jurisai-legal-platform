'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { api } from '@/services/api';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: DocumentField[];
}

interface DocumentField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'number';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface GeneratedDocument {
  id: string;
  title: string;
  content: string;
  template_id: string;
  created_at: string;
  status: 'draft' | 'completed';
}

export default function DocumentGenerator() {
  const [activeTab, setActiveTab] = useState<'templates' | 'generator' | 'history'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<GeneratedDocument | null>(null);

  useEffect(() => {
    loadTemplates();
    loadGeneratedDocuments();
  }, []);

  const loadTemplates = async () => {
    try {
      console.log('Loading document templates...');
      // Mock templates for demo
      const mockTemplates: DocumentTemplate[] = [
          {
            id: '1',
            name: 'Shartnoma',
            description: 'Tijorat shartnomasi shabloni',
            category: 'civil',
            fields: [
              { id: 'title', name: 'Shartnoma nomi', type: 'text', required: true, placeholder: 'Shartnoma nomini kiriting' },
              { id: 'party1', name: 'Birinchi tomon', type: 'text', required: true, placeholder: 'Tamon nomi' },
              { id: 'party2', name: 'Ikkinchi tomon', type: 'text', required: true, placeholder: 'Tamon nomi' },
              { id: 'amount', name: 'Summa', type: 'number', required: true, placeholder: 'Shartnoma summasi' },
              { id: 'date', name: 'Sanasi', type: 'date', required: true },
              { id: 'terms', name: 'Shartlar', type: 'textarea', required: true, placeholder: 'Shartnoma shartlari' }
            ]
          },
          {
            id: '2',
            name: 'Ariza',
            description: 'Rasmiy ariza shabloni',
            category: 'administrative',
            fields: [
              { id: 'recipient', name: 'Qabul qiluvchi', type: 'text', required: true, placeholder: 'Tashkilot nomi' },
              { id: 'applicant', name: 'Ariza beruvchi', type: 'text', required: true, placeholder: 'F.I.O' },
              { id: 'subject', name: 'Mavzu', type: 'text', required: true, placeholder: 'Ariza mavzusi' },
              { id: 'content', name: 'Mazmun', type: 'textarea', required: true, placeholder: 'Ariza matni' },
              { id: 'date', name: 'Sanasi', type: 'date', required: true }
            ]
          },
          {
            id: '3',
            name: 'Vasiyatnoma',
            description: 'Vasiyatnoma shabloni',
            category: 'family',
            fields: [
              { id: 'testator', name: 'Vasiyatnomachi', type: 'text', required: true, placeholder: 'F.I.O' },
              { id: 'beneficiaries', name: 'Vorisilar', type: 'textarea', required: true, placeholder: 'Vorisilar ro\'yxati' },
              { id: 'assets', name: 'Mulk', type: 'textarea', required: true, placeholder: 'Bo\'linadigan mulk' },
              { id: 'date', name: 'Sanasi', type: 'date', required: true }
            ]
          }
        ];
        setTemplates(mockTemplates);
      console.log('Mock document templates loaded successfully');
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadGeneratedDocuments = async () => {
    try {
      // Mock data for demo
      const mockDocuments: GeneratedDocument[] = [
        {
          id: '1',
          title: 'Tijorat shartnomasi',
          content: 'Bu tijorat shartnomasi matni...',
          template_id: '1',
          created_at: '2024-01-15',
          status: 'completed'
        },
        {
          id: '2',
          title: 'Ariza',
          content: 'Bu ariza matni...',
          template_id: '2',
          created_at: '2024-01-10',
          status: 'draft'
        }
      ];
      setGeneratedDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setActiveTab('generator');
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    try {
      // Mock document generation
      const newDocument: GeneratedDocument = {
        id: Date.now().toString(),
        title: `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
        content: generateDocumentContent(selectedTemplate, formData),
        template_id: selectedTemplate.id,
        created_at: new Date().toISOString(),
        status: 'completed'
      };

      setGeneratedDocuments(prev => [newDocument, ...prev]);
      setCurrentDocument(newDocument);
      
      // Reset form
      setFormData({});
      setActiveTab('history');
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDocumentContent = (template: DocumentTemplate, data: Record<string, string>): string => {
    let content = `${template.name}\n\n`;
    
    template.fields.forEach(field => {
      if (data[field.id]) {
        content += `${field.name}: ${data[field.id]}\n\n`;
      }
    });

    content += `Hujjat avtomatik ravishda JurisAI platformasi orqali generatsiya qilindi.\n`;
    content += `Yaratilgan sana: ${new Date().toLocaleDateString('uz-UZ')}\n`;
    content += `Status: ${template.category} huquqiy hujjat`;

    return content;
  };

  const handleDownloadDocument = (document: GeneratedDocument) => {
    try {
      // Create blob from document content
      const blob = new Blob([document.content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.title.replace(/\s+/g, '_')}.txt`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Clean up URL
      window.URL.revokeObjectURL(url);
      
      console.log('Document downloaded successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleEditDocument = (document: GeneratedDocument) => {
    try {
      // Find the template for this document
      const template = templates.find(t => t.id === document.template_id);
      if (template) {
        setSelectedTemplate(template);
        setActiveTab('generator');
        
        // Parse document content to extract form data (simplified implementation)
        const lines = document.content.split('\n');
        const parsedData: Record<string, string> = {};
        
        template.fields.forEach(field => {
          const fieldLine = lines.find(line => line.startsWith(`${field.name}:`));
          if (fieldLine) {
            parsedData[field.id] = fieldLine.replace(`${field.name}:`, '').trim();
          }
        });
        
        setFormData(parsedData);
        console.log('Document loaded for editing');
      }
    } catch (error) {
      console.error('Error editing document:', error);
    }
  };

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-900">Hujjat shablonlari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-all cursor-pointer"
                onClick={() => handleTemplateSelect(template)}
              >
                <h3 className="font-semibold text-blue-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <Badge className="bg-green-100 text-green-800">
                  {template.category}
                </Badge>
                <div className="mt-3 text-sm text-gray-500">
                  {template.fields.length} maydon
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGeneratorTab = () => {
    if (!selectedTemplate) {
      return (
        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shablon tanlanmagan</h3>
            <p className="text-gray-600 mb-6">Avval shablonni tanlang</p>
            <Button
              onClick={() => setActiveTab('templates')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Shablonlarni ko'rish
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-blue-900">
              {selectedTemplate.name} - Hujjat yaratish
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.name} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'text' && (
                  <Input
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}
                
                {field.type === 'textarea' && (
                  <textarea
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    required={field.required}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                
                {field.type === 'date' && (
                  <Input
                    type="date"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}
                
                {field.type === 'number' && (
                  <Input
                    type="number"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}
                
                {field.type === 'select' && field.options && (
                  <Select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    options={field.options.map(option => ({ value: option, label: option }))}
                  />
                )}
              </div>
            ))}
            
            <div className="flex gap-4">
              <Button
                onClick={handleGenerateDocument}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Yaratilmoqda...' : '📄 Hujjatni yaratish'}
              </Button>
              <Button
                onClick={() => setActiveTab('templates')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Orqaga
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-900">Yaratilgan hujjatlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedDocuments.map((document) => (
              <div
                key={document.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setCurrentDocument(document)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{document.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(document.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={
                    document.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }>
                    {document.status === 'completed' ? 'Tugallangan' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {document.content.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentDocument && (
        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-blue-900">Hujjat ko'rish</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">{currentDocument.title}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleDownloadDocument(currentDocument)}
                  >
                    📥 Yuklab olish
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => handleEditDocument(currentDocument)}
                  >
                    ✏️ Tahrirlash
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-gray-700">
                  {currentDocument.content}
                </pre>
              </div>
              
              <div className="text-sm text-gray-500">
                Yaratilgan: {new Date(currentDocument.created_at).toLocaleDateString('uz-UZ')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Document Generator</h1>
          <p className="text-blue-700">Huquqiy hujjatlar avtomatik generatsiyasi</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-1">
          {[
            { id: 'templates', label: '📋 Shablonlar', icon: '📋' },
            { id: 'generator', label: '✏️ Generator', icon: '✏️' },
            { id: 'history', label: '📚 Tarix', icon: '📚' }
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
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'generator' && renderGeneratorTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>
    </div>
  );
}
