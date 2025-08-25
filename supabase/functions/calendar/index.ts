import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Security-enhanced CORS headers - restrict in production
const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGINS') || 'https://ec3dbe18-876e-46c3-8e2b-2d72cb7b84c0.sandbox.lovable.dev',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
}

interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
    displayName?: string;
  }>;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...payload } = await req.json()
    
    // Get Google Calendar API credentials from Supabase secrets
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
    const googleRefreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN')
    
    if (!googleClientId || !googleClientSecret || !googleRefreshToken) {
      throw new Error('Google Calendar credentials not configured')
    }

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: googleRefreshToken,
        grant_type: 'refresh_token',
      }),
    })

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (action === 'getAvailability') {
      // Get busy times from calendar
      const { timeMin, timeMax } = payload
      
      const freeBusyResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/freeBusy`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timeMin,
            timeMax,
            items: [{ id: 'shana@getg3ms.com' }],
          }),
        }
      )

      const freeBusyData = await freeBusyResponse.json()
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          busy: freeBusyData.calendars['shana@getg3ms.com']?.busy || [] 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (action === 'createEvent') {
      // Create calendar event
      const { eventData } = payload
      
      const event: CalendarEvent = {
        summary: 'G3MS Demo Meeting',
        description: `Demo meeting with ${eventData.name} from ${eventData.company || 'N/A'}\n\nMessage: ${eventData.message || 'No additional message'}`,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: 'America/New_York',
        },
        attendees: [
          {
            email: 'shana@getg3ms.com',
            displayName: 'Shana - G3MS'
          },
          {
            email: eventData.email,
            displayName: eventData.name
          }
        ],
      }

      const createResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/shana@getg3ms.com/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      )

      const eventResult = await createResponse.json()
      
      if (!createResponse.ok) {
        throw new Error(eventResult.error?.message || 'Failed to create calendar event')
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          event: eventResult,
          meetingLink: eventResult.htmlLink 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Calendar function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})