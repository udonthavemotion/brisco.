const studData = [
  {
    name: "Joker",
    age: "4 years",
    status: "Available",
    fee: 4500,
    description: "Key stud in our lineup. Movie villain themed bloodline with proven genetics.",
    bloodlines: "Madline Foundation",
    specialties: "Champion Bloodlines, Proven Producer"
  },
  {
    name: "Hannibal",
    age: "5 years", 
    status: "Available",
    fee: 5000,
    description: "Foundational male for our breeding program. Strong producer with excellent structure.",
    bloodlines: "Madline Foundation",
    specialties: "Foundational Genetics, Structure"
  },
  {
    name: "American Psycho",
    age: "4 years",
    status: "Available", 
    fee: 4800,
    description: "Core bloodline producer. Part of our elite breeding program.",
    bloodlines: "Madline Core, Champion Lines",
    specialties: "Exotic Colors, Champion Bloodlines"
  },
  {
    name: "The Batman",
    age: "3 years",
    status: "Available",
    fee: 5500,
    description: "Strong young stud with excellent genetics and structure. Part of our movie-themed bloodline.",
    bloodlines: "Madline Foundation, Dark Knight Lines",
    specialties: "Champion Bloodlines, Strong Structure"
  },
  {
    name: "Metallica",
    age: "4 years",
    status: "Busy",
    fee: 6000,
    description: "Premium stud with exceptional genetics. Currently engaged in breeding program.",
    bloodlines: "Metal Foundation, Champion Lines",
    specialties: "Premium Genetics, Proven Producer"
  },
  {
    name: "Ratatouille's Production",
    age: "3 years",
    status: "Available",
    fee: 5200,
    description: "Young energetic stud with excellent production potential. Part of our emerging bloodline.",
    bloodlines: "Production Lines, French Foundation",
    specialties: "High Energy, Production Potential"
  }
];

const puppyData = [
  {
    name: "Bella",
    status: "Available",
    date_of_birth: "2024-05-15",
    price: 2500
  },
  {
    name: "Max",
    status: "Available", 
    date_of_birth: "2024-04-20",
    price: 3000
  },
  {
    name: "Luna",
    status: "Reserved",
    date_of_birth: "2024-06-10",
    price: 2800
  },
  {
    name: "Charlie",
    status: "Available",
    date_of_birth: "2024-05-25",
    price: 2700
  },
  {
    name: "Daisy",
    status: "Available",
    date_of_birth: "2024-06-01",
    price: 2600
  }
];

async function populateData() {
  try {
    console.log('Starting to populate data...');
    
    // Add studs
    console.log('\n=== Adding Studs ===');
    for (const stud of studData) {
      console.log(`Adding stud: ${stud.name}...`);
      
      const response = await fetch('http://localhost:1337/api/studs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...stud,
            publishedAt: new Date().toISOString()
          }
        })
      });
      
      if (response.ok) {
        console.log(`✓ ${stud.name} added successfully`);
      } else {
        const error = await response.text();
        console.log(`✗ Error adding ${stud.name}: ${error}`);
      }
    }
    
    // Add puppies
    console.log('\n=== Adding Puppies ===');
    for (const puppy of puppyData) {
      console.log(`Adding puppy: ${puppy.name}...`);
      
      const response = await fetch('http://localhost:1337/api/puppies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...puppy,
            publishedAt: new Date().toISOString()
          }
        })
      });
      
      if (response.ok) {
        console.log(`✓ ${puppy.name} added successfully`);
      } else {
        const error = await response.text();
        console.log(`✗ Error adding ${puppy.name}: ${error}`);
      }
    }
    
    console.log('\n🎉 All data populated successfully!');
    console.log('You can now go to http://localhost:1337/admin to see your data');
    
  } catch (error) {
    console.error('Error populating data:', error.message);
  }
}

populateData(); 