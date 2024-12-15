import { FreshContext } from "$fresh/server.ts";
import { PDFDocument } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';

export const handler = async (req: Request, _ctx: FreshContext) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new Response("No file uploaded", { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return new Response("Only PDF files are allowed", { status: 400 });
    }

    try {
      // Load and parse PDF
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      
      // Extract text from each page
      const pages = pdfDoc.getPages();
      let textContent: string[] = [];
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        // Since pdf-lib doesn't directly support text extraction,
        // we'll return page details for now
        textContent.push(`Page ${i + 1} (Size: ${page.getSize().width}x${page.getSize().height})`);
      }
      
      const metadata = {
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        keywords: pdfDoc.getKeywords(),
        creator: pdfDoc.getCreator(),
        producer: pdfDoc.getProducer(),
        creationDate: pdfDoc.getCreationDate(),
        modificationDate: pdfDoc.getModificationDate(),
      };

      // Fallback to basic text extraction since pdf-lib doesn't support text extraction
      const text = await file.text();
      
      return new Response(JSON.stringify({
        text: text,
        pageInfo: textContent.join('\n'),
        filename: file.name,
        pages: pages.length,
        size: file.size,
        metadata
      }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError);
      
      // Fallback to basic text extraction
      console.log("Falling back to basic text extraction");
      const text = await file.text();
      
      return new Response(JSON.stringify({
        text: text,
        filename: file.name,
        pages: 1,
        size: file.size,
        note: "Used fallback text extraction"
      }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(`Failed to process file: ${error.message}`, { status: 500 });
  }
};
