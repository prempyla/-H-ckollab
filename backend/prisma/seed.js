import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed skills
  const skillReact = await prisma.skill.upsert({
    where: { name: 'React' },
    update: {},
    create: { name: 'React', category: 'Frontend' },
  });

  const skillNode = await prisma.skill.upsert({
    where: { name: 'Node.js' },
    update: {},
    create: { name: 'Node.js', category: 'Backend' },
  });

  const skillPostgres = await prisma.skill.upsert({
    where: { name: 'PostgreSQL' },
    update: {},
    create: { name: 'PostgreSQL', category: 'Database' },
  });

  // Helper to create users
 const createUser = async (name, firebaseUidSuffix, skillObjs) => {
  return await prisma.user.upsert({
    where: { email: `${name.toLowerCase().replace(' ', '')}@example.com` },
    update: {
      skills: {
        deleteMany: {}, // clear old skills
        create: skillObjs.map(({ skill, level }) => ({
          skill: { connect: { id: skill.id } },
          level,
        })),
      },
    },
    create: {
      firebaseUid: `firebase_${firebaseUidSuffix}`,
      name,
      email: `${name.toLowerCase().replace(' ', '')}@example.com`,
      bio: `${name} is a developer.`,
      githubUrl: `https://github.com/${name.toLowerCase().replace(' ', '')}`,
      portfolioUrl: `https://${name.toLowerCase().replace(' ', '')}.dev`,
      availability: 'Available',
      skills: {
        create: skillObjs.map(({ skill, level }) => ({
          skill: { connect: { id: skill.id } },
          level,
        })),
      },
    },
  });
};


  // Seed users
  const users = [
    {
      name: 'Prem Pyla',
      id: 'test_123',
      skills: [
        { skill: skillReact, level: 'Advanced' },
        { skill: skillNode, level: 'Intermediate' },
      ],
    },
    {
      name: 'Ayush',
      id: 'test_ayush',
      skills: [
        { skill: skillReact, level: 'Intermediate' },
        { skill: skillPostgres, level: 'Beginner' },
      ],
    },
  ];

  // Create users
  const createdUsers = await Promise.all(
    users.map((u) => createUser(u.name, u.id, u.skills))
  );

  // Create sample projects
  // Create sample projects
const projects = await Promise.all([
  prisma.project.create({
    data: {
      title: 'Social Media Dashboard',
      description: 'A comprehensive dashboard for managing social media accounts and analytics',
      tags: ['Web Development', 'Dashboard', 'Analytics'],
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      maxTeamSize: 4,
      status: 'Open',
      collaborationType: 'Team',
      difficulty: 'Medium',   // ✅ Added
      rolesNeeded: ['Frontend', 'Backend'],  // ✅ Example, adjust if string[]
      visibility: 'Public',   // ✅ Common in your schema
      inviteStatus: 'Open',   // ✅ If required
      isDeleted: false,       // ✅ Boolean
      isOpen: true,           // ✅ Boolean
      deadline: new Date('2025-12-31T23:59:59Z'),  // ✅ Example deadline
      creatorId: createdUsers[0].id,
    },
  }),
  prisma.project.create({
    data: {
      title: 'Mobile Fitness App',
      description: 'A fitness tracking application with social features and workout plans',
      tags: ['Mobile App', 'Health', 'Fitness'],
      techStack: ['React Native', 'Firebase', 'Node.js'],
      maxTeamSize: 3,
      status: 'Open',
      collaborationType: 'Team',
      difficulty: 'Easy',
      rolesNeeded: ['Mobile Developer', 'Designer'],
      visibility: 'Public',
      inviteStatus: 'Open',
      isDeleted: false,
      isOpen: true,
      deadline: new Date('2025-12-31T23:59:59Z'),
      creatorId: createdUsers[1].id,
    },
  }),
]);


  console.log('✅ Seed data created successfully:', { users: createdUsers, projects });
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
