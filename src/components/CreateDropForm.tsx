import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Upload, Plus, Check, ChevronDown, Search, Video, Play, Loader2, X } from 'lucide-react';
import { useDropData } from '@/contexts/DropDataContext';
import { apiService } from '@/services/api';
import { getMuxThumbnailUrl, getMuxPlayerUrl, getPlaybackIdFromVideo } from '@/utils/mux';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  dropType: z.enum(['BELLWORK_EXIT_TICKETS', 'KNOWLEDGE_CHECK_QUIZ', 'SCAFFOLDED_LESSON', 'VIDEO_BASED_INSTRUCTION', 'PROJECT_BASED_LEARNING', 'FORMATIVE_ASSESSMENT'], {
    required_error: 'Please select a drop type',
  }),
  scheduleDate: z.date({
    required_error: 'Schedule date is required',
  }),
  scheduleTime: z.string().min(1, 'Schedule time is required'),
  videoContent: z.string().min(1, 'Video content is required'),
  template: z.string().min(1, 'Template is required'),
  assignmentType: z.string().optional(),
  targetSchools: z.array(z.string()).optional(),
  targetGrades: z.array(z.string()).optional(),
  // Brand Campaign Info
  brandName: z.string().min(1, 'Brand/Organization name is required'),
  campaignGoal: z.enum(['brand_awareness', 'product_education', 'engagement', 'lead_generation', 'community_building'], {
    required_error: 'Please select a campaign goal',
  }),
  budgetRange: z.enum(['under_5k', '5k_10k', '10k_25k', '25k_50k', '50k_plus'], {
    required_error: 'Please select a budget range',
  }),
  brand: z.string().optional(),
  rewardType: z.enum(['tokens', 'item'], {
    required_error: 'Please select a reward type',
  }),
  g3msAmount: z.number().optional(),
  rewardItem: z.string().optional(),
  numberOfWinners: z.number().min(1, 'Number of winners must be at least 1'),
  eligibilityCriteria: z.string().min(1, 'Eligibility criteria is required'),
  subject: z.string().optional(),
  rtiTier: z.string().optional(),
  learningGoal: z.string().min(1, 'Educational theme/standards/learning objectives are required'),
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

// Fallback mock data for templates
const mockTemplates = [
  { id: 'bellwork', name: '📝 Bellwork & Exit Tickets', data: {}, order: 1 },
  { id: 'quiz', name: '🧠 Knowledge Check Quiz', data: {}, order: 2 },
  { id: 'lesson', name: '📚 Scaffolded Lesson', data: {}, order: 3 },
  { id: 'video', name: '🎬 Video-based Instruction', data: {}, order: 4 },
  { id: 'project', name: '🔬 Project-based Learning', data: {}, order: 5 },
  { id: 'assessment', name: '📊 Formative Assessment', data: {}, order: 6 },
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
  const [showVideoPreviewModal, setShowVideoPreviewModal] = useState(false);
  const [selectedVideoForPreview, setSelectedVideoForPreview] = useState<any>(null);
  
  // School combobox state
  const [isSchoolComboboxOpen, setIsSchoolComboboxOpen] = useState(false);
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');
  const [schoolPage, setSchoolPage] = useState(1);
  
  // Video pagination state
  const [videoPage, setVideoPage] = useState(1);
  const [templatePage, setTemplatePage] = useState(1);

  // Fetch templates with fallback
  const { 
    data: templatesResponse, 
    isLoading: isLoadingTemplates,
    error: templatesError 
  } = useQuery({
    queryKey: ['drop-templates', templatePage],
    queryFn: () => apiService.getDropTemplates(),
    retry: false
  });

  // Fetch videos with pagination
  const { 
    data: videosResponse, 
    isLoading: isLoadingVideos,
    error: videosError 
  } = useQuery({
    queryKey: ['drop-videos', videoPage],
    queryFn: () => apiService.getDropVideos(),
    placeholderData: keepPreviousData
  });

  // Fetch subjects (topics)
  const { 
    data: subjectsResponse, 
    isLoading: isLoadingSubjects 
  } = useQuery({
    queryKey: ['topics', false],
    queryFn: () => apiService.getTopics(false)
  });

  // Fetch schools with search and pagination
  const { 
    data: schoolsResponse, 
    isLoading: isLoadingSchools
  } = useQuery({
    queryKey: ['schools', schoolSearchTerm, schoolPage],
    queryFn: () => apiService.getSchools(schoolPage, 50, schoolSearchTerm),
    placeholderData: keepPreviousData,
    enabled: isSchoolComboboxOpen || schoolSearchTerm.length > 0
  });

  // Fetch grades
  const { 
    data: gradesResponse, 
    isLoading: isLoadingGrades 
  } = useQuery({
    queryKey: ['grades', true],
    queryFn: () => apiService.getGrades(true)
  });

  // Process fetched data with fallbacks
  const templates = templatesError ? mockTemplates : ((templatesResponse as any)?.data || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  const videos = (videosResponse as any)?.data || [];
  const subjects = (subjectsResponse as any)?.data || [];
  const schools = (schoolsResponse as any)?.data || [];
  const grades = (gradesResponse as any)?.data || [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      dropType: undefined,
      scheduleDate: undefined,
      scheduleTime: '',
      videoContent: '',
      template: '',
      assignmentType: '',
      targetSchools: [],
      targetGrades: [],
      brandName: '',
      campaignGoal: undefined,
      budgetRange: undefined,
      brand: '',
      rewardType: 'tokens',
      numberOfWinners: 1,
      eligibilityCriteria: '',
      subject: '',
      rtiTier: '',
      learningGoal: '',
    },
  });

  // Populate form with data from homepage if available
  useEffect(() => {
    if (dropData && isDropCreationFlow) {
      const updates: Partial<FormData> = {};
      
      if (dropData.dropType) {
        updates.template = dropData.dropType;
        updates.dropType = dropData.dropType as FormData['dropType'];
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
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          form.setValue(key as keyof FormData, value as any);
        }
      });
    }
  }, [dropData, isDropCreationFlow, form]);

  const rewardType = form.watch('rewardType');

  const onSubmit = async (data: FormData) => {
    try {
        // Map form data to API format
        const dropPayload = {
          title: data.title,
          dropType: data.dropType,
          topicId: data.subject,
          rtiTier: data.rtiTier?.toUpperCase(),
          learningGoal: data.learningGoal,
          scheduledAt: new Date(`${format(data.scheduleDate, 'yyyy-MM-dd')}T${data.scheduleTime}:00.000Z`).toISOString(),
          videoId: data.videoContent,
          templateId: data.template,
          schoolIds: data.targetSchools || [],
          gradeIds: data.targetGrades || [],
          brandName: data.brandName,
          campaignGoal: data.campaignGoal,
          budgetRange: data.budgetRange,
          // brandId: data.brand || undefined,
          reward: {
            rewardType: data.rewardType === 'tokens' ? 'G3MS' : 'BRAND_REWARD',
            g3msAmount: data.rewardType === 'tokens' ? data.g3msAmount : undefined,
            rewardItemId: data.rewardType === 'item' ? data.rewardItem : undefined,
            winnersCount: data.numberOfWinners,
            eligibilityText: data.eligibilityCriteria
          }
        };

      const response = await apiService.createDrop(dropPayload);
      
      toast.success('Drop created successfully!');
      
      if (isDropCreationFlow) {
        clearDropData();
      }
      
      if (onDropCreated) {
        onDropCreated(data.title);
      }
    } catch (error) {
      console.error('Failed to create drop:', error);
      toast.error('Failed to create drop. Please try again.');
    }
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

  const handleVideoPreview = (video: any) => {
    setSelectedVideoForPreview(video);
    setShowVideoPreviewModal(true);
  };

  const getVideoThumbnail = (video: any) => {
    const playbackId = getPlaybackIdFromVideo(video);
    if (!playbackId) return null;
    return getMuxThumbnailUrl(playbackId, 'jpg', { width: 120, height: 68 });
  };

  const getVideoPlayerUrl = (video: any) => {
    const playbackId = getPlaybackIdFromVideo(video);
    if (!playbackId) return null;
    return getMuxPlayerUrl(playbackId, { controls: true });
  };

  const loadMoreSchools = () => {
    setSchoolPage(prev => prev + 1);
  };

  const loadMoreVideos = () => {
    setVideoPage(prev => prev + 1);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter campaign title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Drop Type */}
          <FormField
            control={form.control}
            name="dropType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select drop type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BELLWORK_EXIT_TICKETS">📝 Bellwork & Exit Tickets</SelectItem>
                    <SelectItem value="KNOWLEDGE_CHECK_QUIZ">🧠 Knowledge Check Quiz</SelectItem>
                    <SelectItem value="SCAFFOLDED_LESSON">📚 Scaffolded Lesson</SelectItem>
                    <SelectItem value="VIDEO_BASED_INSTRUCTION">🎬 Video-based Instruction</SelectItem>
                    <SelectItem value="PROJECT_BASED_LEARNING">🔬 Project-based Learning</SelectItem>
                    <SelectItem value="FORMATIVE_ASSESSMENT">📊 Formative Assessment</SelectItem>
                  </SelectContent>
                </Select>
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
                <FormItem  className="flex flex-col">
                  <FormLabel>Schedule Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Video Content with Pagination and Preview */}
          <FormField
            control={form.control}
            name="videoContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Content</FormLabel>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Choose existing video content" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border shadow-lg z-50 max-h-60">
                          {isLoadingVideos ? (
                            <div className="p-2">
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          ) : videos.length > 0 ? (
                            <>
                              {videos.map((video: any) => {
                                const thumbnail = getVideoThumbnail(video);
                                return (
                                  <SelectItem key={video.id} value={video.id} className="flex items-center gap-3 p-3">
                                    <div className="flex items-center gap-3 w-full">
                                      {thumbnail && (
                                        <img 
                                          src={thumbnail} 
                                          alt={video.title}
                                          className="w-16 h-9 object-cover rounded border"
                                        />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{video.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {new Date(video.createdAt).toLocaleDateString()}
                                        </div>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleVideoPreview(video);
                                        }}
                                        className="flex-shrink-0"
                                      >
                                        <Play className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                              {(videosResponse as any)?.meta?.totalPages > videoPage && (
                                <div className="p-2 border-t">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={loadMoreVideos}
                                    className="w-full"
                                  >
                                    Load More Videos
                                  </Button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="p-4 text-center text-muted-foreground">
                              No videos found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Video Preview Button */}
                  {field.value && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const selectedVideo = videos.find((v: any) => v.id === field.value);
                          if (selectedVideo) {
                            handleVideoPreview(selectedVideo);
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Preview Video
                      </Button>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Template with API Integration */}
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
                      {isLoadingTemplates ? (
                        <div className="p-2">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : (
                        templates.map((template: any) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name || template.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* RTI Tier with API Enum */}
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
                    <SelectItem value="ONE">Tier 1 - Universal Support</SelectItem>
                    <SelectItem value="TWO">Tier 2 - Targeted Support</SelectItem>
                    <SelectItem value="THREE">Tier 3 - Intensive Support</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subject with API Integration */}
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
                    {isLoadingSubjects ? (
                      <div className="p-2">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ) : (
                      subjects.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Learning Goal */}
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

          {/* Brand Campaign Info Section */}
          <div className="space-y-6 p-4 border border-border rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-center">Campaign Info</div>
            
            {/* Brand/Organization Name and Campaign Goal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand/Org Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand or organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="campaignGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Goal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select campaign goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                        <SelectItem value="product_education">Product Education</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="lead_generation">Lead Generation</SelectItem>
                        <SelectItem value="community_building">Community Building</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reward Type and Budget Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rewardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reward" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tokens">G3MS Tokens</SelectItem>
                        <SelectItem value="item">Brand Reward Item</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Range</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="What's your budget for this campaign?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="under_5k">Under $5,000</SelectItem>
                        <SelectItem value="5k_10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k_25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k_50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k_plus">$50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-xs text-center text-muted-foreground">
              Sign up fee + per campaign pricing applies for brands.<br />
              Want to sponsor with creators? We'll match you.
            </div>
          </div>

          {/* Target Schools - Multi-Select Combobox with Search */}
          <div>
            <Label className="text-sm font-medium">Target Schools (Optional)</Label>
            <div className="mt-2 space-y-3">
              <Popover open={isSchoolComboboxOpen} onOpenChange={setIsSchoolComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isSchoolComboboxOpen}
                    className="w-full justify-between"
                  >
                    {selectedSchools.length > 0
                      ? `${selectedSchools.length} school(s) selected`
                      : "Select schools..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search schools..." 
                      value={schoolSearchTerm}
                      onValueChange={setSchoolSearchTerm}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {isLoadingSchools ? "Loading schools..." : "No schools found."}
                      </CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-60">
                          {schools.map((school: any) => (
                            <CommandItem
                              key={school.id}
                              value={school.id}
                              onSelect={() => handleSchoolToggle(school.id)}
                              className="flex items-center gap-2 p-2"
                            >
                              <div className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                selectedSchools.includes(school.id)
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}>
                                <Check className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{school.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {school.city}, {school.state}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                          {(schoolsResponse as any)?.meta?.totalPages > schoolPage && (
                            <div className="p-2 border-t">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={loadMoreSchools}
                                disabled={isLoadingSchools}
                                className="w-full"
                              >
                                {isLoadingSchools ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Load More Schools
                              </Button>
                            </div>
                          )}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {/* Selected Schools Display */}
              {selectedSchools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSchools.map((schoolId) => {
                    const school = schools.find((s: any) => s.id === schoolId);
                    return school ? (
                      <Badge key={schoolId} variant="secondary" className="flex items-center gap-1">
                        {school.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleSchoolToggle(schoolId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Target Grades with API Integration */}
          <div>
            <Label className="text-sm font-medium">Target Grades (Optional)</Label>
            <Card className="mt-2">
              <CardContent className="p-4">
                {isLoadingGrades ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {grades.map((grade: any) => (
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
                )}
                {selectedGrades.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedGrades.map((gradeId) => {
                      const grade = grades.find((g: any) => g.id === gradeId);
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
                      <SelectItem value="1">Nike</SelectItem>
                      <SelectItem value="2">Apple</SelectItem>
                      <SelectItem value="3">Amazon</SelectItem>
                    </SelectContent>
                  </Select>
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
            <Button 
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Creating Drop...' : 'Create Drop'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Video Preview Modal */}
      <Dialog open={showVideoPreviewModal} onOpenChange={setShowVideoPreviewModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Preview: {selectedVideoForPreview?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedVideoForPreview && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={getVideoPlayerUrl(selectedVideoForPreview)}
                  className="w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  title={selectedVideoForPreview.title}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button 
                onClick={() => {
                  if (selectedVideoForPreview) {
                    form.setValue('videoContent', selectedVideoForPreview.id);
                    setShowVideoPreviewModal(false);
                  }
                }}
                className="bg-g3ms-purple hover:bg-g3ms-purple/90"
              >
                Select This Video
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};