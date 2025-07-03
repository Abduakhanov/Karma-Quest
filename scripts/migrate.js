#!/usr/bin/env node

/**
 * KarmaQuest Database Migration Script
 * Applies SQL migrations to the database
 */

import fs from 'fs';
import path from 'path';

// Mock database connection for demo
class MockDatabase {
  async query(sql) {
    console.log('🔄 Executing SQL:', sql.substring(0, 100) + '...');
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 100));
    return { rowCount: 1 };
  }

  async close() {
    console.log('📡 Database connection closed');
  }
}

async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  const db = new MockDatabase();
  const migrationsDir = path.join(process.cwd(), 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('📁 Creating migrations directory...');
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    console.log('ℹ️  No migration files found');
    return;
  }
  
  for (const file of migrationFiles) {
    console.log(`📄 Running migration: ${file}`);
    
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      await db.query(sql);
      console.log(`✅ Migration ${file} completed successfully`);
    } catch (error) {
      console.error(`❌ Migration ${file} failed:`, error.message);
      process.exit(1);
    }
  }
  
  await db.close();
  console.log('🎉 All migrations completed successfully!');
}

// Run migrations
runMigrations().catch(error => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});