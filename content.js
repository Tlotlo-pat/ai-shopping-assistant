chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getProductData') {
    console.log('[content.js] getProductData triggered');

    const product =
      document.querySelector('h1, .product-title')?.innerText?.trim() || '';

    const description =
      document.querySelector('.product-description, #productDescription')?.innerText?.trim() ||
      '';

    // 🔥 Broaden selectors to capture most review blocks
    const reviews = Array.from(
      document.querySelectorAll(
        '.review-text-content span, .review-text, .a-size-base.review-text, [data-hook="review-body"]'
      )
    )
      .map((el) => el.innerText.trim())
      .filter(Boolean);

    console.log('[content.js] Extracted reviews:', reviews.length);
    sendResponse({ product, description, reviews });

    // ✅ Keep message channel open until sendResponse fires
    return true;
  }
});
