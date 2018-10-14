from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from classifier import keras_model
import random

app = Flask(__name__)
api = Api(app)
kmodel = keras_model()

class Classifier(Resource):
  def post(self):
    image_json = request.get_json()
    x = kmodel.predict(Resource)
    if x == [0]:
      return { 'status': 'Not Damaged' }, 201
    else:
      return { 'status': 'Damaged' }, 201
  def get(self, param):
    if param == 0:
      ret_val = kmodel.predict([0])
      if ret_val == [0]:
        return jsonify({'cost': 0}), 200  
    elif param == 1:
      ret_val = kmodel.predict([1])
      if ret_val == [1]:
        cost = random.randint(100, 500)
        return jsonify({'cost': cost})
    return { 'Hello World': 'The server is working!' }, 200

api.add_resource(Classifier, '/')
api.add_resource(Classifier, '/learn/<param>')

if __name__ == '__main__':
  app.run(debug=False)