#! /usr/bin/env python3
from flask import (Flask,
                   render_template,
                   url_for,
                   request)
from database import Participant

parsapp = Flask(__name__)


@parsapp.route('/')
def index():
    variables = {}
    return render_template('index.html', **variables)


@parsapp.route('/post/', methods=['POST'])
def post():
    print(request.form)
    return 'Yes'

if __name__ == '__main__':
    parsapp.run(debug=True)
