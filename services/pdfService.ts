import { jsPDF } from 'jspdf';
import { Message } from '../types';
import { Translations } from '../translations';

export const pdfService = {
    generateConsultationReport: async (messages: Message[], t: Translations, username: string) => {
        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        // Header Branding
        doc.setFillColor(8, 145, 178); // Cyan-600
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('DOCTOR IA PRO', margin, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(t.integratedMedSystem, margin, 32);
        doc.text('Powered by IA.AGUS', 150, 25);

        y = 50;

        // Report Metadata
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(t.medicalReport, margin, y);
        y += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha: ${new Date().toLocaleString()}`, margin, y);
        doc.text(`Paciente: ${username}`, 120, y);
        y += 15;

        // Content
        messages.forEach((msg) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(msg.role === 'assistant' ? 8 : 60, msg.role === 'assistant' ? 145 : 60, msg.role === 'assistant' ? 178 : 60);
            const roleText = msg.role === 'assistant' ? t.doctor : t.user;
            doc.text(`${roleText}:`, margin, y);
            y += 7;

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            const splitText = doc.splitTextToSize(msg.content, 170);
            doc.text(splitText, margin, y);
            y += (splitText.length * 5) + 10;
        });

        // Disclaimer
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, 190, y);
        y += 10;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        const splitDisclaimer = doc.splitTextToSize(t.disclaimer, 170);
        doc.text(splitDisclaimer, margin, y);

        // Footer Signature
        y += 20;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('__________________________', 120, y);
        y += 5;
        doc.text('IA.AGUS MEDICAL CORE', 120, y);
        doc.setFont('helvetica', 'normal');
        doc.text('Digital Signature Verified', 120, y + 5);

        doc.save(`Consulta_IA_AGUS_${Date.now()}.pdf`);
    },

    generatePrescription: (data: any, returnBlob: boolean = false) => {
        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        // --- Professional White Background Design ---

        // 1. Header
        doc.setFontSize(22);
        doc.setTextColor(8, 145, 178); // Cyan-600 (Professional Medical Blue/Cyan)
        doc.setFont('helvetica', 'bold');
        doc.text('RECETA MÉDICA', margin, 25);

        // Sidebar/Logo accent
        doc.setLineWidth(1);
        doc.setDrawColor(8, 145, 178);
        doc.line(margin, 30, 40, 30); // Underline title

        // Doctor Info (Right Aligned)
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81); // Gray-700
        doc.setFont('helvetica', 'bold');
        doc.text('DOCTOR IA PRO', 190, 20, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128); // Gray-500
        doc.text('Medicina Integral & Longevidad', 190, 25, { align: 'right' });
        doc.text('Cédula Profesional: IA-8829-2025', 190, 30, { align: 'right' });
        doc.text('Universidad Nacional de IA', 190, 35, { align: 'right' });

        y = 50;

        // 2. Patient Info (Clean Box)
        doc.setDrawColor(229, 231, 235); // Gray-200
        doc.setFillColor(249, 250, 251); // Gray-50 (Very light gray bg for box)
        doc.roundedRect(margin, y - 5, 170, 25, 2, 2, 'FD');

        doc.setFontSize(10);
        doc.setTextColor(31, 41, 55); // Gray-800

        // Row 1
        doc.setFont('helvetica', 'bold');
        doc.text('PACIENTE:', margin + 5, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.text(data.patientName, margin + 30, y + 5);

        doc.setFont('helvetica', 'bold');
        doc.text('FECHA:', 130, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.text(data.date, 150, y + 5);

        // Row 2
        doc.setFont('helvetica', 'bold');
        doc.text('DIAGNÓSTICO:', margin + 5, y + 15);
        doc.setFont('helvetica', 'normal');
        doc.text(data.diagnosis || 'Reservado', margin + 35, y + 15);

        y += 40;

        // 3. Medications Table
        // Headers
        doc.setFontSize(9);
        doc.setTextColor(8, 145, 178);
        doc.setFont('helvetica', 'bold');
        doc.text('MEDICAMENTO / SUSTANCIA', margin, y);
        doc.text('DOSIS', margin + 70, y);
        doc.text('FRECUENCIA', margin + 100, y);
        doc.text('DURACIÓN', margin + 135, y);

        y += 3;
        doc.setDrawColor(8, 145, 178);
        doc.setLineWidth(0.5);
        doc.line(margin, y, 190, y); // Header line
        y += 8;

        // List
        doc.setTextColor(31, 41, 55);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        data.medications.forEach((med: any) => {
            doc.text(med.name, margin, y);
            doc.text(med.dosage, margin + 70, y);
            doc.text(med.frequency, margin + 100, y);
            doc.text(med.duration, margin + 135, y);
            y += 10;
        });

        // 4. Instructions
        y = Math.max(y + 10, 180); // Ensure minimum spacing or push to bottom section

        doc.setFontSize(9);
        doc.setTextColor(8, 145, 178);
        doc.setFont('helvetica', 'bold');
        doc.text('INDICACIONES GENERALES', margin, y);
        y += 3;
        doc.line(margin, y, 190, y);
        y += 7;

        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        const splitInstructions = doc.splitTextToSize(data.instructions, 170);
        doc.text(splitInstructions, margin, y);

        // 5. Footer & Branding
        const pageHeight = doc.internal.pageSize.height;
        y = pageHeight - 40;

        // Signature Line
        doc.setDrawColor(156, 163, 175); // Gray-400
        doc.line(75, y, 135, y); // Center line

        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);
        doc.setFont('helvetica', 'bold');
        doc.text('DR. AGUSTÍN (IA CORE)', 105, y + 5, { align: 'center' });

        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128); // Gray-500
        doc.setFont('helvetica', 'normal');
        doc.text('MEDICINA INTEGRATIVA & SALUD OCUPACIONAL', 105, y + 10, { align: 'center' });

        // Branding
        y = pageHeight - 15;
        doc.setFontSize(7);
        doc.setTextColor(8, 145, 178); // Cyan branding
        doc.text('POWERED BY IA.AGUS - www.ia-agus.com', 105, y, { align: 'center' });

        // QR Code Placeholder (Simulated)
        doc.setDrawColor(200);
        doc.rect(20, pageHeight - 35, 20, 20); // Bottom left
        doc.setFontSize(6);
        doc.setTextColor(150);
        doc.text('VERIFICACIÓN', 30, pageHeight - 20, { align: 'center' });

        if (returnBlob) {
            return doc.output('bloburl');
        } else {
            doc.save(`Receta_${data.patientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
        }
    },

    generateScanReport: (data: any) => {
        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        // Header
        doc.setFontSize(22);
        doc.setTextColor(8, 145, 178);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORTE DERMATOLÓGICO & FACIAL', margin, 25);
        doc.setFontSize(10);
        doc.text('ANÁLISIS DE FENOTIPADO DIGITAL - IA.AGUS', margin, 32);

        // Simulated Logo/Icon 
        // doc.addImage("...", "PNG", 180, 15, 15, 15);

        y = 50;

        // Image
        if (data.capturedImage) {
            try {
                // Keep aspect ratio roughly, max height 60
                doc.addImage(data.capturedImage, 'JPEG', margin, y, 60, 60);

                // Add overlay text next to image
                doc.setTextColor(50);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('ANÁLISIS BIOMÉTRICO:', margin + 70, y + 10);

                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.text(`• VFC (Variabilidad Cardiaca): ${data.hrv} ms`, margin + 75, y + 20);
                doc.text(`• Nivel de Cortisol Estimado: ${data.cortisolLevel} µg/dL`, margin + 75, y + 28);
                doc.text(`• Dominancia Simpática: ${data.sympatheticDominance}%`, margin + 75, y + 36);
                doc.text(`• Autenticidad Emocional: ${data.authenticity}`, margin + 75, y + 44);

                y += 70;
            } catch (e) {
                console.error("Error adding image to PDF", e);
                y += 10;
            }
        }

        // Dermatological Analysis Section
        doc.setFillColor(240, 250, 255);
        doc.rect(margin, y, 170, 10, 'F');
        doc.setTextColor(0, 100, 150);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('HALLAZGOS DERMATOLÓGICOS', margin + 5, y + 7);
        y += 20;

        doc.setTextColor(30);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Salud Integral de la Piel (Score): ${data.skinHealth}/100`, margin, y);
        y += 10;

        if (data.agingSigns) {
            doc.text(`Signos de Envejecimiento:`, margin, y);
            doc.setFont('helvetica', 'normal');
            doc.text(`• Severidad de Arrugas: ${data.agingSigns.wrinkles_severity}`, margin + 10, y + 6);
            doc.text(`• Edad Aparente Estimada: ${data.agingSigns.apparent_age} años`, margin + 10, y + 12);
            y += 20;
        }

        if (data.healthFlags && data.healthFlags.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(180, 50, 50); // Red warn
            doc.text('ALERTAS VISUALES DE SALUD DETECTADAS:', margin, y);
            y += 7;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50);
            data.healthFlags.forEach((flag: string) => {
                doc.text(`• ${flag}`, margin + 10, y);
                y += 6;
            });
            y += 10;
        } else {
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100);
            doc.text('No se detectaron alertas visibles significativas en este escaneo.', margin, y);
            y += 15;
        }

        // DisclaimerBox
        y = Math.max(y, 220);
        doc.setDrawColor(200, 200, 0);
        doc.setFillColor(255, 255, 240);
        doc.rect(margin, y, 170, 25, 'FD');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 0);
        const disclaimer = "AVISO IMPORTANTE: Este análisis es generado por Inteligencia Artificial y no constituye un diagnóstico médico. Los resultados deben ser interpretados por un profesional de la salud. La detección de posibles problemas de salud es solo referencial.";
        const splitDisclaimer = doc.splitTextToSize(disclaimer, 160);
        doc.text(splitDisclaimer, margin + 5, y + 5);

        // Footer Brand
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(8, 145, 178);
        doc.text('POWERED BY IA.AGUS - www.ia-agus.com', 105, pageHeight - 10, { align: 'center' });

        doc.save(`Reporte_Facial_${Date.now()}.pdf`);
    }
};
