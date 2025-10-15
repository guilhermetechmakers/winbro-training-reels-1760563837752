import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Award, 
  HelpCircle,
  XCircle
} from 'lucide-react';
import type { CourseQuiz, QuizQuestion } from '@/types';

interface QuizEditorProps {
  quiz: CourseQuiz;
  onUpdateQuiz: (updates: Partial<CourseQuiz>) => void;
  onAddQuestion: (question: Partial<QuizQuestion>) => void;
  onUpdateQuestion: (questionId: string, updates: Partial<QuizQuestion>) => void;
  onDeleteQuestion: (questionId: string) => void;
}

export function QuizEditor({
  quiz,
  onUpdateQuiz,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: QuizEditorProps) {
  const [newQuestionType, setNewQuestionType] = useState<'multiple_choice' | 'true_false' | 'short_answer'>('multiple_choice');

  const addNewQuestion = () => {
    const newQuestion: Partial<QuizQuestion> = {
      question_text: '',
      question_type: newQuestionType,
      correct_answer: '',
      answer_options: newQuestionType === 'multiple_choice' ? ['', '', '', ''] : undefined,
      points: 1,
      sort_order: quiz.questions.length,
      explanation: '',
    };
    onAddQuestion(newQuestion);
  };

  const updateQuestionOptions = (questionId: string, options: string[]) => {
    onUpdateQuestion(questionId, { answer_options: options });
  };

  const addOption = (questionId: string) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (question && question.answer_options) {
      const newOptions = [...question.answer_options, ''];
      updateQuestionOptions(questionId, newOptions);
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (question && question.answer_options && question.answer_options.length > 1) {
      const newOptions = question.answer_options.filter((_, index) => index !== optionIndex);
      updateQuestionOptions(questionId, newOptions);
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (question && question.answer_options) {
      const newOptions = [...question.answer_options];
      newOptions[optionIndex] = value;
      updateQuestionOptions(questionId, newOptions);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Quiz Editor
          </CardTitle>
          <CardDescription>
            Configure your quiz settings and questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                value={quiz.title}
                onChange={(e) => onUpdateQuiz({ title: e.target.value })}
                placeholder="Enter quiz title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-limit">Time Limit (minutes)</Label>
              <Input
                id="time-limit"
                type="number"
                value={quiz.time_limit || ''}
                onChange={(e) => onUpdateQuiz({ time_limit: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="No limit"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              value={quiz.description || ''}
              onChange={(e) => onUpdateQuiz({ description: e.target.value })}
              placeholder="Enter quiz description..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Questions</CardTitle>
              <CardDescription>
                {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={newQuestionType} onValueChange={(value: any) => setNewQuestionType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="true_false">True/False</SelectItem>
                  <SelectItem value="short_answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addNewQuestion} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Question {index + 1}</Badge>
                    <Badge variant="secondary">{question.question_type.replace('_', ' ')}</Badge>
                    <Badge variant="outline">{question.points} point{question.points !== 1 ? 's' : ''}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteQuestion(question.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Textarea
                      value={question.question_text}
                      onChange={(e) => onUpdateQuestion(question.id, { question_text: e.target.value })}
                      placeholder="Enter your question..."
                      rows={2}
                    />
                  </div>

                  {/* Answer Options */}
                  {question.question_type === 'multiple_choice' && question.answer_options && (
                    <div className="space-y-2">
                      <Label>Answer Options</Label>
                      <div className="space-y-2">
                        {question.answer_options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <Input
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                            {question.answer_options!.length > 2 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(question.id, optionIndex)}
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(question.id)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}

                  {question.question_type === 'true_false' && (
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Select
                        value={question.correct_answer}
                        onValueChange={(value) => onUpdateQuestion(question.id, { correct_answer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {question.question_type === 'short_answer' && (
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Input
                        value={question.correct_answer}
                        onChange={(e) => onUpdateQuestion(question.id, { correct_answer: e.target.value })}
                        placeholder="Enter the correct answer..."
                      />
                    </div>
                  )}

                  {/* Points */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`points-${question.id}`}>Points</Label>
                      <Input
                        id={`points-${question.id}`}
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => onUpdateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select
                        value={question.question_type}
                        onValueChange={(value: any) => onUpdateQuestion(question.id, { question_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                          <SelectItem value="short_answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-2">
                    <Label>Explanation (Optional)</Label>
                    <Textarea
                      value={question.explanation || ''}
                      onChange={(e) => onUpdateQuestion(question.id, { explanation: e.target.value })}
                      placeholder="Provide an explanation for the correct answer..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}

            {quiz.questions.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No questions added yet</p>
                <p className="text-sm">Add questions to create your quiz</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
