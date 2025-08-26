
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formRateLimiter, sanitizeInput } from "@/utils/security";

export const BrandPartnerForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Check if required fields are filled and valid
  const isFormValid = formData.companyName.trim() && 
                      formData.contactName.trim() && 
                      formData.email.trim() && 
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
                      formData.phone.trim() && 
                      /^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[^\d+]/g, '')) &&
                      formData.message.trim();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Partnership message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting
    if (!formRateLimiter.isAllowed(formData.email)) {
      toast({
        title: "Too many requests",
        description: "Please wait before submitting another form.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Sanitize form data before including in email
    const sanitizedData = {
      companyName: sanitizeInput(formData.companyName),
      contactName: sanitizeInput(formData.contactName),
      email: sanitizeInput(formData.email),
      phone: sanitizeInput(formData.phone),
      message: sanitizeInput(formData.message)
    };

    const emailBody = `
Partnership Interest - G3MS

Company/Organization Name: ${sanitizedData.companyName}
Contact Name: ${sanitizedData.contactName}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone}

Partnership Goals & Message:
${sanitizedData.message}
    `;

    const mailtoLink = `mailto:help@getg3ms.com?subject=Partnership Interest - ${sanitizedData.companyName}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Email client opened",
      description: "Your default email client should now be open with your partnership interest.",
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Partner with G3MS</h3>
        <p className="text-sm text-gray-600">
          Whether you're a brand, nonprofit, or creator—we'd love to explore how we can work together.
        </p>
      </div>
      
      <div className="max-h-[70vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={errors.companyName ? "border-red-500" : ""}
            />
            {errors.companyName && <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>}
          </div>
          
          <div>
            <Label htmlFor="contactName">Contact Name *</Label>
            <Input
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              className={errors.contactName ? "border-red-500" : ""}
            />
            {errors.contactName && <p className="text-sm text-red-500 mt-1">{errors.contactName}</p>}
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="company@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => {
                let value = e.target.value;
                // Ensure it starts with +
                if (!value.startsWith('+') && value.length > 0) {
                  value = '+' + value.replace(/^\+*/, '');
                }
                handleInputChange({ target: { name: 'phone', value } } as any);
              }}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <Label htmlFor="message">Partnership Goals & Message *</Label>
            <Textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Tell us about your goals and how you'd like to support students..."
              value={formData.message}
              onChange={handleInputChange}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="flex-1 bg-gradient-to-r from-g3ms-purple to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSubmitting ? "Opening Email..." : "Submit Interest"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
