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
            
            # Nettoyage et décodage de la base64
            encoded_image = post_data['image']
            if "," in encoded_image:
                encoded_image = encoded_image.split(",")[1]
            
            image_data = base64.b64decode(encoded_image)
            img = Image.open(io.BytesIO(image_data))
            
            # Conversion en RGB (pour éviter les bugs avec le format PNG/HEIC)
            if img.mode != 'RGB':
                img = img.convert('RGB')

            # Redimensionnement automatique pour l'IA (max 1024px)
            img.thumbnail((1024, 1024))

            # Config Gemini
            api_key = os.environ.get("GEMINI_API_KEY")
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')

            prompt = "Analyse cette photo d'aliments. Donne une liste de 10 plats simples. Réponds UNIQUEMENT en JSON : ['Plat 1', 'Plat 2']"
            response = model.generate_content([prompt, img])
            
            # Extraction propre du JSON
            res_text = response.text.strip()
            if "```json" in res_text:
                res_text = res_text.split("```json")[1].split("```")[0].strip()
            elif "```" in res_text:
                res_text = res_text.split("```")[1].strip()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(res_text.encode())

        except Exception as e:
            # On log l'erreur exacte dans Vercel pour ne plus deviner
            print(f"CRASH LOG: {str(e)}")
            self.send_response(200) # On force 200 pour éviter le blocage 500
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(["Oups, l'IA a eu un petit bug !"]).encode())
