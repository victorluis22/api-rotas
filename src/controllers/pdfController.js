import { retrieveJSONBucket } from "../services/json.js";
import { generateRoutePDF } from "../services/pdf.js";

class pdfController {
	async generatePDF(req, res) {
                const json = await retrieveJSONBucket("all");

                const pdf = generateRoutePDF(json);

                return res.status(200)
	}

	
}

export default new pdfController();
