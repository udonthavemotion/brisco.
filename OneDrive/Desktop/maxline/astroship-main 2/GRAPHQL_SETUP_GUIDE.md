# GraphQL Setup Guide for Strapi Backend

## Overview
This guide walks you through setting up GraphQL with your Strapi backend, including API token configuration and testing.

## Step 1: API Token Requirements

### Do you need an API token for GraphQL?
**Yes, you will need an API token** to access your GraphQL endpoint in most cases, especially for:
- Fetching content from content types
- Accessing media files and images
- Any operations beyond basic public queries

### Default GraphQL Permissions
By default, Strapi's GraphQL endpoint is protected and requires authentication for most operations.

## Step 2: Create API Token

### Through Strapi Admin Panel:

1. **Start your Strapi backend:**
   ```bash
   cd my-bulldog-cms
   npm run dev
   ```

2. **Access the admin panel:**
   - Open http://localhost:1337/admin
   - Log in with your admin credentials

3. **Create an API Token:**
   - Go to **Settings** → **API Tokens**
   - Click **Create new API Token**
   - Fill in the details:
     - **Name**: `GraphQL Frontend Token`
     - **Description**: `Token for frontend GraphQL queries`
     - **Token duration**: Choose based on your needs (Full access recommended for development)
     - **Token type**: `Read-only` or `Full access` (use Full access for development)

4. **Configure Permissions:**
   - After creating the token, you'll be redirected to permissions
   - Enable the following permissions for your content types:
     - **Stud**: `find`, `findOne`
     - **Puppy**: `find`, `findOne`
     - **Upload**: `find` (for media files)

5. **Copy the token:**
   - Copy the generated token immediately (you won't see it again)
   - Save it securely

## Step 3: Configure Environment Variables

### In your frontend (`astroship-main 2` directory):

1. **Create or update `.env` file:**
   ```env
   STRAPI_URL=http://localhost:1337
   STRAPI_TOKEN=your_token_here
   ```

2. **Add to `.env.local` (if you prefer):**
   ```env
   STRAPI_URL=http://localhost:1337
   STRAPI_TOKEN=your_actual_token_here
   ```

## Step 4: Test the GraphQL Connection

### Option 1: Using the Test Page
1. Make sure both servers are running:
   ```bash
   # Terminal 1: Strapi backend
   cd my-bulldog-cms
   npm run dev
   
   # Terminal 2: Astro frontend
   cd "astroship-main 2"
   npm run dev
   ```

2. Visit the test page:
   - Go to http://localhost:4321/test-graphql
   - Check for any error messages
   - Verify that data is being fetched

### Option 2: Direct GraphQL Testing
You can test the GraphQL endpoint directly using curl or a GraphQL client like GraphiQL:

```bash
# Test introspection (should work without token)
curl -X POST http://localhost:1337/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { queryType { name } } }"}'

# Test with token (replace YOUR_TOKEN)
curl -X POST http://localhost:1337/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query": "query { studs { data { id attributes { name status } } } }"}'
```

## Step 5: Troubleshooting Common Issues

### Issue 1: GraphQL endpoint returns 403 Forbidden
**Solution:** Check your API token permissions in the Strapi admin panel.

### Issue 2: GraphQL queries return empty results
**Solution:** Ensure your content types have published entries and the correct permissions are set.

### Issue 3: Images not loading
**Solution:** Check that the Upload permissions are enabled for your API token.

### Issue 4: Token not being sent
**Solution:** Verify the `STRAPI_TOKEN` environment variable is set correctly.

## Step 6: Production Considerations

### Security
- Use read-only tokens in production
- Set appropriate token expiration
- Use environment variables for sensitive data
- Consider IP restrictions if needed

### Performance
- Implement query caching
- Use pagination for large datasets
- Optimize image sizes and formats

## GraphQL Queries Available

### Fetch All Studs
```graphql
query GetStuds {
  studs {
    data {
      id
      attributes {
        name
        age
        status
        fee
        description
        bloodlines
        specialties
        images {
          data {
            id
            attributes {
              url
              alternativeText
              width
              height
              formats
            }
          }
        }
      }
    }
  }
}
```

### Fetch Available Studs Only
```graphql
query GetAvailableStuds {
  studs(filters: { status: { eq: "Available" } }) {
    data {
      id
      attributes {
        name
        age
        status
        fee
        description
        bloodlines
        specialties
        images {
          data {
            id
            attributes {
              url
              alternativeText
              width
              height
              formats
            }
          }
        }
      }
    }
  }
}
```

### Fetch Single Stud
```graphql
query GetStud($id: ID!) {
  stud(id: $id) {
    data {
      id
      attributes {
        name
        age
        status
        fee
        description
        bloodlines
        specialties
        images {
          data {
            id
            attributes {
              url
              alternativeText
              width
              height
              formats
            }
          }
        }
      }
    }
  }
}
```

### Fetch All Puppies
```graphql
query GetPuppies {
  puppies {
    data {
      id
      attributes {
        name
        status
        date_of_birth
        price
        gender
        color
        weight
        description
        parents
        healthrecords
        images {
          data {
            id
            attributes {
              url
              alternativeText
              width
              height
              formats
            }
          }
        }
      }
    }
  }
}
```

## Next Steps

1. **Test the setup** using the test page at `/test-graphql`
2. **Update your existing pages** to use the new GraphQL utilities
3. **Create homepage content types** for dynamic content management
4. **Add testimonials content type** for customer reviews
5. **Configure media upload permissions** for the admin panel

Remember to replace your REST API calls with the new GraphQL functions:
- `getStuds()` instead of the old REST service
- `getPuppies()` instead of the old REST service
- `getAvailableStuds()` for filtered results
- `getAvailablePuppies()` for filtered results 