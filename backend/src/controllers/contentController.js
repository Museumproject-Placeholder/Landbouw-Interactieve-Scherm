import { Content } from '../models/Content.js';
import { validationResult } from 'express-validator';

export const contentController = {
  // Get all content entries
  getAll: async (req, res) => {
    try {
      const { timeline_id, era, limit } = req.query;

      let entries;
      if (timeline_id) {
        entries = await Content.getByTimelineId(timeline_id);
      } else if (era) {
        entries = await Content.getByEra(era);
      } else {
        entries = await Content.getAll();
      }

      // Apply limit if specified
      if (limit) {
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum) && limitNum > 0) {
          entries = entries.slice(0, limitNum);
        }
      }

      res.json({
        success: true,
        data: entries,
        count: entries.length,
        filters: { timeline_id, era, limit }
      });
    } catch (error) {
      console.error('Content getAll error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch content entries',
        message: error.message
      });
    }
  },

  // Get content entry by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await Content.getById(id);

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Content entry not found'
        });
      }

      res.json({
        success: true,
        data: entry
      });
    } catch (error) {
      console.error('Content getById error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch content entry',
        message: error.message
      });
    }
  },

  // Create new content entry
  create: async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const entry = await Content.create(req.body);
      res.status(201).json({
        success: true,
        data: entry,
        message: 'Content entry created successfully'
      });
    } catch (error) {
      console.error('Content create error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create content entry',
        message: error.message
      });
    }
  },

  // Update content entry
  update: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const entry = await Content.update(id, req.body);

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Content entry not found'
        });
      }

      res.json({
        success: true,
        data: entry,
        message: 'Content entry updated successfully'
      });
    } catch (error) {
      console.error('Content update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update content entry',
        message: error.message
      });
    }
  },

  // Delete content entry
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Content.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Content entry not found'
        });
      }

      res.json({
        success: true,
        message: 'Content entry deleted successfully'
      });
    } catch (error) {
      console.error('Content delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete content entry',
        message: error.message
      });
    }
  },

  // Search content entries
  search: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Search query must be at least 2 characters long'
        });
      }

      const results = await Content.search(q.trim());
      res.json({
        success: true,
        data: results,
        count: results.length,
        query: q.trim()
      });
    } catch (error) {
      console.error('Content search error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search content entries',
        message: error.message
      });
    }
  },

  // Get entries by era
  getByEra: async (req, res) => {
    try {
      const { era } = req.params;
      const entries = await Content.getByEra(era);

      res.json({
        success: true,
        data: entries,
        count: entries.length,
        era
      });
    } catch (error) {
      console.error('Content getByEra error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch content entries by era',
        message: error.message
      });
    }
  },

  // Get featured content
  getFeatured: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const entries = await Content.getFeatured(limit);

      res.json({
        success: true,
        data: entries,
        count: entries.length
      });
    } catch (error) {
      console.error('Content getFeatured error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch featured content',
        message: error.message
      });
    }
  },

  // Get content statistics
  getStats: async (req, res) => {
    try {
      const stats = await Content.getStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Content getStats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch content statistics',
        message: error.message
      });
    }
  },

  // Bulk operations
  bulkDelete: async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'IDs must be provided as a non-empty array'
        });
      }

      const results = await Promise.allSettled(
        ids.map(id => Content.delete(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
      const failed = results.length - successful;

      res.json({
        success: true,
        message: `Bulk delete completed: ${successful} successful, ${failed} failed`,
        details: {
          successful,
          failed,
          total: ids.length
        }
      });
    } catch (error) {
      console.error('Content bulkDelete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to perform bulk delete',
        message: error.message
      });
    }
  }
};