from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from tkinter import Tk

app = Flask(__name__)
api = Api(app)

class Classifier(Resource):
  def get(self):
    return {
      'Message': 'Image Received and Processed.',
      'Cost': '397',
      'RepairType': 'Body'
    }, 200

api.add_resource(Classifier, '/')

if __name__ == '__main__':
  app.run(debug=True)

