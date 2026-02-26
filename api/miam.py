from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # 1. Lecture des données envoyées par ton site
            content_length = int(self.headers['Content-Length'])
            post_data = json.loads(self.rfile.read(content_length))
            
            # 2. Nettoyage de l'image base64
            base64_image = post_data['image']
            if "," in base64_image:
                base64_image = base64_image.split(",")[1]
            
            # 3. Vérification de la clé
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("La clé GEMINI_API_KEY est introuvable sur Vercel.")

            # 4. Connexion DIRECTE à Google (sans passer par leur package bugué)
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            
            payload = {
                "contents": [{
                    "parts": [
                        {"text": "Analyse cette photo. Liste 10 plats simples. Réponds UNIQUEMENT en JSON strict comme ceci: [\"Plat 1\", \"Plat 2\"]"},
                        {"inline_data": {
                            "mime_type": "image/jpeg",
                            "data": base64_image
                        }}
                    ]
                }]
            }
            
            # 5. Envoi de la requête
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                
            # 6. Extraction de la réponse
            text_response = result['candidates'][0]['content']['parts'][0]['text'].strip()
            
            # 7. Nettoyage du JSON
            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0].strip()
            elif "```" in text_response:
                text_response = text_response.split("```")[1].strip()
            
            # 8. Renvoi au site
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(text_response.encode('utf-8'))

        except urllib.error.HTTPError as e:
            error_msg = e.read().decode('utf-8')
            self.send_error_msg(f"Erreur API Google : {e.code} - {error_msg}")
        except Exception as e:
            self.send_error_msg(f"Erreur technique : {str(e)}")

    def send_error_msg(self, msg):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps([f"❌ {msg}"]).encode('utf-8'))    self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps([f"❌ Erreur IA : {str(e)}"]).encode())
