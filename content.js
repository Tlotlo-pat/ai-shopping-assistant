chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getProductData') {
    console.log('[content.js] getProductData triggered');

    const product =
      document.querySelector('h1, .product-title')?.innerText?.trim() || '';

    const description =
      document.querySelector('.product-description, #productDescription')?.innerText?.trim() || '';

    // Try common e-commerce selectors + Tailwind-friendly fallback
    const reviews = Array.from(
      document.querySelectorAll(
        `
        .review-text-content span,
        .review-text,
        .a-size-base.review-text,
        [data-hook="review-body"],
        [class*="review"],
        [class*="Review"],
        [class*="comment"],
        [class*="testimonial"],
        p.text-gray-600,
        p.text-sm
        `
      )
    )
      .map((el) => el.innerText.trim())
      .filter((t) => t.length > 20); // ignore short junk like “Good”

    console.log('[content.js] Extracted reviews:', reviews.length);
    sendResponse({ product, description, reviews });

    return true;
  }
});
