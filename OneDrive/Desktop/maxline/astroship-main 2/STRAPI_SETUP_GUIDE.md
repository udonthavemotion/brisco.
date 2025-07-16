# 🔧 Strapi Integration Fix Guide

## The Issue
You're getting a `400 error` on `/content-manager/preview/url/api::puppy.puppy` because:
1. The `puppy` collection type doesn't exist in Strapi
2. The populate script is hitting the wrong endpoint
3. API permissions may not be configured properly

## 🚀 Step-by-Step Solution

### Step 1: Access Strapi Admin Panel
1. Make sure Strapi is running: `cd /e/maxline/my-bulldog-cms && npm run develop`
2. Navigate to: `http://localhost:1337/admin`
3. Log in with your admin credentials

### Step 2: Create Collection Types

#### A. Create Puppy Collection Type
1. In Strapi admin, go to **Content-Types Builder**
2. Click **Create new collection type**
3. Name it `puppy` (singular)
4. Add these fields:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| name | Text | Yes | Unique |
| status | Enumeration | Yes | Values: Available, Reserved, Sold |
| dateOfBirth | Date | Yes | - |
| price | Text | Yes | - |
| gender | Enumeration | Yes | Values: Male, Female |
| color | Text | No | - |
| weight | Text | No | - |
| description | Long Text | No | - |
| parents | Long Text | No | - |
| healthRecords | Long Text | No | - |
| images | Media | No | Multiple files, Images only |

5. Click **Save** and **Restart** when prompted

#### B. Create Stud Collection Type
1. Click **Create new collection type**
2. Name it `stud` (singular)
3. Add these fields:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| name | Text | Yes | Unique |
| age | Text | Yes | - |
| status | Enumeration | Yes | Values: Available, Busy, Reserved, Retired |
| studFee | Text | Yes | - |
| description | Long Text | No | - |
| bloodlines | JSON | No | - |
| specialties | JSON | No | - |
| dnaInformation | Long Text | No | - |
| healthRecords | Long Text | No | - |
| weight | Text | No | - |
| color | Text | No | - |
| images | Media | No | Multiple files, Images only |

4. Click **Save** and **Restart** when prompted

### Step 3: Configure API Permissions
1. Go to **Settings** → **Users & Permissions** → **Roles**
2. Click on **Public** role
3. Scroll down to **Permissions**
4. Under **Puppy**:
   - ✅ Check `find` and `findOne`
5. Under **Stud**:
   - ✅ Check `find` and `findOne`
6. Click **Save**

### Step 4: Create API Token
1. Go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. Name: `populate-script`
4. Token duration: `Unlimited`
5. Token type: `Full access`
6. Click **Save**
7. **Copy the token** (you'll need it for the script)

### Step 5: Update Your Populate Script
1. Replace your current populate script with the fixed version in `fixed-populate-script.js`
2. Update the `API_TOKEN` variable with your actual token
3. Run the script: `node fixed-populate-script.js`

### Step 6: Test the Integration
1. Once data is populated, visit: `http://localhost:1337/api/puppies`
2. You should see JSON data for puppies
3. Visit: `http://localhost:1337/api/studs`
4. You should see JSON data for studs

## 🔧 Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution:** Update your API token in the script

### Issue: 400 Bad Request
**Solution:** Ensure collection types are created and match the field names exactly

### Issue: 404 Not Found
**Solution:** Check that the collection type names are correct (puppy/stud, not puppies/studs in the schema)

### Issue: Data not appearing on frontend
**Solution:** Update your Astro pages to fetch from Strapi instead of using mock data

## 🔄 Next Steps: Update Astro Frontend

Once Strapi is working, update your Astro files:

### Update `src/pages/puppies.astro`
Replace the mock data section with:

```javascript
// Replace this line:
// const mockPuppies: Puppy[] = [...]

// With this:
const response = await fetch('http://localhost:1337/api/puppies?populate=images');
const { data } = await response.json();
const puppies = data.map(puppy => ({
  id: puppy.id,
  name: puppy.attributes.name,
  status: puppy.attributes.status,
  dob: puppy.attributes.dateOfBirth,
  price: puppy.attributes.price,
  images: puppy.attributes.images?.data?.map(img => ({
    src: `http://localhost:1337${img.attributes.url}`,
    alt: img.attributes.alternativeText || puppy.attributes.name
  })) || [{ src: 'https://placehold.co/400x300?text=No+Image', alt: 'No image' }]
}));
```

### Update `src/pages/studs.astro`
Replace the mock data section with:

```javascript
// Replace this line:
// const studs: Stud[] = [...]

// With this:
const response = await fetch('http://localhost:1337/api/studs?populate=images');
const { data } = await response.json();
const studs = data.map(stud => ({
  id: stud.id,
  name: stud.attributes.name,
  age: stud.attributes.age,
  status: stud.attributes.status,
  fee: stud.attributes.studFee,
  description: stud.attributes.description,
  bloodlines: stud.attributes.bloodlines || [],
  specialties: stud.attributes.specialties || [],
  images: stud.attributes.images?.data?.map(img => ({
    src: `http://localhost:1337${img.attributes.url}`,
    alt: img.attributes.alternativeText || stud.attributes.name
  })) || [{ src: 'https://placehold.co/400x300?text=No+Image', alt: 'No image' }]
}));
```

## ✅ Verification Checklist

- [ ] Strapi is running on port 1337
- [ ] Puppy collection type created with correct fields
- [ ] Stud collection type created with correct fields
- [ ] API permissions configured for public access
- [ ] API token created and added to script
- [ ] Populate script runs without errors
- [ ] API endpoints return data
- [ ] Astro frontend updated to fetch from Strapi
- [ ] Website displays real data instead of placeholders

## 🆘 Still Having Issues?

If you're still getting errors:
1. Check the Strapi server logs for detailed error messages
2. Verify the collection type names match exactly (case-sensitive)
3. Ensure all required fields are included in your populate script
4. Test API endpoints directly in browser or Postman
5. Check that Strapi is running on the correct port (1337)

Your 400 error should be resolved once you follow these steps! 