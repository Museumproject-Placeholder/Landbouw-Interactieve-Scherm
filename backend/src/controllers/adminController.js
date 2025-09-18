import { Content } from '../models/Content.js';
import { Timeline } from '../models/Timeline.js';
import { db } from '../config/database.js';

export const adminController = {
  // Get dashboard statistics
  getStats: async (req, res) => {
    try {
      // Get content statistics
      const contentStats = await Content.getStats();

      // Get timeline count
      const [timelineCount] = await db.execute(
        'SELECT COUNT(*) as count FROM timeline_entries WHERE is_active = 1'
      );

      // Get recent activities (mock data for now)
      const recentActivities = [
        {
          id: 1,
          description: 'New content added: Modern Farming Techniques',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          type: 'content_created'
        },
        {
          id: 2,
          description: 'Timeline entry updated: Industrial Revolution',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          type: 'timeline_updated'
        },
        {
          id: 3,
          description: 'System backup completed successfully',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
          type: 'system_backup'
        }
      ];

      // Mock visit statistics
      const visitStats = {
        totalVisits: 1547,
        todayVisits: 23,
        averageSessionTime: 8.5, // minutes
        popularContent: [
          { id: 1, title: 'Ancient Agriculture', views: 234 },
          { id: 2, title: 'Industrial Revolution', views: 189 },
          { id: 3, title: 'Modern Farming', views: 156 }
        ]
      };

      res.json({
        success: true,
        data: {
          content: contentStats,
          timeline: {
            totalEntries: timelineCount[0].count
          },
          visits: visitStats,
          system: {
            uptime: process.uptime(),
            status: 'operational',
            lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            version: process.env.APP_VERSION || '1.0.0'
          },
          recentActivities: recentActivities.slice(0, 10)
        }
      });
    } catch (error) {
      console.error('Admin getStats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard statistics',
        message: error.message
      });
    }
  },

  // Get system health
  getHealth: async (req, res) => {
    try {
      // Test database connection
      const [dbTest] = await db.execute('SELECT 1 as test');
      const dbHealthy = dbTest[0].test === 1;

      // Check disk space (mock for now)
      const diskSpace = {
        total: '500GB',
        used: '125GB',
        available: '375GB',
        percentUsed: 25
      };

      // Memory usage
      const memoryUsage = process.memoryUsage();

      res.json({
        success: true,
        data: {
          overall: 'healthy',
          components: {
            database: {
              status: dbHealthy ? 'healthy' : 'unhealthy',
              responseTime: Date.now() - req.startTime
            },
            server: {
              status: 'healthy',
              uptime: process.uptime(),
              memory: {
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB'
              }
            },
            storage: {
              status: 'healthy',
              disk: diskSpace
            }
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Admin getHealth error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch system health',
        message: error.message,
        data: {
          overall: 'unhealthy'
        }
      });
    }
  },

  // Get content overview for admin
  getContentOverview: async (req, res) => {
    try {
      const { page = 1, limit = 20, search, era } = req.query;
      const offset = (page - 1) * limit;

      let entries;
      if (search) {
        entries = await Content.search(search);
      } else if (era) {
        entries = await Content.getByEra(era);
      } else {
        entries = await Content.getAll();
      }

      // Apply pagination
      const total = entries.length;
      const paginatedEntries = entries.slice(offset, offset + parseInt(limit));

      res.json({
        success: true,
        data: paginatedEntries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        filters: { search, era }
      });
    } catch (error) {
      console.error('Admin getContentOverview error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch content overview',
        message: error.message
      });
    }
  },

  // Get timeline overview for admin
  getTimelineOverview: async (req, res) => {
    try {
      const entries = await Timeline.getAll();

      // Group by era for admin overview
      const groupedByEra = entries.reduce((acc, entry) => {
        const era = entry.era;
        if (!acc[era]) {
          acc[era] = [];
        }
        acc[era].push(entry);
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          entries,
          groupedByEra,
          summary: {
            totalEntries: entries.length,
            totalEras: Object.keys(groupedByEra).length
          }
        }
      });
    } catch (error) {
      console.error('Admin getTimelineOverview error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch timeline overview',
        message: error.message
      });
    }
  },

  // Get activity logs (mock implementation)
  getActivityLogs: async (req, res) => {
    try {
      const { page = 1, limit = 50, type } = req.query;
      const offset = (page - 1) * limit;

      // Mock activity logs
      const allActivities = [
        {
          id: 1,
          type: 'content_created',
          description: 'New content entry created: "Modern Farming Techniques"',
          userId: 'admin',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          details: { contentId: 15, title: 'Modern Farming Techniques' }
        },
        {
          id: 2,
          type: 'content_updated',
          description: 'Content entry updated: "Industrial Revolution"',
          userId: 'admin',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          details: { contentId: 8, title: 'Industrial Revolution' }
        },
        {
          id: 3,
          type: 'timeline_reordered',
          description: 'Timeline display order updated',
          userId: 'admin',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          details: { entriesAffected: 4 }
        },
        {
          id: 4,
          type: 'content_deleted',
          description: 'Content entry deleted: "Draft: Ancient Tools"',
          userId: 'admin',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          details: { contentId: 12, title: 'Draft: Ancient Tools' }
        }
      ];

      let filteredActivities = allActivities;
      if (type) {
        filteredActivities = allActivities.filter(activity => activity.type === type);
      }

      const total = filteredActivities.length;
      const paginatedActivities = filteredActivities.slice(offset, offset + parseInt(limit));

      res.json({
        success: true,
        data: paginatedActivities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        filters: { type }
      });
    } catch (error) {
      console.error('Admin getActivityLogs error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch activity logs',
        message: error.message
      });
    }
  },

  // Export data
  exportData: async (req, res) => {
    try {
      const { type = 'all' } = req.query;

      let data = {};

      if (type === 'all' || type === 'timeline') {
        data.timeline = await Timeline.getAll();
      }

      if (type === 'all' || type === 'content') {
        data.content = await Content.getAll();
      }

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="museum-export-${Date.now()}.json"`);
      res.json({
        success: true,
        exportDate: new Date().toISOString(),
        type,
        data
      });
    } catch (error) {
      console.error('Admin exportData error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export data',
        message: error.message
      });
    }
  }
};