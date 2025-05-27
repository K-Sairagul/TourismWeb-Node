import axios from 'axios';
import { showAlert } from './alert';

export const toggleLikeTour = async (tourId, button) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/bookings/like/${tourId}`
    });

    if (res.data.status === 'success') {
      const liked = res.data.data.likes === 1; // Check if the tour is liked
      showAlert('success', liked ? 'Tour liked successfully' : 'Like removed');
      
      // Toggle the heart icon appearance
      if (liked) {
        button.classList.add('liked');
      } else {
        button.classList.remove('liked');
      }
    } else {
      showAlert('error', 'You must book the tour to like it.');
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Failed to like the tour');
  }
};
