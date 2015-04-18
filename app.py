from flask import Flask, render_template, request, jsonify, Response, json
import requests
import json
import random
from datetime import date
from topia.termextract import extract
extractor = extract.TermExtractor()
extractor.filter = extract.permissiveFilter

app = Flask(__name__)

SESSION_KEY = '1a8e8847e3e529483560271d39c0656c35219f4ed8ea54ba8b07159e089e4755hackathon1'

@app.route('/data', methods=['GET', 'POST'])
def obtainData():

    print request.method

    if request.method == 'GET':
        r_buzzes = requests.get('http://www.buzzfeed.com/buzzfeed/api/buzzes?since=1426824000&until=1429329600&session_key=' + SESSION_KEY)
        r_buzzes_json = r_buzzes.json()

        data = [[buzz['id'], buzz['username'], buzz['uri'], buzz['title']] for buzz in r_buzzes_json['buzzes']]
        random.shuffle(data)
        comments = []
        title = ''
        url = ''

        for d in data:
            r_comments = requests.get('http://www.buzzfeed.com/buzzfeed/api/comments?buzz_id='+d[0]+'&type=contributions&session_key='+SESSION_KEY)
            r_comments_json = r_comments.json()
            # get first article to exceed 10 comments
            if r_comments_json['count'] > 10:
                url = "http://www.buzzfeed.com/%s/%s" % (d[1], d[2])
                title = d[3]
                comments = [comment['blurb'].replace('&#39;', '\'') for comment in r_comments_json['comments']]
                break

        tag_cloud = []
        extract = ' '.join(comments)
        tags = extractor(extract)
        for tag in tags:
            word_dict = {}
            word_dict['text'] = tag[0]
            word_dict['size'] = tag[1] + tag[2]
            tag_cloud.append(word_dict)

        r = requests.get('https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q='+title)
        json_data = r.json()
        img = json_data['responseData']['results'][0]['unescapedUrl']

        data = {
            'cloud': tag_cloud, 'title': title, 'url': url, 'img': img
        }

        print json.dumps(data)
        # return jsonify(data=data)

        return Response(json.dumps(data), mimetype='application/json')

        # json_data = {'cloud': tag_cloud, 'title': title, 'url': url}
        # return Response(json.dumps(json_data), mimetype='application/json')


    # title = "Rick Perry Invites Conservative Journalists To Off-The-Record Happy Hour"
    # r = requests.get('https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q='+title)
    # json_data = r.json()
    # img = json_data['responseData']['results'][0]['unescapedUrl']
    # return render_template('index.html', img=img)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)