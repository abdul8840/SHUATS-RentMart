import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import MeetupLocation from '../models/MeetupLocation.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
    } else {
      const admin = await User.create({
        name: 'Platform Admin',
        email: process.env.ADMIN_EMAIL || '24MCA050@shiats.edu.in',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        department: 'Administration',
        semester: 1,
        idCardImage: {
          public_id: 'admin-id',
          url: 'https://res.cloudinary.com/demo/image/upload/v1/admin-placeholder.png'
        },
        role: 'admin',
        accountStatus: 'approved',
        forumAccess: true,
        trustScore: 100,
        isActive: true
      });
      console.log('Admin created:', admin.email);
    }

    // Seed meetup locations
    const locationCount = await MeetupLocation.countDocuments();
    if (locationCount === 0) {
      const locations = [
        {
          name: 'Central Library',
          description: 'Main university library - Safe and well-monitored area',
          type: 'Library',
          coordinates: { lat: 25.413444784910546, lng: 81.84667916147335 },
          isSafe: true
        },
        {
          name: 'Admin Block',
          description: 'Administration building - High security area',
          type: 'Admin Block',
          coordinates: { lat: 25.4360, lng: 81.8470 },
          isSafe: true
        },
        {
          name: 'Student Cafeteria',
          description: 'Main cafeteria - Popular meeting spot',
          type: 'Cafeteria',
          coordinates: { lat: 25.4355, lng: 81.8458 },
          isSafe: true
        },
        {
          name: 'Computer Science Department',
          description: 'CS & IT Department building',
          type: 'Department',
          coordinates: { lat: 25.4362, lng: 81.8465 },
          isSafe: true
        },
        {
          name: 'MCA Department',
          description: 'Master of Computer Applications Department',
          type: 'Department',
          coordinates: { lat: 25.4365, lng: 81.8468 },
          isSafe: true
        },
        {
          name: 'Engineering Block',
          description: 'Main Engineering building',
          type: 'Department',
          coordinates: { lat: 25.4368, lng: 81.8472 },
          isSafe: true
        },
        {
          name: 'Sports Complex',
          description: 'University sports area - Open and visible',
          type: 'Sports Complex',
          coordinates: { lat: 25.4350, lng: 81.8480 },
          isSafe: true
        },
        {
          name: 'Main Gate',
          description: 'University main entrance - Guard present 24/7',
          type: 'Gate',
          coordinates: { lat: 25.4345, lng: 81.8455 },
          isSafe: true
        },
        {
          name: 'Hostel Common Area',
          description: 'Common area near hostels',
          type: 'Hostel Area',
          coordinates: { lat: 25.4370, lng: 81.8475 },
          isSafe: true
        },
        {
          name: 'Science Block',
          description: 'Science faculty building',
          type: 'Department',
          coordinates: { lat: 25.4357, lng: 81.8462 },
          isSafe: true
        }
      ];

      await MeetupLocation.insertMany(locations);
      console.log(`${locations.length} meetup locations seeded`);
    } else {
      console.log('Meetup locations already exist');
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedAdmin();