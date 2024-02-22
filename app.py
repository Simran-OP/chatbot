from flask import Flask, render_template, request, jsonify
import os, sys, requests, json
from random import randint

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('chat.html')


@app.route("/get", methods=["POST"])
def chat():
    data = request.get_json()
    # print("Received JSON Data:", data)
    text = data.get("msg") if data else None
    # print("Text:", text)
    if text:
        response = extract(text)
        msg2 = {"answer": response}
        return jsonify(msg2)
    else:
        return jsonify({"error": "No message received"})


def extract(text):
    payload = json.dumps({"sender": "Rasa", "message": text})
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    response = requests.request("POST", url="http://localhost:5005/webhooks/rest/webhook", headers=headers, data=payload)
    # print(response)
    # return response.text
    response = response.json()
    resp = []
    for i in range(len(response)):
        try:
            resp.append(response[i]['text'])
        except:
            continue
    result = resp
    print(result)
    return result
    # return render_template('index.html', result=result, text=text)


if __name__ == "__main__":
    app.run(debug=True)
