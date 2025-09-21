import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Connect to database
    const { db } = await connectToDatabase();
    const collection = db.collection('resume');

    // Store resume in database
    const resumeData = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      data: base64,
      uploadedAt: new Date(),
      isActive: true
    };

    // Update all previous resumes to inactive
    await collection.updateMany(
      { isActive: true },
      { $set: { isActive: false } }
    );

    // Insert new resume
    const result = await collection.insertOne(resumeData);

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
}