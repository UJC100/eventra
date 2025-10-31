import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/events/[slug]
 * Fetches event details by slug
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Await params to get the slug value
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug: slug.trim() }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      { success: true, data: event },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (use proper logging in production)
    console.error('Error fetching event:', error);

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while fetching the event',
      },
      { status: 500 }
    );
  }
}
