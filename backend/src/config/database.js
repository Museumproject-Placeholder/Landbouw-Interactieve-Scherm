import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// Load environment variables
config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'museum_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'museum_laandbouw',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
let pool;

// Initialize database connection
export const connectDB = async () => {
  try {
    pool = mysql.createPool(dbConfig);

    // Test the connection
    const connection = await pool.getConnection();
    console.log(`✅ Connected to MySQL database: ${dbConfig.database}`);

    // Initialize database schema
    await initializeSchema();

    connection.release();
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('📝 Database will operate in fallback mode with mock data');
    // Don't throw error - allow app to run with mock data
    return null;
  }
};

// Initialize database schema
const initializeSchema = async () => {
  try {
    // Create timeline_entries table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS timeline_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        era VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        date_range VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500),
        tags JSON,
        \`order\` INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_era (era),
        INDEX idx_order (\`order\`),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create content_entries table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS content_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timeline_id INT,
        era VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        date_range VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500),
        tags JSON,
        blocks JSON,
        gallery JSON,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (timeline_id) REFERENCES timeline_entries(id) ON DELETE SET NULL,
        INDEX idx_timeline_id (timeline_id),
        INDEX idx_era (era),
        INDEX idx_active (is_active),
        FULLTEXT idx_search (title, description, subtitle)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create visit_logs table for analytics
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS visit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255),
        content_id INT,
        page_path VARCHAR(255),
        user_agent TEXT,
        ip_address VARCHAR(45),
        visit_duration INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session (session_id),
        INDEX idx_content (content_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create activity_logs table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        user_id VARCHAR(100),
        details JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_user (user_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Database schema initialized successfully');

    // Seed initial data if tables are empty
    await seedInitialData();

  } catch (error) {
    console.error('❌ Failed to initialize database schema:', error.message);
    throw error;
  }
};

// Seed initial data
const seedInitialData = async () => {
  try {
    // Check if timeline_entries has data
    const [timelineRows] = await pool.execute('SELECT COUNT(*) as count FROM timeline_entries');

    if (timelineRows[0].count === 0) {
      console.log('📝 Seeding initial timeline data...');

      const initialTimelineData = [
        {
          era: 'Ancient Times',
          title: 'Early Agriculture',
          dateRange: '10,000 - 3,000 BCE',
          description: 'The development of farming fundamentally changed human civilization. Early humans transitioned from hunting and gathering to cultivating crops and domesticating animals.',
          tags: JSON.stringify(['agriculture', 'civilization', 'tools', 'crops']),
          order: 1
        },
        {
          era: 'Medieval Period',
          title: 'Three-Field System',
          dateRange: '500 - 1500 CE',
          description: 'Medieval farmers developed the three-field system, rotating crops to maintain soil fertility and increase agricultural productivity across Europe.',
          tags: JSON.stringify(['medieval', 'crop rotation', 'productivity', 'europe']),
          order: 2
        },
        {
          era: 'Industrial Revolution',
          title: 'Agricultural Revolution',
          dateRange: '1760 - 1840',
          description: 'The Agricultural Revolution brought mechanization, selective breeding, and new farming techniques that dramatically increased food production.',
          tags: JSON.stringify(['industrial', 'mechanization', 'productivity', 'innovation']),
          order: 3
        },
        {
          era: 'Modern Era',
          title: 'Precision Agriculture',
          dateRange: '1990 - Present',
          description: 'Modern farming uses GPS, drones, sensors, and data analytics to optimize crop yields while minimizing environmental impact.',
          tags: JSON.stringify(['technology', 'precision', 'sustainability', 'data']),
          order: 4
        }
      ];

      for (const item of initialTimelineData) {
        await pool.execute(
          'INSERT INTO timeline_entries (era, title, date_range, description, tags, `order`) VALUES (?, ?, ?, ?, ?, ?)',
          [item.era, item.title, item.dateRange, item.description, item.tags, item.order]
        );
      }

      console.log('✅ Initial timeline data seeded successfully');
    }

    // Check if content_entries has data
    const [contentRows] = await pool.execute('SELECT COUNT(*) as count FROM content_entries');

    if (contentRows[0].count === 0) {
      console.log('📝 Seeding initial content data...');

      // Get the first timeline entry ID for reference
      const [firstTimeline] = await pool.execute('SELECT id FROM timeline_entries ORDER BY `order` LIMIT 1');

      if (firstTimeline.length > 0) {
        const sampleContent = {
          timeline_id: firstTimeline[0].id,
          era: 'Ancient Times',
          title: 'Early Agriculture',
          subtitle: 'The Birth of Civilization Through Farming',
          date_range: '10,000 - 3,000 BCE',
          description: 'The development of farming fundamentally changed human civilization.',
          tags: JSON.stringify(['agriculture', 'civilization', 'neolithic']),
          blocks: JSON.stringify([
            {
              type: 'text',
              title: 'The Agricultural Revolution',
              content: 'Around 10,000 years ago, humans began transitioning from a nomadic lifestyle of hunting and gathering to settling in one place and growing their own food.'
            }
          ]),
          gallery: JSON.stringify([])
        };

        await pool.execute(
          'INSERT INTO content_entries (timeline_id, era, title, subtitle, date_range, description, tags, blocks, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [sampleContent.timeline_id, sampleContent.era, sampleContent.title, sampleContent.subtitle,
           sampleContent.date_range, sampleContent.description, sampleContent.tags,
           sampleContent.blocks, sampleContent.gallery]
        );

        console.log('✅ Initial content data seeded successfully');
      }
    }

  } catch (error) {
    console.error('❌ Failed to seed initial data:', error.message);
    // Don't throw error - seeding is optional
  }
};

// Export the database connection
export const db = {
  execute: async (query, params) => {
    if (!pool) {
      throw new Error('Database connection not available');
    }
    return await pool.execute(query, params);
  },
  getConnection: async () => {
    if (!pool) {
      throw new Error('Database connection not available');
    }
    return await pool.getConnection();
  }
};

// Graceful shutdown
export const closeDB = async () => {
  if (pool) {
    await pool.end();
    console.log('🔌 Database connection closed');
  }
};

// Handle process termination
process.on('SIGTERM', closeDB);
process.on('SIGINT', closeDB);