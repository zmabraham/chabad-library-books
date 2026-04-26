const fs = require('fs');

// Check what we actually have
const pdfModule = require('pdf-parse');
console.log('pdf-parse exports:', Object.keys(pdfModule).slice(0, 5));

// The default export might be the function
const pdfParse = pdfModule.default || pdfModule.PDFParse;

async function extractPDF() {
  const dataBuffer = fs.readFileSync('pdf/Undaunted.pdf');
  
  try {
    // Try as a function
    let data;
    if (typeof pdfParse === 'function') {
      data = await pdfParse(dataBuffer);
    } else if (typeof pdfParse === 'class' || pdfParse.prototype) {
      const parser = new pdfParse();
      data = await parser.parse(dataBuffer);
    } else {
      throw new Error('Unknown pdf-parse format');
    }
    
    console.log(`✓ PDF has ${data.numpages} pages`);
    
    fs.mkdirSync('corpus', { recursive: true });
    fs.writeFileSync('corpus/full_text.txt', data.text);
    
    console.log('✓ Extracted full text to corpus/full_text.txt');
    console.log(`  Text length: ${data.text.length} characters`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

extractPDF();
