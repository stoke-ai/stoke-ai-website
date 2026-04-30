import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

interface Lead {
  id: string;
  name: string;
  email: string;
  business: string;
  website: string;
  message: string;
  insight: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}

async function getLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveLeads(leads: Lead[]): Promise<void> {
  const dir = path.dirname(LEADS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// Generate insight based on business type
function generateIndustryInsight(business: string): string {
  const businessLower = business.toLowerCase();
  
  // Industry-specific insights
  if (businessLower.includes('restaurant') || businessLower.includes('cafe') || businessLower.includes('food') || businessLower.includes('bakery') || businessLower.includes('coffee')) {
    return `For food service businesses like yours, AI can predict daily demand based on weather, events, and historical data — reducing food waste by 20-30%. Plus, automated customer messaging can boost repeat visits by sending personalized offers at just the right time.`;
  }
  
  if (businessLower.includes('retail') || businessLower.includes('store') || businessLower.includes('shop') || businessLower.includes('boutique')) {
    return `Retail businesses are seeing huge wins with AI-powered inventory management — predicting what'll sell before you run out. Plus, personalized product recommendations (like Amazon does) can increase average order value by 15-25%.`;
  }
  
  if (businessLower.includes('law') || businessLower.includes('attorney') || businessLower.includes('legal')) {
    return `Law firms are using AI to draft routine documents in minutes instead of hours, and to search case law instantly. The time savings alone typically pay for AI tools within the first month.`;
  }
  
  if (businessLower.includes('dental') || businessLower.includes('medical') || businessLower.includes('clinic') || businessLower.includes('doctor') || businessLower.includes('health')) {
    return `Healthcare practices are automating appointment reminders, follow-ups, and even initial patient intake — reducing no-shows by up to 30% and freeing staff for actual patient care.`;
  }
  
  if (businessLower.includes('real estate') || businessLower.includes('realtor') || businessLower.includes('property')) {
    return `Real estate professionals are using AI to auto-generate property descriptions, qualify leads 24/7 via chatbot, and predict which listings will sell fastest. Some agents report saving 10+ hours per week.`;
  }
  
  if (businessLower.includes('construction') || businessLower.includes('contractor') || businessLower.includes('plumb') || businessLower.includes('electric') || businessLower.includes('hvac')) {
    return `Trades and construction businesses are using AI for instant quote generation, scheduling optimization, and automated follow-ups with past customers. One HVAC company increased repeat business 40% with AI-powered maintenance reminders.`;
  }
  
  if (businessLower.includes('salon') || businessLower.includes('spa') || businessLower.includes('beauty') || businessLower.includes('barber')) {
    return `Salons and spas are crushing it with AI appointment booking, no-show prediction, and personalized rebooking reminders. Some see 25% more appointments just from automated "time for a touch-up" messages.`;
  }
  
  if (businessLower.includes('account') || businessLower.includes('bookkeep') || businessLower.includes('tax') || businessLower.includes('financial')) {
    return `Financial services are automating data entry, document processing, and client communications. AI can categorize transactions, flag anomalies, and draft routine client updates — saving hours of manual work weekly.`;
  }
  
  if (businessLower.includes('gym') || businessLower.includes('fitness') || businessLower.includes('training') || businessLower.includes('yoga')) {
    return `Fitness businesses are using AI to personalize workout recommendations, predict member churn before it happens, and automate class reminders. Retention improvements of 15-20% are common.`;
  }
  
  if (businessLower.includes('auto') || businessLower.includes('car') || businessLower.includes('mechanic') || businessLower.includes('repair')) {
    return `Auto shops are automating service reminders based on mileage and time, generating repair estimates faster, and following up on declined services. One shop increased revenue 25% just from AI-powered follow-ups.`;
  }
  
  // Generic insight for other businesses
  return `Every business has repetitive tasks eating up valuable time — emails, scheduling, follow-ups, data entry. AI can handle these automatically, often saving 10-15 hours per week. The question isn't whether AI can help your business — it's which tasks to automate first.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, business, website, message } = body;

    // Validate
    if (!name || !email || !business) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate insight
    const insight = generateIndustryInsight(business);

    // Create lead
    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      business,
      website: website || '',
      message: message || '',
      insight,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // Save to file
    const leads = await getLeads();
    leads.push(lead);
    await saveLeads(leads);

    // Write trigger file for OpenClaw to pick up
    const triggerFile = path.join(process.cwd(), 'data', 'new-lead-trigger.json');
    await fs.writeFile(triggerFile, JSON.stringify(lead, null, 2));

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      insight 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json({ count: leads.length, leads });
}
