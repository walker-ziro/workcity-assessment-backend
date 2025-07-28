const mongoose = require('mongoose');
const User = require('./src/models/User');
const Client = require('./src/models/Client');
const Project = require('./src/models/Project');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Client.deleteMany({});
    await Project.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'AdminPass123',
      role: 'admin'
    });
    await admin.save();
    console.log('Created admin user');

    // Create regular users
    const user1 = new User({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'UserPass123',
      role: 'user'
    });
    await user1.save();

    const user2 = new User({
      username: 'janedoe',
      email: 'jane@example.com',
      password: 'UserPass123',
      role: 'user'
    });
    await user2.save();
    console.log('Created regular users');

    // Create clients
    const client1 = new Client({
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1234567890',
      address: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      company: 'Acme Corp',
      industry: 'Technology',
      createdBy: user1._id
    });
    await client1.save();

    const client2 = new Client({
      name: 'Global Innovations',
      email: 'info@globalinnovations.com',
      phone: '+1987654321',
      company: 'Global Innovations Ltd',
      industry: 'Manufacturing',
      createdBy: user2._id
    });
    await client2.save();

    const client3 = new Client({
      name: 'TechStart Solutions',
      email: 'hello@techstart.com',
      phone: '+1555123456',
      company: 'TechStart Solutions Inc',
      industry: 'Software',
      createdBy: admin._id
    });
    await client3.save();
    console.log('Created clients');

    // Create projects
    const project1 = new Project({
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with modern UI/UX',
      client: client1._id,
      status: 'in-progress',
      priority: 'high',
      budget: 50000,
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-12-31'),
      deliverables: [
        {
          name: 'UI/UX Design',
          description: 'Complete design mockups and prototypes',
          completed: true
        },
        {
          name: 'Frontend Development',
          description: 'React-based frontend implementation',
          completed: false
        },
        {
          name: 'Backend Integration',
          description: 'API integration and backend connectivity',
          completed: false
        }
      ],
      teamMembers: [user2._id, admin._id],
      tags: ['web', 'design', 'react'],
      createdBy: user1._id
    });
    await project1.save();

    const project2 = new Project({
      name: 'Mobile App Development',
      description: 'iOS and Android mobile application for customer engagement',
      client: client1._id,
      status: 'planning',
      priority: 'medium',
      budget: 75000,
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-03-31'),
      deliverables: [
        {
          name: 'Requirements Analysis',
          description: 'Detailed requirements gathering and analysis',
          completed: false
        },
        {
          name: 'iOS Development',
          description: 'Native iOS application development',
          completed: false
        },
        {
          name: 'Android Development',
          description: 'Native Android application development',
          completed: false
        }
      ],
      teamMembers: [user1._id],
      tags: ['mobile', 'ios', 'android'],
      createdBy: user1._id
    });
    await project2.save();

    const project3 = new Project({
      name: 'ERP System Implementation',
      description: 'Implementation of enterprise resource planning system',
      client: client2._id,
      status: 'completed',
      priority: 'urgent',
      budget: 150000,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-07-31'),
      deliverables: [
        {
          name: 'System Analysis',
          description: 'Current system analysis and requirements',
          completed: true
        },
        {
          name: 'ERP Installation',
          description: 'Installation and configuration of ERP system',
          completed: true
        },
        {
          name: 'Data Migration',
          description: 'Migration of existing data to new system',
          completed: true
        },
        {
          name: 'Training',
          description: 'Staff training and documentation',
          completed: true
        }
      ],
      teamMembers: [admin._id, user1._id, user2._id],
      tags: ['erp', 'enterprise', 'implementation'],
      createdBy: user2._id
    });
    await project3.save();

    const project4 = new Project({
      name: 'Cloud Migration',
      description: 'Migration of legacy systems to cloud infrastructure',
      client: client3._id,
      status: 'on-hold',
      priority: 'low',
      budget: 100000,
      startDate: new Date('2025-10-01'),
      endDate: new Date('2026-02-28'),
      deliverables: [
        {
          name: 'Infrastructure Assessment',
          description: 'Assessment of current infrastructure',
          completed: false
        },
        {
          name: 'Cloud Architecture Design',
          description: 'Design of cloud-based architecture',
          completed: false
        }
      ],
      teamMembers: [admin._id],
      tags: ['cloud', 'migration', 'infrastructure'],
      createdBy: admin._id
    });
    await project4.save();

    console.log('Created projects');

    console.log('\n=== SEED COMPLETED SUCCESSFULLY ===');
    console.log('\nCreated Users:');
    console.log('- Admin: admin@example.com / AdminPass123');
    console.log('- User 1: john@example.com / UserPass123');
    console.log('- User 2: jane@example.com / UserPass123');
    
    console.log('\nCreated Clients:');
    console.log('- Acme Corporation (created by johndoe)');
    console.log('- Global Innovations (created by janedoe)');
    console.log('- TechStart Solutions (created by admin)');
    
    console.log('\nCreated Projects:');
    console.log('- Website Redesign (Acme Corp - in-progress)');
    console.log('- Mobile App Development (Acme Corp - planning)');
    console.log('- ERP System Implementation (Global Innovations - completed)');
    console.log('- Cloud Migration (TechStart Solutions - on-hold)');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// Run the seeder
if (require.main === module) {
  seedData();
}

module.exports = seedData;
