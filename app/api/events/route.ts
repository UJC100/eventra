import  Event  from "@/database/event.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData()

        let event;

        try {
            event = Object.fromEntries(formData.entries())
            
        } catch (e) {
            return NextResponse.json({message: 'Invalid JSON data format'}, {status: 400})
        }

        const file = formData.get('image') as File

        if (!file) return NextResponse.json({message: "Image is required!"}, {status: 400})

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer)

        const createdEvent = await Event.create(event)

        return NextResponse.json({
            message: "Event created successfully",
            event: createdEvent
        }, {status: 201})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: `Event Creation failed`, error: e instanceof Error ? e.message: "Unknown"}, {status: 500})
    }
}