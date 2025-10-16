import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, X, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface FaqSearchProps {
  faqs: FAQ[];
  onSearch: (query: string) => void;
  className?: string;
}

const categories = [
  { id: 'all', label: 'All Categories', count: 0 },
  { id: 'getting-started', label: 'Getting Started', count: 0 },
  { id: 'uploads', label: 'Uploads & Videos', count: 0 },
  { id: 'courses', label: 'Courses & Learning', count: 0 },
  { id: 'billing', label: 'Billing & Payments', count: 0 },
  { id: 'technical', label: 'Technical Support', count: 0 }
];

export function FaqSearch({ faqs, onSearch, className }: FaqSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Calculate category counts
  const categoriesWithCounts = useMemo(() => {
    return categories.map(category => ({
      ...category,
      count: category.id === 'all' 
        ? faqs.length 
        : faqs.filter(faq => faq.category === category.id).length
    }));
  }, [faqs]);

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    let filtered = faqs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [faqs, searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const toggleExpanded = (faqId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search frequently asked questions..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categoriesWithCounts.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategorySelect(category.id)}
            className={cn(
              "transition-all duration-200",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-muted"
            )}
          >
            {category.label}
            <Badge 
              variant="secondary" 
              className={cn(
                "ml-2 text-xs",
                selectedCategory === category.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted-foreground/20 text-muted-foreground"
              )}
            >
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="space-y-2">
              <Search className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">No FAQs found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No results found for "${searchQuery}". Try a different search term.`
                  : `No FAQs available in the "${categoriesWithCounts.find(c => c.id === selectedCategory)?.label}" category.`
                }
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={clearSearch}>
                  Clear Search
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedItems.has(faq.id);
              return (
                <Card 
                  key={faq.id} 
                  className="overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full p-4 text-left hover:bg-muted/50 transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {categoriesWithCounts.find(c => c.id === faq.category)?.label}
                        </Badge>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t bg-muted/20">
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                        {faq.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {faq.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="secondary" 
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filteredFaqs.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredFaqs.length} of {faqs.length} FAQs
          {searchQuery && ` for "${searchQuery}"`}
        </div>
      )}
    </div>
  );
}