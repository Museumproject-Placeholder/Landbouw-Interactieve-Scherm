import { Timeline } from '../models/Timeline.js';
import { validationResult } from 'express-validator';

export const timelineController = {
  // Get all timeline entries
  getAll: async (req, res) => {
    try {
      const entries = await Timeline.getAll();
      res.json({
        success: true,
        data: entries,
        count: entries.length
      });
    } catch (error) {
      console.error('Timeline getAll error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch timeline entries',
        message: error.message
      });
    }
  },

  // Get timeline entry by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await Timeline.getById(id);

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Timeline entry not found'
        });
      }

      res.json({
        success: true,
        data: entry
      });
    } catch (error) {
      console.error('Timeline getById error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch timeline entry',
        message: error.message
      });
    }
  },

  // Create new timeline entry
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

      const entry = await Timeline.create(req.body);
      res.status(201).json({
        success: true,
        data: entry,
        message: 'Timeline entry created successfully'
      });
    } catch (error) {
      console.error('Timeline create error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create timeline entry',
        message: error.message
      });
    }
  },

  // Update timeline entry
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
      const entry = await Timeline.update(id, req.body);

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Timeline entry not found'
        });
      }

      res.json({
        success: true,
        data: entry,
        message: 'Timeline entry updated successfully'
      });
    } catch (error) {
      console.error('Timeline update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update timeline entry',
        message: error.message
      });
    }
  },

  // Delete timeline entry
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Timeline.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Timeline entry not found'
        });
      }

      res.json({
        success: true,
        message: 'Timeline entry deleted successfully'
      });
    } catch (error) {
      console.error('Timeline delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete timeline entry',
        message: error.message
      });
    }
  },

  // Search timeline entries
  search: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Search query must be at least 2 characters long'
        });
      }

      const results = await Timeline.search(q.trim());
      res.json({
        success: true,
        data: results,
        count: results.length,
        query: q.trim()
      });
    } catch (error) {
      console.error('Timeline search error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search timeline entries',
        message: error.message
      });
    }
  },

  // Get entries by era
  getByEra: async (req, res) => {
    try {
      const { era } = req.params;
      const entries = await Timeline.getByEra(era);

      res.json({
        success: true,
        data: entries,
        count: entries.length,
        era
      });
    } catch (error) {
      console.error('Timeline getByEra error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch timeline entries by era',
        message: error.message
      });
    }
  },

  // Update display order
  updateOrder: async (req, res) => {
    try {
      const { orderData } = req.body;

      if (!Array.isArray(orderData)) {
        return res.status(400).json({
          success: false,
          error: 'Order data must be an array'
        });
      }

      const updated = await Timeline.updateOrder(orderData);
      res.json({
        success: updated,
        message: updated ? 'Display order updated successfully' : 'Failed to update display order'
      });
    } catch (error) {
      console.error('Timeline updateOrder error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update display order',
        message: error.message
      });
    }
  }
};