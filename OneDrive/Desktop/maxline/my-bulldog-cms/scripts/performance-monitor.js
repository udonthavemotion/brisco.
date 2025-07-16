const strapi = require('@strapi/strapi');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiCalls: 0,
      totalResponseTime: 0,
      slowQueries: [],
      errorCount: 0,
      memoryUsage: []
    };
    this.startTime = Date.now();
  }

  startMonitoring() {
    console.log('🚀 Starting performance monitoring...');
    
    // Memory usage monitoring
    setInterval(() => {
      const memUsage = process.memoryUsage();
      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        rss: memUsage.rss,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external
      });
      
      // Keep only last 100 measurements
      if (this.metrics.memoryUsage.length > 100) {
        this.metrics.memoryUsage.shift();
      }
    }, 30000); // Every 30 seconds

    // API response time monitoring
    this.interceptAPI();
  }

  interceptAPI() {
    // Intercept entity service calls
    const originalFindMany = strapi.entityService.findMany;
    const originalFindOne = strapi.entityService.findOne;
    const originalCreate = strapi.entityService.create;
    const originalUpdate = strapi.entityService.update;
    const originalDelete = strapi.entityService.delete;

    const wrapMethod = (method, methodName) => {
      return async (...args) => {
        const startTime = Date.now();
        this.metrics.apiCalls++;

        try {
          const result = await method.apply(strapi.entityService, args);
          const duration = Date.now() - startTime;
          this.metrics.totalResponseTime += duration;

          // Log slow queries (> 1 second)
          if (duration > 1000) {
            this.metrics.slowQueries.push({
              method: methodName,
              args: args[0], // Content type
              duration,
              timestamp: Date.now()
            });
          }

          return result;
        } catch (error) {
          this.metrics.errorCount++;
          throw error;
        }
      };
    };

    strapi.entityService.findMany = wrapMethod(originalFindMany, 'findMany');
    strapi.entityService.findOne = wrapMethod(originalFindOne, 'findOne');
    strapi.entityService.create = wrapMethod(originalCreate, 'create');
    strapi.entityService.update = wrapMethod(originalUpdate, 'update');
    strapi.entityService.delete = wrapMethod(originalDelete, 'delete');
  }

  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.metrics.apiCalls > 0 ? 
      this.metrics.totalResponseTime / this.metrics.apiCalls : 0;

    return {
      uptime,
      apiCalls: this.metrics.apiCalls,
      averageResponseTime: avgResponseTime,
      slowQueries: this.metrics.slowQueries.slice(-10), // Last 10 slow queries
      errorCount: this.metrics.errorCount,
      memoryUsage: this.metrics.memoryUsage.slice(-10) // Last 10 memory measurements
    };
  }

  generateReport() {
    const metrics = this.getMetrics();
    const report = {
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(metrics.uptime / 1000 / 60)} minutes`,
      performance: {
        totalAPICalls: metrics.apiCalls,
        averageResponseTime: `${metrics.averageResponseTime.toFixed(2)}ms`,
        slowQueries: metrics.slowQueries.length,
        errorRate: `${((metrics.errorCount / metrics.apiCalls) * 100).toFixed(2)}%`
      },
      memory: {
        current: process.memoryUsage(),
        trend: metrics.memoryUsage.length > 1 ? 
          metrics.memoryUsage[metrics.memoryUsage.length - 1].heapUsed - 
          metrics.memoryUsage[0].heapUsed : 0
      },
      recommendations: this.generateRecommendations(metrics)
    };

    return report;
  }

  generateRecommendations(metrics) {
    const recommendations = [];

    if (metrics.averageResponseTime > 500) {
      recommendations.push('Consider adding database indexes for frequently queried fields');
    }

    if (metrics.slowQueries.length > 5) {
      recommendations.push('Multiple slow queries detected - optimize queries or add caching');
    }

    if (metrics.errorCount > 10) {
      recommendations.push('High error rate - check logs for recurring issues');
    }

    if (metrics.memoryUsage.length > 0) {
      const latestMemory = metrics.memoryUsage[metrics.memoryUsage.length - 1];
      if (latestMemory.heapUsed > 100 * 1024 * 1024) { // 100MB
        recommendations.push('Memory usage is high - consider memory optimization');
      }
    }

    return recommendations;
  }

  saveReport() {
    const report = this.generateReport();
    const reportPath = path.join(process.cwd(), 'logs', `performance_${Date.now()}.json`);
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), 'logs'))) {
      fs.mkdirSync(path.join(process.cwd(), 'logs'));
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Performance report saved to ${reportPath}`);
    return report;
  }
}

// CLI usage
async function runPerformanceMonitor() {
  const command = process.argv[2];
  
  const monitor = new PerformanceMonitor();
  
  try {
    await strapi().load();
    
    switch (command) {
      case 'start':
        monitor.startMonitoring();
        console.log('Performance monitoring started. Press Ctrl+C to stop and generate report.');
        
        process.on('SIGINT', () => {
          console.log('\n🛑 Stopping performance monitor...');
          const report = monitor.saveReport();
          console.log('📋 Performance Summary:');
          console.log(`API Calls: ${report.performance.totalAPICalls}`);
          console.log(`Average Response Time: ${report.performance.averageResponseTime}`);
          console.log(`Error Rate: ${report.performance.errorRate}`);
          console.log(`Recommendations: ${report.recommendations.length}`);
          process.exit(0);
        });
        
        // Keep process running
        setInterval(() => {
          const metrics = monitor.getMetrics();
          console.log(`📈 API Calls: ${metrics.apiCalls}, Avg Response: ${metrics.averageResponseTime.toFixed(2)}ms`);
        }, 60000); // Every minute
        
        break;
        
      case 'report':
        const report = monitor.generateReport();
        console.log(JSON.stringify(report, null, 2));
        break;
        
      default:
        console.log(`
📊 Performance Monitor Commands:
  start   - Start monitoring (run with your app)
  report  - Generate current performance report

Examples:
  node scripts/performance-monitor.js start
  node scripts/performance-monitor.js report
        `);
    }
  } catch (error) {
    console.error('❌ Performance monitor failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runPerformanceMonitor();
}

module.exports = PerformanceMonitor; 