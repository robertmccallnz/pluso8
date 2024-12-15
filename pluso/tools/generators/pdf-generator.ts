import { jsPDF } from "npm:jspdf";

export const helloWorldPDF = async (req: Request) => {
  const doc = new jsPDF();
  doc.text("Hello world!", 10, 10);
  return new Response(doc.output(), {
    headers: { "Content-Type": "application/pdf" },
  });
};