import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Clock, Globe } from "lucide-react";
import { format, addMinutes, startOfDay, addDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

interface DemoBookingProps {
  children: React.ReactNode;
}

export const DemoBooking = ({ children }: DemoBookingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [busyTimes, setBusyTimes] = useState<Array<{start: string, end: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  // Initialize Supabase client (will use project defaults)
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'
  );

  // Generate available time slots
  const timeSlots = [
    "11:00am", "1:00pm", "1:30pm", "2:00pm", "2:30pm"
  ];

  // Get busy times from Google Calendar
  useEffect(() => {
    if (selectedDate) {
      fetchBusyTimes(selectedDate);
    }
  }, [selectedDate]);

  const fetchBusyTimes = async (date: Date) => {
    try {
      const timeMin = startOfDay(date).toISOString();
      const timeMax = addDays(startOfDay(date), 1).toISOString();
      
      const { data, error } = await supabase.functions.invoke('calendar', {
        body: {
          action: 'getAvailability',
          timeMin,
          timeMax
        }
      });

      if (error) throw error;
      
      setBusyTimes(data.busy || []);
    } catch (error) {
      console.error('Error fetching busy times:', error);
      // Fallback to showing all slots as available
      setBusyTimes([]);
    }
  };

  // Check if a time slot is available
  const isTimeSlotAvailable = (timeSlot: string, date: Date) => {
    const [time, period] = timeSlot.split(/(?=[ap]m)/);
    const [hours, minutes] = time.split(':').map(Number);
    const hour24 = period === 'pm' && hours !== 12 ? hours + 12 : (period === 'am' && hours === 12 ? 0 : hours);
    
    const slotStart = new Date(date);
    slotStart.setHours(hour24, minutes || 0, 0, 0);
    const slotEnd = addMinutes(slotStart, 30);

    return !busyTimes.some(busy => {
      const busyStart = parseISO(busy.start);
      const busyEnd = parseISO(busy.end);
      return (slotStart < busyEnd && slotEnd > busyStart);
    });
  };

  // Get available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      // Exclude weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleBookDemo = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsLoading(true);
    
    try {
      // Convert time to datetime
      const [time, period] = selectedTime.split(/(?=[ap]m)/);
      const [hours, minutes] = time.split(':').map(Number);
      const hour24 = period === 'pm' && hours !== 12 ? hours + 12 : (period === 'am' && hours === 12 ? 0 : hours);
      
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(hour24, minutes || 0, 0, 0);
      const endDateTime = addMinutes(startDateTime, 30);
      
      const { data, error } = await supabase.functions.invoke('calendar', {
        body: {
          action: 'createEvent',
          eventData: {
            ...formData,
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString()
          }
        }
      });

      if (error) throw error;
      
      toast.success('Demo scheduled successfully! You should receive a calendar invite shortly.');
      setIsOpen(false);
      
      // Reset form
      setFormData({ name: "", email: "", company: "", message: "" });
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      
    } catch (error) {
      console.error('Error booking demo:', error);
      toast.error('Failed to schedule demo. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center p-2">
                <img 
                  src="/lovable-uploads/b617ee5c-bf33-49d0-9752-4040f240cab6.png" 
                  alt="G3MS Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  G3MS
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  G3MS Demo
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  A quick meeting to learn about G3MS & our district pilot.
                </p>
              </div>
            </div>
            
            {/* Duration and timezone */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>30m</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>America/New York</span>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentMonth(prev => addDays(prev, -30))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentMonth(prev => addDays(prev, 30))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                disabled={(date) => !isDateAvailable(date)}
                className={cn("w-full border rounded-lg p-3 pointer-events-auto")}
                modifiers={{
                  available: availableDates
                }}
                modifiersStyles={{
                  available: { 
                    backgroundColor: 'white',
                    color: 'black'
                  }
                }}
              />
            </div>

            {/* Time Selection and Form Section */}
            <div className="space-y-6">
              {selectedDate && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </h3>
                   <div className="grid grid-cols-2 gap-2">
                     {timeSlots.map((time) => {
                       const isAvailable = isTimeSlotAvailable(time, selectedDate);
                       return (
                         <Button
                           key={time}
                           variant={selectedTime === time ? "default" : "outline"}
                           disabled={!isAvailable}
                           className={cn(
                             "h-10 text-sm",
                             selectedTime === time && "bg-blue-600 hover:bg-blue-700",
                             !isAvailable && "opacity-50 cursor-not-allowed"
                           )}
                           onClick={() => isAvailable && setSelectedTime(time)}
                         >
                           {time}
                         </Button>
                       );
                     })}
                   </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Your Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company">School/Organization</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Your school or organization"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Additional Information</Label>
                      <Input
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell us about your needs or questions"
                        className="mt-1"
                      />
                    </div>
                  </div>

                   <Button
                     onClick={handleBookDemo}
                     disabled={!formData.name || !formData.email || isLoading}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                   >
                     {isLoading ? "Scheduling..." : "Schedule Demo"}
                   </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};