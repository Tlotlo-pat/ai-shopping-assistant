// ai.js — Chrome built-in AI integration (Translator + Summarizer + Rewriter)
// Requires Chrome 138+ with "Built-in AI" features enabled (chrome://flags)

// ---- TRANSLATOR ----
export async function translateText(text, targetLang = 'en') {
  try {
    if (!('Translator' in self)) {
      return '[Chrome Built-in Translator API not supported in this browser]';
    }

    const sourceLang = 'en'; // you can change this if needed (e.g., 'auto' is invalid)

    const availability = await Translator.availability({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    });

    console.log(`Translator availability: ${availability}`);

    if (availability === 'unavailable') {
      return '[Translator model unavailable. Try Chrome 138+ with AI features enabled.]';
    }

    const translator = await Translator.create({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Translator model downloaded: ${(e.loaded * 100).toFixed(2)}%`);
        });
      },
    });

    const result = await translator.translate(text);
    console.log('Translation complete:', result);
    return result;
  } catch (err) {
    console.error('[Translator Error]', err);
    return `[Translation error]: ${err.message}`;
  }
}

// ---- SUMMARIZER ----
export async function summarizeReviews(reviews) {
  if (!('Summarizer' in self)) {
    console.warn('Summarizer API not supported in this browser.');
    return 'Summarizer not supported.';
  }

  try {
    // Join reviews with spacing
    const text = reviews.join('\n\n');

    // Split into manageable chunks (~4000 chars)
    const chunks = [];
    let currentChunk = '';

    for (const review of reviews) {
      if ((currentChunk + review).length > 4000) {
        chunks.push(currentChunk);
        currentChunk = review;
      } else {
        currentChunk += '\n\n' + review;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    console.log(`[ai.js] Summarizing ${chunks.length} chunks...`);

    const summarizer = await Summarizer.create({ type: 'tldr', format: 'plain-text' });
    const partialSummaries = [];

    for (const [i, chunk] of chunks.entries()) {
      console.log(`[ai.js] Summarizing chunk ${i + 1}/${chunks.length} (length=${chunk.length})`);
      const summary = await summarizer.summarize(chunk, {
        context: 'Summarizing product reviews for online shopping.',
      });
      partialSummaries.push(summary);
    }

    // Combine all partial summaries into a final short summary
    const combinedText = partialSummaries.join('\n\n');
    const finalSummary = await summarizer.summarize(combinedText, {
      context: 'Create a concise final summary from multiple partial summaries.',
    });

    return finalSummary;
  } catch (err) {
    console.error('[Summarizer Error]', err);
    return 'Error summarizing reviews.';
  }
}


// ---- REWRITER ----
export async function rewriteQuery(query) {
  try {
    if (!('Rewriter' in self)) {
      console.warn('Rewriter API not supported yet — using mock rewrite.');
      return `[Optimized Query]: ${query}`;
    }

    const rewriter = await Rewriter.create({
      style: 'optimized',
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Rewriter model downloaded: ${(e.loaded * 100).toFixed(2)}%`);
        });
      },
    });

    const rewritten = await rewriter.rewrite(query);
    console.log('Rewritten query:', rewritten);
    return rewritten;
  } catch (err) {
    console.error('[Rewriter Error]', err);
    return `[Rewrite error]: ${err.message}`;
  }
}
