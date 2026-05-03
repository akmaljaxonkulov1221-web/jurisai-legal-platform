'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/services/auth';
import { api } from '@/services/api';

interface IRACAnalysis {
  id: string;
  issue: string;
  rule: string;
  application: string;
  conclusion: string;
  scores: {
    issue: number;
    rule: number;
    application: number;
    conclusion: number;
  };
  total_score: number;
  feedback: string;
  suggestions: string[];
  processing_time: number;
  status: string;
  created_at: string;
  case_type: string;
  difficulty_level: string;
}

interface AnalysisRequest {
  case_text: string;
  case_type: string;
  difficulty_level: string;
}

export default function IRACCaseSolver() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analyze');
  const [caseText, setCaseText] = useState('');
  const [caseType, setCaseType] = useState('civil');
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [currentAnalysis, setCurrentAnalysis] = useState<IRACAnalysis | null>(null);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Mock API hooks instead of real API calls
  const analyzeIRAC = useApi<IRACAnalysis>(async (request: AnalysisRequest) => {
    console.log('Analyzing IRAC case...', request);
    // Mock IRAC analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      id: 'irac_' + Date.now(),
      issue: `Issue: ${request.case_text.substring(0, 100)}...`,
      rule: 'Rule: O\'zbekiston Respublikasi Fuqarolik kodeksining 342-moddasiga ko\'ra...',
      application: 'Application: Mazkur holatda qonun qoidasi quyidagicha qo\'llaniladi...',
      conclusion: 'Conclusion: Shu asosda, da\'vo qanoatlantirilishi lozim.',
      scores: {
        issue: Math.floor(Math.random() * 20) + 80,
        rule: Math.floor(Math.random() * 20) + 80,
        application: Math.floor(Math.random() * 20) + 80,
        conclusion: Math.floor(Math.random() * 20) + 80
      },
      total_score: Math.floor(Math.random() * 15) + 85,
      feedback: 'Yaxshi tahlil! Issue aniq belgilangan, rule to\'g\'ri keltirilgan.',
      suggestions: ['Application ni yanada chuqurroq tahlil qiling', 'More dalillar keltiring'],
      processing_time: 2.5,
      status: 'completed',
      created_at: new Date().toISOString(),
      case_type: request.case_type,
      difficulty_level: request.difficulty_level
    };
  });
  
  const updateAnalysis = useApi<any>(async (id: string, data: any) => {
    console.log('Updating IRAC analysis:', id, data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Analysis updated successfully' };
  });
  
  const getAnalyses = useApi<{ analyses: IRACAnalysis[]; total: number }>(async () => {
    console.log('Loading IRAC analyses...');
    // Mock analyses data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      analyses: [
        {
          id: 'irac_1',
          issue: 'Issue: Shartnoma buzilishi holati',
          rule: 'Rule: FK 342-moddaga ko\'ra, shartnoma tomonlari o\'z majburiyatlarini...',
          application: 'Application: Bu holatda birinchi tomon majburiyatlarini bajarmagan...',
          conclusion: 'Conclusion: Shu sababli, ikkinchi tomon da\'vo qilishi huquqiga ega.',
          scores: { issue: 85, rule: 90, application: 82, conclusion: 88 },
          total_score: 86,
          feedback: 'Yaxshi ishlangan IRAC tahlili',
          suggestions: ['Dalillarni kuchaytirishingiz mumkin'],
          processing_time: 2.1,
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z',
          case_type: 'civil',
          difficulty_level: 'medium'
        },
        {
          id: 'irac_2',
          issue: 'Issue: Mehnat munosabatlari tugatilishi',
          rule: 'Rule: MK 161-moddaga ko\'ra, ishdan bo\'shatish asoslari...',
          application: 'Application: Xodimning ishga kelmasligi 3 kun davom etgan...',
          conclusion: 'Conclusion: Ish beruvchi xodimni ishdan bo\'shatishga haqli.',
          scores: { issue: 88, rule: 85, application: 90, conclusion: 87 },
          total_score: 87,
          feedback: 'Mukammal tahlil',
          suggestions: ['Qo\'shimcha dalillar keltiring'],
          processing_time: 1.8,
          status: 'completed',
          created_at: '2024-01-14T14:20:00Z',
          case_type: 'labor',
          difficulty_level: 'hard'
        }
      ],
      total: 2
    };
  });
  const [analyses, setAnalyses] = useState<IRACAnalysis[]>([]);

  useEffect(() => {
    if (user) {
      loadAnalyses();
    }
  }, [user]);

  const loadAnalyses = async () => {
    try {
      const result = await getAnalyses.execute();
      if (result) {
        setAnalyses(result.analyses);
      }
    } catch (error) {
      console.error('Analyses loading error:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!caseText.trim()) {
      alert('Iltimos, case matnini kiriting');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const request: AnalysisRequest = {
        case_text: caseText,
        case_type: caseType,
        difficulty_level: difficultyLevel
      };

      const result = await analyzeIRAC.execute(request);
      if (result) {
        setCurrentAnalysis(result);
        setActiveTab('results');
        await loadAnalyses(); // Reload analyses list
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('IRAC tahlili xatolik yuz berdi');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEditComponent = (component: string, content: string) => {
    setEditingComponent(component);
    setEditContent(content);
  };

  const handleSaveEdit = async () => {
    if (!currentAnalysis || !editingComponent) return;

    try {
      const result = await updateAnalysis.execute(currentAnalysis.id, {
        component: editingComponent,
        content: editContent
      });

      if (result) {
        setCurrentAnalysis({
          ...currentAnalysis,
          [editingComponent]: editContent
        });
        setEditingComponent(null);
        setEditContent('');
        await loadAnalyses();
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Tahrirlash xatolik yuz berdi');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">IRAC Case Solver</h1>
          <p className="text-blue-700">O'zbekiston qonunchiligiga moslashgan IRAC metodologiyasi bo'yicha tahlil</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm rounded-2xl p-1">
            <TabsTrigger value="analyze" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Tahlil
            </TabsTrigger>
            <TabsTrigger value="results" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Natijalar
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Tarix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Case Matni</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Textarea
                      placeholder="Tahlil qilinadigan case matnini kiriting..."
                      value={caseText}
                      onChange={(e) => setCaseText(e.target.value)}
                      className="min-h-[300px] bg-white/50 rounded-xl border-blue-200 focus:border-blue-400"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Case Turi
                        </label>
                        <Select 
                          value={caseType} 
                          onChange={(e) => setCaseType(e.target.value)}
                          options={[
                            { value: "civil", label: "Fuqarolik" },
                            { value: "criminal", label: "Jinoyat" },
                            { value: "family", label: "Oila" },
                            { value: "labor", label: "Mehnat" },
                            { value: "administrative", label: "Ma'muriy" }
                          ]}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Qiyinlik Darajasi
                        </label>
                        <Select 
                          value={difficultyLevel} 
                          onChange={(e) => setDifficultyLevel(e.target.value)}
                          options={[
                            { value: "beginner", label: "Boshlang'ich" },
                            { value: "intermediate", label: "O'rta" },
                            { value: "advanced", label: "Yuqori" },
                            { value: "expert", label: "Ekspert" }
                          ]}
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !caseText.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold"
                    >
                      {isAnalyzing ? 'Tahlil qilinmoqda...' : 'IRAC Tahlilini Boshlash'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-900">IRAC Metodologiyasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">Issue</h4>
                      <p className="text-sm text-blue-700">Masalani aniqlash va to'g'ri formulirovka qilish</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">Rule</h4>
                      <p className="text-sm text-blue-700">Tegishli qonun va qoidalarni topish</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">Application</h4>
                      <p className="text-sm text-blue-700">Qoidalarni vaziyatga qo'llash</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">Conclusion</h4>
                      <p className="text-sm text-blue-700">Mantiqiy xulosa chiqarish</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {currentAnalysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Issue */}
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-blue-900">Issue</CardTitle>
                      <Badge className={getScoreBadge(currentAnalysis.scores.issue)}>
                        {currentAnalysis.scores.issue.toFixed(1)}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      {editingComponent === 'issue' ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px] bg-white/50 rounded-xl border-blue-200"
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                              Saqlash
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingComponent(null)}
                              className="border-blue-200 text-blue-700"
                            >
                              Bekor qilish
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed">{currentAnalysis.issue}</p>
                          <Button
                            variant="outline"
                            onClick={() => handleEditComponent('issue', currentAnalysis.issue)}
                            className="border-blue-200 text-blue-700"
                          >
                            Tahrirlash
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Rule */}
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-blue-900">Rule</CardTitle>
                      <Badge className={getScoreBadge(currentAnalysis.scores.rule)}>
                        {currentAnalysis.scores.rule.toFixed(1)}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      {editingComponent === 'rule' ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px] bg-white/50 rounded-xl border-blue-200"
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                              Saqlash
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingComponent(null)}
                              className="border-blue-200 text-blue-700"
                            >
                              Bekor qilish
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed">{currentAnalysis.rule}</p>
                          <Button
                            variant="outline"
                            onClick={() => handleEditComponent('rule', currentAnalysis.rule)}
                            className="border-blue-200 text-blue-700"
                          >
                            Tahrirlash
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Application */}
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-blue-900">Application</CardTitle>
                      <Badge className={getScoreBadge(currentAnalysis.scores.application)}>
                        {currentAnalysis.scores.application.toFixed(1)}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      {editingComponent === 'application' ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px] bg-white/50 rounded-xl border-blue-200"
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                              Saqlash
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingComponent(null)}
                              className="border-blue-200 text-blue-700"
                            >
                              Bekor qilish
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed">{currentAnalysis.application}</p>
                          <Button
                            variant="outline"
                            onClick={() => handleEditComponent('application', currentAnalysis.application)}
                            className="border-blue-200 text-blue-700"
                          >
                            Tahrirlash
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Conclusion */}
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-blue-900">Conclusion</CardTitle>
                      <Badge className={getScoreBadge(currentAnalysis.scores.conclusion)}>
                        {currentAnalysis.scores.conclusion.toFixed(1)}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      {editingComponent === 'conclusion' ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px] bg-white/50 rounded-xl border-blue-200"
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                              Saqlash
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingComponent(null)}
                              className="border-blue-200 text-blue-700"
                            >
                              Bekor qilish
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed">{currentAnalysis.conclusion}</p>
                          <Button
                            variant="outline"
                            onClick={() => handleEditComponent('conclusion', currentAnalysis.conclusion)}
                            className="border-blue-200 text-blue-700"
                          >
                            Tahrirlash
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">Hali hech qanday tahlil o'tkazilmagan</p>
                  <Button 
                    onClick={() => setActiveTab('analyze')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Tahlilni Boshlash
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis) => (
                <Card 
                  key={analysis.id} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                  onClick={() => {
                    setCurrentAnalysis(analysis);
                    setActiveTab('results');
                  }}
                >
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle className="text-blue-900 text-lg">
                        {analysis.case_type.charAt(0).toUpperCase() + analysis.case_type.slice(1)} Case
                      </CardTitle>
                      <Badge className={getScoreBadge(analysis.total_score)}>
                        {analysis.total_score.toFixed(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Qiyinlik:</span>
                        <span className="font-medium">{analysis.difficulty_level}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Issue:</span>
                          <span className={`font-medium ${getScoreColor(analysis.scores.issue)}`}>
                            {analysis.scores.issue.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rule:</span>
                          <span className={`font-medium ${getScoreColor(analysis.scores.rule)}`}>
                            {analysis.scores.rule.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Application:</span>
                          <span className={`font-medium ${getScoreColor(analysis.scores.application)}`}>
                            {analysis.scores.application.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conclusion:</span>
                          <span className={`font-medium ${getScoreColor(analysis.scores.conclusion)}`}>
                            {analysis.scores.conclusion.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          {new Date(analysis.created_at).toLocaleDateString('uz-UZ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {analyses.length === 0 && (
                <div className="col-span-full">
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardContent className="text-center py-12">
                      <p className="text-gray-500 mb-4">Hali hech qanday tahlillar mavjud emas</p>
                      <Button 
                        onClick={() => setActiveTab('analyze')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Birinchi Tahlilni Boshlash
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
