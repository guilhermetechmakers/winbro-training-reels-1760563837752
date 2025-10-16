import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface DemoRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoRequestData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

export function DemoRequestForm({ isOpen, onClose }: DemoRequestFormProps) {
  const [formData, setFormData] = useState<DemoRequestData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would call the API
      console.log("Demo request submitted:", formData);
      
      toast.success("Demo request submitted successfully! We'll contact you within 24 hours.");
      onClose();
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to submit demo request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Request a Demo</DialogTitle>
          <DialogDescription>
            See how Winbro Training Reels can transform your training process. 
            We'll show you a personalized demo based on your needs.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Enter your company name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us about your training needs..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Request Demo
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}