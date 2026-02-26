from http.server import BaseHTTPRequestHandler
import google.generativeai as genai
import json
import base64
import os
from PIL import Image
import io

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Lecture des données envoyées par le site
        content_length = int(self.headers['Content-Length'])
        post_data = json.loads(self.rfile.read(content_length))
        
        # Décodage de la photo
        image_data = base64.b64decode(post_data['image'].split(',')[1])
        img = Image.open(io.BytesIO(image_data))

        # Connexion à l'IA avec ta clé secrète Vercel
        genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Instruction pour l'IA
        prompt = "Analyse cette photo de frigo. Donne une liste de 10 plats simples faisables avec ces ingrédients. Réponds UNIQUEMENT sous forme de liste JSON : ['Plat 1', 'Plat 2']"
        
        response = model.generate_content([prompt, img])
        
        # Nettoyage pour ne garder que le JSON
        clean_res = response.text.replace('```json', '').replace('```', '').strip()

        # Envoi de la réponse au site
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(clean_res.encode())
