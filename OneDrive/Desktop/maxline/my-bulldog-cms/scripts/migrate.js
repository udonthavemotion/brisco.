const strapi = require('@strapi/strapi');
const fs = require('fs');
const path = require('path');

// Migration utilities
class MigrationManager {
  constructor() {
    this.strapi = null;
  }

  async init() {
    try {
      this.strapi = await strapi().load();
      console.log('🚀 Strapi loaded successfully');
    } catch (error) {
      console.error('❌ Error loading Strapi:', error);
      throw error;
    }
  }

  async exportData(contentType) {
    try {
      const data = await this.strapi.entityService.findMany(`api::${contentType}.${contentType}`, {
        populate: '*',
        pagination: { limit: -1 } // Get all records
      });
      
      const fileName = `${contentType}_export_${Date.now()}.json`;
      const filePath = path.join(process.cwd(), 'exports', fileName);
      
      // Create exports directory if it doesn't exist
      if (!fs.existsSync(path.join(process.cwd(), 'exports'))) {
        fs.mkdirSync(path.join(process.cwd(), 'exports'));
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Exported ${data.length} ${contentType} records to ${fileName}`);
      return filePath;
    } catch (error) {
      console.error(`❌ Error exporting ${contentType}:`, error);
      throw error;
    }
  }

  async importData(contentType, filePath) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let successCount = 0;
      let errorCount = 0;

      for (const item of data) {
        try {
          // Remove id and timestamps for import
          const { id, createdAt, updatedAt, publishedAt, ...importData } = item;
          
          await this.strapi.entityService.create(`api::${contentType}.${contentType}`, {
            data: importData,
            populate: '*'
          });
          successCount++;
        } catch (error) {
          console.error(`❌ Error importing ${contentType} record:`, error);
          errorCount++;
        }
      }

      console.log(`✅ Imported ${successCount} ${contentType} records successfully`);
      if (errorCount > 0) {
        console.log(`⚠️  ${errorCount} records failed to import`);
      }
    } catch (error) {
      console.error(`❌ Error importing ${contentType}:`, error);
      throw error;
    }
  }

  async backup() {
    try {
      const contentTypes = ['puppy', 'stud'];
      const backupDir = path.join(process.cwd(), 'backups', `backup_${Date.now()}`);
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      for (const contentType of contentTypes) {
        const data = await this.strapi.entityService.findMany(`api::${contentType}.${contentType}`, {
          populate: '*',
          pagination: { limit: -1 }
        });
        
        const fileName = `${contentType}_backup.json`;
        const filePath = path.join(backupDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Backed up ${data.length} ${contentType} records`);
      }

      console.log(`🎉 Backup completed successfully in ${backupDir}`);
      return backupDir;
    } catch (error) {
      console.error('❌ Error during backup:', error);
      throw error;
    }
  }

  async cleanup() {
    if (this.strapi) {
      await this.strapi.destroy();
      console.log('🧹 Strapi instance cleaned up');
    }
  }
}

// CLI Commands
async function runMigration() {
  const command = process.argv[2];
  const contentType = process.argv[3];
  const filePath = process.argv[4];

  const migrationManager = new MigrationManager();
  
  try {
    await migrationManager.init();

    switch (command) {
      case 'export':
        if (!contentType) {
          console.error('❌ Please specify a content type (puppy, stud)');
          process.exit(1);
        }
        await migrationManager.exportData(contentType);
        break;
        
      case 'import':
        if (!contentType || !filePath) {
          console.error('❌ Please specify content type and file path');
          process.exit(1);
        }
        await migrationManager.importData(contentType, filePath);
        break;
        
      case 'backup':
        await migrationManager.backup();
        break;
        
      default:
        console.log(`
📋 Available commands:
  export <contentType>           - Export data to JSON
  import <contentType> <file>    - Import data from JSON
  backup                         - Backup all data

Examples:
  node scripts/migrate.js export puppy
  node scripts/migrate.js import puppy ./exports/puppy_export.json
  node scripts/migrate.js backup
        `);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrationManager.cleanup();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = MigrationManager; 