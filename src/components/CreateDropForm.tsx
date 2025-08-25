import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Upload, Plus } from 'lucide-react';
import { useDropData } from '@/contexts/DropDataContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  scheduleDate: z.date({
    required_error: 'Schedule date is required',
  }),
  scheduleTime: z.string().min(1, 'Schedule time is required'),
  videoContent: z.string().min(1, 'Video content is required'),
  template: z.string().min(1, 'Template is required'),
  targetSchools: z.array(z.string()).optional(),
  targetGrades: z.array(z.string()).optional(),
  brand: z.string().optional(),
  rewardType: z.enum(['tokens', 'item'], {
    required_error: 'Please select a reward type',
  }),
  g3msAmount: z.number().optional(),
  rewardItem: z.string().optional(),
  numberOfWinners: z.number().min(1, 'Number of winners must be at least 1'),
  eligibilityCriteria: z.string().min(1, 'Eligibility criteria is required'),
  // New fields for drop creation from homepage
  dropType: z.string().optional(),
  subject: z.string().optional(),
  rtiTier: z.string().optional(),
  learningGoal: z.string().optional(),
}).refine((data) => {
  if (data.rewardType === 'tokens' && !data.g3msAmount) {
    return false;
  }
  if (data.rewardType === 'item' && !data.rewardItem) {
    return false;
  }
  return true;
}, {
  message: "Reward details are required based on selected type",
  path: ["rewardType"],
});

type FormData = z.infer<typeof formSchema>;

// Mock data for dropdowns
const mockVideoContent = [
  { id: '1', title: 'Introduction to Science' },
  { id: '2', title: 'Math Fundamentals' },
  { id: '3', title: 'History Basics' },
];

const mockTemplates = [
  { id: 'bellwork', name: '📝 Bellwork & Exit Tickets' },
  { id: 'quiz', name: '🧠 Knowledge Check Quiz' },
  { id: 'lesson', name: '📚 Scaffolded Lesson' },
  { id: 'video', name: '🎬 Video-based Instruction' },
  { id: 'project', name: '🔬 Project-based Learning' },
  { id: 'assessment', name: '📊 Formative Assessment' },
];

const mockSchools = [
  { id: '1', name: 'Lincoln Elementary' },
  { id: '2', name: 'Washington Middle School' },
  { id: '3', name: 'Roosevelt High School' },
];

const mockGrades = [
  { id: '3rd', name: '3rd Grade' },
  { id: '4th', name: '4th Grade' },
  { id: '5th', name: '5th Grade' },
  { id: '6th', name: '6th Grade' },
  { id: '7th', name: '7th Grade' },
  { id: '8th', name: '8th Grade' },
  { id: '9th', name: '9th Grade' },
  { id: '10th', name: '10th Grade' },
  { id: '11th', name: '11th Grade' },
  { id: '12th', name: '12th Grade' },
];

const mockBrands = [
  { id: '1', name: 'Nike' },
  { id: '2', name: 'Apple' },
  { id: '3', name: 'Amazon' },
];

const mockRewardItems = [
  { id: '1', name: 'Nike Sneakers' },
  { id: '2', name: 'Apple AirPods' },
  { id: '3', name: 'Amazon Gift Card' },
];

interface CreateDropFormProps {
  onDropCreated?: (title: string) => void;
}

export const CreateDropForm: React.FC<CreateDropFormProps> = ({ onDropCreated }) => {
  const { dropData, clearDropData, isDropCreationFlow } = useDropData();
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      scheduleDate: undefined,
      scheduleTime: '',
      videoContent: '',
      template: '',
      targetSchools: [],
      targetGrades: [],
      brand: '',
      rewardType: 'tokens',
      numberOfWinners: 1,
      eligibilityCriteria: '',
      dropType: '',
      subject: '',
      rtiTier: '',
      learningGoal: '',
    },
  });

  // Populate form with data from homepage if available
  useEffect(() => {
    if (dropData && isDropCreationFlow) {
      // Map homepage data to form fields
      const updates: Partial<FormData> = {};
      
      if (dropData.dropType) {
        updates.template = dropData.dropType;
        updates.dropType = dropData.dropType;
      }
      
      if (dropData.grade) {
        updates.targetGrades = [dropData.grade];
        setSelectedGrades([dropData.grade]);
      }
      
      if (dropData.subject) {
        updates.subject = dropData.subject;
      }
      
      if (dropData.rtiTier) {
        updates.rtiTier = dropData.rtiTier;
      }
      
      if (dropData.learningGoal) {
        updates.learningGoal = dropData.learningGoal;
        updates.eligibilityCriteria = dropData.learningGoal;
        updates.title = `${dropData.subject || 'Learning'} Drop - ${dropData.grade || 'Grade'} ${dropData.rtiTier || ''}`.trim();
      }
      
      // Update form with the mapped data
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          form.setValue(key as keyof FormData, value as any);
        }
      });
    }
  }, [dropData, isDropCreationFlow, form]);

  const rewardType = form.watch('rewardType');

  const onSubmit = (data: FormData) => {
    console.log('Drop created:', data);
    
    // Clear drop data after successful creation
    if (isDropCreationFlow) {
      clearDropData();
    }
    
    // Call the callback to notify parent component
    if (onDropCreated) {
      onDropCreated(data.title);
    }
    
    // Handle form submission here
    // TODO: Integrate with actual API endpoint
  };

  const handleSchoolToggle = (schoolId: string) => {
    const newSelectedSchools = selectedSchools.includes(schoolId) 
      ? selectedSchools.filter(id => id !== schoolId)
      : [...selectedSchools, schoolId];
      
    setSelectedSchools(newSelectedSchools);
    form.setValue('targetSchools', newSelectedSchools);
  };

  const handleGradeToggle = (gradeId: string) => {
    const newSelectedGrades = selectedGrades.includes(gradeId) 
      ? selectedGrades.filter(id => id !== gradeId)
      : [...selectedGrades, gradeId];
      
    setSelectedGrades(newSelectedGrades);
    form.setValue('targetGrades', newSelectedGrades);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter drop title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Schedule For - Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scheduleDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Schedule Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduleTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Video Content */}
        <FormField
          control={form.control}
          name="videoContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Content</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Choose existing video content" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      {mockVideoContent.map((video) => (
                        <SelectItem key={video.id} value={video.id}>
                          {video.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Template */}
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RTI Tier Field */}
        <FormField
          control={form.control}
          name="rtiTier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RTI Tier</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select RTI tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="tier1">Tier 1 - Universal Support</SelectItem>
                  <SelectItem value="tier2">Tier 2 - Targeted Support</SelectItem>
                  <SelectItem value="tier3">Tier 3 - Intensive Support</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subject Field */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="english">English/Language Arts</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="social-studies">Social Studies</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="pe">PE</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Learning Goal Field */}
        <FormField
          control={form.control}
          name="learningGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Goal/Standard</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter the learning goal, objective, or standard for this drop"
                  className="min-h-[96px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Target Schools */}
        <div>
          <Label className="text-sm font-medium">Target Schools (Optional)</Label>
          <Card className="mt-2">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mockSchools.map((school) => (
                  <div
                    key={school.id}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-muted",
                      selectedSchools.includes(school.id) && "bg-muted"
                    )}
                    onClick={() => handleSchoolToggle(school.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSchools.includes(school.id)}
                      onChange={() => handleSchoolToggle(school.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{school.name}</span>
                  </div>
                ))}
              </div>
              {selectedSchools.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSchools.map((schoolId) => {
                    const school = mockSchools.find(s => s.id === schoolId);
                    return school ? (
                      <Badge key={schoolId} variant="secondary">
                        {school.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Target Grades */}
        <div>
          <Label className="text-sm font-medium">Target Grades (Optional)</Label>
          <Card className="mt-2">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mockGrades.map((grade) => (
                  <div
                    key={grade.id}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-muted",
                      selectedGrades.includes(grade.id) && "bg-muted"
                    )}
                    onClick={() => handleGradeToggle(grade.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGrades.includes(grade.id)}
                      onChange={() => handleGradeToggle(grade.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{grade.name}</span>
                  </div>
                ))}
              </div>
              {selectedGrades.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedGrades.map((gradeId) => {
                    const grade = mockGrades.find(g => g.id === gradeId);
                    return grade ? (
                      <Badge key={gradeId} variant="secondary">
                        {grade.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Brand */}
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand (Optional)</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-lg z-50">
                    {mockBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reward Type */}
        <FormField
          control={form.control}
          name="rewardType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Reward Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tokens" id="tokens" />
                    <Label htmlFor="tokens">G3MS Tokens</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="item" id="item" />
                    <Label htmlFor="item">Brand Reward Item</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional Fields based on Reward Type */}
        {rewardType === 'tokens' && (
          <FormField
            control={form.control}
            name="g3msAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>G3MS Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter token amount"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {rewardType === 'item' && (
          <FormField
            control={form.control}
            name="rewardItem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward Item</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose reward item" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      {mockRewardItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Number of Winners */}
        <FormField
          control={form.control}
          name="numberOfWinners"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Winners</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Eligibility Criteria */}
        <FormField
          control={form.control}
          name="eligibilityCriteria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eligibility Criteria</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the eligibility criteria for this drop"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit">
            Create Drop
          </Button>
        </div>
      </form>
    </Form>
  );
};