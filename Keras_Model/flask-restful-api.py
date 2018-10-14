from flask import Flask, request
from flask_restful import Resource, Api
from classifier import keras_model

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

api.add_resource(Classifier, '/')

if __name__ == '__main__':
  app.run(debug=True)