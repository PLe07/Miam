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
            
            encoded_image = post_data['image']
            if "," in encoded_image:
                encoded_image = encoded_image.split(",")[1]
            
            image_data = base64.b64decode(encoded_image)
            img = Image.open(io.BytesIO(image_data))

            api_key = os.environ.get("GEMINI_API_KEY")
            # Utilisation explicite de la version stable pour éviter l'erreur 404
            genai.configure(api_key=api_key)
            
         # Remplace la ligne existante par celle-ci pour forcer la version stable
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

            prompt = "Regarde ces ingrédients. Donne 10 plats. Réponds UNIQUEMENT en JSON : ['Plat 1', 'Plat 2']"
            response = model.generate_content([prompt, img])
            
            res_text = response.text.strip()
            if "```json" in res_text:
                res_text = res_text.split("```json")[1].split("```")[0].strip()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(res_text.encode())

        except Exception as e:
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps([f"❌ Erreur Google : {str(e)}"]).encode())
