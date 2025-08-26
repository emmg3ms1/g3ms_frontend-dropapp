
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { sanitizeInput, formRateLimiter } from '@/utils/security';

export const CreatorChallengeForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    creatorName: "",
    socialHandle: "",
    email: "",
    platform: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Check if required fields are filled
  const isFormValid = formData.creatorName.trim() && 
                      formData.socialHandle.trim() && 
                      formData.email.trim() && 
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
                      formData.message.trim();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.creatorName.trim()) {
      newErrors.creatorName = "Creator name is required";
    }

    if (!formData.socialHandle.trim()) {
      newErrors.socialHandle = "Social media handle is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Challenge vision & message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    if (!formRateLimiter.isAllowed('creator-form')) {
      const remainingTime = Math.ceil(formRateLimiter.getRemainingTime('creator-form') / 1000);
      toast({
        title: "Too many attempts",
        description: `Please wait ${remainingTime} seconds before submitting again.`,
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Sanitize all inputs
    const sanitizedData = {
      creatorName: sanitizeInput(formData.creatorName),
      socialHandle: sanitizeInput(formData.socialHandle),
      email: sanitizeInput(formData.email),
      platform: sanitizeInput(formData.platform),
      message: sanitizeInput(formData.message),
    };

    const emailBody = `
Creator Challenge Takeover Request

Creator Name: ${sanitizedData.creatorName}
Social Handle: ${sanitizedData.socialHandle}
Email: ${sanitizedData.email}
Primary Platform: ${sanitizedData.platform}

Challenge Vision & Message:
${sanitizedData.message}
    `;

    const mailtoLink = `mailto:help@getg3ms.com?subject=Creator Challenge Takeover Request - ${sanitizedData.creatorName}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Email client opened",
      description: "Your default email client should now be open with the creator challenge request.",
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
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Host a G3MS Challenge Takeover</h3>
        <p className="text-sm text-gray-600">
          Creators and educators: team up with G3MS to inspire students through fun, themed learning challenges.
        </p>
      </div>
      
      <div className="max-h-[70vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="creatorName">Creator Name *</Label>
            <Input
              id="creatorName"
              name="creatorName"
              value={formData.creatorName}
              onChange={handleInputChange}
              className={errors.creatorName ? "border-red-500" : ""}
            />
            {errors.creatorName && <p className="text-sm text-red-500 mt-1">{errors.creatorName}</p>}
          </div>
          
          <div>
            <Label htmlFor="socialHandle">Social Media Handle *</Label>
            <Input
              id="socialHandle"
              name="socialHandle"
              placeholder="@username or link"
              value={formData.socialHandle}
              onChange={handleInputChange}
              className={errors.socialHandle ? "border-red-500" : ""}
            />
            {errors.socialHandle && <p className="text-sm text-red-500 mt-1">{errors.socialHandle}</p>}
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="creator@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="platform">Primary Platform</Label>
            <Input
              id="platform"
              name="platform"
              placeholder="TikTok, YouTube, Instagram, etc."
              value={formData.platform}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="message">Challenge Vision & Message *</Label>
            <Textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Tell us your challenge concept and how you'll engage students..."
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
              className="flex-1 bg-gradient-to-r from-g3ms-green to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isSubmitting ? "Opening Email..." : "Submit Challenge Idea"}
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
