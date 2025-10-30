import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary'

import connectDB from '@/lib/mongodb';
import  Event  from "@/database/event.model";


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
        const buffer = Buffer.from(arrayBuffer);
        const timestamp = Math.floor(Date.now() / 1000); // always in UTC


        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: 'image', 
                folder: "eventra",
                timestamp: timestamp
            }, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            }).end(buffer)
        });

        event.image = (uploadResult as {secure_url: string}).secure_url;

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


export async function GET(){
    try {
        await connectDB();

        const events = await Event.find().sort({createdAt: -1});

        return NextResponse.json({message: "success fetching events", events}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: `error fetching events: ${error}`}, {status: 500})
    }
}