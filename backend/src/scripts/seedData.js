import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import College from '../models/College.js';
import Recruiter from '../models/Recruiter.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Opportunity from '../models/Opportunity.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data (optional - be careful in production!)
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await College.deleteMany({});
    await Recruiter.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Achievement.deleteMany({});
    await Opportunity.deleteMany({});

    // Create Skills
    console.log('Creating skills...');
    const skills = await Skill.insertMany([
      { name: 'JavaScript', category: 'technical', description: 'Programming language' },
      { name: 'Python', category: 'technical', description: 'Programming language' },
      { name: 'React', category: 'technical', description: 'Frontend framework' },
      { name: 'Node.js', category: 'technical', description: 'Backend runtime' },
      { name: 'MongoDB', category: 'technical', description: 'Database' },
      { name: 'HTML/CSS', category: 'technical', description: 'Web technologies' },
      { name: 'Communication', category: 'soft', description: 'Communication skills' },
      { name: 'Teamwork', category: 'soft', description: 'Working in teams' },
      { name: 'Problem Solving', category: 'soft', description: 'Analytical thinking' },
      { name: 'English', category: 'language', description: 'English language' }
    ]);
    console.log(`Created ${skills.length} skills`);

    // Create College
    console.log('Creating college...');
    const collegeUser = await User.create({
      email: 'college@example.com',
      password: 'password123',
      role: 'college',
      isEmailVerified: true
    });

    const college = await College.create({
      userId: collegeUser._id,
      name: 'Example University',
      code: 'EXU001',
      email: 'college@example.com',
      phone: '+1234567890',
      address: {
        street: '123 University St',
        city: 'Example City',
        state: 'Example State',
        pincode: '12345',
        country: 'USA'
      },
      website: 'https://example-university.edu',
      verified: true
    });
    console.log('Created college');

    // Create Recruiter
    console.log('Creating recruiter...');
    const recruiterUser = await User.create({
      email: 'recruiter@example.com',
      password: 'password123',
      role: 'recruiter',
      isEmailVerified: true
    });

    const recruiter = await Recruiter.create({
      userId: recruiterUser._id,
      companyName: 'Tech Corp',
      email: 'recruiter@example.com',
      phone: '+1234567891',
      website: 'https://techcorp.com',
      address: {
        street: '456 Tech Ave',
        city: 'Tech City',
        state: 'Tech State',
        pincode: '54321',
        country: 'USA'
      },
      description: 'Leading technology company',
      verified: true
    });
    console.log('Created recruiter');

    // Create Students
    console.log('Creating students...');
    const students = [];
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        email: `student${i}@example.com`,
        password: 'password123',
        role: 'student',
        isEmailVerified: true
      });

      const student = await Student.create({
        userId: user._id,
        firstName: `Student${i}`,
        lastName: 'Example',
        collegeId: college._id,
        enrollmentNumber: `ENR${String(i).padStart(3, '0')}`,
        yearOfStudy: Math.floor(Math.random() * 4) + 1,
        branch: ['Computer Science', 'Electronics', 'Mechanical'][Math.floor(Math.random() * 3)],
        phone: `+123456789${i}`,
        bio: `Bio for student ${i}`,
        skills: skills.slice(0, 3 + i).map(s => s._id),
        preferences: {
          jobTypes: ['full-time', 'internship'],
          locations: ['Remote', 'Tech City'],
          salaryRange: { min: 30000, max: 80000 }
        }
      });
      students.push(student);
    }
    console.log(`Created ${students.length} students`);

    // Create Projects
    console.log('Creating projects...');
    const projects = [];
    for (const student of students.slice(0, 3)) {
      const project = await Project.create({
        studentId: student._id,
        title: `Project by ${student.firstName}`,
        description: 'A sample project description',
        technologies: ['React', 'Node.js', 'MongoDB'],
        skills: [skills[0]._id, skills[2]._id],
        githubUrl: 'https://github.com/example/project',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-06-01'),
        isActive: true
      });
      projects.push(project);

      student.projects.push(project._id);
      await student.save();
    }
    console.log(`Created ${projects.length} projects`);

    // Create Achievements
    console.log('Creating achievements...');
    const achievements = [];
    for (const student of students.slice(0, 2)) {
      const achievement = await Achievement.create({
        studentId: student._id,
        title: `Certification for ${student.firstName}`,
        description: 'A sample certification',
        type: 'certification',
        issuer: 'Example Certifying Body',
        issueDate: new Date('2023-05-01'),
        certificateUrl: 'https://example.com/certificate.pdf',
        skills: [skills[0]._id],
        verificationStatus: 'verified',
        verifiedBy: college._id,
        verifiedAt: new Date()
      });
      achievements.push(achievement);

      student.achievements.push(achievement._id);
      await student.save();
    }
    console.log(`Created ${achievements.length} achievements`);

    // Create Opportunities
    console.log('Creating opportunities...');
    const opportunities = await Opportunity.insertMany([
      {
        recruiterId: recruiter._id,
        title: 'Full Stack Developer',
        description: 'Looking for a full stack developer with React and Node.js experience',
        type: 'full-time',
        location: {
          type: 'remote',
          country: 'USA'
        },
        salaryRange: {
          min: 60000,
          max: 90000,
          currency: 'USD'
        },
        requiredSkills: [skills[0]._id, skills[2]._id, skills[3]._id],
        requiredExperience: 1,
        requirements: ['Bachelors degree', 'Experience with React'],
        responsibilities: ['Develop web applications', 'Write clean code'],
        benefits: ['Health insurance', 'Remote work'],
        matchScoreThreshold: 60,
        isActive: true
      },
      {
        recruiterId: recruiter._id,
        title: 'Software Engineering Intern',
        description: 'Summer internship for software engineering students',
        type: 'internship',
        location: {
          type: 'hybrid',
          city: 'Tech City',
          state: 'Tech State',
          country: 'USA'
        },
        salaryRange: {
          min: 3000,
          max: 5000,
          currency: 'USD'
        },
        requiredSkills: [skills[0]._id, skills[1]._id],
        requiredExperience: 0,
        requirements: ['Currently enrolled in university'],
        responsibilities: ['Learn and contribute to projects'],
        benefits: ['Mentorship', 'Flexible hours'],
        matchScoreThreshold: 50,
        isActive: true
      }
    ]);
    console.log(`Created ${opportunities.length} opportunities`);

    // Add opportunities to recruiter
    recruiter.opportunities = opportunities.map(o => o._id);
    await recruiter.save();

    console.log('\n✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('College: college@example.com / password123');
    console.log('Recruiter: recruiter@example.com / password123');
    console.log('Students: student1@example.com to student5@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
