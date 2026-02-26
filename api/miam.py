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
            
            # 1. Décodage sécurisé de l'image
            header, encoded = post_data['image'].split(",", 1)
            image_data = base64.b64decode(encoded)
            img = Image.open(io.BytesIO(image_data))

            # 2. Config IA avec le bon modèle (gemini-1.5-flash)
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("Clé API manquante dans Vercel")
                
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')

            # 3. Prompt optimisé
            prompt = "Analyse cette photo de frigo/ingrédients. Donne une liste de 10 plats simples faisables avec. Réponds UNIQUEMENT sous forme de liste JSON : ['Plat 1', 'Plat 2']"
            
            response = model.generate_content([prompt, img])
            
            # Nettoyage du texte pour ne garder que le JSON
            text_response = response.text.strip()
            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0].strip()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(text_response.encode())

        except Exception as e:
            # Si ça plante, on envoie l'erreur proprement au lieu d'un 500 vide
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
