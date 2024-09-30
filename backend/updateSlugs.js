const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const Tour = require('./models/tourmodel'); // Adjust the path as necessary

dotenv.config();

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Database Connected");

    // Define the updateSlugs function
    const updateSlugs = async () => {
      try {
        const tours = await Tour.find();
        for (const tour of tours) {
          if (!tour.slug) {
            tour.slug = slugify(tour.name, { lower: true });
            await tour.save();
          }
        }
        console.log('Slugs updated!');
      } catch (error) {
        console.error('Error updating slugs:', error);
      } finally {
        mongoose.disconnect(); // Close the database connection when done
      }
    };

    // Call the updateSlugs function
    updateSlugs().catch(console.error);
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
