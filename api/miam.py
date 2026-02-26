from http.server import BaseHTTPRequestHandler
import google.generativeai as genai
import json
import base64
import os
from PIL import Image
import io

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = json.loads(self.rfile.read(content_length))
            
            # Décodage de l'image
            header, encoded = post_data['image'].split(",", 1)
            image_data = base64.b64decode(encoded)
            img = Image.open(io.BytesIO(image_data))

            # Configuration avec le modèle le plus récent et rapide
            genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
            model = genai.GenerativeModel('gemini-1.5-flash')

            prompt = "Analyse cette photo de frigo. Liste 10 plats simples. Réponds UNIQUEMENT en JSON : ['Plat 1', 'Plat 2']"
            response = model.generate_content([prompt, img])
            
            # Nettoyage de la réponse pour extraire le JSON
            res_text = response.text.strip()
            if "```json" in res_text:
                res_text = res_text.split("```json")[1].split("```")[0].strip()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(res_text.encode())

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())
