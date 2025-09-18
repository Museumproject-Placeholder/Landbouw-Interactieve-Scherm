import { db } from '../config/database.js';

export class Timeline {
  constructor(data = {}) {
    this.id = data.id || null;
    this.era = data.era || '';
    this.title = data.title || '';
    this.dateRange = data.dateRange || '';
    this.description = data.description || '';
    this.image = data.image || null;
    this.tags = data.tags || [];
    this.order = data.order || 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get all timeline entries
  static async getAll() {
    try {
      const [rows] = await db.execute(
        `SELECT
          id, era, title, date_range as dateRange, description,
          image, tags, \`order\`, is_active as isActive,
          created_at as createdAt, updated_at as updatedAt
         FROM timeline_entries
         WHERE is_active = 1
         ORDER BY \`order\` ASC, created_at ASC`
      );

      return rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : []
      }));
    } catch (error) {
      console.error('Error fetching timeline entries:', error);
      throw error;
    }
  }

  // Get timeline entry by ID
  static async getById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT
          id, era, title, date_range as dateRange, description,
          image, tags, \`order\`, is_active as isActive,
          created_at as createdAt, updated_at as updatedAt
         FROM timeline_entries
         WHERE id = ? AND is_active = 1`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const entry = rows[0];
      return {
        ...entry,
        tags: entry.tags ? JSON.parse(entry.tags) : []
      };
    } catch (error) {
      console.error('Error fetching timeline entry:', error);
      throw error;
    }
  }

  // Create new timeline entry
  static async create(data) {
    try {
      const timeline = new Timeline(data);
      const tagsJson = JSON.stringify(timeline.tags);

      const [result] = await db.execute(
        `INSERT INTO timeline_entries
         (era, title, date_range, description, image, tags, \`order\`, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          timeline.era,
          timeline.title,
          timeline.dateRange,
          timeline.description,
          timeline.image,
          tagsJson,
          timeline.order,
          timeline.isActive
        ]
      );

      return await Timeline.getById(result.insertId);
    } catch (error) {
      console.error('Error creating timeline entry:', error);
      throw error;
    }
  }

  // Update timeline entry
  static async update(id, data) {
    try {
      const tagsJson = data.tags ? JSON.stringify(data.tags) : null;

      await db.execute(
        `UPDATE timeline_entries
         SET era = ?, title = ?, date_range = ?, description = ?,
             image = ?, tags = ?, \`order\` = ?, updated_at = NOW()
         WHERE id = ?`,
        [
          data.era,
          data.title,
          data.dateRange,
          data.description,
          data.image,
          tagsJson,
          data.order || 0,
          id
        ]
      );

      return await Timeline.getById(id);
    } catch (error) {
      console.error('Error updating timeline entry:', error);
      throw error;
    }
  }

  // Soft delete timeline entry
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'UPDATE timeline_entries SET is_active = 0, updated_at = NOW() WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting timeline entry:', error);
      throw error;
    }
  }

  // Search timeline entries
  static async search(query) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await db.execute(
        `SELECT
          id, era, title, date_range as dateRange, description,
          image, tags, \`order\`, is_active as isActive,
          created_at as createdAt, updated_at as updatedAt
         FROM timeline_entries
         WHERE is_active = 1
           AND (title LIKE ? OR description LIKE ? OR era LIKE ? OR tags LIKE ?)
         ORDER BY \`order\` ASC, created_at ASC`,
        [searchTerm, searchTerm, searchTerm, searchTerm]
      );

      return rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : []
      }));
    } catch (error) {
      console.error('Error searching timeline entries:', error);
      throw error;
    }
  }

  // Get entries by era
  static async getByEra(era) {
    try {
      const [rows] = await db.execute(
        `SELECT
          id, era, title, date_range as dateRange, description,
          image, tags, \`order\`, is_active as isActive,
          created_at as createdAt, updated_at as updatedAt
         FROM timeline_entries
         WHERE era = ? AND is_active = 1
         ORDER BY \`order\` ASC, created_at ASC`,
        [era]
      );

      return rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : []
      }));
    } catch (error) {
      console.error('Error fetching entries by era:', error);
      throw error;
    }
  }

  // Update display order
  static async updateOrder(orderData) {
    try {
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        for (const item of orderData) {
          await connection.execute(
            'UPDATE timeline_entries SET `order` = ? WHERE id = ?',
            [item.order, item.id]
          );
        }

        await connection.commit();
        return true;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error updating timeline order:', error);
      throw error;
    }
  }
}