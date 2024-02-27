from flask import Flask, render_template, request, jsonify
import requests
import json

# creating the flask app
app = Flask(__name__)


# main route that renders home page of bot
@app.route('/')
def home():
    return render_template('chat.html')

# Ui hosting on server
# if __name__ == '__main__':
#     app.run(debug=True, host='pssi-abhikverm')


# connected when user has typed
@app.route("/get", methods=["POST"])
def chat():
    data = request.get_json()
    # msg is the dictionary key in json that has the user message
    text = data.get("msg") if data else None
    # if text is not empty
    if text:
        # extract function is called
        response = extract(text)
        # the response received is put as dictionary for processing in the javascript file
        msg2 = {"answer": response}
        # msg2 goes to js
        return jsonify(msg2)
    else:
        return jsonify({"error": "No message received"})


def extract(text):
    # rasa template code
    payload = json.dumps({"sender": "Rasa", "message": text})
    # header data is received
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    # with post method the port of rasa is called and text as params is given
    response = requests.request("POST", url="http://pssi-abhikverm:6000/webhooks/rest/webhook", headers=headers,
                                data=payload)
    # the response goes tojson format
    response = response.json()
    # response with have multiple header
    # we only need text data out of it
    resp = []
    for i in range(len(response)):
        try:
            # response is appended
            resp.append(response[i]['text'])
        except:
            continue
    #         text is retrieved
    result = resp
    # response goes to chat method.
    return result
    # return render_template('index.html', result=result, text=text)


if __name__ == "__main__":
    app.run(debug=True)
    # app.run(debug=True, host='pssi-abhikverm')
