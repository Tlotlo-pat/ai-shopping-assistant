import { translateText, summarizeReviews, rewriteQuery } from './ai.js';

// Helper to get product data from content script
async function fetchProductData() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getProductData' },
        (response) => {
          resolve(response || { product: '', description: '', reviews: [] });
        }
      );
    });
  });
}

// Translate button
document.getElementById('translateBtn').onclick = async () => {
  const data = await fetchProductData();
  if (!data.description) {
    document.getElementById('output').innerText = 'No product description found.';
    return;
  }
  const translated = await translateText(data.description, 'en');
  document.getElementById('output').innerText = translated;
};

// Summarize button
// ---- Summarize Button ----
document.getElementById('summarizeBtn').onclick = async () => {
  const data = await fetchProductData();
  console.log('[popup.js] Received product data:', data);

  if (!data.reviews || data.reviews.length === 0) {
    document.getElementById('output').innerText = 'No reviews found.';
    return;
  }

  // Show "please wait" immediately
  document.getElementById('output').innerText = 'Summarizing reviews... Please wait.';

  try {
    const summary = await summarizeReviews(data.reviews);
    document.getElementById('output').innerText = summary;
  } catch (err) {
    console.error('[popup.js] Summarization failed:', err);
    document.getElementById('output').innerText = 'Error summarizing reviews.';
  }
};


// Rewrite Search Query button
document.getElementById('rewriteBtn').onclick = async () => {
  const query = document.getElementById('searchQuery').value;
  if (!query) {
    document.getElementById('output').innerText = 'Enter a query to optimize.';
    return;
  }

  // Show immediate feedback
  document.getElementById('output').innerText = 'Optimizing query... Please wait.';

  try {
    const rewritten = await rewriteQuery(query);

    // Show the optimized query in output
    document.getElementById('output').innerText = `Optimized Query: ${rewritten}`;

    // Open a new tab with search results (Google in this example)
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(rewritten)}`;
    window.open(searchUrl, '_blank');
  } catch (err) {
    console.error('[popup.js] Query rewrite failed:', err);
    document.getElementById('output').innerText = 'Error optimizing query.';
  }
};
