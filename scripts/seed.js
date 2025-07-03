#!/usr/bin/env node

/**
 * KarmaQuest Database Seeding Script
 * Seeds the database with initial quest data
 */

// Mock seeding for demo
async function seedDatabase() {
  console.log('🌱 Seeding database with initial quest data...');
  
  const quests = [
    {
      key: 'meditation_daily',
      title: 'Practice daily meditation',
      description: 'Spend 10 minutes in mindful meditation to center yourself',
      category: 'spirituality',
      priority: 4,
      xpReward: 25,
      beliefSystem: 'psychology'
    },
    {
      key: 'gratitude_journal',
      title: 'Write in gratitude journal',
      description: 'List 3 things you are grateful for today',
      category: 'spirituality',
      priority: 3,
      xpReward: 20,
      beliefSystem: 'psychology'
    },
    {
      key: 'chakra_balance',
      title: 'Balance your chakras',
      description: 'Perform chakra balancing meditation focusing on energy centers',
      category: 'health',
      priority: 4,
      xpReward: 30,
      beliefSystem: 'chakras'
    }
  ];
  
  for (const quest of quests) {
    console.log(`📝 Seeding quest: ${quest.key}`);
    // Simulate database insert
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log('✅ Database seeding completed!');
  console.log(`📊 Seeded ${quests.length} quests`);
}

// Run seeding
seedDatabase().catch(error => {
  console.error('💥 Seeding failed:', error);
  process.exit(1);
});