'use server';

import  Booking  from "@/database/booking.model";
import connectDB from "../mongodb";

export const createBooking = async ({eventId, slug, email}: {eventId: string, slug: string, email: string}) => {
    try {
        await connectDB()
        const booking = await Booking.create({eventId, slug, email})

        

        const safeBooking = JSON.parse(JSON.stringify(booking))

        return {
            success: true,
            safeBooking
        }
    } catch (error) {
        console.error('create booking failed', error)
        return {
            success: false
        }
    }
}