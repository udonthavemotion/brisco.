export default ({ env }) => ({
  upload: {
    config: {
      sizeLimit: env.int('MAX_FILE_SIZE', 50 * 1024 * 1024), // 50MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
      // Add responsive image generation
      provider: 'local',
      providerOptions: {
        localServer: {
          maxage: 300000, // 5 minutes cache
        },
      },
    },
  },
  
  // Add GraphQL if needed
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      introspection: true,
      apolloServer: {
        tracing: false,
      },
    },
  },

  // Email configuration (disabled for now - install nodemailer if needed)
  // email: {
  //   config: {
  //     provider: 'nodemailer',
  //     providerOptions: {
  //       host: env('SMTP_HOST', 'localhost'),
  //       port: env.int('SMTP_PORT', 587),
  //       auth: {
  //         user: env('SMTP_USERNAME'),
  //         pass: env('SMTP_PASSWORD'),
  //       },
  //     },
  //     settings: {
  //       defaultFrom: env('SMTP_FROM', 'noreply@yourdomain.com'),
  //       defaultReplyTo: env('SMTP_FROM', 'noreply@yourdomain.com'),
  //     },
  //   },
  // },
});
