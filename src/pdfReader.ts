import fs from 'fs';
import pdf from 'pdf-parse';

export async function extractPdfText(pdfPath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text; // Returns extracted text from the PDF
}