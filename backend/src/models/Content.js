import { db } from '../config/database.js';

export class Content {
  constructor(data = {}) {
    this.id = data.id || null;
    this.timelineId = data.timelineId || null;
    this.era = data.era || '';
    this.title = data.title || '';
    this.subtitle = data.subtitle || '';
    this.dateRange = data.dateRange || '';
    this.description = data.description || '';
    this.image = data.image || null;
    this.tags = data.tags || [];
    this.blocks = data.blocks || [];
    this.gallery = data.gallery || [];
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get all content entries
  static async getAll() {
    try {
      const [rows] = await db.execute(
        `SELECT
          c.id, c.timeline_id as timelineId, c.era, c.title, c.subtitle,
          c.date_range as dateRange, c.description, c.image, c.tags,
          c.blocks, c.gallery, c.is_active as isActive,
          c.created_at as createdAt, c.updated_at as updatedAt,
          t.title as timelineTitle
         FROM content_entries c
         LEFT JOIN timeline_entries t ON c.timeline_id = t.id
         WHERE c.is_active = 1
         ORDER BY c.created_at DESC`
      );

      return rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : [],
        blocks: row.blocks ? JSON.parse(row.blocks) : [],
        gallery: row.gallery ? JSON.parse(row.gallery) : []
      }));
    } catch (error) {
      console.error('Error fetching content entries:', error);
      throw error;
    }
  }

  // Get content entry by ID
  static async getById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT
          c.id, c.timeline_id as timelineId, c.era, c.title, c.subtitle,
          c.date_range as dateRange, c.description, c.image, c.tags,
          c.blocks, c.gallery, c.is_active as isActive,
          c.created_at as createdAt, c.updated_at as updatedAt,
          t.title as timelineTitle
         FROM content_entries c
         LEFT JOIN timeline_entries t ON c.timeline_id = t.id
         WHERE c.id = ? AND c.is_active = 1`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const entry = rows[0];
      return {
        ...entry,
        tags: entry.tags ? JSON.parse(entry.tags) : [],
        blocks: entry.blocks ? JSON.parse(entry.blocks) : [],
        gallery: entry.gallery ? JSON.parse(entry.gallery) : []
      };
    } catch (error) {
      console.error('Error fetching content entry:', error);
      throw error;
    }
  }

  // Get content by timeline ID
  static async getByTimelineId(timelineId) {
    try {
      const [rows] = await db.execute(
        `SELECT
          c.id, c.timeline_id as timelineId, c.era, c.title, c.subtitle,
          c.date_range as dateRange, c.description, c.image, c.tags,
          c.blocks, c.gallery, c.is_active as isActive,
          c.created_at as createdAt, c.updated_at as updatedAt
         FROM content_entries c
         WHERE c.timeline_id = ? AND c.is_active = 1
         ORDER BY c.created_at DESC`,
        [timelineId]
      );

      return rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : [],
        blocks: row.blocks ? JSON.parse(row.blocks) : [],
        gallery: row.gallery ? JSON.parse(row.gallery) : []
      }));
    } catch (error) {
      console.error('Error fetching content by timeline ID:', error);
      throw error;
    }
  }

  // Create new content entry
  static async create(data) {
    try {
      const content = new Content(data);
      const tagsJson = JSON.stringify(content.tags);
      const blocksJson = JSON.stringify(content.blocks);
      const galleryJson = JSON.stringify(content.gallery);

      const [result] = await db.execute(
        `INSERT INTO content_entries
         (timeline_id, era, title, subtitle, date_range, description,
          image, tags, blocks, gallery, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          content.timelineId,
          content.era,
          content.title,
          content.subtitle,
          content.dateRange,
          content.description,
          content.image,
          tagsJson,
          blocksJson,
          galleryJson,
          content.isActive
        ]
      );

      return await Content.getById(result.insertId);
    } catch (error) {
      console.error('Error creating content entry:', error);
      throw error;
    }
  }

  // Update content entry
  static async update(id, data) {
    try {
      const tagsJson = data.tags ? JSON.stringify(data.tags) : null;
      const blocksJson = data.blocks ? JSON.stringify(data.blocks) : null;
      const galleryJson = data.gallery ? JSON.stringify(data.gallery) : null;

      await db.execute(
        `UPDATE content_entries
         SET timeline_id = ?, era = ?, title = ?, subtitle = ?,
             date_range = ?, description = ?, image = ?, tags = ?,
             blocks = ?, gallery = ?, updated_at = NOW()
         WHERE id = ?`,
        [
          data.timelineId,
          data.era,
          data.title,
          data.subtitle,
          data.dateRange,
          data.description,
          data.image,
          tagsJson,
          blocksJson,
          galleryJson,
          id
        ]
      );

      return await Content.getById(id);
    } catch (error) {
      console.error('Error updating content entry:', error);
      throw error;
    }
  }

  // Soft delete content entry
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'UPDATE content_entries SET is_active = 0, updated_at = NOW() WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting content entry:', error);
      throw error;
    }
  }

  // Search content entries
  static async search(query) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await db.execute(
        `SELECT
          c.id, c.timeline_id as timelineId, c.era, c.title, c.subtitle,
          c.date_range as dateRange, c.description, c.image, c.tags,
          c.blocks, c.gallery, c.is_active as isActive,
          c.created_at as createdAt, c.updated_at as updatedAt,
          t.title as timelineTitle
         FROM content_entries c
         LEFT JOIN timeline_entries t ON c.timeline_id = t.id
         WHERE c.is_active = 1
           AND (c.title LIKE ? OR c.description LIKE ? OR c.era LIKE ?
                OR c.subtitle LIKE ? OR c.tags LIKE ?)
         ORDER BY c.created_at DESC`,
        [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
      );

      return rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : [],
        blocks: row.blocks ? JSON.parse(row.blocks) : [],
        gallery: row.gallery ? JSON.parse(row.gallery) : []
      }));
    } catch (error) {
      console.error('Error searching content entries:', error);
      throw error;
    }
  }

  // Get content by era
  static async getByEra(era) {
    try {
      const [rows] = await db.execute(
        `SELECT
          c.id, c.timeline_id as timelineId, c.era, c.title, c.subtitle,
          c.date_range as dateRange, c.description, c.image, c.tags,
          c.blocks, c.gallery, c.is_active as isActive,
          c.created_at as createdAt, c.updated_at as updatedAt
         FROM content_entries c
         WHERE c.era = ? AND c.is_active = 1
         ORDER BY c.created_at DESC`,
        [era]
      );

      return rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : [],
        blocks: row.blocks ? JSON.parse(row.blocks) : [],
        gallery: row.gallery ? JSON.parse(row.gallery) : []
      }));
    } catch (error) {
      console.error('Error fetching content by era:', error);
      throw error;
    }
  }

  // Get featured content
  static async getFeatured(limit = 5) {
    try {
      const [rows] = await db.execute(
        `SELECT
          c.id, c.timeline_id as timelineId, c.era, c.title, c.subtitle,
          c.date_range as dateRange, c.description, c.image, c.tags,
          c.is_active as isActive, c.created_at as createdAt
         FROM content_entries c
         WHERE c.is_active = 1 AND c.image IS NOT NULL
         ORDER BY c.created_at DESC
         LIMIT ?`,
        [limit]
      );

      return rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : []
      }));
    } catch (error) {
      console.error('Error fetching featured content:', error);
      throw error;
    }
  }

  // Get content statistics
  static async getStats() {
    try {
      const [stats] = await db.execute(`
        SELECT
          COUNT(*) as totalContent,
          COUNT(DISTINCT era) as totalEras,
          COUNT(CASE WHEN image IS NOT NULL THEN 1 END) as contentWithImages,
          COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as todayContent
        FROM content_entries
        WHERE is_active = 1
      `);

      return stats[0];
    } catch (error) {
      console.error('Error fetching content statistics:', error);
      throw error;
    }
  }
}