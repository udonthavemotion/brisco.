# My Bulldog CMS - Strapi Backend

A comprehensive Strapi CMS backend for English Bulldog breeding management, built with security, performance, and scalability in mind.

## 🚀 Features

- **Content Management**: Puppies, Studs, and Media management
- **Security**: Role-based access control with custom policies
- **Performance**: Built-in monitoring and optimization
- **TypeScript**: Full TypeScript support with strict mode
- **Migration Tools**: Data export/import and backup utilities
- **Production Ready**: Environment-based configuration

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 6.x or higher
- Database (SQLite for development, PostgreSQL/MySQL for production)

## 🛠️ Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd my-bulldog-cms
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Development (SQLite)
   npm run develop

   # Production (PostgreSQL/MySQL)
   # Configure DATABASE_* variables in .env
   npm run build
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_CLIENT=sqlite  # or postgres/mysql
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Security (Generate strong keys for production!)
APP_KEYS=key1,key2,key3,key4
JWT_SECRET=your-jwt-secret
API_TOKEN_SALT=your-api-token-salt

# Performance
CACHE_ENABLED=true
REDIS_URL=redis://localhost:6379
```

### Database Migration

For production deployments or environment changes:

```bash
# Export data
npm run migrate:export puppy
npm run migrate:export stud

# Import data
npm run migrate:import puppy ./exports/puppy_export.json

# Full backup
npm run migrate:backup
```

## 🔐 Security Features

### Role-Based Access Control

- **Super Admin**: Full access to all content and settings
- **Admin**: Content management and user management
- **Editor**: Content creation and editing only
- **Authenticated**: Read-only access to published content

### Custom Policies

- **isOwner**: Ensures users can only modify their own content
- **isEditor**: Requires editor role or higher for content operations

### Security Best Practices

```javascript
// Applied automatically in config/middlewares.ts
- CORS protection
- Content Security Policy
- File upload restrictions
- Rate limiting
- Input sanitization
```

## 📊 Performance Monitoring

### Built-in Performance Monitor

```bash
# Start monitoring (run alongside your app)
npm run performance:start

# Generate performance report
npm run performance:report
```

### Monitoring Features

- API response time tracking
- Memory usage monitoring
- Slow query detection
- Error rate analysis
- Performance recommendations

### Optimization Tips

1. **Database Indexes**: Add indexes for frequently queried fields
2. **Query Optimization**: Use specific populate parameters
3. **Caching**: Enable Redis for production
4. **Image Optimization**: Use responsive breakpoints
5. **Pagination**: Implement proper pagination for large datasets

## 🎯 Content Types

### Puppy Schema
```json
{
  "name": "string (required)",
  "status": "Available | Reserved",
  "date_of_birth": "date",
  "price": "decimal",
  "gender": "Male | Female",
  "color": "string",
  "weight": "string",
  "description": "text",
  "parents": "text",
  "healthrecords": "string",
  "images": "media (multiple)"
}
```

### Stud Schema
```json
{
  "name": "string (required)",
  "age": "string",
  "status": "Available | Busy | Reserved",
  "fee": "decimal",
  "description": "richtext",
  "bloodlines": "text",
  "specialties": "text",
  "images": "media (multiple)"
}
```

## 🚀 Deployment

### Production Checklist

- [ ] Configure production database
- [ ] Set strong environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for your domain
- [ ] Set up backup strategy
- [ ] Configure monitoring
- [ ] Test all API endpoints

### Environment-Specific Configurations

```javascript
// config/env/production/database.js
module.exports = {
  connection: {
    client: 'postgres',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  }
};
```

## 🛠️ Development

### TypeScript Support

```bash
# Generate types
npm run types:generate

# Type checking is enabled in strict mode
# See tsconfig.json for configuration
```

### API Testing

```bash
# Development server
npm run develop

# Test endpoints
curl http://localhost:1337/api/puppies
curl http://localhost:1337/api/studs
```

## 🔄 Migration & Backup

### Data Export/Import

```bash
# Export puppies
npm run migrate:export puppy

# Import puppies
npm run migrate:import puppy ./exports/puppy_export_123456.json

# Full backup
npm run migrate:backup
```

### Database Migrations

```bash
# Check migration status
npm run strapi migration:status

# Run migrations
npm run strapi migration:up
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database server is running
   - Test connection timeout settings

2. **Migration Failures**
   - Backup data before migrations
   - Check for pending migrations
   - Verify schema compatibility

3. **Performance Issues**
   - Use performance monitoring
   - Check for N+1 query problems
   - Optimize database queries
   - Enable caching

4. **Security Issues**
   - Update JWT secrets regularly
   - Review CORS settings
   - Check user permissions
   - Monitor failed login attempts

### Debug Commands

```bash
# Check system status
npm run strapi console

# View configuration
npm run strapi config:dump

# Database operations
npm run strapi db:migrate
npm run strapi db:seed
```

## 📚 API Documentation

### Endpoints

- `GET /api/puppies` - List all puppies
- `GET /api/puppies/:id` - Get single puppy
- `GET /api/studs` - List all studs
- `GET /api/studs/:id` - Get single stud

### Query Parameters

```javascript
// Pagination
?pagination[page]=1&pagination[pageSize]=10

// Population
?populate=images

// Filtering
?filters[status][$eq]=Available

// Sorting
?sort=createdAt:desc
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please check:
1. This README
2. Strapi Documentation
3. Performance monitoring reports
4. Log files in ./logs/

---

Built with ❤️ for Main Line Bulldogs
