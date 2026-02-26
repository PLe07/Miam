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
            
            # Décodage de la photo envoyée par le script JS
            encoded_image = post_data['image']
            if "," in encoded_image:
                encoded_image = encoded_image.split(",")[1]
            
            image_data = base64.b64decode(encoded_image)
            img = Image.open(io.BytesIO(image_data))

            # Configuration de la clé API
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                return self.send_error_msg("Clé API introuvable sur Vercel")

            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')

            # Demande à l'IA
            prompt = "Regarde ces aliments. Donne 10 idées de plats simples. Réponds UNIQUEMENT en JSON : ['Plat 1', 'Plat 2']"
            response = model.generate_content([prompt, img])
            
            # Si Google répond avec du texte
            if response.text:
                res_text = response.text.strip()
                if "```json" in res_text:
                    res_text = res_text.split("```json")[1].split("```")[0].strip()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(res_text.encode())
            else:
                self.send_error_msg("Google n'a pas pu analyser cette image.")

        except Exception as e:
            # On envoie l'erreur réelle pour pouvoir la corriger
            self.send_error_msg(f"Erreur technique : {str(e)}")

    def send_error_msg(self, msg):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        # On envoie un format que le JS comprend mais qui contient l'erreur
        self.wfile.write(json.dumps([f"❌ {msg}"]).encode())
