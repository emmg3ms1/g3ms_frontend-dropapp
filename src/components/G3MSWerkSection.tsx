import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const G3MSWerkSection = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    school: '',
    interests: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    }

    if (!formData.school.trim()) {
      newErrors.school = 'School is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for any validation errors.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration Successful!",
        description: "We'll be in touch soon with more details about the Youth AI Innovation Lab.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        school: '',
        interests: ''
      });
      setErrors({});
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="g3ms-werk" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/ab49202f-7f4b-4ce9-9da0-4a57572e0c96.png" 
              alt="G3MS Werk Logo" 
              className="h-32 w-auto object-contain"
            />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            G3MS Werk Coming Soon
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join us for our FREE Youth AI Innovation Lab on Martha's Vineyard
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto">
            A transformative 3-day experience where young innovators learn AI, build solutions, and connect with mentors from leading tech companies.
          </p>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-g3ms-purple to-g3ms-green hover:from-g3ms-purple/90 hover:to-g3ms-green/90 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full transform hover:scale-105 transition-all duration-200 shadow-2xl w-full sm:w-auto"
              >
                Get Early Access
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">
                  G3MS Werk Early Access Registration
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Ensure it starts with +
                      if (!value.startsWith('+') && value.length > 0) {
                        value = '+' + value.replace(/^\+*/, '');
                      }
                      setFormData({...formData, phone: value});
                    }}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, age: value})}>
                    <SelectTrigger className={errors.age ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13-15">13-15</SelectItem>
                      <SelectItem value="16-18">16-18</SelectItem>
                      <SelectItem value="19-21">19-21</SelectItem>
                      <SelectItem value="22+">22+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">School/University *</Label>
                  <Input
                    id="school"
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                    className={errors.school ? "border-red-500" : ""}
                  />
                  {errors.school && <p className="text-red-500 text-sm">{errors.school}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">AI/Tech Interests (Optional)</Label>
                  <Textarea
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => setFormData({...formData, interests: e.target.value})}
                    placeholder="Tell us about your interests in AI and technology..."
                    className="min-h-[80px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-g3ms-purple to-g3ms-green hover:from-g3ms-purple/90 hover:to-g3ms-green/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Register for Early Access"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};
