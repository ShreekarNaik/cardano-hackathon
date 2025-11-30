import JSZip from "jszip";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { MOCK_LOGS } from "./mockData";

const generatePDF = (content: {
  title: string;
  question: string;
  answer: string;
  cost: string;
}): Blob => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(content.title, 20, 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Cost: ${content.cost}`, 20, 30);

  doc.setFontSize(12);
  doc.text("Question:", 20, 45);
  doc.setFontSize(11);
  doc.text(doc.splitTextToSize(content.question, 170), 20, 52);

  doc.setFontSize(12);
  doc.text("Answer:", 20, 80);
  doc.setFontSize(11);
  doc.text(doc.splitTextToSize(content.answer, 170), 20, 87);

  return doc.output("blob") as Blob;
};

export const downloadReportZip = async () => {
  const zip = new JSZip();

  const question = "Estimate how many grains of sand are there on Earth?";
  const answer =
    "The estimated number of grains of sand on Earth is about 7.5 x 10^18 (7.5 quintillion), based on coastline length, beach volume, and grain density.";

  const pdf = generatePDF({
    title: "DecentralAI Analytics Report",
    question,
    answer,
    cost: "5 ADA",
  });
  zip.file("report.pdf", pdf);

  const logs = MOCK_LOGS.map(
    (l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`
  ).join("\n");

  zip.file("agent_logs.txt", logs);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "agent_report.zip");
};
