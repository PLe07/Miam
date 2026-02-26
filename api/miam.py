from http.server import BaseHTTPRequestHandler
import google.generativeai as genai
import json, base64, os, io
from PIL import Image

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = json.loads(self.rfile.read(content_length))
            
            # Décodage image
            encoded = post_data['image'].split(",")[1] if "," in post_data['image'] else post_data['image']
            img = Image.open(io.BytesIO(base64.b64decode(encoded)))
            img.thumbnail((512, 512)) # On réduit encore pour la vitesse

            # Connexion stable
            genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
            model = genai.GenerativeModel("gemini-1.5-flash")

            # Demande simplifiée
            prompt = "Analyse cette photo. Liste 10 plats simples. Réponds UNIQUEMENT en JSON : ['Plat 1', 'Plat 2']"
            response = model.generate_content([prompt, img])
            
            # Nettoyage JSON strict
            res_text = response.text.strip()
            if "```" in res_text:
                res_text = res_text.split("```")[1].replace("json", "").strip()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(res_text.encode())

        except Exception as e:
            self.send_response(200) # On envoie 200 pour que le JS puisse lire l'erreur
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps([f"❌ Erreur : {str(e)}"]).encode())
