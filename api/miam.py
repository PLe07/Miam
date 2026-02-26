from http.server import BaseHTTPRequestHandler
import json
import os
import requests

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = json.loads(self.rfile.read(content_length))
            
            # 1. Préparation de l'image
            base64_image = post_data['image']
            if "," in base64_image:
                base64_image = base64_image.split(",")[1]
            
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                self.send_error_msg("Clé API manquante sur Vercel.")
                return

            # 2. Appel direct à Google sans leur librairie buguée
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [{
                    "parts": [
                        {"text": "Liste 10 plats simples avec ces aliments. Réponds UNIQUEMENT en format JSON strict : [\"Plat 1\", \"Plat 2\"]"},
                        {"inline_data": {
                            "mime_type": "image/jpeg",
                            "data": base64_image
                        }}
                    ]
                }]
            }
            
            # 3. Sécurité : On coupe à 8 secondes (Vercel crashe à 10s)
            r = requests.post(url, json=payload, headers={'Content-Type': 'application/json'}, timeout=8)
            
            if r.status_code != 200:
                self.send_error_msg(f"Refus de Google ({r.status_code}): {r.text[:50]}...")
                return
                
            result = r.json()
            text_response = result['candidates'][0]['content']['parts'][0]['text'].strip()
            
            # 4. Nettoyage
            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0].strip()
            elif "```" in text_response:
                text_response = text_response.split("```")[1].strip()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(text_response.encode('utf-8'))

        except Exception as e:
            # S'il y a un bug, on l'envoie au téléphone !
            self.send_error_msg(f"Détail du crash : {str(e)}")

    def send_error_msg(self, msg):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps([f"❌ {msg}"]).encode('utf-8'))
