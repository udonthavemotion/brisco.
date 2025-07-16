const axios = require('axios');
require('dotenv').config();

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

// Axios configuration
const apiClient = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Sample puppy data
const puppyData = [
  {
    name: "Joker",
    status: "Available",
    price: 5500.00,
    date_of_birth: "2024-01-15",
    gender: "Male",
    color: "Brindle",
    weight: 18.5,
    parents: "Hannibal x Harley Quinn",
    description: "Beautiful brindle male puppy with excellent temperament. From champion bloodlines with proven genetics.",
    healthrecords: "Up to date on all vaccinations, health checked by certified veterinarian. No genetic issues detected."
  },
  {
    name: "Scarlett",
    status: "Available",
    price: 6000.00,
    date_of_birth: "2024-02-08",
    gender: "Female",
    color: "Red",
    weight: 16.0,
    parents: "American Psycho x Mystique",
    description: "Stunning red female with exceptional structure and conformation. Perfect for breeding or companionship.",
    healthrecords: "Full health screening completed. All vaccinations current. Excellent health certificate."
  },
  {
    name: "Raven",
    status: "Reserved",
    price: 5800.00,
    date_of_birth: "2024-01-22",
    gender: "Female",
    color: "Black",
    weight: 17.2,
    parents: "The Batman x Poison Ivy",
    description: "Rare black female with unique coloring and strong bloodlines. Reserved for special breeding program.",
    healthrecords: "Comprehensive health evaluation passed. Genetic testing completed with excellent results."
  },
  {
    name: "Draco",
    status: "Available",
    price: 5200.00,
    date_of_birth: "2024-03-05",
    gender: "Male",
    color: "Fawn",
    weight: 19.8,
    parents: "Metallica x Luna",
    description: "Fawn male with classic English Bulldog features. Strong build and gentle personality.",
    healthrecords: "All health checks passed. Vaccinations up to date. Clean bill of health."
  },
  {
    name: "Deadpool",
    status: "Pending",
    price: 5900.00,
    date_of_birth: "2024-02-14",
    gender: "Male",
    color: "Red and White",
    weight: 18.0,
    parents: "Joker x Harley Quinn",
    description: "Striking red and white male with unique markings. Pending final health screening.",
    healthrecords: "Initial health screening completed. Awaiting final vaccination series."
  },
  {
    name: "Wolverine",
    status: "Available",
    price: 5400.00,
    date_of_birth: "2024-01-30",
    gender: "Male",
    color: "Brindle and White",
    weight: 20.1,
    parents: "Hannibal x Storm",
    description: "Large brindle and white male with excellent bone structure. Champion potential.",
    healthrecords: "Complete health evaluation passed. All genetic tests negative. Excellent breeding candidate."
  }
];

async function createPuppy(puppyInfo) {
  try {
    console.log(`\n📝 Creating puppy: ${puppyInfo.name}`);
    
    const response = await apiClient.post('/api/puppies', {
      data: puppyInfo
    });
    
    console.log(`✅ Successfully created ${puppyInfo.name} (ID: ${response.data.data.id})`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error creating ${puppyInfo.name}:`, error.response?.data?.error || error.message);
    return null;
  }
}

async function publishPuppy(puppyId) {
  try {
    const response = await apiClient.put(`/api/puppies/${puppyId}`, {
      data: {
        publishedAt: new Date().toISOString()
      }
    });
    
    console.log(`📢 Published puppy ID: ${puppyId}`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error publishing puppy ${puppyId}:`, error.response?.data?.error || error.message);
    return null;
  }
}

async function checkConnection() {
  try {
    console.log('🔍 Checking Strapi connection...');
    const response = await apiClient.get('/api/puppies');
    console.log('✅ Connection successful');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔐 Authentication Error:');
      console.log('1. Make sure STRAPI_TOKEN is set in your .env file');
      console.log('2. Generate a new API token in Strapi admin: Settings > API Tokens');
      console.log('3. Set token type to "Full access" or "Custom" with read/write permissions');
    }
    
    return false;
  }
}

async function clearExistingPuppies() {
  try {
    console.log('🧹 Clearing existing puppies...');
    const response = await apiClient.get('/api/puppies');
    const existingPuppies = response.data.data;
    
    for (const puppy of existingPuppies) {
      await apiClient.delete(`/api/puppies/${puppy.id}`);
      console.log(`🗑️ Deleted puppy: ${puppy.attributes.name}`);
    }
    
    console.log('✅ Existing puppies cleared');
  } catch (error) {
    console.error('⚠️ Error clearing puppies:', error.response?.data?.error || error.message);
  }
}

async function main() {
  console.log('🚀 Starting puppy population script...');
  console.log(`📡 Strapi URL: ${STRAPI_URL}`);
  console.log(`🔑 Token configured: ${STRAPI_TOKEN ? 'Yes' : 'No'}`);
  
  // Check connection
  if (!await checkConnection()) {
    console.log('\n❌ Cannot connect to Strapi. Please check your configuration.');
    process.exit(1);
  }
  
  // Clear existing data
  await clearExistingPuppies();
  
  // Create new puppies
  console.log('\n📝 Creating new puppies...');
  const createdPuppies = [];
  
  for (const puppyInfo of puppyData) {
    const createdPuppy = await createPuppy(puppyInfo);
    if (createdPuppy) {
      createdPuppies.push(createdPuppy);
      
      // Publish the puppy
      await publishPuppy(createdPuppy.id);
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('\n🎉 Population script completed!');
  console.log(`✅ Successfully created ${createdPuppies.length} puppies`);
  console.log(`📊 Total puppies in database: ${createdPuppies.length}`);
  
  // Show summary
  console.log('\n📋 Summary:');
  createdPuppies.forEach((puppy, index) => {
    console.log(`${index + 1}. ${puppy.attributes.name} (${puppy.attributes.status}) - $${puppy.attributes.price}`);
  });
  
  console.log('\n🌐 You can now view your puppies at:');
  console.log(`   Admin: ${STRAPI_URL}/admin/content-manager/collection-types/api::puppy.puppy`);
  console.log(`   API: ${STRAPI_URL}/api/puppies`);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createPuppy, publishPuppy, main }; 