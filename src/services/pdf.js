import BlobStream from "blob-stream";
import PDFDocument from "pdfkit";
import qr from "qr-image";

import fs from "fs"

export const generatePDF = (name, address, qrCodeContent, callback) => {
	// Crie um novo documento PDF
	const doc = new PDFDocument();
	const stream = doc.pipe(BlobStream());

	// Defina o tamanho da página
	const docWidth = 595
	const logoSize = 150
	const qrCodeSize = 200
	const center = Math.round(docWidth / 2)

	const image = './src/assets/image/rotasLogo.png';
	doc.image(image, center - (logoSize/2), 15, {
		fit: [logoSize, logoSize], 
		align: 'center', 
		valign: 'center'
	})

	doc.moveDown(12);

	doc.fontSize(16);
	doc.font('Helvetica-Bold');
	doc.text('Escaneie o QRCode abaixo', {
		align: 'center'
	});

	doc.moveDown(2)

	const qrCode = qr.imageSync(qrCodeContent, { type: 'png'});
	doc.image(qrCode, center - (qrCodeSize/2), undefined, {
		fit: [qrCodeSize, qrCodeSize], 
		align: 'center', 
		valign: 'center'
	})

	doc.moveDown(10)
	
	doc.fontSize(12);
	doc.text(`Nome do Cliente: ${name}`, { align: 'left' });
	doc.text(`Endereço: ${address}`, { align: 'left' });
	
	doc.end();

	stream.on('finish', async function () {
		const blob = stream.toBlob('application/pdf');
		const arrayBuffer = await blob.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		
		callback(buffer)
	})
}

export const generateRoutePDF = (json) => {
	// Nome do arquivo JSON
	const filename = 'output/output_22-04-2024.json';
	// Dia para o qual você deseja gerar o PDF
	const dia = 'Quarta-feira';

	criarPDF(json, dia)
}


// Função para criar o PDF com as rotas do dia especificado
function criarPDF(dados, dia) {
    const doc = new PDFDocument();
    const outputFilename = `rotas_${dia}.pdf`;

    doc.pipe(fs.createWriteStream(outputFilename));

    // Adiciona um título ao PDF
    doc.fontSize(20).text(`Rotas para ${dia}`, { align: 'center' });
    doc.moveDown();

    // Adiciona as rotas ao PDF
    const rotasDoDia = dados.route;
    if (rotasDoDia) {
        const rotas = rotasDoDia[dia];
        if (rotas) {
            for (const [veiculo, rota] of Object.entries(rotas)) {
                doc.fontSize(16).text(`${veiculo}:`, { continued: true });
                doc.fontSize(12).text(JSON.stringify(rota));
                doc.moveDown();
            }
        } else {
            doc.text('Nenhuma rota encontrada para este dia.');
        }
    } else {
        doc.text('Nenhuma informação de rota disponível.');
    }

    doc.end();
    console.log(`PDF gerado com sucesso: ${outputFilename}`);
}
